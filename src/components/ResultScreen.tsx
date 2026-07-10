"use client";

import Link from "next/link";
import type { GameMode, ScoreResponse } from "@/lib/types";

interface Props {
  score: ScoreResponse;
  mode: GameMode;
  isNewBest: boolean;
  onPlayAgain: () => void;
}

export function ResultScreen({ score, mode, isNewBest, onPlayAgain }: Props) {
  return (
    <div className="animate-fade-up mx-auto max-w-2xl">
      <div className="hero-card rounded-2xl px-6 py-8 sm:px-8">
        <div className="text-center">
          {isNewBest && (
            <p className="mb-3 text-xs font-bold tracking-[0.3em] text-gold uppercase">
              ★ New personal best ★
            </p>
          )}
          <p className="text-sm tracking-widest text-cream-muted uppercase">
            Team score
          </p>
          <p className="mt-1 text-[10px] font-bold tracking-[0.25em] text-gold uppercase">
            {score.format_label} · {score.wicket_mode_label} · {mode}
          </p>
          <p className="font-[family-name:var(--font-display)] text-7xl leading-none text-gold-bright md:text-8xl">
            {score.team_score}
          </p>
          <div className="mt-3 space-y-1 text-sm text-cream-muted">
            <p>{score.total_credits} credits used</p>
            {score.wk_penalty !== 0 && (
              <p className="text-crimson">Missing wicketkeeper</p>
            )}
            {score.credit_penalty !== 0 && (
              <p className="text-crimson">Over budget penalty</p>
            )}
          </div>
        </div>

      <div className="mt-8 overflow-hidden rounded-xl border border-border">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-bg-panel text-left text-[10px] tracking-widest text-cream-muted uppercase">
              <th className="px-4 py-3">#</th>
              <th className="px-4 py-3">Player</th>
              <th className="px-4 py-3">Role</th>
            </tr>
          </thead>
          <tbody>
            {score.breakdown.map((row) => (
              <tr
                key={row.slot}
                className="border-b border-border/50 bg-bg-card/40 last:border-0"
              >
                <td className="px-4 py-3 font-[family-name:var(--font-mono)] text-gold">
                  {row.slot}
                </td>
                <td className="px-4 py-3">
                  <p className="font-medium text-cream">{row.full_name}</p>
                  <p className="text-xs text-cream-muted">{row.country}</p>
                </td>
                <td className="px-4 py-3 text-cream-muted">{row.primary_role}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-8 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center sm:justify-center">
        <button
          type="button"
          onClick={onPlayAgain}
          className="btn-gold rounded-xl px-10 py-4 text-sm sm:min-w-[10rem]"
        >
          Draft again
        </button>
        <Link
          href="/"
          className="btn-outline rounded-xl px-10 py-4 text-center text-sm sm:min-w-[10rem]"
        >
          Home
        </Link>
      </div>
      </div>
    </div>
  );
}
