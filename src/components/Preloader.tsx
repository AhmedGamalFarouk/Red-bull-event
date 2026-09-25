import React, { useState, useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { audio } from '../utils/audio';
import { Volume2, VolumeX, Compass, MapPin, Zap, Flame } from 'lucide-react';

gsap.registerPlugin(useGSAP);

interface PreloaderProps {
  /** Launch pressed: the hero and nav start their intros as the shutters open. */
  onReveal: () => void;
  onComplete: () => void;
}

// ---------------- TACHOMETER GAUGE GEOMETRY ----------------
// 270° sweep from -135° (bottom-left) to +135° (bottom-right), angles measured clockwise from 12 o'clock.
const G_SIZE = 240;
const G_C = G_SIZE / 2;
const G_R = 96;
const G_START = -135;
const G_SWEEP = 270;
const TICK_COUNT = 41;
const REDLINE_FROM = 34; // last ticks glow as the redline zone

const polar = (angle: number, radius: number) => {
  const rad = (angle * Math.PI) / 180;
  return { x: G_C + radius * Math.sin(rad), y: G_C - radius * Math.cos(rad) };
};

const arcStart = polar(G_START, G_R);
const arcEnd = polar(G_START + G_SWEEP, G_R);
const ARC_PATH = `M ${arcStart.x} ${arcStart.y} A ${G_R} ${G_R} 0 1 1 ${arcEnd.x} ${arcEnd.y}`;

const TICKS = Array.from({ length: TICK_COUNT }, (_, i) => {
  const angle = G_START + (G_SWEEP * i) / (TICK_COUNT - 1);
  const major = i % 5 === 0;
  const outer = polar(angle, G_R + 16);
  const inner = polar(angle, G_R + (major ? 7 : 10));
  // Lit colour drifts from Red Bull yellow toward crimson, then redline.
  const t = i / (TICK_COUNT - 1);
  const color = i >= REDLINE_FROM ? '#FF2A3D' : gsap.utils.interpolate('#FFC800', '#ED1B2D', t);
  return { x1: inner.x, y1: inner.y, x2: outer.x, y2: outer.y, major, color };
});

const PHASES = [
  { at: 0, label: 'IGNITION SEQUENCE' },
  { at: 22, label: 'FUEL INJECTION SYNC' },
  { at: 46, label: 'AERO PHYSICS CALIBRATION' },
  { at: 70, label: 'SAHARA TERRAIN SHADERS' },
  { at: 100, label: 'LAUNCH READY' },
];

const phaseIndexFor = (value: number) => {
  let idx = 0;
  PHASES.forEach((p, i) => {
    if (value >= p.at) idx = i;
  });
  return idx;
};

// Resolve once the hero imagery + fonts are ready (capped so the preloader never hangs).
const waitForAssets = () =>
  Promise.race([
    Promise.all([
      ...['/egypt-pyramids.jpg', '/redbull-logo.svg'].map(
        (src) =>
          new Promise<void>((resolve) => {
            const img = new Image();
            img.onload = img.onerror = () => resolve();
            img.src = src;
          })
      ),
      document.fonts ? document.fonts.ready.then(() => undefined) : Promise.resolve(),
    ]),
    new Promise<void>((resolve) => setTimeout(resolve, 4000)),
  ]);

export const Preloader: React.FC<PreloaderProps> = ({ onReveal, onComplete }) => {
  const [isReady, setIsReady] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);

  const rootRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);
  const arcRef = useRef<SVGPathElement>(null);
  const needleRef = useRef<SVGGElement>(null);
  const phaseRef = useRef<HTMLSpanElement>(null);
  const tickRefs = useRef<(SVGLineElement | null)[]>([]);
  const pipRefs = useRef<(HTMLSpanElement | null)[]>([]);

  // ---------------- ENTRANCE + LOADING TIMELINE ----------------
  useGSAP(
    () => {
      const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const progress = { value: 0 };
      let litTicks = 0;
      let phase = 0;
      let phaseTl: gsap.core.Timeline | null = null;

      const renderProgress = () => {
        const v = progress.value;
        if (counterRef.current) counterRef.current.textContent = String(Math.round(v)).padStart(2, '0');
        gsap.set(arcRef.current, { strokeDashoffset: 100 - v });
        gsap.set(needleRef.current, { rotation: G_START + (G_SWEEP * v) / 100, svgOrigin: `${G_C} ${G_C}` });

        const nextLit = Math.round((v / 100) * TICK_COUNT);
        if (nextLit !== litTicks) {
          tickRefs.current.forEach((tick, i) => {
            if (!tick) return;
            const lit = i < nextLit;
            const wasLit = i < litTicks;
            if (lit === wasLit) return;
            gsap.to(tick, {
              attr: { stroke: lit ? TICKS[i].color : 'rgba(255,255,255,0.14)' },
              opacity: 1,
              duration: 0.25,
              ease: 'power2.out',
            });
          });
          litTicks = nextLit;
        }

        const nextPhase = phaseIndexFor(v);
        if (nextPhase !== phase && phaseRef.current) {
          phase = nextPhase;
          pipRefs.current.forEach((pip, i) =>
            gsap.to(pip, {
              backgroundColor: i <= phase ? (i === PHASES.length - 1 ? '#FFC800' : '#ED1B2D') : 'rgba(255,255,255,0.15)',
              scaleX: i === phase ? 1.6 : 1,
              duration: 0.35,
              ease: 'power3.out',
            })
          );
          phaseTl?.kill();
          phaseTl = gsap
            .timeline()
            .to(phaseRef.current, { yPercent: -100, autoAlpha: 0, duration: 0.18, ease: 'power2.in' })
            .call(() => {
              if (phaseRef.current) phaseRef.current.textContent = PHASES[phase].label;
            })
            .fromTo(
              phaseRef.current,
              { yPercent: 100, autoAlpha: 0 },
              { yPercent: 0, autoAlpha: 1, duration: 0.32, ease: 'power3.out' }
            );
        }
      };

      renderProgress();

      // Redline burst once 100% lands, then reveal the launch controls.
      const playReady = () => {
        gsap
          .timeline()
          .to('.pl-gauge-core', { scale: 1.08, duration: 0.18, ease: 'power2.out' })
          .to('.pl-gauge-core', { scale: 1, duration: 0.9, ease: 'elastic.out(1, 0.35)' })
          .fromTo(
            '.pl-burst',
            { scale: 0.6, autoAlpha: 0.9 },
            { scale: 1.9, autoAlpha: 0, duration: 0.9, ease: 'expo.out' },
            '<-0.05'
          )
          .fromTo(
            counterRef.current,
            { color: '#FFFFFF', textShadow: '0 0 28px rgba(255,255,255,0.9)' },
            { color: '#FFC800', textShadow: '0 0 14px rgba(255,200,0,0.55)', duration: 0.6, ease: 'power2.out' },
            '<'
          )
          .to('.pl-buffering', { autoAlpha: 0, y: -8, duration: 0.25, ease: 'power2.in' }, '<')
          .call(() => setIsReady(true), undefined, '<0.2');

        // Idle "engine hum": the needle breathes near the redline while awaiting launch.
        gsap.to(needleRef.current, {
          rotation: `-=${reduceMotion ? 0 : 3}`,
          svgOrigin: `${G_C} ${G_C}`,
          duration: 0.6,
          ease: 'sine.inOut',
          yoyo: true,
          repeat: -1,
          delay: 1,
        });
      };

      if (reduceMotion) {
        waitForAssets().then(() => {
          gsap.to(progress, { value: 100, duration: 0.4, ease: 'none', onUpdate: renderProgress, onComplete: playReady });
        });
        return;
      }

      // Cinematic entrance choreography
      const intro = gsap.timeline({ defaults: { ease: 'expo.out' } });
      intro
        .from('.pl-bg', { autoAlpha: 0, duration: 1.4, ease: 'power2.out' })
        .from('.pl-top', { y: -24, autoAlpha: 0, duration: 0.9 }, 0.15)
        .from('.pl-bottom', { y: 24, autoAlpha: 0, duration: 0.9 }, 0.2)
        .from('.pl-tag', { y: 16, autoAlpha: 0, scale: 0.9, duration: 0.8 }, 0.25)
        .from('.pl-logo', { y: 30, autoAlpha: 0, scale: 0.85, filter: 'blur(8px)', duration: 1 }, 0.3)
        .from('.pl-word', { yPercent: 115, skewY: 8, duration: 1.1, stagger: 0.09 }, 0.4)
        .from('.pl-sub', { y: 12, autoAlpha: 0, duration: 0.8 }, 0.6)
        .from('.pl-gauge-core', { scale: 0.6, autoAlpha: 0, rotation: -40, duration: 1.2 }, 0.5)
        .from('.pl-tick', { scale: 0, transformOrigin: '50% 50%', autoAlpha: 0, duration: 0.4, stagger: 0.012 }, 0.6)
        .from('.pl-readout', { y: 10, autoAlpha: 0, duration: 0.7 }, 0.9);

      gsap.to('.pl-orbit', { rotation: 360, duration: 18, ease: 'none', repeat: -1, transformOrigin: '50% 50%' });

      // Staged, variable-speed fill so the load reads as real work rather than a linear crawl.
      const load = gsap.timeline({ delay: 0.55, onUpdate: renderProgress });
      load
        .to(progress, { value: 27, duration: 0.55, ease: 'power3.out' })
        .to(progress, { value: 44, duration: 0.45, ease: 'power2.inOut' }, '+=0.08')
        .to(progress, { value: 71, duration: 0.5, ease: 'power3.out' }, '+=0.06')
        .to(progress, { value: 88, duration: 0.45, ease: 'power2.inOut' }, '+=0.1');

      Promise.all([waitForAssets(), new Promise<void>((resolve) => load.eventCallback('onComplete', () => resolve()))]).then(
        () => {
          if (!rootRef.current) return;
          gsap.to(progress, {
            value: 100,
            duration: 0.45,
            ease: 'power4.in',
            onUpdate: renderProgress,
            onComplete: playReady,
          });
        }
      );
    },
    { scope: rootRef }
  );

  // Launch controls cascade in once the gauge hits redline.
  useGSAP(
    () => {
      if (!isReady) return;
      gsap.from('.pl-cta', {
        y: 26,
        autoAlpha: 0,
        scale: 0.92,
        duration: 0.7,
        stagger: 0.1,
        ease: 'back.out(1.8)',
      });
    },
    { scope: rootRef, dependencies: [isReady] }
  );

  const handleEnter = (withAudio: boolean) => {
    if (withAudio) {
      if (!audio.enabled) {
        audio.toggle();
      }
      audio.playLaunchTransition();
    }
    setHasStarted(true);
    onReveal();
    // Smooth timing synchronized with shutter split & warp shockwave
    setTimeout(() => {
      onComplete();
    }, 1050);
  };

  return (
    <div
      ref={rootRef}
      className={`fixed inset-0 z-50 overflow-hidden pointer-events-auto select-none ${
        hasStarted ? 'pointer-events-none' : ''
      }`}
    >
      {/* ---------------- EGYPT BACKGROUND ENVIRONMENT ---------------- */}
      <div className="pl-bg absolute inset-0 z-0 overflow-hidden">
        {/* Cinematic Giza Pyramids and Sahara Dunes Image */}
        <img
          src="/egypt-pyramids.jpg"
          alt="Pyramids of Giza, Egypt - Sahara Desert Dunes Expedition"
          className={`w-full h-full object-cover object-center transition-all duration-1000 ${
            hasStarted ? 'animate-warp-zoom' : 'animate-ken-burns'
          }`}
        />

        {/* Cinematic Atmospheric Color Grading & Vignette */}
        <div className="absolute inset-0 bg-gradient-to-t from-rb-dark via-rb-dark/65 to-rb-dark/85" />
        <div className="absolute inset-0 bg-gradient-to-r from-rb-dark/80 via-transparent to-rb-dark/80" />

        {/* Ambient Red Bull Crimson & Golden Twilight Energy Blooms */}
        <div className="absolute -top-32 left-1/4 w-96 h-96 rounded-full bg-rb-red/20 blur-[130px] pointer-events-none" />
        <div className="absolute -bottom-32 right-1/4 w-96 h-96 rounded-full bg-rb-yellow/20 blur-[140px] pointer-events-none" />

        {/* Desert Telemetry HUD Grid Overlay */}
        <div className="absolute inset-0 hud-grid opacity-25 pointer-events-none" />

        {/* Egyptian Horizon Scanner Line */}
        <div
          className={`absolute left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-rb-yellow/40 to-transparent top-1/2 pointer-events-none transition-opacity duration-500 ${
            hasStarted ? 'opacity-0' : 'opacity-100 animate-pulse'
          }`}
        />
      </div>

      {/* ---------------- SPLIT SHUTTER BLAST-DOORS (Exit Animation) ---------------- */}
      {/* Top Shutter Half */}
      <div
        className={`absolute top-0 left-0 right-0 h-1/2 bg-rb-dark/70 backdrop-blur-md border-b border-rb-red/40 z-10 transition-transform duration-1000 ease-[cubic-bezier(0.85,0,0.15,1)] ${
          hasStarted ? '-translate-y-full shadow-[0_20px_50px_rgba(237,27,45,0.4)]' : 'translate-y-0'
        }`}
      >
        {/* Glow neon laser line at bottom edge */}
        <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-rb-red to-transparent shadow-[0_0_15px_#ED1B2D]" />
      </div>

      {/* Bottom Shutter Half */}
      <div
        className={`absolute bottom-0 left-0 right-0 h-1/2 bg-rb-dark/70 backdrop-blur-md border-t border-rb-yellow/40 z-10 transition-transform duration-1000 ease-[cubic-bezier(0.85,0,0.15,1)] ${
          hasStarted ? 'translate-y-full shadow-[0_-20px_50px_rgba(255,200,0,0.4)]' : 'translate-y-0'
        }`}
      >
        {/* Glow neon laser line at top edge */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-rb-yellow to-transparent shadow-[0_0_15px_#FFC800]" />
      </div>

      {/* ---------------- SUPERSONIC SHOCKWAVE / WARP FLASH ---------------- */}
      {hasStarted && (
        <div className="absolute inset-0 z-30 flex items-center justify-center pointer-events-none">
          {/* Radial shockwave pulse */}
          <div className="w-96 h-96 rounded-full bg-gradient-to-r from-rb-red/40 via-rb-yellow/50 to-white/60 blur-xl animate-shockwave" />
          {/* Central blinding flash */}
          <div className="absolute inset-0 bg-white/30 backdrop-blur-[2px] animate-pulse transition-opacity duration-700 opacity-0" />
        </div>
      )}

      {/* ---------------- FOREGROUND CONTENT LAYER ---------------- */}
      <div
        className={`relative z-20 h-full w-full flex flex-col justify-between p-6 sm:p-12 transition-all duration-700 ${
          hasStarted ? 'opacity-0 scale-125 blur-md' : 'opacity-100 scale-100 blur-0'
        }`}
      >
        {/* Top Header & Egyptian Coordinates Bar */}
        <div className="pl-top w-full flex flex-wrap items-center justify-between gap-3 text-xs font-mono tracking-widest text-rb-silver/80 uppercase">
          {/* Telemetry Indicator */}
          <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-black/40 border border-white/10 backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-rb-red animate-ping" />
            <span className="text-white font-semibold">REDBULL // TELEMETRY BUFFER</span>
          </div>

          {/* Egypt Geographic Coordinate Badge */}
          <div className="flex items-center gap-4 text-[11px] font-mono">
            <div className="hidden sm:flex items-center gap-1.5 text-rb-yellow">
              <Compass className="w-3.5 h-3.5" />
              <span>29.9792° N, 31.1342° E</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-rb-red/10 border border-rb-red/30 text-white">
              <MapPin className="w-3 h-3 text-rb-red" />
              <span>GIZA PLATEAU • EGYPT 🇪🇬</span>
            </div>
          </div>
        </div>

        {/* Center Stage: Red Bull Emblem & Gravity Unleashed */}
        <div className="flex flex-col items-center text-center max-w-2xl mx-auto my-auto py-4">
          {/* Egypt Expedition Tagline */}
          <div className="pl-tag inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1 mb-4 sm:mb-5 rounded-full bg-black/50 border border-rb-yellow/30 text-rb-yellow font-mono text-[9px] sm:text-[11px] font-semibold tracking-wider sm:tracking-widest uppercase shadow-sm max-w-[92vw]">
            <Flame className="w-3 sm:w-3.5 h-3 sm:h-3.5 text-rb-red shrink-0" />
            <span className="truncate">CAIRO • GIZA DUNES • DAHAB • SINAI // 2026</span>
          </div>

          {/* Official Red Bull Logo */}
          <img
            src="/redbull-logo.svg"
            alt="Red Bull"
            className="pl-logo h-12 sm:h-18 w-auto object-contain mb-3 sm:mb-4 drop-shadow-[0_10px_25px_rgba(237,27,45,0.4)]"
          />

          {/* Monumental Headline */}
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-display font-black tracking-tighter text-white mb-2 leading-tight drop-shadow-2xl flex flex-wrap items-center justify-center gap-x-3">
            <span className="inline-block overflow-hidden pb-1">
              <span className="pl-word inline-block">GRAVITY</span>
            </span>
            <span className="inline-block overflow-hidden pb-1">
              <span className="pl-word inline-block text-transparent bg-clip-text bg-gradient-to-r from-rb-red via-rb-yellow to-rb-red whitespace-nowrap">
                UNLEASHED
              </span>
            </span>
          </h1>

          <p className="pl-sub text-xs sm:text-sm font-mono text-rb-silver max-w-md mt-2 drop-shadow-md [@media(max-height:700px)]:hidden">
            Calibrating 3D aerodynamic physics, Dakar desert telemetry, and Egyptian Sahara terrain shaders.
          </p>

          {/* Tachometer Loading Gauge */}
          <div className="relative mt-6 sm:mt-8 flex flex-col items-center" role="progressbar" aria-label="Loading experience" aria-valuemin={0} aria-valuemax={100} aria-busy={!isReady}>
            <div className="pl-gauge-core relative w-40 h-40 sm:w-52 sm:h-52 [@media(max-height:700px)]:w-32 [@media(max-height:700px)]:h-32">
              {/* Ambient glow + redline burst ring */}
              <div className="absolute inset-6 rounded-full bg-rb-red/20 blur-2xl" />
              <div className="pl-burst absolute inset-0 rounded-full border-2 border-rb-yellow/80 opacity-0 shadow-[0_0_40px_rgba(255,200,0,0.6)]" />

              <svg viewBox={`0 0 ${G_SIZE} ${G_SIZE}`} className="relative w-full h-full overflow-visible">
                <defs>
                  <linearGradient id="pl-arc-grad" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#FFC800" />
                    <stop offset="60%" stopColor="#FF7A1A" />
                    <stop offset="100%" stopColor="#ED1B2D" />
                  </linearGradient>
                  <filter id="pl-glow" x="-50%" y="-50%" width="200%" height="200%">
                    <feGaussianBlur stdDeviation="4" result="b" />
                    <feMerge>
                      <feMergeNode in="b" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                </defs>

                {/* Slow-orbiting dashed bezel */}
                <circle
                  className="pl-orbit"
                  cx={G_C}
                  cy={G_C}
                  r={G_R - 18}
                  fill="none"
                  stroke="rgba(255,255,255,0.12)"
                  strokeWidth="1"
                  strokeDasharray="2 7"
                />

                {/* Tick ring */}
                {TICKS.map((t, i) => (
                  <line
                    key={i}
                    ref={(el) => {
                      tickRefs.current[i] = el;
                    }}
                    className="pl-tick"
                    x1={t.x1}
                    y1={t.y1}
                    x2={t.x2}
                    y2={t.y2}
                    stroke="rgba(255,255,255,0.14)"
                    strokeWidth={t.major ? 3 : 1.6}
                    strokeLinecap="round"
                  />
                ))}

                {/* Track + live progress arc (pathLength=100 maps dashoffset straight to %) */}
                <path d={ARC_PATH} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="6" strokeLinecap="round" />
                <path
                  ref={arcRef}
                  d={ARC_PATH}
                  pathLength={100}
                  fill="none"
                  stroke="url(#pl-arc-grad)"
                  strokeWidth="6"
                  strokeLinecap="round"
                  strokeDasharray="100"
                  strokeDashoffset="100"
                  filter="url(#pl-glow)"
                />

                {/* Needle */}
                <g ref={needleRef}>
                  <line
                    x1={G_C}
                    y1={G_C - G_R + 24}
                    x2={G_C}
                    y2={G_C - G_R + 8}
                    stroke="url(#pl-arc-grad)"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    opacity="0.9"
                  />
                  <circle cx={G_C} cy={G_C - G_R} r="6" fill="#FFFFFF" filter="url(#pl-glow)" />
                  <circle cx={G_C} cy={G_C - G_R} r="2.5" fill="#ED1B2D" />
                </g>
              </svg>

              {/* Center numeric readout */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pt-10 sm:pt-12 pointer-events-none">
                <div className="flex items-start leading-none">
                  <span
                    ref={counterRef}
                    className="font-display font-black text-4xl sm:text-5xl [@media(max-height:700px)]:text-3xl text-white tabular-nums tracking-tighter"
                  >
                    00
                  </span>
                  <span className="font-mono text-[10px] sm:text-xs text-rb-yellow mt-1 ml-0.5">%</span>
                </div>
                <span className="font-mono text-[8px] sm:text-[9px] tracking-[0.3em] text-rb-muted mt-1">SYS LOAD</span>
              </div>
            </div>

            {/* Phase readout + step pips */}
            <div className="pl-readout -mt-3 sm:-mt-4 flex flex-col items-center gap-2">
              <div className="h-4 overflow-hidden">
                <span
                  ref={phaseRef}
                  className="block font-mono text-[10px] sm:text-[11px] font-semibold tracking-[0.25em] text-rb-silver uppercase"
                >
                  {PHASES[0].label}
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                {PHASES.map((p, i) => (
                  <span
                    key={p.label}
                    ref={(el) => {
                      pipRefs.current[i] = el;
                    }}
                    className="block h-[3px] w-4 rounded-full"
                    style={{
                      backgroundColor: i === 0 ? '#ED1B2D' : 'rgba(255,255,255,0.15)',
                      transform: i === 0 ? 'scaleX(1.6)' : undefined,
                    }}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Action Navigation Buttons */}
          <div className="mt-6 sm:mt-8 min-h-[56px] flex items-center justify-center">
            {isReady ? (
              <div key="cta" className="flex flex-col sm:flex-row items-center gap-3">
                {/* Enter with Audio Button */}
                <div className="pl-cta">
                  <button
                    onClick={() => handleEnter(true)}
                    className="group relative inline-flex items-center gap-3 px-8 py-3.5 rounded-full bg-gradient-to-r from-rb-red to-[#d40026] hover:from-[#ff1f35] hover:to-rb-red text-white font-display font-bold text-sm tracking-widest uppercase transition-all duration-300 shadow-glow-red hover:scale-105 active:scale-95 border border-white/20"
                  >
                    <Volume2 className="w-4 h-4 animate-pulse text-rb-yellow" />
                    <span>ENTER EXPEDITION</span>
                    <Zap className="w-4 h-4 text-white group-hover:translate-x-0.5 transition-transform" />
                  </button>
                </div>

                {/* Enter Muted Button */}
                <div className="pl-cta">
                  <button
                    onClick={() => handleEnter(false)}
                    className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-black/40 hover:bg-black/60 text-rb-silver hover:text-white font-mono text-xs tracking-wider border border-white/10 hover:border-white/20 transition-all duration-200"
                  >
                    <VolumeX className="w-3.5 h-3.5 text-rb-muted" />
                    <span>Muted Launch</span>
                  </button>
                </div>
              </div>
            ) : (
              <div key="buffering" className="pl-buffering flex items-center gap-2 text-xs font-mono text-rb-muted tracking-widest uppercase">
                <span className="w-1.5 h-1.5 rounded-full bg-rb-yellow animate-ping" />
                <span>BUFFERING 3D TELEMETRY & ASSETS...</span>
              </div>
            )}
          </div>
        </div>

        {/* Bottom Telemetry & Egyptian Venue Footnote */}
        <div className="pl-bottom w-full flex flex-col sm:flex-row items-center justify-between gap-2 text-[10px] font-mono text-rb-silver/60 pt-4 border-t border-white/10">
          <div className="flex items-center gap-2 whitespace-nowrap">
            <span className="text-rb-red font-bold">RED BULL GIVES YOU WINGS ®</span>
            <span className="hidden sm:inline">•</span>
            <span className="hidden sm:inline">EXPEDITION VENUE: GIZA PYRAMIDS DUNES</span>
          </div>
          <div className="whitespace-nowrap">CAIRO // SINAI // DAHAB • NOV 13–15, 2026</div>
        </div>
      </div>
    </div>
  );
};
