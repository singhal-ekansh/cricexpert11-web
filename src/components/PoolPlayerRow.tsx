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
      className="group flex w-full items-center gap-3 rounded-lg border border-gold/25 bg-[#1c1810] px-4 py-3 text-left transition-all hover:border-gold/60 hover:bg-[#241e14]"
    >
      <div className="min-w-0 flex-1">
        <p className="truncate font-semibold text-cream group-hover:text-gold-bright">
          {player.full_name}
        </p>
        <p className="text-[11px] text-cream-muted">
          {player.country} · {player.credits} cr
        </p>
      </div>

      <span
        className={`shrink-0 rounded border px-2 py-0.5 text-[9px] font-bold tracking-wider ${badge.className}`}
      >
        {badge.label}
      </span>

      {showStats && player.ratings && (
        <div className="hidden shrink-0 gap-3 sm:flex">
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
