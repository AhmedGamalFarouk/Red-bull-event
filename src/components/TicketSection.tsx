import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { audio } from '../utils/audio';
import { Check, QrCode, ArrowRight, Zap, X, Shield, Sparkles, Plus, DollarSign, Coins } from 'lucide-react';

interface TicketTier {
  id: string;
  name: string;
  priceUSD: number;
  priceEGP: number;
  tagline: string;
  badge?: string;
  popular?: boolean;
  features: string[];
}

interface TicketAddon {
  id: string;
  name: string;
  priceUSD: number;
  priceEGP: number;
  desc: string;
}

export const TicketSection: React.FC = () => {
  const [currency, setCurrency] = useState<'USD' | 'EGP'>('EGP');
  const [selectedTier, setSelectedTier] = useState<number>(2); // Default to PIT LANE VIP
  const [selectedAddons, setSelectedAddons] = useState<string[]>([]);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [buyerName, setBuyerName] = useState<string>('');
  const [buyerEmail, setBuyerEmail] = useState<string>('');
  const [isReserved, setIsReserved] = useState<boolean>(false);

  const tiers: TicketTier[] = [
    {
      id: 'ga',
      name: 'GENERAL ADMISSION',
      priceUSD: 89,
      priceEGP: 4350,
      tagline: '3-Day All-Arena Spectator Pass',
      badge: 'STANDARD',
      features: [
        'Access to all 4 live competition arenas in Giza & Red Sea',
        'Spectator grandstand seating & festival grounds',
        'Nightly Sphinx amphitheater soundstage access',
        'Official 2026 RFID woven event wristband',
        'Free air-conditioned shuttle transport from Cairo',
      ],
      popular: false,
    },
    {
      id: 'grandstand',
      name: 'GRANDSTAND APEX',
      priceUSD: 159,
      priceEGP: 7750,
      tagline: 'Reserved Shade & Runway Sightlines',
      badge: 'POPULAR CHOICE',
      features: [
        'Everything in General Admission',
        'Reserved elevated seating at the Pyramids flight corridor',
        'Dedicated shaded canopy & cooling mist fans',
        'Priority express food & beverage lanes',
        'Official Red Bull Egypt 2026 commemorative cap & tote',
      ],
      popular: false,
    },
    {
      id: 'vip',
      name: 'PIT LANE VIP',
      priceUSD: 279,
      priceEGP: 13600,
      tagline: 'Trackside & Athlete Proximity',
      badge: 'MOST POPULAR',
      features: [
        'Everything in Grandstand Apex',
        'Front-row pit lane & runway trackside perimeter access',
        'Complimentary unlimited chilled Red Bull & mocktail bar',
        'Exclusive athlete autograph paddock session',
        'Fast-track biometric priority security gates',
        'Access to VIP sunset DJ lounge in Dahab & Giza',
      ],
      popular: true,
    },
    {
      id: 'paddock',
      name: 'PADDOCK CLUB',
      priceUSD: 649,
      priceEGP: 31800,
      tagline: 'The Ultimate Stratosphere Access',
      badge: 'MAXIMUM LUXURY',
      features: [
        'Everything in Pit Lane VIP',
        'Helicopter Giza Pyramids skyline flight transfer',
        'Gourmet 5-star Egyptian luxury catering & open bar',
        'Private air-conditioned Pyramids Skybox viewing suite',
        'Custom engraved heavy metal VIP badge & desert flight kit',
        'All-access entry to all 4 private athlete celebration galas',
      ],
      popular: false,
    },
  ];

  const addons: TicketAddon[] = [
    {
      id: 'glamping',
      name: 'DESERT GLAMPING OASIS',
      priceUSD: 120,
      priceEGP: 5850,
      desc: '3-night luxury air-conditioned Bedouin tent camp right on the Giza plateau with private amenities and campfire stargazing.',
    },
    {
      id: 'safari',
      name: '4X4 SINAI BUGGY SAFARI',
      priceUSD: 85,
      priceEGP: 4150,
      desc: 'Guided high-speed dune buggy expedition through the Colored Canyon with official Red Bull freeride course marshals.',
    },
    {
      id: 'sim-fastpass',
      name: 'SIMULATOR ZERO-WAIT FAST PASS',
      priceUSD: 45,
      priceEGP: 2200,
      desc: 'Unlimited zero-queue access to all full-motion F1 race rigs and Dakar Trophy Truck hydraulic motion pods in the Energy Lab.',
    },
  ];

  const toggleAddon = (id: string) => {
    audio.playClick();
    setSelectedAddons((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const currentTier = tiers[selectedTier];

  const calculateTotal = () => {
    const basePrice = currency === 'USD' ? currentTier.priceUSD : currentTier.priceEGP;
    const addonPrice = selectedAddons.reduce((acc, currId) => {
      const found = addons.find((a) => a.id === currId);
      if (!found) return acc;
      return acc + (currency === 'USD' ? found.priceUSD : found.priceEGP);
    }, 0);
    return basePrice + addonPrice;
  };

  const handleOpenCheckout = (idx: number) => {
    audio.playClick();
    setSelectedTier(idx);
    setIsReserved(false);
    setModalOpen(true);
  };

  const handleConfirmReservation = (e: React.FormEvent) => {
    e.preventDefault();
    audio.playLiquidSplash(1.0);
    setIsReserved(true);

    confetti({
      particleCount: 130,
      spread: 80,
      origin: { y: 0.6 },
      colors: ['#ED1B2D', '#FFC800', '#00D8FF', '#FFFFFF'],
    });
  };

  const formatPrice = (usd: number, egp: number) => {
    return currency === 'USD' ? `$${usd}` : `${egp.toLocaleString()} EGP`;
  };

  return (
    <section
      id="tickets"
      className="relative min-h-[130dvh] w-full flex flex-col justify-center py-24 px-4 sm:px-10 z-20"
    >
      <div className="max-w-7xl mx-auto w-full">
        {/* Header & Currency Switcher */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-12">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 mb-3 rounded-full bg-rb-red/20 border border-rb-red/40 text-rb-red text-xs font-mono font-bold tracking-widest uppercase">
              <Sparkles className="w-3.5 h-3.5" />
              <span>OFFICIAL 2026 PASS ALLOTMENT</span>
            </div>

            <h2 className="text-3xl sm:text-5xl md:text-6xl font-display font-black tracking-tight text-white uppercase leading-tight">
              CHOOSE YOUR{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-rb-red via-rb-yellow to-white whitespace-nowrap">
                GRAVITY ACCESS
              </span>
            </h2>
          </div>

          {/* Currency Toggle */}
          <div className="flex items-center gap-3 glass-panel p-1.5 rounded-full border border-white/10 shrink-0">
            <span className="text-[11px] font-mono text-rb-muted uppercase pl-3 whitespace-nowrap">CURRENCY:</span>
            <button
              onClick={() => {
                audio.playClick();
                setCurrency('USD');
              }}
              className={`px-3.5 py-1.5 rounded-full text-xs font-mono font-bold transition-all whitespace-nowrap ${
                currency === 'USD' ? 'bg-rb-red text-white shadow-glow-red' : 'text-rb-silver hover:text-white'
              }`}
            >
              USD ($)
            </button>
            <button
              onClick={() => {
                audio.playClick();
                setCurrency('EGP');
              }}
              className={`px-3.5 py-1.5 rounded-full text-xs font-mono font-bold transition-all whitespace-nowrap ${
                currency === 'EGP' ? 'bg-rb-yellow text-rb-dark shadow-glow-yellow' : 'text-rb-silver hover:text-white'
              }`}
            >
              EGP (ج.م)
            </button>
          </div>
        </div>

        {/* Heritage Scarcity & Weather Protection Trust Strip */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <div className="flex items-center gap-3 px-4 py-3 rounded-2xl glass-panel border border-rb-yellow/30 bg-rb-yellow/5">
            <Shield className="w-5 h-5 text-rb-yellow shrink-0" />
            <div className="text-xs font-mono">
              <span className="text-rb-yellow font-bold uppercase">HERITAGE QUOTA: </span>
              <span className="text-rb-silver">Strictly capped at 48,000 passes to safeguard Giza antiquities. Over 78% of VIP tiers claimed.</span>
            </div>
          </div>
          <div className="flex items-center gap-3 px-4 py-3 rounded-2xl glass-panel border border-rb-cyan/30 bg-rb-cyan/5">
            <Sparkles className="w-5 h-5 text-rb-cyan shrink-0" />
            <div className="text-xs font-mono">
              <span className="text-rb-cyan font-bold uppercase">100% WEATHER GUARANTEE: </span>
              <span className="text-rb-silver">Full scheduling protection, free 24h digital transfer, and guaranteed backup twilight sessions.</span>
            </div>
          </div>
        </div>

        {/* 4 Tiers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch mb-16">
          {tiers.map((tier, idx) => {
            const isSelected = selectedTier === idx;
            const buttonLabels: Record<string, string> = {
              ga: 'Claim General Pass',
              grandstand: 'Secure Apex Pass',
              vip: 'Lock In VIP Access',
              paddock: 'Unlock Paddock Club',
            };
            const buttonText = buttonLabels[tier.id] || 'Secure Pass';

            return (
              <div
                key={tier.id}
                className={`rounded-3xl p-6 sm:p-7 flex flex-col justify-between transition-all duration-300 relative ${
                  tier.popular
                    ? 'glass-panel-accent border-rb-red shadow-2xl lg:-translate-y-3 scale-[1.02]'
                    : isSelected
                    ? 'glass-panel border-rb-yellow/60 bg-rb-surface/90 shadow-xl'
                    : 'glass-panel border-white/10 hover:border-white/20'
                }`}
              >
                {tier.badge && (
                  <div className={`absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full text-[9px] font-mono font-bold tracking-widest uppercase shadow-md whitespace-nowrap ${
                    tier.popular ? 'bg-rb-red text-white shadow-glow-red' : 'bg-white/10 text-rb-yellow border border-white/10'
                  }`}>
                    {tier.badge}
                  </div>
                )}

                <div>
                  <div className="flex items-start justify-between mb-3 min-h-[44px]">
                    <h3 className="font-display font-black text-base sm:text-lg text-white leading-tight">
                      {tier.name}
                    </h3>
                  </div>

                  <div className="mb-4">
                    <div className="flex items-baseline gap-1.5 flex-nowrap">
                      <span className="text-2xl sm:text-3xl font-display font-black text-rb-yellow tracking-tight whitespace-nowrap">
                        {currency === 'USD' ? `$${tier.priceUSD}` : tier.priceEGP.toLocaleString()}
                      </span>
                      {currency === 'EGP' && (
                        <span className="text-xs sm:text-sm font-mono font-bold text-rb-yellow/85 whitespace-nowrap">
                          EGP
                        </span>
                      )}
                    </div>
                    <span className="font-mono text-[10px] text-rb-muted block whitespace-nowrap truncate mt-0.5">
                      PER ATTENDEE • 3-DAY PASS
                    </span>
                  </div>

                  <p className="font-mono text-xs text-rb-silver mb-6">
                    {tier.tagline}
                  </p>

                  <div className="space-y-2.5 mb-8 pt-5 border-t border-white/10">
                    {tier.features.map((feat) => (
                      <div key={feat} className="flex items-start gap-2 text-xs font-mono text-rb-silver">
                        <Check className="w-3.5 h-3.5 text-rb-yellow shrink-0 mt-0.5" />
                        <span className="leading-snug">{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => handleOpenCheckout(idx)}
                  className={`w-full py-3.5 px-2 rounded-full font-display font-bold text-[11px] sm:text-xs tracking-wider uppercase flex items-center justify-center gap-1.5 transition-all duration-300 whitespace-nowrap ${
                    tier.popular
                      ? 'bg-rb-red hover:bg-rb-redGlow text-white shadow-glow-red hover:scale-105 active:scale-95'
                      : 'bg-white/10 hover:bg-white/20 text-white hover:border-white/30'
                  }`}
                >
                  <span className="truncate">{buttonText}</span>
                  <ArrowRight className="w-3.5 h-3.5 shrink-0" />
                </button>
              </div>
            );
          })}
        </div>

        {/* Ticket Add-Ons & Experiences */}
        <div className="glass-panel p-8 sm:p-10 rounded-3xl border border-white/15 shadow-2xl mb-16">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <span className="font-mono text-xs font-bold text-rb-yellow uppercase tracking-widest">
                CUSTOMIZE YOUR EGYPT TRIP
              </span>
              <h3 className="text-2xl sm:text-3xl font-display font-black text-white uppercase mt-1">
                PREMIUM EVENT ADD-ONS
              </h3>
            </div>
            <span className="text-xs font-mono text-rb-muted">
              Select optional adventures to package with your pass
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {addons.map((addon) => {
              const isSelected = selectedAddons.includes(addon.id);
              return (
                <div
                  key={addon.id}
                  onClick={() => toggleAddon(addon.id)}
                  className={`cursor-pointer p-6 rounded-2xl border transition-all duration-200 flex flex-col justify-between ${
                    isSelected
                      ? 'glass-panel border-rb-yellow bg-rb-yellow/10 shadow-glow-yellow'
                      : 'glass-panel border-white/10 hover:border-white/25 opacity-80 hover:opacity-100'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between gap-3 mb-2">
                      <span className="font-display font-bold text-sm text-white truncate">
                        {addon.name}
                      </span>
                      <span className="font-display font-black text-rb-yellow text-sm whitespace-nowrap shrink-0">
                        +{formatPrice(addon.priceUSD, addon.priceEGP)}
                      </span>
                    </div>
                    <p className="font-mono text-xs text-rb-silver leading-relaxed">
                      {addon.desc}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-[11px] font-mono">
                    <span className={isSelected ? 'text-rb-yellow font-bold' : 'text-rb-muted'}>
                      {isSelected ? '✓ ADDED TO PASS' : '+ CLICK TO ADD'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Dynamic Holographic Pass Card Preview */}
        <div className="max-w-2xl mx-auto holo-card p-6 sm:p-10 rounded-3xl border border-white/25 shadow-2xl relative overflow-hidden">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pb-6 border-b border-white/10">
            <div className="flex items-center gap-4">
              <img
                src="/redbull-logo.svg"
                alt="Red Bull"
                className="h-10 w-auto object-contain"
              />
              <div>
                <div className="font-display font-black text-xl text-white">
                  RED BULL GRAVITY // EGYPT PASS
                </div>
                <span className="font-mono text-xs text-rb-yellow">
                  NOVEMBER 13–15, 2026 • GIZA PLATEAU & RED SEA
                </span>
              </div>
            </div>

            <div className="px-3.5 py-1.5 rounded-full bg-white/10 text-xs font-mono text-white font-bold tracking-widest uppercase">
              {currentTier.badge || 'CONFIRMED TIER'}
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-6 border-b border-white/10 font-mono text-xs">
            <div>
              <span className="text-rb-muted text-[10px] block uppercase whitespace-nowrap">TIER LEVEL</span>
              <span className="font-bold text-white text-sm whitespace-nowrap">{currentTier.name}</span>
            </div>
            <div>
              <span className="text-rb-muted text-[10px] block uppercase whitespace-nowrap">GATE ACCESS</span>
              <span className="font-bold text-white text-sm whitespace-nowrap">ALL 4 HUBS</span>
            </div>
            <div>
              <span className="text-rb-muted text-[10px] block uppercase whitespace-nowrap">ADD-ONS</span>
              <span className="font-bold text-rb-yellow text-sm whitespace-nowrap">
                {selectedAddons.length > 0 ? `${selectedAddons.length} SELECTED` : 'NONE'}
              </span>
            </div>
            <div>
              <span className="text-rb-muted text-[10px] block uppercase whitespace-nowrap">PACKAGE TOTAL</span>
              <span className="font-display font-black text-rb-yellow text-sm sm:text-base whitespace-nowrap">
                {currency === 'USD' ? `$${calculateTotal()}` : `${calculateTotal().toLocaleString()} EGP`}
              </span>
            </div>
          </div>

          <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-rb-navy border border-white/10 flex items-center justify-center text-rb-yellow">
                <QrCode className="w-7 h-7" />
              </div>
              <div className="font-mono text-[11px] text-rb-silver">
                <span>RFID ENCRYPTED // INSTANT APPLE WALLET SYNC</span>
                <span className="block text-rb-muted text-[9px]">ID: RB-EG26-992014-X</span>
              </div>
            </div>

            <button
              onClick={() => handleOpenCheckout(selectedTier)}
              className="px-8 py-3.5 rounded-full bg-rb-red hover:bg-rb-redGlow text-white font-display font-bold text-xs tracking-widest uppercase shadow-glow-red hover:scale-105 transition-all"
            >
              PROCEED TO PASS ISSUE
            </button>
          </div>
        </div>

        {/* Tier Comparison Matrix Table - Permanently Visible */}
        <div className="mt-14 glass-panel p-6 sm:p-10 rounded-3xl border border-white/15 overflow-x-auto shadow-2xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-white/10">
            <div>
              <span className="font-mono text-xs font-bold text-rb-yellow uppercase tracking-widest">
                OFFICIAL ACCESS BREAKDOWN
              </span>
              <h3 className="text-2xl sm:text-3xl font-display font-black text-white uppercase mt-1">
                TIER COMPARISON MATRIX
              </h3>
            </div>
            <span className="text-xs font-mono text-rb-silver">
              Compare all four pass tiers, shaded lounge access, and trackside privileges
            </span>
          </div>

          <table className="w-full text-left font-mono text-xs">
            <thead>
              <tr className="border-b border-white/10 text-rb-yellow">
                <th className="pb-4">PRIVILEGE / PERK</th>
                <th className="pb-4">GENERAL</th>
                <th className="pb-4">GRANDSTAND</th>
                <th className="pb-4">PIT LANE VIP</th>
                <th className="pb-4">PADDOCK CLUB</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-rb-silver">
              <tr>
                <td className="py-3 font-semibold text-white">4 Live Competition Hubs Access</td>
                <td className="py-3 text-rb-yellow">✓</td>
                <td className="py-3 text-rb-yellow">✓</td>
                <td className="py-3 text-rb-yellow">✓</td>
                <td className="py-3 text-rb-yellow">✓</td>
              </tr>
              <tr>
                <td className="py-3 font-semibold text-white">Free Cairo Express Shuttles</td>
                <td className="py-3 text-rb-yellow">✓</td>
                <td className="py-3 text-rb-yellow">✓</td>
                <td className="py-3 text-rb-yellow">✓</td>
                <td className="py-3 text-rb-yellow">✓</td>
              </tr>
              <tr>
                <td className="py-3 font-semibold text-white">Reserved Shaded Grandstand Seating</td>
                <td className="py-3 text-rb-muted">-</td>
                <td className="py-3 text-rb-yellow">✓</td>
                <td className="py-3 text-rb-yellow">✓</td>
                <td className="py-3 text-rb-yellow">✓</td>
              </tr>
              <tr>
                <td className="py-3 font-semibold text-white">Unlimited Chilled Red Bull & Mocktail Bar</td>
                <td className="py-3 text-rb-muted">-</td>
                <td className="py-3 text-rb-muted">-</td>
                <td className="py-3 text-rb-yellow">✓</td>
                <td className="py-3 text-rb-yellow">✓</td>
              </tr>
              <tr>
                <td className="py-3 font-semibold text-white">Athlete Paddock Meet & Greet Access</td>
                <td className="py-3 text-rb-muted">-</td>
                <td className="py-3 text-rb-muted">-</td>
                <td className="py-3 text-rb-yellow">✓</td>
                <td className="py-3 text-rb-yellow">✓</td>
              </tr>
              <tr>
                <td className="py-3 font-semibold text-white">Helicopter Giza Skyline Flight Transfer</td>
                <td className="py-3 text-rb-muted">-</td>
                <td className="py-3 text-rb-muted">-</td>
                <td className="py-3 text-rb-muted">-</td>
                <td className="py-3 text-rb-yellow">✓</td>
              </tr>
              <tr>
                <td className="py-3 font-semibold text-white">5-Star Luxury Pyramids Skybox & Catering</td>
                <td className="py-3 text-rb-muted">-</td>
                <td className="py-3 text-rb-muted">-</td>
                <td className="py-3 text-rb-muted">-</td>
                <td className="py-3 text-rb-yellow">✓</td>
              </tr>
              <tr>
                <td className="py-3 font-semibold text-white">Secret Athlete Night Gala Entry</td>
                <td className="py-3 text-rb-muted">-</td>
                <td className="py-3 text-rb-muted">-</td>
                <td className="py-3 text-rb-muted">-</td>
                <td className="py-3 text-rb-yellow">✓</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Checkout Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-rb-dark/85 backdrop-blur-2xl animate-fade-in">
          <div className="relative w-full max-w-lg glass-panel p-8 sm:p-10 rounded-3xl border border-white/20 shadow-2xl">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-full hover:bg-white/10 text-rb-muted hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {!isReserved ? (
              <form onSubmit={handleConfirmReservation}>
                <div className="flex items-center gap-2 text-xs font-mono text-rb-red mb-2 uppercase">
                  <Zap className="w-4 h-4" />
                  <span>OFFICIAL EGYPT 2026 TICKET DISPATCH</span>
                </div>
                <h3 className="text-2xl font-display font-black text-white uppercase mb-1">
                  RESERVE: {currentTier.name}
                </h3>
                <div className="font-mono text-xs text-rb-yellow mb-6">
                  {formatPrice(currentTier.priceUSD, currentTier.priceEGP)} • {currentTier.tagline}
                  {selectedAddons.length > 0 && (
                    <span className="block text-rb-silver mt-1">
                      + {selectedAddons.length} Add-on(s) selected
                    </span>
                  )}
                </div>

                <div className="space-y-4 mb-6">
                  <div>
                    <label className="block text-xs font-mono text-rb-silver uppercase mb-1.5">
                      ATTENDEE FULL NAME
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Tarek Hamed"
                      value={buyerName}
                      onChange={(e) => setBuyerName(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white font-mono text-sm focus:outline-none focus:border-rb-red transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono text-rb-silver uppercase mb-1.5">
                      EMAIL CREDENTIAL DESTINATION
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="spectator@cairo-velocity.eg"
                      value={buyerEmail}
                      onChange={(e) => setBuyerEmail(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white font-mono text-sm focus:outline-none focus:border-rb-red transition-colors"
                    />
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-white/5 border border-white/10 mb-6 flex justify-between items-center font-mono">
                  <span className="text-xs text-rb-muted uppercase whitespace-nowrap">TOTAL CHARGE:</span>
                  <span className="font-display font-black text-lg text-rb-yellow whitespace-nowrap">
                    {currency === 'USD' ? `$${calculateTotal()}` : `${calculateTotal().toLocaleString()} EGP`}
                  </span>
                </div>

                <button
                  type="submit"
                  className="w-full py-4 rounded-full bg-rb-red hover:bg-rb-redGlow text-white font-display font-bold text-xs tracking-widest uppercase transition-all duration-300 shadow-glow-red hover:scale-105 active:scale-95"
                >
                  CONFIRM & ISSUE DIGITAL CREDENTIAL
                </button>
              </form>
            ) : (
              <div className="text-center py-4 flex flex-col items-center animate-fade-in">
                <div className="w-16 h-16 rounded-full bg-rb-red/20 text-rb-yellow flex items-center justify-center mb-4 border border-rb-yellow/40">
                  <QrCode className="w-9 h-9" />
                </div>
                <div className="font-mono text-xs text-rb-yellow tracking-widest uppercase mb-1">
                  PASS CONFIRMED // RFID ACTIVE
                </div>
                <h3 className="text-2xl font-display font-black text-white uppercase mb-2">
                  WELCOME TO RED BULL GRAVITY EGYPT
                </h3>
                <p className="font-mono text-xs text-rb-silver max-w-sm mb-6">
                  Congratulations, <span className="text-white font-bold">{buyerName || 'Athlete'}</span>. Your credential has been dispatched to <span className="text-white font-bold">{buyerEmail || 'your email'}</span>.
                </p>

                <div className="holo-card p-5 rounded-2xl border border-white/20 w-full max-w-sm mb-6 font-mono text-xs">
                  <div className="flex justify-between text-rb-muted text-[10px] mb-2">
                    <span>SECTOR: 01-EGYPT</span>
                    <span>GATE: GIZA EXPEDITION</span>
                  </div>
                  <div className="text-base font-bold text-white mb-1">
                    {currentTier.name}
                  </div>
                  <div className="text-xs text-rb-yellow font-bold whitespace-nowrap">
                    TOTAL: {currency === 'USD' ? `$${calculateTotal()}` : `${calculateTotal().toLocaleString()} EGP`}
                  </div>
                  <div className="text-[10px] text-rb-muted mt-2 pt-2 border-t border-white/10">
                    PASS ID: RB-EG26-{Math.floor(100000 + Math.random() * 900000)}
                  </div>
                </div>

                <button
                  onClick={() => setModalOpen(false)}
                  className="px-8 py-3 rounded-full bg-white/10 hover:bg-white/20 text-white font-mono text-xs tracking-wider transition-colors"
                >
                  CLOSE WINDOW
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
};
