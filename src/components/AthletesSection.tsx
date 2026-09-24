import React, { useState } from 'react';
import { audio } from '../utils/audio';
import { Trophy, Compass, Flame, Shield, ArrowUpRight, Award, Zap } from 'lucide-react';

interface Athlete {
  id: string;
  name: string;
  country: string;
  flag: string;
  discipline: string;
  titles: string;
  stats: { label: string; value: string }[];
  bio: string;
  quote: string;
  arena: string;
  color: string;
  image?: string;
}

export const AthletesSection: React.FC = () => {
  const [selectedAthlete, setSelectedAthlete] = useState<number>(0);

  const athletes: Athlete[] = [
    {
      id: 'nasser',
      name: 'NASSER AL-ATTIYAH',
      country: 'QATAR',
      flag: '🇶🇦',
      image: '/nasser-al-attiyah.jpg',
      discipline: 'DAKAR RALLY RAID T1+',
      titles: '5X DAKAR RALLY CHAMPION',
      stats: [
        { label: 'DAKAR STAGE WINS', value: '48 STAGES' },
        { label: 'DUNE ASCENT SPEED', value: '215 KM/H' },
        { label: 'SUSPENSION TRAVEL', value: '350 MM' },
      ],
      bio: 'A living legend in desert motorsport and 5-time Dakar Rally champion. Nasser commands his 1,050 BHP Toyota GR DKR Hilux T1+ machine across the most brutal desert dunes on earth. Over the Giza Plateau dune crests, he leads the pack at flat-out rally speeds.',
      quote: '"Reading desert dunes at over 200 km/h requires absolute instinct. The Egyptian Sahara has an ancient soul—you do not fight the sand, you fly over it."',
      arena: 'GIZA PLATEAU DUNE ARENA',
      color: 'text-rb-red',
    },
    {
      id: 'rhiannan',
      name: 'RHIANNAN IFFLAND',
      country: 'AUSTRALIA',
      flag: '🇦🇺',
      discipline: 'CLIFF DIVING HIGH IMPACT',
      titles: '7X WORLD SERIES CHAMPION',
      stats: [
        { label: 'CLIFF HEIGHT', value: '30 METERS' },
        { label: 'ENTRY VELOCITY', value: '88 KM/H' },
        { label: 'TIME IN AIR', value: '2.8 SECONDS' },
      ],
      bio: 'The undisputed queen of cliff diving in world history. Rhiannan has conquered cliffs from the Azores to Polignano. In Egypt, she launches from the 30-meter limestone rim of the Dahab Blue Hole directly into the Red Sea abyss.',
      quote: '"When you stand 30 meters above the Blue Hole looking down at the cobalt reef, everything goes silent. You just trust your body."',
      arena: 'DAHAB BLUE HOLE ABYSS',
      color: 'text-rb-cyan',
    },
    {
      id: 'brandon',
      name: 'BRANDON SEMENUK',
      country: 'CANADA',
      flag: '🇨🇦',
      discipline: 'FREERIDE MOUNTAIN BIKE',
      titles: '5X RAMPAGE CHAMPION',
      stats: [
        { label: 'CANYON GAP JUMP', value: '105 FEET' },
        { label: 'VERTICAL ANGLE', value: '74 DEGREES' },
        { label: 'X-GAMES MEDALS', value: '3X GOLD' },
      ],
      bio: 'A visionary freerider and rally driver who redefined what is possible on two wheels. Brandon brings his signature raw line choices, cork 720s, and effortless style to the unforgiving sandstone couloirs of the South Sinai Colored Canyon.',
      quote: '"The Sinai granite is unlike anything in Utah or Canada. It is sharp, ancient, and demands pure commitment."',
      arena: 'SINAI COLORED CANYON',
      color: 'text-rb-yellow',
    },
    {
      id: 'james',
      name: 'JAMES DEANE',
      country: 'IRELAND',
      flag: '🇮🇪',
      discipline: 'TWIN-TURBO DRIFT APEX',
      titles: '3X FORMULA DRIFT CHAMPION',
      stats: [
        { label: 'ENGINE HORSEPOWER', value: '1,250 BHP' },
        { label: 'STEERING ANGLE', value: '72 DEGREES' },
        { label: 'APEX PROXIMITY', value: '1.5 CM' },
      ],
      bio: 'Widely regarded as the most technically gifted drift driver in motorsport history. Deane commands his 1,250 BHP twin-turbo machine through Cairo’s New Administrative Capital floodlit mega-circuit with millimetric precision.',
      quote: '"In twin-tandem drift battles, you are inches away from carbon walls at 160 km/h in blinding tire smoke. Pure reflex."',
      arena: 'NEW CAIRO GRAND CIRCUIT',
      color: 'text-white',
    },
    {
      id: 'neguin',
      name: 'NEGUIN',
      country: 'BRAZIL',
      flag: '🇧🇷',
      discipline: 'BREAKDANCE & ACROBATICS',
      titles: 'RED BULL BC ONE WORLD CHAMPION',
      stats: [
        { label: 'AERIAL ROTATIONS', value: '12 AIR FLARES' },
        { label: 'STYLE FUSION', value: 'CAPOEIRA + BREAKING' },
        { label: 'STAGE PRESENCE', value: 'GLOBAL LEGEND' },
      ],
      bio: 'A master of Capoeira-infused B-Boying, Neguin merges death-defying gravity-free flips with infectious rhythm. Headlining the 1v1 battles at the Great Sphinx amphitheater beneath historic desert stars.',
      quote: '"Dance is flying without an engine. We take the energy of this land and turn it into kinetic art."',
      arena: 'GREAT SPHINX SOUNDSTAGE',
      color: 'text-rb-red',
    },
  ];

  const current = athletes[selectedAthlete];

  return (
    <section
      id="athletes"
      className="relative min-h-screen w-full flex flex-col justify-center py-24 px-4 sm:px-10 z-20"
    >
      <div className="max-w-7xl mx-auto w-full">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-12">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <span className="w-8 h-0.5 bg-rb-red" />
              <span className="font-mono text-xs font-bold tracking-widest text-rb-red uppercase">
                WORLD ROSTER // APEX ATHLETES
              </span>
            </div>
            <h2 className="text-4xl sm:text-6xl font-display font-black tracking-tight text-white uppercase leading-none">
              LEGENDS ON
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-rb-red via-rb-yellow to-white">
                SACRED SAND
              </span>
            </h2>
          </div>

          <p className="font-mono text-xs text-rb-silver max-w-md">
            World champions and X-Games gold medalists converging in Egypt for unprecedented stunts in historic airspace and deep coral waters.
          </p>
        </div>

        {/* Athlete selector row */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-8">
          {athletes.map((ath, idx) => {
            const isSelected = selectedAthlete === idx;
            return (
              <button
                key={ath.id}
                onClick={() => {
                  audio.playClick();
                  setSelectedAthlete(idx);
                }}
                className={`p-4 rounded-2xl glass-panel border transition-all duration-300 text-left flex flex-col justify-between ${
                  isSelected
                    ? 'border-rb-red bg-rb-surface/90 shadow-glow-red scale-[1.03]'
                    : 'border-white/10 opacity-70 hover:opacity-100 hover:border-white/30'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1.5">
                    {ath.image ? (
                      <img
                        src={ath.image}
                        alt={ath.name}
                        className="w-6 h-6 rounded-full object-cover object-top border border-rb-yellow/60 shadow-sm"
                      />
                    ) : (
                      <span className="text-base">{ath.flag}</span>
                    )}
                    <span className="text-xs">{ath.flag}</span>
                  </div>
                  <span className="font-mono text-[9px] text-rb-muted uppercase tracking-widest">
                    #{idx + 1}
                  </span>
                </div>
                <div className="font-display font-black text-xs sm:text-sm text-white leading-tight">
                  {ath.name}
                </div>
                <span className="font-mono text-[9px] text-rb-yellow mt-1 truncate">
                  {ath.discipline}
                </span>
              </button>
            );
          })}
        </div>

        {/* Selected Athlete Feature Card */}
        <div className="glass-panel-accent p-6 sm:p-10 rounded-3xl border border-white/20 shadow-2xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 flex flex-col justify-between">
            <div>
              <div className="flex flex-wrap items-center gap-3 mb-3">
                <span className="px-3 py-1 rounded-full bg-white/10 text-white font-mono text-[10px] tracking-widest uppercase flex items-center gap-1.5">
                  <span>{current.flag}</span>
                  <span>{current.country}</span>
                </span>
                <span className="px-3 py-1 rounded-full bg-rb-red/20 text-rb-red font-mono text-[10px] font-bold tracking-widest uppercase">
                  {current.titles}
                </span>
                <span className="text-xs font-mono text-rb-muted">
                  STAGE: {current.arena}
                </span>
              </div>

              <h3 className="text-3xl sm:text-5xl font-display font-black text-white uppercase tracking-tight mb-4">
                {current.name}
              </h3>

              <p className="font-mono text-xs sm:text-sm text-rb-silver leading-relaxed mb-6">
                {current.bio}
              </p>

              {/* Quote block */}
              <blockquote className="p-4 rounded-xl bg-white/5 border-l-2 border-rb-yellow font-mono text-xs text-white/90 italic mb-8">
                {current.quote}
              </blockquote>
            </div>

            {/* Performance telemetry stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 border-t border-white/10">
              {current.stats.map((s) => (
                <div key={s.label} className="glass-panel p-3 rounded-xl border border-white/5">
                  <div className="font-mono text-[9px] text-rb-muted tracking-widest uppercase mb-1">
                    {s.label}
                  </div>
                  <div className="font-display font-black text-sm text-white">
                    {s.value}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Visual Athlete Card / Badge */}
          <div className="lg:col-span-5 flex flex-col items-center justify-between min-h-[380px] sm:min-h-[440px] rounded-2xl bg-gradient-to-b from-white/5 to-transparent border border-white/10 text-center relative overflow-hidden group">
            {current.image ? (
              <>
                {/* Real Athlete Photo */}
                <div className="absolute inset-0 z-0">
                  <img
                    src={current.image}
                    alt={current.name}
                    className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                  />
                  {/* Atmospheric contrast gradients */}
                  <div className="absolute inset-0 bg-gradient-to-t from-rb-dark via-rb-dark/40 to-transparent" />
                  <div className="absolute inset-0 bg-gradient-to-b from-rb-dark/70 via-transparent to-transparent" />
                  <div className="absolute inset-0 ring-1 ring-inset ring-white/15 rounded-2xl pointer-events-none" />
                </div>

                {/* Top Badge Overlay */}
                <div className="relative z-10 w-full p-4 flex items-center justify-between">
                  <span className="px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/15 text-[10px] font-mono text-rb-yellow font-bold uppercase tracking-widest flex items-center gap-1.5 shadow-sm">
                    <span className="w-1.5 h-1.5 rounded-full bg-rb-red animate-pulse" />
                    <span>CAR #301 // RED BULL</span>
                  </span>
                  <span className="px-3 py-1 rounded-full bg-rb-red/80 backdrop-blur-md text-[10px] font-mono text-white font-bold tracking-widest uppercase shadow-sm">
                    5X DAKAR
                  </span>
                </div>

                {/* Bottom Info Overlay */}
                <div className="relative z-10 w-full p-6 text-center flex flex-col items-center">
                  <div className="font-mono text-[10px] text-rb-yellow font-bold tracking-widest uppercase mb-1 drop-shadow-md">
                    OFFICIAL RED BULL ATHLETE
                  </div>
                  <div className="text-xl sm:text-2xl font-display font-black text-white mb-1 drop-shadow-lg">
                    {current.discipline}
                  </div>
                  <p className="font-mono text-xs text-rb-silver max-w-xs mb-5 drop-shadow-md">
                    Leading the Dakar Trophy Trucks raid across the Giza Plateau dune crests.
                  </p>

                  <a
                    href="#tickets"
                    onClick={() => audio.playClick()}
                    className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-rb-red hover:bg-rb-redGlow text-white font-mono text-xs uppercase tracking-wider font-bold shadow-glow-red transition-all hover:scale-105 active:scale-95 border border-white/20"
                  >
                    <span>MEET AT VIP PADDOCK</span>
                    <ArrowUpRight className="w-3.5 h-3.5 text-rb-yellow" />
                  </a>
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center p-8 my-auto w-full">
                <div className="w-24 h-24 rounded-full bg-rb-red/20 border-2 border-rb-yellow/40 flex items-center justify-center text-3xl mb-4 shadow-glow-yellow">
                  <Trophy className="w-12 h-12 text-rb-yellow" />
                </div>

                <div className="font-mono text-[10px] text-rb-yellow font-bold tracking-widest uppercase mb-1">
                  OFFICIAL RED BULL ATHLETE
                </div>
                <div className="text-xl font-display font-black text-white mb-2">
                  {current.discipline}
                </div>
                <p className="font-mono text-xs text-rb-muted max-w-xs mb-6">
                  Confirmed for live qualifying heats and medal finals at {current.arena}.
                </p>

                <a
                  href="#tickets"
                  onClick={() => audio.playClick()}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white font-mono text-xs uppercase tracking-wider transition-colors"
                >
                  <span>MEET AT VIP PADDOCK</span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-rb-yellow" />
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
