"use client";

import Link from "next/link";
import type { ChallengeMySubmission } from "@/lib/types";
import { challengePageUrl, isChallengeShareable } from "@/lib/challenge";
import { userDisplayName } from "@/lib/user";
import { ChallengeSharePanel } from "./ChallengeSharePanel";

function formatRole(role: string): string {
  if (role === "Wicketkeeper-batsman") return "WK";
  if (role === "All-rounder") return "AR";
  if (role === "Batsman") return "BAT";
  if (role === "Bowler") return "BWL";
  if (role === "Wicketkeeper") return "WK";
  return role;
}

function rankLabel(rank: number): string {
  if (rank === 1) return "1st";
  if (rank === 2) return "2nd";
  if (rank === 3) return "3rd";
  return `#${rank}`;
}

interface Props {
  submission: ChallengeMySubmission;
  challengeId: string;
  expiresAt: string;
  onBack?: () => void;
}

export function ChallengeMyTeamScreen({
  submission,
  challengeId,
  expiresAt,
  onBack,
}: Props) {
  const name = userDisplayName(submission.user.display_name, "You");
  const shareable = isChallengeShareable(expiresAt);

  return (
    <div className="animate-fade-up mx-auto w-full max-w-2xl">
      <div className="hero-card rounded-2xl px-3 py-5 sm:px-8 sm:py-8">
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
            Your team
          </p>
          <p className="mt-2 text-sm text-cream-muted">{name}</p>
          {submission.rank != null && submission.player_count > 0 && (
            <p className="mt-2 text-xs text-cream-muted">
              {rankLabel(submission.rank)} of {submission.player_count}
            </p>
          )}
          <p className="mt-3 font-[family-name:var(--font-display)] text-5xl text-gold-bright sm:text-6xl">
            {submission.team_score}
          </p>
          <p className="mt-2 text-sm text-cream-muted">
            {submission.total_credits} credits used
          </p>
        </div>

        <div className="mt-6 overflow-hidden rounded-xl border border-border sm:mt-8">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-bg-panel text-left text-[10px] tracking-widest text-cream-muted uppercase">
                <th className="w-10 px-2.5 py-2 sm:px-3">#</th>
                <th className="px-2.5 py-2 sm:px-3">Player</th>
              </tr>
            </thead>
            <tbody>
              {submission.breakdown.map((row) => (
                <tr
                  key={row.slot}
                  className="border-b border-border/50 bg-bg-card/40 last:border-0"
                >
                  <td className="px-2.5 py-1.5 font-[family-name:var(--font-mono)] text-xs text-gold sm:px-3 sm:py-2 sm:text-sm">
                    {row.slot}
                  </td>
                  <td className="px-2.5 py-1.5 sm:px-3 sm:py-2">
                    <p className="truncate text-[13px] leading-tight text-cream sm:text-sm">
                      <span className="font-medium">{row.full_name}</span>
                      <span className="text-cream-muted">
                        {" "}
                        · {formatRole(row.primary_role)} · {row.slot_score}
                      </span>
                    </p>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {shareable && (
          <ChallengeSharePanel
            url={challengePageUrl(challengeId)}
            score={submission.team_score}
            className="mt-6 sm:mt-8"
          />
        )}

        <div className="mt-5 flex flex-col gap-2.5 sm:mt-6 sm:flex-row sm:items-center sm:justify-center sm:gap-3">
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
