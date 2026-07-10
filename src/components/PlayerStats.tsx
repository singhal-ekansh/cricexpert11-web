interface StatColumnProps {
  label: string;
  value?: number;
  hidden?: boolean;
}

export function StatColumn({ label, value, hidden = false }: StatColumnProps) {
  const display = hidden ? "??" : String(Math.round(value ?? 0));

  return (
    <div className="w-7 shrink-0 text-center leading-none sm:w-8">
      <p
        className={`font-[family-name:var(--font-mono)] text-xs font-semibold tabular-nums sm:text-sm ${
          hidden ? "text-cream-muted/50" : "text-cream"
        }`}
      >
        {display}
      </p>
      <p className="mt-0.5 text-[7px] tracking-wide text-cream-muted/70 sm:text-[8px]">
        {label}
      </p>
    </div>
  );
}

export function PoolStatsRow({
  ratings,
  hidden = false,
}: {
  ratings?: NonNullable<import("@/lib/types").PlayerCard["ratings"]>;
  hidden?: boolean;
}) {
  return (
    <div className="flex shrink-0 items-center gap-0.5 sm:gap-1">
      <StatColumn label="BAT" value={ratings?.batting_rating} hidden={hidden} />
      <StatColumn label="POW" value={ratings?.power} hidden={hidden} />
      <StatColumn label="BOL" value={ratings?.bowling_rating} hidden={hidden} />
    </div>
  );
}

export function DraftStatsRow({
  ratings,
  hidden = false,
}: {
  ratings?: NonNullable<import("@/lib/types").PlayerCard["ratings"]>;
  hidden?: boolean;
}) {
  return (
    <div className="flex shrink-0 items-center gap-0.5 sm:gap-1">
      <StatColumn label="BAT" value={ratings?.batting_rating} hidden={hidden} />
      <StatColumn label="BOL" value={ratings?.bowling_rating} hidden={hidden} />
    </div>
  );
}
