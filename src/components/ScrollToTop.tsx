"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { scrollToTop } from "@/lib/scroll";

export function ScrollToTop() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    scrollToTop();
  }, [pathname, searchParams]);

  return null;
}
