/**
 * ELI5 personality & microcopy — one source of truth.
 *
 * Tone: warm, clever, encouraging. Like that brilliant friend who
 * explains things without making you feel stupid for not knowing.
 * Witty in the margins. Serious where it counts.
 */

export const THINKING_MESSAGES: readonly string[] = [
  "Untangling the complicated bits...",
  "Making sense of the chaos...",
  "Finding the simplest path through...",
  "Translating expert-speak into human...",
  "Doing the thinking so you don't have to...",
  "Connecting the dots...",
  "Distilling the essentials...",
  "Building the clearest picture possible...",
  "Almost there — finding the right words...",
  "Reading between the lines of the internet...",
];

export const FOLLOW_UP_THINKING_MESSAGES: readonly string[] = [
  "Digging a little deeper...",
  "Thinking that one through...",
  "Connecting this to what you already know...",
  "Finding the best way to answer that...",
];

export const GENERIC_ERROR_MESSAGES: readonly string[] = [
  "Looks like the AI lost its train of thought. Let's try that one more time.",
  "Something didn't quite work. Give it another shot.",
  "The AI blinked at the wrong moment. One more try should do it.",
  "That one slipped through the cracks. Try again?",
  "A small hiccup. Let's try that again.",
];

export const RATE_LIMIT_MESSAGE =
  "You've been on a roll — slow down just a little and try again in a moment.";

export const AUTH_CONFIG_ERROR_MESSAGE =
  "The AI key seems to be missing or invalid. That's a configuration issue — check the environment variables.";

export const EMPTY_AI_RESPONSE_MESSAGE =
  "The AI returned nothing but silence. Try rephrasing slightly — sometimes that's all it takes.";

export const NETWORK_ERROR_MESSAGE =
  "Can't reach the server right now. Check your connection and try again.";

export const POPUP_BLOCKED_MESSAGE =
  "Your browser blocked the popup. Allow popups for this site and try again.";

export const EMPTY_TOPIC_ERROR = "Pick something you've always wanted to understand.";

export const EMPTY_FOLLOW_UP_ERROR = "Type your question first.";

export const TOPIC_PLACEHOLDER_EXAMPLES: readonly string[] = [
  "How does the internet actually work?",
  "What is quantum entanglement?",
  "Explain compound interest",
  "What happens inside a black hole?",
  "How does CRISPR gene editing work?",
];

export const EMPTY_STATE_HEADING = "Curiosity starts with a question.";

export const EMPTY_STATE_MESSAGE =
  "Pick a voice, type anything you've ever wondered about, and ELI5 will make it click.";

export const FOLLOW_UP_PLACEHOLDER = "What else do you want to know?";

export const HISTORY_EMPTY_MESSAGE =
  "Nothing here yet. Ask about something interesting — it'll live here for next time.";

export const HISTORY_EMPTY_FILTERED_MESSAGE =
  "No results for that search. Try different words, or browse everything.";

export const HISTORY_CLEAR_CONFIRM_TITLE = "Clear your library?";

export const HISTORY_CLEAR_CONFIRM_BODY =
  "This removes every saved explanation from this browser. There's no undo.";

export const FOOTER_TAGLINE = "Making complex things simple — one explanation at a time.";

export const RANDOM_TOPIC_LABEL = "Surprise me";

/** Deterministic-but-rotating message picker — avoids repeating the same line twice in a row. */
export function pickMessage(bank: readonly string[], previous?: string): string {
  if (bank.length === 0) return "";
  if (bank.length === 1) return bank[0]!;
  let next = bank[Math.floor(Math.random() * bank.length)]!;
  let guard = 0;
  while (next === previous && guard < 5) {
    next = bank[Math.floor(Math.random() * bank.length)]!;
    guard += 1;
  }
  return next;
}

export function complexityLabel(value: number): string {
  const labels: Record<number, string> = {
    1: "Crayon-level",
    2: "Kindergarten",
    3: "Curious kid",
    4: "Bright teenager",
    5: "Pub trivia",
    6: "Engaged adult",
    7: "Keen undergrad",
    8: "Grad seminar",
    9: "Domain expert",
    10: "PhD defense",
  };
  return labels[value] ?? "Pub trivia";
}
