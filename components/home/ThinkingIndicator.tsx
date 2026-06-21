"use client";

import { useEffect, useRef, useState } from "react";

interface ThinkingIndicatorProps {
  message: string;
  compact?: boolean;
}

export function ThinkingIndicator({ message, compact = false }: ThinkingIndicatorProps) {
  const [displayMsg, setDisplayMsg] = useState(message);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Fade out → swap message → fade in on every message change
  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      setDisplayMsg(message);
    }, 200);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [message]);

  return (
    <div
      className={`thinking-wrap${compact ? " compact" : ""}`}
      aria-live="polite"
      aria-label="Loading"
    >
      <div className={`think-orb-wrap${compact ? " compact" : ""}`} aria-hidden="true">
        <span className="think-ring" />
        <span className="think-ring" />
        <span className="think-dot-inner">
          <span className="think-dot" />
        </span>
      </div>

      <p className="think-message" key={displayMsg}>
        {displayMsg}
      </p>

      {!compact && (
        <div className="skeleton-lines" aria-hidden="true">
          <span className="skeleton-line" />
          <span className="skeleton-line" />
          <span className="skeleton-line" />
          <span className="skeleton-line" />
        </div>
      )}
    </div>
  );
}
