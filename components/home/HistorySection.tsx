"use client";

import { useState } from "react";
import { Search, Star, Trash2 } from "lucide-react";
import { useExplainer } from "@/hooks/useExplainer";
import { HISTORY_CLEAR_CONFIRM_BODY, HISTORY_CLEAR_CONFIRM_TITLE, HISTORY_EMPTY_FILTERED_MESSAGE, HISTORY_EMPTY_MESSAGE } from "@/lib/copy";
import { Reveal } from "@/components/ui/Reveal";
import { Button } from "@/components/ui/Button";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { HistoryCard } from "./HistoryCard";

export function HistorySection() {
  const { history, clearHistory } = useExplainer();
  const { history: rawHistory, filtered, searchQuery, setSearchQuery, showFavoritesOnly, toggleFavoritesOnly, excerptOf } =
    history;
  const [confirmOpen, setConfirmOpen] = useState(false);

  return (
    <section className="history-section section-shell" id="history" aria-labelledby="history-title">
      <Reveal className="section-heading">
        <span className="eyebrow">Your library</span>
        <h2 id="history-title">Everything you&apos;ve learned.</h2>
      </Reveal>

      <Reveal as="div" className="history-tools glass-card" delay={60}>
        <label className="field search-history-field">
          <span>Search history</span>
          <div className="search-input-wrap">
            <Search size={15} aria-hidden="true" />
            <input
              type="search"
              placeholder="Search saved explanations"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
            />
          </div>
        </label>
        <div className="history-actions">
          <Button
            variant="secondary"
            type="button"
            icon={<Star size={14} fill={showFavoritesOnly ? "currentColor" : "none"} />}
            iconPosition="leading"
            onClick={toggleFavoritesOnly}
          >
            {showFavoritesOnly ? "All history" : "Favorites"}
          </Button>
          <Button
            variant="danger-ghost"
            type="button"
            icon={<Trash2 size={14} />}
            iconPosition="leading"
            disabled={rawHistory.length === 0}
            onClick={() => setConfirmOpen(true)}
          >
            Clear history
          </Button>
        </div>
      </Reveal>

      <Reveal as="div" className="history-list" delay={100}>
        {filtered.length === 0 ? (
          <p className="muted-note">{rawHistory.length === 0 ? HISTORY_EMPTY_MESSAGE : HISTORY_EMPTY_FILTERED_MESSAGE}</p>
        ) : (
          filtered.map((item) => <HistoryCard key={item.id} item={item} excerpt={excerptOf(item)} />)
        )}
      </Reveal>

      <ConfirmDialog
        open={confirmOpen}
        title={HISTORY_CLEAR_CONFIRM_TITLE}
        body={HISTORY_CLEAR_CONFIRM_BODY}
        confirmLabel="Clear it all"
        onConfirm={() => {
          clearHistory();
          setConfirmOpen(false);
        }}
        onCancel={() => setConfirmOpen(false)}
      />
    </section>
  );
}
