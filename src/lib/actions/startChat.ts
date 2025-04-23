'use server';

import OpenAI from 'openai';
import { randomUUID } from 'crypto';
import { setStoryContext, debugStoryContext } from '@/lib/actions/sessionStore';

import { StoryResponse } from '@/types';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const storyContexts = new Map();

// const knightStoryPrompt = `I want to create a interactive story game. Initially send the intro to the story, with the intro, send in 4 options as in 4 paths the user can take after that point in the story. The response should be in json and and have 2 fields  - ‘para’ and ‘choices’. The user can reply with either of the choices, ask you to ‘continue the story’ or give text of their own to move the story forward. After that reply again in json with 2 fields - ‘para’ and ‘choices’.

// If the user deviates too much from the story or writes nonsense, manage it in the next para you give by slightly incorporating what the user is saying by overall staying in the story. Like if the user says something really nonsensical, put it in the narrative that he was dreaming.

// The story should progress forward and eventually end. After the story, return a json with 1 value 'eos' with some ending text.


// Here is the narrative for the story. This is only one of the direction. They story may deviate based on options you give the user and the paths user takes:

// The fire crackles low in your cottage. Outside, the winds carry the scent of pine and wet earth. Oakendale — your quiet refuge from the world — sleeps in peace. You sit alone, nursing a half-filled mug, your hands calloused from farming, not war. Your armor lies buried beneath the floorboards, untouched in decades.

// Then, the world changes.

// A roar, ancient and unholy, splits the sky. The ground trembles. Dust drifts from the rafters. You rise to your feet — not quickly, not easily, but with purpose. Gorran, your old warhound, growls beside you. You already know what’s coming.

// You cross the room and tear open the floor. Beneath lies a chest — the past, sealed in wood and dust. You open it slowly.

// Your armor — rusted, but whole. Your sword — dulled, but still true. Your cloak — the crimson banner of the Crimson Order, faded but proud.

// You breathe deep. The years fall away.

// “If this is to be my death,” you mutter, “then let it be on my feet.”

// You step into the village square as screams echo through the valley. The sky churns with smoke and wings. Malgrath — the ancient dragon of old tales — descends from the heavens, fire churning in his chest. People run. Houses burn. The sky weeps ash.

// You are met with stares.

// “Sir Brannen? He’s… alive?”
// “He’s too old.”
// “He can’t fight that.”

// You say nothing.

// You stride to the blacksmith, still a boy in your memory. “Heat your forge. I’ll need my blade.” He stares at you — wide-eyed, uncertain — then nods.

// The village gathers. Not in hope, but in desperation. You stand before them, armored, but weighed down by more than steel. You see fear in their eyes — not of the dragon, but of failure.

// You speak.

// “We do not need a miracle. We need a plan. We fight with fire, wit, and unity. You will not fight for me — you will fight for your homes.”

// You rally them. The miller’s son rigs barrels of oil at the gorge. The blacksmith forges harpoons from plow blades. The children dig trenches, place spikes. It’s not a war. It’s a trap — and you are the bait.

// Night falls.

// Malgrath returns, summoned by the scent of defiance. He lands with thunder in the fields. His eyes — twin furnaces — lock onto you.

// You walk alone into the open. Cloak billowing. Sword drawn.

// He growls, ancient and amused. “You still live, Brannen? I remember your scent from the last war. You reek of ash and regret.”

// You raise your sword.

// “And you reek of arrogance. Let's finish this.”

// He charges. You run.

// The chase begins — through alleys lined with flame, through fields rigged with traps. Harpoons strike scale. Fire explodes. Villagers roar and scatter. But the dragon is not so easily slain.

// You lead him to the gorge.

// You turn. Bleeding. Burning. But standing.

// Malgrath lunges — wings wide, jaws aglow.

// You dive.

// You grab his neck, drive your blade between two scales — and hurl yourself over the edge.

// The gorge collapses in fire and stone.

// Days pass.

// They search the rubble. They find only a shattered sword. A torn cloak. No body.

// Some say you died a hero. Others say you walk the woods still, watching, waiting.

// But all know the truth:

// You were not a legend because you were invincible.

// You were a legend because you stood.

// Because when the world begged for a hero — you answered.`;

const knightStoryPrompt = `I want to create a interactive story game. Initially send the intro to the story. The intro should be small and should only establish a plot. The response should be in json and and have 2 fields  - 'para' and 'choices'. The user can reply with either of the choices, ask you to 'continue the story' or give text of their own to move the story forward. After that reply again in json with 2 fields - 'para' and 'choices'. 

Send in 4 options as in 4 paths the user can take after that point in the story in 'choices'. The available choices should be meaningful and different paths within the story that the user can take to move the story forward.

If the user deviates too much from the story or writes nonsense, manage it in the next para you give by slightly incorporating what the user is saying by overall staying in the story. Like if the user says something really nonsensical, put it in the narrative that he was dreaming.

The story should progress forward and eventually end. After the story, return a json with 1 value 'eos' with some ending text.

Here is the narrative for the story. This is only one of the direction. They story may deviate based on options you give the user and the paths user takes. Use the exact same narrative as below and do not change the words for this:

Lila found the box on her doorstep, small and wooden, with a single brass dial on the top. The note taped to it was short: "Turn the dial to the right number to save him." She froze, her heart racing. Who was “him”? Her little brother? Her dad? She didn’t know, but she couldn’t take any chances. She turned the box over, searching for clues, and spotted faint numbers etched along the edges. 

“It’s a code,” she whispered to herself, her hands trembling as she tried to figure out where to start.`;

export async function startChatStory(): Promise<StoryResponse> {
  try {
    // Generate a unique chat ID
    const chatId = randomUUID();

    // Generate initial story with GPT
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: `You are a creative storyteller managing an interactive narrative. The story should be based on this narrative background, but the exact events can vary based on user choices: ${knightStoryPrompt}

Return ONLY a JSON response with two fields:
1. 'para': The opening scene of the story (first few paragraphs that set up the situation)
2. 'choices': Array of 4 possible actions the protagonist could take next

Make the choices meaningful and divergent, allowing for different possible story paths.`,
        },
      ],
      response_format: { type: 'json_object' },
      temperature: 0.8,
    });

    // Parse the response
    const responseContent = completion.choices[0].message.content || '{}';
    console.log(`Received story start:`, responseContent);

    let responseData;
    try {
      responseData = JSON.parse(responseContent);
    } catch (error) {
      console.error('Failed to parse JSON response:', error);
      throw new Error('Invalid response from AI service');
    }

    // Store story context using file-based storage
    const success = await setStoryContext(chatId, {
      story: [responseData.para],
      lastChoices: responseData.choices,
    });

    if (!success) {
      console.error(`Failed to store context for new chat ${chatId}`);
    } else {
      console.log(`Successfully stored context for new chat ${chatId}`);
      // Verify the session was created correctly
      await debugStoryContext(chatId);
    }

    // Return the response
    return {
      chatId,
      para: responseData.para,
      choices: responseData.choices,
    };
  } catch (error) {
    console.error('Error starting chat story:', error);
    throw error;
  }
}

export async function startChat() {
  try {
    const chatId = randomUUID();

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: `Create an educational multiple choice game about the Apollo 13 mission. Start with a brief introduction and provide the first question. Return response in JSON format with fields:
          - 'para': Brief introduction
          - 'question': First question
          - 'choices': Array of possible answers (one correct, 3-4 incorrect)`,
        },
        {
          role: 'user',
          content: `Use this background: Apollo 13 was the seventh crewed mission in NASA's Apollo space program...`,
        },
      ],
      response_format: { type: 'json_object' },
      temperature: 0.7,
    });

    const responseData = JSON.parse(
      completion.choices[0].message.content || '{}'
    );

    // Store initial context
    storyContexts.set(chatId, {
      story: [responseData.para],
      lastQuestion: responseData.question,
      lastChoices: responseData.choices,
      correctAnswers: 0,
    });

    return {
      chatId,
      ...responseData,
    };
  } catch (error) {
    console.error('Error starting chat:', error);
    throw error;
  }
}
