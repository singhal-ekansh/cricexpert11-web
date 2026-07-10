import type { GameMode, GameOptionsResponse, GameStartResponse, ScoreResponse } from "./types";
import type { GameSettings } from "./types";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...init?.headers,
    },
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.detail ?? `API error ${res.status}`);
  }
  return res.json() as Promise<T>;
}

export function getGameOptions(): Promise<GameOptionsResponse> {
  return apiFetch<GameOptionsResponse>("/api/v1/game/options");
}

export function startGame(
  settings: GameSettings,
  mode: GameMode,
  seed?: number,
): Promise<GameStartResponse> {
  const params = new URLSearchParams({
    format: settings.format,
    wicket_mode: settings.wicketMode,
    mode,
  });
  if (seed !== undefined) params.set("seed", String(seed));
  return apiFetch<GameStartResponse>(`/api/v1/game/start?${params}`, {
    method: "POST",
  });
}

export function scoreTeam(
  gameId: string,
  lineup: Record<string, string>,
  settings: GameSettings,
  mode: GameMode,
): Promise<ScoreResponse> {
  return apiFetch<ScoreResponse>("/api/v1/game/score", {
    method: "POST",
    body: JSON.stringify({
      game_id: gameId,
      lineup,
      format: settings.format,
      wicket_mode: settings.wicketMode,
      mode,
    }),
  });
}
