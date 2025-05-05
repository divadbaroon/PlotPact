'use server';

import OpenAI from 'openai';
import type { Constraint, ConstraintStructure } from '@/types';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const constraintStructureDescriptions = `
- Function: 'exclusionary' (Don't do X) or 'focusing' (Do Y)
- Type: 'channel' or 'anchor'
- Flexibility: 'fixed' or 'flexible'

Here are definitions of each type of constraint for reference:

Constraint function:

Focusing: These constraints tell the creator what to include. They narrow the search space by offering specific directions or inclusion targets. Focusing constraints increase informativeness and cognitive persistence—especially when the required elements are unusual or peripheral to the theme.
Example: “Include an image of melting ice.”

Exclusionary: These constraints tell the creator what not to include. They suppress obvious, overused, or central ideas to redirect creative search. Exclusionary constraints tend to foster cognitive flexibility and divergent thinking by forcing the user to avoid typical responses.
Example: “Avoid any mention of love or romantic attraction.

Note: Focusing constraints are typically perceived as challenges (energizing), while exclusionary ones can be seen as hindrances unless carefully framed

Constraint type:

Anchor: A constraint on a specific concept, object, or image. Anchors provide concrete starting points and are often vivid or narrow. Because they are specific, they are highly informative but also more likely to cause fixation.
Example: “Include a spinning plate in your story.”

Channel: A constraint on a general category or theme. Channels shape exploration by defining a broader conceptual boundary, which promotes in-depth exploration. Channels are less likely to cause fixation and are more abstract than anchors. A channel is a broad constraint that guides the theme, setting, or mood of the story without forcing specific details. It narrows the search space but still leaves many creative choices open.
Example: “Set the story within a dystopian society.”

Note: Anchors correspond to “points” and channels to “planes” in the geometry of the search space

Constraint flexibility:

Fixed: These constraints are non-negotiable. They represent hard boundaries—logical, physical, or aesthetic rules—that must be respected. They promote precision and limit variability. It defines the basic structure of the creative process.
Example: “You must not break the fourth wall.”, “The story setting must be in the medieval era”.

Flexible: These constraints can be bent, substituted, or relaxed. They support reinterpretation, counterfactual thinking, and adaptive creativity. A flexible constraint openly invites variation or negotiation. It lightly steers creativity without locking it down. Flexible constraints encourage wide exploration while still keeping a creative direction.
Example: “Include a cooking method, but you can change it if needed.”
`;

export async function generateInitialPlotConstraints(storyPlot: string) {
  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: `You are a narrative constraint generator that creates structured but high level constraints for a story plot to enhance creativity of the writer. Generate constraints including the following the structure:

          ${constraintStructureDescriptions}

          The user may take completely different paths and create a diverse story but they should remain within these constraints. Focus on setting, time period, and character traits - not specific plot points. Depending on the plot length generate less or more constraints. Do not generate more than 3 constraints.

          Return constraints in a JSON object with a "constraints" array, where each constraint has:
          {
            "id": "unique_id",
            "function": "exclusionary" or "focusing",
            "type": "channel" or "anchor",
            "flexibility": "fixed" or "flexible",
            "description": "A clear statement describing the constraint",
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
  constraintStructure: ConstraintStructure,
  constraintCount: number | 1
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
          content: `You are a narrative constraint generator that creates a structured constraints to enhance user creativity while keeping them broad and lenient. The constraints should have following structure:
          
          ${constraintStructureDescriptions}
          
          Return constraints in a JSON object with a "constraints" array, where each constraint has:
          {
            "id": "unique_id",
            "function": "exclusionary" or "focusing",
            "type": "channel" or "anchor",
            "flexibility": "fixed", "flexible",
            "description": "A clear statement describing the constraint,
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
          Number of Constraints to be generated: ${constraintCount}
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

    If a violation is found, identify the specific part of the content that violates the constraint.

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
          "explanation": string,
          "violatingContent": string
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
