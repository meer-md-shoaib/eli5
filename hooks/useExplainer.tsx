"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import {
  DEFAULT_LANGUAGE,
  DEFAULT_LENGTH_ID,
  DEFAULT_MODE_ID,
  SMART_ACTIONS,
} from "@/lib/constants";
import {
  EMPTY_FOLLOW_UP_ERROR,
  EMPTY_TOPIC_ERROR,
  FOLLOW_UP_THINKING_MESSAGES,
  THINKING_MESSAGES,
  pickMessage,
} from "@/lib/copy";
import { cleanText } from "@/lib/sanitize";
import { streamExplain } from "@/lib/stream-client";
import type { Explanation, ExplainRequestBody, FollowUp, LengthId } from "@/lib/types";
import { useHistory, type UseHistoryReturn } from "./useHistory";

export type AsyncStatus = "idle" | "thinking" | "streaming" | "error";

const THINK_ROTATE_MS = 1700;

interface ExplainerContextValue {
  topicDraft: string;
  setTopicDraft: (topic: string) => void;

  modeId: string;
  setModeId: (id: string) => void;
  complexity: number;
  setComplexity: (value: number) => void;
  lengthId: LengthId;
  setLengthId: (id: LengthId) => void;
  language: string;
  setLanguage: (language: string) => void;

  explanation: Explanation | null;
  mainStatus: AsyncStatus;
  mainMessage: string;
  liveContent: string;
  isBusy: boolean;
  submitTopic: (topic: string) => void;

  followUpStatus: AsyncStatus;
  followUpMessage: string;
  liveFollowUpQuestion: string;
  liveFollowUpAnswer: string;
  askFollowUp: (question: string) => void;
  triggerSmartAction: (actionId: string) => void;

  toggleFavorite: () => void;
  loadFromHistory: (id: string) => void;
  startOver: () => void;
  clearHistory: () => void;

  history: UseHistoryReturn;
}

const ExplainerContext = createContext<ExplainerContextValue | null>(null);

export function ExplainerProvider({ children }: { children: ReactNode }) {
  const history = useHistory();

  const [topicDraft, setTopicDraft] = useState("");
  const [modeId, setModeId] = useState(DEFAULT_MODE_ID);
  const [complexity, setComplexity] = useState(5);
  const [lengthId, setLengthId] = useState<LengthId>(DEFAULT_LENGTH_ID);
  const [language, setLanguage] = useState(DEFAULT_LANGUAGE);

  const [explanation, setExplanation] = useState<Explanation | null>(null);

  const [mainStatus, setMainStatus] = useState<AsyncStatus>("idle");
  const [mainMessage, setMainMessage] = useState("");
  const [liveContent, setLiveContent] = useState("");

  const [followUpStatus, setFollowUpStatus] = useState<AsyncStatus>("idle");
  const [followUpMessage, setFollowUpMessage] = useState("");
  const [liveFollowUpQuestion, setLiveFollowUpQuestion] = useState("");
  const [liveFollowUpAnswer, setLiveFollowUpAnswer] = useState("");

  const mainAbortRef = useRef<AbortController | null>(null);
  const followUpAbortRef = useRef<AbortController | null>(null);
  const mainThinkInterval = useRef<ReturnType<typeof setInterval> | null>(null);
  const followUpThinkInterval = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    return () => {
      mainAbortRef.current?.abort();
      followUpAbortRef.current?.abort();
      if (mainThinkInterval.current) clearInterval(mainThinkInterval.current);
      if (followUpThinkInterval.current) clearInterval(followUpThinkInterval.current);
    };
  }, []);

  const submitTopic = useCallback(
    (rawTopic: string) => {
      const topic = cleanText(rawTopic);
      if (!topic) {
        setMainStatus("error");
        setMainMessage(EMPTY_TOPIC_ERROR);
        return;
      }

      mainAbortRef.current?.abort();
      const controller = new AbortController();
      mainAbortRef.current = controller;

      setLiveContent("");
      setMainStatus("thinking");
      let currentMsg = pickMessage(THINKING_MESSAGES);
      setMainMessage(currentMsg);
      if (mainThinkInterval.current) clearInterval(mainThinkInterval.current);
      mainThinkInterval.current = setInterval(() => {
        currentMsg = pickMessage(THINKING_MESSAGES, currentMsg);
        setMainMessage(currentMsg);
      }, THINK_ROTATE_MS);

      const capturedSettings = { topic, modeId, complexity, lengthId, language };
      const payload: ExplainRequestBody = {
        topic,
        modeId,
        complexity,
        length: lengthId,
        language,
      };

      streamExplain(payload, {
        signal: controller.signal,
        onChunk: (full) => {
          if (mainThinkInterval.current) {
            clearInterval(mainThinkInterval.current);
            mainThinkInterval.current = null;
          }
          setMainStatus("streaming");
          setLiveContent(full);
        },
      })
        .then(({ content, model }) => {
          const record: Explanation = {
            id: crypto.randomUUID(),
            topic: capturedSettings.topic,
            modeId: capturedSettings.modeId,
            complexity: capturedSettings.complexity,
            length: capturedSettings.lengthId,
            language: capturedSettings.language,
            content,
            followUps: [],
            createdAt: new Date().toISOString(),
            favorite: false,
            model,
          };
          setExplanation(record);
          history.upsert(record);
          setMainStatus("idle");
          setLiveContent("");
        })
        .catch((error: unknown) => {
          if (controller.signal.aborted) return;
          setMainStatus("error");
          setMainMessage(error instanceof Error ? error.message : "Something went wrong.");
        })
        .finally(() => {
          if (mainThinkInterval.current) {
            clearInterval(mainThinkInterval.current);
            mainThinkInterval.current = null;
          }
        });
    },
    [modeId, complexity, lengthId, language, history]
  );

  const askFollowUp = useCallback(
    (rawQuestion: string) => {
      const question = cleanText(rawQuestion);
      const snapshot = explanation;

      if (!snapshot) return;

      if (!question) {
        setFollowUpStatus("error");
        setFollowUpMessage(EMPTY_FOLLOW_UP_ERROR);
        return;
      }

      followUpAbortRef.current?.abort();
      const controller = new AbortController();
      followUpAbortRef.current = controller;

      setLiveFollowUpQuestion(question);
      setLiveFollowUpAnswer("");
      setFollowUpStatus("thinking");
      let currentMsg = pickMessage(FOLLOW_UP_THINKING_MESSAGES);
      setFollowUpMessage(currentMsg);
      if (followUpThinkInterval.current) clearInterval(followUpThinkInterval.current);
      followUpThinkInterval.current = setInterval(() => {
        currentMsg = pickMessage(FOLLOW_UP_THINKING_MESSAGES, currentMsg);
        setFollowUpMessage(currentMsg);
      }, THINK_ROTATE_MS);

      const payload: ExplainRequestBody = {
        topic: snapshot.topic,
        modeId: snapshot.modeId,
        complexity: snapshot.complexity,
        length: snapshot.length,
        language: snapshot.language,
        question,
        previousExplanation: snapshot.content,
        conversation: snapshot.followUps.map((item) => ({
          question: item.question,
          answer: item.answer,
        })),
      };

      streamExplain(payload, {
        signal: controller.signal,
        onChunk: (full) => {
          if (followUpThinkInterval.current) {
            clearInterval(followUpThinkInterval.current);
            followUpThinkInterval.current = null;
          }
          setFollowUpStatus("streaming");
          setLiveFollowUpAnswer(full);
        },
      })
        .then(({ content }) => {
          const newFollowUp: FollowUp = {
            id: crypto.randomUUID(),
            question,
            answer: content,
            createdAt: new Date().toISOString(),
          };
          setExplanation((current) => {
            if (!current || current.id !== snapshot.id) return current;
            const updated = { ...current, followUps: [...current.followUps, newFollowUp] };
            history.upsert(updated);
            return updated;
          });
          setFollowUpStatus("idle");
          setLiveFollowUpQuestion("");
          setLiveFollowUpAnswer("");
        })
        .catch((error: unknown) => {
          if (controller.signal.aborted) return;
          setFollowUpStatus("error");
          setFollowUpMessage(error instanceof Error ? error.message : "Something went wrong.");
        })
        .finally(() => {
          if (followUpThinkInterval.current) {
            clearInterval(followUpThinkInterval.current);
            followUpThinkInterval.current = null;
          }
        });
    },
    [explanation, history]
  );

  const triggerSmartAction = useCallback(
    (actionId: string) => {
      const action = SMART_ACTIONS.find((item) => item.id === actionId);
      if (!action) return;
      askFollowUp(action.prompt);
    },
    [askFollowUp]
  );

  const toggleFavorite = useCallback(() => {
    setExplanation((current) => {
      if (!current) return current;
      const updated = { ...current, favorite: !current.favorite };
      history.upsert(updated);
      return updated;
    });
  }, [history]);

  const loadFromHistory = useCallback(
    (id: string) => {
      const item = history.findById(id);
      if (!item) return;
      mainAbortRef.current?.abort();
      followUpAbortRef.current?.abort();
      setExplanation(item);
      setTopicDraft(item.topic);
      setMainStatus("idle");
      setFollowUpStatus("idle");
      setLiveContent("");
      setLiveFollowUpQuestion("");
      setLiveFollowUpAnswer("");
    },
    [history]
  );

  const startOver = useCallback(() => {
    mainAbortRef.current?.abort();
    followUpAbortRef.current?.abort();
    setExplanation(null);
    setMainStatus("idle");
    setFollowUpStatus("idle");
    setLiveContent("");
    setLiveFollowUpQuestion("");
    setLiveFollowUpAnswer("");
  }, []);

  const clearHistory = useCallback(() => {
    history.clear();
    startOver();
  }, [history, startOver]);

  const isBusy =
    mainStatus === "thinking" ||
    mainStatus === "streaming" ||
    followUpStatus === "thinking" ||
    followUpStatus === "streaming";

  const value: ExplainerContextValue = {
    topicDraft,
    setTopicDraft,

    modeId,
    setModeId,
    complexity,
    setComplexity,
    lengthId,
    setLengthId,
    language,
    setLanguage,

    explanation,
    mainStatus,
    mainMessage,
    liveContent,
    isBusy,
    submitTopic,

    followUpStatus,
    followUpMessage,
    liveFollowUpQuestion,
    liveFollowUpAnswer,
    askFollowUp,
    triggerSmartAction,

    toggleFavorite,
    loadFromHistory,
    startOver,
    clearHistory,

    history,
  };

  return <ExplainerContext.Provider value={value}>{children}</ExplainerContext.Provider>;
}

export function useExplainer(): ExplainerContextValue {
  const context = useContext(ExplainerContext);
  if (!context) throw new Error("useExplainer must be used within ExplainerProvider");
  return context;
}
