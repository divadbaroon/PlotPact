'use server';

import { GoogleGenerativeAI } from '@google/generative-ai';
import { randomUUID } from 'crypto';
import { setSession } from '@/lib/sessionStore';
import { parseGeminiJson } from '@/lib/parseGeminiResponse';

const prompt = `I want to create a multiple choice game within Gemini, not the canvas but the Gemini chat. The multiple choices need to have one right answer and 3-4 wrong answers. 
For the first reply you will only give a small background of the story. Then pick one next major event and return it. The user will then choose from one of the options. By typing the entire sentence in the chat. There should only be one question at a time.

Design the questions and answers in a way it look like the a story is forming. It should not seem like a quiz. The story progression should be fun and interactive. Only return json output, nothing else.
The json should have either 2 or 3 fields.
Case(right answer): give 3 fields, 'para' - a paragraph that moves the story forward, 'question; - next question and 'choices' - the multiple choices.
Case(wrong answer): give 2 fields, 'question' -  same question but it also should say that the previous answer was wrong in a nice way and 'choices' -  multiple choices.

The story should progress forward and eventually end. After the story, return a json with 1 value 'eos' with some ending text. Try to end the story after about 5 multiple choice questions.

This is the story about a historic event - Apollo 13 mission. Use this: Apollo 13 was the seventh crewed mission in NASA's Apollo space program and the third intended to land on the Moon. Launched on April 11, 1970, the mission's crew included Commander Jim Lovell, Command Module Pilot Jack Swigert, and Lunar Module Pilot Fred Haise. Swigert had replaced original crew member Ken Mattingly just days before launch after Mattingly was exposed to German measles. The mission's goal was to explore the Fra Mauro highlands, a geologically significant region of the Moon. Spirits were high as the Saturn V rocket carried them into space with what seemed like a routine start to another lunar landing mission. However, about 56 hours into the flight, while the crew was performing routine tasks and stirring the oxygen tanks in the Service Module, disaster struck. At 9:08 PM EST on April 13, an explosion rocked the spacecraft. The crew immediately knew something had gone wrong. Jack Swigert famously radioed Mission Control with the now-iconic words, "Houston, we've had a problem." The explosion caused a critical failure in the Service Module's oxygen supply and power systems, putting the entire mission—and the lives of the astronauts—at risk. With their main oxygen and power sources compromised, the crew was forced to abandon plans for a lunar landing. Instead, they moved into the Lunar Module "Aquarius", which was intended to be their Moon lander but now became a lifeboat. The Lunar Module was not designed to support three people for the duration of the return trip to Earth, and it lacked sufficient power, heat, and water. Engineers on the ground scrambled to devise solutions in real-time, including creating a workaround for the carbon dioxide filters. Using only materials onboard like plastic bags, tape, and a hose, they famously instructed the astronauts on how to build a makeshift CO₂ scrubber. 
To return home, Apollo 13 had to follow a free-return trajectory, slingshotting around the Moon to use its gravity to head back toward Earth. Even though they were dangerously close to the Moon's surface, the crew would never land. Instead, they used the Moon's gravity to redirect their crippled spacecraft. While navigating back, the astronauts faced freezing temperatures, dehydration, and extreme fatigue. They had to carefully ration power and resources to ensure the Command Module, Odyssey, could be powered back up for reentry into Earth's atmosphere. The final challenge was reentry itself. There was widespread uncertainty about whether the heat shield had been damaged in the explosion. On April 17, 1970, after a tense period of radio silence during reentry, the capsule splashed down safely in the South Pacific Ocean. The crew was recovered by the USS Iwo Jima, and the world breathed a collective sigh of relief. Though Apollo 13 never reached the Moon, the mission is remembered as a triumph of teamwork, ingenuity, and human resilience. The quick thinking of the astronauts and the extraordinary efforts of engineers at Mission Control turned what could have been a fatal disaster into a heroic rescue. The mission highlighted the inherent dangers of space travel and led to significant changes in spacecraft design, safety procedures, and crisis management protocols at NASA.`;

export async function startChat() {
  const genAI = new GoogleGenerativeAI('AIzaSyDIiDQZ2ZmyyF0ZdFrrbs9mzcj7XzX5Ses');
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

  const chat = model.startChat();
  const chatId = randomUUID();
  setSession(chatId, chat);

  const response = await chat.sendMessage(prompt);
  const rawText = response?.response?.candidates?.[0]?.content?.parts?.[0]?.text;

  if (!rawText) throw new Error('No content received from Gemini');

  const parsed = parseGeminiJson(rawText);
  return { ...parsed, chatId };
}

export async function startChatStory() {
  const genAI = new GoogleGenerativeAI('AIzaSyDIiDQZ2ZmyyF0ZdFrrbs9mzcj7XzX5Ses');
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

  const chat = model.startChat();
  const chatId = randomUUID();
  setSession(chatId, chat);

  const response = await chat.sendMessage(prompt);
  const rawText = response?.response?.candidates?.[0]?.content?.parts?.[0]?.text;

  if (!rawText) throw new Error('No content received from Gemini');

  const parsed = parseGeminiJson(rawText);
  return { ...parsed, chatId };
}
