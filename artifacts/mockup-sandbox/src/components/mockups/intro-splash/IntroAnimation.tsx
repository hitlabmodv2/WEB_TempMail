import { useEffect, useState, useRef } from "react";

// Floating particle data
const PARTICLES = Array.from({ length: 22 }, (_, i) => ({
  id: i,
  x: Math.random() * 100,
  y: Math.random() * 100,
  size: 1.5 + Math.random() * 2.5,
  speed: 18 + Math.random() * 28,
  delay: Math.random() * 4,
  opacity: 0.12 + Math.random() * 0.22,
}));

const ORB_COLORS = [
  "rgba(61,139,255,0.18)",
  "rgba(168,85,247,0.13)",
  "rgba(6,182,212,0.11)",
];

const TAGLINE_LETTERS = "Instant · Private · Anonymous".split("");
const FEATURES = ["Real-time Inbox", "Multi Provider", "100% Gratis", "Anti Spam"];

export function IntroAnimation() {
  const [phase, setPhase] = useState(0);
  // phase 0 = bg in, 1 = icon in, 2 = title in, 3 = tagline in, 4 = features in, 5 = bar fill, 6 = exit
  const [letterIdx, setLetterIdx] = useState(0);
  const [featIdx, setFeatIdx] = useState(0);
  const [barWidth, setBarWidth] = useState(0);
  const [exiting, setExiting] = useState(false);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];
    timers.push(setTimeout(() => setPhase(1), 220));
    timers.push(setTimeout(() => setPhase(2), 700));
    timers.push(setTimeout(() => setPhase(3), 1100));
    timers.push(setTimeout(() => setPhase(4), 1600));
    timers.push(setTimeout(() => setPhase(5), 2200));
    timers.push(setTimeout(() => setPhase(6), 3000));
    timers.push(setTimeout(() => setExiting(true), 3200));
    return () => timers.forEach(clearTimeout);
  }, []);

  // Typewriter for tagline
  useEffect(() => {
    if (phase < 3) return;
    if (letterIdx >= TAGLINE_LETTERS.length) return;
    const t = setTimeout(() => setLetterIdx((v) => v + 1), 38);
    return () => clearTimeout(t);
  }, [phase, letterIdx]);

  // Feature pills popping in
  useEffect(() => {
    if (phase < 4) return;
    if (featIdx >= FEATURES.length) return;
    const t = setTimeout(() => setFeatIdx((v) => v + 1), 130);
    return () => clearTimeout(t);
  }, [phase, featIdx]);

  // Progress bar smooth fill
  useEffect(() => {
    if (phase < 5) return;
    const start = performance.now();
    const duration = 700;
    const animate = (now: number) => {
      const p = Math.min((now - start) / duration, 1);
      setBarWidth(p * 100);
      if (p < 1) rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [phase]);

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        background: "#07090f",
        position: "relative",
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "'Inter', 'Segoe UI', sans-serif",
        transition: "opacity 0.7s ease, transform 0.7s ease",
        opacity: exiting ? 0 : 1,
        transform: exiting ? "scale(1.04)" : "scale(1)",
      }}
    >
      {/* ── Animated grid ── */}
      <svg
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0.07 }}
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern id="grid" width="48" height="48" patternUnits="userSpaceOnUse">
            <path d="M 48 0 L 0 0 0 48" fill="none" stroke="#3d8bff" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>

      {/* ── Ambient glow orbs ── */}
      {ORB_COLORS.map((color, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            width: 420 + i * 80,
            height: 420 + i * 80,
            borderRadius: "50%",
            background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
            left: `${[20, 60, 40][i]}%`,
            top: `${[25, 55, 70][i]}%`,
            transform: "translate(-50%,-50%)",
            animation: `orbFloat${i} ${7 + i * 2}s ease-in-out infinite alternate`,
            pointerEvents: "none",
          }}
        />
      ))}

      {/* ── Floating particles ── */}
      {PARTICLES.map((p) => (
        <div
          key={p.id}
          style={{
            position: "absolute",
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            borderRadius: "50%",
            background: "#3d8bff",
            opacity: p.opacity,
            animation: `particleFloat ${p.speed}s linear ${p.delay}s infinite`,
            pointerEvents: "none",
          }}
        />
      ))}

      {/* ── CENTER CONTENT ── */}
      <div style={{ position: "relative", zIndex: 10, textAlign: "center", userSelect: "none" }}>

        {/* Icon */}
        <div
          style={{
            width: 88,
            height: 88,
            margin: "0 auto 28px",
            background: "linear-gradient(135deg, #1a2a4a 0%, #0f1d38 100%)",
            border: "1.5px solid rgba(61,139,255,0.5)",
            borderRadius: 24,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 38,
            boxShadow: "0 0 48px rgba(61,139,255,0.35), 0 0 96px rgba(61,139,255,0.15)",
            transition: "opacity 0.5s cubic-bezier(.22,1,.36,1), transform 0.65s cubic-bezier(.22,1,.36,1)",
            opacity: phase >= 1 ? 1 : 0,
            transform: phase >= 1 ? "translateY(0) scale(1)" : "translateY(-32px) scale(0.7)",
          }}
        >
          ✉️
        </div>

        {/* Logo text */}
        <div
          style={{
            fontSize: 52,
            fontWeight: 800,
            letterSpacing: "-1.5px",
            lineHeight: 1,
            marginBottom: 16,
            background: "linear-gradient(135deg, #ffffff 0%, #a5c3ff 55%, #7c9ef8 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            transition: "opacity 0.5s ease, transform 0.5s cubic-bezier(.22,1,.36,1)",
            opacity: phase >= 2 ? 1 : 0,
            transform: phase >= 2 ? "translateY(0)" : "translateY(14px)",
          }}
        >
          NovaMail
        </div>

        {/* Tagline typewriter */}
        <div
          style={{
            fontSize: 15,
            color: "rgba(255,255,255,0.45)",
            letterSpacing: "0.08em",
            fontWeight: 400,
            height: 24,
            marginBottom: 32,
            transition: "opacity 0.4s ease",
            opacity: phase >= 3 ? 1 : 0,
          }}
        >
          {TAGLINE_LETTERS.slice(0, letterIdx).join("")}
          {phase >= 3 && letterIdx < TAGLINE_LETTERS.length && (
            <span style={{ color: "#3d8bff", animation: "blink 0.7s steps(1) infinite" }}>|</span>
          )}
        </div>

        {/* Feature pills */}
        <div
          style={{
            display: "flex",
            gap: 8,
            justifyContent: "center",
            flexWrap: "wrap",
            marginBottom: 40,
            minHeight: 30,
          }}
        >
          {FEATURES.map((feat, i) => (
            <div
              key={feat}
              style={{
                padding: "5px 14px",
                borderRadius: 20,
                border: "1px solid rgba(61,139,255,0.35)",
                background: "rgba(61,139,255,0.08)",
                fontSize: 12,
                color: "rgba(255,255,255,0.6)",
                fontWeight: 500,
                letterSpacing: "0.03em",
                transition: "opacity 0.3s ease, transform 0.35s cubic-bezier(.22,1,.36,1)",
                opacity: i < featIdx ? 1 : 0,
                transform: i < featIdx ? "translateY(0) scale(1)" : "translateY(8px) scale(0.9)",
              }}
            >
              {feat}
            </div>
          ))}
        </div>

        {/* Loading bar */}
        <div
          style={{
            width: 200,
            height: 3,
            background: "rgba(255,255,255,0.08)",
            borderRadius: 99,
            overflow: "hidden",
            margin: "0 auto",
            transition: "opacity 0.3s ease",
            opacity: phase >= 5 ? 1 : 0,
          }}
        >
          <div
            style={{
              height: "100%",
              width: `${barWidth}%`,
              background: "linear-gradient(90deg, #3d8bff, #a855f7)",
              borderRadius: 99,
              boxShadow: "0 0 8px rgba(61,139,255,0.8)",
              transition: "none",
            }}
          />
        </div>

        {/* "Entering…" label */}
        <div
          style={{
            marginTop: 14,
            fontSize: 11,
            color: "rgba(255,255,255,0.2)",
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            transition: "opacity 0.3s ease",
            opacity: phase >= 5 ? 1 : 0,
          }}
        >
          Memuat...
        </div>
      </div>

      {/* Inline keyframes */}
      <style>{`
        @keyframes orbFloat0 { from { transform: translate(-50%,-50%) scale(1); } to { transform: translate(-46%,-54%) scale(1.08); } }
        @keyframes orbFloat1 { from { transform: translate(-50%,-50%) scale(1); } to { transform: translate(-54%,-46%) scale(1.12); } }
        @keyframes orbFloat2 { from { transform: translate(-50%,-50%) scale(1); } to { transform: translate(-48%,-52%) scale(1.06); } }
        @keyframes particleFloat {
          0%   { transform: translateY(0px) translateX(0px); opacity: inherit; }
          33%  { transform: translateY(-18px) translateX(6px); }
          66%  { transform: translateY(-8px) translateX(-4px); }
          100% { transform: translateY(0px) translateX(0px); }
        }
        @keyframes blink { 0%,100% { opacity: 1; } 50% { opacity: 0; } }
      `}</style>
    </div>
  );
}
