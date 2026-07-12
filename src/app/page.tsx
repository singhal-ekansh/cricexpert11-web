"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth } from "@/components/AuthProvider";
import { AddToHomeScreen } from "@/components/AddToHomeScreen";
import { GameLogo } from "@/components/GameLogo";
import { GameSetupModal } from "@/components/GameSetupModal";
import { GoogleSignInModal } from "@/components/GoogleSignInModal";
import { HowToPlayModal } from "@/components/HowToPlayModal";
import { SiteFooter } from "@/components/SiteFooter";
import { BRAND_HERO_COPY } from "@/lib/brand";
import { getGameOptions } from "@/lib/api";
import {
  DEFAULT_GAME_SETTINGS,
  getGameMode,
  getGameSettings,
  setGameMode,
  setGameSettings,
} from "@/lib/storage";
import { getCurrentUser } from "@/lib/auth";
import type { GameMode, GameOption, GameSettings } from "@/lib/types";

export default function HomePage() {
  const router = useRouter();
  const { user } = useAuth();
  const [mode, setMode] = useState<GameMode>("easy");
  const [settings, setSettings] = useState<GameSettings>(DEFAULT_GAME_SETTINGS);
  const [formats, setFormats] = useState<GameOption[]>([]);
  const [wicketModes, setWicketModes] = useState<GameOption[]>([]);
  const [showHowTo, setShowHowTo] = useState(false);
  const [showSetup, setShowSetup] = useState(false);
  const [showSignIn, setShowSignIn] = useState(false);
  const [signInForChallenges, setSignInForChallenges] = useState(false);

  const handleMyChallenges = () => {
    const currentUser = user ?? getCurrentUser();
    if (currentUser) {
      router.push("/profile");
      return;
    }
    setSignInForChallenges(true);
    setShowSignIn(true);
  };

  useEffect(() => {
    const savedMode = getGameMode();
    const savedSettings = getGameSettings();
    setMode(savedMode);
    setSettings(savedSettings);

    getGameOptions()
      .then((options) => {
        setFormats(options.formats);
        setWicketModes(options.wicket_modes);
        const nextSettings = {
          format: savedSettings.format || options.defaults.format,
          wicketMode: savedSettings.wicketMode || options.defaults.wicket_mode,
        };
        setSettings(nextSettings);
        setGameSettings(nextSettings);
      })
      .catch(() => {
        setFormats([
          {
            id: "t20i",
            label: "T20I",
            description: "International Twenty20",
            credit_budget: 105,
          },
        ]);
        setWicketModes([
          { id: "subcontinent", label: "Subcontinent", description: "" },
          { id: "green", label: "Green wicket", description: "" },
        ]);
      });
  }, []);

  const handleModeChange = (next: GameMode) => {
    setMode(next);
    setGameMode(next);
  };

  const handleSettingsChange = (next: GameSettings) => {
    setSettings(next);
    setGameSettings(next);
  };

  const creditBudget =
    formats.find((f) => f.id === settings.format)?.credit_budget;

  return (
    <>
      <main className="relative z-10 flex min-h-screen flex-col">
        <div className="flex flex-1 flex-col items-center justify-center px-4 py-10 sm:py-14">
          <div className="hero-card animate-fade-up w-full max-w-md rounded-2xl px-6 py-8 sm:px-8 sm:py-10">
            <GameLogo variant="home" className="mx-auto" priority />

            <p className="mx-auto mt-5 max-w-sm text-center text-sm leading-relaxed text-cream-muted">
              {BRAND_HERO_COPY}
            </p>

            <div className="mt-8 space-y-2.5">
              <button
                type="button"
                onClick={() => setShowSetup(true)}
                className="btn-gold w-full rounded-xl px-6 py-3.5 text-sm font-semibold"
              >
                Play
              </button>
              <button
                type="button"
                onClick={handleMyChallenges}
                className="btn-outline w-full rounded-xl px-6 py-3 text-sm"
              >
                My challenges
              </button>
              <button
                type="button"
                onClick={() => setShowHowTo(true)}
                className="btn-ghost w-full py-2 text-sm"
              >
                How to play
              </button>
              <AddToHomeScreen />
            </div>

            <p className="mt-6 text-center text-xs text-cream-muted/70">
              Real match stats · 11-round draft · Score your XI
            </p>
          </div>

          <SiteFooter className="mt-8 w-full max-w-md" />
        </div>

        <GameSetupModal
          open={showSetup}
          onClose={() => setShowSetup(false)}
          formats={formats}
          wicketModes={wicketModes}
          settings={settings}
          mode={mode}
          onSettingsChange={handleSettingsChange}
          onModeChange={handleModeChange}
        />

        <HowToPlayModal
          open={showHowTo}
          onClose={() => setShowHowTo(false)}
          creditBudget={creditBudget}
        />

        <GoogleSignInModal
          open={showSignIn}
          onClose={() => {
            setShowSignIn(false);
            setSignInForChallenges(false);
          }}
          onSuccess={() => {
            setShowSignIn(false);
            if (signInForChallenges) {
              router.push("/profile");
            }
            setSignInForChallenges(false);
          }}
        />
      </main>
    </>
  );
}
