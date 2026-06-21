import { CONVERSATION_CONTEXT_WINDOW, LENGTHS, MODES } from "./constants";
import type { ExplainRequestInput } from "./validation";

export interface ChatMessage {
  role: "system" | "user";
  content: string;
}

const BASE_SYSTEM_PROMPT = [
  "You are the explanation engine behind ELI5, a product that turns confusing topics into explanations that actually land.",
  "Be accurate first, entertaining second — never the other way around.",
  "Return clean Markdown only, with no preamble like 'Sure, here's an explanation' and no closing summary that just repeats the title.",
  "Ensure the explanations are slightly shortened, concise, and structured in clear, easy-to-follow bullet points.",
  "Use headings and lists where appropriate. If the topic involves code, use fenced code blocks with a language tag. If math helps, use LaTeX delimiters ($$ for display, \\( \\) for inline).",
  "Never invent citations, statistics, or sources. If you're not sure of a specific number, describe the idea without faking precision.",
].join(" ");

function findMode(modeId: string) {
  return MODES.find((mode) => mode.id === modeId) ?? MODES[0]!;
}

function findLength(lengthId: ExplainRequestInput["length"]) {
  return LENGTHS.find((length) => length.id === lengthId) ?? LENGTHS[1]!;
}

export function buildMessages(input: ExplainRequestInput): ChatMessage[] {
  const mode = findMode(input.modeId);
  const length = findLength(input.length);

  const userContent = input.question
    ? buildFollowUpPrompt(input, mode, length)
    : buildFreshExplanationPrompt(input, mode, length);

  return [
    { role: "system", content: BASE_SYSTEM_PROMPT },
    { role: "user", content: userContent },
  ];
}

function buildFreshExplanationPrompt(
  input: ExplainRequestInput,
  mode: (typeof MODES)[number],
  length: (typeof LENGTHS)[number]
): string {
  return [
    `Topic: ${input.topic}`,
    `Voice: ${mode.label} — ${mode.promptHint}`,
    `Complexity: ${input.complexity} out of 10 (1 is a small child, 10 is a domain expert).`,
    `Language: write the entire response in ${input.language}.`,
    "",
    "Structure the explanation with exactly these Markdown sections, translating the headings themselves into the requested language:",
    "## Short summary",
    "- [Write a very brief 1-2 sentence overview here as a bullet point]",
    "## Main explanation",
    "- [Break down the core concepts here using 3-5 clear, concise bullet points]",
    "- [Each point should be slightly shortened, focusing on one key idea]",
    "## Real-world example",
    "- [Illustrate with a simple, vivid real-world analogy/example here in 1-2 bullet points]",
    "## Key takeaway",
    "- [Summarize the single most important message here as a single bullet point]",
    "## Interesting fact",
    "- [Give one surprising or fascinating related fact here as a bullet point]",
    "",
    "Do not write paragraphs. Every single sentence in your response must be part of a bullet point. Keep the entire response slightly shortened, highly concise, and fully aligned with the requested voice.",
  ].join("\n");
}

function buildFollowUpPrompt(
  input: ExplainRequestInput,
  mode: (typeof MODES)[number],
  length: (typeof LENGTHS)[number]
): string {
  const recentConversation = (input.conversation ?? [])
    .slice(-CONVERSATION_CONTEXT_WINDOW)
    .map((turn, index) => `Follow-up ${index + 1}: ${turn.question}\nAnswer ${index + 1}: ${turn.answer}`)
    .join("\n\n");

  return [
    `Topic: ${input.topic}`,
    `Voice: ${mode.label} — ${mode.promptHint}`,
    `Complexity: ${input.complexity} out of 10.`,
    `Language: write the entire response in ${input.language}.`,
    "",
    "The user already received this explanation:",
    input.previousExplanation ?? "",
    "",
    recentConversation ? "Recent follow-up conversation:" : "",
    recentConversation,
    "",
    `New follow-up question: ${input.question}`,
    "",
    "Answer only the follow-up question in clean Markdown, in the same voice as before. The response must be slightly shortened, highly concise, and written entirely in clear, simple bullet points (do not write paragraphs). Keep continuity with the original explanation, but don't repeat the full original answer unless it's necessary to make sense of this reply.",
  ]
    .filter((line, index, all) => !(line === "" && all[index - 1] === ""))
    .join("\n");
}

export function maxTokensForLength(lengthId: ExplainRequestInput["length"]): number {
  return findLength(lengthId).maxTokens;
}
