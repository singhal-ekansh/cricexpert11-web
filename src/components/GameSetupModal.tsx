"use client";

import Link from "next/link";
import { useEffect } from "react";
import { GameLogo } from "@/components/GameLogo";
import { HomeGameSetup } from "@/components/HomeGameSetup";
import type { GameMode, GameOption, GameSettings } from "@/lib/types";

interface Props {
  open: boolean;
  onClose: () => void;
  formats: GameOption[];
  wicketModes: GameOption[];
  settings: GameSettings;
  mode: GameMode;
  onSettingsChange: (settings: GameSettings) => void;
  onModeChange: (mode: GameMode) => void;
}

export function GameSetupModal({
  open,
  onClose,
  formats,
  wicketModes,
  settings,
  mode,
  onSettingsChange,
  onModeChange,
}: Props) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  const ready = formats.length > 0 && wicketModes.length > 0;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="game-setup-title"
    >
      <button
        type="button"
        className="absolute inset-0 bg-black/75 backdrop-blur-sm"
        onClick={onClose}
        aria-label="Close"
      />
      <div className="hero-card relative w-full max-w-md rounded-2xl">
        <div className="relative flex items-center gap-3 border-b border-border px-5 py-4 pr-12">
          <GameLogo variant="modal" />
          <h2
            id="game-setup-title"
            className="font-[family-name:var(--font-display)] text-xl text-cream"
          >
            Format &amp; conditions
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="absolute top-3.5 right-4 rounded-lg border border-border px-2.5 py-1 text-sm text-cream-muted transition-colors hover:border-gold/40 hover:text-cream"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        <div className="px-5 py-5">
          {ready ? (
            <HomeGameSetup
              formats={formats}
              wicketModes={wicketModes}
              settings={settings}
              mode={mode}
              onSettingsChange={onSettingsChange}
              onModeChange={onModeChange}
              inModal
            />
          ) : (
            <p className="text-center text-sm text-cream-muted">
              Loading options…
            </p>
          )}
        </div>

        <div className="border-t border-border px-5 py-4">
          {ready ? (
            <Link
              href="/play"
              onClick={onClose}
              className="btn-gold block w-full rounded-xl px-6 py-3.5 text-center text-sm tracking-[0.1em]"
            >
              Draft your XI
            </Link>
          ) : (
            <button
              type="button"
              disabled
              className="btn-gold w-full rounded-xl px-6 py-3.5 text-sm opacity-50"
            >
              Draft your XI
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
