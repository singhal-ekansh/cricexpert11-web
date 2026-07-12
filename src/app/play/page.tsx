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
  getDailyLeaderboard,
  getDailyPuzzleToday,
  scoreTeam,
  siteUrl,
  startChallengeDraft,
  startDailyPuzzle,
  startGame,
  submitChallenge,
  submitDailyPuzzle,
} from "@/lib/api";
import { firstEmptySlot, isLineupComplete } from "@/lib/draft";
import {
  clearDraftState,
  DEFAULT_GAME_SETTINGS,
  getBestScore,
  getGameMode,
  getGameSettings,
  isChallengeDraftResumable,
  isDailyDraftResumable,
  isInProgressDraftResumable,
  isPageReload,
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
  DailyLeaderboard,
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
  const isDaily = searchParams.get("daily") === "1";
  const viewResult = searchParams.get("view") === "result";
  const viewDailyLeaderboard = searchParams.get("view") === "leaderboard";
  const freshStart = searchParams.get("fresh") === "1";
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
  const [challengeError, setChallengeError] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [showChallengeLogin, setShowChallengeLogin] = useState(false);
  const [showDailyLogin, setShowDailyLogin] = useState(false);
  const [dailyPuzzleId, setDailyPuzzleId] = useState<string | null>(null);
  const [dailyLeaderboard, setDailyLeaderboard] = useState<DailyLeaderboard | null>(null);
  const lastBootKey = useRef<string | null>(null);
  const lineupRef = useRef(lineup);
  const pendingDailySubmit = useRef(false);
  lineupRef.current = lineup;
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
    setDailyPuzzleId(saved.dailyPuzzleId ?? null);
    setDailyLeaderboard(null);
    setBootFailed(false);
    setBest(getBestScore(saved.mode, saved.settings));
    setLoading(false);
  }, []);

  const showDailyLeaderboard = useCallback(async (puzzleId: string) => {
    clearDraftState();
    const board = await getDailyLeaderboard();
    setDailyPuzzleId(puzzleId);
    setDailyLeaderboard(board);
    setGame(null);
    setPicks([]);
    setLineup({});
    setScore(null);
    setPhase("result");
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
    const bootKey = [
      challengeId ?? "",
      isDaily ? "1" : "0",
      viewDailyLeaderboard ? "lb" : "",
      viewResult ? "result" : "",
      freshStart ? "fresh" : "",
    ].join(":");

    if (lastBootKey.current === bootKey) return;
    lastBootKey.current = bootKey;

    const boot = async () => {
      if (isDaily) {
        setLoading(true);
        setBootFailed(false);
        try {
          const today = await getDailyPuzzleToday();
          if (!today.is_active) {
            router.replace("/");
            return;
          }
          setDailyPuzzleId(today.puzzle_id);
          const dailySettings: GameSettings = {
            format: today.format,
            wicketMode: today.wicket_mode,
          };
          setSettings(dailySettings);
          setMode(today.mode);

          if (freshStart) {
            clearDraftState();
            const data = await startDailyPuzzle();
            setGame(data);
            setDailyPuzzleId(data.puzzle_id);
            setDailyLeaderboard(null);
            setPhase("draft");
            setCurrentRound(1);
            setPicks([]);
            setLineup({});
            setScore(null);
            return;
          }

          const alreadyPlayed = (today.viewer?.attempt_count ?? 0) >= 1;
          if (viewDailyLeaderboard || alreadyPlayed) {
            await showDailyLeaderboard(today.puzzle_id);
            if (!viewDailyLeaderboard) {
              router.replace("/play?daily=1&view=leaderboard", { scroll: false });
            }
            return;
          }

          const saved = loadDraftState();
          if (
            saved &&
            isPageReload() &&
            isDailyDraftResumable(saved, today.puzzle_id)
          ) {
            restoreDraft(saved);
            setDailyPuzzleId(saved.dailyPuzzleId ?? today.puzzle_id);
            return;
          }
          if (saved) clearDraftState();

          const data = await startDailyPuzzle();
          setGame(data);
          setDailyPuzzleId(data.puzzle_id);
          setPhase("draft");
        } catch {
          setBootFailed(true);
        } finally {
          setLoading(false);
        }
        return;
      }

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
          if (saved && isChallengeDraftResumable(saved, challengeId, meta)) {
            restoreDraft(saved);
            return;
          }
          if (saved) clearDraftState();

          const challengeSettings: GameSettings = {
            format: meta.format,
            wicketMode: meta.wicket_mode,
          };
          setSettings(challengeSettings);
          setMode(meta.mode);
          setLoading(true);
          setBootFailed(false);
          setPhase("draft");
          setCurrentRound(1);
          setPicks([]);
          setLineup({});
          setScore(null);
          setIsNewBest(false);
          try {
            const data = await startChallengeDraft(challengeId);
            setGame(data);
          } catch {
            setBootFailed(true);
          } finally {
            setLoading(false);
          }
        } catch {
          router.replace("/");
          setLoading(false);
        }
        return;
      }

      const saved = loadDraftState();
      const mode = getGameMode();
      const settings = getGameSettings();

      if (freshStart) {
        clearDraftState();
        await initGame({ settings, mode });
        router.replace("/play", { scroll: false });
        return;
      }

      if (
        saved &&
        isPageReload() &&
        isInProgressDraftResumable(saved, mode, settings)
      ) {
        restoreDraft(saved);
        return;
      }
      if (saved) clearDraftState();

      await initGame({ settings, mode });
    };

    void boot();
  }, [
    challengeId,
    isDaily,
    viewResult,
    viewDailyLeaderboard,
    freshStart,
    initGame,
    restoreDraft,
    router,
    showDailyLeaderboard,
  ]);

  useEffect(() => {
    if (loading || !game || phase !== "draft" || viewDailyLeaderboard) return;
    saveDraftState({
      challengeId: challengeId ?? undefined,
      dailyPuzzleId: dailyPuzzleId ?? undefined,
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
    challengeId,
    dailyPuzzleId,
    mode,
    settings,
    picks,
    lineup,
    currentRound,
    phase,
    score,
    isNewBest,
    viewDailyLeaderboard,
  ]);

  useEffect(() => {
    if (challengeId || isDaily) return;
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
    setSubmitError(null);
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

  const runDailySubmit = useCallback(async () => {
    const activeLineup = lineupRef.current;
    if (!game?.game_id || !dailyPuzzleId || !isLineupComplete(activeLineup)) return;

    setSubmitError(null);
    setSubmitting(true);
    try {
      const payload: Record<string, string> = {};
      for (let s = 1; s <= 11; s++) payload[String(s)] = activeLineup[s];

      const result = await submitDailyPuzzle({
        puzzle_id: dailyPuzzleId,
        game_id: game.game_id,
        lineup: payload,
      });
      setScore(result.your_score);
      setDailyLeaderboard(result.leaderboard);
      setIsNewBest(result.is_new_best);
      clearDraftState();
      setPhase("result");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Scoring failed";
      setSubmitError(message);
    } finally {
      setSubmitting(false);
      pendingDailySubmit.current = false;
    }
  }, [game, dailyPuzzleId]);

  const handleSubmit = useCallback(async () => {
    const activeLineup = lineupRef.current;
    if (!game?.game_id || !isLineupComplete(activeLineup)) return;

    if (isDaily) {
      if (!user) {
        pendingDailySubmit.current = true;
        setShowDailyLogin(true);
        return;
      }
      await runDailySubmit();
      return;
    }

    setSubmitError(null);
    setSubmitting(true);
    try {
      const payload: Record<string, string> = {};
      for (let s = 1; s <= 11; s++) payload[String(s)] = activeLineup[s];

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
        setLeaderboard(null);
        setComparison(null);
        setMySubmission(null);
        setCreatedChallengeId(null);
        setChallengeShareUrl(null);
        setChallengeError(null);
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
      clearDraftState();
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
      } else {
        setSubmitError(message);
      }
    } finally {
      setSubmitting(false);
    }
  }, [
    game,
    challengeId,
    challengeMeta,
    settings,
    mode,
    router,
    isDaily,
    user,
    runDailySubmit,
  ]);

  const doCreateChallenge = useCallback(async () => {
    if (!game || !score) return;
    const payload: Record<string, string> = {};
    for (let s = 1; s <= 11; s++) payload[String(s)] = lineup[s];

    const allowed = new Set(game.pools.flat().map((player) => player.player_id));
    const invalid = Object.values(payload).filter((playerId) => !allowed.has(playerId));
    if (invalid.length > 0) {
      setChallengeError("Your lineup doesn't match this draft. Try drafting again.");
      return;
    }

    const poolPlayerIds = game.pools.map((pool) =>
      pool.map((player) => player.player_id),
    );

    setChallengeLoading(true);
    setChallengeError(null);
    try {
      const created = await createChallenge({
        game_id: game.game_id,
        seed: game.seed,
        format: game.format,
        wicket_mode: game.wicket_mode,
        mode: game.mode ?? mode,
        lineup: payload,
        pool_player_ids: poolPlayerIds,
      });
      setCreatedChallengeId(created.id);
      setChallengeShareUrl(siteUrl(`/c/${created.id}`));
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Could not create challenge";
      setChallengeError(message);
    } finally {
      setChallengeLoading(false);
    }
  }, [game, score, lineup, mode]);

  const handleChallengeFriend = () => {
    if (!user) {
      setShowChallengeLogin(true);
      return;
    }
    void doCreateChallenge();
  };

  const handleDailyPlayAgain = () => {
    router.push("/play?daily=1&fresh=1");
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
                challengeId || isDaily ? "hidden sm:inline-flex" : "",
              ].join(" ")}
            >
              Rules
            </button>
            {user && !challengeId && !isDaily && (
              <Link href="/profile" className="btn-ghost text-xs">
                Profile
              </Link>
            )}
            {best && phase !== "result" && !challengeId && !isDaily && (
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
          challengeId || isDaily ? "max-w-2xl px-3 sm:px-4" : "max-w-7xl px-3 sm:px-4",
        ].join(" ")}
      >
        {isDaily && phase === "draft" && game && (
          <div className="mb-4 rounded-xl border border-gold/25 bg-gold/5 px-4 py-3 text-center text-sm text-cream-muted">
            <span className="font-medium text-cream">Daily challenge</span>
            {" · "}
            {game.format_label} · {game.wicket_mode_label} · {mode}
          </div>
        )}

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
              {!challengeId && !isDaily && (
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

        {!loading && game && phase === "draft" && !viewDailyLeaderboard && (
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
            submitError={submitError}
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

        {!loading && !comparisonLoading && phase === "result" && (score || comparison || leaderboard || mySubmission || dailyLeaderboard) && (
          <ResultScreen
            score={score}
            mode={mode}
            isNewBest={isNewBest}
            onPlayAgain={
              challengeId || isDaily
                ? undefined
                : () => initGame()
            }
            challengeId={challengeId}
            challengeShareUrl={challengeShareUrl}
            onChallengeFriend={
              !challengeId && !isDaily && score ? handleChallengeFriend : undefined
            }
            challengeLoading={challengeLoading}
            challengeError={challengeError}
            leaderboard={leaderboard}
            comparison={comparison}
            mySubmission={mySubmission}
            viewerUserId={user?.id}
            onSelectPlayer={handleSelectPlayer}
            onBackToLeaderboard={handleBackToLeaderboard}
            dailyLeaderboard={dailyLeaderboard}
            dailyPlayAgain={isDaily ? handleDailyPlayAgain : undefined}
          />
        )}
      </div>

      <GoogleSignInModal
        open={showDailyLogin}
        onClose={() => {
          setShowDailyLogin(false);
          pendingDailySubmit.current = false;
        }}
        onSuccess={() => {
          setShowDailyLogin(false);
          if (pendingDailySubmit.current) {
            void runDailySubmit();
          }
        }}
      />

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
