"use client";

import { useCallback, useEffect, useState } from "react";
import { BRAND_NAME } from "@/lib/brand";

const DISMISS_KEY = "cricratings_a2hs_dismissed";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

function isStandalone(): boolean {
  if (typeof window === "undefined") return false;
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    ("standalone" in window.navigator &&
      Boolean((window.navigator as Navigator & { standalone?: boolean }).standalone))
  );
}

function isIOS(): boolean {
  if (typeof navigator === "undefined") return false;
  return (
    /iPad|iPhone|iPod/.test(navigator.userAgent) ||
    (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1)
  );
}

function isAndroid(): boolean {
  return typeof navigator !== "undefined" && /Android/i.test(navigator.userAgent);
}

type InstallGuide = "ios" | "android" | "desktop";

function detectGuide(): InstallGuide {
  if (isIOS()) return "ios";
  if (isAndroid()) return "android";
  return "desktop";
}

export function AddToHomeScreen() {
  const [visible, setVisible] = useState(false);
  const [guide, setGuide] = useState<InstallGuide | null>(null);
  const [installPrompt, setInstallPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);

  useEffect(() => {
    if (isStandalone()) return;
    try {
      if (localStorage.getItem(DISMISS_KEY) === "1") return;
    } catch {
      // ignore
    }
    setVisible(true);

    const onInstallable = (event: Event) => {
      event.preventDefault();
      setInstallPrompt(event as BeforeInstallPromptEvent);
    };

    window.addEventListener("beforeinstallprompt", onInstallable);
    return () => window.removeEventListener("beforeinstallprompt", onInstallable);
  }, []);

  const dismiss = useCallback(() => {
    try {
      localStorage.setItem(DISMISS_KEY, "1");
    } catch {
      // ignore
    }
    setVisible(false);
    setGuide(null);
  }, []);

  const handleInstall = useCallback(async () => {
    if (installPrompt) {
      await installPrompt.prompt();
      const { outcome } = await installPrompt.userChoice;
      setInstallPrompt(null);
      if (outcome === "accepted") {
        setVisible(false);
      }
      return;
    }
    setGuide(detectGuide());
  }, [installPrompt]);

  if (!visible) return null;

  return (
    <>
      <button
        type="button"
        onClick={handleInstall}
        className="btn-ghost w-full py-2 text-sm"
      >
        Add to home screen
      </button>

      {guide && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center p-4 sm:items-center"
          role="dialog"
          aria-modal="true"
          aria-labelledby="install-guide-title"
        >
          <button
            type="button"
            className="modal-overlay absolute inset-0"
            onClick={() => setGuide(null)}
            aria-label="Close"
          />
          <div className="hero-card relative w-full max-w-sm rounded-2xl px-5 py-6 sm:px-6">
            <h2
              id="install-guide-title"
              className="font-[family-name:var(--font-display)] text-xl text-cream"
            >
              Add {BRAND_NAME}
            </h2>
            <p className="mt-2 text-sm text-cream-muted">
              Open from your home screen like an app — no app store needed.
            </p>

            {guide === "ios" && (
              <ol className="mt-4 list-decimal space-y-2 pl-5 text-sm text-cream-muted">
                <li>
                  Tap <span className="text-cream">Share</span>{" "}
                  <span aria-hidden>⎋</span> in Safari&apos;s toolbar
                </li>
                <li>
                  Scroll and tap{" "}
                  <span className="text-cream">Add to Home Screen</span>
                </li>
                <li>Tap <span className="text-cream">Add</span></li>
              </ol>
            )}

            {guide === "android" && (
              <ol className="mt-4 list-decimal space-y-2 pl-5 text-sm text-cream-muted">
                <li>
                  Tap the browser <span className="text-cream">menu</span>{" "}
                  <span aria-hidden>⋮</span>
                </li>
                <li>
                  Choose <span className="text-cream">Install app</span> or{" "}
                  <span className="text-cream">Add to Home screen</span>
                </li>
              </ol>
            )}

            {guide === "desktop" && (
              <ol className="mt-4 list-decimal space-y-2 pl-5 text-sm text-cream-muted">
                <li>
                  In Chrome or Edge, click the{" "}
                  <span className="text-cream">install</span> icon in the
                  address bar
                </li>
                <li>
                  Or open the browser menu and choose{" "}
                  <span className="text-cream">Install {BRAND_NAME}</span>
                </li>
              </ol>
            )}

            <div className="mt-6 flex flex-col gap-2 sm:flex-row">
              <button
                type="button"
                onClick={() => setGuide(null)}
                className="btn-gold flex-1 rounded-xl px-6 py-3 text-sm"
              >
                Got it
              </button>
              <button
                type="button"
                onClick={dismiss}
                className="btn-outline flex-1 rounded-xl px-6 py-3 text-sm"
              >
                Don&apos;t show again
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
