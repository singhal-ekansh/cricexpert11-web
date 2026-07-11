import Image from "next/image";
import { BRAND_NAME } from "@/lib/brand";

const HERO = "/cricexpert11-hero.png";
const ICON = "/cricexpert11-icon.png";
const HERO_WIDTH = 799;
const HERO_HEIGHT = 601;

type Variant = "full" | "header" | "mark" | "home" | "modal";

function BrandWordmark({ className = "" }: { className?: string }) {
  return (
    <span
      className={`font-[family-name:var(--font-display)] leading-none ${className}`}
      aria-label={BRAND_NAME}
    >
      <span className="text-cream">Cric</span>
      <span className="text-gold-bright">Expert</span>
      <span className="text-gold-bright">11</span>
    </span>
  );
}

export function GameLogo({
  variant = "full",
  className = "",
  priority = false,
}: {
  variant?: Variant;
  className?: string;
  priority?: boolean;
}) {
  if (variant === "home" || variant === "full") {
    return (
      <Image
        src={HERO}
        alt={BRAND_NAME}
        width={HERO_WIDTH}
        height={HERO_HEIGHT}
        className={`h-auto w-full max-w-[13rem] sm:max-w-[16rem] ${className}`}
        priority={priority}
      />
    );
  }

  if (variant === "mark" || variant === "modal") {
    return (
      <Image
        src={ICON}
        alt={variant === "modal" ? BRAND_NAME : ""}
        width={256}
        height={256}
        className={`rounded-xl ${variant === "modal" ? "h-9 w-9 shrink-0 sm:h-10 sm:w-10" : ""} ${className}`}
        priority={priority}
        aria-hidden={variant === "mark"}
      />
    );
  }

  if (variant === "header") {
    return (
      <div className={`flex min-w-0 items-center gap-2 sm:gap-2.5 ${className}`}>
        <Image
          src={ICON}
          alt=""
          width={256}
          height={256}
          className="h-8 w-8 shrink-0 rounded-lg sm:h-9 sm:w-9"
          priority={priority}
          aria-hidden
        />
        <BrandWordmark className="truncate text-base sm:text-xl" />
      </div>
    );
  }

  return null;
}
