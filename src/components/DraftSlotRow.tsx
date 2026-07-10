"use client";

import { useDraggable, useDroppable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import type { PlayerCard } from "@/lib/types";
import { ROLE_BADGE, SLOT_LABELS } from "@/lib/draft";
import { DragHandleIcon } from "./DragHandleIcon";

interface DraftSlotRowProps {
  slot: number;
  player: PlayerCard | null;
  showStats?: boolean;
}

export function DraftSlotRow({ slot, player, showStats = true }: DraftSlotRowProps) {
  const { setNodeRef, isOver } = useDroppable({ id: `slot-${slot}` });

  return (
    <div
      ref={setNodeRef}
      className={[
        "rounded-md border transition-colors",
        isOver ? "border-gold ring-1 ring-gold/40" : "border-transparent",
        slot % 2 === 0 ? "bg-[#1a2e1a]/50" : "bg-transparent",
      ].join(" ")}
    >
      {player ? (
        <DraggablePlayer slot={slot} player={player} showStats={showStats} />
      ) : (
        <div className="flex items-center gap-3 border border-[#2d4a2d]/60 bg-[#1a2e1a] px-3 py-2.5">
          <span className="w-5 shrink-0 text-center font-[family-name:var(--font-mono)] text-sm text-cream-muted">
            {slot}
          </span>
          <p className="text-sm text-cream-muted/50">Empty slot</p>
        </div>
      )}
    </div>
  );
}

function DraggablePlayer({
  slot,
  player,
  showStats,
}: {
  slot: number;
  player: PlayerCard;
  showStats: boolean;
}) {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: `player-${player.player_id}`,
      data: { slot, playerId: player.player_id },
    });

  const style = {
    transform: CSS.Translate.toString(transform),
    opacity: isDragging ? 0.5 : 1,
  };

  const badge = ROLE_BADGE[player.draft_role];

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center gap-1.5 border border-gold/30 bg-[#243824] px-1.5 py-1.5 hover:border-gold/50 sm:gap-2 sm:px-2 sm:py-2"
    >
      <button
        type="button"
        aria-label={`Reorder ${player.full_name}`}
        className="touch-none shrink-0 cursor-grab rounded px-0.5 py-1 text-cream-muted active:cursor-grabbing active:text-gold sm:px-1 sm:py-1.5"
        {...attributes}
        {...listeners}
      >
        <DragHandleIcon />
      </button>
      <span className="w-4 shrink-0 text-center font-[family-name:var(--font-mono)] text-xs text-cream-muted sm:w-5 sm:text-sm">
        {slot}
      </span>
      <div className="min-w-0 flex-1">
        <p className="truncate text-[13px] font-semibold leading-tight text-cream sm:text-sm">
          {player.full_name}
        </p>
        <p className="text-[10px] leading-tight text-cream-muted sm:text-[11px]">
          {SLOT_LABELS[slot]} · {player.credits} cr
        </p>
      </div>
      {badge && (
        <span
          className={`shrink-0 rounded border px-1.5 py-px text-[8px] font-bold tracking-wider sm:px-2 sm:py-0.5 sm:text-[9px] ${badge.className}`}
        >
          {badge.label}
        </span>
      )}
      {showStats && player.ratings && (
        <div className="hidden shrink-0 gap-2 sm:flex">
          <MiniStat label="BAT" v={player.ratings.batting_rating} />
          <MiniStat label="BWL" v={player.ratings.bowling_rating} />
        </div>
      )}
    </div>
  );
}

function MiniStat({ label, v }: { label: string; v: number }) {
  return (
    <div className="text-center">
      <p className="text-[8px] text-cream-muted">{label}</p>
      <p className="font-[family-name:var(--font-mono)] text-xs text-gold">{Math.round(v)}</p>
    </div>
  );
}
