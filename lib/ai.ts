import OpenAI from "openai";
import { HttpError } from "./http-error";
import { AUTH_CONFIG_ERROR_MESSAGE, RATE_LIMIT_MESSAGE } from "./copy";

let cachedClient: OpenAI | null = null;

export function getAiModel(): string {
  return process.env.OPENAI_MODEL || "gpt-4o-mini";
}

export function getAiClient(): OpenAI {
  if (!process.env.OPENAI_API_KEY) {
    throw new HttpError(500, AUTH_CONFIG_ERROR_MESSAGE);
  }

  if (!cachedClient) {
    cachedClient = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
      baseURL: process.env.OPENAI_BASE_URL || undefined,
    });
  }

  return cachedClient;
}

/**
 * Maps SDK/provider failures onto an HttpError with a status code and a
 * message that's safe (and pleasant) to show directly in the UI.
 */
export function toHttpError(error: unknown): HttpError {
  if (error instanceof HttpError) return error;

  if (error instanceof OpenAI.APIError) {
    const status = error.status ?? 502;
    if (status === 401 || status === 403) {
      return new HttpError(401, AUTH_CONFIG_ERROR_MESSAGE);
    }
    if (status === 429) {
      return new HttpError(429, RATE_LIMIT_MESSAGE);
    }
    if (status >= 400 && status < 500) {
      return new HttpError(400, error.message || "The AI provider rejected that request.");
    }
    return new HttpError(502, "The AI provider is having a moment. Try again shortly.");
  }

  if (error instanceof Error && error.name === "AbortError") {
    return new HttpError(504, "The request took too long and timed out. Try a shorter topic or try again.");
  }

  return new HttpError(500, "Unable to generate an explanation right now.");
}

/**
 * Converts the OpenAI SDK's async streaming iterable into a Web
 * ReadableStream of raw UTF-8 text chunks, suitable for a Next.js
 * Response body. Only the text deltas are forwarded — no SSE framing —
 * so the client can read it with a plain text decoder.
 */
export function chatStreamToTextStream(
  stream: AsyncIterable<OpenAI.Chat.Completions.ChatCompletionChunk>
): ReadableStream<Uint8Array> {
  const encoder = new TextEncoder();

  return new ReadableStream<Uint8Array>({
    async start(controller) {
      try {
        for await (const chunk of stream) {
          const delta = chunk.choices?.[0]?.delta?.content;
          if (delta) {
            controller.enqueue(encoder.encode(delta));
          }
        }
        controller.close();
      } catch (error) {
        // The stream already started, so we can't switch to a JSON error
        // response at this point. Surface something readable in-band
        // instead of just dying silently mid-paragraph.
        const httpError = toHttpError(error);
        controller.enqueue(
          encoder.encode(`\n\n> ⚠️ The stream cut out: ${httpError.message}`)
        );
        controller.close();
      }
    },
  });
}
