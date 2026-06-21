"use client";

import { type RefObject } from "react";
import { AlertTriangle, Check, Copy, Download, Heart, Share2, Square, Volume2 } from "lucide-react";
import { useExplainer } from "@/hooks/useExplainer";
import { useResultActions } from "@/hooks/useResultActions";
import { IconButton } from "@/components/ui/IconButton";

export function ResultToolbar({ contentRef }: { contentRef: RefObject<HTMLElement | null> }) {
  const { explanation, toggleFavorite } = useExplainer();
  const { flash, copy, share, downloadPdf, toggleSpeech, speaking, popupError } = useResultActions(
    explanation,
    contentRef
  );

  const disabled = !explanation;

  return (
    <div className="toolbar-actions-wrap">
      <div className="toolbar-actions" aria-label="Explanation actions">
        <IconButton onClick={copy} disabled={disabled} title="Copy" aria-label="Copy explanation">
          {flash === "copied" ? <Check size={17} /> : <Copy size={17} />}
        </IconButton>
        <IconButton onClick={share} disabled={disabled} title="Share" aria-label="Share explanation">
          {flash === "shared" ? <Check size={17} /> : <Share2 size={17} />}
        </IconButton>
        <IconButton onClick={downloadPdf} disabled={disabled} title="Download PDF" aria-label="Download PDF">
          <Download size={17} />
        </IconButton>
        <IconButton onClick={toggleSpeech} disabled={disabled} title="Listen" aria-label="Read explanation aloud">
          {speaking ? <Square size={16} /> : <Volume2 size={17} />}
        </IconButton>
        <IconButton
          onClick={toggleFavorite}
          disabled={disabled}
          active={explanation?.favorite}
          title="Save"
          aria-label="Favorite explanation"
          aria-pressed={explanation?.favorite ?? false}
        >
          <Heart size={17} fill={explanation?.favorite ? "currentColor" : "none"} />
        </IconButton>
      </div>

      {popupError && (
        <div className="toolbar-popup-error" role="alert">
          <AlertTriangle size={14} aria-hidden="true" />
          {popupError}
        </div>
      )}
    </div>
  );
}
