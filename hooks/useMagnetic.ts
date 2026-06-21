"use client";

import { useEffect, useRef } from "react";

/**
 * Gives an element a subtle "magnetic" pull toward the cursor on hover.
 * No-ops on touch devices and when the user prefers reduced motion.
 */
export function useMagnetic<T extends HTMLElement>(strength = 0.25) {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const canHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!canHover || reducedMotion) return;

    function handleMove(event: PointerEvent) {
      const rect = el!.getBoundingClientRect();
      const mx = event.clientX - (rect.left + rect.width / 2);
      const my = event.clientY - (rect.top + rect.height / 2);
      el!.style.transform = `translate(${mx * strength}px, ${my * (strength + 0.05)}px)`;
    }

    function handleLeave() {
      el!.style.transform = "";
    }

    el.addEventListener("pointermove", handleMove);
    el.addEventListener("pointerleave", handleLeave);
    return () => {
      el.removeEventListener("pointermove", handleMove);
      el.removeEventListener("pointerleave", handleLeave);
    };
  }, [strength]);

  return ref;
}
