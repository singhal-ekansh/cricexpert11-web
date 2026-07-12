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
  if (variant === "home") {
    return (
      <Image
        src={HERO}
        alt={BRAND_NAME}
        width={HERO_WIDTH}
        height={HERO_HEIGHT}
        className={`h-auto w-full max-w-[10.5rem] sm:max-w-[12.5rem] ${className}`}
        priority={priority}
      />
    );
  }

  if (variant === "full") {
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
        alt=""
        width={256}
        height={256}
        className={`rounded-xl ${className}`}
        priority={priority}
        aria-hidden
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
        className={`h-10 w-auto shrink-0 sm:h-11 ${className}`}
        priority={priority}
      />
    );
  }

  if (variant === "header") {
    return (
      <Image
        src={HERO}
        alt={BRAND_NAME}
        width={HERO_WIDTH}
        height={HERO_HEIGHT}
        className={`h-10 w-auto shrink-0 sm:h-11 ${className}`}
        priority={priority}
      />
    );
  }

  return null;
}
