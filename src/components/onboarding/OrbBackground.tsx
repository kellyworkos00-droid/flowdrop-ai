export function OrbBackground() {
  return (
    <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden" aria-hidden>
      <div
        className="absolute h-[340px] w-[340px] rounded-full"
        style={{
          background: "rgba(45,107,228,0.07)",
          top: "-80px",
          left: "-100px",
          animation: "drift 22s ease-in-out infinite",
        }}
      />
      <div
        className="absolute h-[240px] w-[240px] rounded-full"
        style={{
          background: "rgba(0,229,195,0.06)",
          bottom: "-60px",
          right: "-60px",
          animation: "drift 28s ease-in-out infinite reverse",
        }}
      />
    </div>
  );
}
