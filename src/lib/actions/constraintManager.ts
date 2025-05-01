'use server';

import OpenAI from 'openai';
import type { Constraint, ConstraintStructure } from '@/types';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function generateInitialPlotConstraints(storyPlot: string) {
  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: `You are a narrative constraint generator that creates structured but high level constraints for a story plot to enhance creativity of the writer. Generate constraints including the following the structure:

          - Function: 'exclusionary' (Don't do X) or 'focusing' (Do Y)
          - Type: 'channel' (broad themes/setting) or 'anchor' (specific elements)
          - Flexibility: 'fixed', 'faux-fixed', or 'flexible'

          Here are definitions of each type of constraint for reference:

          Exclusionary (“Don’t do X”): Constraints that are used to direct searching away from a particular area, but without providing any speciﬁc alternatives. E.g In designing a new car, the constraint is not to use a diesel engine. It doesn’t specify what engine to use (electric, hybrid etc.) only that diesel is excluded. 

          Focusing: (“Do Y”): Constraints that redirect the search toward a particular area and provides speciﬁc anchors to guide the search. E.g In developing a new smartphone, the system pushes the user towards optimizing the smartphone for photography under low-light conditions. 

          Channel: A channel is a broad constraint that guides the theme, setting, or mood of the story without forcing specific details. It narrows the search space but still leaves many creative choices open. For example, if the constraint says "Tell a story about betrayal," users can write about a lover, a friend, or even an animal, anything that fits the betrayal theme. Another channel could be "Set your story in a desert," letting users invent anything from survival tales to magical deserts. Channels focus the creative path but don't lock it down.

          Anchor: An anchor is a specific object, idea, or event that must appear in the story. It’s a tight, concrete constraint that forces direct integration into the narrative. For example, if the constraint says "Include a golden compass," the writer must build that item into their story somehow, maybe as a magical tool or a family heirloom. Anchors limit options but spark imaginative connections.

          Fixed: A fixed constraint is a rule that must be strictly followed, no exceptions. It defines the basic structure of the creative process. In our storytelling system, an example of a fixed constraint would be: “The story setting must be in the medieval era”. Users must build within the original world setup, no matter what. Fixed constraints anchor the story’s logic, keeping it coherent.

          Flexible: A flexible constraint openly invites variation or negotiation. It lightly steers creativity without locking it down. For our system, a flexible constraint might be: "There must be a betrayal, but it can be emotional, physical, or even symbolic." Users can decide whether the betrayal is a broken promise, a stolen artifact, or a character betraying their own ideals. Flexible constraints encourage wide exploration while still keeping a creative direction.

          The user may take completely different paths and create a diverse story but they should remain within these constraints. Focus on setting, time period, and character traits - not specific plot points.

          Return constraints in a JSON object with a "constraints" array, where each constraint has:
          {
            "id": "unique_id",
            "function": "exclusionary" or "focusing",
            "type": "channel" or "anchor",
            "flexibility": "fixed" or "flexible",
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
          content: `Story plot: ${storyPlot};`,
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

export async function createConstraint(
  storyContext: string[],
  existingConstraints: Constraint[],
  constraintStructure: ConstraintStructure[]
) {
  try {
    console.log(
      'Processing storyContent:',
      storyContext.length > 0
        ? storyContext[0].substring(0, 100) + '...'
        : 'No content'
    );

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: `You are a narrative constraint generator that creates a structured constraint to enhance user creativity while keeping them broad and lenient. The constraint should have following structure:
          
          - Function: 'exclusionary' (Don't do X) or 'focusing' (Do Y)
          - Type: 'channel' (broad themes/setting) or 'anchor' (specific elements)
          - Flexibility: 'fixed', 'faux-fixed', or 'flexible'

          Here are definitions of each type of constraint for reference:

          Exclusionary (“Don’t do X”): Constraints that are used to direct searching away from a particular area, but without providing any speciﬁc alternatives. E.g In designing a new car, the constraint is not to use a diesel engine. It doesn’t specify what engine to use (electric, hybrid etc.) only that diesel is excluded. 

          Focusing: (“Do Y”): Constraints that redirect the search toward a particular area and provides speciﬁc anchors to guide the search. E.g In developing a new smartphone, the system pushes the user towards optimizing the smartphone for photography under low-light conditions. 

          Channel: A channel is a broad constraint that guides the theme, setting, or mood of the story without forcing specific details. It narrows the search space but still leaves many creative choices open. For example, if the constraint says "Tell a story about betrayal," users can write about a lover, a friend, or even an animal, anything that fits the betrayal theme. Another channel could be "Set your story in a desert," letting users invent anything from survival tales to magical deserts. Channels focus the creative path but don't lock it down.

          Anchor: An anchor is a specific object, idea, or event that must appear in the story. It’s a tight, concrete constraint that forces direct integration into the narrative. For example, if the constraint says "Include a golden compass," the writer must build that item into their story somehow, maybe as a magical tool or a family heirloom. Anchors limit options but spark imaginative connections.

          Fixed: A fixed constraint is a rule that must be strictly followed, no exceptions. It defines the basic structure of the creative process. In our storytelling system, an example of a fixed constraint would be: “The story setting must be in the medieval era”. Users must build within the original world setup, no matter what. Fixed constraints anchor the story’s logic, keeping it coherent.
          
          Flexible: A flexible constraint openly invites variation or negotiation. It lightly steers creativity without locking it down. For our system, a flexible constraint might be: "There must be a betrayal, but it can be emotional, physical, or even symbolic." Users can decide whether the betrayal is a broken promise, a stolen artifact, or a character betraying their own ideals. Flexible constraints encourage wide exploration while still keeping a creative direction.
          
          Return constraints in a JSON object with a "constraints" array, where each constraint has:
          {
            "id": "unique_id",
            "function": "exclusionary" or "focusing",
            "type": "channel" or "anchor",
            "flexibility": "fixed", "flexible",
            "description": "A clear statement of what must remain consistent",
            "reason": "The story evidence for this constraint",
            "examples": {
              "valid": ["Example of valid usage"],
              "invalid": ["Example of invalid usage"]
            }
          }
          
          You will be provided the exact constraint structure to be generated i.e - the constraint function, type and flexibility. Take that and generate the constraint accordingly based on the above definitions.
          `,
        },
        {
          role: 'user',
          content: `The story so far: ${storyContext.join('\n')}; 
          Existing constraints: ${JSON.stringify(
            existingConstraints,
            null,
            2
          )}; 
          Existing constraints should be considered but not returned. Only generate new constraints based on recent developments. The threshold for constraints should be very low - just the essential elements needed for consistency;
          Constraint Structure : ${JSON.stringify(
            constraintStructure,
            null,
            2
          )};
          `,
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
