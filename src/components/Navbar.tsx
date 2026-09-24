import React, { useState } from 'react';
import { audio } from '../utils/audio';
import { Volume2, VolumeX, Menu, X, ArrowUpRight, Zap } from 'lucide-react';

interface NavbarProps {
  onNavigate: (sectionId: string) => void;
  audioActive: boolean;
  onToggleAudio: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onNavigate,
  audioActive,
  onToggleAudio,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: 'Overview', id: 'hero' },
    { label: 'Arenas', id: 'arenas' },
    { label: 'Athletes', id: 'athletes' },
    { label: 'Experience', id: 'experience' },
    { label: 'Schedule', id: 'schedule' },
    { label: 'Passes', id: 'tickets' },
  ];

  const handleLinkClick = (id: string) => {
    audio.playClick();
    onNavigate(id);
    setMobileMenuOpen(false);
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-40 px-4 sm:px-8 pt-5 pb-3 pointer-events-none">
        <div className="max-w-7xl mx-auto flex items-center justify-between pointer-events-auto">
          {/* Brand Logo */}
          <button
            onClick={() => handleLinkClick('hero')}
            className="group flex items-center gap-3 glass-panel px-4 py-2 rounded-full hover:border-rb-red/50 transition-all duration-300 shadow-lg"
          >
            <img
              src="/redbull-logo.svg"
              alt="Red Bull"
              className="h-7 w-auto object-contain drop-shadow-md group-hover:scale-105 transition-transform"
            />
            <div className="flex flex-col text-left pl-1 border-l border-white/10">
              <span className="font-display font-black text-xs tracking-wider text-white leading-none">
                GRAVITY
              </span>
              <span className="font-mono text-[8px] font-bold tracking-widest text-rb-yellow leading-tight">
                EGYPT '26
              </span>
            </div>
          </button>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 glass-panel px-5 py-2 rounded-full border border-white/10 shadow-2xl">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => handleLinkClick(link.id)}
                className="px-3.5 py-1.5 rounded-full text-xs font-mono font-medium tracking-wider text-rb-silver hover:text-white hover:bg-white/10 transition-all duration-200"
              >
                {link.label}
              </button>
            ))}
          </nav>

          {/* Right Action Icons: Audio Equalizer & Pass CTA */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Audio Toggle with Animated Equalizer Bars */}
            <button
              onClick={onToggleAudio}
              className={`glass-panel flex items-center gap-2.5 px-3.5 py-2.5 rounded-full border transition-all duration-300 shadow-md ${
                audioActive
                  ? 'border-rb-red text-rb-red shadow-glow-red'
                  : 'border-white/10 text-rb-muted hover:text-white'
              }`}
              title={audioActive ? 'Mute Sound FX' : 'Enable Sound FX'}
            >
              {audioActive ? (
                <div className="flex items-end gap-0.5 h-3.5 w-3.5">
                  <span className="w-1 bg-rb-red animate-[bounce_0.6s_ease-in-out_infinite] h-full rounded-sm" />
                  <span className="w-1 bg-rb-yellow animate-[bounce_0.8s_ease-in-out_infinite_0.2s] h-3/4 rounded-sm" />
                  <span className="w-1 bg-rb-red animate-[bounce_0.5s_ease-in-out_infinite_0.4s] h-1/2 rounded-sm" />
                </div>
              ) : (
                <VolumeX className="w-4 h-4" />
              )}
              <span className="hidden sm:inline font-mono text-[11px] font-semibold tracking-wider uppercase">
                {audioActive ? 'AUDIO ON' : 'SOUND'}
              </span>
            </button>

            {/* Direct Ticket CTA */}
            <button
              onClick={() => handleLinkClick('tickets')}
              className="group hidden sm:inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-rb-red hover:bg-rb-redGlow text-white font-display font-bold text-xs tracking-widest uppercase transition-all duration-300 shadow-glow-red hover:scale-105 active:scale-95"
            >
              <span>CLAIM PASS</span>
              <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </button>

            {/* Mobile Menu Hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden glass-panel p-2.5 rounded-full text-white"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-30 bg-rb-dark/95 backdrop-blur-2xl md:hidden flex flex-col justify-center items-center gap-6 p-8 animate-fade-in">
          <div className="text-rb-red font-mono text-xs tracking-widest uppercase mb-4">
            EVENT DIRECTORY
          </div>
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => handleLinkClick(link.id)}
              className="text-2xl font-display font-black tracking-tight text-white hover:text-rb-yellow transition-colors"
            >
              {link.label}
            </button>
          ))}
          <button
            onClick={() => handleLinkClick('tickets')}
            className="mt-6 w-full max-w-xs py-3 rounded-full bg-rb-red text-white font-display font-bold text-sm tracking-widest uppercase shadow-glow-red"
          >
            CLAIM PASS NOW
          </button>
        </div>
      )}
    </>
  );
};
