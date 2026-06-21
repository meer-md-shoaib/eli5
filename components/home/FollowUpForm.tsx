"use client";

import { useRef, useState, type FormEvent, type KeyboardEvent } from "react";
import { ArrowUp } from "lucide-react";
import { useExplainer } from "@/hooks/useExplainer";
import { FOLLOW_UP_PLACEHOLDER } from "@/lib/copy";

export function FollowUpForm() {
  const { explanation, askFollowUp, followUpStatus, isBusy } = useExplainer();
  const [question, setQuestion] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  if (!explanation) return null;

  const isAsking = followUpStatus === "thinking" || followUpStatus === "streaming";

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!question.trim() || isBusy) return;
    askFollowUp(question);
    setQuestion("");
    textareaRef.current?.focus();
  }

  function handleKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    // Cmd/Ctrl + Enter submits
    if (event.key === "Enter" && (event.metaKey || event.ctrlKey)) {
      event.preventDefault();
      if (!question.trim() || isBusy) return;
      askFollowUp(question);
      setQuestion("");
    }
  }

  return (
    <form className="follow-up-form" onSubmit={handleSubmit} aria-label="Ask a follow-up question">
      <label className="visually-hidden" htmlFor="follow-up-input">Follow-up question</label>
      <div className="follow-up-input-wrap">
        <textarea
          ref={textareaRef}
          id="follow-up-input"
          rows={2}
          maxLength={300}
          placeholder={isAsking ? "Thinking…" : FOLLOW_UP_PLACEHOLDER}
          value={question}
          disabled={isBusy}
          onChange={(e) => setQuestion(e.target.value)}
          onKeyDown={handleKeyDown}
          aria-label="Follow-up question"
        />
        <button
          type="submit"
          className="btn btn-primary"
          disabled={isBusy || !question.trim()}
          aria-label="Ask follow-up"
          style={{ borderRadius: "12px", padding: "0.75rem", alignSelf: "flex-end" }}
        >
          <ArrowUp size={16} aria-hidden="true" />
        </button>
      </div>
      <p style={{ fontSize: "0.72rem", color: "var(--faint)", paddingLeft: "0.25rem" }}>
        ⌘↩ to send
      </p>
    </form>
  );
}
