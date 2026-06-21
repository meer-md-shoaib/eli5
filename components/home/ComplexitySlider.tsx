"use client";

import { useExplainer } from "@/hooks/useExplainer";
import { complexityLabel } from "@/lib/copy";

export function ComplexitySlider() {
  const { complexity, setComplexity } = useExplainer();
  const pct = ((complexity - 1) / 9) * 100;

  return (
    <div className="slider-card">
      <div className="slider-label">
        <span>Complexity</span>
        <strong className="slider-value">{complexity}</strong>
      </div>
      <input
        type="range"
        min={1}
        max={10}
        step={1}
        value={complexity}
        style={{
          background: `linear-gradient(90deg, var(--c1) ${pct}%, color-mix(in srgb, var(--stroke-med) 100%, transparent) ${pct}%)`,
        }}
        onChange={(e) => setComplexity(Number(e.target.value))}
        aria-label="Explanation complexity"
        aria-valuetext={complexityLabel(complexity)}
        aria-valuemin={1}
        aria-valuemax={10}
        aria-valuenow={complexity}
      />
      <div className="slider-scale">
        <span>Simple</span>
        <span className="slider-current">{complexityLabel(complexity)}</span>
        <span>Expert</span>
      </div>
    </div>
  );
}
