import type { PlayerCard } from "./types";

export const IPL_HOME_NATION = "India";
export const IPL_OVERSEAS_LIMIT = 4;

export function isIplOverseasPlayer(
  player: Pick<PlayerCard, "country">,
  formatId?: string,
): boolean {
  return (
    formatId === "ipl" &&
    !!player.country &&
    player.country !== IPL_HOME_NATION
  );
}

export function countOverseasPlayers(
  lineup: Record<number, string>,
  playerMap: Record<string, PlayerCard>,
  formatId?: string,
): number {
  if (formatId !== "ipl") return 0;
  return Object.values(lineup).filter((pid) => {
    const player = playerMap[pid];
    return player && isIplOverseasPlayer(player, formatId);
  }).length;
}
