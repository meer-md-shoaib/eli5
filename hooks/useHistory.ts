"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { MAX_HISTORY_ITEMS } from "@/lib/constants";
import { loadHistory, saveHistory } from "@/lib/storage";
import { cleanText, excerpt, stripMarkdown } from "@/lib/sanitize";
import type { Explanation } from "@/lib/types";

export function useHistory() {
  const [history, setHistory] = useState<Explanation[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    // Reading localStorage has to happen after mount — it doesn't exist
    // during SSR, and reading it during render would desync server/client.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setHistory(loadHistory());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) saveHistory(history);
  }, [history, hydrated]);

  const upsert = useCallback((explanation: Explanation) => {
    setHistory((previous) => {
      const next = [explanation, ...previous.filter((item) => item.id !== explanation.id)];
      return next.slice(0, MAX_HISTORY_ITEMS);
    });
  }, []);

  const toggleFavorite = useCallback((id: string) => {
    setHistory((previous) =>
      previous.map((item) => (item.id === id ? { ...item, favorite: !item.favorite } : item))
    );
  }, []);

  const clear = useCallback(() => {
    setHistory([]);
  }, []);

  const findById = useCallback(
    (id: string) => history.find((item) => item.id === id) ?? null,
    [history]
  );

  const filtered = useMemo(() => {
    const query = cleanText(searchQuery).toLowerCase();
    return history.filter((item) => {
      const haystack = `${item.topic} ${item.modeId} ${stripMarkdown(item.content)}`.toLowerCase();
      const matchesSearch = !query || haystack.includes(query);
      const matchesFavorite = !showFavoritesOnly || item.favorite;
      return matchesSearch && matchesFavorite;
    });
  }, [history, searchQuery, showFavoritesOnly]);

  return {
    history,
    filtered,
    searchQuery,
    setSearchQuery,
    showFavoritesOnly,
    toggleFavoritesOnly: () => setShowFavoritesOnly((value) => !value),
    upsert,
    toggleFavorite,
    clear,
    findById,
    excerptOf: (item: Explanation) => excerpt(stripMarkdown(item.content), 120),
  };
}

export type UseHistoryReturn = ReturnType<typeof useHistory>;
