"use client";

import type { PlayerCard } from "@/lib/types";
import { PlayerCardView } from "./PlayerCard";

const SLOT_LABELS: Record<number, string> = {
  1: "Opener",
  2: "Opener",
  3: "Top order",
  4: "Top order",
  5: "Middle",
  6: "Middle",
  7: "Finisher",
  8: "Finisher",
  9: "Bowler",
  10: "Bowler",
  11: "Bowler",
};

interface Props {
  squad: PlayerCard[];
  lineup: Record<number, string>;
  selectedPlayerId: string | null;
  onSelectPlayer: (id: string | null) => void;
  onAssignSlot: (slot: number) => void;
  onSelectFromSlot: (slot: number) => void;
  onSubmit: () => void;
  submitting: boolean;
}

export function LineupScreen({
  squad,
  lineup,
  selectedPlayerId,
  onSelectPlayer,
  onAssignSlot,
  onSelectFromSlot,
  onSubmit,
  submitting,
}: Props) {
  const playerMap = Object.fromEntries(squad.map((p) => [p.player_id, p]));
  const assignedIds = new Set(Object.values(lineup));
  const unassigned = squad.filter((p) => !assignedIds.has(p.player_id));
  const allFilled = Object.keys(lineup).length === 11;

  return (
    <div className="animate-fade-up space-y-6">
      <div>
        <p className="text-xs font-bold tracking-[0.25em] text-gold uppercase">
          Final step
        </p>
        <h2 className="font-[family-name:var(--font-display)] text-3xl text-cream md:text-4xl">
          Set your batting order
        </h2>
        <p className="mt-2 text-sm text-cream-muted">
          Tap a player, then tap a slot. Slots 1–8 favour batting; 9–11 favour
          bowling. Wicketkeepers score best at 5–7.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <div className="space-y-2">
          {Array.from({ length: 11 }, (_, i) => i + 1).map((slot) => {
            const pid = lineup[slot];
            const player = pid ? playerMap[pid] : null;
            const isTarget = selectedPlayerId && !pid;
            const isSelected = pid && selectedPlayerId === pid;

            return (
              <button
                key={slot}
                type="button"
                onClick={() => {
                  if (selectedPlayerId) onAssignSlot(slot);
                  else if (pid) onSelectFromSlot(slot);
                }}
                className={[
                  "flex w-full items-start gap-3 rounded-lg border p-3 text-left transition-all",
                  player ? "border-border bg-bg-card" : "border-dashed border-border bg-bg-panel/40",
                  isTarget ? "border-gold ring-1 ring-gold/40" : "",
                  isSelected ? "border-gold ring-1 ring-gold/50" : "",
                  selectedPlayerId || player ? "cursor-pointer hover:border-gold/60" : "",
                ].join(" ")}
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-border bg-bg-deep font-[family-name:var(--font-mono)] text-lg text-gold">
                  {slot}
                </div>
                <div className="min-w-0 flex-1">
                  {player ? (
                    <>
                      <p className="break-words font-medium leading-snug text-cream">
                        {player.full_name}
                      </p>
                      <p className="text-xs text-cream-muted">
                        {SLOT_LABELS[slot]} · {player.primary_role} · {player.credits} cr
                      </p>
                    </>
                  ) : (
                    <>
                      <p className="text-cream-muted">{SLOT_LABELS[slot]}</p>
                      <p className="text-xs text-cream-muted/60">Empty slot</p>
                    </>
                  )}
                </div>
                {player?.ratings && (
                  <div className="hidden gap-2 sm:flex">
                    <MiniStat label="BAT" v={player.ratings.batting_rating} />
                    <MiniStat label="BWL" v={player.ratings.bowling_rating} />
                  </div>
                )}
              </button>
            );
          })}
        </div>

        <div className="space-y-4">
          <div className="rounded-lg border border-border bg-bg-panel/60 p-4">
            <p className="mb-3 text-[10px] font-bold tracking-widest text-cream-muted uppercase">
              Squad — tap to select
            </p>
            <div className="space-y-2">
              {unassigned.map((player) => (
                <PlayerCardView
                  key={player.player_id}
                  player={player}
                  compact
                  selected={selectedPlayerId === player.player_id}
                  onSelect={() =>
                    onSelectPlayer(
                      selectedPlayerId === player.player_id ? null : player.player_id,
                    )
                  }
                />
              ))}
              {unassigned.length === 0 && (
                <p className="text-sm text-emerald-400">All players placed ✓</p>
              )}
            </div>
          </div>

          <button
            type="button"
            onClick={onSubmit}
            disabled={!allFilled || submitting}
            className="btn-gold w-full rounded-lg px-6 py-4 text-sm"
          >
            {submitting ? "Scoring…" : "Submit XI & Score"}
          </button>
        </div>
      </div>
    </div>
  );
}

function MiniStat({ label, v }: { label: string; v: number }) {
  return (
    <div className="text-center">
      <p className="text-[9px] text-cream-muted">{label}</p>
      <p className="font-[family-name:var(--font-mono)] text-sm text-gold">{Math.round(v)}</p>
    </div>
  );
}
