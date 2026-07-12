export interface PenaltyFields {
  wk_penalty?: number;
  credit_penalty?: number;
  overseas_penalty?: number;
  overseas_players_over_limit?: number;
  credits_over_budget?: number;
  credit_budget?: number;
  total_credits?: number;
}

export function normalizePenalties(fields: PenaltyFields) {
  return {
    wk_penalty: fields.wk_penalty ?? 0,
    credit_penalty: fields.credit_penalty ?? 0,
    overseas_penalty: fields.overseas_penalty ?? 0,
    overseas_players_over_limit: fields.overseas_players_over_limit ?? 0,
    credits_over_budget: fields.credits_over_budget ?? 0,
    credit_budget: fields.credit_budget,
    total_credits: fields.total_credits,
  };
}

export function formatPenalty(value: number): string {
  if (value > 0) return `+${value}`;
  return String(value);
}

export interface PenaltyLine {
  label: string;
  value: number;
}

export function penaltyLines(fields: PenaltyFields): PenaltyLine[] {
  const n = normalizePenalties(fields);
  const lines: PenaltyLine[] = [];
  if (n.wk_penalty !== 0) {
    lines.push({ label: "No wicketkeeper", value: n.wk_penalty });
  }
  if (n.credit_penalty !== 0) {
    lines.push({ label: "Over budget", value: n.credit_penalty });
  }
  if (n.overseas_penalty !== 0) {
    lines.push({
      label: "Overseas player limit exceeded",
      value: n.overseas_penalty,
    });
  }
  return lines;
}
