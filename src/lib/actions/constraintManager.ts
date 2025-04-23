'use server';

import OpenAI from 'openai';
import type { Constraint } from '@/types';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function generateConstraints(
  storyContext: string[],
  existingConstraints: Constraint[]
) {
  try {
    console.log(
      'Processing storyContent:',
      storyContext.length > 0 ? storyContext[0].substring(0, 100) + '...' : 'No content'
    );

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: `You are a narrative constraint generator that creates structured constraints to enhance creativity while keeping them broad and lenient. Generate constraints following the structure:
          
          - Function: 'exclusionary' (Don't do X) or 'focusing' (Do Y)
          - Type: 'channel' (broad themes/setting) or 'anchor' (specific elements)
          - Flexibility: 'fixed', 'faux-fixed', or 'flexible'
          
          The user may take completely different paths and create a diverse story but they should remain within these constraints. Focus on setting, time period, and character traits - not specific plot points.
          
          Return constraints in a JSON object with a "constraints" array, where each constraint has:
          {
            "id": "unique_id",
            "function": "exclusionary" or "focusing",
            "type": "channel" or "anchor",
            "flexibility": "fixed", "faux-fixed", or "flexible",
            "description": "A clear statement of what must remain consistent",
            "reason": "The story evidence for this constraint",
            "examples": {
              "valid": ["Example of valid usage"],
              "invalid": ["Example of invalid usage"]
            }
          }`,
        },
        {
          role: 'user',
          content: `Story content: ${storyContext.join('\n')}; 
          Existing constraints: ${JSON.stringify(
            existingConstraints,
            null,
            2
          )}; 
          Existing constraints should be considered but not returned. Only generate new constraints based on recent developments. The threshold for constraints should be very low - just the essential elements needed for consistency.`,
        },
      ],
      response_format: { type: 'json_object' },
      temperature: 0.6,
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

    const prompt = `Verify if this new content follows established story constraints. The threshold to accept should be very low - if the content fits the story in any reasonable way, it should be accepted.
    
    Users are free to take the story in different directions and are not bound to follow previous plot developments. Only check that the content respects the broader constraints about setting, time period, and established character traits.

    Story context:
    ${storyContext.join('\n')};

    Current constraints:
    ${JSON.stringify(currentConstraints, null, 2)};

    New content to verify:
    ${content};

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
            'You are a narrative consistency verifier. Your role is to check if new content follows established story constraints while allowing for creativity and exploration. Return only valid JSON.',
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