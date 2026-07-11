import { ROLE_BADGE, ROLE_INLINE_LABEL } from "@/lib/draft";
import { countryCode } from "@/lib/country";

interface Props {
  country: string;
  draftRole: string;
  credits: number;
}

export function PlayerMetaLine({ country, draftRole, credits }: Props) {
  const badge = ROLE_BADGE[draftRole] ?? {
    label: draftRole.toUpperCase(),
    className: "bg-bg-card text-cream-muted border-border",
  };
  const roleLabel = ROLE_INLINE_LABEL[draftRole] ?? badge.label;
  const showCountry = country.trim().length > 0;

  return (
    <p className="mt-0.5 flex min-w-0 items-center gap-1.5 text-[10px] leading-none sm:mt-1 sm:gap-2 sm:text-[11px]">
      <span
        className={`shrink-0 rounded border px-1.5 py-px text-[7px] font-bold tracking-wide sm:text-[8px] ${badge.className}`}
      >
        {roleLabel}
      </span>
      {showCountry && (
        <>
          <span className="shrink-0 font-[family-name:var(--font-mono)] text-[9px] tracking-wide text-cream-muted/80 sm:text-[10px]">
            {countryCode(country)}
          </span>
          <span className="shrink-0 text-cream-muted/50">·</span>
        </>
      )}
      <span className="shrink-0 tabular-nums text-cream-muted">{credits}cr</span>
    </p>
  );
}
