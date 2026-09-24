import React, { useState } from 'react';
import { audio } from '../utils/audio';
import { Droplet, Zap, ShieldCheck, BatteryCharging, CheckCircle2, Activity, Sparkles } from 'lucide-react';

export const AdrenalineSection: React.FC = () => {
  const [selectedIngredient, setSelectedIngredient] = useState<number>(0);

  const ingredients = [
    {
      title: 'ALPINE SPRING WATER',
      metric: 'PRISTINE PURITY // 100% RUNOFF',
      icon: Droplet,
      color: 'text-rb-cyan',
      borderColor: 'border-rb-cyan/50',
      activeBorder: 'border-rb-cyan',
      bgColor: 'bg-rb-cyan/10',
      bioAvailability: '99.8%',
      role: 'BASE HYDRO-MATRIX',
      desc: 'Extracted directly from protected high-altitude alpine springs in the Austrian and Swiss Alps, providing crystal-clear hydration and optimal mineral balance for extreme desert conditions.',
      specs: ['100% Natural Alpine Runoff', 'Zero Municipal Additives', 'Pure Crisp Hydro-Base'],
    },
    {
      title: 'TAURINE [1,000 MG]',
      metric: 'CELLULAR POWER // AMINO PROFILE',
      icon: Zap,
      color: 'text-rb-yellow',
      borderColor: 'border-rb-yellow/50',
      activeBorder: 'border-rb-yellow',
      bgColor: 'bg-rb-yellow/10',
      bioAvailability: '96.4%',
      role: 'NEURAL & G-FORCE STABILITY',
      desc: 'A naturally occurring amino acid present in the human body and daily diet. Crucial for neurological function, calcium regulation, and muscle stamina under brutal multi-G accelerations.',
      specs: ['1000mg Bio-Identical Purity', 'Supports Muscle Contractility', 'Accelerates Recovery'],
    },
    {
      title: 'B-GROUP VITAMINS',
      metric: 'METABOLIC ENGINE // B3, B5, B6, B12',
      icon: BatteryCharging,
      color: 'text-rb-red',
      borderColor: 'border-rb-red/50',
      activeBorder: 'border-rb-red',
      bgColor: 'bg-rb-red/10',
      bioAvailability: '98.1%',
      role: 'CELLULAR ATP CONVERSION',
      desc: 'Essential micronutrients including Niacinamide (B3), Pantothenic Acid (B5), Vitamin B6, and B12 that catalyze carbohydrates and proteins into usable cellular ATP fuel.',
      specs: ['Reduces Fatigue & Exhaustion', 'Supports Normal Nervous Function', 'Optimal Cellular Uptake'],
    },
    {
      title: 'CAFFEINE RUSH [80 MG]',
      metric: 'SYNAPSE VELOCITY // 1 ESPRESSO EQ',
      icon: ShieldCheck,
      color: 'text-white',
      borderColor: 'border-white/50',
      activeBorder: 'border-white',
      bgColor: 'bg-white/10',
      bioAvailability: '99.2%',
      role: 'INSTANT COGNITIVE REFLEX',
      desc: 'Precisely 80mg per 250ml can (the exact equivalent of an artisanal espresso cup), stimulating mental alertness, reaction speed, and explosive split-second focus.',
      specs: ['-18% Cognitive Reaction Lag', '+22% Vigilance & Awareness', 'Peak Neural Synapse Speed'],
    },
  ];

  return (
    <section
      id="anatomy"
      className="relative min-h-[120dvh] w-full flex items-center py-24 px-4 sm:px-10 z-20"
    >
      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
        {/* Left Column: Telemetry & Interactive Breakdown (3D Can is on the right) */}
        <div className="lg:col-span-7 flex flex-col justify-center">
          {/* Chapter Subtitle */}
          <div className="flex items-center gap-3 mb-4">
            <span className="w-8 h-0.5 bg-rb-red" />
            <span className="font-mono text-xs font-bold tracking-widest text-rb-red uppercase">
              CHAPTER 04 // ANATOMY OF EXTREME
            </span>
          </div>

          <h2 className="text-4xl sm:text-6xl font-display font-black tracking-tight text-white uppercase leading-none mb-6">
            THE FORMULA
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-rb-yellow via-white to-rb-silver">
              BEHIND THE WINGS
            </span>
          </h2>

          <p className="font-mono text-xs sm:text-sm text-rb-silver mb-8 leading-relaxed">
            Red Bull is engineered not merely as a drink, but as an aerodynamic biological catalyst. Calibrated to sustain extreme Egyptian desert heat, high-G Dakar dune jumps, and relentless physical endurance.
          </p>

          {/* Interactive Ingredient Selector Cards */}
          <div className="space-y-3">
            {ingredients.map((item, idx) => {
              const Icon = item.icon;
              const isSelected = selectedIngredient === idx;
              return (
                <div
                  key={item.title}
                  onClick={() => {
                    audio.playClick();
                    setSelectedIngredient(idx);
                  }}
                  className={`cursor-pointer rounded-2xl p-4 sm:p-5 transition-all duration-300 border ${
                    isSelected
                      ? `glass-panel ${item.activeBorder} shadow-2xl scale-[1.01] bg-rb-surface/95`
                      : 'glass-panel border-white/5 hover:border-white/20 opacity-70 hover:opacity-100'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3.5">
                      <div className={`p-2.5 rounded-xl ${item.bgColor} ${item.color}`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-display font-bold text-sm sm:text-base tracking-wider text-white">
                          {item.title}
                        </h4>
                        <span className="font-mono text-[10px] text-rb-muted uppercase tracking-wider">
                          {item.metric}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="hidden sm:inline font-mono text-[10px] text-rb-yellow px-2 py-0.5 rounded bg-white/5">
                        BIO: {item.bioAvailability}
                      </span>
                      <span className="font-mono text-xs font-bold text-rb-muted">
                        0{idx + 1}
                      </span>
                    </div>
                  </div>

                  {isSelected && (
                    <div className="mt-4 pt-4 border-t border-white/10">
                      <p className="font-mono text-xs sm:text-sm text-rb-silver mb-4 leading-relaxed">
                        {item.desc}
                      </p>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                        {item.specs.map((spec) => (
                          <div
                            key={spec}
                            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/5 font-mono text-[10px] text-white/90"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5 text-rb-yellow flex-shrink-0" />
                            <span className="truncate">{spec}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Reserved for 3D Can showing formula label & condensation */}
        <div className="hidden lg:flex lg:col-span-5 justify-end items-center pointer-events-none relative min-h-[500px]" />
      </div>
    </section>
  );
};
