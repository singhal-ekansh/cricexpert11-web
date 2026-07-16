"use client";

import Link from "next/link";

interface Props {
  message?: string;
}

export function OnlineMatchmakingScreen({
  message = "Finding online challenges…",
}: Props) {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 px-4 text-center">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-gold border-t-transparent" />
      <p className="text-sm font-medium text-cream">{message}</p>
      <p className="max-w-xs text-xs text-cream-muted">
        Matching you with an open public challenge
      </p>
    </div>
  );
}

export function OnlineMatchmakingFailed() {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 px-4 text-center">
      <p className="text-sm font-medium text-cream">No open challenges right now</p>
      <p className="max-w-xs text-sm text-cream-muted">
        Create a public challenge from your next draft, or try again in a bit.
      </p>
      <Link href="/" className="btn-outline rounded-xl px-8 py-3 text-sm">
        Home
      </Link>
    </div>
  );
}
