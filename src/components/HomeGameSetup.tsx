import type { GameMode, GameOption, GameSettings } from "@/lib/types";

interface Props {
  formats: GameOption[];
  wicketModes: GameOption[];
  settings: GameSettings;
  mode: GameMode;
  onSettingsChange: (settings: GameSettings) => void;
  onModeChange: (mode: GameMode) => void;
}

function wicketSummary(
  formatLabel: string,
  wicketMode: string,
  wicketLabel: string,
) {
  const wicket = wicketLabel.toLowerCase();
  if (wicketMode === "green") {
    return `${formatLabel} on a ${wicket} — ratings favour pace bowlers and batters vs pace.`;
  }
  return `${formatLabel} on a ${wicket} — ratings favour spin bowlers and batters vs spin.`;
}

export function HomeGameSetup({
  formats,
  wicketModes,
  settings,
  mode,
  onSettingsChange,
  onModeChange,
}: Props) {
  const selectedFormat =
    formats.find((f) => f.id === settings.format) ?? formats[0];
  const selectedWicket =
    wicketModes.find((m) => m.id === settings.wicketMode) ?? wicketModes[0];

  return (
    <div className="setup-panel space-y-4">
      <div className="space-y-2.5">
        <p className="setup-label">Format &amp; conditions</p>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-stretch">
          {formats.length === 1 ? (
            <span className="format-badge sm:self-stretch">
              {formats[0].label}
            </span>
          ) : (
            <div className="segmented sm:w-auto">
              {formats.map((format) => (
                <Segment
                  key={format.id}
                  label={format.label}
                  active={settings.format === format.id}
                  onClick={() =>
                    onSettingsChange({ ...settings, format: format.id })
                  }
                />
              ))}
            </div>
          )}
          <div className="segmented min-w-0 flex-1">
            {wicketModes.map((wicket) => (
              <Segment
                key={wicket.id}
                label={wicket.label}
                active={settings.wicketMode === wicket.id}
                onClick={() =>
                  onSettingsChange({ ...settings, wicketMode: wicket.id })
                }
              />
            ))}
          </div>
        </div>
        {selectedFormat && selectedWicket && (
          <p className="summary-line">
            {wicketSummary(
              selectedFormat.label,
              settings.wicketMode,
              selectedWicket.label,
            )}
          </p>
        )}
      </div>

      <div className="border-t border-border/40 pt-4">
        <p className="setup-label mb-2">Difficulty</p>
        <div className="segmented">
          <Segment
            label="Easy"
            active={mode === "easy"}
            onClick={() => onModeChange("easy")}
          />
          <Segment
            label="Hard"
            active={mode === "hard"}
            onClick={() => onModeChange("hard")}
          />
        </div>
        <p className="summary-line mt-2.5">
          {mode === "easy"
            ? "Player stats shown while you draft."
            : "No stats — pick on knowledge alone."}
        </p>
      </div>
    </div>
  );
}

function Segment({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`segment ${active ? "segment-active" : ""}`}
    >
      {label}
    </button>
  );
}
