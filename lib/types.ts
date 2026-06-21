import type { LengthOption } from "./constants";

export type LengthId = LengthOption["id"];

export interface ConversationTurn {
  question: string;
  answer: string;
}

/** Body sent to POST /api/explain for a brand-new explanation. */
export interface ExplainRequestBody {
  topic: string;
  modeId: string;
  complexity: number;
  length: LengthId;
  language: string;
  question?: string;
  previousExplanation?: string;
  conversation?: ConversationTurn[];
}

export interface FollowUp {
  id: string;
  question: string;
  answer: string;
  createdAt: string;
}

/** A fully-formed explanation as stored in history / shown in the UI. */
export interface Explanation {
  id: string;
  topic: string;
  modeId: string;
  complexity: number;
  length: LengthId;
  language: string;
  content: string;
  followUps: FollowUp[];
  createdAt: string;
  favorite: boolean;
  model?: string;
}

export interface ApiErrorPayload {
  error: string;
  requestId?: string;
}
