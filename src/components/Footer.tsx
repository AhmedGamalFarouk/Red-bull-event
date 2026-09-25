import React, { useState } from 'react';
import { audio } from '../utils/audio';
import { ArrowUp, Send, Check } from 'lucide-react';

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
  const marqueeText2 = 'MAXIMUM VELOCITY • GIZA PLATEAU & RED SEA • 7000 YEARS OF MOMENTUM • NOVEMBER 13-15, 2026 • 48,000 PASSES • ';

  const links = [
    { label: 'Arenas', href: '#arenas' },
    { label: 'Athletes', href: '#athletes' },
    { label: 'Experience', href: '#experience' },
    { label: 'The Formula', href: '#anatomy' },
    { label: 'Schedule', href: '#schedule' },
    { label: 'Passes', href: '#tickets' },
  ];

  return (
    <footer className="relative w-full pt-16 pb-10 overflow-hidden bg-rb-dark border-t border-white/10 z-20">
      {/* Kinetic marquee ribbons, opposing directions */}
      <div className="w-full flex flex-col gap-2 py-4 mb-16 bg-rb-navy/40 border-y border-white/5 select-none overflow-hidden" aria-hidden>
        <div className="flex whitespace-nowrap overflow-hidden">
          <div className="animate-marquee font-display font-extrabold text-2xl sm:text-4xl text-transparent bg-clip-text bg-gradient-to-r from-rb-red via-rb-yellow to-white tracking-wider">
            {marqueeText1.repeat(4)}
          </div>
        </div>
        <div className="flex whitespace-nowrap overflow-hidden">
          <div className="animate-marquee-reverse font-display font-extrabold text-xl sm:text-3xl text-rb-silver/20 tracking-wider">
            {marqueeText2.repeat(4)}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 pb-12 border-b border-white/10">
          <div className="md:col-span-5">
            <div className="flex items-center gap-3 mb-5">
              <img src="/redbull-logo.svg" alt="Red Bull" className="h-9 w-auto object-contain" />
              <span className="font-display font-extrabold text-lg tracking-tight text-white pl-3 border-l border-white/10">
                GRAVITY EGYPT
              </span>
            </div>
            <p className="text-sm text-rb-silver max-w-sm leading-relaxed">
              Dakar trucks over the Giza dunes, dives into the Red Sea, and three days of the best in extreme sport.
            </p>
          </div>

          <nav className="md:col-span-3" aria-label="Footer">
            <ul className="grid grid-cols-2 md:grid-cols-1 gap-3 text-sm">
              {links.map((l) => (
                <li key={l.href}>
                  <a href={l.href} className="text-rb-silver hover:text-white transition-colors">
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="md:col-span-4">
            <form onSubmit={handleSubscribe} className="flex flex-col gap-2">
              <label htmlFor="footer-email" className="font-display font-extrabold uppercase text-white tracking-[-0.01em]">
                Get lineup news first
              </label>
              <p className="text-sm text-rb-muted mb-2">Heat times and surprise sets, straight to your inbox.</p>
              <div className="flex items-center gap-2">
                <input
                  id="footer-email"
                  type="email"
                  required
                  autoComplete="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full h-12 px-5 rounded-full bg-white/5 border border-white/15 text-white text-sm placeholder:text-white/40 focus:outline-none focus:border-rb-yellow focus:ring-2 focus:ring-rb-yellow/25 transition-colors"
                />
                <button
                  type="submit"
                  aria-label="Subscribe"
                  className="w-12 h-12 flex items-center justify-center rounded-full bg-rb-red hover:bg-rb-redGlow text-white transition-colors shrink-0 active:scale-[0.97]"
                >
                  {subscribed ? <Check className="w-4 h-4 text-rb-yellow" /> : <Send className="w-4 h-4" />}
                </button>
              </div>
              <p className="min-h-[1.25rem] text-xs text-rb-yellow" aria-live="polite">
                {subscribed ? "You're on the list." : ''}
              </p>
            </form>
          </div>
        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-5">
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-rb-muted">
            <span>© 2026 Red Bull GmbH</span>
            <a href="#hero" className="hover:text-white transition-colors">Privacy</a>
            <a href="#hero" className="hover:text-white transition-colors">Terms of entry</a>
            <a href="#hero" className="hover:text-white transition-colors">Cookies</a>
          </div>

          <button
            onClick={() => {
              audio.playClick();
              onScrollToTop();
            }}
            className="group flex items-center gap-3 text-sm text-rb-silver hover:text-white transition-colors"
          >
            Back to top
            <span className="w-9 h-9 rounded-full border border-white/20 flex items-center justify-center group-hover:border-rb-red group-hover:bg-rb-red/15 transition-colors">
              <ArrowUp className="w-4 h-4 text-rb-yellow transition-transform duration-300 group-hover:-translate-y-0.5" />
            </span>
          </button>
        </div>
      </div>
    </footer>
  );
};
