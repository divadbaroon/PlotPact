'use server';

import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

import { Constraint } from '@/types';

export async function generateConstraints(storyContext: string[]) {
  try {
    console.log('Generating constraints for story context:', storyContext);

    const storyContent = storyContext.join('\n');
    console.log(
      'Processing storyContent:',
      storyContent.substring(0, 100) + '...'
    );

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: `You are a narrative constraint generator. Given a story segment, extract key story elements and generate narrative constraints that must be followed for story consistency. The example is only one path for the story, the user may take completely different path and create a completely different story but they have to remain within the constraints. Make the constrains broad and lenient. Just things like setting and time. Do not include things like story plot and next paths user can take. Basically the user is free to do anything as long as the story moves forward in a meaningful way.
          
          Return constraints in a JSON object with a "constraints" array, where each constraint has:
          - "type": The category of constraint (character, plot, setting)
          - "description": A clear statement of what must remain consistent
          - "reason": The story evidence for this constraint
          
          Example format:
          {
            "constraints": [
              {
                "type": "character",
                "description": "Sir Brannen must be portrayed as elderly but determined",
                "reason": "Established in the story as an old knight who has come out of retirement"
              }
            ]
          }`,
        },
        {
          role: 'user',
          content: `Analyze this story content and generate constraints:
          ${storyContent}`,
        },
      ],
      response_format: { type: 'json_object' },
      temperature: 0.7,
    });

    const responseContent =
      completion.choices[0].message.content || '{"constraints": []}';
    console.log('OpenAI response received');

    try {
      const parsedResponse = JSON.parse(responseContent);
      console.log(
        'Parsed constraints:',
        parsedResponse.constraints
          ? `Found ${parsedResponse.constraints.length} constraints`
          : 'No constraints found'
      );

      return Array.isArray(parsedResponse.constraints)
        ? parsedResponse.constraints
        : [];
    } catch (error) {
      console.error('Failed to parse OpenAI response:', error);
      return [];
    }
  } catch (error) {
    console.error('Error generating constraints:', error);
    return [];
  }
}

export async function verifyContent(
  content: string,
  storyContext: string[],
  currentConstraints: Constraint[]
) {
  try {
    console.log('Verifying content:', content.substring(0, 50) + '...');
    console.log('Against constraints:', currentConstraints.length);

    const prompt = `Verify if this new content follows all established story constraints. If there are violations, explain what they are and why they break consistency. The user free is take the story into any direction as long as it makes sense. The threshold to accept the response should be very low, that means if the new content even slightly fits into the story it should go through. The user need not depend fully on the story context. They can take completely different paths and actions and create a completely different story at the end. The system should check for broad constraints and only stop things that don't make sense at all. Do not force the user to just stay within the story context. Basically the user is free to do anything within the story as long as the story moves forward in a meaningful way.

Story context:
${storyContext.join('\n')}

Current constraints:
${JSON.stringify(currentConstraints, null, 2)}

New content to verify:
${content}

Format the response as JSON:
{
  "isValid": boolean,
  "violations": [
    {
      "constraintType": string,
      "explanation": string
    }
  ]
}`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content:
            'You are a narrative consistency verifier. Your role is to check if new content follows established story constraints and provide detailed feedback on any violations. Return only valid JSON.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      response_format: { type: 'json_object' },
      temperature: 0.3,
    });

    const responseContent =
      completion.choices[0].message.content ||
      '{"isValid": true, "violations": []}';
    console.log('OpenAI verification response received');

    try {
      const parsedResponse = JSON.parse(responseContent);
      console.log(
        'Verification result:',
        parsedResponse.isValid ? 'Valid' : 'Invalid with violations'
      );
      return parsedResponse;
    } catch (error) {
      console.error('Failed to parse OpenAI verification response:', error);
      return { isValid: true, violations: [] };
    }
  } catch (error) {
    console.error('Error verifying content:', error);
    return { isValid: true, violations: [] };
  }
}
