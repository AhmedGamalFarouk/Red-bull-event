import React, { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { useShowroomStore } from '../store/showroomStore';
import { TurntableCan } from '../components/TurntableCan';

gsap.registerPlugin(useGSAP);

interface IntroViewProps {
  onNavigate: (path: string) => void;
}

export const IntroView: React.FC<IntroViewProps> = ({ onNavigate }) => {
  const { scoredCount, firstUnscoredSlug } = useShowroomStore();
  const rootRef = useRef<HTMLDivElement>(null);
  const line1Ref = useRef<HTMLSpanElement>(null);
  const line2Ref = useRef<HTMLSpanElement>(null);
  const line3Ref = useRef<HTMLSpanElement>(null);
  const canRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add(
        {
          reduce: '(prefers-reduced-motion: reduce)',
          noPreference: '(prefers-reduced-motion: no-preference)',
        },
        (context) => {
          const { reduce } = context.conditions as {
            reduce: boolean;
            noPreference: boolean;
          };
          const lines = [line1Ref.current, line2Ref.current, line3Ref.current].filter(Boolean);

          if (reduce) {
            gsap.set(lines, { yPercent: 0, opacity: 1 });
            if (canRef.current) {
              gsap.set(canRef.current, { opacity: 1, scale: 1 });
            }
          } else {
            const tl = gsap.timeline();
            tl.fromTo(
              lines,
              { yPercent: 115, opacity: 0 },
              {
                yPercent: 0,
                opacity: 1,
                duration: 0.8,
                stagger: 0.12,
                ease: 'power3.out',
              }
            );

            if (canRef.current) {
              tl.fromTo(
                canRef.current,
                { opacity: 0, scale: 0.94 },
                { opacity: 1, scale: 1, duration: 0.8, ease: 'power2.out' },
                '-=0.3'
              );
            }
          }
        }
      );
    },
    { scope: rootRef }
  );

  const handleStartJudging = () => {
    onNavigate(`heat/${firstUnscoredSlug}`);
  };

  return (
    <div
      ref={rootRef}
      className="min-h-screen w-full bg-concrete text-ink flex flex-col justify-between p-6 sm:p-10 lg:p-14"
    >
      {/* Top utility bar */}
      <header className="flex items-center justify-between border-b border-slate/30 pb-4 font-utility text-xs tracking-utility text-slate">
        <div className="flex items-center gap-3">
          <span className="font-bold text-ink">RED BULL GRAVITY EGYPT 2026</span>
          <span className="hidden sm:inline text-slate/50">/</span>
          <span className="hidden sm:inline">DESIGN SHOWROOM</span>
        </div>
        <div className="flex items-center gap-6">
          <button
            onClick={() => onNavigate('lineup')}
            className="text-ink hover:text-slate transition-colors font-bold cursor-pointer"
          >
            LINEUP
          </button>
          {scoredCount > 0 && (
            <button
              onClick={() => onNavigate('results')}
              className="text-ink hover:text-slate transition-colors font-bold cursor-pointer"
            >
              RESULTS ({scoredCount}/6)
            </button>
          )}
        </div>
      </header>

      {/* Main content grid */}
      <main className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center py-6 lg:py-8">
        {/* Left Column: Typography & CTAs */}
        <div className="lg:col-span-7 flex flex-col justify-center">
          <div className="font-utility text-xs tracking-utility text-slate mb-3 uppercase">
            Design review · 6 drafts
          </div>

          <h1 className="font-display font-black text-4xl sm:text-6xl xl:text-7xl leading-[0.92] text-ink uppercase tracking-tight mb-6">
            <span className="block overflow-hidden pb-1">
              <span ref={line1Ref} className="block">
                Six drafts of
              </span>
            </span>
            <span className="block overflow-hidden pb-1">
              <span ref={line2Ref} className="block text-ink">
                Gravity Egypt.
              </span>
            </span>
            <span className="block overflow-hidden pb-1">
              <span ref={line3Ref} className="block text-slate">
                You're the judge.
              </span>
            </span>
          </h1>

          <p className="text-slate text-base sm:text-lg max-w-lg mb-8 leading-relaxed font-sans">
            Open each draft full-screen, score it, and we'll rank them at the end.
          </p>

          {scoredCount > 0 && (
            <div className="mb-6 font-utility text-xs tracking-utility text-slate inline-flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-card inline-block border border-ink" />
              <span>
                {scoredCount} OF 6 DRAFTS SCORED
              </span>
            </div>
          )}

          <div className="flex flex-wrap items-center gap-5">
            <button
              onClick={handleStartJudging}
              className="bg-card text-ink font-utility font-bold text-sm tracking-utility px-8 py-4 border-2 border-ink shadow-sm hover:bg-card/90 active:translate-y-[1px] transition-all rounded-[2px] cursor-pointer"
            >
              {scoredCount > 0 ? 'RESUME JUDGING' : 'START JUDGING'}
            </button>

            <button
              onClick={() => onNavigate('lineup')}
              className="text-ink hover:text-slate font-utility text-xs tracking-utility underline underline-offset-4 decoration-slate/60 transition-colors py-3 px-2 cursor-pointer"
            >
              SEE THE LINEUP
            </button>
          </div>
        </div>

        {/* Right Column: 3D Turntable Can */}
        <div
          ref={canRef}
          className="lg:col-span-5 h-[440px] sm:h-[540px] lg:h-[calc(100vh-200px)] min-h-[460px] max-h-[720px] w-full flex items-center justify-center relative"
        >
          <div className="w-full h-full relative flex items-center justify-center">
            <TurntableCan />
          </div>
        </div>
      </main>

      {/* Footer bar */}
      <footer className="border-t border-slate/30 pt-4 font-utility text-[11px] tracking-utility text-slate/70">
        Unofficial concept. Not affiliated with Red Bull.
      </footer>
    </div>
  );
};
