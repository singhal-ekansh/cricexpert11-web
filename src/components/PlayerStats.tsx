interface StatProps {
  label: string;
  value?: number;
  hidden?: boolean;
  compact?: boolean;
}

export function PlayerStat({ label, value, hidden = false, compact = false }: StatProps) {
  const display = hidden ? "???" : String(Math.round(value ?? 0));

  if (compact) {
    return (
      <span className="font-[family-name:var(--font-mono)] text-[10px] text-gold-bright">
        <span className="text-[9px] text-cream-muted">{label} </span>
        {display}
      </span>
    );
  }

  return (
    <div className="text-center leading-none">
      <p className="text-[7px] tracking-wide text-cream-muted sm:text-[8px]">{label}</p>
      <p
        className={`font-[family-name:var(--font-mono)] text-[10px] sm:text-sm ${
          hidden ? "text-cream-muted/70" : "text-gold-bright"
        }`}
      >
        {display}
      </p>
    </div>
  );
}

export function PoolStatsInline({
  ratings,
  hidden = false,
}: {
  ratings?: NonNullable<import("@/lib/types").PlayerCard["ratings"]>;
  hidden?: boolean;
}) {
  return (
    <span className="inline-flex flex-wrap items-center gap-x-2 gap-y-0.5 sm:hidden">
      <PlayerStat label="BAT" value={ratings?.batting_rating} hidden={hidden} compact />
      <PlayerStat label="POW" value={ratings?.power} hidden={hidden} compact />
      <PlayerStat label="BWL" value={ratings?.bowling_rating} hidden={hidden} compact />
    </span>
  );
}

export function DraftStatsInline({
  ratings,
  hidden = false,
}: {
  ratings?: NonNullable<import("@/lib/types").PlayerCard["ratings"]>;
  hidden?: boolean;
}) {
  return (
    <span className="inline-flex items-center gap-x-2 sm:hidden">
      <PlayerStat label="BAT" value={ratings?.batting_rating} hidden={hidden} compact />
      <PlayerStat label="BWL" value={ratings?.bowling_rating} hidden={hidden} compact />
    </span>
  );
}

export function PoolStatsColumns({
  ratings,
  hidden = false,
}: {
  ratings?: NonNullable<import("@/lib/types").PlayerCard["ratings"]>;
  hidden?: boolean;
}) {
  return (
    <div className="hidden shrink-0 gap-1 sm:flex sm:gap-2">
      <PlayerStat label="BAT" value={ratings?.batting_rating} hidden={hidden} />
      <PlayerStat label="POW" value={ratings?.power} hidden={hidden} />
      <PlayerStat label="BWL" value={ratings?.bowling_rating} hidden={hidden} />
    </div>
  );
}

export function DraftStatsColumns({
  ratings,
  hidden = false,
}: {
  ratings?: NonNullable<import("@/lib/types").PlayerCard["ratings"]>;
  hidden?: boolean;
}) {
  return (
    <div className="hidden shrink-0 gap-1 sm:flex sm:gap-2">
      <PlayerStat label="BAT" value={ratings?.batting_rating} hidden={hidden} />
      <PlayerStat label="BWL" value={ratings?.bowling_rating} hidden={hidden} />
    </div>
  );
}
