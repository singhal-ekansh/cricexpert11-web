"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { DraftBoard } from "@/components/DraftBoard";
import { GameLogo } from "@/components/GameLogo";
import { HowToPlayModal } from "@/components/HowToPlayModal";
import { ResultScreen } from "@/components/ResultScreen";
import { SiteFooter } from "@/components/SiteFooter";
import { scoreTeam, startGame } from "@/lib/api";
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
import type {
  BestScoreRecord,
  GameMode,
  GamePhase,
  GameSettings,
  GameStartResponse,
  PlayerCard,
  ScoreResponse,
} from "@/lib/types";

export default function PlayPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
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
  const [resumed, setResumed] = useState(false);
  const [mode, setMode] = useState<GameMode>("easy");
  const [settings, setSettings] = useState<GameSettings>(DEFAULT_GAME_SETTINGS);
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
    setError(null);
    setResumed(true);
    setBest(getBestScore(saved.mode, saved.settings));
    setLoading(false);
  }, []);

  const initGame = useCallback(async () => {
    const activeSettings = getGameSettings();
    const activeMode = getGameMode();
    clearDraftState();
    setSettings(activeSettings);
    setMode(activeMode);
    setLoading(true);
    setError(null);
    setPhase("draft");
    setCurrentRound(1);
    setPicks([]);
    setLineup({});
    setScore(null);
    setIsNewBest(false);
    setResumed(false);
    try {
      const data = await startGame(activeSettings, activeMode);
      setGame(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to start game");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (booted.current) return;
    booted.current = true;

    const saved = loadDraftState();
    if (saved && isDraftResumable(saved)) {
      restoreDraft(saved);
      return;
    }
    if (saved) clearDraftState();
    initGame();
  }, [initGame, restoreDraft]);

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
    const savedMode = getGameMode();
    const savedSettings = getGameSettings();
    setMode(savedMode);
    setSettings(savedSettings);
    setBest(getBestScore(savedMode, savedSettings));
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
    if (!game?.game_id) {
      setError("Missing game session. Start a new draft.");
      return;
    }
    if (!isLineupComplete(lineup)) {
      setError("Fill all 11 slots before submitting.");
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      const payload: Record<string, string> = {};
      for (let s = 1; s <= 11; s++) payload[String(s)] = lineup[s];
      const result = await scoreTeam(game.game_id, payload, settings, mode);
      setScore(result);
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
      setPhase("result");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Scoring failed");
    } finally {
      setSubmitting(false);
    }
  };

  const currentPool = game?.pools[currentRound - 1] ?? [];

  return (
    <main className="relative z-10 min-h-screen">
      <header className="sticky top-0 z-20 border-b border-border/80 bg-[#0c0a10]/85 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
          <Link href="/" className="flex items-center transition-opacity hover:opacity-90">
            <GameLogo variant="header" priority />
          </Link>
          <div className="flex flex-wrap items-center justify-end gap-2 sm:gap-4">
            <button
              type="button"
              onClick={() => setShowHowTo(true)}
              className="btn-outline rounded-lg px-3 py-1.5 text-[11px]"
            >
              How to play
            </button>
            {best && phase !== "result" && (
              <span className="hidden text-xs text-cream-muted sm:inline">
                Best:{" "}
                <span className="font-[family-name:var(--font-mono)] text-gold">
                  {best.team_score}
                </span>
              </span>
            )}
            {game && (
              <span className="hidden rounded border border-border px-2 py-0.5 text-[10px] text-cream-muted sm:inline">
                {game.format_label} · {game.wicket_mode_label}
              </span>
            )}
            <span className="rounded border border-border px-2 py-0.5 text-[10px] font-bold tracking-wider text-gold uppercase">
              {mode}
            </span>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 py-6">
        {resumed && !loading && phase === "draft" && (
          <div className="mb-4 rounded-lg border border-gold/30 bg-gold/5 px-4 py-2.5 text-center text-xs text-cream-muted">
            Draft resumed — same picks and pools as before refresh.
          </div>
        )}

        {loading && (
          <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-gold border-t-transparent" />
            <p className="text-sm text-cream-muted">Generating draft pools…</p>
          </div>
        )}

        {error && (
          <div className="mb-6 rounded-lg border border-crimson/40 bg-crimson/10 px-4 py-3 text-sm text-crimson">
            {error}
            <button
              type="button"
              onClick={initGame}
              className="ml-3 underline hover:no-underline"
            >
              Start new draft
            </button>
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
          />
        )}

        {!loading && phase === "result" && score && (
          <ResultScreen
            score={score}
            mode={mode}
            isNewBest={isNewBest}
            onPlayAgain={initGame}
          />
        )}
      </div>

      <HowToPlayModal
        open={showHowTo}
        onClose={() => setShowHowTo(false)}
        creditBudget={game?.credit_budget}
      />

      <SiteFooter className="mt-8" />
    </main>
  );
}
