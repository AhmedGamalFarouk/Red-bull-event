import React, { useRef, useState } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { audio } from '../utils/audio';
import { useSectionReveal, useSwapAnimation, EASE_OUT } from '../motion/reveal';

interface Athlete {
  id: string;
  name: string;
  country: string;
  image: string;
  discipline: string;
  titles: string;
  arena: string;
  bio: string;
  quote: string;
  stats: { label: string; value: string }[];
}

const ATHLETES: Athlete[] = [
  {
    id: 'nasser',
    name: 'Nasser Al-Attiyah',
    country: 'Qatar',
    image: '/nasser-al-attiyah.jpg',
    discipline: 'Dakar Rally Raid T1+',
    titles: '5x Dakar Rally Champion',
    arena: 'Giza Plateau Dune Arena',
    bio: 'The five-time Dakar champion brings his 1,050 BHP Toyota GR DKR Hilux to the Giza dune crests and leads the pack at flat-out rally speed.',
    quote: 'The Egyptian Sahara has an ancient soul. You do not fight the sand, you fly over it.',
    stats: [
      { label: 'Dakar stage wins', value: '48' },
      { label: 'Dune speed', value: '215 km/h' },
      { label: 'Suspension travel', value: '350 mm' },
    ],
  },
  {
    id: 'rhiannan',
    name: 'Rhiannan Iffland',
    country: 'Australia',
    image: '/rhiannan-iffland.jpg',
    discipline: 'Cliff Diving',
    titles: '7x World Series Champion',
    arena: 'Dahab Blue Hole',
    bio: 'The most decorated cliff diver in history launches from the 30-meter limestone rim of the Dahab Blue Hole straight into the Red Sea.',
    quote: 'Standing 30 meters above the Blue Hole, everything goes silent. You just trust your body.',
    stats: [
      { label: 'Platform height', value: '30 m' },
      { label: 'Entry speed', value: '88 km/h' },
      { label: 'Time in air', value: '2.8 s' },
    ],
  },
  {
    id: 'brandon',
    name: 'Brandon Semenuk',
    country: 'Canada',
    image: '/brandon-semenuk.jpg',
    discipline: 'Freeride Mountain Bike',
    titles: '5x Rampage Champion',
    arena: 'Sinai Colored Canyon',
    bio: 'The freerider who redefined what is possible on two wheels takes his raw line choice and style to the sandstone couloirs of South Sinai.',
    quote: 'The Sinai granite is sharp, ancient, and demands pure commitment.',
    stats: [
      { label: 'Canyon gap', value: '105 ft' },
      { label: 'Slope angle', value: '74°' },
      { label: 'X Games gold', value: '3' },
    ],
  },
  {
    id: 'james',
    name: 'James Deane',
    country: 'Ireland',
    image: '/james-deane.jpg',
    discipline: 'Twin-Turbo Drift',
    titles: '3x Formula Drift Champion',
    arena: 'New Cairo Grand Circuit',
    bio: 'The most technically gifted drifter of his generation steers a 1,250 BHP twin-turbo machine around the floodlit New Capital circuit.',
    quote: 'Inches from the wall at 160 km/h in blinding tire smoke. Pure reflex.',
    stats: [
      { label: 'Engine power', value: '1,250 BHP' },
      { label: 'Steering angle', value: '72°' },
      { label: 'Wall proximity', value: '1.5 cm' },
    ],
  },
  {
    id: 'neguin',
    name: 'Neguin',
    country: 'Brazil',
    image: '/neguin.jpg',
    discipline: 'Breaking',
    titles: 'Red Bull BC One World Champion',
    arena: 'Great Sphinx Soundstage',
    bio: 'A master of Capoeira-infused breaking, Neguin headlines the 1v1 battles at the Great Sphinx amphitheater under the desert stars.',
    quote: 'Dance is flying without an engine.',
    stats: [
      { label: 'Signature', value: 'Flares' },
      { label: 'Battle format', value: '1v1' },
      { label: 'Stage', value: 'Sphinx' },
    ],
  },
];

export const AthletesSection: React.FC = () => {
  const [selected, setSelected] = useState(0);
  const rootRef = useRef<HTMLElement>(null);
  const portraitRef = useRef<HTMLDivElement>(null);
  const prevSelected = useRef(selected);
  const current = ATHLETES[selected];

  useSectionReveal(rootRef);
  useSwapAnimation(rootRef, selected);

  // Portrait wipes in from the bottom on every athlete change
  useGSAP(
    () => {
      if (prevSelected.current === selected) return;
      prevSelected.current = selected;
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      const img = portraitRef.current?.querySelector('img');
      if (!img) return;
      gsap.fromTo(
        img,
        { clipPath: 'inset(100% 0% 0% 0%)', scale: 1.18 },
        { clipPath: 'inset(0% 0% 0% 0%)', scale: 1, duration: 1.1, ease: EASE_OUT, overwrite: true }
      );
    },
    { dependencies: [selected] }
  );

  return (
    <section
      ref={rootRef}
      id="athletes"
      className="relative min-h-[120dvh] w-full flex flex-col justify-center py-24 px-4 sm:px-10 z-20"
    >
      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
        {/* Open flight lane: the can rolls over to the left flank here */}
        <div className="hidden lg:block lg:col-span-5 min-h-[480px] pointer-events-none" aria-hidden />

        <div className="lg:col-span-7">
          <h2 data-reveal="title" className="section-title mb-5">
            Legends on <span className="text-rb-red">sacred sand.</span>
          </h2>
          <p data-reveal="up" className="text-base sm:text-lg text-rb-silver leading-relaxed max-w-[52ch] mb-10">
            World champions taking their disciplines to Egyptian sand, sea and stone.
          </p>

          <div data-reveal="up" className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8">
            {/* Portrait */}
            <div
              ref={portraitRef}
              className="md:col-span-5 relative aspect-[4/5] rounded-3xl overflow-hidden bg-rb-surface"
            >
              <img
                key={current.id}
                src={current.image}
                alt={current.name}
                className="absolute inset-0 w-full h-full object-cover object-top"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-rb-dark/85 via-transparent to-transparent" />
            </div>

            {/* Dossier */}
            <div className="md:col-span-7 flex flex-col">
              <p data-swap className="font-mono text-[11px] tracking-[0.16em] uppercase text-rb-yellow mb-3">
                {current.discipline} &middot; {current.country}
              </p>
              <h3
                data-swap
                className="font-display font-extrabold uppercase text-white text-3xl sm:text-4xl lg:text-3xl xl:text-4xl leading-[0.95] tracking-[-0.04em] mb-2 [overflow-wrap:anywhere]"
              >
                {current.name}
              </h3>
              <p data-swap className="text-sm text-rb-muted mb-5">
                {current.titles}, competing at {current.arena}
              </p>
              <p data-swap className="text-rb-silver leading-relaxed mb-6">
                {current.bio}
              </p>
              <blockquote data-swap className="border-l-2 border-rb-red pl-5">
                <p className="text-lg sm:text-xl text-white leading-snug italic">&ldquo;{current.quote}&rdquo;</p>
              </blockquote>

            </div>
          </div>

          {/* Stats span the full content column so values never collide */}
          <dl data-swap className="grid grid-cols-3 gap-4 sm:gap-8 mt-7 pt-6 border-t border-white/10">
            {current.stats.map((s) => (
              <div key={s.label} className="flex flex-col-reverse justify-end">
                <dt className="font-mono text-[10px] sm:text-[11px] uppercase tracking-[0.14em] text-rb-muted mt-2">{s.label}</dt>
                <dd className="font-display font-extrabold text-white text-base sm:text-2xl lg:text-xl xl:text-2xl tracking-[-0.03em] leading-none">
                  {s.value}
                </dd>
              </div>
            ))}
          </dl>

          {/* Roster strip */}
          <div data-reveal="up" className="grid grid-cols-5 gap-2 sm:gap-3 mt-8" role="tablist" aria-label="Athletes">
            {ATHLETES.map((a, idx) => {
              const active = idx === selected;
              return (
                <button
                  key={a.id}
                  role="tab"
                  aria-selected={active}
                  onClick={() => {
                    if (active) return;
                    audio.playClick();
                    setSelected(idx);
                  }}
                  className="group text-left"
                >
                  <span className="relative block aspect-[3/4] rounded-xl overflow-hidden bg-rb-surface">
                    <img
                      src={a.image}
                      alt=""
                      loading="lazy"
                      className={`absolute inset-0 w-full h-full object-cover object-top transition-all duration-700 ease-out-expo ${
                        active ? 'grayscale-0 scale-100' : 'grayscale opacity-50 group-hover:opacity-90 group-hover:grayscale-0 scale-105'
                      }`}
                    />
                    <span
                      className={`absolute left-0 right-0 bottom-0 h-[3px] bg-rb-red origin-left transition-transform duration-500 ease-out-expo ${
                        active ? 'scale-x-100' : 'scale-x-0'
                      }`}
                    />
                  </span>
                  <span
                    className={`hidden sm:block mt-2 text-xs font-medium truncate transition-colors ${
                      active ? 'text-white' : 'text-rb-muted group-hover:text-white'
                    }`}
                  >
                    {a.name}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
