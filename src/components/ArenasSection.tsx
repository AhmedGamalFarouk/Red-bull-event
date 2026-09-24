import React, { useState } from 'react';
import { audio } from '../utils/audio';
import { Mountain, Gauge, ArrowUpRight, Flame, Compass, Wind, ShieldAlert, Waves } from 'lucide-react';

export const ArenasSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState<number>(0);

  const arenas = [
    {
      id: 'dune-raid',
      name: 'PYRAMIDS DUNE RAID',
      tagline: '1,050 BHP DAKAR TROPHY TRUCKS // GIZA DUNES',
      icon: Flame,
      location: 'GIZA PLATEAU // CAIRO',
      terrain: 'RAZOR DUNE CRESTS',
      coordinates: '29.9792° N, 31.1342° E',
      accentColor: 'text-rb-red',
      borderColor: 'border-rb-red/50',
      activeBorder: 'border-rb-red',
      bgGradient: 'from-rb-red/20 via-rb-surface/90 to-rb-surface',
      stats: [
        { label: 'HORSEPOWER', value: '1,050 BHP' },
        { label: 'AIR FLIGHT GAP', value: '45 METERS' },
        { label: 'DESERT SPEED', value: '215 KM/H' },
        { label: 'ROSTER', value: '16 CHAMPIONS' },
      ],
      description: 'Sixteen world champion Dakar drivers unleash 1,050-horsepower Trophy Trucks over razor-edge dunes directly in the shadow of the Great Pyramid of Khufu. Spectators watch from elevated stadium terraces as trucks launch 45 meters through the desert air.',
    },
    {
      id: 'cliff-dive',
      name: 'RED SEA CLIFF DIVE',
      tagline: '30-METER ABYSS DIVE // DAHAB BLUE HOLE',
      icon: Waves,
      location: 'DAHAB BLUE HOLE // SINAI',
      terrain: 'SHEER LIMESTONE CHASM',
      coordinates: '28.5722° N, 34.5375° E',
      accentColor: 'text-rb-cyan',
      borderColor: 'border-rb-cyan/50',
      activeBorder: 'border-rb-cyan',
      bgGradient: 'from-rb-cyan/20 via-rb-surface/90 to-rb-surface',
      stats: [
        { label: 'DROP HEIGHT', value: '30 METERS' },
        { label: 'ENTRY SPEED', value: '88 KM/H' },
        { label: 'WATER DEPTH', value: '100+ METERS' },
        { label: 'ROSTER', value: '16 WORLD ELITES' },
      ],
      description: 'Sixteen world champions launch from a sheer 30-meter limestone platform jutting above the mythical Dahab Blue Hole. Athletes hit the cobalt abyss at 88 km/h after 2.8 seconds of acrobatic freefall.',
    },
    {
      id: 'rampage',
      name: 'SINAI DESERT RAMPAGE',
      tagline: '75-FOOT CANYON GAPS // SINAI GRANITE RIDGES',
      icon: Mountain,
      location: 'COLORED CANYON // SOUTH SINAI',
      terrain: 'VOLCANIC SANDSTONE COULOIR',
      coordinates: '29.0435° N, 34.7891° E',
      accentColor: 'text-rb-yellow',
      borderColor: 'border-rb-yellow/50',
      activeBorder: 'border-rb-yellow',
      bgGradient: 'from-rb-yellow/20 via-rb-surface/90 to-rb-surface',
      stats: [
        { label: 'VERTICAL DROP', value: '75 FEET' },
        { label: 'SLOPE ANGLE', value: '72 DEGREES' },
        { label: 'CANYON GAP', value: '105 FEET' },
        { label: 'ROSTER', value: '18 FREERIDERS' },
      ],
      description: 'Eighteen freeride mountain bike legends drop down 72-degree volcanic sandstone ridges and hit 105-foot canyon gaps under raw desert heat. Unforgiving terrain with zero safety nets.',
    },
    {
      id: 'drift',
      name: 'CAPITAL DRIFT SHIFTERS',
      tagline: '1,250 BHP TWIN-TURBO SMOKE COLOSSEUM',
      icon: Gauge,
      location: 'NEW CAPITAL GRAND CIRCUIT // CAIRO',
      terrain: 'FLOODLIT ASPHALT COLOSSEUM',
      coordinates: '30.0131° N, 31.7456° E',
      accentColor: 'text-white',
      borderColor: 'border-white/50',
      activeBorder: 'border-white',
      bgGradient: 'from-white/15 via-rb-surface/90 to-rb-surface',
      stats: [
        { label: 'HORSEPOWER', value: '1,250 BHP' },
        { label: 'WALL PROXIMITY', value: '2.0 CM' },
        { label: 'TIRE BURN RATE', value: '55 SEC / SET' },
        { label: 'ROSTER', value: '16 RACERS' },
      ],
      description: 'Sixteen 1,250-horsepower twin-turbo drift monsters wage tandem battles through an illuminated hyper-modern arena in Egypt’s New Capital, clipping concrete barriers at 160 km/h in blinding tire smoke.',
    },
  ];

  const current = arenas[activeTab];
  const Icon = current.icon;

  return (
    <section
      id="arenas"
      className="relative min-h-[120dvh] w-full flex items-center py-24 px-4 sm:px-10 z-20"
    >
      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
        {/* Left Column: Arenas & Stages Interactive Telemetry (Can sweeps to the Right) */}
        <div className="lg:col-span-7 flex flex-col justify-center">
          {/* Chapter Subtitle & Telemetry Header */}
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <div className="flex items-center gap-3">
              <span className="w-8 h-0.5 bg-rb-yellow" />
              <span className="font-mono text-xs font-bold tracking-widest text-rb-yellow uppercase">
                CHAPTER 01 // BATTLEGROUNDS
              </span>
            </div>
            <span className="font-mono text-[10px] text-rb-muted uppercase tracking-widest px-2.5 py-1 rounded bg-white/5 border border-white/10">
              STAGE 0{activeTab + 1} OF 04
            </span>
          </div>

          <h2 className="text-4xl sm:text-6xl font-display font-black tracking-tight text-white uppercase leading-none mb-6">
            FOUR ARENAS.
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-rb-red via-rb-yellow to-white">
              ZERO COMPROMISE.
            </span>
          </h2>

          {/* Arena Selector Tabs */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mb-6">
            {arenas.map((item, idx) => {
              const TabIcon = item.icon;
              const isSelected = activeTab === idx;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    audio.playClick();
                    setActiveTab(idx);
                  }}
                  className={`group relative flex flex-col items-start p-3.5 rounded-xl border text-left transition-all duration-300 ${
                    isSelected
                      ? `glass-panel ${item.activeBorder} bg-rb-surface/95 shadow-xl scale-[1.02]`
                      : 'glass-panel border-white/5 opacity-70 hover:opacity-100 hover:border-white/20'
                  }`}
                >
                  <div className="flex items-center justify-between w-full mb-2">
                    <TabIcon className={`w-4 h-4 ${item.accentColor}`} />
                    <span className="font-mono text-[9px] font-bold text-rb-muted">
                      0{idx + 1}
                    </span>
                  </div>
                  <span className="font-display font-bold text-xs tracking-wider text-white line-clamp-1">
                    {item.name.split(' ')[0]}
                  </span>
                  <span className="font-mono text-[9px] text-rb-muted truncate w-full mt-0.5">
                    {item.location.split('//')[0].trim()}
                  </span>

                  {isSelected && (
                    <span className="absolute bottom-0 left-3 right-3 h-0.5 bg-gradient-to-r from-transparent via-rb-yellow to-transparent" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Active Arena Dossier Card */}
          <div className={`glass-panel p-6 sm:p-8 rounded-2xl border ${current.borderColor} bg-gradient-to-br ${current.bgGradient} transition-all duration-500 shadow-2xl relative overflow-hidden`}>
            {/* Top metadata row */}
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-4 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className={`p-3 rounded-xl bg-white/10 ${current.accentColor} shadow-inner`}>
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-2xl sm:text-3xl font-display font-black tracking-tight text-white">
                    {current.name}
                  </h3>
                  <div className="flex items-center gap-2 mt-1">
                    <Compass className="w-3 h-3 text-rb-yellow" />
                    <p className="font-mono text-xs text-rb-yellow tracking-wider uppercase">
                      {current.location}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col items-end font-mono text-[10px] text-rb-silver">
                <span className="text-rb-muted">TERRAIN MATRIX:</span>
                <span className="font-bold text-white uppercase">{current.terrain}</span>
              </div>
            </div>

            <p className="font-mono text-xs sm:text-sm text-rb-silver mb-6 leading-relaxed">
              {current.description}
            </p>

            {/* Telemetry Metrics Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
              {current.stats.map((stat) => (
                <div key={stat.label} className="glass-panel p-3 rounded-xl border border-white/5 bg-rb-dark/40">
                  <div className="font-mono text-[9px] text-rb-muted tracking-widest uppercase mb-1">
                    {stat.label}
                  </div>
                  <div className="font-display font-black text-sm sm:text-base text-white">
                    {stat.value}
                  </div>
                </div>
              ))}
            </div>

            {/* Direct Ticket Conversion Row */}
            <div className="mt-6 flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-white/10">
              <div className="flex items-center gap-2 font-mono text-xs text-rb-muted">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span>3-Day All-Arena Access • Shuttles & Grandstand Included</span>
              </div>
              <a
                href="#tickets"
                onClick={() => audio.playClick()}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white text-rb-dark font-mono text-xs font-bold tracking-wider uppercase hover:bg-rb-yellow hover:scale-105 active:scale-95 transition-all shadow-md shadow-black/20"
              >
                <span>Lock In Arena Pass</span>
                <ArrowUpRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>

        {/* Right Column: Reserved negative space for 3D Can in dynamic flight angle */}
        <div className="hidden lg:flex lg:col-span-5 justify-end items-center pointer-events-none relative min-h-[500px]" />
      </div>
    </section>
  );
};
