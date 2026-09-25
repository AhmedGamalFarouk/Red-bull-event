import React from 'react';
import { MANIFEST } from '../data/manifest';
import { useShowroomStore } from '../store/showroomStore';

interface CompareViewProps {
  slugA: string;
  slugB: string;
  onNavigate: (path: string) => void;
}

export const CompareView: React.FC<CompareViewProps> = ({ slugA, slugB, onNavigate }) => {
  const { getVerdict } = useShowroomStore();

  const draftA = MANIFEST.find((m) => m.slug === slugA) || MANIFEST[0];
  const draftB = MANIFEST.find((m) => m.slug === slugB) || (MANIFEST[1] || MANIFEST[0]);

  const verdictA = getVerdict(draftA.slug);
  const verdictB = getVerdict(draftB.slug);

  const handleSelectA = (newSlug: string) => {
    onNavigate(`compare/${newSlug}/${draftB.slug}`);
  };

  const handleSelectB = (newSlug: string) => {
    onNavigate(`compare/${draftA.slug}/${newSlug}`);
  };

  return (
    <div className="w-screen h-screen bg-ink text-paper flex flex-col overflow-hidden select-none">
      {/* Top Header Bar */}
      <header className="h-[48px] bg-ink border-b border-slate/30 flex items-center justify-between px-4 sm:px-6 font-utility text-xs tracking-utility flex-shrink-0">
        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate('results')}
            className="text-slate hover:text-paper transition-colors font-bold cursor-pointer"
          >
            ← RESULTS
          </button>
          <span className="text-slate/40">/</span>
          <span className="font-bold text-paper hidden sm:inline">
            SIDE-BY-SIDE EVALUATION
          </span>
        </div>

        <div className="flex items-center gap-4 text-slate">
          <span className="hidden md:inline">50/50 SPLIT COMPARISON</span>
          <button
            onClick={() => onNavigate('lineup')}
            className="text-slate hover:text-paper transition-colors underline underline-offset-4 decoration-slate/40"
          >
            LINEUP
          </button>
        </div>
      </header>

      {/* Side-by-side panes: 50/50 on >= 900px, stacked vertically on < 900px */}
      <main className="flex-1 flex flex-col min-[900px]:flex-row overflow-hidden">
        {/* Pane A */}
        <section
          aria-label={`Comparison pane for ${draftA.name}`}
          className="flex-1 flex flex-col border-b min-[900px]:border-b-0 min-[900px]:border-r border-slate/30 overflow-hidden"
        >
          {/* Pane Header */}
          <div className="h-[44px] bg-[#14181F] border-b border-slate/30 flex items-center justify-between px-4 font-utility text-xs tracking-utility flex-shrink-0">
            <div className="flex items-center gap-3 overflow-hidden">
              <span
                className="font-display font-black text-sm uppercase text-paper truncate"
                style={{ fontVariationSettings: "'wdth' 75, 'wght' 850" }}
              >
                {draftA.name}
              </span>
              {verdictA.score !== null ? (
                <span className="bg-card text-ink font-bold px-2 py-0.5 text-[10px] rounded-[1px]">
                  {verdictA.score}/10 PTS
                </span>
              ) : (
                <span className="text-slate/60 text-[10px]">UNSCORED</span>
              )}
            </div>

            {/* Select dropdown to swap draft A */}
            <div className="flex items-center gap-2">
              <label htmlFor="select-draft-a" className="text-slate text-[10px] hidden sm:inline">
                SWAP:
              </label>
              <select
                id="select-draft-a"
                value={draftA.slug}
                onChange={(e) => handleSelectA(e.target.value)}
                className="bg-ink text-paper border border-slate/40 px-2 py-1 text-[11px] font-utility rounded-[2px] focus:outline-none focus:border-card cursor-pointer"
              >
                {MANIFEST.map((m) => (
                  <option key={m.slug} value={m.slug}>
                    {m.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Iframe A */}
          <div className="flex-1 relative bg-ink overflow-hidden">
            <iframe
              key={draftA.slug}
              src={`/drafts/${draftA.slug}/index.html`}
              title={`${draftA.name} draft`}
              className="w-full h-full border-0 bg-ink"
            />
          </div>
        </section>

        {/* Pane B */}
        <section
          aria-label={`Comparison pane for ${draftB.name}`}
          className="flex-1 flex flex-col overflow-hidden"
        >
          {/* Pane Header */}
          <div className="h-[44px] bg-[#14181F] border-b border-slate/30 flex items-center justify-between px-4 font-utility text-xs tracking-utility flex-shrink-0">
            <div className="flex items-center gap-3 overflow-hidden">
              <span
                className="font-display font-black text-sm uppercase text-paper truncate"
                style={{ fontVariationSettings: "'wdth' 75, 'wght' 850" }}
              >
                {draftB.name}
              </span>
              {verdictB.score !== null ? (
                <span className="bg-card text-ink font-bold px-2 py-0.5 text-[10px] rounded-[1px]">
                  {verdictB.score}/10 PTS
                </span>
              ) : (
                <span className="text-slate/60 text-[10px]">UNSCORED</span>
              )}
            </div>

            {/* Select dropdown to swap draft B */}
            <div className="flex items-center gap-2">
              <label htmlFor="select-draft-b" className="text-slate text-[10px] hidden sm:inline">
                SWAP:
              </label>
              <select
                id="select-draft-b"
                value={draftB.slug}
                onChange={(e) => handleSelectB(e.target.value)}
                className="bg-ink text-paper border border-slate/40 px-2 py-1 text-[11px] font-utility rounded-[2px] focus:outline-none focus:border-card cursor-pointer"
              >
                {MANIFEST.map((m) => (
                  <option key={m.slug} value={m.slug}>
                    {m.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Iframe B */}
          <div className="flex-1 relative bg-ink overflow-hidden">
            <iframe
              key={draftB.slug}
              src={`/drafts/${draftB.slug}/index.html`}
              title={`${draftB.name} draft`}
              className="w-full h-full border-0 bg-ink"
            />
          </div>
        </section>
      </main>
    </div>
  );
};
