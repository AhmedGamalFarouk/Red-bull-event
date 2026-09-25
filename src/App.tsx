import React, { useState, useEffect, useRef, useCallback } from 'react';
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

const SECTION_IDS = ['hero', 'arenas', 'athletes', 'experience', 'anatomy', 'schedule', 'tickets'];

export const App: React.FC = () => {
  const [loading, setLoading] = useState(true);
  // True once the preloader starts revealing the scene: hero + nav intros land with the can
  const [revealed, setRevealed] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeFlavor, setActiveFlavor] = useState<FlavorConfig>(FLAVORS[0]);
  const [audioActive, setAudioActive] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const lenisRef = useRef<Lenis | null>(null);

  // Compute exact section-anchored progress (0 to 6)
  const calculateSectionProgress = useCallback(() => {
    const scrollY = window.scrollY || window.pageYOffset;
    const viewportHeight = window.innerHeight;
    const viewportCenter = scrollY + viewportHeight * 0.5;

    const centers = SECTION_IDS.map((id) => {
      const el = document.getElementById(id);
      if (!el) return 0;
      const rect = el.getBoundingClientRect();
      return scrollY + rect.top + rect.height * 0.5;
    });

    if (centers.length === 0 || centers[0] === 0) return 0;

    // Above or at first section
    if (viewportCenter <= centers[0]) {
      return 0;
    }
    // Below or at last section
    if (viewportCenter >= centers[centers.length - 1]) {
      return centers.length - 1;
    }

    // Interpolate between the two bounding section centers
    for (let i = 0; i < centers.length - 1; i++) {
      if (viewportCenter >= centers[i] && viewportCenter <= centers[i + 1]) {
        const span = centers[i + 1] - centers[i];
        const localT = span > 0 ? (viewportCenter - centers[i]) / span : 0;
        return i + localT;
      }
    }

    return 0;
  }, []);

  // Initialize Lenis smooth scroll and integrate with GSAP ScrollTrigger
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.3,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });
    lenisRef.current = lenis;

    const handleScroll = (e: { velocity: number }) => {
      ScrollTrigger.update();

      // Update section-anchored progress smoothly
      const progress = calculateSectionProgress();
      setScrollProgress(progress);

      // Feed scroll velocity into continuous liquid sloshing engine
      if (Math.abs(e.velocity) > 0.1) {
        audio.feedScrollVelocity(Math.abs(e.velocity));
      }
    };

    lenis.on('scroll', handleScroll);

    const tickerCallback = (time: number) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(tickerCallback);
    gsap.ticker.lagSmoothing(0);

    // Initial calculation after elements mount
    const timer = setTimeout(() => {
      setScrollProgress(calculateSectionProgress());
      ScrollTrigger.refresh();
    }, 150);

    window.addEventListener('resize', ScrollTrigger.refresh);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', ScrollTrigger.refresh);
      gsap.ticker.remove(tickerCallback);
      lenis.destroy();
    };
  }, [calculateSectionProgress]);

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
          onReveal={() => setRevealed(true)}
          onComplete={() => {
            setLoading(false);
            setAudioActive(audio.enabled);
            setTimeout(() => {
              setScrollProgress(calculateSectionProgress());
              ScrollTrigger.refresh();
            }, 100);
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
        ready={revealed}
        onNavigate={handleNavigate}
        activeId={SECTION_IDS[Math.round(scrollProgress)] ?? 'hero'}
        progress={scrollProgress / (SECTION_IDS.length - 1)}
        audioActive={audioActive}
        onToggleAudio={handleToggleAudio}
      />

      {/* Scroll Sections Container */}
      <main className="relative z-20">
        {/* Hero Chapter (Index 0) */}
        <HeroSection
          ready={revealed}
          onExploreClick={() => handleNavigate('arenas')}
          onPassesClick={() => handleNavigate('tickets')}
        />

        {/* Chapter 01: The Four Egyptian Arenas (Index 1) */}
        <ArenasSection />

        {/* Chapter 02: World Apex Athletes Roster (Index 2) */}
        <AthletesSection />

        {/* Chapter 03: Festival Hubs & Energy Lab Experience (Index 3) */}
        <VenueExperienceSection />

        {/* Chapter 04: Anatomy & Desert Hydration Science (Index 4) */}
        <AdrenalineSection />

        {/* Chapter 05: Event Schedule & Lineup (Index 5) */}
        <ScheduleSection />

        {/* Chapter 06: Expanded Ticket Passes & Trip Customization (Index 6) */}
        <TicketSection />
      </main>

      {/* Kinetic Footer */}
      <Footer onScrollToTop={handleScrollToTop} />
    </div>
  );
};

export default App;
