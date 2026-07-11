import { siteUrl } from "./api";

export function isChallengeShareable(expiresAt: string): boolean {
  return new Date(expiresAt).getTime() > Date.now();
}

export function challengePageUrl(challengeId: string): string {
  return siteUrl(`/c/${challengeId}`);
}

export function challengeShareMessage(score?: number | null): string {
  if (score != null) {
    return `I scored ${score} on CricExpert11 — can you beat my XI?`;
  }
  return "Join this CricExpert11 challenge — same draft pools, climb the leaderboard!";
}
