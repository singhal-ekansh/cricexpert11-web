export function SceneBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden>
      <div className="absolute inset-0 bg-gradient-to-b from-[#1a0f2e] via-[#2a1848] to-[#120c08]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_50%_0%,rgba(212,168,83,0.12),transparent_60%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_30%_at_50%_100%,rgba(196,92,74,0.08),transparent_70%)]" />

      {/* stars */}
      <div
        className="absolute inset-0 opacity-40"
        style={{
          backgroundImage:
            "radial-gradient(1px 1px at 20px 30px, #fff, transparent), radial-gradient(1px 1px at 80px 120px, rgba(255,255,255,0.8), transparent), radial-gradient(1px 1px at 160px 60px, #fff, transparent), radial-gradient(1px 1px at 240px 140px, rgba(255,255,255,0.6), transparent), radial-gradient(1px 1px at 320px 40px, #fff, transparent), radial-gradient(1px 1px at 400px 100px, rgba(255,255,255,0.7), transparent)",
          backgroundSize: "420px 180px",
        }}
      />

      {/* skyline */}
      <svg
        className="absolute bottom-0 left-0 w-full text-[#0a0612]"
        viewBox="0 0 1440 200"
        preserveAspectRatio="none"
        fill="currentColor"
      >
        <path d="M0,200 L0,120 L40,100 L60,130 L90,90 L120,110 L150,70 L180,95 L220,60 L260,85 L300,50 L340,75 L380,45 L420,70 L460,40 L500,65 L540,35 L580,60 L620,30 L660,55 L700,25 L740,50 L780,20 L820,45 L860,15 L900,40 L940,10 L980,35 L1020,5 L1060,30 L1100,0 L1140,25 L1180,8 L1220,30 L1260,12 L1300,35 L1340,15 L1380,40 L1440,20 L1440,200 Z" />
        <path
          opacity="0.5"
          d="M0,200 L0,150 L80,130 L160,155 L240,125 L320,145 L400,115 L480,140 L560,110 L640,135 L720,105 L800,130 L880,100 L960,125 L1040,95 L1120,120 L1200,90 L1280,115 L1360,95 L1440,110 L1440,200 Z"
        />
      </svg>
    </div>
  );
}
