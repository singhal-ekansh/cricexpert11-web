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
      <div className="animate-fade-up grid gap-4 lg:grid-cols-2 lg:gap-6">
        {/* LEFT — THE DRAFT */}
        <section className="panel-card flex flex-col rounded-2xl border-emerald-900/40 p-4 lg:p-5">
          <header className="mb-4 flex items-start justify-between">
            <div>
              <h2 className="text-sm font-bold tracking-[0.2em] text-emerald-400 uppercase">
                The Draft
              </h2>
              <p className="mt-1 text-xs text-cream-muted">
                Use the grip to reorder
                {formatLabel && wicketLabel && (
                  <span className="ml-2 text-cream-muted/80">
                    · {formatLabel} · {wicketLabel}
                  </span>
                )}
                <span className="ml-2 rounded border border-border px-1.5 py-0.5 text-[10px] font-bold tracking-wider text-gold uppercase">
                  {mode}
                </span>
              </p>
            </div>
            <div className="text-right">
              <span className="font-[family-name:var(--font-mono)] text-2xl font-bold text-gold">
                {filled}
                <span className="text-base text-cream-muted">/11</span>
              </span>
              <p
                className={`mt-0.5 text-xs font-[family-name:var(--font-mono)] ${
                  totalCredits > creditBudget ? "text-crimson" : "text-cream-muted"
                }`}
              >
                {totalCredits}
                <span className="text-cream-muted/70">/{creditBudget} cr</span>
              </p>
            </div>
          </header>

          <div className="space-y-1.5">
            {Array.from({ length: 11 }, (_, i) => i + 1).map((slot) => {
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
            })}
          </div>

          {draftComplete && (
            <button
              type="button"
              onClick={onSubmit}
              disabled={submitting || filled < 11}
              className="btn-gold mt-4 w-full rounded-lg px-6 py-4 text-sm"
            >
              {submitting ? "Scoring…" : "Submit XI & Score"}
            </button>
          )}
        </section>

        {/* RIGHT — THE POOL */}
        <section className="panel-card flex flex-col rounded-2xl border-crimson/20 p-4 lg:p-5">
          <header className="mb-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold tracking-[0.2em] text-crimson uppercase">
                The Pool
              </h2>
              <div className="flex items-center gap-2">
                {canUndo && onUndo && (
                  <button
                    type="button"
                    onClick={onUndo}
                    className="btn-outline rounded-lg px-2.5 py-1 text-[10px] tracking-wide"
                  >
                    Undo pick
                  </button>
                )}
                <span className="stat-pill">
                  Round {draftComplete ? totalRounds : round}/{totalRounds}
                </span>
              </div>
            </div>
            <p className="mt-1 text-xs text-cream-muted">
              {draftComplete
                ? "Draft complete — set your order on the left"
                : `${pool.length} players — pick one`}
            </p>
          </header>

          <div className="space-y-2">
            {draftComplete ? (
              <div className="flex h-full min-h-[200px] flex-col items-center justify-center rounded-lg border border-dashed border-border p-8 text-center">
                <p className="text-sm text-cream-muted">
                  All 11 players drafted
                </p>
                <p className="mt-2 text-xs text-cream-muted/70">
                  Hold the grip and drag into position — batters up top,
                  bowlers at the tail — then submit.
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
      </div>

      <DragOverlay>
        {activePlayer ? (
          <div className="rounded-md border border-gold bg-[#243824] px-4 py-3 shadow-2xl">
            <p className="font-semibold text-cream">{activePlayer.full_name}</p>
            <p className="text-xs text-cream-muted">{activePlayer.country}</p>
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
