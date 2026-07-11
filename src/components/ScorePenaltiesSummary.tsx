interface PenaltyFields {
  wk_penalty: number;
  credit_penalty: number;
  credits_over_budget?: number;
  credit_budget?: number;
  total_credits?: number;
}

function formatPenalty(value: number): string {
  if (value > 0) return `+${value}`;
  return String(value);
}

export function ScorePenaltiesSummary({
  wk_penalty,
  credit_penalty,
  credits_over_budget = 0,
  credit_budget,
  total_credits,
  compact = false,
}: PenaltyFields & { compact?: boolean }) {
  const hasPenalties = wk_penalty !== 0 || credit_penalty !== 0;
  if (!hasPenalties && compact) return null;

  const overBudget =
    credits_over_budget > 0 ||
    (credit_budget != null &&
      total_credits != null &&
      total_credits > credit_budget);

  return (
    <div
      className={[
        "text-left text-xs text-cream-muted",
        compact ? "mt-1.5 space-y-0.5" : "mt-3 space-y-1 rounded-xl border border-border bg-bg-panel px-3 py-2.5 sm:text-sm",
      ].join(" ")}
    >
      {!compact && <p className="font-medium text-cream">Penalties</p>}

      {credit_budget != null && total_credits != null && (
        <p>
          Credits: {total_credits}
          {overBudget && credit_budget != null && (
            <span className="text-crimson">
              {" "}
              ({credits_over_budget || total_credits - credit_budget} over{" "}
              {credit_budget})
            </span>
          )}
        </p>
      )}

      {wk_penalty !== 0 && (
        <p className="text-crimson">
          No wicketkeeper: {formatPenalty(wk_penalty)}
        </p>
      )}

      {credit_penalty !== 0 && (
        <p className="text-crimson">
          Over budget: {formatPenalty(credit_penalty)}
        </p>
      )}

      {!hasPenalties && !compact && (
        <p className="text-cream-muted/70">None</p>
      )}
    </div>
  );
}
