import { forwardRef, useEffect, useRef, useState, type ReactNode } from "react";
import { motion, useInView, useMotionValue, useSpring, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

export const EASE = [0.22, 1, 0.36, 1] as const;

/** Route-level enter/exit transition. */
export function PageTransition({ routeKey, children }: { routeKey: string; children: ReactNode }) {
  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={routeKey}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.32, ease: EASE }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}

/** Fade + rise once the element scrolls into view. */
export function Reveal({
  children,
  delay = 0,
  y = 18,
  className,
}: { children: ReactNode; delay?: number; y?: number; className?: string }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, ease: EASE, delay }}
    >
      {children}
    </motion.div>
  );
}

/** Parent that staggers its <StaggerItem/> children as they enter the viewport. */
export function Stagger({
  children,
  className,
  gap = 0.06,
}: { children: ReactNode; className?: string; gap?: number }) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-40px" }}
      variants={{ hidden: {}, show: { transition: { staggerChildren: gap } } }}
    >
      {children}
    </motion.div>
  );
}

export const staggerItemVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.98 },
  show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.45, ease: EASE } },
};

export const StaggerItem = forwardRef<HTMLDivElement, { children: ReactNode; className?: string }>(
  function StaggerItem({ children, className }, ref) {
    return (
      <motion.div ref={ref} className={className} variants={staggerItemVariants}>
        {children}
      </motion.div>
    );
  },
);

/** Count-up number that runs when scrolled into view. */
export function Counter({
  value,
  duration = 1.2,
  decimals = 0,
  prefix = "",
  suffix = "",
  className,
}: { value: number; duration?: number; decimals?: number; prefix?: string; suffix?: string; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!inView) return;
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / (duration * 1000));
      const eased = 1 - Math.pow(1 - t, 3);
      setDisplay(value * eased);
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, value, duration]);

  return (
    <span ref={ref} className={className}>
      {prefix}
      {display.toLocaleString(undefined, { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}
      {suffix}
    </span>
  );
}

/** Progress bar that animates its fill on view. */
export function AnimatedProgress({
  value,
  className,
  barClassName,
}: { value: number; className?: string; barClassName?: string }) {
  return (
    <div className={cn("h-2 w-full overflow-hidden rounded-full bg-muted", className)}>
      <motion.div
        className={cn("h-full rounded-full gradient-emerald", barClassName)}
        initial={{ width: 0 }}
        whileInView={{ width: `${Math.max(0, Math.min(100, value))}%` }}
        viewport={{ once: true }}
        transition={{ duration: 0.9, ease: EASE }}
      />
    </div>
  );
}

/** Smooth mouse-follow value pair for parallax effects. */
export function useParallax(strength = 12) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 120, damping: 20 });
  const sy = useSpring(y, { stiffness: 120, damping: 20 });
  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      x.set(((e.clientX / window.innerWidth) * 2 - 1) * strength);
      y.set(((e.clientY / window.innerHeight) * 2 - 1) * strength);
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, [x, y, strength]);
  return { x: sx, y: sy };
}

/** Card wrapper: reveal + hover lift + shadow. */
export function MotionCard({
  children,
  className,
  index = 0,
}: { children: ReactNode; className?: string; index?: number }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.45, ease: EASE, delay: Math.min(index * 0.05, 0.4) }}
      whileHover={{ y: -6 }}
    >
      {children}
    </motion.div>
  );
}
