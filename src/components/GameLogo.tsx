import Image from "next/image";
import { BRAND_NAME } from "@/lib/brand";

const HERO = "/cricexpert11-hero.png";
const ICON = "/cricexpert11-icon.png";
const HERO_WIDTH = 799;
const HERO_HEIGHT = 601;

type Variant = "full" | "header" | "mark" | "home" | "modal";

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

  if (variant === "mark") {
    return (
      <Image
        src={ICON}
        alt={BRAND_NAME}
        width={256}
        height={256}
        className={`rounded-xl ${className}`}
        priority={priority}
      />
    );
  }

  if (variant === "modal") {
    return (
      <Image
        src={HERO}
        alt={BRAND_NAME}
        width={HERO_WIDTH}
        height={HERO_HEIGHT}
        className={`h-8 w-auto shrink-0 sm:h-9 ${className}`}
        priority={priority}
      />
    );
  }

  if (variant === "header") {
    return (
      <div className={`flex items-center gap-2.5 sm:gap-3 ${className}`}>
        <Image
          src={HERO}
          alt=""
          width={HERO_WIDTH}
          height={HERO_HEIGHT}
          className="h-9 w-auto shrink-0 sm:h-10"
          priority={priority}
          aria-hidden
        />
        <span
          className="font-[family-name:var(--font-display)] text-lg leading-none sm:text-xl"
          aria-label={BRAND_NAME}
        >
          <span className="text-cream">Cric</span>
          <span className="text-gold-bright">expert</span>
          <span className="text-gold-bright">11</span>
        </span>
      </div>
    );
  }

  return null;
}
