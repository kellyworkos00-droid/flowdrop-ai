import OpenAI from "openai";

export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function summarizeFlowNudge(input: string): Promise<string> {
  const completion = await openai.responses.create({
    model: "gpt-4o-mini",
    input: `Summarize this team flow update in one concise sentence: ${input}`,
  });

  return completion.output_text || "Flow updated.";
}
