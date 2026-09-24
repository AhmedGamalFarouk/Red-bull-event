import React, { useState, useEffect, useRef } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Canvas3D } from './components/Canvas3D';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { AdrenalineSection } from './components/AdrenalineSection';
import { ArenasSection } from './components/ArenasSection';
import { AthletesSection } from './components/AthletesSection';
import { VenueExperienceSection } from './components/VenueExperienceSection';
import { ScheduleSection } from './components/ScheduleSection';
import { TicketSection } from './components/TicketSection';
import { Footer } from './components/Footer';
import { Preloader } from './components/Preloader';
import { FLAVORS, FlavorConfig } from './components/RedBullCan';
import { audio } from './utils/audio';

gsap.registerPlugin(ScrollTrigger);

export const App: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeFlavor, setActiveFlavor] = useState<FlavorConfig>(FLAVORS[0]);
  const [audioActive, setAudioActive] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const lenisRef = useRef<Lenis | null>(null);

  // Initialize Lenis smooth scroll and integrate with GSAP ScrollTrigger
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.3,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });
    lenisRef.current = lenis;

    lenis.on('scroll', (e) => {
      ScrollTrigger.update();

      // Feed scroll velocity into continuous liquid sloshing engine
      if (Math.abs(e.velocity) > 0.1) {
        audio.feedScrollVelocity(Math.abs(e.velocity));
      }
    });

    const tickerCallback = (time: number) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(tickerCallback);
    gsap.ticker.lagSmoothing(0);

    // Global ScrollTrigger to track overall progress through page
    const trigger = ScrollTrigger.create({
      start: 'top top',
      end: 'bottom bottom',
      onUpdate: (self) => {
        setScrollProgress(self.progress);
      },
    });

    return () => {
      trigger.kill();
      gsap.ticker.remove(tickerCallback);
      lenis.destroy();
    };
  }, []);

  // Track mouse coordinates for 3D can gyro-tilt
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = -(e.clientY / window.innerHeight) * 2 + 1;
      setMousePos({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Smooth scroll to targeted section
  const handleNavigate = (sectionId: string) => {
    const target = document.getElementById(sectionId);
    if (target && lenisRef.current) {
      lenisRef.current.scrollTo(target, { offset: -60, duration: 1.6 });
    }
  };

  const handleScrollToTop = () => {
    if (lenisRef.current) {
      lenisRef.current.scrollTo(0, { duration: 1.8 });
    }
  };

  const handleToggleAudio = () => {
    const isNowActive = audio.toggle();
    setAudioActive(isNowActive);
  };

  return (
    <div className="relative min-h-screen bg-rb-dark text-white overflow-hidden film-grain">
      {/* Cinematic Intro Preloader */}
      {loading && (
        <Preloader
          onComplete={() => {
            setLoading(false);
            setAudioActive(audio.enabled);
          }}
        />
      )}

      {/* Dynamic Background Energy Glow Orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div
          className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full blur-[140px] opacity-25 transition-all duration-1000"
          style={{ backgroundColor: activeFlavor.accentColor }}
        />
        <div
          className="absolute top-1/2 -right-40 w-[650px] h-[650px] rounded-full blur-[160px] opacity-20 transition-all duration-1000"
          style={{ backgroundColor: activeFlavor.lightColor }}
        />
        <div
          className="absolute -bottom-40 left-1/3 w-[700px] h-[700px] rounded-full blur-[180px] opacity-15 transition-all duration-1000"
          style={{ backgroundColor: activeFlavor.accentColor }}
        />
      </div>

      {/* Persistent 3D WebGL Canvas Layer */}
      <Canvas3D
        scrollProgress={scrollProgress}
        activeFlavor={activeFlavor}
        mousePos={mousePos}
        onCanClick={() => audio.playLiquidSplash(0.85)}
      />

      {/* Top Navbar */}
      <Navbar
        onNavigate={handleNavigate}
        audioActive={audioActive}
        onToggleAudio={handleToggleAudio}
      />

      {/* Scroll Sections Container */}
      <main className="relative z-20">
        {/* Hero Chapter */}
        <HeroSection
          onExploreClick={() => handleNavigate('arenas')}
        />

        {/* Chapter 01: The Four Egyptian Arenas */}
        <ArenasSection />

        {/* Chapter 02: World Apex Athletes Roster */}
        <AthletesSection />

        {/* Chapter 03: Festival Hubs & Energy Lab Experience */}
        <VenueExperienceSection />

        {/* Chapter 04: Anatomy & Desert Hydration Science */}
        <AdrenalineSection />

        {/* Chapter 05: Event Schedule & Lineup */}
        <ScheduleSection />

        {/* Chapter 07: Expanded Ticket Passes & Trip Customization */}
        <TicketSection />
      </main>

      {/* Kinetic Footer */}
      <Footer onScrollToTop={handleScrollToTop} />
    </div>
  );
};

export default App;
