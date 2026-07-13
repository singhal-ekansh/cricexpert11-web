import type { SlotBreakdown } from "@/lib/types";
import { ROLE_BADGE } from "@/lib/draft";
import type { PenaltyFields } from "./ScorePenaltiesSummary";
import { formatPenalty, penaltyLines } from "./ScorePenaltiesSummary";

function roleKeyFromPrimary(primaryRole: string): string {
  if (primaryRole === "Wicketkeeper-batsman" || primaryRole === "Wicketkeeper") {
    return "wicketkeeper";
  }
  if (primaryRole === "All-rounder") return "all_rounder";
  if (primaryRole === "Bowler") return "bowler";
  return "batsman";
}

function RoleBadge({ primaryRole }: { primaryRole: string }) {
  const badge = ROLE_BADGE[roleKeyFromPrimary(primaryRole)] ?? {
    label: primaryRole.slice(0, 3).toUpperCase(),
    className: "bg-bg-panel text-cream-muted border-border",
  };

  return (
    <span
      className={`inline-flex shrink-0 rounded border px-1.5 py-0.5 text-[10px] font-semibold leading-none ${badge.className}`}
    >
      {badge.label}
    </span>
  );
}

export function ComparisonPenaltyCell({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <div className="flex items-start justify-between gap-3">
      <p className="text-sm text-crimson">{label}</p>
      <p className="shrink-0 font-[family-name:var(--font-mono)] text-sm font-medium tabular-nums text-crimson">
        {formatPenalty(value)}
      </p>
    </div>
  );
}

export function ComparisonPlayerCell({
  fullName,
  primaryRole,
  slotScore,
}: {
  fullName: string;
  primaryRole: string;
  slotScore: number;
}) {
  return (
    <div className="flex items-start justify-between gap-3">
      <div className="min-w-0">
        <p className="break-words text-sm font-medium leading-snug text-cream">
          {fullName}
        </p>
        <div className="mt-1">
          <RoleBadge primaryRole={primaryRole} />
        </div>
      </div>
      <p className="shrink-0 font-[family-name:var(--font-mono)] text-sm font-medium tabular-nums text-cream">
        {slotScore}
      </p>
    </div>
  );
}

interface BreakdownTableProps {
  rows: SlotBreakdown[];
  penalties?: PenaltyFields;
}

export function ResultBreakdownTable({ rows, penalties }: BreakdownTableProps) {
  const penaltiesToShow = penalties ? penaltyLines(penalties) : [];

  return (
    <div className="overflow-hidden rounded-xl border border-border">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border bg-bg-panel text-left text-xs text-cream-muted">
            <th className="w-10 px-3 py-2.5">#</th>
            <th className="px-3 py-2.5">Player</th>
            <th className="hidden w-14 px-2 py-2.5 sm:table-cell">Role</th>
            <th className="w-16 px-3 py-2.5 text-right">Points</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr
              key={row.slot}
              className="border-b border-border/50 bg-bg-card/40"
            >
              <td className="px-3 py-2.5 font-[family-name:var(--font-mono)] text-xs text-cream-muted">
                {row.slot}
              </td>
              <td className="px-3 py-2.5">
                <p className="break-words font-medium leading-snug text-cream">{row.full_name}</p>
                <div className="mt-1 sm:hidden">
                  <RoleBadge primaryRole={row.primary_role} />
                </div>
              </td>
              <td className="hidden px-2 py-2.5 sm:table-cell">
                <RoleBadge primaryRole={row.primary_role} />
              </td>
              <td className="px-3 py-2.5 text-right font-[family-name:var(--font-mono)] text-sm font-medium tabular-nums text-cream">
                {row.slot_score}
              </td>
            </tr>
          ))}
          {penaltiesToShow.map((line, index) => (
            <tr
              key={line.label}
              className="border-b border-border/50 bg-bg-card/40"
            >
              <td className="px-3 py-2.5 font-[family-name:var(--font-mono)] text-xs text-cream-muted">
                {12 + index}
              </td>
              <td className="px-3 py-2.5">
                <p className="text-sm text-crimson">{line.label}</p>
              </td>
              <td className="hidden px-2 py-2.5 sm:table-cell" />
              <td className="px-3 py-2.5 text-right font-[family-name:var(--font-mono)] text-sm font-medium tabular-nums text-crimson">
                {formatPenalty(line.value)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
