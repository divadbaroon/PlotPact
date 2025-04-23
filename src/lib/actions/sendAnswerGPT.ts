'use server';

import { OpenAI } from 'openai';
import { getStoryContext, updateStoryContext } from '@/lib/actions/sessionStore';

import { GPTMessage } from "@/types"

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function sendAnswer(chatId: string, userInput: string) {
  // Get the story context from Redis
  const context = await getStoryContext(chatId);
  if (!context) throw new Error('Session not found');

  const systemMessage: GPTMessage[] = context.originalPrompt 
    ? [{ role: 'system', content: context.originalPrompt }] 
    : [];
  
  // Add previous messages based on story content
  const assistantMessages: GPTMessage[] = context.story.map(content => ({
    role: 'assistant',
    content,
  }));

  const userMessages: GPTMessage[] = assistantMessages.length > 0 
    ? new Array(assistantMessages.length).fill('').map((_, index) => ({
        role: 'user',
        content: index === 0 ? context.originalPrompt || 'Start story' : 'Continue',
      }))
    : [];
  
  // Merge all messages in the right order
  const allMessages: GPTMessage[] = [];
  if (systemMessage.length > 0) {
    allMessages.push(systemMessage[0]);
  }
  
  // Interleave user and assistant messages
  for (let i = 0; i < Math.max(userMessages.length, assistantMessages.length); i++) {
    if (i < userMessages.length) allMessages.push(userMessages[i]);
    if (i < assistantMessages.length) allMessages.push(assistantMessages[i]);
  }
  
  // Add the current user input
  const updated: GPTMessage[] = [...allMessages, { role: 'user', content: userInput }];

  const completion = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: updated,
    temperature: 0.8,
  });

  const reply = completion.choices[0].message!;
  const responseText = reply.content ?? '';

  const parsed = JSON.parse(
    responseText
      .trim()
      .replace(/^```json/, '')
      .replace(/```$/, '')
      .trim()
  );

  // Normalize GPT reply
  const normalizedReply = {
    role: reply.role as 'assistant',
    content: reply.content ?? '',
  };
  
  // Update the story context with new content
  const updatedStory = [...context.story, normalizedReply.content];
  
  // Extract choices if available in the parsed response
  const choices = parsed.choices || [];
  
  // Update the story context in Redis
  await updateStoryContext(chatId, {
    story: updatedStory,
    lastChoices: choices,
    lastQuestion: parsed.para || '',
  });

  return parsed;
}