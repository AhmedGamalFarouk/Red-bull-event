import { RefObject, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(useGSAP, ScrollTrigger, SplitText);

export const EASE_OUT = 'expo.out';
const MOTION_OK = '(prefers-reduced-motion: no-preference)';

/**
 * Declarative scroll reveals for a section. Children opt in with data attributes:
 *   data-reveal="title"  headline lines rise out of a mask
 *   data-reveal="up"     fades up, batched so siblings stagger together
 *   data-count           numeric text counts up from zero once
 *   data-parallax        image drifts inside its (overflow-hidden) frame, scrubbed
 *   data-draw="x" | "y"  hairline draws in once (x) or scrubs with the section (y)
 *
 * These only ever touch opacity/transform of section content. The fixed 3D can,
 * Lenis and the section-anchored progress are driven separately in App.
 */
export function useSectionReveal(scope: RefObject<HTMLElement | null>) {
  useGSAP(
    () => {
      const root = scope.current;
      if (!root) return;
      const mm = gsap.matchMedia();

      mm.add(MOTION_OK, () => {
        root.querySelectorAll<HTMLElement>('[data-reveal="title"]').forEach((el) => {
          SplitText.create(el, {
            type: 'lines',
            mask: 'lines',
            linesClass: 'split-line',
            autoSplit: true,
            onSplit(self) {
              return gsap.from(self.lines, {
                yPercent: 110,
                duration: 1.15,
                ease: EASE_OUT,
                stagger: 0.09,
                scrollTrigger: { trigger: el, start: 'top 85%', once: true },
              });
            },
          });
        });

        const ups = root.querySelectorAll<HTMLElement>('[data-reveal="up"]');
        if (ups.length) {
          gsap.set(ups, { autoAlpha: 0, y: 36 });
          ScrollTrigger.batch(ups, {
            start: 'top 90%',
            once: true,
            onEnter: (batch) =>
              gsap.to(batch, {
                autoAlpha: 1,
                y: 0,
                duration: 1,
                ease: EASE_OUT,
                stagger: 0.08,
                overwrite: true,
              }),
          });
        }

        root.querySelectorAll<HTMLElement>('[data-count]').forEach((el) => {
          const raw = el.textContent ?? '';
          const target = parseFloat(raw.replace(/,/g, ''));
          if (Number.isNaN(target)) return;
          const decimals = (raw.split('.')[1] ?? '').length;
          const counter = { v: 0 };
          gsap.to(counter, {
            v: target,
            duration: 1.6,
            ease: 'power3.out',
            scrollTrigger: { trigger: el, start: 'top 90%', once: true },
            onUpdate: () => {
              el.textContent = counter.v.toLocaleString('en-US', {
                minimumFractionDigits: decimals,
                maximumFractionDigits: decimals,
              });
            },
            onComplete: () => {
              el.textContent = raw;
            },
          });
        });

        root.querySelectorAll<HTMLElement>('[data-parallax]').forEach((el) => {
          gsap.fromTo(
            el,
            { yPercent: -7 },
            {
              yPercent: 7,
              ease: 'none',
              scrollTrigger: {
                trigger: el.parentElement ?? el,
                start: 'top bottom',
                end: 'bottom top',
                scrub: true,
              },
            }
          );
        });

        root.querySelectorAll<HTMLElement>('[data-draw="x"]').forEach((el) => {
          gsap.from(el, {
            scaleX: 0,
            transformOrigin: 'left center',
            duration: 1.2,
            ease: EASE_OUT,
            scrollTrigger: { trigger: el, start: 'top 88%', once: true },
          });
        });

        root.querySelectorAll<HTMLElement>('[data-draw="y"]').forEach((el) => {
          gsap.fromTo(
            el,
            { scaleY: 0 },
            {
              scaleY: 1,
              transformOrigin: 'top center',
              ease: 'none',
              scrollTrigger: {
                trigger: el.parentElement ?? el,
                start: 'top 75%',
                end: 'bottom 60%',
                scrub: 0.6,
              },
            }
          );
        });
      });
    },
    { scope }
  );
}

/**
 * Re-plays a short enter animation on `[data-swap]` children whenever `key`
 * changes (tab / athlete / day switches). Skips the initial mount.
 */
export function useSwapAnimation(scope: RefObject<HTMLElement | null>, key: string | number) {
  const prev = useRef(key);
  useGSAP(
    () => {
      if (prev.current === key) return;
      prev.current = key;
      if (!scope.current || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      gsap.fromTo(
        scope.current.querySelectorAll('[data-swap]'),
        { autoAlpha: 0, y: 18 },
        { autoAlpha: 1, y: 0, duration: 0.7, ease: EASE_OUT, stagger: 0.05, overwrite: true }
      );
    },
    { scope, dependencies: [key] }
  );
}
