import React, { useState } from 'react';
import { audio } from '../utils/audio';
import { Plane, Mountain, Gauge, Music, Users, Timer, Trophy, ArrowUpRight, Flame } from 'lucide-react';

export const ArenasSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState<number>(0);

  const arenas = [
    {
      id: 'dune-raid',
      name: 'PYRAMIDS DUNE RAID',
      tagline: '1,050 BHP DAKAR TROPHY TRUCKS // GIZA DUNES',
      icon: Flame,
      location: 'GIZA PLATEAU DUNE ARENA // CAIRO',
      accentColor: 'text-rb-red',
      borderColor: 'border-rb-red',
      bgGradient: 'from-rb-red/20 to-transparent',
      stats: [
        { label: 'HORSEPOWER', value: '1,050 BHP' },
        { label: 'DUNE FLIGHT GAP', value: '45 METERS' },
        { label: 'TOP DESERT SPEED', value: '215 KM/H' },
        { label: 'DRIVERS', value: '16 DAKAR CHAMPIONS' },
      ],
      description: 'Sixteen world champion Dakar drivers unleash 1,050-horsepower Trophy Trucks over razor-edge dunes directly in the shadow of the Great Pyramid of Khufu. Spectators watch from elevated stadium terraces as trucks launch 45 meters through the desert air, tearing up golden sand at over 200 km/h.',
    },
    {
      id: 'cliff-dive',
      name: 'RED SEA CLIFF DIVE',
      tagline: '30-METER ABYSS DIVE // DAHAB BLUE HOLE',
      icon: Mountain,
      location: 'DAHAB RED SEA CANYON // SINAI',
      accentColor: 'text-rb-cyan',
      borderColor: 'border-rb-cyan',
      bgGradient: 'from-rb-cyan/20 to-transparent',
      stats: [
        { label: 'DROP HEIGHT', value: '30 METERS' },
        { label: 'ENTRY SPEED', value: '88 KM/H' },
        { label: 'WATER DEPTH', value: '100+ METERS' },
        { label: 'DIVERS', value: '16 WORLD ELITES' },
      ],
      description: 'Sixteen world champions launch from a sheer 30-meter limestone platform jutting above the mythical Dahab Blue Hole. Athletes hit the cobalt abyss at 88 km/h after 2.8 seconds of acrobatic freefall.',
    },
    {
      id: 'rampage',
      name: 'SINAI DESERT RAMPAGE',
      tagline: '75-FOOT CANYON GAPS // SINAI GRANITE RIDGES',
      icon: Mountain,
      location: 'COLORED CANYON // SOUTH SINAI',
      accentColor: 'text-rb-yellow',
      borderColor: 'border-rb-yellow',
      bgGradient: 'from-rb-yellow/20 to-transparent',
      stats: [
        { label: 'VERTICAL DROP', value: '75 FEET' },
        { label: 'SLOPE ANGLE', value: '72 DEGREES' },
        { label: 'CANYON GAP', value: '105 FEET' },
        { label: 'RIDERS', value: '18 PRO FREERIDERS' },
      ],
      description: 'Eighteen freeride mountain bike legends drop down 72-degree volcanic sandstone ridges and hit 105-foot canyon gaps under raw desert heat. Unforgiving terrain with zero safety nets.',
    },
    {
      id: 'drift',
      name: 'CAPITAL DRIFT SHIFTERS',
      tagline: '1,250 BHP TWIN-TURBO SMOKE COLOSSEUM',
      icon: Gauge,
      location: 'NEW CAPITAL GRAND CIRCUIT // CAIRO',
      accentColor: 'text-white',
      borderColor: 'border-white',
      bgGradient: 'from-white/20 to-transparent',
      stats: [
        { label: 'HORSEPOWER', value: '1,250 BHP' },
        { label: 'PROXIMITY RADAR', value: '2.0 CM TO WALL' },
        { label: 'TIRE BURN RATE', value: '55 SEC / SET' },
        { label: 'DRIVERS', value: '16 APEX RACERS' },
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
      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Left Column: Arenas & Stages Interactive Showcase */}
        <div className="lg:col-span-7 flex flex-col justify-center">
          {/* Chapter Subtitle */}
          <div className="flex items-center gap-3 mb-4">
            <span className="w-8 h-0.5 bg-rb-yellow" />
            <span className="font-mono text-xs font-bold tracking-widest text-rb-yellow uppercase">
              CHAPTER 02 // BATTLEGROUNDS
            </span>
          </div>

          <h2 className="text-4xl sm:text-6xl font-display font-black tracking-tight text-white uppercase leading-none mb-6">
            FOUR ARENAS.
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-rb-red via-rb-yellow to-white">
              ZERO COMPROMISE.
            </span>
          </h2>

          {/* Arena Navigation Tabs */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-8">
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
                  className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all duration-300 ${
                    isSelected
                      ? `glass-panel ${item.borderColor} bg-rb-surface/90 shadow-lg scale-105`
                      : 'glass-panel border-white/5 opacity-60 hover:opacity-100 hover:border-white/20'
                  }`}
                >
                  <TabIcon className={`w-5 h-5 mb-1.5 ${item.accentColor}`} />
                  <span className="font-display font-bold text-xs tracking-wider text-white text-center">
                    {item.name.split(' ')[0]}
                  </span>
                  <span className="font-mono text-[9px] text-rb-muted">
                    STAGE 0{idx + 1}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Active Arena Deep Dive Card */}
          <div className={`glass-panel p-6 sm:p-8 rounded-2xl border ${current.borderColor} bg-gradient-to-br ${current.bgGradient} transition-all duration-500 shadow-2xl`}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className={`p-3 rounded-xl bg-white/10 ${current.accentColor}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-2xl sm:text-3xl font-display font-black tracking-tight text-white">
                    {current.name}
                  </h3>
                  <p className="font-mono text-xs text-rb-yellow tracking-widest uppercase">
                    {current.location}
                  </p>
                </div>
              </div>
              <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-white font-mono text-xs">
                <Trophy className="w-3.5 h-3.5 text-rb-yellow" />
                <span>CHAMPIONSHIP</span>
              </div>
            </div>

            <p className="font-mono text-xs sm:text-sm text-rb-silver mb-6 leading-relaxed">
              {current.description}
            </p>

            {/* Telemetry Metrics Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 border-t border-white/10">
              {current.stats.map((stat) => (
                <div key={stat.label} className="glass-panel p-3 rounded-xl border border-white/5">
                  <div className="font-mono text-[10px] text-rb-muted tracking-widest uppercase mb-1">
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
              <span className="font-mono text-xs text-rb-muted">
                3-Day All-Arena Access • Shuttles & Grandstand Included
              </span>
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

        {/* Right Column: Reserved for 3D Can in dynamic flight angle on the right */}
        <div className="hidden lg:flex lg:col-span-5 justify-end items-center pointer-events-none relative min-h-[500px]" />
      </div>
    </section>
  );
};
