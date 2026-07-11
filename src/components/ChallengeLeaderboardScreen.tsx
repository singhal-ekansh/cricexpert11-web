"use client";

import Link from "next/link";
import type { ChallengeLeaderboard } from "@/lib/types";
import { challengePageUrl, isChallengeShareable } from "@/lib/challenge";
import { userDisplayName } from "@/lib/user";
import { ChallengeSharePanel } from "./ChallengeSharePanel";
import { UserAvatar } from "./UserAvatar";

interface Props {
  leaderboard: ChallengeLeaderboard;
  onSelectPlayer: (userId: string, isYou: boolean) => void;
}

function rankLabel(rank: number): string {
  if (rank === 1) return "1st";
  if (rank === 2) return "2nd";
  if (rank === 3) return "3rd";
  return `#${rank}`;
}

export function ChallengeLeaderboardScreen({
  leaderboard,
  onSelectPlayer,
}: Props) {
  const { entries, your_rank, player_count, expires_at, challenge_id } =
    leaderboard;
  const shareable = isChallengeShareable(expires_at);
  const yourEntry = entries.find((entry) => entry.is_you);
  const shareScore = yourEntry?.team_score ?? entries[0]?.team_score;

  return (
    <div className="animate-fade-up mx-auto w-full max-w-2xl">
      <div className="hero-card rounded-2xl px-3 py-5 sm:px-8 sm:py-8">
        <div className="text-center">
          <p className="text-sm font-medium text-cream">Leaderboard</p>
          <p className="mt-2 text-sm text-cream-muted">
            {player_count} player{player_count === 1 ? "" : "s"} · tap to compare
          </p>
          {your_rank != null && (
            <p className="mt-3 text-xl font-semibold text-gold">
              You finished {rankLabel(your_rank)}
            </p>
          )}
        </div>

        <div className="mt-6 space-y-2 sm:mt-8">
          {entries.map((entry) => {
            const name = userDisplayName(entry.user.display_name, "Player");
            const canClick = entry.is_you || (player_count >= 2 && !entry.is_you);
            const rowClass = `flex w-full items-center gap-3 rounded-xl border px-4 py-3 text-left transition-colors ${
              entry.is_you
                ? "border-gold/35 bg-gold/5"
                : "border-border/70 bg-bg-card/40"
            } ${
              canClick
                ? "cursor-pointer hover:border-gold/40 hover:bg-bg-card/70"
                : "cursor-default"
            }`;

            const inner = (
              <>
                <span
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full font-[family-name:var(--font-mono)] text-sm font-bold ${
                    entry.rank === 1
                      ? "bg-gold/20 text-gold-bright"
                      : entry.rank <= 3
                        ? "bg-bg-panel text-cream"
                        : "bg-bg-panel/60 text-cream-muted"
                  }`}
                >
                  {entry.rank}
                </span>

                <UserAvatar
                  name={name}
                  avatarUrl={entry.user.avatar_url}
                  className="h-9 w-9"
                />

                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-cream">
                    {name}
                    {entry.is_you && (
                      <span className="ml-1.5 text-xs text-gold">(you)</span>
                    )}
                    {entry.is_creator && !entry.is_you && (
                      <span className="ml-1.5 text-xs text-cream-muted">
                        (host)
                      </span>
                    )}
                  </p>
                </div>

                <span className="shrink-0 font-[family-name:var(--font-mono)] text-lg font-semibold text-gold sm:text-xl">
                  {entry.team_score}
                </span>
              </>
            );

            if (!canClick) {
              return (
                <div key={entry.user.id} className={rowClass}>
                  {inner}
                </div>
              );
            }

            return (
              <button
                key={entry.user.id}
                type="button"
                onClick={() => onSelectPlayer(entry.user.id, Boolean(entry.is_you))}
                className={rowClass}
              >
                {inner}
              </button>
            );
          })}
        </div>

        {shareable && (
          <ChallengeSharePanel
            url={challengePageUrl(challenge_id)}
            score={shareScore}
            className="mt-6"
          />
        )}

        <div className="mt-5 flex flex-col gap-2.5 sm:mt-6 sm:flex-row sm:items-center sm:justify-center sm:gap-3">
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
