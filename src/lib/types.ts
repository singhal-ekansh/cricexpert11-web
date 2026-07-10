export interface PlayerRatings {
  batting_rating: number;
  power: number;
  technique_vs_pace: number;
  technique_vs_spin: number;
  running_bw_wickets: number;
  pressure_rating: number;
  bowling_rating: number;
  pace_bowling_rating?: number;
  spin_bowling_rating?: number;
  fielding_rating: number;
}

export interface GameOption {
  id: string;
  label: string;
  description: string;
  credit_budget?: number;
}

export interface GameOptionsResponse {
  formats: GameOption[];
  wicket_modes: GameOption[];
  defaults: {
    format: string;
    wicket_mode: string;
    credit_budget: number;
  };
  engine?: {
    rating_engine_version: string;
    player_pool_size: number;
    min_t20i_matches?: number;
    data_scope_label?: string;
    countries?: string[];
  };
}

export interface GameSettings {
  format: string;
  wicketMode: string;
}

export interface PlayerCard {
  player_id: string;
  name: string;
  full_name: string;
  country: string;
  primary_role: string;
  draft_role: string;
  batting_hand: string;
  bowling_style: string;
  credits: number;
  ratings?: PlayerRatings;
}

export interface GameStartResponse {
  game_id: string;
  seed: number;
  mode: GameMode;
  format: string;
  format_label: string;
  wicket_mode: string;
  wicket_mode_label: string;
  credit_budget: number;
  rounds: number;
  pools: PlayerCard[][];
}

export interface SlotBreakdown {
  slot: number;
  player_id: string;
  name: string;
  full_name: string;
  country: string;
  primary_role: string;
  credits: number;
  slot_score: number;
  ratings?: PlayerRatings;
}

export interface ScoreResponse {
  team_score: number;
  raw_score: number;
  total_credits: number;
  credits_over_budget: number;
  wk_penalty: number;
  credit_penalty: number;
  format: string;
  format_label: string;
  wicket_mode: string;
  wicket_mode_label: string;
  credit_budget: number;
  breakdown: SlotBreakdown[];
}

export type GameMode = "easy" | "hard";

export interface BestScoreRecord {
  team_score: number;
  raw_score: number;
  total_credits: number;
  achieved_at: string;
  mode: GameMode;
  format: string;
  wicket_mode: string;
  lineup: SlotBreakdown[];
}

export type GamePhase = "draft" | "lineup" | "result";

export interface GameSession {
  seed: number;
  pools: PlayerCard[][];
  picks: PlayerCard[];
  currentRound: number;
  lineup: Record<number, string>;
  phase: GamePhase;
  score?: ScoreResponse;
}
