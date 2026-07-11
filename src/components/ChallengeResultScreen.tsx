"use client";

import Link from "next/link";
import type { ChallengeComparison } from "@/lib/types";
import { userDisplayName } from "@/lib/user";
import { ScorePenaltiesSummary } from "./ScorePenaltiesSummary";

function formatRole(role: string): string {
  if (role === "Wicketkeeper-batsman") return "WK";
  if (role === "All-rounder") return "AR";
  if (role === "Batsman") return "BAT";
  if (role === "Bowler") return "BWL";
  if (role === "Wicketkeeper") return "WK";
  return role;
}

interface Props {
  comparison: ChallengeComparison;
  viewerUserId?: string | null;
  onBack?: () => void;
  onPlayAgain?: () => void;
}

function outcomeLabel(outcome: ChallengeComparison["outcome"]): string {
  if (outcome === "win") return "You won";
  if (outcome === "loss") return "You lost";
  return "Tie";
}

function outcomeClass(outcome: ChallengeComparison["outcome"]): string {
  if (outcome === "win") return "text-emerald-400";
  if (outcome === "loss") return "text-crimson";
  return "text-cream-muted";
}

function columnLabel(
  userId: string,
  displayName: string,
  viewerUserId?: string | null,
): string {
  if (viewerUserId && userId === viewerUserId) return "You";
  return userDisplayName(displayName, "Player");
}

function PlayerCell({
  player,
}: {
  player: ChallengeComparison["slots"][number]["a"];
}) {
  if (!player) {
    return <span className="text-cream-muted/40">—</span>;
  }
  return (
    <>
      <p className="text-sm font-medium leading-snug text-cream">{player.full_name}</p>
      <p className="mt-0.5 text-xs text-cream-muted">
        {formatRole(player.primary_role)} · {player.slot_score}
      </p>
    </>
  );
}

export function ChallengeResultScreen({
  comparison,
  viewerUserId,
  onBack,
  onPlayAgain,
}: Props) {
  const { a, b, outcome } = comparison;
  const subject =
    comparison.subject_user_id === a.user.id
      ? a
      : comparison.subject_user_id === b.user.id
        ? b
        : b;
  const subjectName = userDisplayName(subject.user.display_name, "Player");
  const nameA = columnLabel(a.user.id, a.user.display_name, viewerUserId);
  const nameB = columnLabel(b.user.id, b.user.display_name, viewerUserId);

  return (
    <div className="animate-fade-up mx-auto w-full max-w-3xl">
      <div className="hero-card rounded-2xl px-3 py-5 sm:px-8 sm:py-8">
        {onBack && (
          <button
            type="button"
            onClick={onBack}
            className="mb-3 text-sm text-cream-muted transition-colors hover:text-cream sm:mb-4"
          >
            ← Back to leaderboard
          </button>
        )}

        <div className="text-center">
          <p className="text-sm text-cream-muted">
            {subjectName}&apos;s lineup
          </p>
          <p
            className={`mt-2 text-sm font-medium sm:mt-3 ${outcomeClass(outcome)}`}
          >
            {outcomeLabel(outcome)} vs {subjectName}
          </p>
          <div className="mt-4 flex items-center justify-center gap-5 sm:gap-8">
            <div>
              <p className="text-xs text-cream-muted sm:text-sm">{nameA}</p>
              <p className="font-[family-name:var(--font-display)] text-4xl text-cream sm:text-5xl">
                {a.team_score}
              </p>
              <p className="mt-1 text-xs text-cream-muted sm:text-sm">
                {a.total_credits} credits
              </p>
              <ScorePenaltiesSummary
                wk_penalty={a.wk_penalty}
                credit_penalty={a.credit_penalty}
                credits_over_budget={a.credits_over_budget}
                credit_budget={a.credit_budget}
                total_credits={a.total_credits}
                compact
              />
            </div>
            <p className="text-base text-cream-muted sm:text-lg">vs</p>
            <div>
              <p className="text-xs text-cream-muted sm:text-sm">{nameB}</p>
              <p className="font-[family-name:var(--font-display)] text-4xl text-cream sm:text-5xl">
                {b.team_score}
              </p>
              <p className="mt-1 text-xs text-cream-muted sm:text-sm">
                {b.total_credits} credits
              </p>
              <ScorePenaltiesSummary
                wk_penalty={b.wk_penalty}
                credit_penalty={b.credit_penalty}
                credits_over_budget={b.credits_over_budget}
                credit_budget={b.credit_budget}
                total_credits={b.total_credits}
                compact
              />
            </div>
          </div>
        </div>

        {/* Mobile: stacked slot cards */}
        <div className="mt-5 space-y-2 sm:hidden">
          {comparison.slots.map((row) => (
            <div
              key={row.slot}
              className="rounded-xl border border-border/70 bg-bg-card/40 px-3 py-2.5"
            >
              <p className="text-xs font-medium text-cream-muted">
                #{row.slot}
              </p>
              <div className="mt-2 grid grid-cols-2 gap-3">
                <div className="min-w-0">
                  <p className="text-xs font-medium text-cream-muted">
                    {nameA}
                  </p>
                  <div className="mt-1">{row.a ? <PlayerCell player={row.a} /> : <span className="text-cream-muted/40">—</span>}</div>
                </div>
                <div className="min-w-0 border-l border-border/50 pl-3">
                  <p className="text-xs font-medium text-cream-muted">
                    {nameB}
                  </p>
                  <div className="mt-1">{row.b ? <PlayerCell player={row.b} /> : <span className="text-cream-muted/40">—</span>}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Desktop: comparison table */}
        <div className="mt-6 hidden overflow-x-auto rounded-xl border border-border sm:mt-8 sm:block">
          <table className="w-full min-w-[32rem] text-sm">
            <thead>
              <tr className="border-b border-border bg-bg-panel text-left text-xs text-cream-muted">
                <th className="w-10 px-3 py-2.5">#</th>
                <th className="px-3 py-2.5">{nameA}</th>
                <th className="px-3 py-2.5">{nameB}</th>
              </tr>
            </thead>
            <tbody>
              {comparison.slots.map((row) => (
                <tr
                  key={row.slot}
                  className="border-b border-border/50 bg-bg-card/40 last:border-0"
                >
                  <td className="px-3 py-2.5 font-[family-name:var(--font-mono)] text-xs text-cream-muted">
                    {row.slot}
                  </td>
                  <td className="px-3 py-2.5">
                    {row.a ? <PlayerCell player={row.a} /> : <span className="text-cream-muted/40">—</span>}
                  </td>
                  <td className="px-3 py-2.5">
                    {row.b ? <PlayerCell player={row.b} /> : <span className="text-cream-muted/40">—</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-5 flex flex-col gap-2.5 sm:mt-6 sm:flex-row sm:flex-wrap sm:items-center sm:justify-center sm:gap-3">
          {onBack && (
            <button
              type="button"
              onClick={onBack}
              className="btn-gold w-full rounded-xl px-8 py-3 text-sm sm:w-auto"
            >
              Leaderboard
            </button>
          )}
          <Link
            href="/profile"
            className="btn-outline w-full rounded-xl px-8 py-3 text-center text-sm sm:w-auto"
          >
            Back to challenges
          </Link>
          {onPlayAgain && (
            <button
              type="button"
              onClick={onPlayAgain}
              className="btn-outline w-full rounded-xl px-8 py-3 text-sm sm:w-auto"
            >
              Draft again
            </button>
          )}
          <Link
            href="/"
            className="btn-outline w-full rounded-xl px-8 py-3 text-center text-sm sm:w-auto"
          >
            Home
          </Link>
        </div>
      </div>
    </div>
  );
}
