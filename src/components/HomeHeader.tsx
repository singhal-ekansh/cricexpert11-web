"use client";

import { GameLogo } from "@/components/GameLogo";
import { BRAND_NAME } from "@/lib/brand";

export function HomeHeader() {
  return (
    <header className="sticky top-0 z-20 w-full border-b border-border/50 bg-[#0c0a10]/75 backdrop-blur-md">
      <div className="mx-auto flex max-w-lg items-center gap-2.5 px-4 py-3">
        <GameLogo variant="mark" className="h-8 w-8 shrink-0" />
        <span className="truncate font-[family-name:var(--font-display)] text-base text-cream">
          {BRAND_NAME}
        </span>
      </div>
    </header>
  );
}
