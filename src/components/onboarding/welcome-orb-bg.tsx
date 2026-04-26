export function WelcomeOrbBg() {
  return (
    <div aria-hidden className="absolute inset-0 overflow-hidden">
      <div
        className="absolute left-[-10%] top-[8%] h-72 w-72 rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(0,229,195,0.1), transparent 70%)",
          animation: "orb-drift 20s linear infinite",
        }}
      />
      <div
        className="absolute right-[-8%] top-[38%] h-80 w-80 rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(45,107,228,0.12), transparent 70%)",
          animation: "orb-drift 20s linear infinite reverse",
        }}
      />
    </div>
  );
}
