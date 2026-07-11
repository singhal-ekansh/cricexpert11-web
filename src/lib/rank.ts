export function ordinalRank(rank: number): string {
  if (rank === 1) return "1st";
  if (rank === 2) return "2nd";
  if (rank === 3) return "3rd";
  return `#${rank}`;
}

export function rankWithPlayerCount(rank: number, playerCount: number): string {
  const players = playerCount === 1 ? "player" : "players";
  return `${ordinalRank(rank)} (${playerCount} ${players})`;
}
