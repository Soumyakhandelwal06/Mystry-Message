// src/hooks/useCopyToClipboard.js
import { useState, useCallback } from "react";

export const useCopyToClipboard = () => {
  const [copied, setCopied] = useState(false);

  const copy = useCallback((text) => {
    if (typeof navigator === "undefined" || !navigator.clipboard) {
      console.warn("Clipboard not supported or not available.");
      return false;
    }

    navigator.clipboard
      .writeText(text)
      .then(() => {
        setCopied(true);
        // Reset 'copied' state after a short delay
        setTimeout(() => setCopied(false), 2000);
      })
      .catch((err) => {
        console.error("Failed to copy text: ", err);
        setCopied(false);
      });
  }, []);

  return [copied, copy];
};
