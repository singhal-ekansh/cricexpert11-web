export function HomeSceneBackground() {
  return (
    <div
      className="pointer-events-none fixed inset-0 z-[1] overflow-hidden"
      aria-hidden
    >
      <div className="absolute inset-0 bg-gradient-to-b from-[#0c1f14] via-[#143322] to-[#071209]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_45%_at_50%_-10%,rgba(74,158,111,0.28),transparent_55%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_50%_100%,rgba(20,60,35,0.55),transparent_70%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_40%_25%_at_80%_20%,rgba(212,168,83,0.08),transparent_50%)]" />

      {/* pitch stripe hint */}
      <div
        className="absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(90deg, #fff 0px, #fff 2px, transparent 2px, transparent 48px)",
        }}
      />

      {/* outfield horizon */}
      <svg
        className="absolute bottom-0 left-0 w-full text-[#061008]"
        viewBox="0 0 1440 180"
        preserveAspectRatio="none"
        fill="currentColor"
      >
        <path d="M0,180 L0,110 C120,95 240,125 360,100 C480,75 600,115 720,90 C840,65 960,105 1080,85 C1200,65 1320,100 1440,80 L1440,180 Z" />
        <path
          opacity="0.45"
          d="M0,180 L0,140 C200,120 400,155 600,130 C800,105 1000,145 1200,125 C1320,115 1380,130 1440,120 L1440,180 Z"
        />
      </svg>
    </div>
  );
}
