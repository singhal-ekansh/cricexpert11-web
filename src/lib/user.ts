/** Never show raw email in the UI — use name or a short handle. */
export function userDisplayName(
  name: string | undefined | null,
  fallback = "Friend",
): string {
  if (!name?.trim()) return fallback;
  const trimmed = name.trim();
  if (trimmed.includes("@")) return trimmed.split("@")[0];
  return trimmed;
}
