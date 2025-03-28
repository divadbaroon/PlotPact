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

const prompt2 = `I want to create a interactive game within gemini. Initially send the intro to the story, with the intro, send in 4 options as in 4 paths the user can take after that point in the story. The response should be in json and and have 2 fields  - ‘para’ and ‘choices’. The user can reply with either of the choices, ask you to ‘continue the story’ or give text of their own to move the story forward. After that reply again in json with 2 fields - ‘para’ and ‘choices’.

If the user deviates too much from the story or writes nonsense, manage it in the next para you give by slightly incorporating what the user is saying by overall staying in the story. Like if the user says something really nonsensical, put it in the narrative that he was dreaming.

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

Because when the world begged for a hero — you answered.`;

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
