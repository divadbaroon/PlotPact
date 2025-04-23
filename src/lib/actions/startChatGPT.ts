'use server';

import { randomUUID } from 'crypto';
import { OpenAI } from 'openai';
import { setStoryContext, updateStoryContext } from '@/lib/sessionStore';
import { INITIAL_STORIES } from '@/lib/constants/stories';

import { StoryContext } from "@/types";
import type { Message } from '@/lib/sessionStoreNew';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const initialPrompt = `I want to create a interactive story game. Initially send the intro to the story. The intro should be small and should only establish a plot. The response should be in json and and have 2 fields  - 'para' and 'choices'. The user can reply with either of the choices, ask you to 'continue the story' or give text of their own to move the story forward. After that reply again in json with 2 fields - 'para' and 'choices'. 

Send in 4 options as in 4 paths the user can take after that point in the story in 'choices'. The available choices should be meaningful and different paths within the story that the user can take to move the story forward.

If the user deviates too much from the story or writes nonsense, manage it in the next para you give by slightly incorporating what the user is saying by overall staying in the story. Like if the user says something really nonsensical, put it in the narrative that he was dreaming.

The story should progress forward and eventually end. After the story, return a json with 1 value 'eos' with some ending text.

Here is the narrative for the story. This is only one of the direction. They story may deviate based on options you give the user and the paths user takes. Use the exact same narrative as below and do not change the words for this:`;

const storyPlot1 = `Lila found the box on her doorstep, small and wooden, with a single brass dial on the top. The note taped to it was short: "Turn the dial to the right number to save him." She froze, her heart racing. Who was "him"? Her little brother? Her dad? She didn't know, but she couldn't take any chances. She turned the box over, searching for clues, and spotted faint numbers etched along the edges. 

"It's a code," she whispered to herself, her hands trembling as she tried to figure out where to start.`;

const storyPlot2 = `The fire crackles low in your cottage. Outside, the winds carry the scent of pine and wet earth. Oakendale — your quiet refuge from the world — sleeps in peace. You sit alone, nursing a half-filled mug, your hands calloused from farming, not war. Your armor lies buried beneath the floorboards, untouched in decades. Then, the world changes. A roar, ancient and unholy, splits the sky. The ground trembles. Dust drifts from the rafters. You rise to your feet — not quickly, not easily, but with purpose. Gorran, your old warhound, growls beside you. You already know what's coming.`;

export async function startChatStory(storyId: string) {
  const chatId = randomUUID();

  const systemPrompt =
    'You are a storytelling assistant that replies in JSON with keys: para, choices, eos.';

  let prompt = initialPrompt;

  console.log(storyId);

  if (storyId == '1') prompt = initialPrompt + storyPlot1;
  else prompt = initialPrompt + storyPlot2;

  const history: Message[] = [
    { role: 'system', content: systemPrompt },
    { role: 'user', content: `${prompt}` },
  ];

  const completion = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: history,
    temperature: 0.8,
  });

  const reply = completion.choices[0].message!;

  const normalizedReply = {
    role: reply.role as 'assistant', 
    content: reply.content ?? '',
  };

  const fullHistory: Message[] = [...history, normalizedReply];

  // Create new session with Redis
  await createSession(chatId, systemPrompt);
  
  // Update session with the full message history
  await updateSession(chatId, fullHistory);

  return {
    chatId,
    para: INITIAL_STORIES.LILA_STORY.initialParagraph,
    choices: INITIAL_STORIES.LILA_STORY.initialChoices,
    constraints: INITIAL_STORIES.LILA_STORY.initialConstraints,
    eos: false
  };
}

// Helper function to create a session (implementation for Redis)
async function createSession(id: string, systemPrompt?: string) {
  const storyContext: StoryContext = {
    story: [],
    lastChoices: [],
    lastQuestion: undefined,
    correctAnswers: 0,
    originalPrompt: systemPrompt
  };
  
  return await setStoryContext(id, storyContext);
}

// Helper function to update a session (implementation for Redis)
async function updateSession(id: string, messages: Message[]) {
  // Extract story content from the messages
  const storyContent = messages
    .filter(msg => msg.role === 'assistant')
    .map(msg => msg.content);
  
  // Update the story array in the StoryContext
  return await updateStoryContext(id, { 
    story: storyContent,
  });
}