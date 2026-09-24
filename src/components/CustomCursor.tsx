import React, { useEffect, useState, useRef } from 'react';

export const CustomCursor: React.FC = () => {
  const [pos, setPos] = useState({ x: -100, y: -100 });
  const [isPointer, setIsPointer] = useState(false);
  const [isHoveringCan, setIsHoveringCan] = useState(false);
  const [isMouseDown, setIsMouseDown] = useState(false);
  const trailingPos = useRef({ x: -100, y: -100 });
  const requestRef = useRef<number | null>(null);

  useEffect(() => {
    // Only enable on fine pointer devices (desktop mouse)
    const isTouch = window.matchMedia('(pointer: coarse)').matches;
    if (isTouch) return;

    const handleMouseMove = (e: MouseEvent) => {
      setPos({ x: e.clientX, y: e.clientY });

      const target = e.target as HTMLElement | null;
      if (target) {
        const clickable = target.closest('button, a, input, [role="button"], .cursor-pointer');
        setIsPointer(!!clickable);

        // Check if cursor is over the 3D can canvas area
        const isCanvas = target.tagName.toLowerCase() === 'canvas';
        setIsHoveringCan(isCanvas);
      }
    };

    const handleMouseDown = () => setIsMouseDown(true);
    const handleMouseUp = () => setIsMouseDown(false);

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);

    // Smooth trailing loop
    const animate = () => {
      trailingPos.current.x += (pos.x - trailingPos.current.x) * 0.18;
      trailingPos.current.y += (pos.y - trailingPos.current.y) * 0.18;
      requestRef.current = requestAnimationFrame(animate);
    };
    requestRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [pos]);

  // If outside window
  if (pos.x < 0) return null;

  return (
    <div className="hidden lg:block pointer-events-none fixed inset-0 z-50">
      {/* Central Sharp Reticle */}
      <div
        className="fixed w-2 h-2 rounded-full bg-white transition-transform duration-75 ease-out -translate-x-1/2 -translate-y-1/2"
        style={{
          left: `${pos.x}px`,
          top: `${pos.y}px`,
          transform: `translate(-50%, -50%) scale(${isMouseDown ? 0.6 : 1})`,
        }}
      />

      {/* Trailing Fluid Outer Ring */}
      <div
        className={`fixed rounded-full border transition-all duration-200 ease-out -translate-x-1/2 -translate-y-1/2 flex items-center justify-center ${
          isHoveringCan
            ? 'w-16 h-16 border-rb-yellow bg-rb-yellow/10'
            : isPointer
            ? 'w-12 h-12 border-rb-red bg-rb-red/10 scale-110'
            : 'w-8 h-8 border-white/40'
        }`}
        style={{
          left: `${trailingPos.current.x}px`,
          top: `${trailingPos.current.y}px`,
          transform: `translate(-50%, -50%) scale(${isMouseDown ? 0.85 : 1})`,
        }}
      >
        {isHoveringCan && (
          <span className="text-[9px] font-mono font-bold text-rb-yellow tracking-widest uppercase">
            DRAG
          </span>
        )}
      </div>
    </div>
  );
};
