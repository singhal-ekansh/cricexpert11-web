"use client";

import { useState, type MouseEvent, type PointerEvent } from "react";
import { challengeShareMessage } from "@/lib/challenge";

interface Props {
  url: string;
  score?: number | null;
  className?: string;
  compact?: boolean;
}

export function ChallengeShareButton({
  url,
  score,
  className = "",
  compact = false,
}: Props) {
  const [copied, setCopied] = useState(false);
  const canNativeShare =
    typeof navigator !== "undefined" && typeof navigator.share === "function";
  const shareText = challengeShareMessage(score);

  const stop = (event: MouseEvent | PointerEvent) => {
    event.preventDefault();
    event.stopPropagation();
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore
    }
  };

  const handleShare = async () => {
    if (!canNativeShare) {
      await copyLink();
      return;
    }
    try {
      await navigator.share({
        title: "CricExpert11 Challenge",
        text: shareText,
        url,
      });
    } catch (err) {
      if (err instanceof Error && err.name === "AbortError") return;
      await copyLink();
    }
  };

  if (compact) {
    return (
      <div
        className={`flex shrink-0 items-center gap-1 ${className}`}
        onClick={stop}
        onPointerDown={stop}
      >
        <button
          type="button"
          onClick={handleShare}
          className="rounded-lg border border-border/80 px-2.5 py-2 text-[10px] font-medium text-cream-muted transition-colors hover:border-gold/40 hover:text-gold"
        >
          Share
        </button>
        <button
          type="button"
          onClick={copyLink}
          className="rounded-lg border border-border/80 px-2.5 py-2 text-[10px] font-medium text-cream-muted transition-colors hover:border-gold/40 hover:text-gold"
        >
          {copied ? "Copied" : "Copy link"}
        </button>
      </div>
    );
  }

  return (
    <div
      className={`flex items-center gap-2 ${className}`}
      onClick={stop}
      onPointerDown={stop}
    >
      <button
        type="button"
        onClick={handleShare}
        className="btn-gold flex items-center gap-2 rounded-lg px-4 py-2 text-xs"
      >
        <ShareIcon />
        Share
      </button>
      <button
        type="button"
        onClick={copyLink}
        className="btn-outline rounded-lg px-4 py-2 text-xs"
      >
        {copied ? "Copied!" : "Copy link"}
      </button>
    </div>
  );
}

function ShareIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
      <polyline points="16 6 12 2 8 6" />
      <line x1="12" y1="2" x2="12" y2="15" />
    </svg>
  );
}
