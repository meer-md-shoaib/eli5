/**
 * Single source of truth for everything that both the UI and the API route
 * need to agree on. Importing the same constants on both sides means the
 * dropdown in the browser can never drift out of sync with what the server
 * is willing to accept.
 */

export interface ExplanationMode {
  id: string;
  label: string;
  icon: string;
  /** Shown as a small hint under the mode button. */
  tagline: string;
  /** Folded into the system prompt so the AI actually commits to the bit. */
  promptHint: string;
}

export const MODES: readonly ExplanationMode[] = [
  {
    id: "eli5",
    label: "Explain Like I'm 5",
    icon: "🧒",
    tagline: "Crayons, not jargon",
    promptHint:
      "Explain this the way you'd explain it to a curious five-year-old: short sentences, everyday words, and one vivid, concrete analogy. Skip jargon entirely, or define it in the same breath you use it.",
  },
  {
    id: "high-school",
    label: "High School",
    icon: "🎓",
    tagline: "Pop quiz ready",
    promptHint:
      "Explain this clearly for a motivated high schooler. Define key vocabulary the first time it appears, use relatable comparisons, and keep the structure easy to follow without dumbing down the substance.",
  },
  {
    id: "programmer",
    label: "Programmer",
    icon: "👩‍💻",
    tagline: "Thinks in functions",
    promptHint:
      "Explain this to a software engineer. Lean on programming analogies, systems thinking, and precise terminology. Use a short code snippet or pseudocode only if it genuinely clarifies the idea.",
  },
  {
    id: "funny",
    label: "Funny",
    icon: "😂",
    tagline: "Comedy, with footnotes",
    promptHint:
      "Explain this with genuine wit: playful asides, a joke or two, maybe a deadpan tangent. Stay accurate underneath the humor — the jokes are garnish, not a replacement for the explanation.",
  },
  {
    id: "story",
    label: "Story",
    icon: "📖",
    tagline: "Once upon a fact",
    promptHint:
      "Frame this as a short, engaging narrative with a beginning, middle, and end — characters, stakes, a little tension — while keeping every fact accurate. The story is the delivery mechanism, not a distraction from it.",
  },
  {
    id: "analogy",
    label: "Analogy",
    icon: "🎭",
    tagline: "Everything is like something",
    promptHint:
      "Build the entire explanation around one strong central analogy, extending it consistently through every section so the comparison does most of the explaining.",
  },
  {
    id: "wizard",
    label: "Wizard",
    icon: "🧙",
    tagline: "Ancient & arcane",
    promptHint:
      "Speak like a wise, slightly theatrical wizard imparting ancient knowledge — call it 'magic', 'spells', or 'enchantments' where it fits naturally — while the actual facts underneath remain completely accurate.",
  },
  {
    id: "pirate",
    label: "Pirate",
    icon: "🏴‍☠️",
    tagline: "Yarrr, technically correct",
    promptHint:
      "Speak like a swashbuckling pirate captain — nautical slang, 'arrr's, treasure metaphors — without ever sacrificing factual accuracy. Keep it readable, not a wall of phonetic pirate-speak.",
  },
  {
    id: "grandma",
    label: "Grandma",
    icon: "🧶",
    tagline: "Tea and patience",
    promptHint:
      "Explain this warmly and patiently, the way a beloved grandparent would over tea — gentle pacing, comforting comparisons to everyday life, no condescension.",
  },
  {
    id: "robot",
    label: "Robot",
    icon: "🤖",
    tagline: "Beep. Boop. Accurate.",
    promptHint:
      "Speak like a precise, logical, faintly deadpan robot. Systematic structure, exact language, the occasional dry observation about humans. Zero fluff.",
  },
] as const;

export const DEFAULT_MODE_ID = MODES[0]!.id;

export interface LengthOption {
  id: "brief" | "balanced" | "deep";
  label: string;
  description: string;
  wordGuide: string;
  maxTokens: number;
}

export const LENGTHS: readonly LengthOption[] = [
  {
    id: "brief",
    label: "Brief",
    description: "Just the headline",
    wordGuide: "Keep the full answer tight: roughly 200-350 words.",
    maxTokens: 700,
  },
  {
    id: "balanced",
    label: "Balanced",
    description: "The Goldilocks zone",
    wordGuide: "Use a practical amount of detail: roughly 450-750 words.",
    maxTokens: 1100,
  },
  {
    id: "deep",
    label: "Deep dive",
    description: "For overachievers",
    wordGuide: "Go deeper with real nuance, but stay readable: roughly 850-1300 words.",
    maxTokens: 1800,
  },
] as const;

export const DEFAULT_LENGTH_ID = "balanced" satisfies LengthOption["id"];

export interface LanguageOption {
  code: string;
  label: string;
  flag: string;
  /** BCP-47 tag used for the Web Speech API. */
  speechCode: string;
}

export const LANGUAGES: readonly LanguageOption[] = [
  { code: "English", label: "English", flag: "🇺🇸", speechCode: "en-US" },
  { code: "Spanish", label: "Español", flag: "🇪🇸", speechCode: "es-ES" },
  { code: "French", label: "Français", flag: "🇫🇷", speechCode: "fr-FR" },
  { code: "German", label: "Deutsch", flag: "🇩🇪", speechCode: "de-DE" },
  { code: "Italian", label: "Italiano", flag: "🇮🇹", speechCode: "it-IT" },
  { code: "Portuguese", label: "Português", flag: "🇵🇹", speechCode: "pt-PT" },
  { code: "Hindi", label: "हिन्दी", flag: "🇮🇳", speechCode: "hi-IN" },
  { code: "Japanese", label: "日本語", flag: "🇯🇵", speechCode: "ja-JP" },
  { code: "Korean", label: "한국어", flag: "🇰🇷", speechCode: "ko-KR" },
  { code: "Mandarin Chinese", label: "中文", flag: "🇨🇳", speechCode: "zh-CN" },
  { code: "Arabic", label: "العربية", flag: "🇸🇦", speechCode: "ar-SA" },
] as const;

export const DEFAULT_LANGUAGE = "English";

export const EXAMPLE_TOPICS: readonly string[] = [
  "Blockchain",
  "Docker",
  "React",
  "Black holes",
  "Taxes",
  "Inflation",
  "Photosynthesis",
  "Kubernetes",
  "AI agents",
  "Compound interest",
];

export const RANDOM_TOPICS: readonly string[] = [
  "CRISPR gene editing",
  "Compound interest",
  "Neural networks",
  "Supply chains",
  "Time dilation",
  "Zero-trust security",
  "Carbon capture",
  "Event loops",
  "Game theory",
  "The immune system",
  "Quantum entanglement",
  "How vaccines work",
  "The stock market",
  "Why the sky is blue",
  "How Wi-Fi works",
];

export interface SmartAction {
  id: "simpler" | "deeper" | "analogy" | "example" | "quiz";
  label: string;
  icon: string;
  prompt: string;
}

export const SMART_ACTIONS: readonly SmartAction[] = [
  {
    id: "simpler",
    label: "Dumb it down",
    icon: "🫧",
    prompt: "Explain that again, but even simpler — like I'm genuinely five years old this time.",
  },
  {
    id: "deeper",
    label: "Nerd mode",
    icon: "🔬",
    prompt: "Go deeper. Give me the advanced details and nuance you held back the first time.",
  },
  {
    id: "analogy",
    label: "New analogy",
    icon: "🎭",
    prompt: "That analogy didn't land for me. Give me a completely different one.",
  },
  {
    id: "example",
    label: "Real example",
    icon: "🌍",
    prompt: "Give me a concrete, real-world example of this in action.",
  },
  {
    id: "quiz",
    label: "Pop quiz",
    icon: "🧩",
    prompt: "Quiz me with 3 short questions about this, then reveal the answers.",
  },
] as const;

export const MAX_TOPIC_LENGTH = 180;
export const MAX_QUESTION_LENGTH = 300;
export const MAX_PREVIOUS_EXPLANATION_LENGTH = 8000;
export const MAX_CONVERSATION_TURNS = 8;
export const CONVERSATION_CONTEXT_WINDOW = 6;
export const MAX_HISTORY_ITEMS = 40;
