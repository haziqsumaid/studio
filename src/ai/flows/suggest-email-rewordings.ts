// src/ai/flows/suggest-email-rewordings.ts
'use server';

/**
 * @fileOverview Provides AI-powered suggestions for rewording email messages.
 *
 * - suggestEmailRewordings - A function that generates rewording suggestions for an email message.
 * - SuggestEmailRewordingsInput - The input type for the suggestEmailRewordings function.
 * - SuggestEmailRewordingsOutput - The return type for the suggestEmailRewordings function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestEmailRewordingsInputSchema = z.object({
  message: z
    .string()
    .describe('The original email message that needs rewording.'),
  context: z
    .string()
    .optional()
    .describe('Additional context or information about the email.'),
});
export type SuggestEmailRewordingsInput = z.infer<
  typeof SuggestEmailRewordingsInputSchema
>;

const SuggestEmailRewordingsOutputSchema = z.object({
  suggestions: z
    .array(z.string())
    .describe('An array of suggested rewordings for the email message.'),
});
export type SuggestEmailRewordingsOutput = z.infer<
  typeof SuggestEmailRewordingsOutputSchema
>;

export async function suggestEmailRewordings(
  input: SuggestEmailRewordingsInput
): Promise<SuggestEmailRewordingsOutput> {
  return suggestEmailRewordingsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestEmailRewordingsPrompt',
  input: {schema: SuggestEmailRewordingsInputSchema},
  output: {schema: SuggestEmailRewordingsOutputSchema},
  prompt: `You are an AI assistant that suggests alternative rewordings for email messages.

  Given the following email message and context, provide 3 distinct alternative rewordings that maintain the original intent but offer improved clarity, tone, or conciseness.

  Message: {{{message}}}
  Context: {{{context}}}

  Suggestions:
  `,
});

const suggestEmailRewordingsFlow = ai.defineFlow(
  {
    name: 'suggestEmailRewordingsFlow',
    inputSchema: SuggestEmailRewordingsInputSchema,
    outputSchema: SuggestEmailRewordingsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
