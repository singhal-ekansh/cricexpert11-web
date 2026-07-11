"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { useAuth } from "@/components/AuthProvider";
import { GameLogo } from "@/components/GameLogo";
import { GoogleSignInModal } from "@/components/GoogleSignInModal";
import { ChallengeSharePanel } from "@/components/ChallengeSharePanel";
import { SiteFooter } from "@/components/SiteFooter";
import { getChallenge, joinChallenge } from "@/lib/api";
import type { ChallengeDetail } from "@/lib/types";
import { challengePageUrl, isChallengeShareable } from "@/lib/challenge";
import { userDisplayName } from "@/lib/user";

export default function ChallengePage() {
  const params = useParams();
  const router = useRouter();
  const challengeId = String(params.id ?? "");
  const { user, loading: authLoading } = useAuth();
  const [challenge, setChallenge] = useState<ChallengeDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [unavailable, setUnavailable] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [joining, setJoining] = useState(false);

  const loadChallenge = useCallback(async () => {
    setLoading(true);
    setUnavailable(false);
    try {
      const data = await getChallenge(challengeId);
      setChallenge(data);
    } catch {
      setChallenge(null);
      setUnavailable(true);
    } finally {
      setLoading(false);
    }
  }, [challengeId]);

  useEffect(() => {
    loadChallenge();
  }, [loadChallenge]);

  useEffect(() => {
    if (
      !authLoading &&
      user &&
      challenge?.viewer_has_submitted &&
      !challenge.viewer_is_creator
    ) {
      router.replace(`/play?challenge=${challengeId}&view=result`);
    }
  }, [authLoading, user, challenge, challengeId, router]);

  const handleJoinAndPlay = async () => {
    if (!user) {
      setShowLogin(true);
      return;
    }
    if (challenge?.viewer_has_submitted) {
      router.push(`/play?challenge=${challengeId}&view=result`);
      return;
    }
    setJoining(true);
    try {
      await joinChallenge(challengeId);
      router.push(`/play?challenge=${challengeId}`);
    } catch {
      await loadChallenge();
    } finally {
      setJoining(false);
    }
  };

  const onLoginSuccess = async () => {
    setShowLogin(false);
    try {
      await joinChallenge(challengeId);
    } catch {
      // join may fail for creator — still ok
    }
    try {
      const data = await getChallenge(challengeId);
      setChallenge(data);
      if (data.viewer_has_submitted && !data.viewer_is_creator) {
        router.push(`/play?challenge=${challengeId}&view=result`);
      }
    } catch {
      await loadChallenge();
    }
  };

  return (
    <main className="relative z-10 min-h-screen">
      <header className="app-header px-4 py-3">
        <div className="mx-auto flex max-w-2xl items-center justify-between">
          <Link href="/" className="hover:opacity-80">
            <GameLogo variant="header" />
          </Link>
          {user && (
            <Link href="/profile" className="btn-ghost text-xs">
              Profile
            </Link>
          )}
        </div>
      </header>

      <div className="mx-auto max-w-2xl px-4 py-10">
        {loading && (
          <p className="text-center text-sm text-cream-muted">Loading challenge…</p>
        )}

        {unavailable && !loading && (
          <div className="hero-card rounded-2xl px-6 py-10 text-center">
            <p className="font-[family-name:var(--font-display)] text-2xl text-cream">
              This challenge isn&apos;t available
            </p>
            <p className="mt-2 text-sm text-cream-muted">
              It may have expired or the link may be out of date.
            </p>
            <Link href="/" className="btn-outline mt-6 inline-block rounded-xl px-8 py-3 text-sm">
              Play a draft
            </Link>
            {user && (
              <Link
                href="/profile"
                className="btn-outline mt-3 inline-block rounded-xl px-8 py-3 text-sm"
              >
                Back to challenges
              </Link>
            )}
          </div>
        )}

        {challenge && !loading && (
          <div className="hero-card rounded-2xl px-6 py-8 text-center">
            <p className="text-sm text-accent">
              {challenge.viewer_is_creator ? "My challenge" : "Friend challenge"}
            </p>
            <h1 className="mt-2 text-2xl font-semibold text-cream sm:text-3xl">
              {challenge.viewer_is_creator ? (
                <>
                  You scored{" "}
                  <span className="text-gold">{challenge.creator_score}</span>
                </>
              ) : (
                <>
                  {userDisplayName(challenge.creator?.display_name, "Someone")} scored{" "}
                  <span className="text-gold">{challenge.creator_score}</span>
                </>
              )}
            </h1>
            <p className="mt-2 text-sm text-cream-muted">
              {challenge.format.toUpperCase()} · {challenge.wicket_mode} ·{" "}
              {challenge.mode}
            </p>
            <p className="mt-4 text-sm text-cream">
              {challenge.viewer_is_creator
                ? "Share with a friend — same draft, can they beat your score?"
                : "Can you build a better XI and beat this score?"}
            </p>

            {!authLoading && !challenge.viewer_is_creator && (
              <button
                type="button"
                onClick={handleJoinAndPlay}
                disabled={joining}
                className="btn-gold mt-8 rounded-xl px-10 py-3.5 text-sm disabled:opacity-50"
              >
                {challenge.viewer_has_submitted
                  ? "View leaderboard"
                  : joining
                    ? "Starting…"
                    : user
                      ? "Accept & draft"
                      : "Sign in & play"}
              </button>
            )}

            {challenge.viewer_is_creator && challenge.submission_count >= 2 && (
              <Link
                href={`/play?challenge=${challengeId}&view=result`}
                className="btn-outline mt-6 inline-block rounded-xl px-8 py-3 text-sm"
              >
                View leaderboard
              </Link>
            )}

            {isChallengeShareable(challenge.expires_at) && (
              <div className="mt-6 text-left">
                <ChallengeSharePanel
                  url={challengePageUrl(challenge.id)}
                  score={
                    challenge.viewer_is_creator
                      ? challenge.creator_score
                      : challenge.viewer_has_submitted
                        ? undefined
                        : challenge.creator_score
                  }
                />
              </div>
            )}

            {!isChallengeShareable(challenge.expires_at) && (
              <p className="mt-6 text-xs text-cream-muted">This challenge has expired.</p>
            )}

            {user && (
              <Link
                href="/profile"
                className="btn-outline mt-6 inline-block rounded-xl px-8 py-3 text-sm"
              >
                Back to challenges
              </Link>
            )}
          </div>
        )}
      </div>

      <GoogleSignInModal
        open={showLogin}
        onClose={() => setShowLogin(false)}
        onSuccess={onLoginSuccess}
      />

      <SiteFooter className="mt-8" />
    </main>
  );
}
