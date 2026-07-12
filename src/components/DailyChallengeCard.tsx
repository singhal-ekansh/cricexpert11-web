"use client";

import { useRouter } from "next/navigation";
import { useEffect, useLayoutEffect, useState } from "react";
import { getDailyPuzzleToday } from "@/lib/api";
import {
  formatCountdown,
  getCachedDailyPuzzleToday,
  msUntil,
  setCachedDailyPuzzleToday,
} from "@/lib/daily";
import type { DailyPuzzleToday } from "@/lib/types";
import { ordinalRank } from "@/lib/rank";

export function DailyChallengeCard() {
  const router = useRouter();
  const [puzzle, setPuzzle] = useState<DailyPuzzleToday | null>(null);
  const [countdown, setCountdown] = useState("");
  const [loading, setLoading] = useState(true);
  const [navigating, setNavigating] = useState(false);

  useLayoutEffect(() => {
    const cached = getCachedDailyPuzzleToday();
    if (cached) {
      setPuzzle(cached);
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let active = true;
    getDailyPuzzleToday()
      .then((data) => {
        if (!active) return;
        setPuzzle(data);
        setCachedDailyPuzzleToday(data);
      })
      .catch(() => {
        if (active && !getCachedDailyPuzzleToday()) setPuzzle(null);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!puzzle?.ends_at) return;
    const tick = () => setCountdown(formatCountdown(msUntil(puzzle.ends_at)));
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, [puzzle?.ends_at]);

  if (loading) {
    return (
      <div className="rounded-xl border border-border/80 bg-bg-card/40 px-4 py-3 text-center text-xs text-cream-muted">
        Loading daily challenge…
      </div>
    );
  }

  if (!puzzle || !puzzle.is_active) {
    return null;
  }

  const viewer = puzzle.viewer;

  return (
    <button
      type="button"
      disabled={navigating}
      onClick={() => {
        setNavigating(true);
        void getDailyPuzzleToday()
          .then((today) => {
            setCachedDailyPuzzleToday(today);
            const played = (today.viewer?.attempt_count ?? 0) >= 1;
            router.push(
              played ? "/play?daily=1&view=leaderboard" : "/play?daily=1",
            );
          })
          .catch(() => {
            router.push("/play?daily=1");
          })
          .finally(() => {
            setNavigating(false);
          });
      }}
      className="w-full rounded-xl border border-gold/30 bg-gold/10 px-4 py-3.5 text-left transition-colors hover:border-gold/50 hover:bg-gold/15"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm font-semibold text-cream">Daily challenge</p>
          <p className="mt-1 text-xs text-cream-muted">
            {puzzle.format_label} · {puzzle.wicket_mode_label} · {puzzle.mode}
          </p>
          <p className="mt-1.5 text-[11px] text-cream-muted/80">
            {puzzle.player_count} played
            {viewer?.rank != null && puzzle.player_count > 0
              ? ` · your rank: ${ordinalRank(viewer.rank)}`
              : ""}
          </p>
        </div>
        <div className="shrink-0 text-right">
          <p className="text-[10px] font-medium uppercase tracking-wide text-gold">
            Ends in
          </p>
          <p className="mt-0.5 font-[family-name:var(--font-mono)] text-sm font-semibold text-gold">
            {countdown}
          </p>
        </div>
      </div>
    </button>
  );
}
