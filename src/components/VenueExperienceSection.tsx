import React, { useState } from 'react';
import { audio } from '../utils/audio';
import { MapPin, Bus, Sun, Shield, ChevronDown, Sparkles, Coffee, Glasses, CheckCircle2, Navigation } from 'lucide-react';

export const VenueExperienceSection: React.FC = () => {
  const [activeFaq, setActiveFaq] = useState<number | null>(0);

  const hubs = [
    {
      title: 'PYRAMIDS DUNE COLISEUM',
      location: 'GIZA PLATEAU // CAIRO',
      desc: 'Prime stadium grandstand with shaded canopies and panoramic sightlines of 1,050 BHP Trophy Trucks launching 45 meters over towering desert dunes.',
      highlights: ['Dakar Dune Corridor', 'Air-Conditioned VIP Lounges', 'Live Telemetry Video Walls'],
      accent: 'border-rb-red/50 text-rb-red',
      tag: 'ARENA 01',
    },
    {
      title: 'RED SEA MARINE BASIN',
      location: 'DAHAB BLUE HOLE // SINAI',
      desc: 'Floating spectator platforms anchored over the legendary 100-meter marine sinkhole, offering water-level views of 30-meter high dives.',
      highlights: ['Floating VIP Pontoons', 'Coral Shelf Viewing Deck', 'Chilled Beachfront Bar'],
      accent: 'border-rb-cyan/50 text-rb-cyan',
      tag: 'ARENA 02',
    },
    {
      title: 'SINAI DESERT BASECAMP',
      location: 'COLORED CANYON // SOUTH SINAI',
      desc: 'High-altitude desert terrace carved into ancient sandstone hills, overlooking the 105-foot downhill canyon gaps and natural drop couloirs.',
      highlights: ['Dune Buggy Staging', 'Sunset Mountain Lounge', 'Raw Natural Amphitheater'],
      accent: 'border-rb-yellow/50 text-rb-yellow',
      tag: 'ARENA 03',
    },
    {
      title: 'SPHINX MIDNIGHT SOUNDSTAGE',
      location: 'GREAT SPHINX COMPLEX // GIZA',
      desc: 'Monumental evening music arena with 3D laser projection mapping onto ancient monuments and international headline electronic artists.',
      highlights: ['Laser Monument Projection', 'Full-Scale Festival Audio', 'Artisan Culinary Village'],
      accent: 'border-white/50 text-white',
      tag: 'ARENA 04',
    },
  ];

  const attractions = [
    {
      icon: Glasses,
      title: 'DAKAR HYDRAULIC SIMULATOR',
      desc: 'Strap into a 6-DOF hydraulic motion rig and experience Nasser Al-Attiyah’s 1,050 BHP Trophy Truck conquering steep desert dunes with full force haptics.',
      tag: 'HAPTIC SIM',
    },
    {
      icon: Sparkles,
      title: 'F1 RED BULL SIMULATOR RIGS',
      desc: 'Compete on custom Red Bull Racing motion simulators calibrated to the high-speed twists of the New Cairo Grand Circuit.',
      tag: 'PRO TELEMETRY',
    },
    {
      icon: Coffee,
      title: 'RED BULL MIXOLOGY LAB',
      desc: 'Exclusive Egypt mocktail infusions crafted with chilled Red Bull editions, Egyptian organic hibiscus, and fresh Sinai mint.',
      tag: 'CRAFT REFRESHMENT',
    },
  ];

  const faqs = [
    {
      q: 'HOW DO I TRAVEL BETWEEN GIZA, CAIRO, SINAI, AND DAHAB?',
      a: 'Complimentary high-speed air-conditioned shuttle coaches depart every 15 minutes from Downtown Cairo (Tahrir, Zamalek, and New Cairo) directly to Giza checkpoints. For Dahab and Sinai arenas, ticket holders can reserve connecting Red Bull luxury express coaches from Sharm El Sheikh Airport or book VIP helicopter transfers through our official concierge.',
    },
    {
      q: 'WHAT HAPPENS IF DESERT WINDS DELAY A FLIGHT OR DIVE?',
      a: 'Every ticket is backed by our 100% Weather Protection Guarantee. If desert wind shears exceed safety parameters (above 35 knots), heats are immediately shifted to morning or sunset twilight windows, and all pass holders receive priority access to simulator pods and live paddock pit sessions.',
    },
    {
      q: 'CAN I TRANSFER OR RESELL MY PASS IF MY PLANS CHANGE?',
      a: 'Yes. Passes are 100% digitally transferable via your confirmation link up to 24 hours before Day 1 gate openings. You can also upgrade your pass tier at any time by paying the price difference directly in the attendee portal.',
    },
    {
      q: 'WHAT SHOULD I WEAR FOR THE EGYPTIAN DESERT CLIMATE?',
      a: 'Mid-November offers Egypt’s ideal desert climate: warm, clear days (approx 26°C / 78°F) and crisp evenings (approx 16°C / 61°F). We recommend breathable lightweight clothing, UV sunglasses, sturdy footwear for desert walking, and a light jacket for the midnight Sphinx Soundstage concerts.',
    },
    {
      q: 'ARE MEALS AND HYDRATION PROVIDED ON SITE?',
      a: 'All passes include access to 8 shaded hydration stations offering unlimited chilled mineral water and Red Bull dispensaries. The Nile & Desert Culinary Village features over 30 celebrated Egyptian artisans, while VIP and Paddock Club passes include gourmet open bars and private five-star catering suites.',
    },
  ];

  return (
    <section
      id="experience"
      className="relative min-h-screen w-full flex flex-col justify-center py-24 px-4 sm:px-10 z-20"
    >
      <div className="max-w-7xl mx-auto w-full">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-12">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <span className="w-8 h-0.5 bg-rb-cyan" />
              <span className="font-mono text-xs font-bold tracking-widest text-rb-cyan uppercase">
                CHAPTER 03 // VENUE GUIDE & FESTIVAL HUBS
              </span>
            </div>
            <h2 className="text-4xl sm:text-6xl font-display font-black tracking-tight text-white uppercase leading-none">
              FOUR HUBS.
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-rb-cyan via-white to-rb-yellow">
                ONE UNFORGETTABLE EMPIRE.
              </span>
            </h2>
          </div>

          <div className="flex items-center gap-3 font-mono text-xs text-rb-silver">
            <span className="px-3 py-1.5 rounded-full bg-white/5 border border-white/10 flex items-center gap-2">
              <Bus className="w-3.5 h-3.5 text-rb-cyan" />
              <span>FREE SHUTTLES EVERY 15 MIN</span>
            </span>
          </div>
        </div>

        {/* 4 Spectator Hubs Bento Matrix */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-14">
          {hubs.map((hub) => (
            <div
              key={hub.title}
              className={`glass-panel p-6 sm:p-7 rounded-2xl border transition-all duration-300 hover:border-white/30 hover:scale-[1.01] ${hub.accent.split(' ')[0]} relative overflow-hidden`}
            >
              <div className="flex items-center justify-between mb-4">
                <span className="font-mono text-[10px] font-bold text-rb-muted uppercase tracking-widest px-2.5 py-0.5 rounded bg-white/5 border border-white/10">
                  {hub.tag}
                </span>
                <span className="font-mono text-xs text-rb-yellow flex items-center gap-1 uppercase tracking-wider">
                  <MapPin className="w-3.5 h-3.5" />
                  {hub.location}
                </span>
              </div>

              <h3 className="text-2xl font-display font-black tracking-tight text-white mb-3">
                {hub.title}
              </h3>

              <p className="font-mono text-xs sm:text-sm text-rb-silver leading-relaxed mb-6">
                {hub.desc}
              </p>

              <div className="flex flex-wrap gap-2 pt-4 border-t border-white/10">
                {hub.highlights.map((item) => (
                  <span
                    key={item}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/5 font-mono text-[10px] text-white/90 uppercase tracking-wider"
                  >
                    <CheckCircle2 className="w-3 h-3 text-rb-cyan" />
                    {item}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Proving Grounds: Interactive Simulation Attractions */}
        <div className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <span className="w-5 h-0.5 bg-rb-yellow" />
            <span className="font-mono text-xs font-bold tracking-widest text-rb-yellow uppercase">
              INTERACTIVE PROVING GROUNDS // FREE FOR ALL PASS HOLDERS
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {attractions.map((att) => {
              const Icon = att.icon;
              return (
                <div
                  key={att.title}
                  className="glass-panel p-6 rounded-2xl border border-white/10 hover:border-rb-yellow/50 transition-all duration-300 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-3 rounded-xl bg-rb-yellow/10 text-rb-yellow">
                        <Icon className="w-6 h-6" />
                      </div>
                      <span className="font-mono text-[9px] font-bold text-rb-muted tracking-widest px-2 py-0.5 rounded bg-white/5">
                        {att.tag}
                      </span>
                    </div>

                    <h4 className="font-display font-black text-lg text-white mb-2 tracking-tight">
                      {att.title}
                    </h4>

                    <p className="font-mono text-xs text-rb-silver leading-relaxed">
                      {att.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* FAQs Accordion */}
        <div className="max-w-4xl mx-auto w-full">
          <div className="flex items-center gap-3 mb-6">
            <span className="w-5 h-0.5 bg-rb-cyan" />
            <span className="font-mono text-xs font-bold tracking-widest text-rb-cyan uppercase">
              LOGISTICS & ATTENDEE INTEL // FAQ
            </span>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, idx) => {
              const isOpen = activeFaq === idx;
              return (
                <div
                  key={faq.q}
                  className="glass-panel rounded-2xl border border-white/10 overflow-hidden transition-all duration-300"
                >
                  <button
                    onClick={() => {
                      audio.playClick();
                      setActiveFaq(isOpen ? null : idx);
                    }}
                    className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 hover:bg-white/5 transition-colors"
                  >
                    <div className="flex items-center gap-3.5">
                      <span className="font-mono text-xs font-bold text-rb-cyan">
                        [0{idx + 1}]
                      </span>
                      <span className="font-display font-bold text-sm sm:text-base text-white tracking-wide">
                        {faq.q}
                      </span>
                    </div>
                    <ChevronDown
                      className={`w-4 h-4 text-rb-silver flex-shrink-0 transition-transform duration-300 ${
                        isOpen ? 'rotate-180 text-rb-yellow' : ''
                      }`}
                    />
                  </button>

                  {isOpen && (
                    <div className="px-5 sm:px-6 pb-6 pt-1 border-t border-white/5 font-mono text-xs sm:text-sm text-rb-silver leading-relaxed">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
