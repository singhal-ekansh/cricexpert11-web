"use client";

import { useDraggable, useDroppable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import type { PlayerCard } from "@/lib/types";
import { PoolStatsRow } from "./PlayerStats";
import { DragHandleIcon } from "./DragHandleIcon";
import { PlayerMetaLine } from "./PlayerMetaLine";

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
        "rounded-lg transition-colors",
        isOver ? "ring-1 ring-accent/50" : "",
      ].join(" ")}
    >
      {player ? (
        <DraggablePlayer slot={slot} player={player} showStats={showStats} />
      ) : (
        <div className="draft-slot-empty flex items-center gap-3 rounded-lg px-3 py-2.5">
          <span className="w-5 shrink-0 text-center font-[family-name:var(--font-mono)] text-xs text-cream-muted">
            {slot}
          </span>
          <p className="text-sm text-cream-muted/50">Empty</p>
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

  const ratings = player.ratings;
  const statsHidden = !showStats || !ratings;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="draft-slot-filled flex items-center gap-2 rounded-lg px-2 py-2 sm:gap-2.5 sm:px-2.5"
    >
      <button
        type="button"
        aria-label={`Reorder ${player.full_name}`}
        className="touch-none shrink-0 cursor-grab rounded p-1 text-cream-muted active:cursor-grabbing active:text-accent"
        {...attributes}
        {...listeners}
      >
        <DragHandleIcon />
      </button>
      <span className="w-4 shrink-0 text-center font-[family-name:var(--font-mono)] text-xs text-cream-muted">
        {slot}
      </span>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium leading-tight text-cream">
          {player.full_name}
        </p>
        <PlayerMetaLine
          country={player.country}
          draftRole={player.draft_role}
          credits={player.credits}
        />
      </div>
      <PoolStatsRow ratings={ratings} hidden={statsHidden} />
    </div>
  );
}
