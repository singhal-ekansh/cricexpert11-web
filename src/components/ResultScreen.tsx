"use client";

import Link from "next/link";
import type {
  ChallengeComparison,
  ChallengeLeaderboard,
  ChallengeMySubmission,
  GameMode,
  ScoreResponse,
} from "@/lib/types";
import { ChallengeLeaderboardScreen } from "./ChallengeLeaderboardScreen";
import { ChallengeMyTeamScreen } from "./ChallengeMyTeamScreen";
import { ChallengeResultScreen } from "./ChallengeResultScreen";
import { ChallengeSharePanel } from "./ChallengeSharePanel";

interface Props {
  score?: ScoreResponse | null;
  mode: GameMode;
  isNewBest: boolean;
  onPlayAgain?: () => void;
  challengeId?: string | null;
  challengeShareUrl?: string | null;
  onChallengeFriend?: () => void;
  challengeLoading?: boolean;
  leaderboard?: ChallengeLeaderboard | null;
  comparison?: ChallengeComparison | null;
  mySubmission?: ChallengeMySubmission | null;
  viewerUserId?: string | null;
  onSelectPlayer?: (userId: string, isYou: boolean) => void;
  onBackToLeaderboard?: () => void;
}

function formatRole(role: string): string {
  if (role === "Wicketkeeper-batsman") return "WK";
  if (role === "All-rounder") return "AR";
  if (role === "Batsman") return "BAT";
  if (role === "Bowler") return "BWL";
  if (role === "Wicketkeeper") return "WK";
  return role;
}

export function ResultScreen({
  score,
  mode,
  isNewBest,
  onPlayAgain,
  challengeId,
  challengeShareUrl,
  onChallengeFriend,
  challengeLoading,
  leaderboard,
  comparison,
  mySubmission,
  viewerUserId,
  onSelectPlayer,
  onBackToLeaderboard,
}: Props) {
  if (mySubmission) {
    return (
      <ChallengeMyTeamScreen
        submission={mySubmission}
        challengeId={challengeId!}
        expiresAt={leaderboard?.expires_at ?? mySubmission.expires_at ?? ""}
        onBack={onBackToLeaderboard}
      />
    );
  }

  if (comparison && challengeId) {
    return (
      <ChallengeResultScreen
        comparison={comparison}
        viewerUserId={viewerUserId}
        onBack={onBackToLeaderboard}
        onPlayAgain={onPlayAgain}
      />
    );
  }

  if (leaderboard && challengeId && onSelectPlayer) {
    return (
      <ChallengeLeaderboardScreen
        leaderboard={leaderboard}
        onSelectPlayer={onSelectPlayer}
      />
    );
  }

  if (!score) return null;

  return (
    <div className="animate-fade-up mx-auto max-w-2xl">
      <div className="hero-card rounded-2xl px-5 py-6 sm:px-8 sm:py-8">
        <div className="text-center">
          {isNewBest && (
            <p className="mb-2 text-xs font-bold tracking-[0.3em] text-gold uppercase sm:mb-3">
              ★ New personal best ★
            </p>
          )}
          <p className="text-sm tracking-widest text-cream-muted uppercase">
            Team score
          </p>
          <p className="mt-1 text-[10px] font-bold tracking-[0.25em] text-gold uppercase">
            {score.format_label} · {score.wicket_mode_label} · {mode}
          </p>
          <p className="font-[family-name:var(--font-display)] text-6xl leading-none text-gold-bright sm:text-7xl md:text-8xl">
            {score.team_score}
          </p>
          <div className="mt-2 space-y-0.5 text-sm text-cream-muted sm:mt-3">
            <p>{score.total_credits} credits used</p>
            {score.wk_penalty !== 0 && (
              <p className="text-crimson">Missing wicketkeeper</p>
            )}
            {score.credit_penalty !== 0 && (
              <p className="text-crimson">Over budget penalty</p>
            )}
          </div>
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
              {score.breakdown.map((row) => (
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
                        · {formatRole(row.primary_role)}
                      </span>
                    </p>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {challengeShareUrl && (
          <ChallengeSharePanel
            url={challengeShareUrl}
            score={score.team_score}
            className="mt-6 sm:mt-8"
          />
        )}

        <div className="mt-6 flex flex-col items-stretch justify-center gap-3 sm:mt-8 sm:flex-row sm:items-center sm:justify-center">
          {onChallengeFriend && !challengeShareUrl && (
            <button
              type="button"
              onClick={onChallengeFriend}
              disabled={challengeLoading}
              className="btn-gold rounded-xl px-10 py-3.5 text-sm sm:min-w-[10rem] sm:py-4 disabled:opacity-60"
            >
              {challengeLoading ? "Creating…" : "Challenge a friend"}
            </button>
          )}
          {onPlayAgain && (
            <button
              type="button"
              onClick={onPlayAgain}
              className="btn-outline rounded-xl px-10 py-3.5 text-sm sm:min-w-[10rem] sm:py-4"
            >
              Draft again
            </button>
          )}
          <Link
            href="/"
            className="btn-outline rounded-xl px-10 py-3.5 text-center text-sm sm:min-w-[10rem] sm:py-4"
          >
            Home
          </Link>
          {challengeId && (
            <Link
              href="/profile"
              className="btn-outline rounded-xl px-10 py-3.5 text-center text-sm sm:min-w-[10rem] sm:py-4"
            >
              My profile
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
