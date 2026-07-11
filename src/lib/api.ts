import { getAccessToken } from "./auth";
import type {
  AuthResponse,
  AuthUser,
  ChallengeComparison,
  ChallengeDetail,
  ChallengeLeaderboard,
  ChallengeMySubmission,
  CreateChallengeResponse,
  GameMode,
  GameOptionsResponse,
  GameStartResponse,
  GameSettings,
  MyChallengesResponse,
  ScoreResponse,
  SubmitChallengeResponse,
} from "./types";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://127.0.0.1:8000";

export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

let onUnauthorized: (() => void) | null = null;

export function setUnauthorizedHandler(handler: (() => void) | null): void {
  onUnauthorized = handler;
}

function authHeaders(): Record<string, string> {
  const token = getAccessToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  let res: Response;
  try {
    res = await fetch(`${API_URL}${path}`, {
      ...init,
      headers: {
        "Content-Type": "application/json",
        ...authHeaders(),
        ...init?.headers,
      },
    });
  } catch {
    throw new Error(
      `Cannot reach the API at ${API_URL}. Is cricratings-api running?`,
    );
  }
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    const detail = body.detail;
    const message =
      typeof detail === "string"
        ? detail
        : Array.isArray(detail)
          ? detail.map((d: { msg?: string }) => d.msg).join(", ")
          : `API error ${res.status}`;
    if (res.status === 401) {
      onUnauthorized?.();
    }
    throw new ApiError(message, res.status);
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

export function loginWithGoogle(credential: string): Promise<AuthResponse> {
  return apiFetch<AuthResponse>("/api/v1/auth/google", {
    method: "POST",
    body: JSON.stringify({ credential }),
  });
}

export function fetchMe(): Promise<AuthUser> {
  return apiFetch<AuthUser>("/api/v1/auth/me");
}

export function createChallenge(payload: {
  game_id: string;
  seed: number;
  format: string;
  wicket_mode: string;
  mode: GameMode;
  lineup: Record<string, string>;
}): Promise<CreateChallengeResponse> {
  return apiFetch<CreateChallengeResponse>("/api/v1/challenges", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function getChallenge(challengeId: string): Promise<ChallengeDetail> {
  return apiFetch<ChallengeDetail>(`/api/v1/challenges/${challengeId}`);
}

export function joinChallenge(challengeId: string): Promise<{ status: string }> {
  return apiFetch<{ status: string }>(`/api/v1/challenges/${challengeId}/join`, {
    method: "POST",
  });
}

export function submitChallenge(
  challengeId: string,
  payload: { game_id: string; lineup: Record<string, string> },
): Promise<SubmitChallengeResponse> {
  return apiFetch<SubmitChallengeResponse>(
    `/api/v1/challenges/${challengeId}/submit`,
    {
      method: "POST",
      body: JSON.stringify(payload),
    },
  );
}

export function getChallengeLeaderboard(
  challengeId: string,
): Promise<ChallengeLeaderboard> {
  return apiFetch<ChallengeLeaderboard>(
    `/api/v1/challenges/${challengeId}/leaderboard`,
  );
}

export function getChallengeMySubmission(
  challengeId: string,
): Promise<ChallengeMySubmission> {
  return apiFetch<ChallengeMySubmission>(
    `/api/v1/challenges/${challengeId}/my-submission`,
  );
}

export function getChallengeComparison(
  challengeId: string,
  userId: string,
): Promise<ChallengeComparison> {
  return apiFetch<ChallengeComparison>(
    `/api/v1/challenges/${challengeId}/comparison/${userId}`,
  );
}

export function fetchMyChallenges(params?: {
  live_page?: number;
  completed_page?: number;
  page_size?: number;
}): Promise<MyChallengesResponse> {
  const search = new URLSearchParams();
  if (params?.live_page) search.set("live_page", String(params.live_page));
  if (params?.completed_page) {
    search.set("completed_page", String(params.completed_page));
  }
  if (params?.page_size) search.set("page_size", String(params.page_size));
  const query = search.toString();
  return apiFetch<MyChallengesResponse>(
    `/api/v1/me/challenges${query ? `?${query}` : ""}`,
  );
}

export function siteUrl(path = ""): string {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  return `${base.replace(/\/$/, "")}${path}`;
}
