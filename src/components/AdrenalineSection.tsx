import React, { useRef, useState } from 'react';
import { audio } from '../utils/audio';
import { useSectionReveal } from '../motion/reveal';
import { Collapse } from '../motion/Collapse';

const INGREDIENTS = [
  {
    title: 'Alpine Water',
    amount: 'Base',
    desc: 'Red Bull is made with high-quality alpine water sourced from springs in Austria and Switzerland.',
  },
  {
    title: 'Taurine',
    amount: '1,000 mg',
    desc: 'An amino acid naturally present in the human body and in everyday diets.',
  },
  {
    title: 'B Vitamins',
    amount: 'B3 B5 B6 B12',
    desc: 'Water-soluble vitamins that contribute to normal energy-yielding metabolism.',
  },
  {
    title: 'Caffeine',
    amount: '80 mg',
    desc: 'About the same as a cup of coffee, in every 250 ml can.',
  },
];

export const AdrenalineSection: React.FC = () => {
  const [selected, setSelected] = useState(0);
  const rootRef = useRef<HTMLElement>(null);
  useSectionReveal(rootRef);

  const select = (idx: number) => {
    if (idx === selected) return;
    audio.playClick();
    setSelected(idx);
  };

  return (
    <section
      ref={rootRef}
      id="anatomy"
      className="relative min-h-[120dvh] w-full flex items-center py-24 px-4 sm:px-10 z-20"
    >
      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
        <div className="lg:col-span-7">
          <h2 data-reveal="title" className="section-title mb-5">
            The formula <span className="text-rb-red">behind the wings.</span>
          </h2>
          <p data-reveal="up" className="text-base sm:text-lg text-rb-silver leading-relaxed max-w-[52ch] mb-12">
            Four key ingredients in every 250 ml can. Tap one to see what it does.
          </p>

          {/* Callouts: each leader line points across to the can on the right flank */}
          <ol className="space-y-1">
            {INGREDIENTS.map((item, idx) => {
              const active = idx === selected;
              return (
                <li key={item.title} data-reveal="up">
                  <button
                    onClick={() => select(idx)}
                    aria-expanded={active}
                    className="group w-full flex items-center gap-4 sm:gap-5 py-4 text-left"
                  >
                    <span
                      className={`font-display font-extrabold uppercase tracking-[-0.03em] text-lg sm:text-3xl lg:text-2xl xl:text-3xl leading-none whitespace-nowrap transition-colors duration-300 ${
                        active ? 'text-white' : 'text-white/40 group-hover:text-white/80'
                      }`}
                    >
                      {item.title}
                    </span>
                    <span className="relative flex-1 h-px min-w-[1.5rem]" aria-hidden>
                      <span data-draw="x" className="absolute inset-0 bg-white/15" />
                      <span
                        className={`absolute inset-0 bg-rb-red origin-left transition-transform duration-700 ease-out-expo ${
                          active ? 'scale-x-100' : 'scale-x-0'
                        }`}
                      />
                      <span
                        className={`absolute -right-1 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full transition-colors duration-500 ${
                          active ? 'bg-rb-red' : 'bg-white/25'
                        }`}
                      />
                    </span>
                    <span
                      className={`font-mono text-xs sm:text-sm tracking-wider whitespace-nowrap transition-colors duration-300 ${
                        active ? 'text-rb-yellow' : 'text-rb-muted'
                      }`}
                    >
                      {item.amount}
                    </span>
                  </button>
                  <Collapse open={active}>
                    <p className="text-rb-silver leading-relaxed max-w-[48ch] pb-5">{item.desc}</p>
                  </Collapse>
                </li>
              );
            })}
          </ol>
        </div>

        {/* Open lane: the can is at its largest here */}
        <div className="hidden lg:block lg:col-span-5 min-h-[500px] pointer-events-none" aria-hidden />
      </div>
    </section>
  );
};
