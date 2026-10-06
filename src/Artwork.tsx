import { useEffect, useId, useRef, useState, type CSSProperties, type PointerEvent as ReactPointerEvent, type ReactNode } from 'react';
import { motion, useMotionTemplate, useMotionValue, useReducedMotion, useSpring, useTransform, type TargetAndTransition, type Transition } from 'framer-motion';
import { CupSoda, Pizza, Sandwich, Soup, Star, X } from 'lucide-react';

const ease = [0.22, 1, 0.36, 1] as const;

export function LumaryBadge({ className = '' }: { className?: string }) {
  const id = useId();
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
      <defs>
        <linearGradient id={`${id}-g`} x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#ffd27a" />
          <stop offset="0.52" stopColor="#ff8a3a" />
          <stop offset="1" stopColor="#ec4019" />
        </linearGradient>
      </defs>
      <rect x="2" y="2" width="44" height="44" rx="13.5" fill={`url(#${id}-g)`} />
      <path d="M10.5 11.5c2.4-3.3 5.6-4.6 9.3-4.4h8.4c3.7-.2 6.9 1.1 9.3 4.4" stroke="rgba(255,255,255,.5)" strokeWidth="2" strokeLinecap="round" fill="none" />
      <g stroke="#fff" strokeWidth="2.5" strokeLinecap="round" fill="none">
        <path d="M16.8 15.5v5.2M20.4 15.5v5.2M24 15.5v5.2" />
        <path d="M15.6 20.7a5 5 0 0 0 9.6 0" />
        <path d="M20.4 25.9v11.6" />
      </g>
      <ellipse cx="32.6" cy="18.2" rx="4.4" ry="5.9" fill="#fff" />
      <path d="M32.6 24.6v12.9" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M36 4.1c.65 3.4 1.95 4.7 5.35 5.35-3.4.65-4.7 1.95-5.35 5.35-.65-3.4-1.95-4.7-5.35-5.35 3.4-.65 4.7-1.95 5.35-5.35Z" fill="#fff" opacity=".96" />
      <circle cx="12.6" cy="30.6" r="1.5" fill="#fff" opacity=".8" />
    </svg>
  );
}

export function Brand({ onClick, footer = false }: { onClick: () => void; footer?: boolean }) {
  return (
    <button className={`brand ${footer ? 'brand-footer' : ''}`} onClick={onClick} aria-label="Lumary, back to top">
      <LumaryBadge className="brand-icon" />
      <span>Lumary</span>
    </button>
  );
}

export function Cursor() {
  const reduced = useReducedMotion();
  const [enabled, setEnabled] = useState(false);
  const x = useMotionValue(-300);
  const y = useMotionValue(-300);
  const dotX = useSpring(x, { stiffness: 900, damping: 55, mass: 0.4 });
  const dotY = useSpring(y, { stiffness: 900, damping: 55, mass: 0.4 });
  const ringX = useSpring(x, { stiffness: 170, damping: 22, mass: 0.7 });
  const ringY = useSpring(y, { stiffness: 170, damping: 22, mass: 0.7 });

  useEffect(() => {
    if (reduced || !window.matchMedia('(pointer: fine)').matches) return;
    setEnabled(true);
    document.body.classList.add('has-cursor');
    const move = (event: MouseEvent) => {
      x.set(event.clientX);
      y.set(event.clientY);
      const target = event.target as HTMLElement | null;
      document.body.classList.toggle('cursor-hover', Boolean(target?.closest('a,button,input,textarea,select,video,[data-cursor]')));
    };
    const down = () => document.body.classList.add('cursor-down');
    const up = () => document.body.classList.remove('cursor-down');
    window.addEventListener('mousemove', move, { passive: true });
    window.addEventListener('mousedown', down);
    window.addEventListener('mouseup', up);
    return () => {
      document.body.classList.remove('has-cursor', 'cursor-hover', 'cursor-down');
      window.removeEventListener('mousemove', move);
      window.removeEventListener('mousedown', down);
      window.removeEventListener('mouseup', up);
    };
  }, [reduced, x, y]);

  if (!enabled) return null;
  return (
    <>
      <motion.div className="cursor-dot" style={{ x: dotX, y: dotY }} aria-hidden="true" />
      <motion.div className="cursor-ring" style={{ x: ringX, y: ringY }} aria-hidden="true" />
    </>
  );
}

export function Magnetic({ children, strength = 0.3, className = '' }: { children: ReactNode; strength?: number; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const reduced = useReducedMotion();
  const x = useSpring(useMotionValue(0), { stiffness: 170, damping: 14 });
  const y = useSpring(useMotionValue(0), { stiffness: 170, damping: 14 });

  function onMove(event: ReactPointerEvent<HTMLSpanElement>) {
    if (reduced || !ref.current) return;
    const bounds = ref.current.getBoundingClientRect();
    x.set((event.clientX - bounds.left - bounds.width / 2) * strength);
    y.set((event.clientY - bounds.top - bounds.height / 2) * strength);
  }

  function onLeave() {
    x.set(0);
    y.set(0);
  }

  return (
    <span ref={ref} className={`magnetic ${className}`} onPointerMove={onMove} onPointerLeave={onLeave}>
      <motion.span className="magnetic-inner" style={{ x, y }}>{children}</motion.span>
    </span>
  );
}

type TiltProps = {
  children: ReactNode;
  className?: string;
  max?: number;
  glare?: boolean;
  layout?: boolean;
  initial?: TargetAndTransition;
  animate?: TargetAndTransition;
  exit?: TargetAndTransition;
  transition?: Transition;
  whileHover?: TargetAndTransition;
};

export function Tilt({ children, className = '', max = 8, glare = true, layout, initial, animate, exit, transition, whileHover }: TiltProps) {
  const reduced = useReducedMotion();
  const rotateX = useSpring(useMotionValue(0), { stiffness: 150, damping: 18 });
  const rotateY = useSpring(useMotionValue(0), { stiffness: 150, damping: 18 });
  const glowX = useMotionValue(50);
  const glowY = useMotionValue(50);
  const glowXPct = useTransform(glowX, (value) => `${value}%`);
  const glowYPct = useTransform(glowY, (value) => `${value}%`);
  const glareBackground = useMotionTemplate`radial-gradient(430px circle at ${glowXPct} ${glowYPct}, rgba(255,255,255,.17), transparent 46%)`;

  function onMove(event: ReactPointerEvent<HTMLDivElement>) {
    if (reduced) return;
    const bounds = event.currentTarget.getBoundingClientRect();
    const px = (event.clientX - bounds.left) / bounds.width;
    const py = (event.clientY - bounds.top) / bounds.height;
    rotateX.set((0.5 - py) * max);
    rotateY.set((px - 0.5) * max);
    glowX.set(px * 100);
    glowY.set(py * 100);
  }

  function onLeave() {
    rotateX.set(0);
    rotateY.set(0);
  }

  return (
    <motion.div
      className={`tilt ${className}`}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      style={{ rotateX, rotateY, transformPerspective: 1000 }}
      layout={layout}
      initial={initial}
      animate={animate}
      exit={exit}
      transition={transition}
      whileHover={whileHover}
    >
      {children}
      {glare && <span className="tilt-glare" style={{ '--glare-bg': glareBackground } as CSSProperties} aria-hidden="true" />}
    </motion.div>
  );
}

export function Counter({ to, decimals = 0, suffix = '', prefix = '' }: { to: number; decimals?: number; suffix?: string; prefix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [value, setValue] = useState(0);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { setValue(to); return; }
    let frame = 0;
    let started = false;
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting || started) return;
      started = true;
      const startedAt = performance.now();
      const duration = 1600;
      const tick = (now: number) => {
        const progress = Math.min(1, (now - startedAt) / duration);
        const eased = 1 - Math.pow(1 - progress, 3);
        setValue(to * eased);
        if (progress < 1) frame = requestAnimationFrame(tick);
        else setValue(to);
      };
      frame = requestAnimationFrame(tick);
      observer.disconnect();
    }, { threshold: 0.4 });
    observer.observe(element);
    return () => { cancelAnimationFrame(frame); observer.disconnect(); };
  }, [to]);

  return <span ref={ref}>{prefix}{value.toFixed(decimals)}{suffix}</span>;
}

export function LineReveal({ children, delay = 0, className = '' }: { children: ReactNode; delay?: number; className?: string }) {
  const reduced = useReducedMotion();
  return (
    <span className={`line-mask ${className}`}>
      {reduced
        ? <span className="line-inner-static">{children}</span>
        : <motion.span className="line-inner" initial={{ y: '112%', rotate: 1.5 }} animate={{ y: '0%', rotate: 0 }} transition={{ duration: 0.85, delay, ease }}>{children}</motion.span>}
    </span>
  );
}

const marqueeItems = [
  { text: 'Delicious Food', italic: false },
  { text: '20–30 Min Delivery', italic: false },
  { text: 'Lumary', italic: true },
  { text: 'Fire-Fresh Kitchens', italic: false },
  { text: '50% Off First Order', italic: false },
  { text: 'Made To Glow', italic: true },
];

function MarqueeSparkle() {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
      <path d="M10 1c.8 4.4 2.6 6.2 7 7-4.4.8-6.2 2.6-7 7-.8-4.4-2.6-6.2-7-7 4.4-.8 6.2-2.6 7-7Z" />
    </svg>
  );
}

export function Marquee() {
  const group = (key: string) => (
    <span className="marquee-group" key={key} aria-hidden="true">
      {marqueeItems.map((item) => (
        <span className="marquee-item" key={item.text}>{item.italic ? <em>{item.text}</em> : item.text}<MarqueeSparkle /></span>
      ))}
    </span>
  );
  return <div className="marquee"><div className="marquee-track">{group('a')}{group('b')}</div></div>;
}

export function Reveal({ children, className = '', delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 27 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.18 }}
      transition={{ duration: 0.78, delay, ease }}
    >
      {children}
    </motion.div>
  );
}

export function ScooterIllustration() {
  return (
    <svg viewBox="0 0 112 90" className="feature-art" role="img" aria-label="Delivery scooter illustration">
      <ellipse cx="57" cy="83" rx="48" ry="4" fill="#f5e5d6" />
      <circle cx="35" cy="73" r="12" fill="#24201e" /><circle cx="35" cy="73" r="5" fill="#f8f5ef" />
      <circle cx="87" cy="73" r="12" fill="#24201e" /><circle cx="87" cy="73" r="5" fill="#f8f5ef" />
      <path d="M47 70h22l12-14 11 2 3 13H75" fill="#f5a810" stroke="#e77814" strokeWidth="2" strokeLinejoin="round" />
      <path d="M63 42h17l-1 18H60l-7-8" fill="#f54b21" /><path d="M82 55h13l5 14H85" fill="#f3b11d" />
      <rect x="14" y="34" width="35" height="29" rx="3" fill="#e94720" /><rect x="17" y="37" width="29" height="5" fill="#f58825" />
      <path d="M33 39v-7h-5" stroke="#ffe1b3" strokeWidth="2.5" strokeLinecap="round" />
      <path d="m49 55 13 2 8-10-9-5-12 7" fill="#f2a10d" /><path d="m62 42 8 5 7 8" stroke="#2b2520" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M64 28c1 8-1 12-6 18l-8 4" stroke="#25201d" strokeWidth="8" strokeLinecap="round" />
      <path d="M57 27c-1-9 3-15 9-16 7-1 11 3 12 9-4 4-12 8-21 7Z" fill="#f04b21" />
      <circle cx="69" cy="24" r="7" fill="#f7bb83" /><path d="m61 18 16-1" stroke="#b52e16" strokeWidth="3" strokeLinecap="round" />
      <path d="m70 31 9 13 9 2" stroke="#f6bb87" strokeWidth="5" strokeLinecap="round" /><path d="m86 44 8-5" stroke="#29211d" strokeWidth="3" strokeLinecap="round" />
      <path d="M96 38h8" stroke="#29211d" strokeWidth="3" strokeLinecap="round" />
      <path d="M17 68h-8m4-6H5" stroke="#f4a81a" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );
}

export function BowlIllustration() {
  return (
    <svg viewBox="0 0 112 90" className="feature-art" role="img" aria-label="Fresh noodles illustration">
      <ellipse cx="56" cy="82" rx="34" ry="4" fill="#f5e5d6" />
      <path d="M21 48c3 24 15 34 35 34s32-10 35-34H21Z" fill="#f2a613" /><path d="M29 62c7 8 18 12 31 11" stroke="#ffd970" strokeWidth="3" strokeLinecap="round" />
      <ellipse cx="56" cy="49" rx="35" ry="12" fill="#e77718" /><ellipse cx="56" cy="46" rx="31" ry="8" fill="#ffe3a0" />
      <path d="M37 47c9-7 16 5 25-2 6-5 13 1 18 1M30 49c10-2 12 6 21 5 12-1 14-6 28-5" stroke="#e89512" strokeWidth="3.5" strokeLinecap="round" />
      <path d="m56 45 22-35m-15 34 28-31" stroke="#784c2d" strokeWidth="3" strokeLinecap="round" />
      <path d="M38 39c-5-8-3-12 2-16m11 16c-4-8-2-12 3-15" stroke="#73a83c" strokeWidth="3" strokeLinecap="round" />
      <path d="M42 48c-7-7-13-5-16-13 9-2 15 0 19 8M69 45c4-9 11-8 14-14-9-1-15 2-18 10" fill="#69a743" />
      <circle cx="48" cy="45" r="3" fill="#ee4d24" /><circle cx="70" cy="51" r="3" fill="#ee4d24" /><circle cx="59" cy="42" r="2.5" fill="#6d9f39" />
    </svg>
  );
}

export function MedalIllustration() {
  return (
    <svg viewBox="0 0 112 90" className="feature-art" role="img" aria-label="Quality badge illustration">
      <path d="m42 57-10 27 13-6 7 10 10-29m7-2 10 27-13-6-7 10-10-29" fill="#e74723" />
      <path d="m56 5 7 5 9-2 5 8 9 1 2 9 8 5-2 9 5 8-6 7-1 9-9 3-5 8-9-1-7 5-8-5-9 1-5-8-9-3-1-9-6-7 5-8-2-9 8-5 2-9 9-1 5-8 9 2 7-5Z" fill="#f2a70c" />
      <circle cx="56" cy="39" r="25" fill="#fff4de" stroke="#e9741a" strokeWidth="3" /><circle cx="56" cy="39" r="19" fill="#fffaf3" />
      <path d="m45 39 8 8 15-17" fill="none" stroke="#ef4d24" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function LeafIllustration({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 57 60" className={className} aria-hidden="true" fill="none">
      <path d="M8 54C15 39 26 31 44 13" stroke="#9a982c" strokeWidth="2" strokeLinecap="round" />
      <path d="M26 32C14 32 9 23 13 12c12 2 17 9 13 20Zm8-8c-3-12 5-19 17-20 0 12-6 20-17 20ZM16 43C5 46 1 39 3 29c12-1 17 3 13 14Zm26-31c-8-5-7-10-3-12 7 2 9 6 3 12Z" fill="#a7ae44" />
      <path d="M26 32 14 15m20 9L48 7M16 43 5 32" stroke="#75882b" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

export function TomatoIllustration({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden="true" fill="none">
      <circle cx="32" cy="33" r="25" fill="#f25a2a" /><circle cx="32" cy="33" r="20" fill="#fb9565" /><circle cx="32" cy="33" r="16" fill="#f15b33" />
      <path d="M32 15v36M15 32h34M20 20l24 24m0-24L20 44" stroke="#ffd1a2" strokeWidth="2" />
      <path d="m32 10-4-5 5 3 5-3-3 6" fill="#6c9e3f" /><circle cx="32" cy="33" r="3" fill="#ffd3a2" />
      <circle cx="23" cy="26" r="1.2" fill="#ffe0b7" /><circle cx="41" cy="26" r="1.2" fill="#ffe0b7" /><circle cx="23" cy="40" r="1.2" fill="#ffe0b7" /><circle cx="41" cy="40" r="1.2" fill="#ffe0b7" />
    </svg>
  );
}

export function Avatar({ variant, className = '' }: { variant: 'woman' | 'man' | 'third'; className?: string }) {
  return <span className={`avatar avatar-${variant} ${className}`} aria-hidden="true" />;
}

export function Stars({ className = '' }: { className?: string }) {
  return (
    <span className={`stars ${className}`} aria-label="5 stars">
      {Array.from({ length: 5 }, (_, index) => <Star key={index} fill="currentColor" strokeWidth={0} />)}
    </span>
  );
}

export function Dialog({ title, onClose, children, className = '' }: { title: string; onClose: () => void; children: ReactNode; className?: string }) {
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const previouslyFocused = document.activeElement as HTMLElement | null;
    const dialog = dialogRef.current;
    const focusable = () => Array.from(dialog?.querySelectorAll<HTMLElement>('button:not(:disabled), a[href], input:not(:disabled), video[controls]') || []);
    (dialog?.querySelector<HTMLElement>('input:not(:disabled)') || focusable()[0])?.focus();

    function keepFocusInside(event: KeyboardEvent) {
      if (event.key !== 'Tab') return;
      const elements = focusable();
      const first = elements[0];
      const last = elements[elements.length - 1];
      if (!first || !last) return;
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    }

    dialog?.addEventListener('keydown', keepFocusInside);
    return () => { dialog?.removeEventListener('keydown', keepFocusInside); previouslyFocused?.focus(); };
  }, []);

  return (
    <motion.div className="modal-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <motion.div ref={dialogRef} className={`dialog ${className}`} role="dialog" aria-modal="true" aria-label={title} initial={{ opacity: 0, y: 30, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 20, scale: 0.97 }} transition={{ duration: 0.35, ease }}>
        <button className="dialog-close icon-button" onClick={onClose} aria-label="Close dialog"><X size={20} /></button>
        {children}
      </motion.div>
    </motion.div>
  );
}

export function PhoneMockup() {
  return (
    <div className="phone-mockup" aria-hidden="true">
      <div className="phone-screen">
        <div className="phone-top"><span>9:41</span><span className="phone-island" /><span className="phone-signal"><i /><i /><i /></span></div>
        <div className="phone-greeting">Hi, Alex! <span>o&nbsp;&nbsp; o</span></div>
        <div className="phone-question">What would you<br />like to eat today?</div>
        <div className="phone-offer"><span><strong>50% OFF</strong><small>On First Order</small><i>Order Now</i></span><img src="/images/hero-woman.png" alt="" /></div>
        <div className="phone-section-title">Categories <span>See All</span></div>
        <div className="phone-categories"><span><Sandwich /><small>Burger</small></span><span><Pizza /><small>Pizza</small></span><span><Soup /><small>Noodles</small></span><span><CupSoda /><small>Drinks</small></span></div>
        <div className="phone-section-title">Popular Near You <span>See All</span></div>
        <div className="phone-foods"><img src="/images/pizza.jpg" alt="" /><img src="/images/burger.jpg" alt="" /></div>
        <div className="phone-tabbar"><span>o</span><span>v</span><span>+</span><span>o</span></div>
      </div>
    </div>
  );
}
