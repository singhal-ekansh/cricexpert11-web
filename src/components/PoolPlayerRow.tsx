import type { PlayerCard } from "@/lib/types";
import { PoolStatsRow } from "./PlayerStats";
import { PlayerMetaLine } from "./PlayerMetaLine";
import { PlayerDisplayName } from "./PlayerDisplayName";

interface Props {
  player: PlayerCard;
  onPick: () => void;
  showStats?: boolean;
  formatId?: string;
}

export function PoolPlayerRow({ player, onPick, showStats = true, formatId }: Props) {
  const ratings = player.ratings;
  const statsHidden = !showStats || !ratings;

  return (
    <button
      type="button"
      onClick={onPick}
      className="player-row group flex w-full items-start gap-3 px-3 py-3 text-left sm:py-2.5"
    >
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium leading-snug text-cream">
          <PlayerDisplayName player={player} formatId={formatId} />
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
