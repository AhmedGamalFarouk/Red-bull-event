import React, { useState } from 'react';
import { audio } from '../utils/audio';
import { Trophy, Compass, Flame, Shield, ArrowUpRight, Award, Zap, Quote, Activity, Eye } from 'lucide-react';

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
  image: string;
  carNumber?: string;
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
      carNumber: 'CAR #301 // TOYOTA GR DKR',
      titles: '5X DAKAR RALLY CHAMPION',
      stats: [
        { label: 'DAKAR STAGES', value: '48 WINS' },
        { label: 'DUNE ASCENT', value: '215 KM/H' },
        { label: 'SUSPENSION', value: '350 MM' },
      ],
      bio: 'A living legend in desert motorsport and 5-time Dakar Rally champion. Nasser commands his 1,050 BHP Toyota GR DKR Hilux T1+ machine across the most brutal desert dunes on earth. Over the Giza Plateau dune crests, he leads the pack at flat-out rally speeds.',
      quote: 'Reading desert dunes at over 200 km/h requires absolute instinct. The Egyptian Sahara has an ancient soul—you do not fight the sand, you fly over it.',
      arena: 'GIZA PLATEAU DUNE ARENA',
      color: 'text-rb-red',
    },
    {
      id: 'rhiannan',
      name: 'RHIANNAN IFFLAND',
      country: 'AUSTRALIA',
      flag: '🇦🇺',
      image: '/rhiannan-iffland.jpg',
      discipline: 'CLIFF DIVING HIGH IMPACT',
      carNumber: 'DIVER #01 // RED BULL CLIFF',
      titles: '7X WORLD SERIES CHAMPION',
      stats: [
        { label: 'CLIFF HEIGHT', value: '30 METERS' },
        { label: 'ENTRY VELOCITY', value: '88 KM/H' },
        { label: 'TIME IN AIR', value: '2.8 SECONDS' },
      ],
      bio: 'The undisputed queen of cliff diving in world history. Rhiannan has conquered cliffs from the Azores to Polignano. In Egypt, she launches from the 30-meter limestone rim of the Dahab Blue Hole directly into the Red Sea abyss.',
      quote: 'When you stand 30 meters above the Blue Hole looking down at the cobalt reef, everything goes silent. You just trust your body.',
      arena: 'DAHAB BLUE HOLE ABYSS',
      color: 'text-rb-cyan',
    },
    {
      id: 'brandon',
      name: 'BRANDON SEMENUK',
      country: 'CANADA',
      flag: '🇨🇦',
      image: '/brandon-semenuk.jpg',
      discipline: 'FREERIDE MOUNTAIN BIKE',
      carNumber: 'RIDER #07 // TREK C3',
      titles: '5X RAMPAGE CHAMPION',
      stats: [
        { label: 'CANYON GAP', value: '105 FEET' },
        { label: 'VERTICAL ANGLE', value: '74 DEGREES' },
        { label: 'X-GAMES', value: '3X GOLD' },
      ],
      bio: 'A visionary freerider and rally driver who redefined what is possible on two wheels. Brandon brings his signature raw line choices, cork 720s, and effortless style to the unforgiving sandstone couloirs of the South Sinai Colored Canyon.',
      quote: 'The Sinai granite is unlike anything in Utah or Canada. It is sharp, ancient, and demands pure commitment.',
      arena: 'SINAI COLORED CANYON',
      color: 'text-rb-yellow',
    },
    {
      id: 'james',
      name: 'JAMES DEANE',
      country: 'IRELAND',
      flag: '🇮🇪',
      image: '/james-deane.jpg',
      discipline: 'TWIN-TURBO DRIFT APEX',
      carNumber: 'CAR #130 // 1,250 BHP MUSTANG',
      titles: '3X FORMULA DRIFT CHAMPION',
      stats: [
        { label: 'ENGINE POWER', value: '1,250 BHP' },
        { label: 'STEER ANGLE', value: '72 DEGREES' },
        { label: 'WALL PROXIMITY', value: '1.5 CM' },
      ],
      bio: 'Widely regarded as the most technically gifted drift driver in motorsport history. Deane commands his 1,250 BHP twin-turbo machine through Cairo’s New Administrative Capital floodlit mega-circuit with millimetric precision.',
      quote: 'In twin-tandem drift battles, you are inches away from carbon walls at 160 km/h in blinding tire smoke. Pure reflex.',
      arena: 'NEW CAIRO GRAND CIRCUIT',
      color: 'text-white',
    },
    {
      id: 'neguin',
      name: 'NEGUIN',
      country: 'BRAZIL',
      flag: '🇧🇷',
      image: '/neguin.jpg',
      discipline: 'BREAKDANCE & ACROBATICS',
      carNumber: 'B-BOY #01 // BC ONE ALL STARS',
      titles: 'RED BULL BC ONE WORLD CHAMPION',
      stats: [
        { label: 'AERIAL ROTATIONS', value: '12 FLARES' },
        { label: 'STYLE FUSION', value: 'CAPOEIRA + BB' },
        { label: 'STAGE PRESENCE', value: 'GLOBAL ICON' },
      ],
      bio: 'A master of Capoeira-infused B-Boying, Neguin merges death-defying gravity-free flips with infectious rhythm. Headlining the 1v1 battles at the Great Sphinx amphitheater beneath historic desert stars.',
      quote: 'Dance is flying without an engine. We take the energy of this land and turn it into kinetic art.',
      arena: 'GREAT SPHINX SOUNDSTAGE',
      color: 'text-rb-red',
    },
  ];

  const current = athletes[selectedAthlete];

  return (
    <section
      id="athletes"
      className="relative min-h-[120dvh] w-full flex flex-col justify-center py-24 px-4 sm:px-10 z-20"
    >
      <div className="max-w-7xl mx-auto w-full">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-8">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <span className="w-8 h-0.5 bg-rb-red" />
              <span className="font-mono text-xs font-bold tracking-widest text-rb-red uppercase">
                CHAPTER 02 // APEX ROSTER
              </span>
            </div>
            <h2 className="text-4xl sm:text-6xl font-display font-black tracking-tight text-white uppercase leading-none">
              LEGENDS ON
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-rb-red via-rb-yellow to-white">
                SACRED SAND
              </span>
            </h2>
          </div>

          <div className="flex flex-col sm:items-end font-mono text-xs text-rb-silver max-w-sm">
            <span className="text-rb-yellow font-bold uppercase tracking-wider mb-1">
              28 WORLD TITLISTS CONVERGING
            </span>
            <p className="text-rb-muted text-left sm:text-right">
              World champions performing unprecedented stunts across Egyptian airspace and marine reefs.
            </p>
          </div>
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
                className={`relative rounded-2xl overflow-hidden border transition-all duration-300 text-left p-3.5 flex flex-col justify-between min-h-[120px] group ${
                  isSelected
                    ? 'border-rb-red bg-rb-surface/95 shadow-glow-red scale-[1.02] ring-1 ring-rb-red'
                    : 'border-white/10 glass-panel opacity-75 hover:opacity-100 hover:border-white/30'
                }`}
              >
                <div className="absolute inset-0 z-0 overflow-hidden">
                  <img
                    src={ath.image}
                    alt={ath.name}
                    className="w-full h-full object-cover object-top opacity-30 group-hover:opacity-45 group-hover:scale-105 transition-all duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-rb-dark via-rb-dark/80 to-rb-dark/40" />
                </div>

                <div className="relative z-10 flex items-center justify-between w-full mb-2">
                  <div className="flex items-center gap-2">
                    <img
                      src={ath.image}
                      alt={ath.name}
                      className="w-7 h-7 rounded-full object-cover object-top border-2 border-rb-yellow/80 shadow-md"
                    />
                    <span className="text-xs font-mono font-bold text-rb-silver">{ath.flag}</span>
                  </div>
                  <span className="font-mono text-[9px] font-bold text-rb-yellow px-1.5 py-0.5 rounded bg-black/60 backdrop-blur-md uppercase tracking-widest border border-white/10">
                    #{idx + 1}
                  </span>
                </div>

                <div className="relative z-10">
                  <div className="font-display font-black text-xs text-white leading-tight line-clamp-1 group-hover:text-rb-yellow transition-colors">
                    {ath.name}
                  </div>
                  <span className="font-mono text-[9px] text-rb-silver/80 mt-0.5 block truncate">
                    {ath.discipline}
                  </span>
                </div>

                {isSelected && (
                  <span className="absolute bottom-0 left-2 right-2 h-0.5 bg-gradient-to-r from-transparent via-rb-red to-transparent z-10" />
                )}
              </button>
            );
          })}
        </div>

        {/* 
          Asymmetric Stage Grid:
          - Left (lg:col-span-5): Reserved open flight channel for the 3D Can in inverted roll angle
          - Right (lg:col-span-7): Full athlete dossier card (photo + bio + quotes + stats)
        */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Column: Reserved open 3D stage for the can */}
          <div className="hidden lg:flex lg:col-span-5 min-h-[480px] pointer-events-none relative" />

          {/* Right Column: Complete Athlete Dossier Card */}
          <div className="lg:col-span-7 glass-panel-accent p-6 sm:p-8 rounded-3xl border border-white/20 shadow-2xl relative overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
              {/* Photo Card */}
              <div className="md:col-span-5 relative rounded-2xl overflow-hidden min-h-[320px] sm:min-h-[380px] group shadow-xl border border-white/10">
                <img
                  src={current.image}
                  alt={current.name}
                  className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-rb-dark via-rb-dark/40 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-b from-rb-dark/70 via-transparent to-transparent" />

                <div className="absolute top-3 left-3 right-3 flex items-center justify-between text-[10px] font-mono">
                  <span className="px-2.5 py-1 rounded-full bg-black/75 backdrop-blur-md text-rb-yellow font-bold border border-white/10">
                    {current.carNumber || 'RED BULL'}
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-rb-red/90 text-white font-bold">
                    {current.flag}
                  </span>
                </div>

                <div className="absolute bottom-3 left-3 right-3 text-center">
                  <span className="font-mono text-[9px] text-rb-yellow font-bold uppercase tracking-wider block mb-0.5">
                    {current.titles}
                  </span>
                  <span className="font-display font-black text-sm text-white block">
                    {current.discipline}
                  </span>
                </div>
              </div>

              {/* Bio, Quote & Telemetry Stats */}
              <div className="md:col-span-7 flex flex-col justify-between">
                <div>
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-white/10 text-white font-mono text-[9px] uppercase font-bold">
                      {current.country}
                    </span>
                    <span className="text-[10px] font-mono text-rb-yellow uppercase">
                      {current.arena}
                    </span>
                  </div>

                  <h3 className="text-2xl sm:text-3xl font-display font-black text-white uppercase tracking-tight mb-3 leading-none">
                    {current.name}
                  </h3>

                  <p className="font-mono text-xs text-rb-silver leading-relaxed mb-4">
                    {current.bio}
                  </p>

                  <blockquote className="relative p-3 rounded-xl bg-white/5 border-l-2 border-rb-yellow font-mono text-[11px] text-white/90 italic mb-4 pl-4">
                    <Quote className="w-3.5 h-3.5 text-rb-yellow/40 absolute -top-1.5 left-1.5" />
                    "{current.quote}"
                  </blockquote>
                </div>

                <div className="grid grid-cols-3 gap-2 pt-3 border-t border-white/10">
                  {current.stats.map((s) => (
                    <div key={s.label} className="p-2 rounded-lg bg-rb-dark/60 border border-white/5 text-center">
                      <div className="font-mono text-[8px] text-rb-muted uppercase tracking-wider mb-0.5">
                        {s.label}
                      </div>
                      <div className="font-display font-black text-xs text-white">
                        {s.value}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-4 pt-3 border-t border-white/10 flex justify-end">
                  <a
                    href="#tickets"
                    onClick={() => audio.playClick()}
                    className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-rb-red hover:bg-rb-redGlow text-white font-mono text-xs uppercase tracking-wider font-bold shadow-glow-red transition-all hover:scale-105 active:scale-95"
                  >
                    <span>MEET AT PADDOCK</span>
                    <ArrowUpRight className="w-3.5 h-3.5 text-rb-yellow" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
