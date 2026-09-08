import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export type AvatarState = "idle" | "listening" | "thinking" | "speaking" | "evaluating";
export type Gender = "male" | "female";

const STATE_LABEL: Record<AvatarState, string> = {
  idle: "Ready",
  listening: "Listening",
  thinking: "Thinking",
  speaking: "Speaking",
  evaluating: "Evaluating",
};

const STATE_TONE: Record<AvatarState, string> = {
  idle: "text-muted-foreground",
  listening: "text-primary",
  thinking: "text-gold",
  speaking: "text-primary",
  evaluating: "text-gold",
};

/**
 * Animated SVG interviewer: eye blinks, head sway, lip-sync while speaking,
 * a listening pulse ring and a thinking shimmer. No external assets.
 */
export function InterviewerAvatar({
  gender = "male",
  state = "idle",
  level = 0,
  size = 200,
}: { gender?: Gender; state?: AvatarState; level?: number; size?: number }) {
  const [blink, setBlink] = useState(false);
  const [mouth, setMouth] = useState(0.25);

  // Natural eye blinking
  useEffect(() => {
    let t: ReturnType<typeof setTimeout>;
    const loop = () => {
      t = setTimeout(() => {
        setBlink(true);
        setTimeout(() => setBlink(false), 130);
        loop();
      }, 1800 + Math.random() * 3200);
    };
    loop();
    return () => clearTimeout(t);
  }, []);

  // Lip movement while speaking
  useEffect(() => {
    if (state !== "speaking") { setMouth(0.2); return; }
    const id = setInterval(() => setMouth(0.15 + Math.random() * 0.85), 110);
    return () => clearInterval(id);
  }, [state]);

  const speaking = state === "speaking";
  const listening = state === "listening";
  const skin = gender === "male" ? "#e8b895" : "#f0c3a4";
  const hair = gender === "male" ? "#2b2118" : "#3a2418";
  const suit = gender === "male" ? "#1f2937" : "#3b2f4a";
  const mouthH = 3 + mouth * 13;

  return (
    <div className="flex flex-col items-center">
      <div className="relative" style={{ width: size, height: size }}>
        {/* glow / state ring */}
        <motion.div
          className="absolute inset-0 rounded-full"
          style={{
            background:
              state === "thinking" || state === "evaluating"
                ? "radial-gradient(circle, hsl(var(--gold)/0.35), transparent 65%)"
                : "radial-gradient(circle, hsl(var(--primary)/0.35), transparent 65%)",
          }}
          animate={{
            scale: speaking ? [1, 1.12, 1] : listening ? 1 + level * 0.35 : [1, 1.05, 1],
            opacity: state === "idle" ? 0.4 : 0.9,
          }}
          transition={{ duration: speaking ? 0.9 : 2.4, repeat: Infinity, ease: "easeInOut" }}
        />
        {listening && (
          <motion.span
            className="absolute inset-2 rounded-full border-2 border-primary/50"
            animate={{ scale: [1, 1.18], opacity: [0.7, 0] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: "easeOut" }}
          />
        )}

        {/* head sway */}
        <motion.div
          className="absolute inset-0 grid place-items-center"
          animate={
            speaking
              ? { rotate: [-1.6, 1.6, -1.6], y: [0, -3, 0] }
              : state === "thinking"
                ? { rotate: [-3, 1, -3], y: [0, 2, 0] }
                : { rotate: [-0.8, 0.8, -0.8], y: [0, -1.5, 0] }
          }
          transition={{ duration: speaking ? 2.2 : 5, repeat: Infinity, ease: "easeInOut" }}
        >
          <svg viewBox="0 0 200 200" width={size * 0.86} height={size * 0.86} aria-hidden>
            <defs>
              <clipPath id="av-clip"><circle cx="100" cy="100" r="92" /></clipPath>
              <linearGradient id="av-bg" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="hsl(var(--primary)/0.22)" />
                <stop offset="100%" stopColor="hsl(var(--gold)/0.18)" />
              </linearGradient>
            </defs>
            <g clipPath="url(#av-clip)">
              <circle cx="100" cy="100" r="92" fill="url(#av-bg)" />
              {/* shoulders + suit */}
              <path d="M28 200 Q100 138 172 200 Z" fill={suit} />
              <path d="M100 148 L88 200 L112 200 Z" fill="#f8fafc" />
              <path d="M100 152 l7 10 -7 22 -7 -22 z" fill="hsl(var(--primary))" />
              {/* neck */}
              <rect x="86" y="120" width="28" height="34" rx="12" fill={skin} />
              {/* hair back (female) */}
              {gender === "female" && <ellipse cx="100" cy="92" rx="52" ry="58" fill={hair} />}
              {/* face */}
              <ellipse cx="100" cy="90" rx="42" ry="48" fill={skin} />
              {/* hair front */}
              {gender === "male" ? (
                <path d="M58 82 Q62 40 100 40 Q138 40 142 82 Q132 62 100 62 Q68 62 58 82 Z" fill={hair} />
              ) : (
                <path d="M56 88 Q56 38 100 38 Q144 38 144 88 Q136 64 100 64 Q64 64 56 88 Z" fill={hair} />
              )}
              {/* ears */}
              <ellipse cx="58" cy="92" rx="6" ry="10" fill={skin} />
              <ellipse cx="142" cy="92" rx="6" ry="10" fill={skin} />
              {/* brows */}
              <motion.g
                animate={{ y: state === "thinking" ? [-1, -5, -1] : 0 }}
                transition={{ duration: 2.2, repeat: Infinity }}
              >
                <rect x="74" y="74" width="22" height="4" rx="2" fill={hair} />
                <rect x="104" y="74" width="22" height="4" rx="2" fill={hair} />
              </motion.g>
              {/* eyes */}
              {blink ? (
                <>
                  <rect x="74" y="88" width="20" height="3" rx="1.5" fill="#3b2f2a" />
                  <rect x="106" y="88" width="20" height="3" rx="1.5" fill="#3b2f2a" />
                </>
              ) : (
                <>
                  <ellipse cx="84" cy="89" rx="9" ry="7" fill="#fff" />
                  <ellipse cx="116" cy="89" rx="9" ry="7" fill="#fff" />
                  <motion.g
                    animate={{ x: state === "thinking" ? [0, 4, 0, -3, 0] : [0, 1.5, 0, -1.5, 0] }}
                    transition={{ duration: state === "thinking" ? 3 : 6, repeat: Infinity }}
                  >
                    <circle cx="84" cy="90" r="4" fill="#2a1d16" />
                    <circle cx="116" cy="90" r="4" fill="#2a1d16" />
                  </motion.g>
                </>
              )}
              {/* nose */}
              <path d="M100 94 q4 10 -3 12" stroke="#c99271" strokeWidth="2.5" fill="none" strokeLinecap="round" />
              {/* mouth — animates while speaking */}
              <motion.ellipse
                cx="100"
                cy={118}
                rx={speaking ? 13 : 12}
                ry={speaking ? mouthH : 3}
                fill="#8a3b40"
                animate={{ ry: speaking ? mouthH : 3 }}
                transition={{ duration: 0.09 }}
              />
              <path d="M88 116 q12 6 24 0" stroke="#a4525a" strokeWidth="2" fill="none" strokeLinecap="round" />
            </g>
            <circle cx="100" cy="100" r="92" fill="none" stroke="hsl(var(--primary)/0.35)" strokeWidth="3" />
          </svg>
        </motion.div>
      </div>

      <div className="mt-3 flex items-center gap-2">
        <motion.span
          className={`h-2 w-2 rounded-full ${state === "idle" ? "bg-muted-foreground" : state === "thinking" || state === "evaluating" ? "bg-gold" : "bg-primary"}`}
          animate={{ opacity: state === "idle" ? 1 : [1, 0.25, 1] }}
          transition={{ duration: 1, repeat: Infinity }}
        />
        <span className={`text-xs font-semibold ${STATE_TONE[state]}`}>{STATE_LABEL[state]}</span>
      </div>
    </div>
  );
}

/** Live mic waveform bars driven by an RMS level 0..1. */
export function MicWaveform({ level, active, bars = 28 }: { level: number; active: boolean; bars?: number }) {
  return (
    <div className="flex h-12 items-center justify-center gap-[3px]">
      {Array.from({ length: bars }).map((_, i) => {
        const center = 1 - Math.abs(i - (bars - 1) / 2) / ((bars - 1) / 2);
        const h = active ? 4 + level * 44 * (0.35 + center) * (0.6 + Math.random() * 0.7) : 4;
        return (
          <motion.span
            key={i}
            className={`w-[3px] rounded-full ${active ? "bg-primary" : "bg-muted-foreground/30"}`}
            animate={{ height: Math.max(4, Math.min(46, h)) }}
            transition={{ duration: 0.08 }}
          />
        );
      })}
    </div>
  );
}
