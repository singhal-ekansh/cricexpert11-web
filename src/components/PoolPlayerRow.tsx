import type { PlayerCard } from "@/lib/types";
import { ROLE_BADGE } from "@/lib/draft";

interface Props {
  player: PlayerCard;
  onPick: () => void;
  showStats?: boolean;
}

export function PoolPlayerRow({ player, onPick, showStats = true }: Props) {
  const badge = ROLE_BADGE[player.draft_role] ?? {
    label: player.draft_role.toUpperCase(),
    className: "bg-bg-card text-cream-muted border-border",
  };

  return (
    <button
      type="button"
      onClick={onPick}
      className="group flex w-full items-center gap-2 rounded-md border border-gold/25 bg-[#1c1810] px-2.5 py-2 text-left transition-all hover:border-gold/60 hover:bg-[#241e14] sm:gap-3 sm:rounded-lg sm:px-3 sm:py-2.5"
    >
      <div className="min-w-0 flex-1">
        <p className="truncate text-[13px] font-semibold leading-tight text-cream group-hover:text-gold-bright sm:text-sm">
          {player.full_name}
        </p>
        <p className="text-[10px] leading-tight text-cream-muted sm:text-[11px]">
          {player.country} · {player.credits} cr
        </p>
      </div>

      <span
        className={`shrink-0 rounded border px-1.5 py-px text-[8px] font-bold tracking-wider sm:px-2 sm:py-0.5 sm:text-[9px] ${badge.className}`}
      >
        {badge.label}
      </span>

      {showStats && player.ratings && (
        <div className="hidden shrink-0 gap-2 sm:flex">
          <Stat label="BAT" value={player.ratings.batting_rating} />
          <Stat label="POW" value={player.ratings.power} />
          <Stat label="BWL" value={player.ratings.bowling_rating} />
        </div>
      )}
    </button>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="text-center">
      <p className="text-[8px] tracking-wider text-cream-muted">{label}</p>
      <p className="font-[family-name:var(--font-mono)] text-sm text-gold-bright">
        {Math.round(value)}
      </p>
    </div>
  );
}
