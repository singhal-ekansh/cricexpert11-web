import type { PlayerCard } from "@/lib/types";
import { isIplOverseasPlayer } from "@/lib/ipl";
import { OverseasPlaneIcon } from "./OverseasPlaneIcon";

interface Props {
  player: Pick<PlayerCard, "full_name" | "country">;
  formatId?: string;
  className?: string;
}

export function PlayerDisplayName({ player, formatId, className = "" }: Props) {
  const overseas = isIplOverseasPlayer(player, formatId);

  return (
    <span
      className={`inline-flex max-w-full flex-wrap items-center gap-x-1.5 gap-y-0.5 ${className}`}
      title={overseas ? "Overseas player" : undefined}
    >
      <span className="break-words">{player.full_name}</span>
      {overseas && (
        <span className="shrink-0" role="img" aria-label="Overseas player">
          <OverseasPlaneIcon size={13} className="text-sky-300/85" />
        </span>
      )}
    </span>
  );
}
