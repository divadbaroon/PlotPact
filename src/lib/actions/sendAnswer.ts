'use server';

import OpenAI from 'openai';
import { getStoryContext, updateStoryContext, debugStoryContext } from '@/lib/actions/sessionStore';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export async function sendAnswer(chatId: string, answer: string) {
  try {

    // Get the current story context
    const storyContext = await getStoryContext(chatId);

    if (!storyContext) {
      console.error(`Story context not found for chatId: ${chatId}`);
      throw new Error('Chat session not found');
    }

    // Call GPT to continue the story
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `You are managing an interactive narrative for "The Box with the Brass Dial". 
          Story context so far:
          ${storyContext.story.join("\n")}
          
          User's choice/input: ${answer}
          
          Return a JSON response with:
          1. 'para': A new paragraph continuing the story based on the user's choice
          2. 'choices': Array of 4 new possible continuations`
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.8,
    });

    // Parse the response
    const responseContent = completion.choices[0].message.content || '{}';
    console.log(`Received response: ${responseContent}`);
    
    let responseData;
    try {
      responseData = JSON.parse(responseContent);
    } catch (error) {
      console.error('Failed to parse JSON response:', error);
      throw new Error('Invalid response from AI service');
    }

    // Update the story context with the new paragraph and choices
    const updated = await updateStoryContext(chatId, {
      story: [...storyContext.story, responseData.para],
      lastChoices: responseData.choices
    });

    if (!updated) {
      console.error(`Failed to update story context for chatId: ${chatId}`);
    } else {
      // Verify the update worked by retrieving the updated context
      await debugStoryContext(chatId);
    }

    // Check if we should end the story
    if (storyContext.story.length >= 10 || responseData.para.toLowerCase().includes('the end')) {
      return {
        eos: "You've reached the end of your journey. The Box with the Brass Dial tale is now complete. Thank you for playing!",
      };
    }

    return responseData;
  } catch (error) {
    console.error('Error processing story answer:', error);
    throw error;
  }
}