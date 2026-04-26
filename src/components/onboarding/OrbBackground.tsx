export function OrbBackground() {
  return (
    <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden" aria-hidden>
      <div
        className="absolute h-[340px] w-[340px] rounded-full blur-[2px]"
        style={{
          background: "rgba(45,107,228,0.07)",
          top: "-80px",
          left: "-100px",
          animation: "drift 22s ease-in-out infinite",
        }}
      />
      <div
        className="absolute h-[240px] w-[240px] rounded-full blur-[1px]"
        style={{
          background: "rgba(0,229,195,0.06)",
          bottom: "-60px",
          right: "-60px",
          animation: "drift 28s ease-in-out infinite reverse",
        }}
      />
      <div
        className="absolute left-1/2 top-1/2 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(45,107,228,0.08) 0%, rgba(45,107,228,0) 65%)",
        }}
      />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.03),transparent_48%)]" />
    </div>
  );
}
