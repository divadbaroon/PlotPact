'use server';

import { GoogleGenerativeAI } from '@google/generative-ai';
import { randomUUID } from 'crypto';
import { setSession } from '@/lib/sessionStore';
import { parseGeminiJson } from '@/lib/parseGeminiResponse';

const prompt = `some prompt`;

const prompt2 = `some prompt`;

export async function startChat() {
  const genAI = new GoogleGenerativeAI(
    'AIzaSyDIiDQZ2ZmyyF0ZdFrrbs9mzcj7XzX5Ses'
  );
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

  const chat = model.startChat();
  const chatId = randomUUID();
  setSession(chatId, chat);

  const response = await chat.sendMessage(prompt);
  const rawText =
    response?.response?.candidates?.[0]?.content?.parts?.[0]?.text;

  if (!rawText) throw new Error('No content received from Gemini');

  const parsed = parseGeminiJson(rawText);
  return { ...parsed, chatId };
}

export async function startChatStory() {
  const genAI = new GoogleGenerativeAI(
    'AIzaSyDIiDQZ2ZmyyF0ZdFrrbs9mzcj7XzX5Ses'
  );
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

  const chat = model.startChat();
  const chatId = randomUUID();
  setSession(chatId, chat);

  const response = await chat.sendMessage(prompt2);

  const rawText =
    response?.response?.candidates?.[0]?.content?.parts?.[0]?.text;

  if (!rawText) throw new Error('No content received from Gemini');

  const parsed = parseGeminiJson(rawText);
  
  return { ...parsed, chatId };
}
