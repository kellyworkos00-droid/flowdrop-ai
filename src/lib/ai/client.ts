import OpenAI from "openai";

let openaiClient: OpenAI | null = null;

function getOpenAIClient(): OpenAI | null {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return null;
  }

  if (!openaiClient) {
    openaiClient = new OpenAI({ apiKey });
  }

  return openaiClient;
}

export async function summarizeFlowNudge(input: string): Promise<string> {
  const openai = getOpenAIClient();
  if (!openai) {
    return input.slice(0, 140);
  }

  const completion = await openai.responses.create({
    model: "gpt-4o-mini",
    input: `Summarize this team flow update in one concise sentence: ${input}`,
  });

  return completion.output_text || "Flow updated.";
}
