import React, { useRef, useState } from 'react';
import { audio } from '../utils/audio';
import { Flame, Waves, Mountain, Gauge, Plus } from 'lucide-react';
import { useSectionReveal } from '../motion/reveal';
import { Collapse } from '../motion/Collapse';

const ARENAS = [
  {
    id: 'dune-raid',
    name: 'Pyramids Dune Raid',
    location: 'Giza Plateau, Cairo',
    icon: Flame,
    accent: 'bg-rb-red',
    image: '/egypt-pyramids.jpg',
    focus: '32% 55%',
    description:
      'Sixteen Dakar champions launch 1,050 BHP Trophy Trucks 45 meters over the dunes, in the shadow of the Great Pyramid.',
    stats: [
      { value: '1,050', unit: 'BHP', label: 'Horsepower' },
      { value: '45', unit: 'M', label: 'Air gap' },
      { value: '215', unit: 'KM/H', label: 'Dune speed' },
    ],
  },
  {
    id: 'cliff-dive',
    name: 'Red Sea Cliff Dive',
    location: 'Blue Hole, Dahab',
    icon: Waves,
    accent: 'bg-rb-cyan',
    image: '/rhiannan-iffland.jpg',
    focus: '50% 28%',
    description:
      'Sixteen elite divers leave a 30-meter limestone platform above the Dahab Blue Hole and hit the water at 88 km/h.',
    stats: [
      { value: '30', unit: 'M', label: 'Drop height' },
      { value: '88', unit: 'KM/H', label: 'Entry speed' },
      { value: '2.8', unit: 'SEC', label: 'In the air' },
    ],
  },
  {
    id: 'rampage',
    name: 'Sinai Desert Rampage',
    location: 'Colored Canyon, South Sinai',
    icon: Mountain,
    accent: 'bg-rb-yellow',
    image: '/brandon-semenuk.jpg',
    focus: '50% 32%',
    description:
      'Eighteen freeride legends drop 72-degree sandstone ridges and clear 105-foot canyon gaps with no safety nets.',
    stats: [
      { value: '105', unit: 'FT', label: 'Canyon gap' },
      { value: '72', unit: 'DEG', label: 'Slope angle' },
      { value: '18', unit: '', label: 'Freeriders' },
    ],
  },
  {
    id: 'drift',
    name: 'Capital Drift Shifters',
    location: 'New Capital Grand Circuit, Cairo',
    icon: Gauge,
    accent: 'bg-white',
    image: '/james-deane.jpg',
    focus: '50% 40%',
    description:
      'Sixteen 1,250 BHP twin-turbo cars fight tandem battles under floodlights, inches from the barriers at 160 km/h.',
    stats: [
      { value: '1,250', unit: 'BHP', label: 'Horsepower' },
      { value: '160', unit: 'KM/H', label: 'Wall speed' },
      { value: '16', unit: '', label: 'Racers' },
    ],
  },
];

export const ArenasSection: React.FC = () => {
  const [active, setActive] = useState(0);
  const rootRef = useRef<HTMLElement>(null);
  useSectionReveal(rootRef);

  return (
    <section
      ref={rootRef}
      id="arenas"
      className="relative min-h-[120dvh] w-full flex items-center py-24 px-4 sm:px-10 z-20"
    >
      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
        {/* Content column. The can flies to the right flank here. */}
        <div className="lg:col-span-7">
          <h2 data-reveal="title" className="section-title mb-5">
            Four arenas. <span className="text-rb-red">Zero compromise.</span>
          </h2>
          <p data-reveal="up" className="text-base sm:text-lg text-rb-silver leading-relaxed max-w-[52ch] mb-10">
            Desert, sea, canyon and asphalt. Every venue is a live competition floor with grandstand sightlines.
          </p>

          <ul className="border-t border-white/10">
            {ARENAS.map((arena, idx) => {
              const Icon = arena.icon;
              const open = active === idx;
              return (
                <li key={arena.id} data-reveal="up" className="relative border-b border-white/10">
                  {/* Arena colour bar marks the open row */}
                  <span
                    className={`absolute left-0 top-0 bottom-0 w-[3px] ${arena.accent} origin-top transition-transform duration-700 ease-out-expo ${
                      open ? 'scale-y-100' : 'scale-y-0'
                    }`}
                    aria-hidden
                  />
                  <button
                    onClick={() => {
                      audio.playClick();
                      setActive(idx);
                    }}
                    aria-expanded={open}
                    className="group w-full flex items-center gap-4 sm:gap-6 py-5 sm:py-6 pl-5 sm:pl-6 pr-2 text-left"
                  >
                    <Icon
                      className={`w-5 h-5 shrink-0 transition-colors duration-300 ${
                        open ? 'text-rb-yellow' : 'text-rb-muted group-hover:text-white'
                      }`}
                    />
                    <span
                      className={`flex-1 font-display font-extrabold uppercase tracking-[-0.03em] text-xl sm:text-3xl transition-colors duration-300 ${
                        open ? 'text-white' : 'text-white/55 group-hover:text-white'
                      }`}
                    >
                      {arena.name}
                    </span>
                    <span className="hidden sm:block font-mono text-[11px] tracking-wider uppercase text-rb-muted text-right">
                      {arena.location}
                    </span>
                    <Plus
                      className={`w-5 h-5 shrink-0 text-rb-silver transition-transform duration-500 ease-out-expo ${
                        open ? 'rotate-45 text-rb-red' : ''
                      }`}
                    />
                  </button>

                  <Collapse open={open}>
                    <div className="pl-5 sm:pl-6 pb-7 pr-2">
                      {/* Portrait frame so the athlete stays in shot; focal point set per photo */}
                      <div className="grid grid-cols-1 sm:grid-cols-12 gap-5 sm:gap-6 mb-6">
                        <div className="sm:col-span-5 relative aspect-[4/3] sm:aspect-[4/5] rounded-2xl overflow-hidden bg-rb-surface">
                          <img
                            data-parallax
                            src={arena.image}
                            alt={arena.name}
                            loading="lazy"
                            style={{ objectPosition: arena.focus }}
                            className="absolute inset-0 w-full h-[116%] -top-[8%] object-cover"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-rb-dark/60 via-transparent to-transparent" />
                        </div>
                        <div className="sm:col-span-7 flex flex-col justify-end">
                          <p className="sm:hidden font-mono text-[11px] tracking-wider uppercase text-rb-yellow mb-3">
                            {arena.location}
                          </p>
                          <p className="text-rb-silver leading-relaxed">{arena.description}</p>
                        </div>
                      </div>
                      <dl className="grid grid-cols-3 gap-3 sm:gap-8">
                        {arena.stats.map((s) => (
                          <div key={s.label} className="flex flex-col-reverse justify-end">
                            <dt className="font-mono text-[10px] sm:text-[11px] uppercase tracking-[0.16em] text-rb-muted mt-2">
                              {s.label}
                            </dt>
                            <dd className="font-display font-extrabold text-rb-yellow text-[1.3rem] sm:text-5xl lg:text-4xl xl:text-5xl leading-none tracking-[-0.04em] whitespace-nowrap">
                              {s.value}
                              {s.unit && (
                                <span className="font-mono font-medium text-[10px] sm:text-sm text-rb-yellow/70 tracking-wider ml-1 align-top">
                                  {s.unit}
                                </span>
                              )}
                            </dd>
                          </div>
                        ))}
                      </dl>
                    </div>
                  </Collapse>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Open flight lane for the 3D can */}
        <div className="hidden lg:block lg:col-span-5 min-h-[500px] pointer-events-none" aria-hidden />
      </div>
    </section>
  );
};
