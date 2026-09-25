import React, { useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import confetti from 'canvas-confetti';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { audio } from '../utils/audio';
import { Check, QrCode, X, Plus, ArrowUpRight, ShieldCheck } from 'lucide-react';
import { useSectionReveal, useSwapAnimation, EASE_OUT } from '../motion/reveal';
import { Collapse } from '../motion/Collapse';
import { Magnetic } from '../motion/Magnetic';

type Currency = 'USD' | 'EGP';

interface TicketTier {
  id: string;
  name: string;
  priceUSD: number;
  priceEGP: number;
  tagline: string;
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

const TIERS: TicketTier[] = [
  {
    id: 'ga',
    name: 'General Admission',
    priceUSD: 89,
    priceEGP: 4350,
    tagline: '3-day spectator pass to every arena',
    features: [
      'All 4 live competition arenas in Giza and the Red Sea',
      'Grandstand seating and festival grounds',
      'Nightly Sphinx Soundstage access',
      'RFID event wristband',
      'Free air-conditioned shuttles from Cairo',
    ],
  },
  {
    id: 'grandstand',
    name: 'Grandstand Apex',
    priceUSD: 159,
    priceEGP: 7750,
    tagline: 'Reserved shade and runway sightlines',
    features: [
      'Everything in General Admission',
      'Reserved elevated seats on the Pyramids flight corridor',
      'Shaded canopy with cooling mist fans',
      'Priority food and drink lanes',
      'Commemorative cap and tote',
    ],
  },
  {
    id: 'vip',
    name: 'Pit Lane VIP',
    priceUSD: 279,
    priceEGP: 13600,
    tagline: 'Trackside, close to the athletes',
    popular: true,
    features: [
      'Everything in Grandstand Apex',
      'Front-row pit lane and runway access',
      'Unlimited chilled Red Bull and mocktail bar',
      'Athlete autograph paddock session',
      'Fast-track security gates',
      'VIP sunset lounge in Dahab and Giza',
    ],
  },
  {
    id: 'paddock',
    name: 'Paddock Club',
    priceUSD: 649,
    priceEGP: 31800,
    tagline: 'Every door open',
    features: [
      'Everything in Pit Lane VIP',
      'Helicopter transfer over the Giza skyline',
      'Five-star Egyptian catering and open bar',
      'Private air-conditioned Pyramids skybox',
      'Engraved metal badge and desert kit',
      'Entry to all 4 athlete celebration galas',
    ],
  },
];

const ADDONS: TicketAddon[] = [
  {
    id: 'glamping',
    name: 'Desert Glamping Oasis',
    priceUSD: 120,
    priceEGP: 5850,
    desc: '3 nights in an air-conditioned Bedouin tent on the Giza plateau.',
  },
  {
    id: 'safari',
    name: '4x4 Sinai Buggy Safari',
    priceUSD: 85,
    priceEGP: 4150,
    desc: 'Guided dune buggy run through the Colored Canyon with course marshals.',
  },
  {
    id: 'sim-fastpass',
    name: 'Simulator Fast Pass',
    priceUSD: 45,
    priceEGP: 2200,
    desc: 'Skip every queue at the racing rigs and Dakar motion pods.',
  },
];

const COMPARISON: { perk: string; from: number }[] = [
  { perk: 'All 4 competition arenas', from: 0 },
  { perk: 'Free Cairo express shuttles', from: 0 },
  { perk: 'Reserved shaded seating', from: 1 },
  { perk: 'Unlimited Red Bull and mocktail bar', from: 2 },
  { perk: 'Athlete paddock meet and greet', from: 2 },
  { perk: 'Helicopter skyline transfer', from: 3 },
  { perk: 'Pyramids skybox and catering', from: 3 },
  { perk: 'Athlete night gala entry', from: 3 },
];

const FAQS = [
  {
    q: 'How do I travel between Giza, Cairo, Sinai and Dahab?',
    a: 'Free air-conditioned shuttles leave every 15 minutes from Tahrir, Zamalek and New Cairo for the Giza gates. For Dahab and Sinai, book the express coach from Sharm El Sheikh Airport or a VIP helicopter transfer through the concierge.',
  },
  {
    q: 'What happens if desert winds delay a run or a dive?',
    a: 'Every pass carries the weather guarantee. If wind goes above 35 knots, heats move to the morning or twilight window and pass holders get priority access to the simulators and paddock sessions.',
  },
  {
    q: 'Can I transfer or resell my pass?',
    a: 'Yes. Passes transfer digitally through your confirmation link up to 24 hours before Day 1. You can also upgrade at any time by paying the difference in the attendee portal.',
  },
  {
    q: 'What should I wear for the November desert climate?',
    a: 'Expect warm, clear days around 26°C and cool evenings around 16°C. Bring breathable clothing, sunglasses, sturdy shoes for sand and a light jacket for the late Sphinx Soundstage sets.',
  },
  {
    q: 'Are food and water provided on site?',
    a: 'Every pass includes 8 shaded hydration stations with chilled water and Red Bull. The culinary village hosts more than 30 Egyptian food makers, and VIP and Paddock Club include open bars and private catering.',
  },
];

const fmt = (value: number, currency: Currency) =>
  currency === 'USD' ? `$${Math.round(value).toLocaleString('en-US')}` : `${Math.round(value).toLocaleString('en-US')} EGP`;

export const TicketSection: React.FC = () => {
  const [currency, setCurrency] = useState<Currency>('EGP');
  const [selectedTier, setSelectedTier] = useState(2);
  const [selectedAddons, setSelectedAddons] = useState<string[]>([]);
  const [compareOpen, setCompareOpen] = useState(false);
  const [activeFaq, setActiveFaq] = useState<number | null>(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [buyerName, setBuyerName] = useState('');
  const [buyerEmail, setBuyerEmail] = useState('');
  const [passId, setPassId] = useState<string | null>(null);

  const rootRef = useRef<HTMLElement>(null);
  const totalRef = useRef<HTMLSpanElement>(null);
  const shownTotal = useRef<number | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  const currentTier = TIERS[selectedTier];
  const priceOf = (item: { priceUSD: number; priceEGP: number }) =>
    currency === 'USD' ? item.priceUSD : item.priceEGP;
  const total =
    priceOf(currentTier) +
    selectedAddons.reduce((acc, id) => {
      const found = ADDONS.find((a) => a.id === id);
      return found ? acc + priceOf(found) : acc;
    }, 0);

  useSectionReveal(rootRef);
  useSwapAnimation(rootRef, `${selectedTier}-${currency}`);

  // Total rolls to its new value; currency switches snap instantly
  const lastCurrency = useRef(currency);
  useGSAP(
    () => {
      const el = totalRef.current;
      if (!el) return;
      const from = shownTotal.current;
      const currencyChanged = lastCurrency.current !== currency;
      lastCurrency.current = currency;
      shownTotal.current = total;
      const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (from === null || currencyChanged || reduce) {
        el.textContent = fmt(total, currency);
        return;
      }
      const counter = { v: from };
      gsap.to(counter, {
        v: total,
        duration: 0.9,
        ease: 'power3.out',
        overwrite: true,
        onUpdate: () => {
          el.textContent = fmt(counter.v, currency);
        },
      });
    },
    { dependencies: [total, currency] }
  );

  // Modal entrance
  useGSAP(
    () => {
      if (!modalOpen || !modalRef.current) return;
      gsap.fromTo(modalRef.current, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.35, ease: 'power2.out' });
      gsap.fromTo(
        modalRef.current.querySelector('[data-modal-panel]'),
        { y: 40, scale: 0.96 },
        { y: 0, scale: 1, duration: 0.8, ease: EASE_OUT }
      );
    },
    { dependencies: [modalOpen] }
  );

  const toggleAddon = (id: string) => {
    audio.playClick();
    setSelectedAddons((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]));
  };

  const openCheckout = () => {
    audio.playClick();
    setPassId(null);
    setModalOpen(true);
  };

  const handleConfirmReservation = (e: React.FormEvent) => {
    e.preventDefault();
    audio.playLiquidSplash(1.0);
    setPassId(`RB-EG26-${Math.floor(100000 + Math.random() * 900000)}`);
    confetti({
      particleCount: 140,
      spread: 85,
      origin: { y: 0.6 },
      colors: ['#ED1B2D', '#FFC800', '#0055B8', '#FFFFFF'],
    });
  };

  return (
    <section
      ref={rootRef}
      id="tickets"
      className="relative min-h-[130dvh] w-full flex flex-col justify-center py-24 px-4 sm:px-10 z-20"
    >
      <div className="max-w-7xl mx-auto w-full">
        <h2 data-reveal="title" className="section-title mb-5 max-w-4xl">
          Choose your <span className="text-rb-red">gravity access.</span>
        </h2>
        <p data-reveal="up" className="text-base sm:text-lg text-rb-silver leading-relaxed max-w-[56ch] mb-12">
          Capped at 48,000 passes to protect the Giza antiquities. Every pass covers all four arenas.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
          {/* Builder */}
          <div className="lg:col-span-7">
            <h3 data-reveal="up" className="font-display font-extrabold uppercase text-white text-lg tracking-[-0.02em] mb-4">
              Pick your pass
            </h3>
            <div className="space-y-3" role="radiogroup" aria-label="Pass tier">
              {TIERS.map((tier, idx) => {
                const active = idx === selectedTier;
                return (
                  <div
                    key={tier.id}
                    data-reveal="up"
                    className={`rounded-3xl border transition-colors duration-500 ${
                      active ? 'border-rb-red bg-rb-red/[0.06]' : 'border-white/10 bg-rb-surface/40 hover:border-white/25'
                    }`}
                  >
                    <button
                      role="radio"
                      aria-checked={active}
                      onClick={() => {
                        if (active) return;
                        audio.playClick();
                        setSelectedTier(idx);
                      }}
                      className="w-full flex items-center gap-4 p-5 sm:p-6 text-left"
                    >
                      <span
                        className={`w-5 h-5 shrink-0 rounded-full border-2 flex items-center justify-center transition-colors ${
                          active ? 'border-rb-red' : 'border-white/30'
                        }`}
                        aria-hidden
                      >
                        <span
                          className={`w-2 h-2 rounded-full bg-rb-red transition-transform duration-300 ${
                            active ? 'scale-100' : 'scale-0'
                          }`}
                        />
                      </span>
                      <span className="flex-1 min-w-0">
                        <span className="flex flex-wrap items-center gap-2">
                          <span className="font-display font-extrabold uppercase text-white text-base sm:text-xl tracking-[-0.02em]">
                            {tier.name}
                          </span>
                          {tier.popular && (
                            <span className="px-2 py-0.5 rounded-full bg-rb-yellow text-rb-dark font-mono text-[10px] font-bold uppercase tracking-wider">
                              Most popular
                            </span>
                          )}
                        </span>
                        <span className="block text-sm text-rb-muted mt-1">{tier.tagline}</span>
                      </span>
                      <span className="font-mono text-base sm:text-lg text-white whitespace-nowrap">
                        {fmt(priceOf(tier), currency)}
                      </span>
                    </button>
                    <Collapse open={active}>
                      <ul className="px-5 sm:px-6 pb-6 pl-14 sm:pl-[3.75rem] grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2.5">
                        {tier.features.map((f) => (
                          <li key={f} className="flex items-start gap-2.5 text-sm text-rb-silver leading-snug">
                            <Check className="w-4 h-4 text-rb-yellow shrink-0 mt-0.5" aria-hidden />
                            {f}
                          </li>
                        ))}
                      </ul>
                    </Collapse>
                  </div>
                );
              })}
            </div>

            <button
              data-reveal="up"
              onClick={() => {
                audio.playClick();
                setCompareOpen((v) => !v);
              }}
              aria-expanded={compareOpen}
              className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-rb-silver hover:text-white transition-colors"
            >
              <Plus className={`w-4 h-4 transition-transform duration-500 ease-out-expo ${compareOpen ? 'rotate-45' : ''}`} />
              Compare all passes
            </button>
            <Collapse open={compareOpen}>
              <div className="mt-4 overflow-x-auto no-scrollbar rounded-3xl surface">
                <table className="w-full min-w-[560px] text-left text-sm">
                  <thead>
                    <tr className="text-rb-muted font-mono text-[11px] uppercase tracking-wider">
                      <th className="p-4 font-medium">Included</th>
                      {TIERS.map((t, i) => (
                        <th key={t.id} className={`p-4 font-medium ${i === selectedTier ? 'text-rb-yellow' : ''}`}>
                          {t.name.split(' ')[0]}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {COMPARISON.map((row, r) => (
                      <tr key={row.perk} className={r % 2 === 0 ? 'bg-white/[0.02]' : ''}>
                        <td className="p-4 text-white">{row.perk}</td>
                        {TIERS.map((t, i) => (
                          <td key={t.id} className="p-4">
                            {i >= row.from ? (
                              <Check className="w-4 h-4 text-rb-yellow" aria-label="Included" />
                            ) : (
                              <span className="text-white/20" aria-label="Not included">-</span>
                            )}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Collapse>

            <h3 data-reveal="up" className="font-display font-extrabold uppercase text-white text-lg tracking-[-0.02em] mt-12 mb-4">
              Add to your trip
            </h3>
            <div className="space-y-3">
              {ADDONS.map((addon) => {
                const on = selectedAddons.includes(addon.id);
                return (
                  <button
                    key={addon.id}
                    data-reveal="up"
                    role="checkbox"
                    aria-checked={on}
                    onClick={() => toggleAddon(addon.id)}
                    className={`w-full flex items-start gap-4 p-5 rounded-3xl border text-left transition-colors duration-500 ${
                      on ? 'border-rb-yellow/60 bg-rb-yellow/[0.05]' : 'border-white/10 bg-rb-surface/40 hover:border-white/25'
                    }`}
                  >
                    <span
                      className={`w-5 h-5 mt-0.5 shrink-0 rounded-md border-2 flex items-center justify-center transition-colors ${
                        on ? 'bg-rb-yellow border-rb-yellow' : 'border-white/30'
                      }`}
                      aria-hidden
                    >
                      <Check className={`w-3.5 h-3.5 text-rb-dark transition-transform duration-300 ${on ? 'scale-100' : 'scale-0'}`} />
                    </span>
                    <span className="flex-1">
                      <span className="block font-display font-bold uppercase text-white tracking-[-0.01em]">{addon.name}</span>
                      <span className="block text-sm text-rb-muted mt-1 leading-snug">{addon.desc}</span>
                    </span>
                    <span className="font-mono text-sm text-white whitespace-nowrap">+{fmt(priceOf(addon), currency)}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Live pass: sticky while you configure */}
          <aside className="lg:col-span-5 lg:sticky lg:top-28">
            <div data-reveal="up" className="holo-card rounded-3xl border border-white/20 p-6 sm:p-8 shadow-2xl">
              <div className="flex items-center justify-between gap-4 pb-6 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <img src="/redbull-logo.svg" alt="Red Bull" className="h-9 w-auto" />
                  <div className="leading-tight">
                    <p className="font-display font-extrabold uppercase text-white text-sm tracking-wide">Gravity Egypt Pass</p>
                    <p className="font-mono text-[11px] text-rb-yellow mt-0.5">13-15 Nov 2026</p>
                  </div>
                </div>
                {/* Currency switch */}
                <div className="flex p-1 rounded-full bg-rb-dark/60 border border-white/10" role="radiogroup" aria-label="Currency">
                  {(['EGP', 'USD'] as Currency[]).map((c) => (
                    <button
                      key={c}
                      role="radio"
                      aria-checked={currency === c}
                      onClick={() => {
                        if (currency === c) return;
                        audio.playClick();
                        setCurrency(c);
                      }}
                      className={`px-3 py-1.5 rounded-full font-mono text-[11px] font-bold transition-colors duration-300 ${
                        currency === c ? 'bg-white text-rb-dark' : 'text-rb-silver hover:text-white'
                      }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>

              <div className="py-6 border-b border-white/10">
                <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-rb-muted mb-2">Your pass</p>
                <p data-swap className="font-display font-extrabold uppercase text-white text-2xl sm:text-3xl tracking-[-0.03em] leading-none">
                  {currentTier.name}
                </p>
                <p className="text-sm text-rb-silver mt-3">
                  {selectedAddons.length === 0
                    ? 'No add-ons'
                    : `${selectedAddons.length} add-on${selectedAddons.length > 1 ? 's' : ''}`}
                </p>
              </div>

              <div className="pt-6">
                <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-rb-muted mb-2">Total</p>
                <span
                  ref={totalRef}
                  className="block font-display font-extrabold text-rb-yellow text-4xl sm:text-5xl tracking-[-0.04em] leading-none mb-7"
                  aria-live="polite"
                />
                {/* Text is written by the GSAP effect above so React never fights the tween */}
                <Magnetic strength={0.15} className="w-full">
                  <button
                    onClick={openCheckout}
                    className="group w-full inline-flex items-center justify-center gap-2.5 h-14 rounded-full bg-rb-red hover:bg-rb-redGlow text-white font-display font-bold text-sm tracking-[0.14em] uppercase shadow-glow-red transition-colors duration-300 active:scale-[0.98]"
                  >
                    Get Passes
                    <ArrowUpRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </button>
                </Magnetic>
                <p className="flex items-start gap-2 text-xs text-rb-muted mt-5 leading-relaxed">
                  <ShieldCheck className="w-4 h-4 text-rb-yellow shrink-0" aria-hidden />
                  Weather guarantee included. Free transfer up to 24 hours before Day 1.
                </p>
              </div>
            </div>
          </aside>
        </div>

        {/* FAQ, moved here from the venue section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12 mt-24">
          <h3 data-reveal="title" className="lg:col-span-4 section-title !text-[clamp(2rem,3.6vw,3rem)]">
            Good to <span className="text-rb-red">know.</span>
          </h3>
          <div className="lg:col-span-8 border-t border-white/10">
            {FAQS.map((faq, idx) => {
              const open = activeFaq === idx;
              return (
                <div key={faq.q} data-reveal="up" className="border-b border-white/10">
                  <button
                    onClick={() => {
                      audio.playClick();
                      setActiveFaq(open ? null : idx);
                    }}
                    aria-expanded={open}
                    className="group w-full flex items-center justify-between gap-6 py-6 text-left"
                  >
                    <span
                      className={`text-base sm:text-lg font-medium transition-colors ${
                        open ? 'text-white' : 'text-rb-silver group-hover:text-white'
                      }`}
                    >
                      {faq.q}
                    </span>
                    <Plus
                      className={`w-5 h-5 shrink-0 transition-transform duration-500 ease-out-expo ${
                        open ? 'rotate-45 text-rb-red' : 'text-rb-muted'
                      }`}
                    />
                  </button>
                  <Collapse open={open}>
                    <p className="pb-6 text-rb-silver leading-relaxed max-w-[64ch]">{faq.a}</p>
                  </Collapse>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Checkout modal: portalled so it layers above the fixed navbar */}
      {modalOpen && createPortal(
        <div
          ref={modalRef}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-rb-dark/85 backdrop-blur-2xl"
          role="dialog"
          aria-modal="true"
          aria-labelledby="checkout-title"
          data-lenis-prevent
        >
          <div
            data-modal-panel
            className="relative w-full max-w-lg glass-panel p-6 sm:p-10 rounded-3xl border border-white/15 shadow-2xl max-h-[90vh] overflow-y-auto no-scrollbar"
          >
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-full hover:bg-white/10 text-rb-muted hover:text-white transition-colors"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>

            {!passId ? (
              <form onSubmit={handleConfirmReservation}>
                <h3 id="checkout-title" className="font-display font-extrabold uppercase text-white text-2xl tracking-[-0.03em] mb-2 pr-10">
                  {currentTier.name}
                </h3>
                <p className="text-sm text-rb-silver mb-8">
                  {currentTier.tagline}
                  {selectedAddons.length > 0 &&
                    `, plus ${selectedAddons.length} add-on${selectedAddons.length > 1 ? 's' : ''}`}
                </p>

                <div className="space-y-5 mb-8">
                  <div className="flex flex-col gap-2">
                    <label htmlFor="buyer-name" className="text-sm font-medium text-rb-silver">
                      Full name
                    </label>
                    <input
                      id="buyer-name"
                      type="text"
                      required
                      autoComplete="name"
                      placeholder="Tarek Hamed"
                      value={buyerName}
                      onChange={(e) => setBuyerName(e.target.value)}
                      className="w-full h-12 px-4 rounded-2xl bg-white/5 border border-white/15 text-white placeholder:text-white/40 focus:outline-none focus:border-rb-red focus:ring-2 focus:ring-rb-red/30 transition-colors"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label htmlFor="buyer-email" className="text-sm font-medium text-rb-silver">
                      Email for your pass
                    </label>
                    <input
                      id="buyer-email"
                      type="email"
                      required
                      autoComplete="email"
                      placeholder="you@example.com"
                      value={buyerEmail}
                      onChange={(e) => setBuyerEmail(e.target.value)}
                      className="w-full h-12 px-4 rounded-2xl bg-white/5 border border-white/15 text-white placeholder:text-white/40 focus:outline-none focus:border-rb-red focus:ring-2 focus:ring-rb-red/30 transition-colors"
                    />
                  </div>
                </div>

                <div className="flex items-baseline justify-between py-5 border-t border-white/10 mb-6">
                  <span className="text-sm text-rb-muted">Total</span>
                  <span className="font-display font-extrabold text-2xl text-rb-yellow tracking-[-0.03em]">
                    {fmt(total, currency)}
                  </span>
                </div>

                <button
                  type="submit"
                  className="w-full h-14 rounded-full bg-rb-red hover:bg-rb-redGlow text-white font-display font-bold text-sm tracking-[0.14em] uppercase shadow-glow-red transition-colors duration-300 active:scale-[0.98]"
                >
                  Confirm reservation
                </button>
              </form>
            ) : (
              <div className="text-center py-2 flex flex-col items-center">
                <div className="w-16 h-16 rounded-full bg-rb-red/15 text-rb-yellow flex items-center justify-center mb-5 border border-rb-yellow/30">
                  <QrCode className="w-8 h-8" />
                </div>
                <h3 id="checkout-title" className="font-display font-extrabold uppercase text-white text-2xl tracking-[-0.03em] mb-3">
                  You're in.
                </h3>
                <p className="text-sm text-rb-silver max-w-sm mb-7">
                  Thanks, <span className="text-white font-medium">{buyerName}</span>. Your pass is on its way to{' '}
                  <span className="text-white font-medium">{buyerEmail}</span>.
                </p>

                <div className="holo-card p-5 rounded-2xl border border-white/20 w-full max-w-sm mb-7 text-left">
                  <p className="font-display font-extrabold uppercase text-white">{currentTier.name}</p>
                  <p className="font-mono text-sm text-rb-yellow mt-1">{fmt(total, currency)}</p>
                  <p className="font-mono text-[11px] text-rb-muted mt-3 pt-3 border-t border-white/10">Pass ID {passId}</p>
                </div>

                <button
                  onClick={() => setModalOpen(false)}
                  className="h-12 px-8 rounded-full bg-white/10 hover:bg-white/20 text-white text-sm font-medium transition-colors"
                >
                  Close
                </button>
              </div>
            )}
          </div>
        </div>,
        document.body
      )}
    </section>
  );
};
