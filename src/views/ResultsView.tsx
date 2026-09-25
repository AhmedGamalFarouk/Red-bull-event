import React, { useRef, useState, useMemo } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { MANIFEST } from '../data/manifest';
import { useShowroomStore } from '../store/showroomStore';
import { ScoreCard } from '../components/ScoreCard';
import { DraftManifestEntry, HeatVerdict } from '../types';

gsap.registerPlugin(useGSAP);

interface ResultsViewProps {
  onNavigate: (path: string) => void;
}

interface RankedDraft {
  rank: number | null;
  entry: DraftManifestEntry;
  verdict: HeatVerdict;
}

export const ResultsView: React.FC<ResultsViewProps> = ({ onNavigate }) => {
  const { state, getVerdict, clearAllVerdicts } = useShowroomStore();
  const [copied, setCopied] = useState(false);
  const panelCardsContainerRef = useRef<HTMLDivElement>(null);

  // Rank drafts: scored first (score desc, ties by manifest order), unscored last
  const rankedDrafts: RankedDraft[] = useMemo(() => {
    const list = MANIFEST.map((entry) => ({
      entry,
      verdict: getVerdict(entry.slug),
    }));

    const scored = list
      .filter((item) => item.verdict.score !== null)
      .sort((a, b) => {
        const diff = (b.verdict.score || 0) - (a.verdict.score || 0);
        if (diff !== 0) return diff;
        return MANIFEST.indexOf(a.entry) - MANIFEST.indexOf(b.entry);
      });

    const unscored = list.filter((item) => item.verdict.score === null);

    return [
      ...scored.map((item, index) => ({ rank: index + 1, ...item })),
      ...unscored.map((item) => ({ rank: null, ...item })),
    ];
  }, [state, getVerdict]);

  const scoredEntries = useMemo(() => {
    return rankedDrafts.filter((d) => d.verdict.score !== null);
  }, [rankedDrafts]);

  // Stagger raise animation for the judging panel cards using gsap.matchMedia
  useGSAP(
    () => {
      if (scoredEntries.length === 0 || !panelCardsContainerRef.current) return;

      const cards = panelCardsContainerRef.current.querySelectorAll('.jury-panel-card');
      const numerals = panelCardsContainerRef.current.querySelectorAll('.jury-panel-numeral');

      if (cards.length === 0) return;

      const mm = gsap.matchMedia();

      mm.add(
        {
          reduce: '(prefers-reduced-motion: reduce)',
          noPreference: '(prefers-reduced-motion: no-preference)',
        },
        (context) => {
          const { reduce } = context.conditions as {
            reduce: boolean;
            noPreference: boolean;
          };

          if (reduce) {
            gsap.set(cards, { rotationX: 0, opacity: 1, transformOrigin: 'bottom center' });
            gsap.set(numerals, { '--wdth': 125 });
          } else {
            const tl = gsap.timeline();
            tl.fromTo(
              cards,
              {
                rotationX: 90,
                opacity: 0.3,
                transformOrigin: 'bottom center',
                transformPerspective: 800,
              },
              {
                rotationX: 0,
                opacity: 1,
                duration: 0.6,
                stagger: 0.08,
                ease: 'back.out(1.4)',
                clearProps: 'transformPerspective',
              }
            );

            tl.fromTo(
              numerals,
              {
                '--wdth': 75,
              },
              {
                '--wdth': 125,
                duration: 0.6,
                stagger: 0.08,
                ease: 'back.out(1.4)',
              },
              0
            );
          }
        }
      );
    },
    { scope: panelCardsContainerRef, dependencies: [scoredEntries.length] }
  );

  const handleCopySummary = async () => {
    const lines: string[] = [
      'RED BULL GRAVITY EGYPT 2026 — DESIGN SHOWROOM VERDICT',
      '='.repeat(54),
      '',
    ];

    rankedDrafts.forEach((item) => {
      const rankStr = item.rank !== null ? `#${item.rank}` : 'UNSCORED';
      const scoreStr = item.verdict.score !== null ? `${item.verdict.score}/10` : '—';
      const verdictStr = item.verdict.verdict ? item.verdict.verdict.toUpperCase() : 'NO VERDICT';

      lines.push(`${rankStr}: ${item.entry.name} (${scoreStr} PTS, VERDICT: ${verdictStr})`);
      lines.push(`Commit: ${item.entry.commit} | Thesis: ${item.entry.thesis}`);
      if (item.verdict.likes.length > 0) {
        lines.push(`What works: ${item.verdict.likes.join(', ')}`);
      }
      if (item.verdict.note.trim()) {
        lines.push(`Notes: ${item.verdict.note.trim()}`);
      }
      lines.push('-'.repeat(40));
    });

    try {
      await navigator.clipboard.writeText(lines.join('\n'));
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch (err) {
      console.error('Failed to copy summary:', err);
    }
  };

  const handleDownloadJSON = () => {
    const payload = {
      event: 'Red Bull Gravity Egypt 2026',
      purpose: 'Design Showroom Jury Verdict',
      exportedAt: new Date().toISOString(),
      ranks: rankedDrafts.map((item) => ({
        rank: item.rank,
        slug: item.entry.slug,
        name: item.entry.name,
        commit: item.entry.commit,
        ref: item.entry.ref,
        thesis: item.entry.thesis,
        builtAt: item.entry.builtAt,
        score: item.verdict.score,
        verdict: item.verdict.verdict,
        likes: item.verdict.likes,
        note: item.verdict.note,
        updatedAt: item.verdict.updatedAt,
      })),
    };

    const blob = new Blob([JSON.stringify(payload, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'showroom-verdict.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleClearAll = () => {
    if (window.confirm('Clear all jury scores and change notes? This cannot be undone.')) {
      clearAllVerdicts();
    }
  };

  const topTwo = scoredEntries.slice(0, 2);
  const canCompare = topTwo.length >= 2;

  return (
    <div className="min-h-screen bg-concrete text-ink flex flex-col justify-between p-6 sm:p-10 lg:p-12">
      {/* Top Header */}
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate/30 pb-5 font-utility text-xs tracking-utility">
        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate('lineup')}
            className="text-slate hover:text-ink transition-colors font-bold cursor-pointer"
          >
            ← LINEUP
          </button>
          <span className="text-slate/40">/</span>
          <span className="font-bold text-ink">RESULTS</span>
        </div>

        {/* Global Action Buttons */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Compare Top Two */}
          <button
            onClick={() => {
              if (canCompare) {
                onNavigate(`compare/${topTwo[0].entry.slug}/${topTwo[1].entry.slug}`);
              }
            }}
            disabled={!canCompare}
            className={`font-utility font-bold text-xs tracking-utility px-4 py-2 border border-ink rounded-[2px] transition-all ${
              canCompare
                ? 'bg-paper text-ink hover:bg-white cursor-pointer shadow-sm active:translate-y-[1px]'
                : 'bg-paper/50 text-slate/40 border-slate/20 cursor-not-allowed'
            }`}
          >
            COMPARE TOP TWO
          </button>

          {/* Copy Summary */}
          <button
            onClick={handleCopySummary}
            className="font-utility font-bold text-xs tracking-utility px-4 py-2 bg-paper text-ink border border-ink hover:bg-white rounded-[2px] transition-all shadow-sm active:translate-y-[1px] cursor-pointer"
          >
            {copied ? '✓ COPIED' : 'COPY SUMMARY'}
          </button>

          {/* Download JSON */}
          <button
            onClick={handleDownloadJSON}
            className="font-utility font-bold text-xs tracking-utility px-4 py-2 bg-paper text-ink border border-ink hover:bg-white rounded-[2px] transition-all shadow-sm active:translate-y-[1px] cursor-pointer"
          >
            DOWNLOAD JSON
          </button>

          {/* Clear all scores */}
          {scoredEntries.length > 0 && (
            <button
              onClick={handleClearAll}
              className="font-utility text-xs tracking-utility text-slate hover:text-cut transition-colors px-2 py-2 cursor-pointer"
            >
              CLEAR ALL
            </button>
          )}
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 py-8 sm:py-10 flex flex-col gap-10">
        {/* Judging Panel Row: Raised Yellow Scorecards with Stagger Animation */}
        <section aria-label="Judging panel row">
          <div className="flex items-center justify-between mb-4 font-utility text-xs tracking-utility text-slate">
            <span>JUDGING PANEL // HIGHEST TO LOWEST</span>
            <span>
              {scoredEntries.length} OF {MANIFEST.length} SCORED
            </span>
          </div>

          {scoredEntries.length === 0 ? (
            <div className="p-8 bg-paper border border-slate/30 text-center rounded-[2px]">
              <p className="font-sans text-slate text-sm mb-4">
                No heats have been scored yet. Open a draft to start evaluating.
              </p>
              <button
                onClick={() => onNavigate(`heat/${MANIFEST[0].slug}`)}
                className="bg-card text-ink font-utility font-bold text-xs tracking-utility px-6 py-3 border-2 border-ink rounded-[2px] hover:bg-card/90 shadow-sm cursor-pointer"
              >
                START WITH HEAT 01 ({MANIFEST[0].name})
              </button>
            </div>
          ) : (
            <div
              ref={panelCardsContainerRef}
              className="flex items-end gap-4 sm:gap-6 overflow-x-auto pb-4 pt-2 no-scrollbar"
            >
              {scoredEntries.map((item) => {
                const heatIdx = MANIFEST.indexOf(item.entry);
                const heatLabel = `HEAT 0${heatIdx + 1}`;

                return (
                  <div
                    key={item.entry.slug}
                    className="flex flex-col items-center flex-shrink-0"
                  >
                    <ScoreCard
                      score={item.verdict.score}
                      heatLabel={heatLabel}
                      draftName={item.entry.name}
                      size="panel"
                      animateOnMount={false}
                    />

                    {/* Verdict below card */}
                    <div className="mt-2 text-center max-w-[110px]">
                      <span className="font-utility text-[10px] font-bold text-slate tracking-utility">
                        {item.verdict.verdict ? item.verdict.verdict.toUpperCase() : 'NO VERDICT'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* Detailed Ranked List per Draft */}
        <section aria-label="All drafts">
          <div className="font-utility text-xs tracking-utility text-slate mb-4">
            ALL DRAFTS
          </div>

          <div className="flex flex-col gap-4">
            {rankedDrafts.map((item) => {
              const isScored = item.verdict.score !== null;

              return (
                <div
                  key={item.entry.slug}
                  className="bg-paper border border-slate/30 p-5 rounded-[2px] flex flex-col md:flex-row items-start md:items-center justify-between gap-6 hover:border-ink transition-colors"
                >
                  {/* Left: Rank, Thumbnail, Name, Thesis */}
                  <div className="flex items-start gap-4 sm:gap-6 flex-1">
                    {/* Rank Badge */}
                    <div className="w-10 h-10 flex-shrink-0 flex items-center justify-center bg-ink text-paper font-utility text-sm font-bold rounded-[2px]">
                      {item.rank !== null ? `#${item.rank}` : '—'}
                    </div>

                    {/* Poster Thumbnail */}
                    <div className="w-24 sm:w-28 aspect-[16/10] bg-ink flex-shrink-0 overflow-hidden border border-slate/20 rounded-[2px]">
                      <img
                        src={item.entry.poster}
                        alt={item.entry.name}
                        className="w-full h-full object-cover object-top"
                      />
                    </div>

                    {/* Meta info */}
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-3 mb-1">
                        <h3
                          className="font-display font-black text-xl sm:text-2xl text-ink uppercase tracking-tight"
                          style={{ fontVariationSettings: "'wdth' 75, 'wght' 850" }}
                        >
                          {item.entry.name}
                        </h3>
                        <span className="font-utility text-[10px] tracking-utility text-slate/70">
                          COMMIT: {item.entry.commit}
                        </span>
                      </div>

                      <p className="font-sans text-xs sm:text-sm text-slate mb-3 max-w-xl">
                        {item.entry.thesis}
                      </p>

                      {/* Liked Chips */}
                      {item.verdict.likes.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mb-2">
                          {item.verdict.likes.map((like) => (
                            <span
                              key={like}
                              className="font-utility text-[10px] tracking-utility bg-slate/10 text-ink px-2 py-0.5 border border-slate/20 rounded-[2px]"
                            >
                              ✓ {like}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Notes / Changes */}
                      {item.verdict.note && (
                        <div className="font-sans text-xs bg-white p-2.5 border border-slate/20 text-slate rounded-[2px] max-w-xl">
                          <span className="font-utility text-[10px] text-slate/70 uppercase block mb-1">
                            Notes
                          </span>
                          {item.verdict.note}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Right: Score, Verdict Tag, Revisit Link */}
                  <div className="flex md:flex-col items-center md:items-end justify-between w-full md:w-auto pt-3 md:pt-0 border-t md:border-t-0 border-slate/20 gap-3">
                    <div className="flex items-center gap-2">
                      {isScored ? (
                        <div className="flex items-center gap-2">
                          {item.verdict.verdict && (
                            <span
                              className={`px-2.5 py-1 font-utility text-[11px] font-bold uppercase rounded-[2px] ${
                                item.verdict.verdict === 'cut'
                                  ? 'bg-cut text-white'
                                  : item.verdict.verdict === 'keep'
                                  ? 'bg-ink text-paper'
                                  : 'bg-slate/20 text-ink'
                              }`}
                            >
                              {item.verdict.verdict}
                            </span>
                          )}
                          <div className="bg-card text-ink font-utility font-black text-sm px-3 py-1 border border-ink rounded-[2px]">
                            {item.verdict.score}/10 PTS
                          </div>
                        </div>
                      ) : (
                        <span className="font-utility text-xs tracking-utility text-slate/50">
                          UNSCORED
                        </span>
                      )}
                    </div>

                    <button
                      onClick={() => onNavigate(`heat/${item.entry.slug}`)}
                      className="font-utility font-bold text-xs tracking-utility text-ink hover:text-slate underline underline-offset-4 decoration-slate transition-colors py-1 cursor-pointer"
                    >
                      REVISIT DRAFT →
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate/30 pt-4 flex items-center justify-between font-utility text-[11px] tracking-utility text-slate/70">
        <div>Unofficial concept. Not affiliated with Red Bull.</div>
        <div>GRAVITY EGYPT 2026</div>
      </footer>
    </div>
  );
};
