import React from 'react';
import { audio } from '../utils/audio';
import { ArrowDown } from 'lucide-react';

interface HeroSectionProps {
  onExploreClick: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onExploreClick,
}) => {
  return (
    <section
      id="hero"
      className="relative min-h-[100dvh] w-full flex flex-col justify-between pt-28 sm:pt-32 pb-12 px-4 sm:px-10 z-20 pointer-events-none"
    >
      {/* Monumental Headline Header (Upper Tier - Behind/Above the Can) */}
      <div className="max-w-7xl mx-auto w-full text-center pointer-events-none">
        <div className="relative">
          <h1 className="text-6xl sm:text-8xl md:text-9xl lg:text-[11rem] font-display font-black tracking-tighter text-white leading-none select-none">
            REDBULL
          </h1>
          <div className="text-4xl sm:text-6xl md:text-7xl lg:text-9xl font-display font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-b from-white via-rb-silver to-rb-muted/30 -mt-2 sm:-mt-6">
            GRAVITY
          </div>
        </div>
      </div>

      {/* Open Middle Window: 100% Unobstructed Stage for the 3D Red Bull Can */}
      <div className="my-auto min-h-[28vh] sm:min-h-[34vh] pointer-events-none" />

      {/* Lower Bar: Content shifted to Left and Right flanks so Center remains completely clear */}
      <div className="max-w-7xl mx-auto w-full flex flex-col md:flex-row items-center justify-between gap-6 pointer-events-auto pt-4 border-t border-white/10">
        {/* Left Flank: Subheadline & Location Manifesto */}
        <div className="max-w-md text-center md:text-left">
          <p className="text-xs sm:text-sm text-rb-silver font-sans leading-relaxed">
            Witness 28 world champions launch 1,050 BHP Dakar Trophy Trucks over the Giza dunes, 27-meter dives into the Red Sea, and 1,250 BHP drift battles through Cairo.
          </p>
        </div>

        {/* Right Flank: Action CTAs & Scroll Descend */}
        <div className="flex flex-wrap items-center justify-center md:justify-end gap-3 sm:gap-4">
          <a
            href="#tickets"
            onClick={() => audio.playClick()}
            className="px-6 py-3 rounded-full bg-gradient-to-r from-rb-red to-[#d40026] text-white font-mono text-xs font-bold tracking-widest uppercase hover:brightness-110 shadow-lg shadow-rb-red/30 transition-all hover:scale-105 active:scale-95"
          >
            Claim Pass
          </a>
          <button
            onClick={() => {
              audio.playClick();
              onExploreClick();
            }}
            className="group flex items-center gap-2.5 px-5 py-3 rounded-full glass-panel border border-white/15 hover:border-rb-yellow text-white font-mono text-xs font-semibold tracking-wider uppercase hover:bg-white/10 transition-all"
          >
            <span>Descend</span>
            <ArrowDown className="w-3.5 h-3.5 text-rb-yellow group-hover:translate-y-0.5 transition-transform" />
          </button>
        </div>
      </div>
    </section>
  );
};
