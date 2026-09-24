import React, { useState } from 'react';
import { audio } from '../utils/audio';
import { Zap, ArrowUp, Send, Check } from 'lucide-react';

interface FooterProps {
  onScrollToTop: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onScrollToTop }) => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    audio.playClick();
    setSubscribed(true);
    setTimeout(() => {
      setEmail('');
      setSubscribed(false);
    }, 4000);
  };

  const marqueeText1 = 'RED BULL GRAVITY EGYPT 2026 • GIVES YOU WINGS • 1,050 BHP PYRAMIDS DUNE RAID • 30M DAHAB BLUE HOLE DIVE • SPHINX SOUNDSTAGE • ';
  const marqueeText2 = 'MAXIMUM VELOCITY • GIZA PLATEAU & RED SEA • 7000 YEARS OF MOMENTUM • NOVEMBER 13–15, 2026 • 48,000 PASSES ALLOCATED • ';

  return (
    <footer className="relative w-full pt-16 pb-12 overflow-hidden bg-rb-dark border-t border-white/10 z-20">
      {/* Kinetic Infinite Marquee Strips */}
      <div className="w-full flex flex-col gap-2 py-4 mb-14 bg-rb-navy/40 border-y border-white/5 select-none overflow-hidden">
        {/* Ribbon 1 */}
        <div className="flex whitespace-nowrap overflow-hidden">
          <div className="animate-marquee font-display font-black text-2xl sm:text-4xl text-transparent bg-clip-text bg-gradient-to-r from-rb-red via-rb-yellow to-white tracking-wider">
            {marqueeText1.repeat(4)}
          </div>
        </div>
        {/* Ribbon 2 (Opposing Direction) */}
        <div className="flex whitespace-nowrap overflow-hidden">
          <div className="animate-marquee-reverse font-display font-black text-xl sm:text-3xl text-rb-silver/20 tracking-wider">
            {marqueeText2.repeat(4)}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-white/10">
          {/* Brand Manifesto */}
          <div className="md:col-span-5 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <img
                  src="/redbull-logo.svg"
                  alt="Red Bull"
                  className="h-9 w-auto object-contain"
                />
                <span className="font-display font-black text-xl tracking-tight text-white pl-2 border-l border-white/10">
                  GRAVITY EGYPT
                </span>
              </div>
              <p className="font-mono text-xs text-rb-silver max-w-sm leading-relaxed mb-6">
                From 1,050-horsepower Dakar trophy trucks soaring over the Giza dunes to the depths of the Red Sea. Red Bull Gravity Egypt is the ultimate adrenaline spectacle.
              </p>
            </div>
            <div className="font-mono text-[11px] text-rb-muted">
              © 2026 RED BULL GMBH. ALL RIGHTS RESERVED.
            </div>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-3">
            <h4 className="font-mono text-xs font-bold text-white uppercase tracking-widest mb-4">
              CHAMPIONSHIP
            </h4>
            <ul className="space-y-2.5 font-mono text-xs text-rb-silver">
              <li>
                <a href="#hero" className="hover:text-rb-yellow transition-colors">
                  Telemetry Radar
                </a>
              </li>
              <li>
                <a href="#anatomy" className="hover:text-rb-yellow transition-colors">
                  Formula & Science
                </a>
              </li>
              <li>
                <a href="#arenas" className="hover:text-rb-yellow transition-colors">
                  Battleground Stages
                </a>
              </li>
              <li>
                <a href="#schedule" className="hover:text-rb-yellow transition-colors">
                  3-Day Timeline
                </a>
              </li>
              <li>
                <a href="#tickets" className="hover:text-rb-yellow transition-colors">
                  VIP Paddock Tickets
                </a>
              </li>
            </ul>
          </div>

          {/* Newsletter Alert */}
          <div className="md:col-span-4">
            <h4 className="font-mono text-xs font-bold text-white uppercase tracking-widest mb-4">
              PRIORITY TELEMETRY DISPATCH
            </h4>
            <p className="font-mono text-xs text-rb-silver mb-4 leading-relaxed">
              Get notified first when athlete heats, flight coordinates, and secret stage performances drop.
            </p>

            <form onSubmit={handleSubscribe} className="flex items-center gap-2">
              <input
                type="email"
                required
                placeholder="racer@velocity.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2.5 rounded-full bg-white/5 border border-white/10 text-white font-mono text-xs focus:outline-none focus:border-rb-yellow transition-colors"
              />
              <button
                type="submit"
                className="p-2.5 rounded-full bg-rb-red hover:bg-rb-redGlow text-white shadow-glow-red transition-all shrink-0 hover:scale-105 active:scale-95"
              >
                {subscribed ? <Check className="w-4 h-4 text-rb-yellow" /> : <Send className="w-4 h-4" />}
              </button>
            </form>
            {subscribed && (
              <span className="inline-block mt-2 font-mono text-[10px] text-rb-yellow animate-fade-in">
                SUBSCRIBED TO PRIORITY DROP DISPATCH.
              </span>
            )}
          </div>
        </div>

        {/* Bottom bar with Back to Top */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-6 font-mono text-[11px] text-rb-muted">
            <a href="#hero" className="hover:text-white transition-colors">PRIVACY POLICY</a>
            <a href="#hero" className="hover:text-white transition-colors">TERMS OF ENTRY</a>
            <a href="#hero" className="hover:text-white transition-colors">COOKIE SETTINGS</a>
          </div>

          <button
            onClick={() => {
              audio.playClick();
              onScrollToTop();
            }}
            className="flex items-center gap-2 text-xs font-mono text-rb-silver hover:text-white transition-colors"
          >
            <span>BACK TO STRATOSPHERE</span>
            <div className="w-7 h-7 rounded-full border border-white/20 flex items-center justify-center hover:border-rb-red hover:bg-rb-red/20 transition-all">
              <ArrowUp className="w-3.5 h-3.5 text-rb-yellow" />
            </div>
          </button>
        </div>
      </div>
    </footer>
  );
};
