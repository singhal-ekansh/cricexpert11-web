import Link from "next/link";
import { ChallengeShareButton } from "@/components/ChallengeShareButton";
import type { ChallengeSummary } from "@/lib/types";
import { challengePageUrl, isChallengeShareable } from "@/lib/challenge";
import { userDisplayName } from "@/lib/user";

type Tab = "live" | "completed";

function formatLabel(value: string): string {
  if (value === "t20i") return "T20I";
  return value.charAt(0).toUpperCase() + value.slice(1).replace(/_/g, " ");
}

function challengeHref(item: ChallengeSummary, tab: Tab): string {
  if (tab === "completed" || item.your_score != null) {
    return `/play?challenge=${item.id}&view=result`;
  }
  return `/c/${item.id}`;
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

function rankLabel(rank: number): string {
  if (rank === 1) return "1st";
  if (rank === 2) return "2nd";
  if (rank === 3) return "3rd";
  return `#${rank}`;
}

function StatusPill({ tab }: { tab: Tab }) {
  const styles: Record<Tab, string> = {
    live: "bg-sky-500/15 text-sky-400 border-sky-500/25",
    completed: "bg-accent-muted text-accent border-emerald-500/25",
  };
  const labels: Record<Tab, string> = {
    live: "Your turn",
    completed: "Done",
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
}: {
  item: ChallengeSummary;
  tab: Tab;
}) {
  const isCreator = !item.creator;
  const title = isCreator
    ? "Your challenge"
    : `by ${userDisplayName(item.creator?.display_name, "Friend")}`;

  const yourScore = item.your_score;
  const targetScore = item.creator_score;
  const rankHint =
    tab === "completed" &&
    item.your_rank != null &&
    item.player_count &&
    item.player_count >= 2
      ? `${rankLabel(item.your_rank)} of ${item.player_count}`
      : null;
  const shareable = isChallengeShareable(item.expires_at);
  const shareScore = yourScore ?? item.creator_score;

  return (
    <div className="group overflow-hidden rounded-xl border border-border bg-bg-card transition-colors hover:border-border-strong hover:bg-bg-card-hover">
      <Link href={challengeHref(item, tab)} className="block p-4 sm:p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <p className="truncate text-sm font-medium text-cream sm:text-base">
                {title}
              </p>
              <StatusPill tab={tab} />
            </div>
            <p className="mt-1.5 text-xs text-cream-muted sm:text-[13px]">
              {formatLabel(item.format)} · {formatLabel(item.wicket_mode)} ·{" "}
              <span className="capitalize">{item.mode}</span>
            </p>
            <p className="mt-1 text-[11px] text-cream-muted/70">
              {relativeDate(item.created_at)}
            </p>
          </div>

          <div className="shrink-0 text-right">
            {tab === "live" && targetScore != null && (
              <>
                <p className="text-xs text-cream-muted">Beat</p>
                <p className="font-[family-name:var(--font-mono)] text-xl font-semibold leading-none text-gold sm:text-2xl">
                  {targetScore}
                </p>
              </>
            )}
            {tab === "completed" && yourScore != null && (
              <>
                <p className="font-[family-name:var(--font-mono)] text-xl font-semibold leading-none text-cream sm:text-2xl">
                  {yourScore}
                </p>
                {rankHint && (
                  <p className="mt-1.5 text-xs font-semibold text-gold">{rankHint}</p>
                )}
                {!rankHint && isCreator && (item.player_count ?? 0) < 2 && (
                  <p className="mt-1.5 text-xs text-cream-muted">Waiting for friends</p>
                )}
              </>
            )}
          </div>
        </div>
      </Link>

      {shareable && (
        <div className="flex justify-end border-t border-border/50 px-4 py-2.5 sm:px-5">
          <ChallengeShareButton
            url={challengePageUrl(item.id)}
            score={shareScore}
            compact
          />
        </div>
      )}
    </div>
  );
}

export type ProfileTab = Tab;
