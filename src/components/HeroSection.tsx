import React, { useRef } from 'react';
import gsap from 'gsap';
import { SplitText } from 'gsap/SplitText';
import { useGSAP } from '@gsap/react';
import { audio } from '../utils/audio';
import { ArrowDown, ArrowUpRight } from 'lucide-react';
import { Magnetic } from '../motion/Magnetic';
import { EASE_OUT } from '../motion/reveal';

interface HeroSectionProps {
  ready: boolean;
  onExploreClick: () => void;
  onPassesClick: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ ready, onExploreClick, onPassesClick }) => {
  const rootRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (!ready) return;
      const mm = gsap.matchMedia();
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const split = SplitText.create('.hero-word', { type: 'chars', mask: 'chars' });

        gsap
          .timeline({ defaults: { ease: EASE_OUT } })
          .from(split.chars, { yPercent: 120, duration: 1.3, stagger: 0.045 })
          .from('.hero-sub-word', { clipPath: 'inset(0 0 100% 0)', yPercent: 30, duration: 1.2 }, '-=1.0')
          .from('[data-hero-in]', { autoAlpha: 0, y: 24, duration: 1, stagger: 0.08 }, '-=0.8')
          .from('.hero-rule', { scaleX: 0, transformOrigin: 'left center', duration: 1.4 }, '<');

        // Headline eases up and dims as the hero scrolls away (content only; the can is untouched)
        gsap.to('.hero-lockup', {
          yPercent: -18,
          autoAlpha: 0.15,
          ease: 'none',
          scrollTrigger: { trigger: rootRef.current, start: 'top top', end: 'bottom top', scrub: true },
        });

        return () => split.revert();
      });
    },
    { scope: rootRef, dependencies: [ready] }
  );

  return (
    <section
      ref={rootRef}
      id="hero"
      className="relative min-h-[100dvh] w-full flex flex-col pt-24 sm:pt-28 pb-8 sm:pb-10 px-4 sm:px-10 z-20 pointer-events-none select-none"
    >
      {/* Monumental lockup: sits above the can's centre stage */}
      <div className="hero-lockup max-w-7xl mx-auto w-full text-center">
        <h1 className="hero-word font-display font-extrabold text-white leading-[0.85] tracking-[-0.055em] text-[11.5vw] xl:text-[9.5rem] 2xl:text-[10.5rem] drop-shadow-2xl">
          REDBULL
        </h1>
        <div className="hero-sub-word font-display font-extrabold leading-[0.9] tracking-[-0.04em] text-[9vw] xl:text-[8rem] text-transparent bg-clip-text bg-gradient-to-b from-white via-rb-silver to-white/15 -mt-1 sm:-mt-4">
          GRAVITY
        </div>
      </div>

      {/* Open stage for the 3D can */}
      <div className="flex-1 min-h-[24vh]" aria-hidden />

      {/* Base line: where + when, one sentence, two actions */}
      <div className="max-w-7xl mx-auto w-full pointer-events-auto">
        <span className="hero-rule block h-px w-full bg-white/15 mb-5 sm:mb-6" />
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5 md:gap-8 items-end">
          <div className="md:col-span-7 lg:col-span-6 text-center md:text-left">
            <p data-hero-in className="font-mono text-[11px] sm:text-xs tracking-[0.18em] uppercase text-rb-yellow mb-2.5">
              13-15 Nov 2026 &middot; Giza, Dahab, Sinai, New Cairo
            </p>
            <p data-hero-in className="text-base sm:text-lg text-rb-silver leading-relaxed max-w-[46ch] mx-auto md:mx-0">
              Dakar trucks over the Giza dunes, 30-meter dives into the Red Sea, and drift battles through Cairo.
            </p>
          </div>

          <div data-hero-in className="md:col-span-5 lg:col-span-6 flex flex-wrap items-center justify-center md:justify-end gap-3">
            <Magnetic>
              <button
                onClick={() => {
                  audio.playClick();
                  onPassesClick();
                }}
                className="group inline-flex items-center gap-2.5 h-12 sm:h-14 px-7 sm:px-8 rounded-full bg-rb-red hover:bg-rb-redGlow text-white font-display font-bold text-sm tracking-[0.14em] uppercase shadow-glow-red transition-colors duration-300 active:scale-[0.97]"
              >
                Get Passes
                <ArrowUpRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </button>
            </Magnetic>
            <button
              onClick={() => {
                audio.playClick();
                onExploreClick();
              }}
              className="group inline-flex items-center gap-2.5 h-12 sm:h-14 px-6 rounded-full border border-white/20 hover:border-white/50 bg-rb-dark/40 backdrop-blur-sm text-white font-display font-bold text-sm tracking-[0.14em] uppercase transition-colors duration-300 active:scale-[0.97]"
            >
              Explore Arenas
              <ArrowDown className="w-4 h-4 text-rb-yellow transition-transform duration-300 group-hover:translate-y-0.5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
