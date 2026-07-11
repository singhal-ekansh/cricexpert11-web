"use client";

import Link from "next/link";
import type { ChallengeComparison } from "@/lib/types";
import { userDisplayName } from "@/lib/user";

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
    <div className="animate-fade-up mx-auto max-w-3xl">
      <div className="hero-card rounded-2xl px-5 py-6 sm:px-8 sm:py-8">
        {onBack && (
          <button
            type="button"
            onClick={onBack}
            className="mb-4 text-xs text-cream-muted transition-colors hover:text-gold"
          >
            ← Back to leaderboard
          </button>
        )}

        <div className="text-center">
          <p className="text-[10px] font-bold tracking-[0.3em] text-gold uppercase">
            {subjectName}&apos;s lineup
          </p>
          <p
            className={`mt-3 text-sm font-bold tracking-[0.2em] uppercase ${outcomeClass(outcome)}`}
          >
            {outcomeLabel(outcome)} vs {subjectName}
          </p>
          <div className="mt-4 flex items-center justify-center gap-4 sm:gap-8">
            <div>
              <p className="text-sm text-cream-muted">{nameA}</p>
              <p className="font-[family-name:var(--font-display)] text-4xl text-cream sm:text-5xl">
                {a.team_score}
              </p>
            </div>
            <p className="text-lg text-cream-muted">vs</p>
            <div>
              <p className="text-sm text-cream-muted">{nameB}</p>
              <p className="font-[family-name:var(--font-display)] text-4xl text-cream sm:text-5xl">
                {b.team_score}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-6 overflow-hidden rounded-xl border border-border sm:mt-8">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-bg-panel text-left text-[10px] tracking-widest text-cream-muted uppercase">
                <th className="w-10 px-2 py-2">#</th>
                <th className="px-2 py-2">{nameA}</th>
                <th className="px-2 py-2">{nameB}</th>
              </tr>
            </thead>
            <tbody>
              {comparison.slots.map((row) => (
                <tr
                  key={row.slot}
                  className="border-b border-border/50 bg-bg-card/40 last:border-0"
                >
                  <td className="px-2 py-2 font-[family-name:var(--font-mono)] text-xs text-gold">
                    {row.slot}
                  </td>
                  <td className="px-2 py-2">
                    {row.a ? (
                      <p className="truncate text-[13px] text-cream">
                        <span className="font-medium">{row.a.full_name}</span>
                        <span className="text-cream-muted">
                          {" "}
                          · {formatRole(row.a.primary_role)} · {row.a.slot_score}
                        </span>
                      </p>
                    ) : (
                      <span className="text-cream-muted/40">—</span>
                    )}
                  </td>
                  <td className="px-2 py-2">
                    {row.b ? (
                      <p className="truncate text-[13px] text-cream">
                        <span className="font-medium">{row.b.full_name}</span>
                        <span className="text-cream-muted">
                          {" "}
                          · {formatRole(row.b.primary_role)} · {row.b.slot_score}
                        </span>
                      </p>
                    ) : (
                      <span className="text-cream-muted/40">—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-6 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center sm:justify-center">
          {onBack && (
            <button
              type="button"
              onClick={onBack}
              className="btn-gold rounded-xl px-8 py-3 text-sm"
            >
              Leaderboard
            </button>
          )}
          {onPlayAgain && (
            <button
              type="button"
              onClick={onPlayAgain}
              className="btn-outline rounded-xl px-8 py-3 text-sm"
            >
              Draft again
            </button>
          )}
          <Link
            href="/profile"
            className="btn-outline rounded-xl px-8 py-3 text-center text-sm"
          >
            My profile
          </Link>
          <Link
            href="/"
            className="btn-outline rounded-xl px-8 py-3 text-center text-sm"
          >
            Home
          </Link>
        </div>
      </div>
    </div>
  );
}
