import type { ChallengeVisibility } from "@/lib/types";

export function ChallengeVisibilityBadge({
  visibility = "private",
}: {
  visibility?: ChallengeVisibility;
}) {
  const isPublic = visibility === "public";
  return (
    <span
      className={`shrink-0 rounded-full border px-2 py-0.5 text-[10px] font-medium ${
        isPublic
          ? "border-emerald-500/25 bg-emerald-500/15 text-emerald-400"
          : "border-border/80 bg-cream-muted/10 text-cream-muted"
      }`}
    >
      {isPublic ? "Public" : "Private"}
    </span>
  );
}
