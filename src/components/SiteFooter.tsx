import Link from "next/link";
import { BRAND_NAME } from "@/lib/brand";

export function SiteFooter({ className = "" }: { className?: string }) {
  return (
    <footer
      className={`border-t border-border px-4 py-6 text-center text-xs leading-relaxed text-cream-muted ${className}`}
    >
      <p className="font-medium text-cream-muted">{BRAND_NAME}</p>
      <nav className="mt-3 flex flex-wrap items-center justify-center gap-x-4 gap-y-1">
        <Link
          href="/privacy"
          className="text-cream-muted underline-offset-2 hover:text-cream hover:underline"
        >
          Privacy
        </Link>
        <Link
          href="/terms"
          className="text-cream-muted underline-offset-2 hover:text-cream hover:underline"
        >
          Terms
        </Link>
      </nav>
      <p className="mx-auto mt-3 max-w-md text-cream-muted/70">
        Unofficial fan draft game. Not affiliated with the ICC, national boards,
        franchises, or players.
      </p>
    </footer>
  );
}
