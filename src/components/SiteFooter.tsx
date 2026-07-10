import { BRAND_NAME } from "@/lib/brand";

export function SiteFooter({ className = "" }: { className?: string }) {
  return (
    <footer
      className={`border-t border-border/50 px-4 py-6 text-center text-[11px] leading-relaxed text-cream-muted/75 ${className}`}
    >
      <p className="font-semibold tracking-[0.12em] text-cream-muted uppercase">
        {BRAND_NAME}
      </p>
      <p className="mx-auto mt-2 max-w-md">
        Unofficial fan draft game. Not affiliated with the ICC, national boards,
        franchises, or players.
      </p>
      <p className="mx-auto mt-2 max-w-lg">
        Match data from{" "}
        <a
          href="https://cricsheet.org/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-gold/80 underline-offset-2 hover:text-gold hover:underline"
        >
          Cricsheet
        </a>
        . Player metadata may include ESPNcricinfo sources. For entertainment
        only.
      </p>
    </footer>
  );
}
