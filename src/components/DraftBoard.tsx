"use client";

import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { useEffect, useMemo, useState } from "react";
import type { GameMode, PlayerCard } from "@/lib/types";
import { reorderLineup, sortPoolByRole } from "@/lib/draft";
import { DraftSlotRow } from "./DraftSlotRow";
import { DragHandleIcon } from "./DragHandleIcon";
import { PoolPlayerRow } from "./PoolPlayerRow";

interface Props {
  round: number;
  totalRounds: number;
  pool: PlayerCard[];
  lineup: Record<number, string>;
  playerMap: Record<string, PlayerCard>;
  onPick: (player: PlayerCard) => void;
  onUndo?: () => void;
  canUndo?: boolean;
  onLineupChange: (lineup: Record<number, string>) => void;
  onSubmit: () => void;
  submitting: boolean;
  draftComplete: boolean;
  mode: GameMode;
  showStats: boolean;
  creditBudget: number;
  formatLabel?: string;
  wicketLabel?: string;
}

export function DraftBoard({
  round,
  totalRounds,
  pool,
  lineup,
  playerMap,
  onPick,
  onUndo,
  canUndo = false,
  onLineupChange,
  onSubmit,
  submitting,
  draftComplete,
  mode,
  showStats,
  creditBudget,
  formatLabel,
  wicketLabel,
}: Props) {
  const [activePlayer, setActivePlayer] = useState<PlayerCard | null>(null);
  const filled = Array.from({ length: 11 }, (_, i) => lineup[i + 1]).filter(Boolean)
    .length;
  const totalCredits = useMemo(
    () =>
      Object.values(lineup).reduce(
        (sum, pid) => sum + (playerMap[pid]?.credits ?? 0),
        0,
      ),
    [lineup, playerMap],
  );
  const sortedPool = useMemo(() => sortPoolByRole(pool), [pool]);
  const overBudget = totalCredits > creditBudget;
  const progress = draftComplete ? 100 : ((round - 1) / totalRounds) * 100;

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(TouchSensor, {
      activationConstraint: { delay: 150, tolerance: 6 },
    }),
  );

  useEffect(() => {
    if (!activePlayer) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [activePlayer]);

  const handleDragEnd = (event: DragEndEvent) => {
    setActivePlayer(null);
    const { active, over } = event;
    if (!over || typeof over.id !== "string") return;

    const playerId = String(active.id).replace("player-", "");
    const fromSlot = Number(
      Object.entries(lineup).find(([, id]) => id === playerId)?.[0] ?? 0,
    );
    const toSlot = Number(String(over.id).replace("slot-", ""));
    if (!fromSlot || !toSlot || fromSlot === toSlot) return;

    onLineupChange(reorderLineup(lineup, fromSlot, toSlot));
  };

  return (
    <DndContext
      sensors={sensors}
      onDragStart={(e) => {
        const pid = String(e.active.id).replace("player-", "");
        setActivePlayer(playerMap[pid] ?? null);
      }}
      onDragEnd={handleDragEnd}
      onDragCancel={() => setActivePlayer(null)}
    >
      <div className="animate-fade-up space-y-4 pb-24 lg:pb-0">
        {/* Progress strip */}
        <div className="rounded-xl border border-border bg-bg-card px-4 py-3">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-medium text-cream">
                {draftComplete
                  ? "Set batting order"
                  : `Round ${round} of ${totalRounds}`}
              </p>
              {(formatLabel || wicketLabel) && (
                <p className="mt-0.5 text-xs text-cream-muted">
                  {[formatLabel, wicketLabel, mode].filter(Boolean).join(" · ")}
                </p>
              )}
            </div>
            <div className="text-right">
              <p className="font-[family-name:var(--font-mono)] text-lg font-semibold text-cream">
                {filled}
                <span className="text-sm font-normal text-cream-muted">/11</span>
              </p>
              <p
                className={`text-xs font-[family-name:var(--font-mono)] ${
                  overBudget ? "text-crimson" : "text-cream-muted"
                }`}
              >
                {totalCredits}/{creditBudget} cr
              </p>
            </div>
          </div>
          <div className="mt-3 h-1 overflow-hidden rounded-full bg-bg-panel">
            <div
              className="h-full rounded-full bg-accent transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-2 lg:gap-5">
          {/* Pool — first on mobile */}
          <section className="panel-card order-1 flex flex-col rounded-2xl p-4 lg:order-2">
            <header className="mb-3 flex items-center justify-between">
              <div>
                <h2 className="text-sm font-semibold text-cream">
                  {draftComplete ? "Draft complete" : "Choose a player"}
                </h2>
                <p className="mt-0.5 text-xs text-cream-muted">
                  {draftComplete
                    ? "Drag players to reorder your XI"
                    : `${pool.length} available this round`}
                </p>
              </div>
              {canUndo && onUndo && !draftComplete && (
                <button
                  type="button"
                  onClick={onUndo}
                  className="btn-outline rounded-lg px-2.5 py-1 text-xs"
                >
                  Undo
                </button>
              )}
            </header>

            <div className="space-y-1.5">
              {draftComplete ? (
                <div className="flex min-h-[100px] flex-col items-center justify-center rounded-xl border border-dashed border-border p-5 text-center">
                  <p className="text-sm text-cream-muted">
                    Hold{" "}
                    <DragHandleIcon size={14} className="inline text-accent" />{" "}
                    and drag to reorder
                  </p>
                  <p className="mt-1 text-xs text-cream-muted/70">
                    Batters up top, bowlers at the tail
                  </p>
                </div>
              ) : (
                sortedPool.map((player) => (
                  <PoolPlayerRow
                    key={player.player_id}
                    player={player}
                    showStats={showStats}
                    onPick={() => onPick(player)}
                  />
                ))
              )}
            </div>
          </section>

          {/* Team */}
          <section className="panel-card order-2 flex flex-col rounded-2xl p-4 lg:order-1">
            <header className="mb-3">
              <h2 className="text-sm font-semibold text-cream">Your XI</h2>
              <p className="mt-0.5 text-xs text-cream-muted">
                {filled === 0
                  ? "Picks appear here as you draft"
                  : `${filled} players selected`}
              </p>
            </header>

            <div className="space-y-1">
              {filled === 0 ? (
                <div className="rounded-xl border border-dashed border-border px-4 py-8 text-center">
                  <p className="text-sm text-cream-muted">No picks yet</p>
                </div>
              ) : (
                Array.from({ length: 11 }, (_, i) => i + 1)
                  .filter((slot) => lineup[slot])
                  .map((slot) => {
                    const pid = lineup[slot];
                    const player = pid ? playerMap[pid] : null;
                    return (
                      <DraftSlotRow
                        key={slot}
                        slot={slot}
                        player={player}
                        showStats={showStats}
                      />
                    );
                  })
              )}
            </div>

            {draftComplete && (
              <button
                type="button"
                onClick={onSubmit}
                disabled={submitting || filled < 11}
                className="btn-gold mt-4 hidden w-full rounded-xl px-6 py-3.5 text-sm lg:inline-flex lg:justify-center"
              >
                {submitting ? "Scoring…" : "Submit & score"}
              </button>
            )}
          </section>
        </div>
      </div>

      {/* Mobile sticky submit */}
      {draftComplete && (
        <div className="fixed inset-x-0 bottom-0 z-30 border-t border-border bg-bg-deep/95 p-3 backdrop-blur-md lg:hidden">
          <button
            type="button"
            onClick={onSubmit}
            disabled={submitting || filled < 11}
            className="btn-gold w-full rounded-xl px-6 py-3.5 text-sm font-semibold"
          >
            {submitting ? "Scoring…" : "Submit & score"}
          </button>
        </div>
      )}

      <DragOverlay>
        {activePlayer ? (
          <div className="rounded-xl border border-accent/40 bg-bg-card px-4 py-3 shadow-xl">
            <p className="font-medium text-cream">{activePlayer.full_name}</p>
            {activePlayer.country ? (
              <p className="text-xs text-cream-muted">{activePlayer.country}</p>
            ) : null}
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
