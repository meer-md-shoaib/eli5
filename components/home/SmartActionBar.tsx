"use client";

import { SMART_ACTIONS } from "@/lib/constants";
import { useExplainer } from "@/hooks/useExplainer";

export function SmartActionBar() {
  const { triggerSmartAction, isBusy, explanation } = useExplainer();
  if (!explanation) return null;

  return (
    <div className="smart-bar" role="group" aria-label="Refine this explanation">
      {SMART_ACTIONS.map((action) => (
        <button
          key={action.id}
          type="button"
          className="smart-chip"
          disabled={isBusy}
          onClick={() => triggerSmartAction(action.id)}
          title={action.prompt}
        >
          <span aria-hidden="true">{action.icon}</span>
          <span>{action.label}</span>
        </button>
      ))}
    </div>
  );
}
