import type { PlayerCard } from "@/lib/types";
import { PoolStatsRow } from "./PlayerStats";
import { PlayerMetaLine } from "./PlayerMetaLine";

interface Props {
  player: PlayerCard;
  onPick: () => void;
  showStats?: boolean;
}

export function PoolPlayerRow({ player, onPick, showStats = true }: Props) {
  const ratings = player.ratings;
  const statsHidden = !showStats || !ratings;

  return (
    <button
      type="button"
      onClick={onPick}
      className="group flex w-full items-center gap-2 rounded-md border border-gold/25 bg-[#1c1810] px-2.5 py-2 text-left transition-all hover:border-gold/60 hover:bg-[#241e14] sm:rounded-lg sm:px-3 sm:py-2.5"
    >
      <div className="min-w-0 flex-1">
        <p className="truncate text-[13px] font-semibold leading-tight text-cream group-hover:text-gold-bright sm:text-sm">
          {player.full_name}
        </p>
        <PlayerMetaLine
          country={player.country}
          draftRole={player.draft_role}
          credits={player.credits}
        />
      </div>
      <PoolStatsRow ratings={ratings} hidden={statsHidden} />
    </button>
  );
}
