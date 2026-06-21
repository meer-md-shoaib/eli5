import { NextRequest } from "next/server";
import { buildMessages, maxTokensForLength } from "@/lib/prompts";
import { parseExplainRequest, ValidationError } from "@/lib/validation";
import { checkRateLimit, getClientKey } from "@/lib/rate-limit";
import { chatStreamToTextStream, getAiClient, getAiModel, toHttpError } from "@/lib/ai";
import { HttpError } from "@/lib/http-error";
import { EMPTY_AI_RESPONSE_MESSAGE } from "@/lib/copy";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function securityHeaders(): HeadersInit {
  return {
    "X-Content-Type-Options": "nosniff",
    "Referrer-Policy": "strict-origin-when-cross-origin",
    "Cache-Control": "no-store",
  };
}

function jsonError(message: string, status: number, requestId: string) {
  return Response.json(
    { error: message, requestId },
    { status, headers: securityHeaders() }
  );
}

export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: {
      ...securityHeaders(),
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}

export async function POST(request: NextRequest) {
  const requestId = crypto.randomUUID();

  const clientKey = getClientKey(request.headers);
  const rateLimit = checkRateLimit(clientKey);
  if (!rateLimit.allowed) {
    return jsonError(
      "Whoa, slow down there. You've out-asked the rate limit — give it a moment and try again.",
      429,
      requestId
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return jsonError("That request body wasn't valid JSON.", 400, requestId);
  }

  let input;
  try {
    input = parseExplainRequest(body);
  } catch (error) {
    if (error instanceof ValidationError) {
      return jsonError(error.message, error.statusCode, requestId);
    }
    return jsonError("That request doesn't look right.", 400, requestId);
  }

  try {
    const client = getAiClient();
    const messages = buildMessages(input);

    const stream = await client.chat.completions.create({
      model: getAiModel(),
      messages,
      temperature: 0.72,
      stream: true,
    });

    const textStream = chatStreamToTextStream(stream);

    return new Response(textStream, {
      status: 200,
      headers: {
        ...securityHeaders(),
        "Content-Type": "text/plain; charset=utf-8",
        "X-Model": getAiModel(),
        "X-Request-Id": requestId,
      },
    });
  } catch (error) {
    const httpError = error instanceof HttpError ? error : toHttpError(error);
    console.error(`[explain:${requestId}]`, httpError.statusCode, httpError.message);
    return jsonError(httpError.message || EMPTY_AI_RESPONSE_MESSAGE, httpError.statusCode, requestId);
  }
}
