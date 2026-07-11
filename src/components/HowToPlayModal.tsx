"use client";

import { useEffect } from "react";
import { GameLogo } from "@/components/GameLogo";

interface Props {
  open: boolean;
  onClose: () => void;
  creditBudget?: number;
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-xl border border-border bg-bg-panel p-4">
      <h3 className="mb-2 text-sm font-semibold text-cream">{title}</h3>
      <div className="text-sm leading-relaxed text-cream-muted">{children}</div>
    </section>
  );
}

export function HowToPlayModal({ open, onClose, creditBudget }: Props) {
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

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center sm:items-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="how-to-play-title"
    >
      <button
        type="button"
        className="modal-overlay absolute inset-0"
        onClick={onClose}
        aria-label="Close"
      />
      <div className="hero-card relative max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-t-2xl sm:rounded-2xl">
        <div className="sticky top-0 flex items-center justify-between border-b border-border bg-bg-card px-5 py-4">
          <div className="flex items-center gap-3">
            <GameLogo variant="modal" />
            <h2 id="how-to-play-title" className="text-lg font-semibold text-cream">
              How to play
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

        <div className="space-y-3 px-5 py-5">
          <Section title="Real data">
            <p>
              Player ratings, credits, and strengths come from actual match
              stats — not guesswork.
            </p>
          </Section>

          <Section title="Format & conditions">
            <p>
              Pick a format and wicket type before you draft. Spin-friendly tracks
              reward spinners; green wickets reward pace.
            </p>
          </Section>

          <Section title="Easy & hard">
            <ul className="space-y-2">
              <li>
                <span className="text-cream">Easy</span> — stats shown while you
                pick.
              </li>
              <li>
                <span className="text-cream">Hard</span> — no stats, pick on
                knowledge alone.
              </li>
            </ul>
          </Section>

          <Section title="The draft">
            <p>
              Build your XI across eleven rounds. Each round offers a new group
              of players — choose one. Players won&apos;t repeat across rounds.
            </p>
          </Section>

          <Section title="Batting order">
            <p className="mb-2">
              Drag players into positions 1–11. Where someone bats decides how
              they&apos;re scored:
            </p>
            <ul className="space-y-1.5 text-[13px]">
              <li>
                <span className="font-[family-name:var(--font-mono)] text-accent">1–2</span>{" "}
                Openers — batting rewarded
              </li>
              <li>
                <span className="font-[family-name:var(--font-mono)] text-accent">3–5</span>{" "}
                Middle order — batting rewarded
              </li>
              <li>
                <span className="font-[family-name:var(--font-mono)] text-accent">6–8</span>{" "}
                Finishers — mix of batting and bowling
              </li>
              <li>
                <span className="font-[family-name:var(--font-mono)] text-accent">9–11</span>{" "}
                Bowlers — bowling rewarded
              </li>
            </ul>
          </Section>

          <Section title="Squad rules">
            <ul className="space-y-2">
              <li>Players cost 7–12 credits. Stars cost more.</li>
              <li>
                Stay near {creditBudget ?? "your"} credits total — overspending
                hurts your score.
              </li>
              <li>Pick a wicketkeeper or take a penalty.</li>
            </ul>
          </Section>
        </div>

        <div className="border-t border-border px-5 py-4">
          <button
            type="button"
            onClick={onClose}
            className="btn-gold w-full rounded-xl px-6 py-3.5 text-sm font-semibold"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
}
