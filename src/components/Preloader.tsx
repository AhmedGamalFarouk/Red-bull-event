import React, { useEffect, useId, useRef, useState } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { useProgress } from '@react-three/drei';
import { Volume2, VolumeX } from 'lucide-react';
import { audio } from '../utils/audio';
import { EASE_OUT } from '../motion/reveal';
import { canScreen, CAN_SPIN_EVENT } from '../three/canScreen';

interface PreloaderProps {
  /** The scene starts showing through: start hero / nav intros so they land with the can. */
  onReveal: () => void;
  /** Hand-off finished: unmount the preloader. */
  onComplete: () => void;
}

const MIN_SHOW_MS = 1600; // long enough for the fill to read as a moment, not a flash
const FALLBACK_MS = 7000; // never trap the visitor behind a slow CDN (HDR environment, GLB)

// Can silhouette in a 100 x 270 box, matching the slim 3D model's proportions
const VB_H = 270;
const CAN_PATH = 'M9 15 Q9 6.4 19 5.4 L81 5.4 Q91 6.4 91 15 L100 30 L100 253 Q100 263.6 90 266.8 L10 266.8 Q0 263.6 0 253 L0 30 Z';
// The axis projection ignores the lid tilting toward the camera: the visible can is a
// little taller than its axis and its centre sits slightly higher. Tuned by overlaying both.
const LID_ALLOWANCE = 1.05;
const LID_LIFT = 0.02;

/**
 * The can is the loading indicator: its blue/silver livery fills bottom-up with real
 * asset progress. On entry it flies onto the live screen position of the 3D can,
 * the scene fades in underneath, and the 3D can takes over with a full spin.
 */
export const Preloader: React.FC<PreloaderProps> = ({ onReveal, onComplete }) => {
  const rootRef = useRef<HTMLDivElement>(null);
  const canRef = useRef<HTMLDivElement>(null);
  const fillRectRef = useRef<SVGRectElement>(null);
  const levelRef = useRef<SVGRectElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);
  const meterRef = useRef<HTMLDivElement>(null);
  const primaryRef = useRef<HTMLButtonElement>(null);
  const idleRef = useRef<gsap.core.Timeline | null>(null);
  const target = useRef(0);
  const [ready, setReady] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const uid = useId().replace(/:/g, '');

  const { progress: assetProgress, active } = useProgress();
  const loader = useRef({ progress: assetProgress, active });
  loader.current = { progress: assetProgress, active };

  // Real loader progress, with a slow floor so the fill never sits frozen at 0
  useEffect(() => {
    const started = performance.now();
    const floor = { v: 0 };
    const floorTween = gsap.to(floor, { v: 0.88, duration: 4.5, ease: 'power2.out' });
    const id = window.setInterval(() => {
      const { progress, active: busy } = loader.current;
      const elapsed = performance.now() - started;
      const loaded = !busy && (progress >= 100 || elapsed > 1200);
      const real = loaded || elapsed > FALLBACK_MS ? 1 : progress / 100;
      target.current = Math.max(real, Math.min(floor.v, 0.97));
    }, 60);
    return () => {
      window.clearInterval(id);
      floorTween.kill();
    };
  }, []);

  // Ease the displayed value toward the target and paint the fill
  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const started = performance.now();
    const shown = { p: 0 };
    let lastInt = -1;

    const tick = () => {
      // Time-based easing: same speed at 30, 60 or 144 fps
      const k = reduce ? 1 : 1 - Math.pow(1 - 0.075, gsap.ticker.deltaRatio(60));
      shown.p += (target.current - shown.p) * k;
      if (target.current >= 1 && shown.p > 0.998) shown.p = 1;

      const y = (1 - shown.p) * VB_H;
      fillRectRef.current?.setAttribute('y', y.toFixed(2));
      levelRef.current?.setAttribute('y', (y - 0.8).toFixed(2));
      levelRef.current?.setAttribute('opacity', shown.p > 0.01 && shown.p < 1 ? '1' : '0');

      const n = Math.round(shown.p * 100);
      if (n !== lastInt) {
        lastInt = n;
        if (counterRef.current) counterRef.current.textContent = String(n).padStart(2, '0');
        meterRef.current?.setAttribute('aria-valuenow', String(n));
      }
      if (shown.p === 1 && performance.now() - started > MIN_SHOW_MS) {
        gsap.ticker.remove(tick);
        setReady(true);
      }
    };
    gsap.ticker.add(tick);
    return () => gsap.ticker.remove(tick);
  }, []);

  // Intro + idle float (the can feels alive while it fills)
  useGSAP(
    () => {
      gsap.set(canRef.current, { xPercent: -50, yPercent: -50 });
      gsap.matchMedia().add('(prefers-reduced-motion: no-preference)', () => {
        gsap
          .timeline({ defaults: { ease: EASE_OUT } })
          .from(canRef.current, { y: 60, autoAlpha: 0, rotation: -8, duration: 1.3 })
          .from('[data-pre-in]', { autoAlpha: 0, y: 18, duration: 0.9, stagger: 0.07 }, '-=0.9');
        idleRef.current = gsap
          .timeline({ repeat: -1, yoyo: true, delay: 1.3 })
          .to(canRef.current, { y: -8, rotation: 2, duration: 2.2, ease: 'sine.inOut' });
      });
    },
    { scope: rootRef }
  );

  // Ready: actions rise in, focus the main action
  useGSAP(
    () => {
      if (!ready) return;
      primaryRef.current?.focus({ preventScroll: true });
      gsap.matchMedia().add('(prefers-reduced-motion: no-preference)', () => {
        gsap.from('[data-action]', { autoAlpha: 0, y: 20, duration: 0.8, ease: EASE_OUT, stagger: 0.08 });
      });
    },
    { scope: rootRef, dependencies: [ready] }
  );

  const handleEnter = (withAudio: boolean) => {
    if (leaving) return;
    setLeaving(true);
    if (withAudio) {
      if (!audio.enabled) audio.toggle();
      audio.playLaunchTransition();
    }

    const root = rootRef.current;
    const can = canRef.current;
    if (!root || !can || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      onReveal();
      gsap.to(root, { autoAlpha: 0, duration: 0.35, onComplete });
      return;
    }

    idleRef.current?.kill();
    root.style.pointerEvents = 'none';

    // Start pose: layout centre of the 2D can, minus whatever offset the idle float left on it
    const box = can.getBoundingClientRect();
    const baseH = can.offsetHeight;
    const from = {
      x: gsap.getProperty(can, 'x') as number,
      y: gsap.getProperty(can, 'y') as number,
      rotation: gsap.getProperty(can, 'rotation') as number,
      scale: gsap.getProperty(can, 'scale') as number,
    };
    const originX = box.left + box.width / 2 - from.x;
    const originY = box.top + box.height / 2 - from.y;
    const flight = { t: 0 };

    gsap
      .timeline({ onComplete })
      .to('[data-pre-ui]', { autoAlpha: 0, y: 16, duration: 0.4, ease: 'power2.in', stagger: 0.04 }, 0)
      // The 2D can flies onto the live pose of the 3D can, re-reading it every frame
      .to(
        flight,
        {
          t: 1,
          duration: 1.15,
          ease: 'expo.inOut',
          onUpdate: () => {
            const live = canScreen.valid;
            const tx = (live ? canScreen.cx : window.innerWidth / 2) - originX;
            const ty = (live ? canScreen.cy - canScreen.h * LID_LIFT : window.innerHeight / 2) - originY;
            const ts = live ? (canScreen.h * LID_ALLOWANCE) / baseH : 1.6;
            const tr = live ? canScreen.angle : 0;
            const e = flight.t;
            gsap.set(can, {
              x: from.x + (tx - from.x) * e,
              y: from.y + (ty - from.y) * e,
              scale: from.scale + (ts - from.scale) * e,
              rotation: from.rotation + (tr - from.rotation) * e,
            });
          },
        },
        0.1
      )
      // Scene fades in underneath; hero + nav intros start now so they land with the can
      .add(() => onReveal(), 0.55)
      .to('[data-pre-bg]', { autoAlpha: 0, duration: 0.7, ease: 'power2.inOut' }, 0.55)
      // Hand-off: the 3D can spins as the 2D can dissolves into it
      .add(() => window.dispatchEvent(new Event(CAN_SPIN_EVENT)), 1.2)
      .to(can, { autoAlpha: 0, duration: 0.3, ease: 'power1.out' }, 1.2);
  };

  return (
    <div ref={rootRef} className="preloader fixed inset-0 z-50 overflow-hidden select-none">
      {/* Backdrop (fades away during the hand-off to reveal the live 3D scene) */}
      <div data-pre-bg className="absolute inset-0 bg-rb-dark" aria-hidden>
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(55% 45% at 50% var(--can-cy), rgba(237,27,45,0.18), transparent 70%), radial-gradient(40% 30% at 50% 100%, rgba(255,200,0,0.07), transparent 70%)',
          }}
        />
      </div>

      {/* The can: loading indicator, and the object that becomes the 3D can */}
      <div ref={canRef} className="preloader-can absolute left-1/2 will-change-transform" aria-hidden>
        <svg viewBox={`0 0 100 ${VB_H}`} className="w-full h-full overflow-visible">
          <defs>
            <clipPath id={`can-${uid}`}>
              <path d={CAN_PATH} />
            </clipPath>
            <clipPath id={`fill-${uid}`}>
              <rect ref={fillRectRef} x="0" y={VB_H} width="100" height={VB_H} />
            </clipPath>
            <linearGradient id={`silver-${uid}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#F3F5F9" />
              <stop offset="1" stopColor="#B8C0CD" />
            </linearGradient>
            <linearGradient id={`blue-${uid}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#1F4396" />
              <stop offset="1" stopColor="#0F2A66" />
            </linearGradient>
            {/* Cylinder shading: dark edges, soft highlight left of centre */}
            <linearGradient id={`shade-${uid}`} x1="0" y1="0" x2="1" y2="0">
              <stop offset="0" stopColor="#000" stopOpacity="0.5" />
              <stop offset="0.22" stopColor="#fff" stopOpacity="0.35" />
              <stop offset="0.34" stopColor="#fff" stopOpacity="0.05" />
              <stop offset="0.75" stopColor="#000" stopOpacity="0.12" />
              <stop offset="1" stopColor="#000" stopOpacity="0.55" />
            </linearGradient>
          </defs>

          <g clipPath={`url(#can-${uid})`}>
            {/* Empty can */}
            <rect width="100" height={VB_H} fill="#fff" fillOpacity="0.04" />

            {/* Livery, revealed bottom-up by progress */}
            <g clipPath={`url(#fill-${uid})`}>
              <rect width="100" height={VB_H} fill={`url(#silver-${uid})`} />
              <rect x="50" y="30" width="50" height="111.5" fill={`url(#blue-${uid})`} />
              <rect x="0" y="141.5" width="50" height="111.5" fill={`url(#blue-${uid})`} />
              <rect y="5" width="100" height="25" fill="#DCE1E9" />
              <rect y="29.4" width="100" height="0.8" fill="#8F98A8" />
              <rect y="253" width="100" height="17" fill="#AEB6C3" />
              <image href="/redbull-logo.svg" x="10" y="103.5" width="80" height="76" preserveAspectRatio="xMidYMid meet" />
              <rect width="100" height={VB_H} fill={`url(#shade-${uid})`} />
            </g>

            {/* Fill level */}
            <rect ref={levelRef} x="0" y={VB_H} width="100" height="1.6" fill="#FFC800" opacity="0" />
          </g>

          <path d={CAN_PATH} fill="none" stroke="#fff" strokeOpacity="0.22" strokeWidth="1" vectorEffect="non-scaling-stroke" />
        </svg>
      </div>

      {/* Chrome */}
      <div className="relative h-full flex flex-col justify-between p-5 sm:p-10">
        <header className="flex items-center justify-between gap-4">
          <div data-pre-in data-pre-ui className="flex items-center gap-3">
            <img src="/redbull-logo.svg" alt="Red Bull" className="h-7 sm:h-8 w-auto" />
            <span className="flex flex-col leading-none pl-3 border-l border-white/15">
              <span className="font-display font-extrabold text-xs tracking-wider text-white">GRAVITY</span>
              <span className="font-mono text-[9px] font-semibold tracking-[0.2em] text-rb-yellow mt-1">EGYPT 26</span>
            </span>
          </div>
          <p data-pre-in data-pre-ui className="font-mono text-[11px] sm:text-xs tracking-[0.18em] uppercase text-rb-silver">
            13-15 Nov 2026
          </p>
        </header>

        <footer className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div
            ref={meterRef}
            data-pre-in
            data-pre-ui
            role="progressbar"
            aria-label="Loading"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={0}
          >
            <p className="font-display font-extrabold text-white leading-[0.8] tracking-[-0.05em] text-[clamp(4rem,12vw,9rem)]">
              <span ref={counterRef}>00</span>
              <span className="text-rb-red text-[0.4em] align-top ml-1">%</span>
            </p>
            <p className="font-mono text-[11px] tracking-[0.16em] uppercase text-rb-muted mt-3" aria-live="polite">
              {ready ? 'Ready when you are' : 'Loading the arenas'}
            </p>
          </div>

          <div data-pre-ui className="flex flex-col sm:flex-row gap-3 min-h-[3.5rem]">
            {ready ? (
              <>
                <button
                  ref={primaryRef}
                  data-action
                  onClick={() => handleEnter(true)}
                  disabled={leaving}
                  className="group inline-flex items-center justify-center gap-2.5 h-14 px-8 rounded-full bg-rb-red hover:bg-rb-redGlow text-white font-display font-bold text-sm tracking-[0.14em] uppercase shadow-glow-red transition-colors duration-300 active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rb-yellow focus-visible:ring-offset-2 focus-visible:ring-offset-rb-dark"
                >
                  <Volume2 className="w-4 h-4" aria-hidden />
                  Enter with sound
                </button>
                <button
                  data-action
                  onClick={() => handleEnter(false)}
                  disabled={leaving}
                  className="inline-flex items-center justify-center gap-2.5 h-14 px-6 rounded-full border border-white/20 hover:border-white/50 text-white font-display font-bold text-sm tracking-[0.14em] uppercase transition-colors duration-300 active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rb-yellow"
                >
                  <VolumeX className="w-4 h-4 text-rb-muted" aria-hidden />
                  Enter muted
                </button>
              </>
            ) : (
              <p data-pre-in className="self-start md:self-end flex items-center gap-2 text-sm text-rb-muted">
                <Volume2 className="w-4 h-4 text-rb-yellow" aria-hidden />
                Best with sound on
              </p>
            )}
          </div>
        </footer>
      </div>
    </div>
  );
};
