export interface PenaltyFields {
  wk_penalty?: number;
  credit_penalty?: number;
  overseas_penalty?: number;
  overseas_players_over_limit?: number;
  credits_over_budget?: number;
  credit_budget?: number;
  total_credits?: number;
}

function asScoreDeduction(value: number | undefined): number {
  if (!value) return 0;
  return value > 0 ? -value : value;
}

export function normalizePenalties(fields: PenaltyFields) {
  return {
    wk_penalty: asScoreDeduction(fields.wk_penalty),
    credit_penalty: asScoreDeduction(fields.credit_penalty),
    overseas_penalty: asScoreDeduction(fields.overseas_penalty),
    overseas_players_over_limit: fields.overseas_players_over_limit ?? 0,
    credits_over_budget: fields.credits_over_budget ?? 0,
    credit_budget: fields.credit_budget,
    total_credits: fields.total_credits,
  };
}

export function formatPenalty(value: number): string {
  const deduction = value > 0 ? -value : value;
  return String(deduction);
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
