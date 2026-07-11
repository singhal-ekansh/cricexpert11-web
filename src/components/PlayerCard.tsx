import type { PlayerCard } from "@/lib/types";

const ROLE_COLORS: Record<string, string> = {
  batsman: "text-amber-300",
  all_rounder: "text-sky-300",
  bowler: "text-rose-300",
  wicketkeeper: "text-emerald-300",
};

const ROLE_LABELS: Record<string, string> = {
  batsman: "BAT",
  all_rounder: "AR",
  bowler: "BWL",
  wicketkeeper: "WK",
};

interface Props {
  player: PlayerCard;
  selected?: boolean;
  onSelect?: () => void;
  compact?: boolean;
  disabled?: boolean;
  showStats?: boolean;
}

export function PlayerCardView({
  player,
  selected,
  onSelect,
  compact,
  disabled,
  showStats = true,
}: Props) {
  const roleClass = ROLE_COLORS[player.draft_role] ?? "text-cream-muted";
  const roleLabel = ROLE_LABELS[player.draft_role] ?? player.draft_role;

  return (
    <button
      type="button"
      onClick={onSelect}
      disabled={disabled || !onSelect}
      className={[
        "card-glow w-full rounded-lg p-3 text-left",
        onSelect && !disabled ? "cursor-pointer" : "cursor-default",
        selected ? "border-gold ring-1 ring-gold/50 animate-pulse-gold" : "",
        disabled ? "opacity-50" : "",
        compact ? "p-2" : "p-4",
      ].join(" ")}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <p className="truncate font-[family-name:var(--font-display)] text-lg leading-tight text-cream">
            {player.full_name}
          </p>
          <p className="mt-0.5 text-xs text-cream-muted">
            {player.country ? `${player.country} · ` : ""}
            {player.name}
          </p>
        </div>
        <div className="flex flex-col items-end gap-1">
          <span className="stat-pill text-gold-bright">{player.credits} cr</span>
          <span className={`text-[10px] font-bold tracking-widest ${roleClass}`}>
            {roleLabel}
          </span>
        </div>
      </div>

      {!compact && showStats && player.ratings && (
        <div className="mt-3 grid grid-cols-4 gap-1.5">
          <Stat label="BAT" value={player.ratings.batting_rating} />
          <Stat label="POW" value={player.ratings.power} />
          <Stat label="BWL" value={player.ratings.bowling_rating} />
          <Stat label="FLD" value={player.ratings.fielding_rating} />
        </div>
      )}
    </button>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded bg-black/30 px-1.5 py-1 text-center">
      <p className="text-[9px] tracking-wider text-cream-muted">{label}</p>
      <p className="font-[family-name:var(--font-mono)] text-sm text-gold-bright">
        {Math.round(value)}
      </p>
    </div>
  );
}
