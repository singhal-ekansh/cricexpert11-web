"use client";

import Link from "next/link";
import type { DailyLeaderboard, GameMode, ScoreResponse } from "@/lib/types";
import { userDisplayName } from "@/lib/user";
import { CrownIcon } from "./CrownIcon";
import { UserAvatar } from "./UserAvatar";

const LEADERBOARD_TOP = 5;

interface Props {
  leaderboard: DailyLeaderboard;
  lastScore?: ScoreResponse;
  mode?: GameMode;
  onPlayAgain?: () => void;
}

export function DailyLeaderboardScreen({
  leaderboard,
  lastScore,
  mode,
  onPlayAgain,
}: Props) {
  const { entries, player_count } = leaderboard;

  return (
    <div className="animate-fade-up mx-auto w-full max-w-2xl">
      <div className="hero-card rounded-2xl px-3 py-5 sm:px-8 sm:py-8">
        <div className="text-center">
          <p className="text-sm font-medium text-cream">Today&apos;s leaderboard</p>
          <p className="mt-2 text-sm text-cream-muted">
            {player_count} played
          </p>
        </div>

        {lastScore && (
          <div className="mt-6 rounded-xl border border-border/70 bg-bg-card/30 px-4 py-4 text-center sm:mt-8">
            <p className="text-xs text-cream-muted">This attempt</p>
            <p className="font-[family-name:var(--font-display)] text-4xl leading-none text-gold">
              {lastScore.team_score}
            </p>
            {mode && (
              <p className="mt-1 text-xs text-cream-muted">
                {lastScore.format_label} · {lastScore.wicket_mode_label} · {mode}
              </p>
            )}
          </div>
        )}

        <div className="mt-6 space-y-2 sm:mt-8">
          {entries.length === 0 ? (
            <p className="rounded-xl border border-dashed border-border px-4 py-8 text-center text-sm text-cream-muted">
              No scores yet — you&apos;re first on the board.
            </p>
          ) : (
            entries.map((entry, index) => {
              const name = userDisplayName(entry.user.display_name, "Player");
              const showDivider =
                index === entries.length - 1 &&
                entry.is_you &&
                entry.rank > LEADERBOARD_TOP;
              return (
                <div key={`${entry.user.id}-${entry.rank}`}>
                  {showDivider && (
                    <p className="py-2 text-center text-xs text-cream-muted/60">···</p>
                  )}
                  <div
                  className={`flex w-full items-center gap-3 rounded-xl border px-4 py-3 ${
                    entry.is_you
                      ? "border-gold/35 bg-gold/5"
                      : "border-border/70 bg-bg-card/40"
                  }`}
                >
                  <span
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full font-[family-name:var(--font-mono)] text-sm font-bold ${
                      entry.rank === 1
                        ? "bg-gold/20 text-gold-bright"
                        : entry.rank <= 3
                          ? "bg-bg-panel text-cream"
                          : "bg-bg-panel/60 text-cream-muted"
                    }`}
                    aria-label={entry.rank === 1 ? "Rank 1" : undefined}
                  >
                    {entry.rank === 1 ? (
                      <CrownIcon size={16} className="text-gold-bright" />
                    ) : (
                      entry.rank
                    )}
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
                    </p>
                    <p className="text-xs text-cream-muted">
                      {entry.attempt_count} attempt{entry.attempt_count === 1 ? "" : "s"}
                    </p>
                  </div>

                  <span className="shrink-0 font-[family-name:var(--font-mono)] text-lg font-semibold text-gold sm:text-xl">
                    {entry.team_score}
                  </span>
                </div>
                </div>
              );
            })
          )}
        </div>

        <div className="mt-5 flex flex-col gap-2.5 sm:mt-6 sm:flex-row sm:items-center sm:justify-center sm:gap-3">
          {onPlayAgain && (
            <button
              type="button"
              onClick={onPlayAgain}
              className="btn-gold w-full rounded-xl px-8 py-3 text-sm sm:w-auto"
            >
              Play again
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
