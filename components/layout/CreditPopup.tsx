"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";

export function CreditPopup() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Small delay to make the entrance animation feel smooth and premium
    const timer = setTimeout(() => setVisible(true), 800);
    return () => clearTimeout(timer);
  }, []);

  if (!visible) return null;

  return (
    <div className="credit-popup glass-card" role="complementary" aria-label="Author credits">
      <div className="credit-content">
        Made by <strong>Meer Mohammed Shoaib</strong>
      </div>
      <button 
        type="button"
        className="credit-close-btn"
        onClick={() => setVisible(false)} 
        aria-label="Close credit popup"
      >
        <X size={13} />
      </button>
    </div>
  );
}
