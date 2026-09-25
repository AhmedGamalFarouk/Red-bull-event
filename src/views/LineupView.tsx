import React from 'react';
import { MANIFEST } from '../data/manifest';
import { useShowroomStore } from '../store/showroomStore';
import { ScoreCard } from '../components/ScoreCard';

interface LineupViewProps {
  onNavigate: (path: string) => void;
}

export const LineupView: React.FC<LineupViewProps> = ({ onNavigate }) => {
  const { getVerdict, scoredCount } = useShowroomStore();

  return (
    <div className="min-h-screen bg-concrete text-ink flex flex-col justify-between p-6 sm:p-10 lg:p-12">
      {/* Top Bar */}
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate/30 pb-5 font-utility text-xs tracking-utility">
        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate('')}
            className="text-slate hover:text-ink transition-colors font-bold cursor-pointer"
          >
            ← INTRO
          </button>
          <span className="text-slate/40">/</span>
          <span className="font-bold text-ink">LINEUP</span>
        </div>

        <div className="flex items-center gap-4">
          <span className="text-slate">
            {scoredCount} OF {MANIFEST.length} SCORED
          </span>
          <button
            onClick={() => onNavigate('results')}
            disabled={scoredCount === 0}
            className={`font-utility font-bold text-xs tracking-utility px-5 py-2.5 border-2 border-ink rounded-[2px] transition-all ${
              scoredCount > 0
                ? 'bg-card text-ink hover:bg-card/90 cursor-pointer shadow-sm active:translate-y-[1px]'
                : 'bg-paper text-slate/40 border-slate/30 cursor-not-allowed'
            }`}
          >
            SEE RESULTS
          </button>
        </div>
      </header>

      {/* Lineup Grid */}
      <main className="flex-1 py-8 sm:py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {MANIFEST.map((item, index) => {
            const verdict = getVerdict(item.slug);
            const heatNum = `HEAT 0${index + 1}`;
            const isScored = verdict.score !== null;

            return (
              <article
                key={item.slug}
                onClick={() => onNavigate(`heat/${item.slug}`)}
                className="group bg-paper border border-slate/30 hover:border-ink hover:shadow-md transition-all duration-200 flex flex-col justify-between cursor-pointer rounded-[2px] overflow-hidden"
              >
                {/* Poster Thumbnail */}
                <div className="relative aspect-[16/10] bg-ink overflow-hidden border-b border-slate/20">
                  <img
                    src={item.poster}
                    alt={`${item.name} poster`}
                    className="w-full h-full object-cover object-top transition-transform duration-300 group-hover:scale-[1.02]"
                    loading="lazy"
                  />
                  <div className="absolute top-3 left-3 bg-ink/90 text-paper font-utility text-[10px] tracking-utility px-2.5 py-1 rounded-[2px]">
                    {heatNum}
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <h2
                        className="font-display font-black text-2xl sm:text-3xl text-ink uppercase tracking-tight"
                        style={{
                          fontVariationSettings: "'wdth' 75, 'wght' 850",
                        }}
                      >
                        {item.name}
                      </h2>

                      {/* Mini Score Card if scored */}
                      {isScored && (
                        <ScoreCard
                          score={verdict.score}
                          size="mini"
                          animateOnMount={false}
                        />
                      )}
                    </div>

                    <p className="text-slate text-sm leading-relaxed mb-6 font-sans">
                      {item.thesis}
                    </p>
                  </div>

                  {/* Status row */}
                  <div className="pt-4 border-t border-slate/20 flex items-center justify-between font-utility text-xs tracking-utility">
                    <span className="text-slate">STATUS</span>
                    {isScored ? (
                      <div className="flex items-center gap-2">
                        {verdict.verdict && (
                          <span
                            className={`px-2 py-0.5 text-[11px] font-bold uppercase rounded-[2px] ${
                              verdict.verdict === 'cut'
                                ? 'bg-cut text-white'
                                : verdict.verdict === 'keep'
                                ? 'bg-ink text-paper'
                                : 'bg-slate/20 text-ink'
                            }`}
                          >
                            {verdict.verdict}
                          </span>
                        )}
                        <span className="font-bold text-ink">
                          {verdict.score}/10 PTS
                        </span>
                      </div>
                    ) : (
                      <span className="text-slate/60 font-medium">UNSCORED</span>
                    )}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate/30 pt-4 flex items-center justify-between font-utility text-[11px] tracking-utility text-slate">
        <div>SELECT ANY HEAT TO ENTER FULL-SCREEN REVIEW</div>
        <div>RED BULL GRAVITY EGYPT</div>
      </footer>
    </div>
  );
};
