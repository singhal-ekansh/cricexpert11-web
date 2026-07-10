export const SLOT_LABELS: Record<number, string> = {
  1: "Opener",
  2: "Opener",
  3: "Top order",
  4: "Top order",
  5: "Middle",
  6: "Middle",
  7: "Finisher",
  8: "Finisher",
  9: "Bowler",
  10: "Bowler",
  11: "Bowler",
};

export const ROLE_BADGE: Record<string, { label: string; className: string }> = {
  batsman: { label: "BATTER", className: "bg-emerald-900/80 text-emerald-300 border-emerald-700" },
  all_rounder: { label: "AR", className: "bg-sky-900/80 text-sky-300 border-sky-700" },
  bowler: { label: "BOWLER", className: "bg-rose-900/80 text-rose-300 border-rose-700" },
  wicketkeeper: { label: "WK", className: "bg-pink-900/80 text-pink-300 border-pink-700" },
};

export const ROLE_INLINE_LABEL: Record<string, string> = {
  batsman: "Batter",
  all_rounder: "AR",
  bowler: "Bowler",
  wicketkeeper: "WK",
};

/** Display order for pool: batters → WK → AR → bowlers */
export const POOL_ROLE_ORDER: Record<string, number> = {
  batsman: 0,
  wicketkeeper: 1,
  all_rounder: 2,
  bowler: 3,
};

export function sortPoolByRole(
  pool: import("./types").PlayerCard[],
): import("./types").PlayerCard[] {
  return [...pool].sort((a, b) => {
    const orderA = POOL_ROLE_ORDER[a.draft_role] ?? 99;
    const orderB = POOL_ROLE_ORDER[b.draft_role] ?? 99;
    if (orderA !== orderB) return orderA - orderB;
    return a.full_name.localeCompare(b.full_name);
  });
}

export function lineupToSlots(
  lineup: Record<number, string>,
  playerMap: Record<string, import("./types").PlayerCard>,
): Array<import("./types").PlayerCard | null> {
  return Array.from({ length: 11 }, (_, i) => {
    const pid = lineup[i + 1];
    return pid ? (playerMap[pid] ?? null) : null;
  });
}

/** Shift players between slots (insert/reorder), never swap. */
export function reorderLineup(
  lineup: Record<number, string>,
  fromSlot: number,
  toSlot: number,
): Record<number, string> {
  if (fromSlot === toSlot) return lineup;
  const playerId = lineup[fromSlot];
  if (!playerId) return lineup;

  const row: (string | null)[] = Array.from(
    { length: 11 },
    (_, i) => lineup[i + 1] ?? null,
  );
  row.splice(fromSlot - 1, 1);
  row.splice(toSlot - 1, 0, playerId);

  const next: Record<number, string> = {};
  row.forEach((id, i) => {
    if (id) next[i + 1] = id;
  });
  return next;
}

export function firstEmptySlot(lineup: Record<number, string>): number | null {
  for (let slot = 1; slot <= 11; slot++) {
    if (!lineup[slot]) return slot;
  }
  return null;
}

export function isLineupComplete(lineup: Record<number, string>): boolean {
  for (let slot = 1; slot <= 11; slot++) {
    if (!lineup[slot]) return false;
  }
  return true;
}
