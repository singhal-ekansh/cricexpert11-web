"use client";

import type { PlayerCard } from "@/lib/types";
import { PlayerCardView } from "./PlayerCard";

interface Props {
  round: number;
  totalRounds: number;
  pool: PlayerCard[];
  squad: PlayerCard[];
  onPick: (player: PlayerCard) => void;
}

export function DraftScreen({ round, totalRounds, pool, squad, onPick }: Props) {
  const progress = ((round - 1) / totalRounds) * 100;

  return (
    <div className="animate-fade-up space-y-6">
      <div className="space-y-3">
        <div className="flex items-end justify-between">
          <div>
            <p className="text-xs font-bold tracking-[0.25em] text-gold uppercase">
              Round {round} of {totalRounds}
            </p>
            <h2 className="font-[family-name:var(--font-display)] text-3xl text-cream md:text-4xl">
              Choose your player
            </h2>
          </div>
          <p className="text-sm text-cream-muted">
            {squad.length}/{totalRounds} picked
          </p>
        </div>
        <div className="h-1 overflow-hidden rounded-full bg-bg-panel">
          <div
            className="h-full bg-gradient-to-r from-gold-dim to-gold-bright transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {squad.length > 0 && (
        <div className="rounded-lg border border-border bg-bg-panel/60 p-3">
          <p className="mb-2 text-[10px] font-bold tracking-widest text-cream-muted uppercase">
            Your squad
          </p>
          <div className="flex flex-wrap gap-2">
            {squad.map((p) => (
              <span
                key={p.player_id}
                className="rounded-full border border-border bg-bg-card px-2.5 py-1 text-xs text-cream"
              >
                {p.name}{" "}
                <span className="text-gold">{p.credits}</span>
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {pool.map((player) => (
          <PlayerCardView
            key={player.player_id}
            player={player}
            onSelect={() => onPick(player)}
          />
        ))}
      </div>
    </div>
  );
}
