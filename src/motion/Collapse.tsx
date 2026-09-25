import React, { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { EASE_OUT } from './reveal';

interface CollapseProps {
  open: boolean;
  children: React.ReactNode;
  className?: string;
}

/** Height-animated disclosure. Content stays mounted so the tween can measure it. */
export const Collapse: React.FC<CollapseProps> = ({ open, children, className = '' }) => {
  const ref = useRef<HTMLDivElement>(null);
  const mounted = useRef(false);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      if (!mounted.current) {
        mounted.current = true;
        gsap.set(el, { height: open ? 'auto' : 0, autoAlpha: open ? 1 : 0 });
        return;
      }
      const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      gsap.to(el, {
        height: open ? 'auto' : 0,
        autoAlpha: open ? 1 : 0,
        duration: reduce ? 0 : 0.65,
        ease: EASE_OUT,
        overwrite: true,
        onComplete: () => ScrollTrigger.refresh(),
      });
    },
    { dependencies: [open] }
  );

  return (
    <div ref={ref} className={`overflow-hidden ${className}`} aria-hidden={!open}>
      {children}
    </div>
  );
};
