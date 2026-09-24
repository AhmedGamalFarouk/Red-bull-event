import React from 'react';
import { FLAVORS, FlavorConfig } from './RedBullCan';
import { audio } from '../utils/audio';
import { Sparkles, Check, Flame } from 'lucide-react';

interface FlavorsSectionProps {
  activeFlavor: FlavorConfig;
  onSelectFlavor: (flavor: FlavorConfig) => void;
}

export const FlavorsSection: React.FC<FlavorsSectionProps> = ({
  activeFlavor,
  onSelectFlavor,
}) => {
  return (
    <section
      id="flavors"
      className="relative min-h-[120dvh] w-full flex flex-col justify-between py-24 px-4 sm:px-10 z-20"
    >
      {/* Top Header */}
      <div className="max-w-7xl mx-auto w-full text-center flex flex-col items-center">
        <div className="flex items-center gap-3 mb-3">
          <span className="w-8 h-0.5 bg-rb-cyan" />
          <span className="font-mono text-xs font-bold tracking-widest text-rb-cyan uppercase">
            CHAPTER 03 // THE EDITIONS
          </span>
          <span className="w-8 h-0.5 bg-rb-cyan" />
        </div>

        <h2 className="text-4xl sm:text-6xl md:text-7xl font-display font-black tracking-tight text-white uppercase leading-none mb-4">
          CHOOSE YOUR
          <span
            className="block transition-colors duration-500"
            style={{ color: activeFlavor.accentColor }}
          >
            AERODYNAMIC FUEL
          </span>
        </h2>

        <p className="font-mono text-xs sm:text-sm text-rb-silver max-w-lg">
          Click any edition to trigger real-time 3D shader morphing, dynamic studio reflections, and custom taste velocity notes.
        </p>
      </div>

      {/* Center 3D Can Stage is visual here. The can is positioned dead-center */}

      {/* Bottom Flavor Selector Dock */}
      <div className="max-w-5xl mx-auto w-full flex flex-col items-center gap-6 mt-auto">
        {/* Active Flavor Flavor Notes Pill */}
        <div className="glass-panel px-6 py-3 rounded-full border border-white/10 flex flex-wrap items-center justify-center gap-4 text-xs font-mono">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4" style={{ color: activeFlavor.accentColor }} />
            <span className="font-bold text-white uppercase">{activeFlavor.tagline}</span>
          </div>
          <div className="hidden md:flex items-center gap-3 text-rb-silver">
            {activeFlavor.tasteNotes.map((note) => (
              <span key={note} className="flex items-center gap-1.5 bg-white/5 px-2.5 py-1 rounded-full">
                <Check className="w-3 h-3 text-rb-yellow" />
                {note}
              </span>
            ))}
          </div>
        </div>

        {/* Interactive Edition Pills */}
        <div className="flex flex-wrap items-center justify-center gap-3 p-2 rounded-3xl glass-panel border border-white/10">
          {FLAVORS.map((flavor) => {
            const isSelected = activeFlavor.id === flavor.id;
            return (
              <button
                key={flavor.id}
                onClick={() => {
                  audio.playClick();
                  onSelectFlavor(flavor);
                }}
                className={`group relative flex items-center gap-3 px-5 py-3 rounded-2xl font-mono text-xs font-bold tracking-wider uppercase transition-all duration-300 ${
                  isSelected
                    ? 'text-white shadow-2xl scale-105'
                    : 'text-rb-silver hover:text-white hover:bg-white/5 opacity-70 hover:opacity-100'
                }`}
                style={{
                  backgroundColor: isSelected ? `${flavor.accentColor}25` : 'transparent',
                  borderColor: isSelected ? flavor.accentColor : 'transparent',
                  borderWidth: '1px',
                }}
              >
                {/* Color Dot Indicator */}
                <span
                  className="w-3.5 h-3.5 rounded-full transition-transform group-hover:scale-125"
                  style={{
                    backgroundColor: flavor.accentColor,
                    boxShadow: isSelected ? `0 0 15px ${flavor.accentColor}` : 'none',
                  }}
                />
                <span>{flavor.name}</span>
                {isSelected && (
                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
};
