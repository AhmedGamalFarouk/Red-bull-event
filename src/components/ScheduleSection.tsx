import React, { useRef, useState } from 'react';
import { audio } from '../utils/audio';
import { useSectionReveal, useSwapAnimation } from '../motion/reveal';

const DAYS = [
  {
    date: '13',
    weekday: 'Fri',
    title: 'Pyramids Dune Raid Qualifiers',
    conditions: '26°C, wind 7 kts N',
    events: [
      { time: '10:00', end: '13:00', title: 'Dakar Trophy Truck Dune Time Trials', stage: 'Giza Plateau Dune Arena', type: 'Rally Raid' },
      { time: '14:30', end: '17:00', title: 'Sinai Canyon Freeride Seeding Runs', stage: 'Sinai Colored Canyon', type: 'MTB Freeride' },
      { time: '19:00', end: '23:00', title: 'Sphinx Twilight Gala and Laser Opening', stage: 'Great Sphinx Amphitheater', type: 'Soundstage' },
    ],
  },
  {
    date: '14',
    weekday: 'Sat',
    title: 'Red Sea Abyss and Capital Drift',
    conditions: '27°C, water 24°C, wind 11 kts E',
    events: [
      { time: '11:00', end: '14:00', title: 'Blue Hole 30 m Cliff Diving Semifinals', stage: 'Dahab Abyss Platform', type: 'Cliff Dive' },
      { time: '16:00', end: '19:00', title: 'New Capital Drift Masters Tandem Battles', stage: 'Cairo Grand Circuit', type: 'Twin Drift' },
      { time: '20:30', end: '02:00', title: 'Red Sea Sunset Soundstage Sessions', stage: 'Dahab Beachfront Arena', type: 'Soundstage' },
    ],
  },
  {
    date: '15',
    weekday: 'Sun',
    title: 'World Championship Finale',
    conditions: '25°C, wind 6 kts NW',
    events: [
      { time: '12:00', end: '15:00', title: 'Sinai Canyon 105 ft Gap Superfinal', stage: 'Sinai Red Ridge', type: 'MTB Final' },
      { time: '15:30', end: '18:00', title: 'Pyramids Dune Raid Championship Final', stage: 'Giza Plateau Dune Arena', type: 'Rally Raid' },
      { time: '20:30', end: 'Late', title: 'Grand Finale: 1,500-Drone Sky Show', stage: 'Giza Plateau Main Stage', type: 'Sky Finale' },
    ],
  },
];

export const ScheduleSection: React.FC = () => {
  const [activeDay, setActiveDay] = useState(0);
  const rootRef = useRef<HTMLElement>(null);
  const day = DAYS[activeDay];

  useSectionReveal(rootRef);
  useSwapAnimation(rootRef, activeDay);

  return (
    <section
      ref={rootRef}
      id="schedule"
      className="relative min-h-[120dvh] w-full flex flex-col justify-center py-24 px-4 sm:px-10 z-20"
    >
      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
        <div className="lg:col-span-7">
          <h2 data-reveal="title" className="section-title mb-10">
            Three days. <span className="text-rb-red">Pure momentum.</span>
          </h2>

          {/* Day switcher: the dates are the controls */}
          <div data-reveal="up" className="grid grid-cols-3 gap-2 sm:gap-4 mb-10" role="tablist" aria-label="Event days">
            {DAYS.map((d, idx) => {
              const active = idx === activeDay;
              return (
                <button
                  key={d.date}
                  role="tab"
                  aria-selected={active}
                  onClick={() => {
                    if (active) return;
                    audio.playClick();
                    setActiveDay(idx);
                  }}
                  className="group relative text-left pb-4"
                >
                  <span
                    className={`block font-display font-extrabold leading-none tracking-[-0.05em] text-6xl sm:text-8xl transition-colors duration-500 ${
                      active ? 'text-white' : 'text-white/15 group-hover:text-white/40'
                    }`}
                  >
                    {d.date}
                  </span>
                  <span
                    className={`block font-mono text-[11px] tracking-[0.16em] uppercase mt-2 transition-colors duration-300 ${
                      active ? 'text-rb-yellow' : 'text-rb-muted'
                    }`}
                  >
                    {d.weekday} Nov
                  </span>
                  <span className="absolute left-0 right-0 bottom-0 h-px bg-white/10" aria-hidden />
                  <span
                    className={`absolute left-0 right-0 bottom-0 h-[2px] bg-rb-red origin-left transition-transform duration-700 ease-out-expo ${
                      active ? 'scale-x-100' : 'scale-x-0'
                    }`}
                    aria-hidden
                  />
                </button>
              );
            })}
          </div>

          <div data-swap className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 mb-8">
            <h3 className="font-display font-extrabold uppercase text-white text-xl sm:text-2xl tracking-[-0.03em]">
              {day.title}
            </h3>
            <span className="font-mono text-xs text-rb-muted">{day.conditions}</span>
          </div>

          {/* Timeline: static track plus a red rail that fills with scroll */}
          <div className="relative pl-7 sm:pl-9">
            <span className="absolute left-[5px] top-2 bottom-2 w-px bg-white/10" aria-hidden />
            <span data-draw="y" className="absolute left-[5px] top-2 bottom-2 w-px bg-rb-red" aria-hidden />

            <ol className="space-y-9">
              {day.events.map((ev) => (
                <li key={`${day.date}-${ev.time}`} data-swap className="relative">
                  <span
                    className="absolute -left-7 sm:-left-9 top-1.5 w-[11px] h-[11px] rounded-full border-2 border-rb-red bg-rb-dark"
                    aria-hidden
                  />
                  <div className="grid grid-cols-1 sm:grid-cols-[7.5rem_1fr] gap-x-6 gap-y-1.5">
                    <p className="font-mono text-sm text-rb-yellow pt-0.5">
                      {ev.time}
                      <span className="text-rb-muted"> - {ev.end}</span>
                    </p>
                    <div>
                      <h4 className="font-display font-bold uppercase text-white text-lg sm:text-xl leading-tight tracking-[-0.02em] mb-1.5">
                        {ev.title}
                      </h4>
                      <p className="text-sm text-rb-muted">
                        {ev.stage} &middot; {ev.type}
                      </p>
                    </div>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>

        {/* Open lane for the can */}
        <div className="hidden lg:block lg:col-span-5 min-h-[360px] pointer-events-none" aria-hidden />
      </div>
    </section>
  );
};
