"use client";

import { ArrowRight, Heart } from "lucide-react";
import { MODES } from "@/lib/constants";
import { useExplainer } from "@/hooks/useExplainer";
import type { Explanation } from "@/lib/types";

function modeLabel(modeId: string): string {
  return MODES.find((m) => m.id === modeId)?.label ?? modeId;
}
function modeIcon(modeId: string): string {
  return MODES.find((m) => m.id === modeId)?.icon ?? "📖";
}

export function HistoryCard({ item, excerpt }: { item: Explanation; excerpt: string }) {
  const { loadFromHistory } = useExplainer();

  function handleOpen() {
    loadFromHistory(item.id);
    requestAnimationFrame(() => {
      document.getElementById("workspace")?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }

  const date = new Date(item.createdAt).toLocaleDateString(undefined, {
    month: "short", day: "numeric",
  });

  return (
    <article className="history-card">
      <div>
        <h3>
          {item.topic}
          {item.favorite && (
            <Heart size={13} className="history-favorite-mark" fill="currentColor" aria-label="Saved" />
          )}
        </h3>
        <p className="history-card-excerpt">{excerpt}</p>
      </div>

      <div className="history-meta">
        <span>{modeIcon(item.modeId)} {modeLabel(item.modeId)}</span>
        <span>Level {item.complexity}</span>
        <span>{item.language !== "English" ? item.language : date}</span>
      </div>

      <button
        type="button"
        className="btn btn-secondary history-open-btn"
        onClick={handleOpen}
        aria-label={`Open explanation for ${item.topic}`}
      >
        <span className="btn-label">Open</span>
        <span className="btn-icon btn-icon-trailing" aria-hidden="true">
          <ArrowRight size={13} />
        </span>
      </button>
    </article>
  );
}
