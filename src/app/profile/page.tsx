"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { useAuth } from "@/components/AuthProvider";
import { GameLogo } from "@/components/GameLogo";
import { GoogleSignInModal } from "@/components/GoogleSignInModal";
import {
  ProfileChallengeCard,
  type ProfileTab,
} from "@/components/ProfileChallengeCard";
import { SiteFooter } from "@/components/SiteFooter";
import { UserAvatar } from "@/components/UserAvatar";
import { fetchMyChallenges } from "@/lib/api";
import type { ChallengeListPage, ChallengeSummary } from "@/lib/types";
import { userDisplayName } from "@/lib/user";

const TABS: { id: ProfileTab; label: string }[] = [
  { id: "live", label: "Live" },
  { id: "completed", label: "Completed" },
];

const PAGE_SIZE = 10;

const EMPTY_PAGE: ChallengeListPage = {
  items: [],
  total: 0,
  page: 1,
  page_size: PAGE_SIZE,
  has_more: false,
};

function EmptyState({ message }: { message: string }) {
  return (
    <div className="rounded-xl border border-dashed border-border/80 bg-bg-card/20 px-5 py-10 text-center sm:py-12">
      <p className="text-sm text-cream-muted">{message}</p>
      <Link
        href="/"
        className="btn-outline mt-5 inline-block rounded-lg px-5 py-2 text-sm"
      >
        Play a draft
      </Link>
    </div>
  );
}

export default function ProfilePage() {
  const router = useRouter();
  const { user, loading: authLoading, logout } = useAuth();
  const [livePage, setLivePage] = useState<ChallengeListPage>(EMPTY_PAGE);
  const [completedPage, setCompletedPage] = useState<ChallengeListPage>(EMPTY_PAGE);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [tab, setTab] = useState<ProfileTab>("live");

  const loadInitial = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const data = await fetchMyChallenges({
        live_page: 1,
        completed_page: 1,
        page_size: PAGE_SIZE,
      });
      setLivePage(data.live);
      setCompletedPage(data.completed);
      if (data.live.items.length === 0) {
        setTab("completed");
      }
    } catch {
      setLivePage(EMPTY_PAGE);
      setCompletedPage(EMPTY_PAGE);
    } finally {
      setLoading(false);
    }
  }, [user]);

  const loadMore = useCallback(async () => {
    if (!user) return;
    setLoadingMore(true);
    try {
      if (tab === "live") {
        const data = await fetchMyChallenges({
          live_page: livePage.page + 1,
          completed_page: 1,
          page_size: PAGE_SIZE,
        });
        setLivePage((prev) => ({
          ...data.live,
          items: [...prev.items, ...data.live.items],
        }));
      } else {
        const data = await fetchMyChallenges({
          live_page: 1,
          completed_page: completedPage.page + 1,
          page_size: PAGE_SIZE,
        });
        setCompletedPage((prev) => ({
          ...data.completed,
          items: [...prev.items, ...data.completed.items],
        }));
      }
    } catch {
      // keep current list on pagination failure
    } finally {
      setLoadingMore(false);
    }
  }, [user, tab, livePage.page, completedPage.page]);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      setShowLogin(true);
      setLoading(false);
      return;
    }
    void loadInitial();
  }, [user, authLoading, loadInitial]);

  const activePage = tab === "live" ? livePage : completedPage;
  const activeItems: ChallengeSummary[] = activePage.items;

  const emptyMessages: Record<ProfileTab, string> = {
    live: "Nothing to play right now. Open a friend's challenge link when they share one.",
    completed: "Your challenges and finished drafts will show up here.",
  };

  return (
    <main className="relative z-10 min-h-screen">
      <header className="app-header sticky top-0 z-20">
        <div className="mx-auto flex max-w-3xl items-center justify-between gap-3 px-4 py-3">
          <Link href="/" className="transition-opacity hover:opacity-80">
            <GameLogo variant="header" />
          </Link>
          <div className="flex items-center gap-3">
            <Link href="/" className="btn-ghost text-xs">
              Home
            </Link>
            {user && (
              <>
                <UserAvatar
                  name={userDisplayName(user.display_name, "Player")}
                  avatarUrl={user.avatar_url}
                  className="h-6 w-6"
                  fallbackClassName="bg-accent-muted text-[10px] font-semibold text-accent"
                />
                <button
                  type="button"
                  onClick={() => {
                    logout();
                    router.push("/");
                  }}
                  className="btn-ghost text-xs"
                >
                  Sign out
                </button>
              </>
            )}
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-3xl px-4 py-6 sm:py-8">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h1 className="text-xl font-semibold text-cream">Challenges</h1>
          </div>
          {user && !loading && (
            <button
              type="button"
              onClick={() => loadInitial()}
              className="btn-ghost text-xs"
            >
              Refresh
            </button>
          )}
        </div>

        <div className="mt-4 flex gap-1 rounded-xl border border-border bg-bg-panel p-1 sm:mt-5">
          {TABS.map(({ id, label }) => {
            const active = tab === id;
            return (
              <button
                key={id}
                type="button"
                onClick={() => setTab(id)}
                className={[
                  "flex flex-1 items-center justify-center rounded-lg px-2 py-2.5 text-sm font-medium transition-colors sm:px-3",
                  active
                    ? "bg-accent-muted text-accent"
                    : "text-cream-muted hover:text-cream",
                ].join(" ")}
              >
                {label}
              </button>
            );
          })}
        </div>

        {loading && (
          <div className="mt-6 space-y-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-24 animate-pulse rounded-xl border border-border/50 bg-bg-card/30"
              />
            ))}
          </div>
        )}

        {!loading && (
          <div className="mt-4 sm:mt-5">
            {activeItems.length === 0 ? (
              <EmptyState message={emptyMessages[tab]} />
            ) : (
              <>
                <ul className="space-y-3">
                  {activeItems.map((item) => (
                    <li key={item.id}>
                      <ProfileChallengeCard item={item} tab={tab} />
                    </li>
                  ))}
                </ul>
                {activePage.has_more && (
                  <div className="mt-5 text-center">
                    <button
                      type="button"
                      onClick={() => loadMore()}
                      disabled={loadingMore}
                      className="btn-outline rounded-lg px-6 py-2.5 text-sm disabled:opacity-50"
                    >
                      {loadingMore ? "Loading…" : "Load more"}
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>

      <GoogleSignInModal
        open={showLogin && !user}
        onClose={() => router.push("/")}
        onSuccess={() => {
          setShowLogin(false);
          void loadInitial();
        }}
      />

      <SiteFooter className="mt-10" />
    </main>
  );
}
