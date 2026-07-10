import { ROLE_BADGE, ROLE_INLINE_LABEL } from "@/lib/draft";

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

  return (
    <span className="inline-flex flex-wrap items-center gap-x-1 text-[10px] leading-tight sm:text-[11px]">
      <span className="text-cream-muted">{country}</span>
      <span className="text-cream-muted/50">·</span>
      <span
        className={`rounded border px-1 py-px text-[8px] font-bold tracking-wider sm:px-1.5 sm:text-[9px] ${badge.className}`}
      >
        {roleLabel}
      </span>
      <span className="text-cream-muted/50">·</span>
      <span className="text-cream-muted">{credits} cr</span>
    </span>
  );
}
