"use client";

import React, { useEffect, useState, useCallback, useRef } from "react";

const THUMB_HEIGHT = 32;  // fixed small pill — never stretches
const EDGE_MARGIN  = 20;  // px from top & bottom of viewport

export function ScrollIndicator() {
  const [thumbTop, setThumbTop]   = useState(EDGE_MARGIN);
  const [opacity,  setOpacity]    = useState(0);
  const fadeRef   = useRef<ReturnType<typeof setTimeout> | null>(null);
  const mounted   = useRef(false);

  const update = useCallback(() => {
    const scrollTop  = window.scrollY;
    const docHeight  = document.documentElement.scrollHeight - window.innerHeight;
    if (docHeight <= 0) return;

    const progress   = Math.min(scrollTop / docHeight, 1);
    const trackRange = window.innerHeight - EDGE_MARGIN * 2 - THUMB_HEIGHT;
    setThumbTop(EDGE_MARGIN + progress * trackRange);
    setOpacity(1);

    if (fadeRef.current) clearTimeout(fadeRef.current);
    fadeRef.current = setTimeout(() => setOpacity(0), 1000);
  }, []);

  useEffect(() => {
    mounted.current = true;
    window.addEventListener("scroll", update, { passive: true });
    return () => {
      window.removeEventListener("scroll", update);
      if (fadeRef.current) clearTimeout(fadeRef.current);
    };
  }, [update]);

  // Don't render on server
  if (typeof window === "undefined") return null;

  return (
    <div
      className="fixed right-[5px] inset-y-0 z-[9999] pointer-events-none"
      aria-hidden="true"
    >
      <div
        style={{
          position:        "absolute",
          top:             thumbTop,
          width:           "3px",
          height:          THUMB_HEIGHT,
          borderRadius:    "9999px",
          backgroundColor: "rgba(55, 55, 65, 0.55)",
          backdropFilter:  "blur(2px)",
          opacity,
          transition:      "top 0.08s linear, opacity 0.5s ease",
          willChange:      "top, opacity",
        }}
      />
    </div>
  );
}
