'use server';

import { getSession } from '@/lib/sessionStore';
import { parseGeminiJson } from '@/lib/parseGeminiResponse';

export async function sendAnswer(chatId: string, answer: string) {
  const chat = getSession(chatId);
  if (!chat) throw new Error('Chat session not found');

  const response = await chat.sendMessage(answer);
  const rawText = response?.response?.candidates?.[0]?.content?.parts?.[0]?.text;

  if (!rawText) throw new Error('No content received from Gemini');

  const parsed = parseGeminiJson(rawText);
  return parsed;
}

export async function sendAnswerStory(chatId: string, answer: string) {
  const chat = getSession(chatId);
  if (!chat) throw new Error('Chat session not found');

  const response = await chat.sendMessage(answer);
  const rawText = response?.response?.candidates?.[0]?.content?.parts?.[0]?.text;

  if (!rawText) throw new Error('No content received from Gemini');

  const parsed = parseGeminiJson(rawText);
  return parsed;
}
