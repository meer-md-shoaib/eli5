import { z } from "zod";
import {
  LANGUAGES,
  LENGTHS,
  MAX_CONVERSATION_TURNS,
  MAX_PREVIOUS_EXPLANATION_LENGTH,
  MAX_QUESTION_LENGTH,
  MAX_TOPIC_LENGTH,
  MODES,
} from "./constants";
import { cleanLongText, cleanText } from "./sanitize";

const MODE_IDS = MODES.map((mode) => mode.id) as [string, ...string[]];
const LENGTH_IDS = LENGTHS.map((length) => length.id) as [string, ...string[]];
const LANGUAGE_CODES = LANGUAGES.map((language) => language.code) as [string, ...string[]];

const conversationTurnSchema = z.object({
  question: z.string().transform((value) => cleanText(value).slice(0, MAX_QUESTION_LENGTH)),
  answer: z.string().transform((value) => cleanLongText(value, 2000)),
});

export const explainRequestSchema = z
  .object({
    topic: z
      .string({ error: "Topic is required." })
      .transform((value) => cleanText(value))
      .pipe(
        z
          .string()
          .min(1, "Feed me a topic. Even one word is enough to start.")
          .max(MAX_TOPIC_LENGTH, `Keep the topic under ${MAX_TOPIC_LENGTH} characters — save the essay for the explanation.`)
      ),
    modeId: z.enum(MODE_IDS, { error: "That explanation style doesn't exist. Pick one from the list." }),
    complexity: z.coerce
      .number({ error: "Complexity must be a number." })
      .int("Complexity must be a whole number from 1 to 10.")
      .min(1, "Complexity must be at least 1.")
      .max(10, "Complexity tops out at 10 — even we have limits."),
    length: z.enum(LENGTH_IDS, { error: "That's not a length we offer." }),
    language: z.enum(LANGUAGE_CODES, { error: "That language isn't supported yet." }),
    question: z
      .string()
      .optional()
      .transform((value) => (value ? cleanText(value).slice(0, MAX_QUESTION_LENGTH) : undefined)),
    previousExplanation: z
      .string()
      .optional()
      .transform((value) => (value ? cleanLongText(value, MAX_PREVIOUS_EXPLANATION_LENGTH) : undefined)),
    conversation: z.array(conversationTurnSchema).max(MAX_CONVERSATION_TURNS).optional().default([]),
  })
  .refine((data) => !data.question || !!data.previousExplanation, {
    message: "A follow-up question needs the original explanation alongside it.",
    path: ["question"],
  });

export type ExplainRequestInput = z.infer<typeof explainRequestSchema>;

export class ValidationError extends Error {
  readonly statusCode = 400;
  constructor(message: string) {
    super(message);
    this.name = "ValidationError";
  }
}

/** Parses and validates a raw request body, throwing a friendly ValidationError on failure. */
export function parseExplainRequest(body: unknown): ExplainRequestInput {
  if (typeof body !== "object" || body === null || Array.isArray(body)) {
    throw new ValidationError("That request body doesn't look like a topic request.");
  }

  const result = explainRequestSchema.safeParse(body);
  if (!result.success) {
    const firstIssue = result.error.issues[0];
    throw new ValidationError(firstIssue?.message ?? "That request doesn't look right.");
  }
  return result.data;
}
