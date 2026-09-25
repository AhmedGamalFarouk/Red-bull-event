import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';

export interface ScoreCardProps {
  score: number | null;
  heatLabel?: string;
  draftName?: string;
  size?: 'large' | 'panel' | 'mini';
  triggerKey?: string | number | null;
  animateOnMount?: boolean;
  className?: string;
  forwardCardRef?: React.RefObject<HTMLDivElement | null>;
}

export const ScoreCard: React.FC<ScoreCardProps> = ({
  score,
  heatLabel,
  draftName,
  size = 'large',
  triggerKey,
  animateOnMount = true,
  className = '',
  forwardCardRef,
}) => {
  const localCardRef = useRef<HTMLDivElement>(null);
  const cardRef = forwardCardRef || localCardRef;
  const numeralRef = useRef<HTMLSpanElement>(null);
  const isFirstRender = useRef(true);

  const raiseCard = () => {
    if (!cardRef.current || !numeralRef.current) return;

    gsap.killTweensOf([cardRef.current, numeralRef.current]);

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
          gsap.set(cardRef.current, {
            rotationX: 0,
            opacity: 1,
            transformOrigin: 'bottom center',
          });
          gsap.set(numeralRef.current, {
            '--wdth': 125,
          });
        } else {
          const tl = gsap.timeline();
          tl.fromTo(
            cardRef.current,
            {
              rotationX: 90,
              opacity: 0.4,
              transformOrigin: 'bottom center',
              transformPerspective: 800,
            },
            {
              rotationX: 0,
              opacity: 1,
              duration: 0.6,
              ease: 'back.out(1.4)',
              clearProps: 'transformPerspective',
            }
          );
          tl.fromTo(
            numeralRef.current,
            {
              '--wdth': 75,
            },
            {
              '--wdth': 125,
              duration: 0.6,
              ease: 'back.out(1.4)',
            },
            0
          );
        }
      }
    );
  };

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      if (animateOnMount && score !== null) {
        raiseCard();
      }
      return;
    }

    if (score !== null) {
      raiseCard();
    }
  }, [score, triggerKey]);

  if (size === 'mini') {
    return (
      <div
        ref={cardRef}
        className={`inline-flex flex-col items-center justify-center bg-card text-ink font-bold border border-ink/40 shadow-sm rounded-[2px] ${className}`}
        style={{ width: '38px', height: '48px' }}
      >
        <span className="font-utility text-[8px] text-ink/70 leading-none pt-1">
          {score !== null ? 'PTS' : '—'}
        </span>
        <span
          className="font-display text-2xl font-black leading-none pb-1"
          style={{
            fontVariationSettings: "'wdth' 125, 'wght' 900",
          }}
        >
          {score !== null ? score : '—'}
        </span>
      </div>
    );
  }

  const isPanel = size === 'panel';
  const widthClass = isPanel ? 'w-24 sm:w-28 h-32 sm:h-36' : 'w-48 sm:w-56 h-64 sm:h-72';
  const numeralSizeClass = isPanel ? 'text-5xl sm:text-6xl' : 'text-8xl sm:text-9xl';

  return (
    <div
      style={{ perspective: '800px' }}
      className={`relative inline-block ${className}`}
    >
      <div
        ref={cardRef}
        className={`jury-panel-card relative ${widthClass} bg-card text-ink flex flex-col justify-between p-3 sm:p-4 border-2 border-ink shadow-md rounded-[2px] select-none ${className}`}
        style={{
          transformOrigin: 'bottom center',
          transformStyle: 'preserve-3d',
        }}
      >
        {/* Top-left: Small Heat label e.g. "HEAT 03" */}
        <div className="font-utility text-[10px] sm:text-[11px] tracking-utility text-ink/90 font-bold uppercase">
          {heatLabel || 'HEAT'}
        </div>

        {/* Big Central Mona Sans Numeral */}
        <div className="flex-1 flex items-center justify-center my-auto overflow-hidden">
          <span
            ref={numeralRef}
            className={`jury-panel-numeral font-display ${numeralSizeClass} font-black text-ink leading-none text-center`}
            style={{
              fontVariationSettings: "'wdth' var(--wdth, 125), 'wght' 900",
              lineHeight: 0.9,
            }}
          >
            {score !== null ? score : '—'}
          </span>
        </div>

        {/* Bottom: Draft Name in condensed Mona Sans */}
        <div className="border-t border-ink/20 pt-1 text-center truncate">
          <span
            className="block font-display font-black text-xs sm:text-sm uppercase text-ink truncate tracking-tight"
            style={{ fontVariationSettings: "'wdth' 75, 'wght' 850" }}
          >
            {draftName || ''}
          </span>
        </div>
      </div>
    </div>
  );
};
