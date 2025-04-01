'use server';

import { OpenAI } from 'openai';
import { getSession, updateSession } from '@/lib/sessionStoreNew';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function sendAnswer(chatId: string, userInput: string) {
  const history = getSession(chatId);
  if (!history) throw new Error('Session not found');

  const updated = [...history, { role: 'user', content: userInput }];

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

  updateSession(chatId, [...updated, reply]);

  return parsed;
}
