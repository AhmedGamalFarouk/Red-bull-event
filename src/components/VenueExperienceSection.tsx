import React, { useRef } from 'react';
import { Glasses, Sparkles, Coffee, Bus } from 'lucide-react';
import { useSectionReveal } from '../motion/reveal';

const ATTRACTIONS = [
  {
    icon: Glasses,
    title: 'Dakar Hydraulic Simulator',
    desc: "A 6-axis motion rig puts you inside Nasser Al-Attiyah's Trophy Truck as it climbs the dunes.",
  },
  {
    icon: Sparkles,
    title: 'Red Bull Racing Sim Rigs',
    desc: 'Race motion simulators calibrated to every corner of the New Cairo Grand Circuit.',
  },
  {
    icon: Coffee,
    title: 'Red Bull Mixology Lab',
    desc: 'Chilled Red Bull editions mixed with Egyptian hibiscus and fresh Sinai mint.',
  },
];

export const VenueExperienceSection: React.FC = () => {
  const rootRef = useRef<HTMLElement>(null);
  useSectionReveal(rootRef);

  return (
    <section
      ref={rootRef}
      id="experience"
      className="relative min-h-[120dvh] w-full flex flex-col justify-center py-24 px-4 sm:px-10 z-20"
    >
      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
        <div className="lg:col-span-7">
          <h2 data-reveal="title" className="section-title mb-5">
            Four hubs. <span className="text-rb-red">One empire.</span>
          </h2>
          <p data-reveal="up" className="flex items-start gap-3 text-base sm:text-lg text-rb-silver leading-relaxed max-w-[52ch] mb-10">
            <Bus className="w-5 h-5 text-rb-yellow shrink-0 mt-1" aria-hidden />
            Free shuttles every 15 minutes link all four hubs to Downtown Cairo.
          </p>

          {/* Hub bento: one hero tile, two stacked tiles, one wide tile */}
          <div className="grid grid-cols-2 md:grid-cols-6 gap-3 sm:gap-4">
            {/* Sphinx Soundstage: image-led hero tile */}
            <article
              data-reveal="up"
              className="col-span-2 md:col-span-4 md:row-span-2 relative min-h-[360px] rounded-3xl overflow-hidden group"
            >
              <img
                data-parallax
                src="/neguin.jpg"
                alt="Breaking battle at the Sphinx Soundstage"
                loading="lazy"
                className="absolute inset-0 w-full h-[116%] -top-[8%] object-cover transition-transform duration-[1.2s] ease-out-expo group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-rb-dark via-rb-dark/50 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-6 sm:p-7">
                <p className="font-mono text-[11px] tracking-[0.16em] uppercase text-rb-yellow mb-2">Great Sphinx Complex, Giza</p>
                <h3 className="font-display font-extrabold uppercase text-white text-2xl sm:text-3xl tracking-[-0.03em] leading-none mb-3">
                  Sphinx Midnight Soundstage
                </h3>
                <p className="text-sm text-rb-silver leading-relaxed max-w-[42ch]">
                  Headline electronic sets with laser projection mapped onto the monuments.
                </p>
              </div>
            </article>

            {/* Red Sea Marine Basin */}
            <article
              data-reveal="up"
              className="col-span-1 md:col-span-2 relative min-h-[172px] rounded-3xl overflow-hidden p-5 bg-gradient-to-br from-rb-cyan/25 via-rb-surface to-rb-navy border border-rb-cyan/20"
            >
              <img
                src="/water_drops_3.jpg"
                alt=""
                loading="lazy"
                className="absolute inset-0 w-full h-full object-cover opacity-25 mix-blend-screen"
              />
              <div className="relative h-full flex flex-col justify-end">
                <p className="font-mono text-[10px] tracking-[0.14em] uppercase text-rb-cyan mb-1.5">Blue Hole, Dahab</p>
                <h3 className="font-display font-extrabold uppercase text-white text-base sm:text-lg leading-tight tracking-[-0.02em]">
                  Red Sea Marine Basin
                </h3>
                <p className="hidden sm:block text-xs text-rb-silver mt-1.5 leading-relaxed">Floating pontoons at water level.</p>
              </div>
            </article>

            {/* Sinai Basecamp */}
            <article
              data-reveal="up"
              className="col-span-1 md:col-span-2 relative min-h-[172px] rounded-3xl overflow-hidden p-5 bg-gradient-to-br from-rb-yellow/20 via-rb-surface to-rb-navy border border-rb-yellow/20"
            >
              <div className="relative h-full flex flex-col justify-end">
                <p className="font-mono text-[10px] tracking-[0.14em] uppercase text-rb-yellow mb-1.5">Colored Canyon, Sinai</p>
                <h3 className="font-display font-extrabold uppercase text-white text-base sm:text-lg leading-tight tracking-[-0.02em]">
                  Sinai Desert Basecamp
                </h3>
                <p className="hidden sm:block text-xs text-rb-silver mt-1.5 leading-relaxed">Sandstone terraces over the canyon gaps.</p>
              </div>
            </article>

            {/* Pyramids Dune Coliseum: wide image tile */}
            <article
              data-reveal="up"
              className="col-span-2 md:col-span-6 relative min-h-[200px] rounded-3xl overflow-hidden"
            >
              <img
                data-parallax
                src="/egypt-pyramids.jpg"
                alt="Grandstands facing the Giza pyramids"
                loading="lazy"
                className="absolute inset-0 w-full h-[130%] -top-[15%] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-rb-dark/90 via-rb-dark/50 to-transparent" />
              <div className="relative h-full min-h-[200px] flex flex-col justify-center p-6 sm:p-7 max-w-md">
                <p className="font-mono text-[11px] tracking-[0.16em] uppercase text-rb-yellow mb-2">Giza Plateau, Cairo</p>
                <h3 className="font-display font-extrabold uppercase text-white text-xl sm:text-2xl tracking-[-0.03em] leading-none mb-2">
                  Pyramids Dune Coliseum
                </h3>
                <p className="text-sm text-rb-silver leading-relaxed">
                  Shaded grandstands and air-conditioned lounges facing the Dakar dune corridor.
                </p>
              </div>
            </article>
          </div>

          {/* Energy Lab attractions: one lead card, two stacked */}
          <h3 data-reveal="up" className="font-display font-extrabold uppercase text-white text-xl sm:text-2xl tracking-[-0.03em] mt-14 mb-2">
            Inside the Energy Lab
          </h3>
          <p data-reveal="up" className="text-sm text-rb-muted mb-5">Free for every pass holder.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            {ATTRACTIONS.map((att, idx) => {
              const Icon = att.icon;
              const lead = idx === 0;
              return (
                <article
                  key={att.title}
                  data-reveal="up"
                  className={`relative rounded-3xl p-6 border transition-colors duration-500 ${
                    lead
                      ? 'sm:row-span-2 flex flex-col justify-between min-h-[240px] bg-gradient-to-br from-rb-yellow/[0.16] via-rb-surface to-rb-navy border-rb-yellow/25 hover:border-rb-yellow/50'
                      : 'bg-rb-surface/80 border-white/[0.12] hover:border-white/30'
                  }`}
                >
                  <span
                    className={`inline-flex items-center justify-center rounded-2xl text-rb-yellow bg-rb-yellow/10 ${
                      lead ? 'w-14 h-14 mb-10' : 'w-11 h-11 mb-5'
                    }`}
                  >
                    <Icon className={lead ? 'w-7 h-7' : 'w-5 h-5'} aria-hidden />
                  </span>
                  <div>
                    <h4
                      className={`font-display font-extrabold uppercase text-white tracking-[-0.02em] leading-tight mb-2 ${
                        lead ? 'text-xl sm:text-2xl' : 'text-lg'
                      }`}
                    >
                      {att.title}
                    </h4>
                    <p className="text-sm text-rb-silver leading-relaxed">{att.desc}</p>
                  </div>
                </article>
              );
            })}
          </div>
        </div>

        {/* Open lane: the can hovers high on the right in aerial observation mode */}
        <div className="hidden lg:block lg:col-span-5 min-h-[440px] pointer-events-none" aria-hidden />
      </div>
    </section>
  );
};
