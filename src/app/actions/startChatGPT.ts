'use server';

import { randomUUID } from 'crypto';
import { OpenAI } from 'openai';
import { createSession, updateSession } from '@/lib/sessionStoreNew';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const prompt = `I want to create a interactive story game. Initially send the intro to the story. The intro should be small and should only establish a plot. With the intro, send in 4 options as in 4 paths the user can take after that point in the story. The response should be in json and and have 2 fields  - ‘para’ and ‘choices’. The user can reply with either of the choices, ask you to ‘continue the story’ or give text of their own to move the story forward. After that reply again in json with 2 fields - ‘para’ and ‘choices’.

The available choices should be meaningful and different paths within the story that the user can take to move the story forward.

If the user deviates too much from the story or writes nonsense, manage it in the next para you give by slightly incorporating what the user is saying by overall staying in the story. Like if the user says something really nonsensical, put it in the narrative that he was dreaming.

The story should progress forward and eventually end. After the story, return a json with 1 value 'eos' with some ending text.

Here is the narrative for the story. This is only one of the direction. They story may deviate based on options you give the user and the paths user takes:

The fire crackles low in your cottage. Outside, the winds carry the scent of pine and wet earth. Oakendale — your quiet refuge from the world — sleeps in peace. You sit alone, nursing a half-filled mug, your hands calloused from farming, not war. Your armor lies buried beneath the floorboards, untouched in decades.

Then, the world changes.

A roar, ancient and unholy, splits the sky. The ground trembles. Dust drifts from the rafters. You rise to your feet — not quickly, not easily, but with purpose. Gorran, your old warhound, growls beside you. You already know what’s coming.

You cross the room and tear open the floor. Beneath lies a chest — the past, sealed in wood and dust. You open it slowly.

Your armor — rusted, but whole. Your sword — dulled, but still true. Your cloak — the crimson banner of the Crimson Order, faded but proud.

You breathe deep. The years fall away.

“If this is to be my death,” you mutter, “then let it be on my feet.”

You step into the village square as screams echo through the valley. The sky churns with smoke and wings. Malgrath — the ancient dragon of old tales — descends from the heavens, fire churning in his chest. People run. Houses burn. The sky weeps ash.

You are met with stares.

“Sir Brannen? He’s… alive?”
“He’s too old.”
“He can’t fight that.”

You say nothing.

You stride to the blacksmith, still a boy in your memory. “Heat your forge. I’ll need my blade.” He stares at you — wide-eyed, uncertain — then nods.

The village gathers. Not in hope, but in desperation. You stand before them, armored, but weighed down by more than steel. You see fear in their eyes — not of the dragon, but of failure.

You speak.

“We do not need a miracle. We need a plan. We fight with fire, wit, and unity. You will not fight for me — you will fight for your homes.”

You rally them. The miller’s son rigs barrels of oil at the gorge. The blacksmith forges harpoons from plow blades. The children dig trenches, place spikes. It’s not a war. It’s a trap — and you are the bait.

Night falls.

Malgrath returns, summoned by the scent of defiance. He lands with thunder in the fields. His eyes — twin furnaces — lock onto you.

You walk alone into the open. Cloak billowing. Sword drawn.

He growls, ancient and amused. “You still live, Brannen? I remember your scent from the last war. You reek of ash and regret.”

You raise your sword.

“And you reek of arrogance. Let's finish this.”

He charges. You run.

The chase begins — through alleys lined with flame, through fields rigged with traps. Harpoons strike scale. Fire explodes. Villagers roar and scatter. But the dragon is not so easily slain.

You lead him to the gorge.

You turn. Bleeding. Burning. But standing.

Malgrath lunges — wings wide, jaws aglow.

You dive.

You grab his neck, drive your blade between two scales — and hurl yourself over the edge.

The gorge collapses in fire and stone.

Days pass.

They search the rubble. They find only a shattered sword. A torn cloak. No body.

Some say you died a hero. Others say you walk the woods still, watching, waiting.

But all know the truth:

You were not a legend because you were invincible.

You were a legend because you stood.

Because when the world begged for a hero — you answered.`


export async function startChatStory() {
  const chatId = randomUUID();

  const systemPrompt = 'You are a storytelling assistant that replies in JSON with keys: para, choices, eos.';
  const history = [
    { role: 'system', content: systemPrompt },
    { role: 'user', content: `${prompt}` },
  ];

  const completion = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: history,
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

  // Save full history
  const fullHistory = [...history, reply];
  createSession(chatId, systemPrompt);
  updateSession(chatId, fullHistory);

  return {
    ...parsed,
    chatId,
  };
}
