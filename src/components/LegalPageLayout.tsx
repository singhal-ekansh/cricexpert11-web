import Link from "next/link";
import { GameLogo } from "@/components/GameLogo";
import { SiteFooter } from "@/components/SiteFooter";

export function LegalPageLayout({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <main className="relative z-10 min-h-screen">
      <header className="border-b border-border/80 bg-[#0c0a10]/85 px-4 py-3 backdrop-blur-md">
        <div className="mx-auto flex max-w-2xl items-center justify-between">
          <Link href="/" className="transition-opacity hover:opacity-90">
            <GameLogo variant="header" />
          </Link>
          <Link
            href="/"
            className="text-xs text-cream-muted transition-colors hover:text-cream"
          >
            Home
          </Link>
        </div>
      </header>

      <article className="mx-auto max-w-2xl px-4 py-10 sm:py-12">
        <h1 className="font-[family-name:var(--font-display)] text-3xl text-cream sm:text-4xl">
          {title}
        </h1>
        <div className="prose-legal mt-8 space-y-6 text-sm leading-relaxed text-cream-muted sm:text-base">
          {children}
        </div>
      </article>

      <SiteFooter className="mt-8" />
    </main>
  );
}
