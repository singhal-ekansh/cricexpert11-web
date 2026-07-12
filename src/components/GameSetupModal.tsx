"use client";

import Link from "next/link";
import { useEffect } from "react";
import { GameLogo } from "@/components/GameLogo";
import { HomeGameSetup } from "@/components/HomeGameSetup";
import { clearDraftState } from "@/lib/storage";
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
      className="fixed inset-0 z-50 flex items-end justify-center sm:items-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="game-setup-title"
    >
      <button
        type="button"
        className="modal-overlay absolute inset-0"
        onClick={onClose}
        aria-label="Close"
      />
      <div className="hero-card relative w-full max-w-md rounded-t-2xl sm:rounded-2xl">
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <div className="flex items-center gap-3">
            <GameLogo variant="modal" />
            <h2 id="game-setup-title" className="text-lg font-semibold text-cream">
              Game setup
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="btn-ghost rounded-lg px-2 py-1 text-lg leading-none"
            aria-label="Close"
          >
            ×
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
            <p className="text-sm text-cream-muted">Loading options…</p>
          )}
        </div>

        <div className="border-t border-border px-5 py-4">
          {ready ? (
            <Link
              href="/play?fresh=1"
              onClick={() => {
                clearDraftState();
                onClose();
              }}
              className="btn-gold block w-full rounded-xl px-6 py-3.5 text-center text-sm font-semibold"
            >
              Start draft
            </Link>
          ) : (
            <button
              type="button"
              disabled
              className="btn-gold w-full rounded-xl px-6 py-3.5 text-sm opacity-50"
            >
              Start draft
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
