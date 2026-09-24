import React, { useState } from 'react';
import { audio } from '../utils/audio';
import { Calendar, Clock, MapPin, Zap, Flame } from 'lucide-react';

export const ScheduleSection: React.FC = () => {
  const [activeDay, setActiveDay] = useState<number>(0);

  const days = [
    {
      day: 'DAY 01',
      date: 'FRIDAY, NOVEMBER 13, 2026',
      title: 'PYRAMIDS DUNE RAID QUALIFIERS',
      events: [
        {
          time: '10:00 - 13:00',
          title: 'Dakar Trophy Trucks Pyramids Dune Time Trials',
          stage: 'Giza Plateau Dune Arena',
          type: 'RALLY RAID',
          color: 'text-rb-red',
        },
        {
          time: '14:30 - 17:00',
          title: 'Sinai Canyon Freeride Seeding Runs',
          stage: 'Sinai Colored Canyon',
          type: 'MTB',
          color: 'text-rb-yellow',
        },
        {
          time: '19:00 - 23:00',
          title: 'Sphinx Twilight Gala & 3D Laser Projection Opening',
          stage: 'Great Sphinx Amphitheater',
          type: 'SOUNDSTAGE',
          color: 'text-rb-cyan',
        },
      ],
    },
    {
      day: 'DAY 02',
      date: 'SATURDAY, NOVEMBER 14, 2026',
      title: 'RED SEA ABYSS & CAPITAL DRIFT',
      events: [
        {
          time: '11:00 - 14:00',
          title: 'Dahab Blue Hole 30M Cliff Diving Semifinals',
          stage: 'Dahab Abyss Platform',
          type: 'CLIFF DIVE',
          color: 'text-rb-cyan',
        },
        {
          time: '16:00 - 19:00',
          title: 'New Capital Drift Masters 1,250 BHP Tandem Battles',
          stage: 'Cairo Grand Circuit',
          type: 'DRIFT',
          color: 'text-white',
        },
        {
          time: '20:30 - 02:00',
          title: 'Red Sea Sunset Soundstage Sessions',
          stage: 'Dahab Beachfront Arena',
          type: 'SOUNDSTAGE',
          color: 'text-rb-yellow',
        },
      ],
    },
    {
      day: 'DAY 03',
      date: 'SUNDAY, NOVEMBER 15, 2026',
      title: 'WORLD CHAMPIONSHIP FINALE',
      events: [
        {
          time: '12:00 - 15:00',
          title: 'Sinai Canyon 105ft Gap Superfinal Runs',
          stage: 'Sinai Red Ridge',
          type: 'MTB',
          color: 'text-rb-yellow',
        },
        {
          time: '15:30 - 18:00',
          title: 'Pyramids Dune Raid World Championship Final',
          stage: 'Giza Plateau Dune Arena',
          type: 'RALLY RAID',
          color: 'text-rb-red',
        },
        {
          time: '20:30 - LATE',
          title: 'Grand Finale: Pyramids 1,500-Drone Sky Mapping Show',
          stage: 'Giza Plateau Main Stage',
          type: 'FINALE',
          color: 'text-rb-yellow',
        },
      ],
    },
  ];

  return (
    <section
      id="schedule"
      className="relative min-h-[110dvh] w-full flex flex-col justify-center py-24 px-4 sm:px-10 z-20"
    >
      <div className="max-w-7xl mx-auto w-full">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-12">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <span className="w-8 h-0.5 bg-rb-red" />
              <span className="font-mono text-xs font-bold tracking-widest text-rb-red uppercase">
                CHAPTER 04 // EVENT TIMELINE
              </span>
            </div>
            <h2 className="text-4xl sm:text-6xl font-display font-black tracking-tight text-white uppercase leading-none">
              THREE DAYS.
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-rb-yellow via-white to-rb-red">
                PURE MOMENTUM.
              </span>
            </h2>
          </div>

          {/* Day Switcher Tabs */}
          <div className="flex items-center gap-2 p-1.5 rounded-full glass-panel border border-white/10">
            {days.map((d, idx) => (
              <button
                key={d.day}
                onClick={() => {
                  audio.playClick();
                  setActiveDay(idx);
                }}
                className={`px-5 py-2.5 rounded-full font-mono text-xs font-bold tracking-wider transition-all duration-300 ${
                  activeDay === idx
                    ? 'bg-rb-red text-white shadow-glow-red'
                    : 'text-rb-silver hover:text-white'
                }`}
              >
                {d.day}
              </button>
            ))}
          </div>
        </div>

        {/* Schedule Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {days[activeDay].events.map((event, idx) => (
            <div
              key={event.title}
              className="glass-panel p-6 sm:p-8 rounded-2xl border border-white/10 hover:border-rb-red/40 transition-all duration-300 hover:-translate-y-1.5 shadow-xl flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2 text-xs font-mono text-rb-yellow">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{event.time}</span>
                  </div>
                  <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-white/5 ${event.color}`}>
                    {event.type}
                  </span>
                </div>

                <h3 className="text-xl sm:text-2xl font-display font-bold text-white mb-4">
                  {event.title}
                </h3>
              </div>

              <div className="pt-4 border-t border-white/10 flex items-center gap-2 text-xs font-mono text-rb-muted">
                <MapPin className="w-3.5 h-3.5 text-rb-silver" />
                <span>{event.stage}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
