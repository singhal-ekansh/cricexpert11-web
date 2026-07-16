"use client";

function OnlineIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      className="h-4 w-4 text-emerald-400"
      aria-hidden
    >
      <circle cx="12" cy="12" r="9" />
      <path
        strokeLinecap="round"
        d="M3 12h18M12 3a14.5 14.5 0 0 1 0 18M12 3a14.5 14.5 0 0 0 0 18"
      />
    </svg>
  );
}

export function PlayOnlineCard({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center justify-between rounded-xl border border-emerald-500/25 bg-emerald-500/8 px-4 py-3 text-sm transition-colors hover:border-emerald-500/40 hover:bg-emerald-500/12"
    >
      <span className="flex items-center gap-2">
        <OnlineIcon />
        <span className="font-medium text-cream">Play online</span>
      </span>
      <span className="text-emerald-400">→</span>
    </button>
  );
}
