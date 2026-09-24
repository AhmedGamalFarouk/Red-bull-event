import React from 'react';
import { audio } from '../utils/audio';
import { ArrowDown, Flame, Compass, Radio, ChevronRight } from 'lucide-react';

interface HeroSectionProps {
  onExploreClick: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onExploreClick,
}) => {
  return (
    <section
      id="hero"
      className="relative min-h-[100dvh] w-full flex flex-col justify-between pt-24 sm:pt-28 pb-10 px-4 sm:px-10 z-20 pointer-events-none select-none"
    >
      {/* HUD Telemetry Top Header */}
      <div className="max-w-7xl mx-auto w-full flex items-center justify-between pointer-events-auto border-b border-white/10 pb-3 pt-2 text-[10px] font-mono tracking-widest text-rb-muted uppercase">
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-rb-red/20 text-rb-red font-bold border border-rb-red/30">
            <span className="w-1.5 h-1.5 rounded-full bg-rb-red animate-ping" />
            LIVE TELEMETRY
          </span>
          <span className="hidden md:inline text-rb-silver">
            GIZA // DAHAB // SINAI // NEW CAIRO
          </span>
        </div>
        <div className="flex items-center gap-4">
          <span className="hidden sm:inline">29°58′45″N 31°08′03″E</span>
          <span className="text-rb-yellow font-bold">13–15 NOV 2026</span>
        </div>
      </div>

      {/* Monumental Headline Header (Upper Tier - Above & Behind 3D Can) */}
      <div className="max-w-7xl mx-auto w-full text-center pointer-events-none pt-4">
        <div className="relative inline-block">
          <div className="flex items-center justify-center gap-2 mb-2">
            <span className="w-6 h-px bg-rb-yellow/60" />
            <span className="font-mono text-[10px] sm:text-xs font-bold tracking-[0.3em] text-rb-yellow uppercase">
              EXTREME ADRENALINE SPECTACLE
            </span>
            <span className="w-6 h-px bg-rb-yellow/60" />
          </div>

          <h1 className="text-5xl xs:text-6xl sm:text-8xl md:text-9xl lg:text-[11.5rem] font-display font-black tracking-tighter text-white leading-none select-none drop-shadow-2xl">
            REDBULL
          </h1>
          <div className="text-3xl xs:text-4xl sm:text-6xl md:text-7xl lg:text-9xl font-display font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-b from-white via-rb-silver to-white/15 -mt-2 sm:-mt-6">
            GRAVITY
          </div>
        </div>
      </div>

      {/* Open Middle Window: 100% Unobstructed Stage for the 3D Red Bull Can */}
      <div className="my-auto min-h-[26vh] sm:min-h-[32vh] relative flex items-center justify-between max-w-7xl mx-auto w-full pointer-events-none px-4">
        {/* Subtle HUD Reticle Marks on the flanks */}
        <div className="hidden lg:flex flex-col gap-2 font-mono text-[9px] text-rb-muted/40 tracking-wider">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 border-l border-t border-rb-yellow/40" />
            <span>STAGE: FLIGHT DECK</span>
          </div>
          <span className="pl-4">AIRFLOW: 240 KM/H</span>
        </div>
        <div className="hidden lg:flex flex-col items-end gap-2 font-mono text-[9px] text-rb-muted/40 tracking-wider">
          <div className="flex items-center gap-2">
            <span>ROTATION: 360° INTERACTIVE</span>
            <span className="w-2 h-2 border-r border-t border-rb-cyan/40" />
          </div>
          <span className="pr-4">CAN DRAG: ACTIVE</span>
        </div>
      </div>

      {/* Lower Bar: Content shifted to Left and Right flanks so Center remains completely clear */}
      <div className="max-w-7xl mx-auto w-full flex flex-col md:flex-row items-center justify-between gap-6 pointer-events-auto pt-5 border-t border-white/10 bg-rb-dark/40 backdrop-blur-sm rounded-t-2xl px-4 sm:px-6">
        {/* Left Flank: Subheadline & Location Manifesto */}
        <div className="max-w-md text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-2 mb-1.5 font-mono text-[10px] text-rb-yellow tracking-widest uppercase font-semibold">
            <Flame className="w-3.5 h-3.5 text-rb-red" />
            <span>28 Champions • 4 Arenas • 1,250 BHP</span>
          </div>
          <p className="text-xs sm:text-sm text-rb-silver font-sans leading-relaxed">
            Witness world champions launch 1,050 BHP Dakar Trophy Trucks over Giza dunes, 30-meter dives into the Red Sea, and high-speed drift battles through Cairo.
          </p>
        </div>

        {/* Right Flank: Action CTAs & Scroll Descend */}
        <div className="flex flex-wrap items-center justify-center md:justify-end gap-3 sm:gap-4">
          <a
            href="#tickets"
            onClick={() => audio.playClick()}
            className="group relative inline-flex items-center gap-2 px-6 sm:px-7 py-3 rounded-full bg-gradient-to-r from-rb-red via-[#e00d20] to-rb-red text-white font-mono text-xs font-bold tracking-widest uppercase hover:brightness-110 shadow-glow-red hover:shadow-lg transition-all hover:scale-105 active:scale-95"
          >
            <span>Lock In Passes</span>
            <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </a>
          <button
            onClick={() => {
              audio.playClick();
              onExploreClick();
            }}
            className="group flex items-center gap-2.5 px-5 py-3 rounded-full glass-panel border border-white/15 hover:border-rb-yellow text-white font-mono text-xs font-semibold tracking-wider uppercase hover:bg-white/10 transition-all active:scale-95"
          >
            <span>Descend</span>
            <ArrowDown className="w-3.5 h-3.5 text-rb-yellow group-hover:translate-y-0.5 transition-transform" />
          </button>
        </div>
      </div>
    </section>
  );
};
