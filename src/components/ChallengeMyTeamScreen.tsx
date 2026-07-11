"use client";

import Link from "next/link";
import type { ChallengeMySubmission } from "@/lib/types";
import { challengePageUrl, isChallengeShareable } from "@/lib/challenge";
import { userDisplayName } from "@/lib/user";
import { rankWithPlayerCount } from "@/lib/rank";
import { ChallengeSharePanel } from "./ChallengeSharePanel";
import { ResultBreakdownTable } from "./ResultBreakdownTable";

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
  const penaltyFields = {
    wk_penalty: submission.wk_penalty,
    credit_penalty: submission.credit_penalty,
    credits_over_budget: submission.credits_over_budget,
    credit_budget: submission.credit_budget,
    total_credits: submission.total_credits,
  };

  return (
    <div className="animate-fade-up mx-auto w-full max-w-2xl">
      <div className="hero-card rounded-2xl px-3 py-5 sm:px-8 sm:py-8">
        {onBack && (
          <button
            type="button"
            onClick={onBack}
            className="mb-4 text-sm text-cream-muted transition-colors hover:text-cream"
          >
            ← Back to leaderboard
          </button>
        )}

        <div className="text-center">
          <p className="text-sm font-medium text-cream">Your team</p>
          <p className="mt-2 text-sm text-cream-muted">{name}</p>
          {submission.rank != null && submission.player_count > 0 && (
            <p className="mt-2 text-xs text-cream-muted">
              {rankWithPlayerCount(submission.rank, submission.player_count)}
            </p>
          )}
          <p className="mt-3 font-[family-name:var(--font-display)] text-5xl text-gold sm:text-6xl">
            {submission.team_score}
          </p>
          <p className="mt-2 text-sm text-cream-muted">
            {submission.total_credits} credits used
          </p>
        </div>

        <div className="mt-6 sm:mt-8">
          <ResultBreakdownTable
            rows={submission.breakdown}
            penalties={penaltyFields}
          />
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
