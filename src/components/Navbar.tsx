import React, { useRef, useState } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { audio } from '../utils/audio';
import { VolumeX, Menu, X, ArrowUpRight } from 'lucide-react';
import { Magnetic } from '../motion/Magnetic';
import { EASE_OUT } from '../motion/reveal';

interface NavbarProps {
  ready: boolean; // drop in once the preloader starts revealing the scene
  onNavigate: (sectionId: string) => void;
  audioActive: boolean;
  onToggleAudio: () => void;
  activeId: string;
  progress: number; // 0 to 1, derived from the section-anchored scroll progress
}

const NAV_LINKS = [
  { label: 'Arenas', id: 'arenas' },
  { label: 'Athletes', id: 'athletes' },
  { label: 'Experience', id: 'experience' },
  { label: 'Schedule', id: 'schedule' },
  { label: 'Passes', id: 'tickets' },
];

export const Navbar: React.FC<NavbarProps> = ({
  ready,
  onNavigate,
  audioActive,
  onToggleAudio,
  activeId,
  progress,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const drawerRef = useRef<HTMLDivElement>(null);

  // Header drops in as the preloader hands over
  useGSAP(
    () => {
      if (!ready) return;
      gsap.matchMedia().add('(prefers-reduced-motion: no-preference)', () => {
        gsap.from('.nav-shell', { yPercent: -140, autoAlpha: 0, duration: 1.2, ease: EASE_OUT, delay: 0.35 });
      });
    },
    { scope: headerRef, dependencies: [ready] }
  );

  // Mobile drawer links stagger in
  useGSAP(
    () => {
      if (!mobileMenuOpen || !drawerRef.current) return;
      gsap.from(drawerRef.current.querySelectorAll('[data-drawer-item]'), {
        y: 40,
        autoAlpha: 0,
        duration: 0.8,
        ease: EASE_OUT,
        stagger: 0.05,
      });
    },
    { dependencies: [mobileMenuOpen] }
  );

  const handleLinkClick = (id: string) => {
    audio.playClick();
    onNavigate(id);
    setMobileMenuOpen(false);
  };

  return (
    <>
      <header ref={headerRef} className="fixed top-0 left-0 right-0 z-40 px-3 sm:px-6 pt-3 sm:pt-4 pointer-events-none">
        <div className="nav-shell max-w-7xl mx-auto h-14 sm:h-16 glass-panel rounded-full pointer-events-auto relative overflow-hidden flex items-center justify-between pl-3 pr-2 sm:pl-5 sm:pr-2.5 shadow-[0_18px_50px_-20px_rgba(0,0,0,0.8)]">
          {/* Brand */}
          <button
            onClick={() => handleLinkClick('hero')}
            className="group flex items-center gap-3 shrink-0"
            aria-label="Back to top"
          >
            <img
              src="/redbull-logo.svg"
              alt="Red Bull"
              className="h-6 sm:h-7 w-auto object-contain transition-transform duration-500 ease-out-expo group-hover:scale-105"
            />
            <span className="hidden sm:flex flex-col text-left pl-3 border-l border-white/10 leading-none">
              <span className="font-display font-extrabold text-xs tracking-wider text-white">GRAVITY</span>
              <span className="font-mono text-[9px] font-semibold tracking-[0.2em] text-rb-yellow mt-1">EGYPT 26</span>
            </span>
          </button>

          {/* Desktop links */}
          <nav className="hidden lg:flex items-center gap-1" aria-label="Sections">
            {NAV_LINKS.map((link) => {
              const active = activeId === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => handleLinkClick(link.id)}
                  aria-current={active ? 'true' : undefined}
                  className={`relative px-4 py-2 text-[13px] font-medium tracking-wide transition-colors duration-300 ${
                    active ? 'text-white' : 'text-rb-silver/70 hover:text-white'
                  }`}
                >
                  {link.label}
                  <span
                    className={`absolute left-4 right-4 -bottom-0.5 h-[2px] rounded-full bg-rb-red origin-left transition-transform duration-500 ease-out-expo ${
                      active ? 'scale-x-100' : 'scale-x-0'
                    }`}
                  />
                </button>
              );
            })}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            <button
              onClick={onToggleAudio}
              className={`flex items-center justify-center gap-2 h-10 px-3.5 rounded-full transition-colors duration-300 ${
                audioActive ? 'text-rb-red bg-rb-red/10' : 'text-rb-muted hover:text-white hover:bg-white/5'
              }`}
              aria-pressed={audioActive}
              aria-label={audioActive ? 'Mute sound effects' : 'Enable sound effects'}
            >
              {audioActive ? (
                <span className="flex items-end gap-0.5 h-3.5 w-3.5" aria-hidden>
                  <span className="w-1 bg-rb-red animate-[bounce_0.6s_ease-in-out_infinite] h-full rounded-sm" />
                  <span className="w-1 bg-rb-yellow animate-[bounce_0.8s_ease-in-out_infinite_0.2s] h-3/4 rounded-sm" />
                  <span className="w-1 bg-rb-red animate-[bounce_0.5s_ease-in-out_infinite_0.4s] h-1/2 rounded-sm" />
                </span>
              ) : (
                <VolumeX className="w-4 h-4" />
              )}
              <span className="hidden md:inline font-mono text-[11px] font-medium tracking-wider uppercase">
                {audioActive ? 'Sound on' : 'Sound'}
              </span>
            </button>

            <Magnetic strength={0.25} className="hidden sm:inline-flex">
              <button
                onClick={() => handleLinkClick('tickets')}
                className="group inline-flex items-center gap-2 h-10 sm:h-11 px-5 rounded-full bg-rb-red hover:bg-rb-redGlow text-white font-display font-bold text-xs tracking-[0.14em] uppercase transition-colors duration-300 active:scale-[0.97]"
              >
                Get Passes
                <ArrowUpRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </button>
            </Magnetic>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden flex items-center justify-center w-10 h-10 rounded-full text-white hover:bg-white/5"
              aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

          {/* Page progress, fed by the same section-anchored value that flies the can */}
          <span
            className="absolute left-0 bottom-0 h-[2px] w-full bg-gradient-to-r from-rb-red to-rb-yellow origin-left"
            style={{ transform: `scaleX(${Math.min(1, Math.max(0, progress))})` }}
            aria-hidden
          />
        </div>
      </header>

      {mobileMenuOpen && (
        <div
          ref={drawerRef}
          className="fixed inset-0 z-30 bg-rb-dark/95 backdrop-blur-2xl lg:hidden flex flex-col justify-center px-8 gap-2"
        >
          {NAV_LINKS.map((link) => (
            <button
              key={link.id}
              data-drawer-item
              onClick={() => handleLinkClick(link.id)}
              className={`text-left text-4xl font-display font-extrabold tracking-tight py-2 transition-colors ${
                activeId === link.id ? 'text-rb-red' : 'text-white hover:text-rb-yellow'
              }`}
            >
              {link.label}
            </button>
          ))}
          <button
            data-drawer-item
            onClick={() => handleLinkClick('tickets')}
            className="mt-8 w-full max-w-xs h-12 rounded-full bg-rb-red text-white font-display font-bold text-sm tracking-[0.14em] uppercase"
          >
            Get Passes
          </button>
        </div>
      )}
    </>
  );
};
