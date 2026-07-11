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

export interface AuthUser {
  id: string;
  display_name: string;
  avatar_url: string | null;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  user: AuthUser;
}

export interface ChallengeUser {
  id: string;
  display_name: string;
  avatar_url: string | null;
}

export interface ChallengeSummary {
  id: string;
  seed: number;
  format: string;
  wicket_mode: string;
  mode: GameMode;
  status: string;
  created_at: string;
  expires_at: string;
  your_score?: number | null;
  your_rank?: number | null;
  player_count?: number;
  creator_score?: number | null;
  creator?: ChallengeUser;
}

export interface ChallengeDetail {
  id: string;
  seed: number;
  format: string;
  wicket_mode: string;
  mode: GameMode;
  engine_version: string;
  status: string;
  expires_at: string;
  created_at: string;
  creator: ChallengeUser | null;
  creator_score: number | null;
  submission_count: number;
  viewer_has_submitted?: boolean;
  viewer_is_creator?: boolean;
}

export interface CreateChallengeResponse {
  id: string;
  share_path: string;
  seed: number;
  format: string;
  wicket_mode: string;
  mode: GameMode;
  status: string;
}

export interface ChallengeSlotPlayer {
  player_id: string;
  full_name: string;
  primary_role: string;
  slot_score: number;
}

export interface ChallengeComparison {
  a: {
    user: ChallengeUser;
    team_score: number;
    total_credits: number;
    raw_score: number;
    wk_penalty: number;
    credit_penalty: number;
    credits_over_budget: number;
    credit_budget: number;
    breakdown: SlotBreakdown[];
  };
  b: {
    user: ChallengeUser;
    team_score: number;
    total_credits: number;
    raw_score: number;
    wk_penalty: number;
    credit_penalty: number;
    credits_over_budget: number;
    credit_budget: number;
    breakdown: SlotBreakdown[];
  };
  winner: ChallengeUser | null;
  is_tie: boolean;
  outcome: "win" | "loss" | "tie";
  subject_user_id: string;
  viewer_user_id: string;
  slots: Array<{
    slot: number;
    a?: ChallengeSlotPlayer;
    b?: ChallengeSlotPlayer;
  }>;
  shared_picks: number;
  total_picks: number;
}

export interface ChallengeLeaderboardEntry {
  rank: number;
  user: ChallengeUser;
  team_score: number;
  is_creator: boolean;
  is_you?: boolean;
}

export interface ChallengeLeaderboard {
  challenge_id: string;
  creator: ChallengeUser;
  entries: ChallengeLeaderboardEntry[];
  your_rank: number | null;
  player_count: number;
  expires_at: string;
}

export interface ChallengeMySubmission {
  user: ChallengeUser;
  team_score: number;
  total_credits: number;
  raw_score: number;
  wk_penalty: number;
  credit_penalty: number;
  credits_over_budget: number;
  credit_budget: number;
  breakdown: SlotBreakdown[];
  rank: number | null;
  player_count: number;
  expires_at?: string;
}

export interface SubmitChallengeResponse {
  challenge_id: string;
  your_score: ScoreResponse;
  status: string;
  leaderboard: ChallengeLeaderboard;
}

export interface ChallengeListPage {
  items: ChallengeSummary[];
  total: number;
  page: number;
  page_size: number;
  has_more: boolean;
}

export interface MyChallengesResponse {
  live: ChallengeListPage;
  completed: ChallengeListPage;
}
