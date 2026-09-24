import React, { useState } from 'react';
import { audio } from '../utils/audio';
import { Droplet, Zap, ShieldCheck, BatteryCharging, CheckCircle2 } from 'lucide-react';

export const AdrenalineSection: React.FC = () => {
  const [selectedIngredient, setSelectedIngredient] = useState<number>(0);

  const ingredients = [
    {
      title: 'ALPINE SPRING WATER',
      metric: 'PRISTINE PURITY',
      icon: Droplet,
      color: 'text-rb-cyan',
      borderColor: 'border-rb-cyan/40',
      bgColor: 'bg-rb-cyan/10',
      desc: 'Extracted directly from protected high-altitude alpine springs in the Austrian and Swiss Alps, providing crystal-clear hydration and optimal mineral balance.',
      specs: ['100% Natural Alpine Runoff', 'Zero Municipal Additives', 'Pure Crisp Hydro-Base'],
    },
    {
      title: 'TAURINE [1,000 MG]',
      metric: 'CELLULAR POWER',
      icon: Zap,
      color: 'text-rb-yellow',
      borderColor: 'border-rb-yellow/40',
      bgColor: 'bg-rb-yellow/10',
      desc: 'A naturally occurring amino acid present in the human body and daily diet. Crucial for neurological function, calcium regulation, and muscle stamina under extreme G-force.',
      specs: ['1000mg Bio-Identical Purity', 'Supports Muscle Contractility', 'Accelerates Recovery'],
    },
    {
      title: 'B-GROUP VITAMINS',
      metric: 'METABOLIC ENGINE',
      icon: BatteryCharging,
      color: 'text-rb-red',
      borderColor: 'border-rb-red/40',
      bgColor: 'bg-rb-red/10',
      desc: 'Essential micronutrients including Niacinamide (B3), Pantothenic Acid (B5), Vitamin B6, and B12 that catalyze carbohydrates and proteins into cellular ATP energy.',
      specs: ['Reduces Fatigue & Exhaustion', 'Supports Normal Nervous Function', 'Optimal Cellular Uptake'],
    },
    {
      title: 'CAFFEINE RUSH [80 MG]',
      metric: 'RAPID SYNAPSE FOCUS',
      icon: ShieldCheck,
      color: 'text-white',
      borderColor: 'border-white/40',
      bgColor: 'bg-white/10',
      desc: 'Precisely 80mg per 250ml can (the exact equivalent of an artisanal espresso cup), stimulating mental alertness, reaction speed, and explosive concentration.',
      specs: ['-18% Cognitive Reaction Lag', '+22% Vigilance & Awareness', 'Peak Neural Synapse Speed'],
    },
  ];

  return (
    <section
      id="anatomy"
      className="relative min-h-[120dvh] w-full flex items-center py-24 px-4 sm:px-10 z-20"
    >
      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Left Column: Telemetry & Interactive Breakdown (Can is on the right) */}
        <div className="lg:col-span-6 flex flex-col justify-center">
          {/* Chapter Subtitle */}
          <div className="flex items-center gap-3 mb-4">
            <span className="w-8 h-0.5 bg-rb-red" />
            <span className="font-mono text-xs font-bold tracking-widest text-rb-red uppercase">
              CHAPTER 01 // ANATOMY OF EXTREME
            </span>
          </div>

          <h2 className="text-4xl sm:text-6xl font-display font-black tracking-tight text-white uppercase leading-none mb-6">
            THE FORMULA
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-rb-yellow via-white to-rb-silver">
              BEHIND THE WINGS
            </span>
          </h2>

          <p className="font-mono text-xs sm:text-sm text-rb-silver mb-8 leading-relaxed">
            Red Bull is engineered not just as a beverage, but as an aerodynamic biological catalyst. Calibrated to sustain extreme Egyptian desert heat, high-impact Dakar dune jumps over the Giza plateau, and relentless physical endurance.
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
                  className={`cursor-pointer rounded-xl p-4 sm:p-5 transition-all duration-300 border ${
                    isSelected
                      ? `glass-panel ${item.borderColor} shadow-2xl scale-[1.02] bg-rb-surface/90`
                      : 'glass-panel border-white/5 hover:border-white/20 opacity-70 hover:opacity-100'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${item.bgColor} ${item.color}`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-display font-bold text-sm tracking-wider text-white">
                          {item.title}
                        </h4>
                        <span className="font-mono text-[10px] text-rb-muted uppercase tracking-widest">
                          {item.metric}
                        </span>
                      </div>
                    </div>
                    <span className="font-mono text-xs font-bold text-rb-muted">
                      0{idx + 1}
                    </span>
                  </div>

                  {isSelected && (
                    <div className="mt-4 pt-4 border-t border-white/10 animate-fade-in">
                      <p className="font-mono text-xs text-rb-silver mb-3 leading-relaxed">
                        {item.desc}
                      </p>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                        {item.specs.map((spec) => (
                          <div
                            key={spec}
                            className="flex items-center gap-1.5 text-[10px] font-mono text-white/90 bg-white/5 px-2 py-1 rounded"
                          >
                            <CheckCircle2 className={`w-3 h-3 ${item.color}`} />
                            <span>{spec}</span>
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

        {/* Right Column: Empty space reserved for the 3D Red Bull Can */}
        <div className="hidden lg:flex lg:col-span-6 justify-end items-center pointer-events-none relative min-h-[500px]" />
      </div>
    </section>
  );
};
