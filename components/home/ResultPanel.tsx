"use client";

import { useRef } from "react";
import { Sparkle } from "lucide-react";
import { useExplainer } from "@/hooks/useExplainer";
import { EMPTY_STATE_HEADING, EMPTY_STATE_MESSAGE } from "@/lib/copy";
import { Reveal } from "@/components/ui/Reveal";
import { MarkdownRenderer } from "@/components/markdown/MarkdownRenderer";
import { ResultToolbar } from "./ResultToolbar";
import { ThinkingIndicator } from "./ThinkingIndicator";
import { FollowUpEntries } from "./FollowUpEntries";
import { SmartActionBar } from "./SmartActionBar";
import { FollowUpForm } from "./FollowUpForm";

export function ResultPanel() {
  const {
    explanation,
    mainStatus, mainMessage, liveContent,
    followUpStatus, followUpMessage,
    liveFollowUpQuestion, liveFollowUpAnswer,
  } = useExplainer();

  const contentRef = useRef<HTMLDivElement | null>(null);
  const isActive = mainStatus === "streaming";

  const title =
    mainStatus === "thinking" || mainStatus === "streaming"
      ? "Working on it…"
      : mainStatus === "error"
      ? "Let's try that again."
      : explanation
      ? explanation.topic
      : "Ready when you are.";

  return (
    <Reveal
      as="section"
      className={`result-panel glass-card${isActive ? " is-streaming" : ""}`}
      aria-live="polite"
      aria-label="Explanation result"
      delay={100}
    >
      {/* Toolbar */}
      <div className="result-toolbar">
        <div className="result-heading">
          <span className="result-topic-tag">
            {mainStatus === "thinking" ? "Thinking" :
             mainStatus === "streaming" ? "Writing" :
             explanation ? "Explanation" : "Ready"}
          </span>
          <h2 title={explanation?.topic}>{title}</h2>
        </div>
        <ResultToolbar contentRef={contentRef} />
      </div>

      {/* Thinking state */}
      {mainStatus === "thinking" && (
        <ThinkingIndicator message={mainMessage} />
      )}

      {/* Streaming state */}
      {mainStatus === "streaming" && (
        <div className="result-content">
          <MarkdownRenderer content={liveContent} />
        </div>
      )}

      {/* Error state */}
      {mainStatus === "error" && (
        <div className="empty-state">
          <div className="empty-orbit" aria-hidden="true">
            <span className="orbit-core"><Sparkle size={20} /></span>
            <span className="orbit-ring" />
          </div>
          <div className="error-box" role="alert">{mainMessage}</div>
        </div>
      )}

      {/* Empty idle state */}
      {mainStatus === "idle" && !explanation && (
        <div className="empty-state">
          <div className="empty-orbit" aria-hidden="true">
            <span className="orbit-core"><Sparkle size={22} /></span>
            <span className="orbit-ring" />
          </div>
          <p className="empty-state-heading">{EMPTY_STATE_HEADING}</p>
          <p className="empty-state-body">{EMPTY_STATE_MESSAGE}</p>
        </div>
      )}

      {/* Explanation ready */}
      {mainStatus === "idle" && explanation && (
        <>
          <div className="result-content" ref={contentRef}>
            <MarkdownRenderer content={explanation.content} />
            <FollowUpEntries
              followUps={explanation.followUps}
              followUpStatus={followUpStatus}
              liveQuestion={liveFollowUpQuestion}
              liveAnswer={liveFollowUpAnswer}
              liveMessage={followUpMessage}
            />
          </div>

          {followUpStatus === "error" && (
            <div className="error-box" role="alert">{followUpMessage}</div>
          )}

          <SmartActionBar />
          <FollowUpForm />
        </>
      )}
    </Reveal>
  );
}
