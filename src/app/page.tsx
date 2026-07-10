"use client";

import { useEffect, useState } from "react";
import { GameLogo } from "@/components/GameLogo";
import { GameSetupModal } from "@/components/GameSetupModal";
import { HomeSceneBackground } from "@/components/HomeSceneBackground";
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
import type { GameMode, GameOption, GameSettings } from "@/lib/types";

export default function HomePage() {
  const [mode, setMode] = useState<GameMode>("easy");
  const [settings, setSettings] = useState<GameSettings>(DEFAULT_GAME_SETTINGS);
  const [formats, setFormats] = useState<GameOption[]>([]);
  const [wicketModes, setWicketModes] = useState<GameOption[]>([]);
  const [showHowTo, setShowHowTo] = useState(false);
  const [showSetup, setShowSetup] = useState(false);

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
      <HomeSceneBackground />
      <main className="relative z-10 flex min-h-screen flex-col items-center justify-center px-4 py-8 sm:py-12">
      <div className="hero-card hero-card-home animate-fade-up w-full max-w-md rounded-2xl px-5 py-7 sm:px-8 sm:py-9">
        <GameLogo variant="home" className="mx-auto mb-1" priority />

        <p className="mx-auto mt-4 max-w-sm text-center text-sm leading-relaxed text-cream-muted">
          {BRAND_HERO_COPY}
        </p>

        <div className="mt-7 space-y-4">
          <div className="space-y-2.5 pt-1">
            <button
              type="button"
              onClick={() => setShowSetup(true)}
              className="btn-gold animate-pulse-gold w-full rounded-xl px-6 py-4 text-sm tracking-[0.12em]"
            >
              Play
            </button>
            <button
              type="button"
              onClick={() => setShowHowTo(true)}
              className="btn-outline w-full rounded-xl px-6 py-3 text-sm tracking-[0.08em]"
            >
              How to play
            </button>
          </div>
        </div>

        <p className="mt-6 text-center text-[10px] font-medium tracking-[0.18em] text-cream-muted/70 uppercase">
          Powered by real cricket data
        </p>
      </div>

      <SiteFooter className="mt-8 max-w-md" />

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
      </main>
    </>
  );
}
