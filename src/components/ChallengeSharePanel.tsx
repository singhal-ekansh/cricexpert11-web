"use client";

import { useState } from "react";
import { challengeShareMessage } from "@/lib/challenge";

interface Props {
  url: string;
  score?: number | null;
  className?: string;
  shareText?: string;
}

export function ChallengeSharePanel({ url, score, className = "", shareText }: Props) {
  const [copied, setCopied] = useState(false);
  const canNativeShare =
    typeof navigator !== "undefined" && typeof navigator.share === "function";

  const message = shareText ?? challengeShareMessage(score);

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
        text: message,
        url,
      });
    } catch (err) {
      if (err instanceof Error && err.name === "AbortError") return;
      await copyLink();
    }
  };

  return (
    <div
      className={`rounded-xl border border-gold/30 bg-gold/5 px-4 py-4 text-center sm:px-5 sm:py-5 ${className}`}
    >
      <p className="text-[10px] font-bold tracking-[0.2em] text-gold uppercase sm:text-xs">
        Challenge Friends
      </p>

      <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:justify-center">
        <button
          type="button"
          onClick={handleShare}
          className="btn-gold flex items-center justify-center gap-2 rounded-lg px-6 py-2.5 text-sm"
        >
          <ShareIcon />
          Share
        </button>
        <button
          type="button"
          onClick={copyLink}
          className="btn-outline rounded-lg px-6 py-2.5 text-sm"
        >
          {copied ? "Copied!" : "Copy link"}
        </button>
      </div>
    </div>
  );
}

function ShareIcon() {
  return (
    <svg
      width="16"
      height="16"
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
