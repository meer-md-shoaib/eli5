import { LANGUAGES } from "./constants";
import type { Explanation } from "./types";

/** Flattens an explanation plus its follow-ups into one shareable Markdown string. */
export function getShareableText(explanation: Explanation): string {
  const followUpText = explanation.followUps
    .map((item) => `\n\n### Follow-up: ${item.question}\n\n${item.answer}`)
    .join("");
  return `${explanation.content}${followUpText}`;
}

export function languageToSpeechCode(language: string): string {
  return LANGUAGES.find((item) => item.code === language)?.speechCode ?? "en-US";
}
