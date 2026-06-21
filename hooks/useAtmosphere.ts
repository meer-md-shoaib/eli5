"use client";

import { useCallback } from "react";

interface AtmosphereRule {
  atmos: string;
  keywords: readonly string[];
}

const ATMOSPHERE_RULES: readonly AtmosphereRule[] = [
  {
    atmos: "space",
    keywords: ["black hole", "space", "universe", "galaxy", "star", "planet", "cosmos", "gravity", "relativity", "astro", "moon", "orbit"],
  },
  {
    atmos: "ocean",
    keywords: ["ocean", "sea", "water", "wave", "marine", "fish", "tide", "coral", "river"],
  },
  {
    atmos: "ai",
    keywords: ["ai", "neural", "machine learning", "agent", "model", "algorithm", "data", "blockchain", "bitcoin", "crypto", "docker", "kubernetes", "react", "code", "software", "computer", "internet", "wifi"],
  },
  {
    atmos: "nature",
    keywords: ["plant", "tree", "photosynthesis", "forest", "nature", "green", "ecosystem", "immune", "cell", "biology", "gene", "crispr", "vaccine", "evolution"],
  },
  {
    atmos: "fire",
    keywords: ["fire", "volcano", "heat", "energy", "combustion", "sun", "flame", "carbon", "nuclear"],
  },
  {
    atmos: "money",
    keywords: ["tax", "inflation", "interest", "stock", "market", "economy", "money", "loan", "bank", "currency"],
  },
];

function matchAtmosphere(text: string): string | null {
  const normalized = text.toLowerCase();
  if (!normalized.trim()) return null;
  const match = ATMOSPHERE_RULES.find((rule) => rule.keywords.some((keyword) => normalized.includes(keyword)));
  return match?.atmos ?? null;
}

export function useAtmosphere() {
  const setFromText = useCallback((text: string) => {
    if (typeof document === "undefined") return;
    const atmos = matchAtmosphere(text);
    if (atmos) {
      document.documentElement.dataset.atmos = atmos;
    } else {
      delete document.documentElement.dataset.atmos;
    }
  }, []);

  return { setFromText };
}
