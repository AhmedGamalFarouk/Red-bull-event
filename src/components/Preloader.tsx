import React, { useState, useEffect } from 'react';
import { audio } from '../utils/audio';
import { Volume2, VolumeX, Compass, MapPin, Zap, Flame, Radio } from 'lucide-react';

interface PreloaderProps {
  onComplete: () => void;
}

export const Preloader: React.FC<PreloaderProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [isReady, setIsReady] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);

  useEffect(() => {
    // High-speed asset buffering and telemetry simulation
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setIsReady(true);
          return 100;
        }
        const inc = Math.floor(Math.random() * 9) + 3;
        return Math.min(prev + inc, 100);
      });
    }, 40);

    return () => clearInterval(timer);
  }, []);

  const handleEnter = (withAudio: boolean) => {
    if (withAudio) {
      if (!audio.enabled) {
        audio.toggle();
      }
      audio.playLaunchTransition();
    }
    setHasStarted(true);
    // Smooth timing synchronized with shutter split & warp shockwave
    setTimeout(() => {
      onComplete();
    }, 1050);
  };

  return (
    <div
      className={`fixed inset-0 z-50 overflow-hidden pointer-events-auto select-none ${
        hasStarted ? 'pointer-events-none' : ''
      }`}
    >
      {/* ---------------- EGYPT BACKGROUND ENVIRONMENT ---------------- */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        {/* Cinematic Giza Pyramids and Sahara Dunes Image */}
        <img
          src="/egypt-pyramids.jpg"
          alt="Pyramids of Giza, Egypt - Sahara Desert Dunes Expedition"
          className={`w-full h-full object-cover object-center transition-all duration-1000 ${
            hasStarted ? 'animate-warp-zoom' : 'animate-ken-burns'
          }`}
        />

        {/* Cinematic Atmospheric Color Grading & Vignette */}
        <div className="absolute inset-0 bg-gradient-to-t from-rb-dark via-rb-dark/65 to-rb-dark/85" />
        <div className="absolute inset-0 bg-gradient-to-r from-rb-dark/80 via-transparent to-rb-dark/80" />

        {/* Ambient Red Bull Crimson & Golden Twilight Energy Blooms */}
        <div className="absolute -top-32 left-1/4 w-96 h-96 rounded-full bg-rb-red/20 blur-[130px] pointer-events-none" />
        <div className="absolute -bottom-32 right-1/4 w-96 h-96 rounded-full bg-rb-yellow/20 blur-[140px] pointer-events-none" />

        {/* Desert Telemetry HUD Grid Overlay */}
        <div className="absolute inset-0 hud-grid opacity-25 pointer-events-none" />

        {/* Egyptian Horizon Scanner Line */}
        <div
          className={`absolute left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-rb-yellow/40 to-transparent top-1/2 pointer-events-none transition-opacity duration-500 ${
            hasStarted ? 'opacity-0' : 'opacity-100 animate-pulse'
          }`}
        />
      </div>

      {/* ---------------- SPLIT SHUTTER BLAST-DOORS (Exit Animation) ---------------- */}
      {/* Top Shutter Half */}
      <div
        className={`absolute top-0 left-0 right-0 h-1/2 bg-rb-dark/70 backdrop-blur-md border-b border-rb-red/40 z-10 transition-transform duration-1000 ease-[cubic-bezier(0.85,0,0.15,1)] ${
          hasStarted ? '-translate-y-full shadow-[0_20px_50px_rgba(237,27,45,0.4)]' : 'translate-y-0'
        }`}
      >
        {/* Glow neon laser line at bottom edge */}
        <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-rb-red to-transparent shadow-[0_0_15px_#ED1B2D]" />
      </div>

      {/* Bottom Shutter Half */}
      <div
        className={`absolute bottom-0 left-0 right-0 h-1/2 bg-rb-dark/70 backdrop-blur-md border-t border-rb-yellow/40 z-10 transition-transform duration-1000 ease-[cubic-bezier(0.85,0,0.15,1)] ${
          hasStarted ? 'translate-y-full shadow-[0_-20px_50px_rgba(255,200,0,0.4)]' : 'translate-y-0'
        }`}
      >
        {/* Glow neon laser line at top edge */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-rb-yellow to-transparent shadow-[0_0_15px_#FFC800]" />
      </div>

      {/* ---------------- SUPERSONIC SHOCKWAVE / WARP FLASH ---------------- */}
      {hasStarted && (
        <div className="absolute inset-0 z-30 flex items-center justify-center pointer-events-none">
          {/* Radial shockwave pulse */}
          <div className="w-96 h-96 rounded-full bg-gradient-to-r from-rb-red/40 via-rb-yellow/50 to-white/60 blur-xl animate-shockwave" />
          {/* Central blinding flash */}
          <div className="absolute inset-0 bg-white/30 backdrop-blur-[2px] animate-pulse transition-opacity duration-700 opacity-0" />
        </div>
      )}

      {/* ---------------- FOREGROUND CONTENT LAYER ---------------- */}
      <div
        className={`relative z-20 h-full w-full flex flex-col justify-between p-6 sm:p-12 transition-all duration-700 ${
          hasStarted ? 'opacity-0 scale-125 blur-md' : 'opacity-100 scale-100 blur-0'
        }`}
      >
        {/* Top Header & Egyptian Coordinates Bar */}
        <div className="w-full flex flex-wrap items-center justify-between gap-3 text-xs font-mono tracking-widest text-rb-silver/80 uppercase">
          {/* Telemetry Indicator */}
          <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-black/40 border border-white/10 backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-rb-red animate-ping" />
            <span className="text-white font-semibold">REDBULL // TELEMETRY BUFFER</span>
          </div>

          {/* Egypt Geographic Coordinate Badge */}
          <div className="flex items-center gap-4 text-[11px] font-mono">
            <div className="hidden sm:flex items-center gap-1.5 text-rb-yellow">
              <Compass className="w-3.5 h-3.5" />
              <span>29.9792° N, 31.1342° E</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-rb-red/10 border border-rb-red/30 text-white">
              <MapPin className="w-3 h-3 text-rb-red" />
              <span>GIZA PLATEAU • EGYPT 🇪🇬</span>
            </div>
          </div>
        </div>

        {/* Center Stage: Red Bull Emblem & Gravity Unleashed */}
        <div className="flex flex-col items-center text-center max-w-2xl mx-auto my-auto py-4">
          {/* Egypt Expedition Tagline */}
          <div className="inline-flex items-center gap-2 px-4 py-1 mb-5 rounded-full bg-black/50 border border-rb-yellow/30 text-rb-yellow font-mono text-[11px] font-semibold tracking-widest uppercase shadow-sm whitespace-nowrap">
            <Flame className="w-3.5 h-3.5 text-rb-red shrink-0" />
            <span>CAIRO • GIZA DUNES • DAHAB • SINAI // 2026</span>
          </div>

          {/* Official Red Bull Logo */}
          <img
            src="/redbull-logo.svg"
            alt="Red Bull"
            className="h-14 sm:h-18 w-auto object-contain mb-4 drop-shadow-[0_10px_25px_rgba(237,27,45,0.4)] animate-fade-in"
          />

          {/* Monumental Headline */}
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-display font-black tracking-tighter text-white mb-2 leading-tight drop-shadow-2xl flex flex-wrap items-center justify-center gap-x-3">
            <span>GRAVITY</span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-rb-red via-rb-yellow to-rb-red whitespace-nowrap">
              UNLEASHED
            </span>
          </h1>

          <p className="text-xs sm:text-sm font-mono text-rb-silver max-w-md mt-2 drop-shadow-md">
            Calibrating 3D aerodynamic physics, Dakar desert telemetry, and Egyptian Sahara terrain shaders.
          </p>

          {/* Progress Bar & Numeric Readout */}
          <div className="w-full max-w-xs sm:max-w-sm mt-8">
            <div className="flex justify-between items-baseline text-xs font-mono mb-2">
              <span className="text-rb-silver/80 tracking-widest uppercase flex items-center gap-1.5">
                <Radio className="w-3 h-3 text-rb-red animate-pulse" />
                <span>SYNCING KINETICS</span>
              </span>
              <span className="text-2xl font-bold font-display text-rb-yellow drop-shadow-[0_0_10px_rgba(255,200,0,0.5)]">
                {progress}%
              </span>
            </div>
            <div className="w-full h-2 bg-rb-navy/80 rounded-full overflow-hidden border border-white/15 backdrop-blur-sm p-[1px]">
              <div
                className="h-full bg-gradient-to-r from-rb-red via-rb-yellow to-rb-cyan rounded-full transition-all duration-100 ease-out shadow-[0_0_12px_rgba(237,27,45,0.7)]"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Action Navigation Buttons */}
          <div className="mt-8 min-h-[56px] flex items-center justify-center">
            {isReady ? (
              <div className="flex flex-col sm:flex-row items-center gap-3 animate-fade-in">
                {/* Enter with Audio Button */}
                <button
                  onClick={() => handleEnter(true)}
                  className="group relative inline-flex items-center gap-3 px-8 py-3.5 rounded-full bg-gradient-to-r from-rb-red to-[#d40026] hover:from-[#ff1f35] hover:to-rb-red text-white font-display font-bold text-sm tracking-widest uppercase transition-all duration-300 shadow-glow-red hover:scale-105 active:scale-95 border border-white/20"
                >
                  <Volume2 className="w-4 h-4 animate-pulse text-rb-yellow" />
                  <span>ENTER EXPEDITION</span>
                  <Zap className="w-4 h-4 text-white group-hover:translate-x-0.5 transition-transform" />
                </button>

                {/* Enter Muted Button */}
                <button
                  onClick={() => handleEnter(false)}
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-black/40 hover:bg-black/60 text-rb-silver hover:text-white font-mono text-xs tracking-wider border border-white/10 hover:border-white/20 transition-all duration-200"
                >
                  <VolumeX className="w-3.5 h-3.5 text-rb-muted" />
                  <span>Muted Launch</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-xs font-mono text-rb-muted tracking-widest uppercase">
                <span className="w-1.5 h-1.5 rounded-full bg-rb-yellow animate-ping" />
                <span>BUFFERING 3D TELEMETRY & ASSETS...</span>
              </div>
            )}
          </div>
        </div>

        {/* Bottom Telemetry & Egyptian Venue Footnote */}
        <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-2 text-[10px] font-mono text-rb-silver/60 pt-4 border-t border-white/10">
          <div className="flex items-center gap-2 whitespace-nowrap">
            <span className="text-rb-red font-bold">RED BULL GIVES YOU WINGS ®</span>
            <span className="hidden sm:inline">•</span>
            <span className="hidden sm:inline">EXPEDITION VENUE: GIZA PYRAMIDS DUNES</span>
          </div>
          <div className="whitespace-nowrap">CAIRO // SINAI // DAHAB • NOV 13–15, 2026</div>
        </div>
      </div>
    </div>
  );
};
