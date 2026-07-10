"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { GameLogo } from "@/components/GameLogo";
import { HomeGameSetup } from "@/components/HomeGameSetup";
import { HomeSceneBackground } from "@/components/HomeSceneBackground";
import { HowToPlayModal } from "@/components/HowToPlayModal";
import { SiteFooter } from "@/components/SiteFooter";
import { getGameOptions } from "@/lib/api";
import {
  DEFAULT_GAME_SETTINGS,
  getBestScore,
  getGameMode,
  getGameSettings,
  setGameMode,
  setGameSettings,
} from "@/lib/storage";
import type { BestScoreRecord, GameMode, GameOption, GameSettings } from "@/lib/types";

export default function HomePage() {
  const [best, setBest] = useState<BestScoreRecord | null>(null);
  const [mode, setMode] = useState<GameMode>("easy");
  const [settings, setSettings] = useState<GameSettings>(DEFAULT_GAME_SETTINGS);
  const [formats, setFormats] = useState<GameOption[]>([]);
  const [wicketModes, setWicketModes] = useState<GameOption[]>([]);
  const [showHowTo, setShowHowTo] = useState(false);

  useEffect(() => {
    const savedMode = getGameMode();
    const savedSettings = getGameSettings();
    setMode(savedMode);
    setSettings(savedSettings);
    setBest(getBestScore(savedMode, savedSettings));

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
        setBest(getBestScore(savedMode, nextSettings));
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
    setBest(getBestScore(next, settings));
  };

  const handleSettingsChange = (next: GameSettings) => {
    setSettings(next);
    setGameSettings(next);
    setBest(getBestScore(mode, next));
  };

  const creditBudget =
    formats.find((f) => f.id === settings.format)?.credit_budget;

  return (
    <>
      <HomeSceneBackground />
      <main className="relative z-10 flex min-h-screen flex-col items-center justify-center px-4 py-8 sm:py-12">
      <div className="hero-card hero-card-home animate-fade-up w-full max-w-md rounded-2xl px-5 py-7 sm:px-8 sm:py-9">
        <GameLogo variant="home" className="mx-auto mb-1" priority />

        <p className="mx-auto mt-4 max-w-xs text-center text-sm leading-relaxed text-cream-muted">
          Pick format &amp; conditions, draft your XI, see your score.
        </p>

        <div className="mt-7 space-y-4">
          {formats.length > 0 && wicketModes.length > 0 && (
            <HomeGameSetup
              formats={formats}
              wicketModes={wicketModes}
              settings={settings}
              mode={mode}
              onSettingsChange={handleSettingsChange}
              onModeChange={handleModeChange}
            />
          )}

          <div className="space-y-2.5 pt-1">
            <Link
              href="/play"
              className="btn-gold animate-pulse-gold block w-full rounded-xl px-6 py-4 text-center text-sm tracking-[0.12em]"
            >
              Draft your XI
            </Link>
            <button
              type="button"
              onClick={() => setShowHowTo(true)}
              className="btn-outline w-full rounded-xl px-6 py-3 text-sm tracking-[0.08em]"
            >
              How to play
            </button>
          </div>

          {best && (
            <div className="flex justify-center pt-1">
              <span className="best-pill">
                Best ({mode})
                <span className="font-[family-name:var(--font-mono)] font-semibold">
                  {best.team_score}
                </span>
              </span>
            </div>
          )}
        </div>

        <p className="mt-6 text-center text-[10px] font-medium tracking-[0.18em] text-cream-muted/70 uppercase">
          Powered by real cricket data
        </p>
      </div>

      <SiteFooter className="mt-8 max-w-md" />

      <HowToPlayModal
        open={showHowTo}
        onClose={() => setShowHowTo(false)}
        creditBudget={creditBudget}
      />
      </main>
    </>
  );
}
