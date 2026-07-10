import type {
  BestScoreRecord,
  GameMode,
  GameSettings,
  ScoreResponse,
} from "./types";

const DIFFICULTY_KEY = "cricratings_game_mode";
const SETTINGS_KEY = "cricratings_game_settings";
const BEST_KEY_PREFIX = "cricratings_best_score_";

export const DEFAULT_GAME_SETTINGS: GameSettings = {
  format: "t20i",
  wicketMode: "subcontinent",
};

function bestKey(mode: GameMode, settings: GameSettings): string {
  return `${BEST_KEY_PREFIX}${mode}_${settings.format}_${settings.wicketMode}`;
}

export function getGameMode(): GameMode {
  if (typeof window === "undefined") return "easy";
  try {
    const raw = localStorage.getItem(DIFFICULTY_KEY);
    return raw === "hard" ? "hard" : "easy";
  } catch {
    return "easy";
  }
}

export function setGameMode(mode: GameMode): void {
  localStorage.setItem(DIFFICULTY_KEY, mode);
}

export function getGameSettings(): GameSettings {
  if (typeof window === "undefined") return DEFAULT_GAME_SETTINGS;
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (!raw) return DEFAULT_GAME_SETTINGS;
    const parsed = JSON.parse(raw) as Partial<GameSettings>;
    return {
      format: parsed.format || DEFAULT_GAME_SETTINGS.format,
      wicketMode: parsed.wicketMode || DEFAULT_GAME_SETTINGS.wicketMode,
    };
  } catch {
    return DEFAULT_GAME_SETTINGS;
  }
}

export function setGameSettings(settings: GameSettings): void {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
}

export function getBestScore(
  mode: GameMode = getGameMode(),
  settings: GameSettings = getGameSettings(),
): BestScoreRecord | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(bestKey(mode, settings));
    return raw ? (JSON.parse(raw) as BestScoreRecord) : null;
  } catch {
    return null;
  }
}

export function saveBestScore(record: BestScoreRecord): boolean {
  const current = getBestScore(record.mode, {
    format: record.format,
    wicketMode: record.wicket_mode,
  });
  if (current && current.team_score >= record.team_score) return false;
  localStorage.setItem(
    bestKey(record.mode, {
      format: record.format,
      wicketMode: record.wicket_mode,
    }),
    JSON.stringify(record),
  );
  return true;
}

export function clearBestScore(): void {
  if (typeof window === "undefined") return;
  for (let i = localStorage.length - 1; i >= 0; i--) {
    const key = localStorage.key(i);
    if (key?.startsWith(BEST_KEY_PREFIX)) {
      localStorage.removeItem(key);
    }
  }
}

export function scoreSettingsFromResponse(
  score: ScoreResponse,
): Pick<GameSettings, "format" | "wicketMode"> {
  return {
    format: score.format,
    wicketMode: score.wicket_mode,
  };
}
