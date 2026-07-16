import Link from "next/link";
import { ChallengeShareButton } from "@/components/ChallengeShareButton";
import { ChallengeVisibilityBadge } from "@/components/ChallengeVisibilityBadge";
import type { ChallengeSummary } from "@/lib/types";
import {
  challengePageUrl,
  isChallengeExpired,
  isChallengeShareable,
} from "@/lib/challenge";
import { formatCountdown, msUntil } from "@/lib/daily";
import { rankWithPlayerCount } from "@/lib/rank";
import { userDisplayName } from "@/lib/user";

type Tab = "live" | "completed";

function formatLabel(value: string): string {
  if (value === "t20i") return "T20I";
  return value.charAt(0).toUpperCase() + value.slice(1).replace(/_/g, " ");
}

function challengeHref(item: ChallengeSummary): string {
  if (item.your_score != null) {
    return `/play?challenge=${item.id}&view=result`;
  }
  if (isChallengeExpired(item.expires_at)) {
    return `/c/${item.id}`;
  }
  return `/play?challenge=${item.id}`;
}

function relativeDate(iso: string): string {
  const date = new Date(iso);
  const diff = Date.now() - date.getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  if (days === 0) return "Today";
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days}d ago`;
  return date.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

function StatusPill({ tab }: { tab: Tab }) {
  const styles: Record<Tab, string> = {
    live: "bg-sky-500/15 text-sky-400 border-sky-500/25",
    completed: "bg-cream-muted/10 text-cream-muted border-border/80",
  };
  const labels: Record<Tab, string> = {
    live: "Active",
    completed: "Expired",
  };
  return (
    <span
      className={`shrink-0 rounded-full border px-2 py-0.5 text-[10px] font-medium ${styles[tab]}`}
    >
      {labels[tab]}
    </span>
  );
}

export function ProfileChallengeCard({
  item,
  tab,
  onDelete,
  deleting = false,
}: {
  item: ChallengeSummary;
  tab: Tab;
  onDelete?: (item: ChallengeSummary) => void;
  deleting?: boolean;
}) {
  const isCreator = !item.creator;
  const title = isCreator
    ? "Your challenge"
    : `by ${userDisplayName(item.creator?.display_name, "Friend")}`;

  const yourScore = item.your_score;
  const targetScore = item.creator_score;
  const rankHint =
    item.your_rank != null && item.player_count && item.player_count >= 2
      ? rankWithPlayerCount(item.your_rank, item.player_count)
      : null;
  const shareable = isChallengeShareable(item.expires_at);
  const shareScore = yourScore ?? item.creator_score;
  const canDelete =
    isCreator &&
    onDelete &&
    (item.participant_count ?? 1) <= 1 &&
    (item.player_count ?? 1) <= 1;
  const expiresIn =
    tab === "live" ? formatCountdown(msUntil(item.expires_at)) : null;

  return (
    <div className="group overflow-hidden rounded-xl border border-border bg-bg-card transition-colors hover:border-border-strong hover:bg-bg-card-hover">
      <Link href={challengeHref(item)} className="block p-4 sm:p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <p className="break-words text-sm font-medium text-cream sm:text-base">
                {title}
              </p>
              <StatusPill tab={tab} />
              <ChallengeVisibilityBadge visibility={item.visibility} />
            </div>
            <p className="mt-1.5 text-xs text-cream-muted sm:text-[13px]">
              {formatLabel(item.format)} · {formatLabel(item.wicket_mode)} ·{" "}
              <span className="capitalize">{item.mode}</span>
            </p>
            <p className="mt-1 text-[11px] text-cream-muted/70">
              {relativeDate(item.created_at)}
              {expiresIn && expiresIn !== "Ended" ? ` · expires in ${expiresIn}` : ""}
            </p>
          </div>

          <div className="shrink-0 text-right">
            {tab === "live" && yourScore == null && targetScore != null && (
              <>
                <p className="text-xs text-cream-muted">Beat</p>
                <p className="font-[family-name:var(--font-mono)] text-xl font-semibold leading-none text-gold sm:text-2xl">
                  {targetScore}
                </p>
              </>
            )}
            {yourScore != null && (
              <>
                <p className="font-[family-name:var(--font-mono)] text-xl font-semibold leading-none text-cream sm:text-2xl">
                  {yourScore}
                </p>
                {rankHint && (
                  <p className="mt-1.5 text-xs font-semibold text-gold">{rankHint}</p>
                )}
                {!rankHint && isCreator && (item.player_count ?? 0) < 2 && tab === "live" && (
                  <p className="mt-1.5 text-xs text-cream-muted">Waiting for players</p>
                )}
              </>
            )}
          </div>
        </div>
      </Link>

      {(shareable || canDelete) && (
        <div className="flex items-center justify-between border-t border-border/50 px-4 py-2.5 sm:px-5">
          {canDelete ? (
            <button
              type="button"
              onClick={() => onDelete(item)}
              disabled={deleting}
              aria-label="Delete challenge"
              className="rounded-lg p-1.5 text-cream-muted transition-colors hover:bg-crimson/10 hover:text-crimson disabled:opacity-50"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.75"
                className="h-4 w-4"
                aria-hidden
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 3h6m-8 4h10m-9 4v8m4-8v8m4-8v8M6 7h12l-.8 14.4a1 1 0 0 1-1 .9H7.8a1 1 0 0 1-1-.9L6 7Z"
                />
              </svg>
            </button>
          ) : (
            <span />
          )}
          {shareable && (
            <ChallengeShareButton
              url={challengePageUrl(item.id)}
              score={shareScore}
              compact
            />
          )}
        </div>
      )}
    </div>
  );
}

export type ProfileTab = Tab;
