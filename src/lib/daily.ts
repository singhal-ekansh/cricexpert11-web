import type { DailyPuzzleToday } from "./types";

const DAILY_CACHE_KEY = "cricratings_daily_today";

let memoryCache: DailyPuzzleToday | null = null;

function isDailyCacheValid(puzzle: DailyPuzzleToday): boolean {
  return puzzle.is_active && msUntil(puzzle.ends_at) > 0;
}

export function getCachedDailyPuzzleToday(): DailyPuzzleToday | null {
  if (memoryCache && isDailyCacheValid(memoryCache)) {
    return memoryCache;
  }

  if (typeof window === "undefined") return null;

  try {
    const raw = sessionStorage.getItem(DAILY_CACHE_KEY);
    if (!raw) return null;
    const cached = JSON.parse(raw) as DailyPuzzleToday;
    if (!isDailyCacheValid(cached)) {
      sessionStorage.removeItem(DAILY_CACHE_KEY);
      memoryCache = null;
      return null;
    }
    memoryCache = cached;
    return cached;
  } catch {
    return null;
  }
}

export function setCachedDailyPuzzleToday(puzzle: DailyPuzzleToday): void {
  memoryCache = puzzle;
  if (typeof window === "undefined") return;
  try {
    sessionStorage.setItem(DAILY_CACHE_KEY, JSON.stringify(puzzle));
  } catch {
    // ignore quota / private mode errors
  }
}

export function formatCountdown(ms: number): string {
  if (ms <= 0) return "Ended";
  const totalSeconds = Math.floor(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  if (minutes > 0) {
    return `${minutes}m ${seconds}s`;
  }
  return `${seconds}s`;
}

export function msUntil(iso: string): number {
  return new Date(iso).getTime() - Date.now();
}
