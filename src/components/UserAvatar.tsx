"use client";

import { useState } from "react";
import { userDisplayName } from "@/lib/user";

interface Props {
  name: string;
  avatarUrl?: string | null;
  className?: string;
  fallbackClassName?: string;
}

export function UserAvatar({
  name,
  avatarUrl,
  className = "h-9 w-9",
  fallbackClassName = "bg-gold/10 text-xs font-semibold text-gold",
}: Props) {
  const [failed, setFailed] = useState(false);
  const displayName = userDisplayName(name, "P");
  const showImage = Boolean(avatarUrl?.trim()) && !failed;

  if (!showImage) {
    return (
      <span
        className={`flex shrink-0 items-center justify-center rounded-full font-[family-name:var(--font-display)] ${className} ${fallbackClassName}`}
        aria-hidden
      >
        {displayName.charAt(0).toUpperCase()}
      </span>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={avatarUrl!}
      alt=""
      referrerPolicy="no-referrer"
      className={`shrink-0 rounded-full object-cover ${className}`}
      onError={() => setFailed(true)}
    />
  );
}
