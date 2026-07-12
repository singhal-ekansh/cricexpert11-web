"use client";

import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { Suspense, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useAuth } from "@/components/AuthProvider";
import { DraftBoard } from "@/components/DraftBoard";
import { GameLogo } from "@/components/GameLogo";
import { GoogleSignInModal } from "@/components/GoogleSignInModal";
import { HowToPlayModal } from "@/components/HowToPlayModal";
import { ResultScreen } from "@/components/ResultScreen";
import { SiteFooter } from "@/components/SiteFooter";
import {
  createChallenge,
  getChallenge,
  getChallengeComparison,
  getChallengeLeaderboard,
  getChallengeMySubmission,
  scoreTeam,
  siteUrl,
  startGame,
  submitChallenge,
} from "@/lib/api";
import { firstEmptySlot, isLineupComplete } from "@/lib/draft";
import {
  clearDraftState,
  DEFAULT_GAME_SETTINGS,
  getBestScore,
  getGameMode,
  getGameSettings,
  isDraftResumable,
  loadDraftState,
  saveBestScore,
  saveDraftState,
  type SavedDraftState,
} from "@/lib/storage";
import { scrollToTop } from "@/lib/scroll";
import type {
  BestScoreRecord,
  ChallengeComparison,
  ChallengeDetail,
  ChallengeLeaderboard,
  ChallengeMySubmission,
  GameMode,
  GamePhase,
  GameSettings,
  GameStartResponse,
  PlayerCard,
  ScoreResponse,
} from "@/lib/types";
import { userDisplayName } from "@/lib/user";

async function loadChallengeLeaderboard(
  challengeId: string,
): Promise<ChallengeLeaderboard> {
  return getChallengeLeaderboard(challengeId);
}

function PlayPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const challengeId = searchParams.get("challenge");
  const viewResult = searchParams.get("view") === "result";
  const { user } = useAuth();

  const [loading, setLoading] = useState(true);
  const [bootFailed, setBootFailed] = useState(false);
  const [phase, setPhase] = useState<GamePhase>("draft");
  const [game, setGame] = useState<GameStartResponse | null>(null);
  const [currentRound, setCurrentRound] = useState(1);
  const [picks, setPicks] = useState<PlayerCard[]>([]);
  const [lineup, setLineup] = useState<Record<number, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [score, setScore] = useState<ScoreResponse | null>(null);
  const [isNewBest, setIsNewBest] = useState(false);
  const [best, setBest] = useState<BestScoreRecord | null>(null);
  const [showHowTo, setShowHowTo] = useState(false);
  const [mode, setMode] = useState<GameMode>("easy");
  const [settings, setSettings] = useState<GameSettings>(DEFAULT_GAME_SETTINGS);
  const [challengeMeta, setChallengeMeta] = useState<ChallengeDetail | null>(null);
  const [leaderboard, setLeaderboard] = useState<ChallengeLeaderboard | null>(null);
  const [comparison, setComparison] = useState<ChallengeComparison | null>(null);
  const [mySubmission, setMySubmission] = useState<ChallengeMySubmission | null>(null);
  const [comparisonLoading, setComparisonLoading] = useState(false);
  const [createdChallengeId, setCreatedChallengeId] = useState<string | null>(null);
  const [challengeShareUrl, setChallengeShareUrl] = useState<string | null>(null);
  const [challengeLoading, setChallengeLoading] = useState(false);
  const [showChallengeLogin, setShowChallengeLogin] = useState(false);
  const booted = useRef(false);
  const showStats = mode === "easy";

  const playerMap = useMemo(
    () => Object.fromEntries(picks.map((p) => [p.player_id, p])),
    [picks],
  );

  const draftComplete =
    picks.length >= (game?.rounds ?? 11) && isLineupComplete(lineup);

  const restoreDraft = useCallback((saved: SavedDraftState) => {
    setMode(saved.mode);
    setSettings(saved.settings);
    setGame(saved.game);
    setPicks(saved.picks);
    setLineup(saved.lineup);
    setCurrentRound(saved.currentRound);
    setPhase(saved.phase);
    setScore(saved.score ?? null);
    setIsNewBest(saved.isNewBest ?? false);
    setBootFailed(false);
    setBest(getBestScore(saved.mode, saved.settings));
    setLoading(false);
  }, []);

  const initGame = useCallback(
    async (opts?: {
      seed?: number;
      settings?: GameSettings;
      mode?: GameMode;
      keepChallenge?: boolean;
    }) => {
      const activeSettings = opts?.settings ?? getGameSettings();
      const activeMode = opts?.mode ?? getGameMode();
      clearDraftState();
      setSettings(activeSettings);
      setMode(activeMode);
      setLoading(true);
      setBootFailed(false);
      setPhase("draft");
      setCurrentRound(1);
      setPicks([]);
      setLineup({});
      setScore(null);
      setIsNewBest(false);
      if (!opts?.keepChallenge) {
        setCreatedChallengeId(null);
        setChallengeShareUrl(null);
        setComparison(null);
        setLeaderboard(null);
        setMySubmission(null);
      }
      try {
        const data = await startGame(activeSettings, activeMode, opts?.seed);
        setGame(data);
      } catch {
        setBootFailed(true);
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  useEffect(() => {
    if (booted.current) return;
    booted.current = true;

    const boot = async () => {
      if (challengeId) {
        setLoading(true);
        try {
          const meta = await getChallenge(challengeId);
          setChallengeMeta(meta);

          if (viewResult || meta.viewer_has_submitted) {
            clearDraftState();
            try {
              const board = await loadChallengeLeaderboard(challengeId);
              setLeaderboard(board);
              setComparison(null);
              setMySubmission(null);
              setPhase("result");
            } catch {
              router.replace("/");
            } finally {
              setLoading(false);
            }
            return;
          }

          const saved = loadDraftState();
          if (saved && isDraftResumable(saved)) {
            restoreDraft(saved);
            return;
          }
          if (saved) clearDraftState();

          const challengeSettings: GameSettings = {
            format: meta.format,
            wicketMode: meta.wicket_mode,
          };
          await initGame({
            seed: meta.seed,
            settings: challengeSettings,
            mode: meta.mode,
            keepChallenge: true,
          });
        } catch {
          router.replace("/");
          setLoading(false);
        }
        return;
      }

      const saved = loadDraftState();
      if (saved && isDraftResumable(saved)) {
        restoreDraft(saved);
        return;
      }
      if (saved) clearDraftState();

      initGame();
    };

    void boot();
  }, [challengeId, viewResult, initGame, restoreDraft, router]);

  useEffect(() => {
    if (loading || !game) return;
    if (phase !== "draft" && phase !== "result") return;
    saveDraftState({
      mode,
      settings,
      game,
      picks,
      lineup,
      currentRound,
      phase,
      score: score ?? undefined,
      isNewBest,
    });
  }, [
    loading,
    game,
    mode,
    settings,
    picks,
    lineup,
    currentRound,
    phase,
    score,
    isNewBest,
  ]);

  useEffect(() => {
    if (challengeId) return;
    const savedMode = getGameMode();
    const savedSettings = getGameSettings();
    setMode(savedMode);
    setSettings(savedSettings);
    setBest(getBestScore(savedMode, savedSettings));
  }, [challengeId]);

  useEffect(() => {
    scrollToTop();
  }, [phase, comparison, mySubmission, comparisonLoading]);

  const handleSelectPlayer = useCallback(
    async (userId: string, isYou: boolean) => {
      if (!challengeId) return;
      setComparisonLoading(true);
      try {
        if (isYou) {
          const team = await getChallengeMySubmission(challengeId);
          setMySubmission(team);
          setComparison(null);
        } else {
          const cmp = await getChallengeComparison(challengeId, userId);
          setComparison(cmp);
          setMySubmission(null);
        }
      } catch {
        // comparison unavailable — stay on leaderboard
      } finally {
        setComparisonLoading(false);
      }
    },
    [challengeId],
  );

  const handleBackToLeaderboard = useCallback(() => {
    setComparison(null);
    setMySubmission(null);
  }, []);

  const handlePick = (player: PlayerCard) => {
    if (draftComplete || picks.length >= (game?.rounds ?? 11)) return;
    const nextSlot = firstEmptySlot(lineup);
    if (nextSlot === null) return;
    setPicks((prev) => [...prev, player]);
    setLineup((prev) => ({ ...prev, [nextSlot]: player.player_id }));
    if (currentRound < (game?.rounds ?? 11)) {
      setCurrentRound((r) => r + 1);
    }
  };

  const handleUndo = () => {
    if (picks.length === 0 || draftComplete) return;
    const last = picks[picks.length - 1];
    const nextLen = picks.length - 1;
    setPicks((prev) => prev.slice(0, -1));
    setLineup((prev) => {
      const next = { ...prev };
      for (const [slot, pid] of Object.entries(next)) {
        if (pid === last.player_id) delete next[Number(slot)];
      }
      return next;
    });
    setCurrentRound(nextLen + 1);
  };

  const handleSubmit = async () => {
    if (!game?.game_id || !isLineupComplete(lineup)) return;
    setSubmitting(true);
    try {
      const payload: Record<string, string> = {};
      for (let s = 1; s <= 11; s++) payload[String(s)] = lineup[s];

      if (challengeId && challengeMeta && !challengeMeta.viewer_is_creator) {
        const result = await submitChallenge(challengeId, {
          game_id: game.game_id,
          lineup: payload,
        });
        setScore(result.your_score);
        setLeaderboard(result.leaderboard);
        setComparison(null);
        setMySubmission(null);
        clearDraftState();
        setPhase("result");
        return;
      }

      const result = await scoreTeam(game.game_id, payload, settings, mode);
      setScore(result);
      if (!challengeId) {
        const isBest = saveBestScore({
          team_score: result.team_score,
          raw_score: result.raw_score,
          total_credits: result.total_credits,
          achieved_at: new Date().toISOString(),
          mode,
          format: result.format,
          wicket_mode: result.wicket_mode,
          lineup: result.breakdown,
        });
        setIsNewBest(isBest);
        setBest(getBestScore(mode, settings));
      }
      setPhase("result");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Scoring failed";
      if (
        challengeId &&
        message.toLowerCase().includes("already submitted")
      ) {
        clearDraftState();
        try {
          const board = await loadChallengeLeaderboard(challengeId);
          setLeaderboard(board);
          setComparison(null);
          setMySubmission(null);
          setPhase("result");
          return;
        } catch {
          router.replace(challengeId ? `/c/${challengeId}` : "/");
        }
      }
    } finally {
      setSubmitting(false);
    }
  };

  const doCreateChallenge = useCallback(async () => {
    if (!game || !score) return;
    const payload: Record<string, string> = {};
    for (let s = 1; s <= 11; s++) payload[String(s)] = lineup[s];

    setChallengeLoading(true);
    try {
      const created = await createChallenge({
        game_id: game.game_id,
        seed: game.seed,
        format: settings.format,
        wicket_mode: settings.wicketMode,
        mode,
        lineup: payload,
      });
      setCreatedChallengeId(created.id);
      setChallengeShareUrl(siteUrl(`/c/${created.id}`));
    } catch {
      // challenge creation unavailable — user can retry from result screen
    } finally {
      setChallengeLoading(false);
    }
  }, [game, score, lineup, settings, mode]);

  const handleChallengeFriend = () => {
    if (!user) {
      setShowChallengeLogin(true);
      return;
    }
    void doCreateChallenge();
  };

  const currentPool = game?.pools[currentRound - 1] ?? [];

  return (
    <main className="relative z-10 min-h-screen">
      <header className="app-header sticky top-0 z-20">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-2 px-3 py-2.5 sm:px-4 sm:py-3">
          <Link href="/" className="flex shrink-0 items-center transition-opacity hover:opacity-80">
            <GameLogo variant="header" priority />
          </Link>
          <div className="flex items-center justify-end gap-2 sm:gap-3">
            {game && phase === "draft" && (
              <span className="hidden text-xs text-cream-muted sm:inline">
                Round {currentRound}/{game.rounds}
              </span>
            )}
            <button
              type="button"
              onClick={() => setShowHowTo(true)}
              className={[
                "btn-ghost rounded-lg px-2 py-1 text-xs sm:px-2.5",
                challengeId ? "hidden sm:inline-flex" : "",
              ].join(" ")}
            >
              Rules
            </button>
            {user && !challengeId && (
              <Link href="/profile" className="btn-ghost text-xs">
                Profile
              </Link>
            )}
            {best && phase !== "result" && !challengeId && (
              <span className="hidden text-xs text-cream-muted sm:inline">
                Best{" "}
                <span className="font-[family-name:var(--font-mono)] text-gold">
                  {best.team_score}
                </span>
              </span>
            )}
          </div>
        </div>
      </header>

      <div
        className={[
          "mx-auto py-4 sm:py-6",
          challengeId ? "max-w-2xl px-3 sm:px-4" : "max-w-7xl px-3 sm:px-4",
        ].join(" ")}
      >
        {challengeMeta && phase === "draft" && challengeMeta.creator_score != null && (
          <div className="mb-4 rounded-xl border border-border bg-accent-muted px-4 py-3 text-center text-sm text-cream-muted">
            Beat{" "}
            <span className="font-medium text-cream">
              {userDisplayName(challengeMeta.creator?.display_name, "friend")}&apos;s {challengeMeta.creator_score}
            </span>
          </div>
        )}

        {loading && (
          <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-gold border-t-transparent" />
            <p className="text-sm text-cream-muted">Generating draft pools…</p>
          </div>
        )}

        {bootFailed && !loading && !game && (
          <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 text-center">
            <p className="text-sm text-cream-muted">Ready when you are.</p>
            <div className="flex flex-col gap-3 sm:flex-row">
              {!challengeId && (
                <button
                  type="button"
                  onClick={() => initGame()}
                  className="btn-gold rounded-xl px-8 py-3 text-sm"
                >
                  Start draft
                </button>
              )}
              <Link href="/" className="btn-outline rounded-xl px-8 py-3 text-sm">
                Home
              </Link>
            </div>
          </div>
        )}

        {!loading && game && phase === "draft" && (
          <DraftBoard
            round={currentRound}
            totalRounds={game.rounds}
            pool={currentPool}
            lineup={lineup}
            playerMap={playerMap}
            onPick={handlePick}
            onUndo={mode === "easy" ? handleUndo : undefined}
            canUndo={mode === "easy" && picks.length > 0 && !draftComplete}
            onLineupChange={setLineup}
            onSubmit={handleSubmit}
            submitting={submitting}
            draftComplete={draftComplete}
            mode={mode}
            showStats={showStats}
            creditBudget={game.credit_budget}
            formatLabel={game.format_label}
            wicketLabel={game.wicket_mode_label}
            formatId={game.format}
          />
        )}

        {!loading && comparisonLoading && (
          <div className="flex min-h-[30vh] flex-col items-center justify-center gap-3">
            <div className="h-7 w-7 animate-spin rounded-full border-2 border-gold border-t-transparent" />
            <p className="text-sm text-cream-muted">Loading comparison…</p>
          </div>
        )}

        {!loading && !comparisonLoading && phase === "result" && (score || comparison || leaderboard || mySubmission) && (
          <ResultScreen
            score={score}
            mode={mode}
            isNewBest={isNewBest}
            onPlayAgain={
              challengeId
                ? undefined
                : () => initGame()
            }
            challengeId={createdChallengeId ?? challengeId}
            challengeShareUrl={challengeShareUrl}
            onChallengeFriend={
              !challengeId && score ? handleChallengeFriend : undefined
            }
            challengeLoading={challengeLoading}
            leaderboard={leaderboard}
            comparison={comparison}
            mySubmission={mySubmission}
            viewerUserId={user?.id}
            onSelectPlayer={handleSelectPlayer}
            onBackToLeaderboard={handleBackToLeaderboard}
          />
        )}
      </div>

      <GoogleSignInModal
        open={showChallengeLogin}
        onClose={() => setShowChallengeLogin(false)}
        onSuccess={() => {
          setShowChallengeLogin(false);
          void doCreateChallenge();
        }}
      />

      <HowToPlayModal
        open={showHowTo}
        onClose={() => setShowHowTo(false)}
        creditBudget={game?.credit_budget}
      />

      <SiteFooter className="mt-8" />
    </main>
  );
}

export default function PlayPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center text-cream-muted">
          Loading…
        </div>
      }
    >
      <PlayPageContent />
    </Suspense>
  );
}
