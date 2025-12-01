// function that responds to POST requests at /api/chat

import { openai} from '@ai-sdk/openai'
import { streamText, UIMessage, convertToModelMessages, tool } from 'ai';
import { z } from 'zod';

//alllow streaming responses up to 30 seconds - response time
export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json();

  //system prompt to instruct the model to use the tool
  const system_prompt = `You are an expert SQL assistant that helps user to query their database using natural language.
  You have access to following tools:
  1.schema tool - call this tool to get the database schema which will help you to write sql queries.
  2. db tool - call this tool to query the database.
  
Rules:
-Generate only SELECT queries (no INSERT, UPDATE, DELETE, DROP)
- Always use the schema provided by the schema tool
- Return valid SQLite syntax

Always respond in a helpful, conversational tone while being technically accurate.
`;

  const result = streamText({
    model: openai('gpt-4o-mini'),
    messages: convertToModelMessages(messages),
    system: system_prompt,
    tools: {
      db: tool({
        description: 'Call this tool to query a database',
        inputSchema: z.object({
          query: z.string().describe('The SQL query to be ran'),
        }),
        execute: async ({ query }) => {
          console.log('Query',query);

          return '';
        },
      }),
    },
  });

  return result.toUIMessageStreamResponse();
}