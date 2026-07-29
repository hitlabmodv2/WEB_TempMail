import { useEffect, useState, useRef } from "react";

// ── Time-of-day config ───────────────────────────────────────────────
function getTimeOfDay() {
  const h = new Date().getHours();
  if (h >= 5  && h < 10) return "pagi";
  if (h >= 10 && h < 15) return "siang";
  if (h >= 15 && h < 18) return "sore";
  return "malam";
}

const TOD_CONFIG = {
  pagi: {
    greeting: "Selamat Pagi",
    emoji: "☀️",
    sub: "Semoga harimu menyenangkan!",
    accent: "#f59e0b",
    accentSoft: "rgba(245,158,11,0.18)",
    orbs: ["rgba(245,158,11,0.18)", "rgba(251,146,60,0.12)", "rgba(253,224,71,0.08)"],
    bar: "linear-gradient(90deg,#f59e0b,#fb923c)",
    pillBorder: "rgba(245,158,11,0.4)",
    pillBg: "rgba(245,158,11,0.08)",
    iconBorder: "rgba(245,158,11,0.55)",
    iconBg: "linear-gradient(135deg,#2a1f0a,#1a1205)",
    iconShadow: "0 0 48px rgba(245,158,11,0.45), 0 0 96px rgba(245,158,11,0.18)",
    titleGrad: "linear-gradient(135deg,#ffffff 0%,#fde68a 55%,#fbbf24 100%)",
  },
  siang: {
    greeting: "Selamat Siang",
    emoji: "🌤️",
    sub: "Tetap produktif dan semangat!",
    accent: "#22d3ee",
    accentSoft: "rgba(34,211,238,0.16)",
    orbs: ["rgba(34,211,238,0.16)", "rgba(6,182,212,0.11)", "rgba(99,102,241,0.10)"],
    bar: "linear-gradient(90deg,#22d3ee,#6366f1)",
    pillBorder: "rgba(34,211,238,0.4)",
    pillBg: "rgba(34,211,238,0.07)",
    iconBorder: "rgba(34,211,238,0.55)",
    iconBg: "linear-gradient(135deg,#0a1e2a,#051218)",
    iconShadow: "0 0 48px rgba(34,211,238,0.45), 0 0 96px rgba(34,211,238,0.18)",
    titleGrad: "linear-gradient(135deg,#ffffff 0%,#a5f3fc 55%,#22d3ee 100%)",
  },
  sore: {
    greeting: "Selamat Sore",
    emoji: "🌅",
    sub: "Waktunya santai sejenak!",
    accent: "#f97316",
    accentSoft: "rgba(249,115,22,0.18)",
    orbs: ["rgba(249,115,22,0.18)", "rgba(239,68,68,0.12)", "rgba(168,85,247,0.10)"],
    bar: "linear-gradient(90deg,#f97316,#ef4444)",
    pillBorder: "rgba(249,115,22,0.4)",
    pillBg: "rgba(249,115,22,0.08)",
    iconBorder: "rgba(249,115,22,0.55)",
    iconBg: "linear-gradient(135deg,#2a1000,#1a0800)",
    iconShadow: "0 0 48px rgba(249,115,22,0.45), 0 0 96px rgba(249,115,22,0.18)",
    titleGrad: "linear-gradient(135deg,#ffffff 0%,#fed7aa 55%,#f97316 100%)",
  },
  malam: {
    greeting: "Selamat Malam",
    emoji: "🌙",
    sub: "Selamat beristirahat nanti!",
    accent: "#a855f7",
    accentSoft: "rgba(168,85,247,0.18)",
    orbs: ["rgba(168,85,247,0.18)", "rgba(99,102,241,0.13)", "rgba(6,182,212,0.09)"],
    bar: "linear-gradient(90deg,#a855f7,#6366f1)",
    pillBorder: "rgba(168,85,247,0.4)",
    pillBg: "rgba(168,85,247,0.08)",
    iconBorder: "rgba(168,85,247,0.55)",
    iconBg: "linear-gradient(135deg,#150d2a,#0d0618)",
    iconShadow: "0 0 48px rgba(168,85,247,0.45), 0 0 96px rgba(168,85,247,0.18)",
    titleGrad: "linear-gradient(135deg,#ffffff 0%,#d8b4fe 55%,#a855f7 100%)",
  },
};

// ── Floating particles ───────────────────────────────────────────────
const PARTICLES = Array.from({ length: 28 }, (_, i) => ({
  id: i,
  x: Math.random() * 100,
  y: Math.random() * 100,
  size: 1.2 + Math.random() * 2.8,
  duration: 16 + Math.random() * 24,
  delay: Math.random() * 5,
  opacity: 0.08 + Math.random() * 0.20,
}));

const FEATURES = ["📬 Real-time Inbox", "🌐 Multi Provider", "🔒 Zero Storage", "🚫 Anti Spam"];
const TAGLINE = "Instant · Private · Anonymous".split("");

// ── Component ────────────────────────────────────────────────────────
export function IntroAnimation() {
  const tod = getTimeOfDay();
  const cfg = TOD_CONFIG[tod];

  // Animation phases — total ~5s
  // 0=idle, 1=bg+particles, 2=icon, 3=greeting, 4=title, 5=tagline, 6=features, 7=bar, 8=exit
  const [phase, setPhase] = useState(0);
  const [letterIdx, setLetterIdx] = useState(0);
  const [featIdx, setFeatIdx] = useState(0);
  const [barPct, setBarPct] = useState(0);
  const [exiting, setExiting] = useState(false);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const T: ReturnType<typeof setTimeout>[] = [];
    T.push(setTimeout(() => setPhase(1), 100));   // bg/particles
    T.push(setTimeout(() => setPhase(2), 450));   // icon drop
    T.push(setTimeout(() => setPhase(3), 980));   // greeting
    T.push(setTimeout(() => setPhase(4), 1400));  // NovaMail title
    T.push(setTimeout(() => setPhase(5), 1850));  // tagline typewriter
    T.push(setTimeout(() => setPhase(6), 2700));  // feature pills
    T.push(setTimeout(() => setPhase(7), 3500));  // loading bar
    T.push(setTimeout(() => setPhase(8), 4400));  // exit
    T.push(setTimeout(() => setExiting(true), 4500));
    return () => T.forEach(clearTimeout);
  }, []);

  // Typewriter
  useEffect(() => {
    if (phase < 5 || letterIdx >= TAGLINE.length) return;
    const t = setTimeout(() => setLetterIdx(v => v + 1), 40);
    return () => clearTimeout(t);
  }, [phase, letterIdx]);

  // Feature pills
  useEffect(() => {
    if (phase < 6 || featIdx >= FEATURES.length) return;
    const t = setTimeout(() => setFeatIdx(v => v + 1), 140);
    return () => clearTimeout(t);
  }, [phase, featIdx]);

  // Bar animation
  useEffect(() => {
    if (phase < 7) return;
    const start = performance.now();
    const duration = 800;
    const tick = (now: number) => {
      const p = Math.min((now - start) / duration, 1);
      // ease-out cubic
      setBarPct((1 - Math.pow(1 - p, 3)) * 100);
      if (p < 1) rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [phase]);

  const show = (minPhase: number, extra?: object) => ({
    transition: "opacity 0.5s ease, transform 0.55s cubic-bezier(.22,1,.36,1)",
    opacity: phase >= minPhase ? 1 : 0,
    ...extra,
  });

  return (
    <div style={{
      width: "100vw", height: "100vh",
      background: "#07090f",
      position: "relative", overflow: "hidden",
      display: "flex", alignItems: "center", justifyContent: "center",
      fontFamily: "'Inter','Segoe UI',sans-serif",
      transition: "opacity 0.75s ease, transform 0.75s ease, filter 0.75s ease",
      opacity: exiting ? 0 : 1,
      transform: exiting ? "scale(1.06)" : "scale(1)",
      filter: exiting ? "blur(6px)" : "blur(0)",
    }}>

      {/* Grid */}
      <svg style={{ position:"absolute",inset:0,width:"100%",height:"100%",
        opacity: phase >= 1 ? 0.06 : 0, transition:"opacity 0.8s ease" }}>
        <defs>
          <pattern id="g" width="52" height="52" patternUnits="userSpaceOnUse">
            <path d="M52 0L0 0 0 52" fill="none" stroke={cfg.accent} strokeWidth="0.6"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#g)"/>
      </svg>

      {/* Orb glows */}
      {cfg.orbs.map((color, i) => (
        <div key={i} style={{
          position:"absolute",
          width: 380 + i * 100, height: 380 + i * 100,
          borderRadius:"50%",
          background: `radial-gradient(circle,${color} 0%,transparent 70%)`,
          left:`${[18,62,42][i]}%`, top:`${[22,58,72][i]}%`,
          transform:"translate(-50%,-50%)",
          animation:`orb${i} ${8+i*2}s ease-in-out infinite alternate`,
          opacity: phase >= 1 ? 1 : 0,
          transition:"opacity 1s ease",
          pointerEvents:"none",
        }}/>
      ))}

      {/* Stars/particles */}
      {PARTICLES.map(p => (
        <div key={p.id} style={{
          position:"absolute", left:`${p.x}%`, top:`${p.y}%`,
          width:p.size, height:p.size, borderRadius:"50%",
          background: cfg.accent,
          opacity: phase >= 1 ? p.opacity : 0,
          transition:"opacity 1.2s ease",
          animation:`star ${p.duration}s linear ${p.delay}s infinite`,
          pointerEvents:"none",
        }}/>
      ))}

      {/* Center content */}
      <div style={{ position:"relative", zIndex:10, textAlign:"center", userSelect:"none", padding:"0 24px" }}>

        {/* Icon box */}
        <div style={{
          width:92, height:92, margin:"0 auto 20px",
          background: cfg.iconBg,
          border: `1.5px solid ${cfg.iconBorder}`,
          borderRadius:24,
          display:"flex", alignItems:"center", justifyContent:"center",
          fontSize:42,
          boxShadow: phase >= 2 ? cfg.iconShadow : "none",
          ...show(2, {
            transform: phase >= 2 ? "translateY(0) scale(1) rotate(0deg)" : "translateY(-40px) scale(0.6) rotate(-8deg)",
          }),
        }}>
          ✉️
        </div>

        {/* TOD Greeting */}
        <div style={{
          fontSize:14, fontWeight:600, letterSpacing:"0.06em",
          color: cfg.accent,
          marginBottom:8,
          ...show(3, {
            transform: phase >= 3 ? "translateY(0)" : "translateY(10px)",
          }),
        }}>
          {cfg.emoji} {cfg.greeting}
        </div>

        {/* Sub greeting */}
        <div style={{
          fontSize:12, color:"rgba(255,255,255,0.28)",
          marginBottom:18,
          ...show(3, {
            transition:"opacity 0.5s ease 0.15s, transform 0.55s cubic-bezier(.22,1,.36,1) 0.15s",
            transform: phase >= 3 ? "translateY(0)" : "translateY(8px)",
          }),
        }}>
          {cfg.sub}
        </div>

        {/* NovaMail title */}
        <div style={{
          fontSize:58, fontWeight:800, letterSpacing:"-2px", lineHeight:1,
          marginBottom:14,
          background: cfg.titleGrad,
          WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent",
          ...show(4, {
            transform: phase >= 4 ? "translateY(0) scale(1)" : "translateY(18px) scale(0.92)",
          }),
        }}>
          NovaMail
        </div>

        {/* Tagline typewriter */}
        <div style={{
          fontSize:14, color:"rgba(255,255,255,0.4)",
          letterSpacing:"0.07em", height:22, marginBottom:28,
          ...show(5),
        }}>
          {TAGLINE.slice(0, letterIdx).join("")}
          {phase >= 5 && letterIdx < TAGLINE.length && (
            <span style={{ color:cfg.accent, animation:"blink 0.65s steps(1) infinite" }}>|</span>
          )}
        </div>

        {/* Feature pills */}
        <div style={{
          display:"flex", gap:8, justifyContent:"center",
          flexWrap:"wrap", marginBottom:36, minHeight:28,
        }}>
          {FEATURES.map((f, i) => (
            <div key={f} style={{
              padding:"5px 13px", borderRadius:20,
              border:`1px solid ${cfg.pillBorder}`,
              background: cfg.pillBg,
              fontSize:11.5, color:"rgba(255,255,255,0.55)", fontWeight:500,
              transition:`opacity 0.3s ease ${i*0.04}s, transform 0.35s cubic-bezier(.22,1,.36,1) ${i*0.04}s`,
              opacity: i < featIdx ? 1 : 0,
              transform: i < featIdx ? "translateY(0) scale(1)" : "translateY(10px) scale(0.88)",
            }}>{f}</div>
          ))}
        </div>

        {/* Loading bar */}
        <div style={{
          width:220, height:3, background:"rgba(255,255,255,0.07)",
          borderRadius:99, overflow:"hidden", margin:"0 auto",
          ...show(7),
        }}>
          <div style={{
            height:"100%", width:`${barPct}%`,
            background: cfg.bar,
            borderRadius:99,
            boxShadow:`0 0 10px ${cfg.accentSoft}`,
            transition:"none",
          }}/>
        </div>

        {/* Loading label */}
        <div style={{
          marginTop:12, fontSize:10.5,
          color:"rgba(255,255,255,0.18)",
          letterSpacing:"0.18em", textTransform:"uppercase",
          ...show(7),
        }}>
          Memuat NovaMail...
        </div>
      </div>

      {/* TOD badge bottom-right */}
      <div style={{
        position:"absolute", bottom:24, right:24,
        fontSize:11, color:"rgba(255,255,255,0.2)",
        letterSpacing:"0.08em",
        ...show(3),
      }}>
        {tod.charAt(0).toUpperCase() + tod.slice(1)} · {new Date().toLocaleTimeString("id-ID",{hour:"2-digit",minute:"2-digit"})}
      </div>

      <style>{`
        @keyframes orb0{from{transform:translate(-50%,-50%) scale(1)}to{transform:translate(-46%,-54%) scale(1.09)}}
        @keyframes orb1{from{transform:translate(-50%,-50%) scale(1)}to{transform:translate(-54%,-46%) scale(1.13)}}
        @keyframes orb2{from{transform:translate(-50%,-50%) scale(1)}to{transform:translate(-48%,-53%) scale(1.07)}}
        @keyframes star{
          0%{transform:translateY(0)translateX(0)}
          25%{transform:translateY(-14px)translateX(5px)}
          50%{transform:translateY(-6px)translateX(-4px)}
          75%{transform:translateY(-20px)translateX(2px)}
          100%{transform:translateY(0)translateX(0)}
        }
        @keyframes blink{0%,100%{opacity:1}50%{opacity:0}}
      `}</style>
    </div>
  );
}
