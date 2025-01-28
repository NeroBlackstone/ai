import { groq } from '@ai-sdk/groq';
import {
  experimental_wrapLanguageModel,
  extractReasoningMiddleware,
  streamText,
} from 'ai';
import 'dotenv/config';

async function main() {
  const result = streamText({
    model: experimental_wrapLanguageModel({
      model: groq('deepseek-r1-distill-llama-70b'),
      middleware: extractReasoningMiddleware({ tagName: 'think' }),
    }),
    prompt: 'How many "r"s are in the word "strawberry"?',
  });

  let enteredReasoning = false;
  let enteredText = false;
  for await (const part of result.fullStream) {
    if (part.type === 'reasoning') {
      if (!enteredReasoning) {
        enteredReasoning = true;
        console.log('\nREASONING:\n');
      }
      process.stdout.write(part.textDelta);
    } else if (part.type === 'text-delta') {
      if (!enteredText) {
        enteredText = true;
        console.log('\nTEXT:\n');
      }
      process.stdout.write(part.textDelta);
    }
  }
}

main().catch(console.error);
