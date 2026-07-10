"use client";

import { useEffect } from "react";
import { GameLogo } from "@/components/GameLogo";

interface Props {
  open: boolean;
  onClose: () => void;
  creditBudget?: number;
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
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="how-to-play-title"
    >
      <button
        type="button"
        className="absolute inset-0 bg-black/75 backdrop-blur-sm"
        onClick={onClose}
        aria-label="Close"
      />
      <div className="hero-card relative max-h-[85vh] w-full max-w-lg overflow-y-auto rounded-2xl">
        <div className="sticky top-0 relative flex items-center gap-3 border-b border-border bg-[#12101a]/95 px-5 py-4 pr-12 backdrop-blur-md">
          <GameLogo variant="modal" />
          <h2
            id="how-to-play-title"
            className="font-[family-name:var(--font-display)] text-xl text-cream"
          >
            How to play
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

        <div className="space-y-5 px-5 py-5 text-sm leading-relaxed text-cream-muted">
          <section className="rounded-xl border border-gold/30 bg-gold/5 p-4">
            <h3 className="mb-2 text-[10px] font-bold tracking-widest text-gold uppercase">
              Real data
            </h3>
            <p>
              Everything here is built on{" "}
              <span className="text-cream">real international cricket data</span>
              — player ratings, credits, and strengths all come from actual
              match stats, not guesswork.
            </p>
          </section>

          <section className="rounded-xl border border-border/60 bg-bg-card/30 p-4">
            <h3 className="mb-2 text-[10px] font-bold tracking-widest text-gold uppercase">
              Format &amp; conditions
            </h3>
            <p>
              Pick a <span className="text-cream">format</span> and{" "}
              <span className="text-cream">wicket type</span> before you draft.
              Each wicket changes how players are scored — spin-friendly tracks
              reward spinners and batters vs spin; green wickets reward pace.
            </p>
          </section>

          <section className="rounded-xl border border-border/60 bg-bg-card/30 p-4">
            <h3 className="mb-2 text-[10px] font-bold tracking-widest text-gold uppercase">
              Player pool
            </h3>
            <p>
              Ratings cover eligible men&apos;s T20I players from top full-member
              nations with enough international matches. Not every T20I cricketer
              is in the pool.
            </p>
          </section>

          <section className="rounded-xl border border-border/60 bg-bg-card/30 p-4">
            <h3 className="mb-2 text-[10px] font-bold tracking-widest text-gold uppercase">
              Easy &amp; Hard
            </h3>
            <ul className="space-y-2 text-[13px]">
              <li>
                <span className="text-cream">Easy</span> — player stats (BAT,
                POW, BWL) are shown to help you pick.
              </li>
              <li>
                <span className="text-cream">Hard</span> — stats are hidden.
                Pick on name, role, and cricket knowledge alone.
              </li>
            </ul>
          </section>

          <section className="rounded-xl border border-border/60 bg-bg-card/30 p-4">
            <h3 className="mb-2 text-[10px] font-bold tracking-widest text-gold uppercase">
              The draft
            </h3>
            <p>
              Build your XI across{" "}
              <span className="text-cream">eleven picks</span>. Every round
              throws up a new group of players — choose one for your squad.
              Changed format or difficulty? Tap{" "}
              <span className="text-cream">Play</span> on the home screen and
              start a new draft so settings apply. Choose wisely:{" "}
              <span className="text-cream">players won&apos;t repeat</span>{" "}
              across rounds.
            </p>
          </section>

          <section className="rounded-xl border border-border/60 bg-bg-card/30 p-4">
            <h3 className="mb-2 text-[10px] font-bold tracking-widest text-gold uppercase">
              Player roles
            </h3>
            <p className="mb-3">
              This isn&apos;t about picking eleven batters. You&apos;re building
              a real XI —{" "}
              <span className="text-cream">batters</span>,{" "}
              <span className="text-cream">all-rounders</span>, and{" "}
              <span className="text-cream">bowlers</span> — and each one is
              scored on what they actually do:
            </p>
            <ul className="space-y-2 text-[13px]">
              <li>
                <span className="text-cream">Batters</span> — judged on batting
                ability, especially in the top and middle order.
              </li>
              <li>
                <span className="text-cream">Bowlers</span> — judged on bowling
                ability, especially in the lower order.
              </li>
              <li>
                <span className="text-cream">All-rounders</span> — contribute
                from both sides, depending on where you slot them.
              </li>
            </ul>
          </section>

          <section className="rounded-xl border border-border/60 bg-bg-card/30 p-4">
            <h3 className="mb-2 text-[10px] font-bold tracking-widest text-gold uppercase">
              Batting order
            </h3>
            <p className="mb-3">
              Drag players into positions 1–11. Where someone bats decides how
              they&apos;re scored — put batters where they&apos;d actually bat,
              and bowlers where they&apos;d come in last:
            </p>
            <ul className="space-y-2 text-[13px]">
              <li className="flex gap-2">
                <span className="w-8 shrink-0 font-[family-name:var(--font-mono)] text-gold">
                  1–2
                </span>
                <span>
                  <span className="text-cream">Openers</span> — batting
                  rewarded. Face the new ball, get the innings moving.
                </span>
              </li>
              <li className="flex gap-2">
                <span className="w-8 shrink-0 font-[family-name:var(--font-mono)] text-gold">
                  3–5
                </span>
                <span>
                  <span className="text-cream">Middle order</span> — batting
                  rewarded. Build the innings and keep the scoreboard ticking.
                </span>
              </li>
              <li className="flex gap-2">
                <span className="w-8 shrink-0 font-[family-name:var(--font-mono)] text-gold">
                  6–8
                </span>
                <span>
                  <span className="text-cream">Finishers</span> — mix of
                  batting and bowling. Late-innings hitters and part-timers.
                </span>
              </li>
              <li className="flex gap-2">
                <span className="w-8 shrink-0 font-[family-name:var(--font-mono)] text-gold">
                  9–11
                </span>
                <span>
                  <span className="text-cream">Bowlers</span> — bowling
                  rewarded. Your attack belongs down here.
                </span>
              </li>
            </ul>
          </section>

          <section className="rounded-xl border border-border/60 bg-bg-card/30 p-4">
            <h3 className="mb-2 text-[10px] font-bold tracking-widest text-gold uppercase">
              Squad rules
            </h3>
            <ul className="space-y-2">
              <li>
                Players cost <span className="text-cream">7–12 credits</span>.
                Stars cost more.
              </li>
              <li>
                Stay near{" "}
                <span className="text-cream">
                  {creditBudget ?? "your"} credits
                </span>{" "}
                total
                — overspending hurts your score.
              </li>
              <li>
                Pick a <span className="text-cream">wicketkeeper</span> or take
                a penalty.
              </li>
            </ul>
          </section>

          <section className="rounded-xl border border-gold/20 bg-gold/5 p-4">
            <h3 className="mb-2 text-[10px] font-bold tracking-widest text-gold uppercase">
              Your score
            </h3>
            <p>
              Submit when you&apos;re ready. Your score reflects the full side
              you built — the players you picked, whether batters and bowlers
              are in the right spots, and whether your squad ticks the boxes
              above.
            </p>
          </section>
        </div>

        <div className="border-t border-border px-5 py-4">
          <button
            type="button"
            onClick={onClose}
            className="btn-gold w-full rounded-xl px-6 py-3.5 text-sm"
          >
            Got it — let&apos;s draft
          </button>
        </div>
      </div>
    </div>
  );
}
