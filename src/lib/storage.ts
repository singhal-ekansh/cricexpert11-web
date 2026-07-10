import type {
  BestScoreRecord,
  GameMode,
  GameSettings,
  GameStartResponse,
  PlayerCard,
  ScoreResponse,
} from "./types";

const DIFFICULTY_KEY = "cricratings_game_mode";
const SETTINGS_KEY = "cricratings_game_settings";
const BEST_KEY_PREFIX = "cricratings_best_score_";
const DRAFT_KEY = "cricratings_active_draft";
const DRAFT_TTL_MS = 4 * 60 * 60 * 1000;

export interface SavedDraftState {
  savedAt: string;
  mode: GameMode;
  settings: GameSettings;
  game: GameStartResponse;
  picks: PlayerCard[];
  lineup: Record<number, string>;
  currentRound: number;
  phase: "draft" | "result";
  score?: ScoreResponse;
  isNewBest?: boolean;
}

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

export function saveDraftState(
  state: Omit<SavedDraftState, "savedAt">,
): void {
  if (typeof window === "undefined") return;
  try {
    const payload: SavedDraftState = { ...state, savedAt: new Date().toISOString() };
    sessionStorage.setItem(DRAFT_KEY, JSON.stringify(payload));
  } catch {
    // sessionStorage full or unavailable — ignore
  }
}

export function loadDraftState(): SavedDraftState | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(DRAFT_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as SavedDraftState;
  } catch {
    return null;
  }
}

export function clearDraftState(): void {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.removeItem(DRAFT_KEY);
  } catch {
    // ignore
  }
}

export function isDraftResumable(saved: SavedDraftState): boolean {
  const mode = getGameMode();
  const settings = getGameSettings();
  if (saved.mode !== mode) return false;
  if (saved.settings.format !== settings.format) return false;
  if (saved.settings.wicketMode !== settings.wicketMode) return false;
  if (!saved.game?.game_id) return false;
  if (saved.phase !== "draft" && saved.phase !== "result") return false;
  const age = Date.now() - new Date(saved.savedAt).getTime();
  if (age > DRAFT_TTL_MS) return false;
  return true;
}
