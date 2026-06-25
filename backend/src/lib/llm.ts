import { ChatOpenAI } from '@langchain/openai';

/**
 * Instantiates the LLM client using Groq's Llama 3.3 70B.
 * We use ChatOpenAI configured to point to Groq's endpoint for robust compatibility.
 */
export function getLLM(temperature = 0.2) {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    throw new Error('GROQ_API_KEY environment variable is not set. Please add it to your environment.');
  }

  return new ChatOpenAI({
    apiKey,
    model: 'llama-3.3-70b-versatile',
    configuration: {
      baseURL: 'https://api.groq.com/openai/v1',
    },
    temperature,
    maxRetries: 3,
  });
}
