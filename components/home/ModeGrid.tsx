"use client";

import { useRef, type KeyboardEvent } from "react";
import { MODES } from "@/lib/constants";
import { useExplainer } from "@/hooks/useExplainer";

const COLUMNS = 2;

export function ModeGrid() {
  const { modeId, setModeId } = useExplainer();
  const buttonRefs = useRef<Map<string, HTMLButtonElement>>(new Map());

  function focusAndSelect(id: string) {
    setModeId(id);
    buttonRefs.current.get(id)?.focus();
  }

  function handleKeyDown(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    const directions: Record<string, number> = {
      ArrowRight: 1,
      ArrowLeft: -1,
      ArrowDown: COLUMNS,
      ArrowUp: -COLUMNS,
    };
    const delta = directions[event.key];
    if (delta === undefined) return;

    event.preventDefault();
    const nextIndex = (index + delta + MODES.length) % MODES.length;
    const next = MODES[nextIndex];
    if (next) focusAndSelect(next.id);
  }

  return (
    <div className="mode-grid" role="radiogroup" aria-label="Explanation voice">
      {MODES.map((mode, index) => (
        <button
          key={mode.id}
          ref={(node) => {
            if (node) buttonRefs.current.set(mode.id, node);
            else buttonRefs.current.delete(mode.id);
          }}
          type="button"
          role="radio"
          aria-checked={mode.id === modeId}
          tabIndex={mode.id === modeId ? 0 : -1}
          className="mode-button"
          title={mode.tagline}
          onClick={() => setModeId(mode.id)}
          onKeyDown={(event) => handleKeyDown(event, index)}
        >
          <span className="mode-icon" aria-hidden="true">
            {mode.icon}
          </span>
          <span className="mode-label">{mode.label}</span>
          <span className="mode-tagline">{mode.tagline}</span>
        </button>
      ))}
    </div>
  );
}
