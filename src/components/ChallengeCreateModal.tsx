"use client";

import { useEffect, useState } from "react";
import type { ChallengeVisibility } from "@/lib/types";

interface Props {
  open: boolean;
  loading?: boolean;
  error?: string | null;
  onClose: () => void;
  onCreate: (visibility: ChallengeVisibility) => void;
}

export function ChallengeCreateModal({
  open,
  loading = false,
  error,
  onClose,
  onCreate,
}: Props) {
  const [visibility, setVisibility] = useState<ChallengeVisibility>("private");

  useEffect(() => {
    if (!open) return;
    setVisibility("private");
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !loading) onClose();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, loading, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center sm:items-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="challenge-create-title"
    >
      <button
        type="button"
        className="modal-overlay absolute inset-0"
        onClick={() => !loading && onClose()}
        aria-label="Close"
      />
      <div className="hero-card relative w-full max-w-md rounded-t-2xl sm:rounded-2xl">
        <div className="border-b border-border px-5 py-4">
          <h2 id="challenge-create-title" className="text-lg font-semibold text-cream">
            Create challenge
          </h2>
          <p className="mt-1 text-sm text-cream-muted">
            Others draft the same pools and try to beat your score.
          </p>
        </div>

        <div className="space-y-3 px-5 py-5">
          <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-border bg-bg-panel/60 px-4 py-3 transition-colors has-[:checked]:border-gold/40 has-[:checked]:bg-gold/5">
            <input
              type="radio"
              name="visibility"
              value="private"
              checked={visibility === "private"}
              onChange={() => setVisibility("private")}
              className="mt-1"
            />
            <span>
              <span className="block text-sm font-medium text-cream">Private</span>
              <span className="mt-0.5 block text-xs text-cream-muted">
                Share a link with friends
              </span>
            </span>
          </label>

          <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-border bg-bg-panel/60 px-4 py-3 transition-colors has-[:checked]:border-gold/40 has-[:checked]:bg-gold/5">
            <input
              type="radio"
              name="visibility"
              value="public"
              checked={visibility === "public"}
              onChange={() => setVisibility("public")}
              className="mt-1"
            />
            <span>
              <span className="block text-sm font-medium text-cream">Public</span>
              <span className="mt-0.5 block text-xs text-cream-muted">
                Anyone can find it via Play online
              </span>
            </span>
          </label>

          {error && <p className="text-sm text-crimson">{error}</p>}
        </div>

        <div className="flex gap-2.5 border-t border-border px-5 py-4">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="btn-outline flex-1 rounded-xl px-4 py-3 text-sm disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => onCreate(visibility)}
            disabled={loading}
            className="btn-gold flex-1 rounded-xl px-4 py-3 text-sm font-semibold disabled:opacity-60"
          >
            {loading ? "Creating…" : "Create"}
          </button>
        </div>
      </div>
    </div>
  );
}
