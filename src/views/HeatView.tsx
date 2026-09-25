import React, { useState, useEffect } from 'react';
import { MANIFEST, WHAT_WORKS_OPTIONS } from '../data/manifest';
import { useShowroomStore } from '../store/showroomStore';
import { ScoreCard } from '../components/ScoreCard';
import { VerdictType } from '../types';

interface HeatViewProps {
  slug: string;
  onNavigate: (path: string) => void;
}

export const HeatView: React.FC<HeatViewProps> = ({ slug, onNavigate }) => {
  const currentIndex = MANIFEST.findIndex((m) => m.slug === slug);
  const currentHeat = currentIndex !== -1 ? MANIFEST[currentIndex] : MANIFEST[0];
  const activeSlug = currentHeat.slug;

  const { getVerdict, updateVerdict } = useShowroomStore();
  const verdict = getVerdict(activeSlug);

  const [viewMode, setViewMode] = useState<'desktop' | 'mobile'>('desktop');
  const [iframeLoaded, setIframeLoaded] = useState(false);
  const [panelOpen, setPanelOpen] = useState(false);

  const prevHeat = currentIndex > 0 ? MANIFEST[currentIndex - 1] : null;
  const isLastHeat = currentIndex === MANIFEST.length - 1;
  const nextHeat = !isLastHeat ? MANIFEST[currentIndex + 1] : null;

  const heatNumber = `HEAT 0${currentIndex + 1}`;
  const heatTotal = `0${MANIFEST.length}`;

  // Reset iframeLoaded state whenever slug changes
  useEffect(() => {
    setIframeLoaded(false);
  }, [activeSlug]);

  // Keyboard shortcut listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.isContentEditable)
      ) {
        return;
      }

      if (e.key === 'ArrowLeft' && prevHeat) {
        e.preventDefault();
        onNavigate(`heat/${prevHeat.slug}`);
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        if (nextHeat) {
          onNavigate(`heat/${nextHeat.slug}`);
        } else {
          onNavigate('results');
        }
      } else if (e.key === 's' || e.key === 'S') {
        e.preventDefault();
        setPanelOpen((prev) => !prev);
      } else if (e.key === 'Escape' && panelOpen) {
        e.preventDefault();
        setPanelOpen(false);
      } else if (panelOpen) {
        if (e.key >= '1' && e.key <= '9') {
          e.preventDefault();
          updateVerdict(activeSlug, { score: parseInt(e.key, 10) });
        } else if (e.key === '0') {
          e.preventDefault();
          updateVerdict(activeSlug, { score: 10 });
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [prevHeat, nextHeat, panelOpen, activeSlug, onNavigate, updateVerdict]);

  const handleScoreSelect = (num: number) => {
    updateVerdict(activeSlug, { score: num });
  };

  const handleVerdictSelect = (type: VerdictType) => {
    const newVerdict = verdict.verdict === type ? null : type;
    updateVerdict(activeSlug, { verdict: newVerdict });
  };

  const handleLikeToggle = (chip: string) => {
    const nextLikes = verdict.likes.includes(chip)
      ? verdict.likes.filter((item) => item !== chip)
      : [...verdict.likes, chip];
    updateVerdict(activeSlug, { likes: nextLikes });
  };

  const handleNoteChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    updateVerdict(activeSlug, { note: e.target.value });
  };

  const handleSaveAndNext = () => {
    if (isLastHeat) {
      onNavigate('results');
    } else if (nextHeat) {
      onNavigate(`heat/${nextHeat.slug}`);
    }
  };

  const posterSrc =
    viewMode === 'mobile'
      ? `/drafts/posters/${activeSlug}-mobile.jpg`
      : `/drafts/posters/${activeSlug}.jpg`;

  return (
    <div className="relative w-screen h-screen bg-ink overflow-hidden flex flex-col select-none">
      {/* Draft Workspace (Area above the 56px judge bar) */}
      <div className="relative flex-1 w-full overflow-hidden flex items-center justify-center">
        {/* Loading poster layer underneath */}
        <div
          className={`absolute inset-0 flex items-center justify-center bg-ink transition-opacity duration-500 z-0 ${
            iframeLoaded ? 'opacity-0 pointer-events-none' : 'opacity-100'
          }`}
        >
          <img
            src={posterSrc}
            alt=""
            className="w-full h-full object-cover object-top opacity-40 blur-[1px]"
          />
          <div className="absolute inset-0 bg-ink/50 flex flex-col items-center justify-center gap-3">
            <div className="w-6 h-6 border-2 border-card border-t-transparent animate-spin rounded-full" />
            <div className="font-utility text-xs tracking-utility text-paper uppercase">
              LOADING DRAFT // {currentHeat.name}
            </div>
          </div>
        </div>

        {/* Viewport frame: Desktop vs Mobile */}
        {viewMode === 'desktop' ? (
          <iframe
            key={activeSlug}
            src={`/drafts/${activeSlug}/index.html`}
            title={`${currentHeat.name} draft`}
            onLoad={() => setIframeLoaded(true)}
            className="relative z-10 w-full h-full border-0 bg-ink"
          />
        ) : (
          <div className="relative z-10 py-4 flex items-center justify-center w-full h-full">
            {/* Phone bezel frame */}
            <div
              className="relative w-[390px] max-w-[92vw] h-[min(844px,calc(100vh-80px))] bg-black border-[7px] border-[#252830] rounded-[38px] shadow-2xl overflow-hidden flex flex-col"
              style={{
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7)',
              }}
            >
              {/* Phone speaker pill notch */}
              <div className="absolute top-2 left-1/2 -translate-x-1/2 w-28 h-4 bg-black rounded-full z-20 pointer-events-none flex items-center justify-center">
                <div className="w-10 h-1 bg-[#252830] rounded-full" />
              </div>

              {/* Mobile iframe */}
              <iframe
                key={activeSlug}
                src={`/drafts/${activeSlug}/index.html`}
                title={`${currentHeat.name} draft`}
                onLoad={() => setIframeLoaded(true)}
                className="w-full h-full border-0 bg-ink"
              />
            </div>
          </div>
        )}

        {/* Scorecard Panel: Drawer on desktop (420px), bottom sheet on mobile (<768px).
            Note: No blocking backdrop so the draft remains visible & interactive beside it! */}
        {panelOpen && (
          <aside
            aria-label="Scorecard panel"
            className="fixed right-0 top-0 bottom-[56px] w-full md:w-[420px] bg-paper text-ink border-l border-slate/30 z-30 shadow-2xl flex flex-col justify-between overflow-y-auto animate-in slide-in-from-right duration-200"
          >
            {/* Panel Header */}
            <div className="p-4 sm:p-5 border-b border-slate/20 flex items-center justify-between">
              <div>
                <div className="font-utility text-[11px] tracking-utility text-slate font-bold">
                  {heatNumber} // SCORECARD
                </div>
                <h3
                  className="font-display font-black text-2xl uppercase tracking-tight text-ink"
                  style={{ fontVariationSettings: "'wdth' 75, 'wght' 850" }}
                >
                  {currentHeat.name}
                </h3>
              </div>
              <button
                onClick={() => setPanelOpen(false)}
                className="w-8 h-8 flex items-center justify-center text-slate hover:text-ink border border-slate/30 hover:border-ink rounded-[2px] transition-colors font-bold font-utility text-sm cursor-pointer"
                aria-label="Close scorecard"
              >
                ✕
              </button>
            </div>

            {/* Scorecard Body */}
            <div className="p-5 flex-1 flex flex-col gap-6">
              {/* Raising Yellow Score Card */}
              <div className="flex justify-center py-2">
                <ScoreCard
                  score={verdict.score}
                  heatLabel={heatNumber}
                  draftName={currentHeat.name}
                  size="large"
                  triggerKey={verdict.score}
                />
              </div>

              {/* Score Numeral Row (1 to 10) */}
              <div>
                <label className="block font-utility text-[11px] tracking-utility text-slate font-bold mb-2">
                  SCORE (1 - 10)
                </label>
                <div className="grid grid-cols-10 gap-1">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => {
                    const isSelected = verdict.score === num;
                    return (
                      <button
                        key={num}
                        onClick={() => handleScoreSelect(num)}
                        className={`h-10 font-utility text-xs font-bold border transition-all cursor-pointer rounded-[2px] ${
                          isSelected
                            ? 'bg-card text-ink border-ink shadow-sm'
                            : 'bg-paper text-ink border-slate/30 hover:border-ink hover:bg-slate/10'
                        }`}
                      >
                        {num}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Verdict Segmented Control: Keep / Maybe / Cut */}
              <div>
                <label className="block font-utility text-[11px] tracking-utility text-slate font-bold mb-2">
                  VERDICT
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['keep', 'maybe', 'cut'] as const).map((type) => {
                    const isActive = verdict.verdict === type;
                    let activeClass = 'bg-ink text-paper border-ink';
                    if (type === 'cut') activeClass = 'bg-cut text-white border-cut';
                    if (type === 'maybe') activeClass = 'bg-slate text-paper border-slate';

                    return (
                      <button
                        key={type}
                        onClick={() => handleVerdictSelect(type)}
                        className={`py-2 px-3 font-utility text-xs font-bold uppercase border transition-all cursor-pointer rounded-[2px] ${
                          isActive
                            ? activeClass
                            : 'bg-paper text-slate border-slate/30 hover:border-slate hover:text-ink'
                        }`}
                      >
                        {type}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* What Works Chips (Multi-select) */}
              <div>
                <label className="block font-utility text-[11px] tracking-utility text-slate font-bold mb-2">
                  WHAT WORKS
                </label>
                <div className="flex flex-wrap gap-2">
                  {WHAT_WORKS_OPTIONS.map((chip) => {
                    const isSelected = verdict.likes.includes(chip);
                    return (
                      <button
                        key={chip}
                        onClick={() => handleLikeToggle(chip)}
                        className={`px-3 py-1.5 font-utility text-[11px] font-bold tracking-utility border transition-all cursor-pointer rounded-[2px] ${
                          isSelected
                            ? 'bg-ink text-paper border-ink'
                            : 'bg-paper text-slate border-slate/30 hover:border-ink hover:text-ink'
                        }`}
                      >
                        {chip}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Note Textarea: "What would you change?" */}
              <div>
                <label
                  htmlFor="change-notes"
                  className="block font-utility text-[11px] tracking-utility text-slate font-bold mb-2"
                >
                  WHAT WOULD YOU CHANGE?
                </label>
                <textarea
                  id="change-notes"
                  value={verdict.note}
                  onChange={handleNoteChange}
                  placeholder="Notes on typography, composition, rhythm, or specific arena concepts..."
                  rows={3}
                  className="w-full p-3 font-sans text-sm bg-white border border-slate/30 text-ink placeholder:text-slate/50 focus:border-ink rounded-[2px] resize-y focus:outline-none"
                />
              </div>

              {/* Action Button: Save and next / Save and see results */}
              <button
                onClick={handleSaveAndNext}
                className="w-full py-3.5 bg-card text-ink font-utility font-bold text-xs tracking-utility border-2 border-ink rounded-[2px] shadow-sm hover:bg-card/90 active:translate-y-[1px] transition-all cursor-pointer mt-2"
              >
                {isLastHeat ? 'SAVE AND SEE RESULTS' : 'SAVE AND NEXT HEAT →'}
              </button>
            </div>

            {/* Panel Footer Keyboard Hints */}
            <div className="p-3 bg-slate/10 border-t border-slate/20 font-utility text-[10px] tracking-utility text-slate flex flex-wrap items-center justify-between gap-2">
              <span>[←/→] HEATS</span>
              <span>[S] SCORECARD</span>
              <span>[1-0] SCORE</span>
              <span>[ESC] CLOSE</span>
            </div>
          </aside>
        )}
      </div>

      {/* Bottom Judge Bar: 56px height, ink #0E1116 background, paper #F4F5F2 text */}
      <footer
        className="relative z-20 h-[56px] w-full bg-ink text-paper border-t border-slate/30 flex items-center justify-between px-3 sm:px-6 select-none font-utility text-xs tracking-utility"
        style={{ backgroundColor: '#0E1116' }}
      >
        {/* Left: Navigation and Heat Title */}
        <div className="flex items-center gap-2 sm:gap-4 min-w-0 overflow-hidden">
          <button
            onClick={() => prevHeat && onNavigate(`heat/${prevHeat.slug}`)}
            disabled={!prevHeat}
            className={`px-2.5 py-1 border rounded-[2px] transition-colors font-bold font-utility text-xs tracking-utility ${
              prevHeat
                ? 'border-paper/40 text-paper hover:bg-paper/10 hover:border-paper cursor-pointer'
                : 'border-paper/10 text-paper/20 opacity-30 cursor-not-allowed'
            }`}
            aria-label="Previous heat"
          >
            ← PREV
          </button>

          <div className="flex items-center gap-2 min-w-0 truncate">
            <span className="font-utility text-xs font-bold text-paper/80 whitespace-nowrap">
              {heatNumber} / {heatTotal}
            </span>
            <span className="text-paper/40">·</span>
            <span
              className="font-display font-black uppercase tracking-tight text-paper truncate text-[15px] sm:text-[16px]"
              style={{ fontVariationSettings: "'wdth' 75, 'wght' 850" }}
            >
              {currentHeat.name}
            </span>
          </div>
        </div>

        {/* Center: Desktop / Mobile toggle */}
        <div className="hidden md:flex items-center border border-paper/30 rounded-[2px] p-0.5">
          <button
            onClick={() => setViewMode('desktop')}
            className={`px-3 py-1 font-utility text-[11px] tracking-utility rounded-[1px] transition-colors cursor-pointer ${
              viewMode === 'desktop'
                ? 'bg-paper text-ink font-bold'
                : 'text-paper/80 hover:text-paper hover:bg-paper/10'
            }`}
          >
            DESKTOP
          </button>
          <button
            onClick={() => setViewMode('mobile')}
            className={`px-3 py-1 font-utility text-[11px] tracking-utility rounded-[1px] transition-colors cursor-pointer ${
              viewMode === 'mobile'
                ? 'bg-paper text-ink font-bold'
                : 'text-paper/80 hover:text-paper hover:bg-paper/10'
            }`}
          >
            MOBILE (390PX)
          </button>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
          {/* Open in new tab */}
          <a
            href={`/drafts/${activeSlug}/index.html`}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center gap-1.5 text-paper border border-paper/40 hover:bg-paper/10 hover:border-paper transition-colors py-1 px-2.5 font-bold font-utility text-xs tracking-utility rounded-[2px]"
          >
            OPEN ↗
          </a>

          {/* Score Button (Yellow #FFD200) */}
          <button
            onClick={() => setPanelOpen((prev) => !prev)}
            className="bg-card text-ink font-bold font-utility px-4 py-1.5 border border-ink rounded-[2px] hover:bg-card/90 active:translate-y-[1px] transition-all flex items-center gap-2 shadow-sm cursor-pointer"
          >
            <span>SCORE</span>
            {verdict.score !== null && (
              <span className="bg-ink text-card px-1.5 py-0.2 text-[10px] font-black rounded-[1px]">
                {verdict.score}
              </span>
            )}
          </button>

          {/* Next Heat */}
          <button
            onClick={() =>
              nextHeat ? onNavigate(`heat/${nextHeat.slug}`) : onNavigate('results')
            }
            className="px-2.5 py-1 border border-paper/40 hover:bg-paper/10 hover:border-paper text-paper font-bold font-utility text-xs tracking-utility rounded-[2px] transition-colors cursor-pointer"
            aria-label={isLastHeat ? 'See results' : 'Next heat'}
          >
            {isLastHeat ? 'RESULTS →' : 'NEXT →'}
          </button>

          {/* Lineup Link */}
          <button
            onClick={() => onNavigate('lineup')}
            className="text-paper/90 hover:text-paper transition-colors underline underline-offset-4 decoration-paper/40 text-xs hidden lg:inline font-utility cursor-pointer"
          >
            LINEUP
          </button>
        </div>
      </footer>
    </div>
  );
};
