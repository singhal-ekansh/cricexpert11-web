"use client";

import Link from "next/link";

export default function Error({ reset }: { reset: () => void }) {
  return (
    <main className="relative z-10 flex min-h-screen flex-col items-center justify-center px-4 py-12 text-center">
      <h1 className="font-[family-name:var(--font-display)] text-3xl text-cream">
        Let&apos;s get you back in
      </h1>
      <p className="mt-3 max-w-md text-sm text-cream-muted">
        Pick up where you left off or start a fresh draft.
      </p>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <button type="button" onClick={reset} className="btn-gold rounded-xl px-8 py-3 text-sm">
          Continue
        </button>
        <Link href="/" className="btn-outline rounded-xl px-8 py-3 text-sm">
          Home
        </Link>
      </div>
    </main>
  );
}
