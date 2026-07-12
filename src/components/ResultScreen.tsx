"use client";

import Link from "next/link";
import type {
  ChallengeComparison,
  ChallengeLeaderboard,
  ChallengeMySubmission,
  DailyLeaderboard,
  GameMode,
  ScoreResponse,
} from "@/lib/types";
import { ChallengeLeaderboardScreen } from "./ChallengeLeaderboardScreen";
import { ChallengeMyTeamScreen } from "./ChallengeMyTeamScreen";
import { ChallengeResultScreen } from "./ChallengeResultScreen";
import { ChallengeSharePanel } from "./ChallengeSharePanel";
import { DailyLeaderboardScreen } from "./DailyLeaderboardScreen";
import { ResultBreakdownTable } from "./ResultBreakdownTable";
import { clearDraftState } from "@/lib/storage";

interface Props {
  score?: ScoreResponse | null;
  mode: GameMode;
  isNewBest: boolean;
  onPlayAgain?: () => void;
  challengeId?: string | null;
  challengeShareUrl?: string | null;
  onChallengeFriend?: () => void;
  challengeLoading?: boolean;
  challengeError?: string | null;
  leaderboard?: ChallengeLeaderboard | null;
  comparison?: ChallengeComparison | null;
  mySubmission?: ChallengeMySubmission | null;
  viewerUserId?: string | null;
  onSelectPlayer?: (userId: string, isYou: boolean) => void;
  onBackToLeaderboard?: () => void;
  dailyLeaderboard?: DailyLeaderboard | null;
  dailyPlayAgain?: () => void;
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
  challengeError,
  leaderboard,
  comparison,
  mySubmission,
  viewerUserId,
  onSelectPlayer,
  onBackToLeaderboard,
  dailyLeaderboard,
  dailyPlayAgain,
}: Props) {
  if (dailyLeaderboard) {
    return (
      <DailyLeaderboardScreen
        leaderboard={dailyLeaderboard}
        lastScore={score ?? undefined}
        mode={mode}
        onPlayAgain={dailyPlayAgain}
      />
    );
  }

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

  const penaltyFields = {
    wk_penalty: score.wk_penalty,
    credit_penalty: score.credit_penalty,
    overseas_penalty: score.overseas_penalty,
    overseas_players_over_limit: score.overseas_players_over_limit,
    credits_over_budget: score.credits_over_budget,
    credit_budget: score.credit_budget,
    total_credits: score.total_credits,
  };

  return (
    <div className="animate-fade-up mx-auto max-w-2xl">
      <div className="hero-card rounded-2xl px-5 py-6 sm:px-8 sm:py-8">
        <div className="text-center">
          {isNewBest && (
            <p className="mb-2 text-sm font-medium text-gold">New personal best</p>
          )}
          <p className="text-sm text-cream-muted">Team score</p>
          <p className="mt-1 text-xs text-cream-muted">
            {score.format_label} · {score.wicket_mode_label} · {mode}
          </p>
          <p className="font-[family-name:var(--font-display)] text-6xl leading-none text-gold sm:text-7xl">
            {score.team_score}
          </p>
          <p className="mt-2 text-sm text-cream-muted sm:mt-3">
            {score.total_credits} credits used
          </p>
        </div>

        <div className="mt-6 sm:mt-8">
          <ResultBreakdownTable
            rows={score.breakdown}
            penalties={penaltyFields}
          />
        </div>

        {challengeShareUrl && (
          <ChallengeSharePanel
            url={challengeShareUrl}
            score={score.team_score}
            className="mt-6 sm:mt-8"
          />
        )}

        <div className="mt-6 flex flex-col items-stretch justify-center gap-3 sm:mt-8 sm:flex-row sm:items-center sm:justify-center">
          {challengeError && (
            <p className="w-full text-center text-sm text-crimson sm:col-span-full">
              {challengeError}
            </p>
          )}
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
            onClick={clearDraftState}
            className="btn-outline rounded-xl px-10 py-3.5 text-center text-sm sm:min-w-[10rem] sm:py-4"
          >
            Home
          </Link>
          {challengeId && (
            <Link
              href="/profile"
              className="btn-outline rounded-xl px-10 py-3.5 text-center text-sm sm:min-w-[10rem] sm:py-4"
            >
              Back to challenges
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
