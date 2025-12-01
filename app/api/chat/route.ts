// function that responds to POST requests at /api/chat

import { openai} from '@ai-sdk/openai'
import { streamText, UIMessage, convertToModelMessages } from 'ai';

//alllow streaming responses up to 30 seconds - response time
export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json();

  const result = streamText({
    model: openai('gpt-4o'),
    messages: convertToModelMessages(messages),
  });

  return result.toUIMessageStreamResponse();
}