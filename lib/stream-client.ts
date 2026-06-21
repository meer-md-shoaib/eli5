import { AUTH_CONFIG_ERROR_MESSAGE, EMPTY_AI_RESPONSE_MESSAGE, GENERIC_ERROR_MESSAGES, NETWORK_ERROR_MESSAGE, RATE_LIMIT_MESSAGE, pickMessage } from "./copy";
import type { ExplainRequestBody } from "./types";

export interface StreamExplainResult {
  content: string;
  model?: string;
}

export interface StreamExplainOptions {
  signal: AbortSignal;
  /** Called every time new text arrives, with the full accumulated text so far. */
  onChunk: (accumulated: string) => void;
}

function fallbackMessageForStatus(status: number): string {
  if (status === 400) return "Check your topic and settings, then try again.";
  if (status === 401 || status === 403) return AUTH_CONFIG_ERROR_MESSAGE;
  if (status === 429) return RATE_LIMIT_MESSAGE;
  if (status === 504) return "That took too long and timed out. Try a shorter topic.";
  return pickMessage(GENERIC_ERROR_MESSAGES);
}

export async function streamExplain(
  payload: ExplainRequestBody,
  options: StreamExplainOptions
): Promise<StreamExplainResult> {
  let response: Response;
  try {
    response = await fetch("/api/explain", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      signal: options.signal,
    });
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") throw error;
    throw new Error(NETWORK_ERROR_MESSAGE);
  }

  if (!response.ok) {
    const data = await response.json().catch(() => ({}) as { error?: string });
    throw new Error(data.error || fallbackMessageForStatus(response.status));
  }

  if (!response.body) {
    throw new Error(EMPTY_AI_RESPONSE_MESSAGE);
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let full = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    full += decoder.decode(value, { stream: true });
    if (full) options.onChunk(full);
  }

  if (!full.trim()) {
    throw new Error(EMPTY_AI_RESPONSE_MESSAGE);
  }

  return { content: full, model: response.headers.get("X-Model") ?? undefined };
}
