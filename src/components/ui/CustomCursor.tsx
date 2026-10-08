import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

export function CustomCursor() {
  const followerRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);

  // Low-frequency text state for the label content
  const [activeLabel, setActiveLabel] = useState<string>('');
  const [isFinePointer, setIsFinePointer] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(pointer: fine)').matches;
  });

  const initializedRef = useRef(false);
  const hasMovedRef = useRef(false);
  const currentTextRef = useRef('');

  useEffect(() => {
    const mediaQuery = window.matchMedia('(pointer: fine)');
    const updatePointer = (e: MediaQueryListEvent | MediaQueryList) => {
      setIsFinePointer(e.matches);
    };

    updatePointer(mediaQuery);
    const listener = (e: MediaQueryListEvent) => updatePointer(e);
    mediaQuery.addEventListener('change', listener);

    if (!mediaQuery.matches) {
      return () => mediaQuery.removeEventListener('change', listener);
    }

    const follower = followerRef.current;
    const dot = dotRef.current;
    if (!follower || !dot) return;

    // Guaranteed mounted DOM — initial setup
    document.body.classList.add('has-custom-cursor');

    gsap.set([follower, dot], {
      xPercent: -50,
      yPercent: -50,
      opacity: 0,
      pointerEvents: 'none',
    });

    const xFollower = gsap.quickTo(follower, 'x', { duration: 0.22, ease: 'power3.out' });
    const yFollower = gsap.quickTo(follower, 'y', { duration: 0.22, ease: 'power3.out' });
    const xDot = gsap.quickSetter(dot, 'x', 'px');
    const yDot = gsap.quickSetter(dot, 'y', 'px');

    initializedRef.current = true;

    const handlePointerMove = (e: PointerEvent) => {
      const clientX = e.clientX;
      const clientY = e.clientY;

      if (!hasMovedRef.current) {
        hasMovedRef.current = true;
        // Snap immediately to position without fly-in from corner
        gsap.set(follower, { x: clientX, y: clientY });
        gsap.set(dot, { x: clientX, y: clientY });
        gsap.to([follower, dot], { opacity: 1, duration: 0.2, ease: 'power2.out' });
      }

      xFollower(clientX);
      yFollower(clientY);
      xDot(clientX);
      yDot(clientY);

      const target = e.target as HTMLElement | null;
      if (!target) return;

      // Handle input / form elements — keep cursor unobtrusive
      if (target.closest('input, textarea, select')) {
        if (currentTextRef.current !== '') {
          currentTextRef.current = '';
          setActiveLabel('');
        }
        gsap.to(follower, {
          width: 0,
          height: 0,
          opacity: 0,
          duration: 0.2,
          overwrite: 'auto',
        });
        gsap.to(dot, { opacity: 0, duration: 0.15, overwrite: 'auto' });
        return;
      }

      // Check for contextual data-cursor
      const cursorTarget = target.closest('[data-cursor]') as HTMLElement | null;
      if (cursorTarget) {
        const text = cursorTarget.getAttribute('data-cursor') || '';
        if (currentTextRef.current !== text) {
          currentTextRef.current = text;
          setActiveLabel(text);
        }

        // Smooth expansion to contextual pill
        gsap.to(follower, {
          width: 84,
          height: 84,
          opacity: 1,
          backgroundColor: 'rgba(22, 38, 27, 0.92)',
          borderColor: 'rgba(156, 177, 161, 0.85)',
          duration: 0.35,
          ease: 'power3.out',
          overwrite: 'auto',
        });
        gsap.to(dot, { opacity: 0, duration: 0.15, overwrite: 'auto' });
        return;
      }

      // Normal interactive element (buttons, links)
      if (currentTextRef.current !== '') {
        currentTextRef.current = '';
        setActiveLabel('');
      }

      const isInteractive = Boolean(
        target.closest('button, a, [role="button"], [tabindex="0"]')
      );

      if (isInteractive) {
        gsap.to(follower, {
          width: 44,
          height: 44,
          opacity: 1,
          backgroundColor: 'transparent',
          borderColor: 'rgba(42, 71, 52, 0.65)',
          duration: 0.25,
          ease: 'power2.out',
          overwrite: 'auto',
        });
        gsap.to(dot, { opacity: 0.4, duration: 0.2, overwrite: 'auto' });
      } else {
        // Default resting state
        gsap.to(follower, {
          width: 28,
          height: 28,
          opacity: 1,
          backgroundColor: 'transparent',
          borderColor: 'rgba(30, 51, 37, 0.32)',
          duration: 0.25,
          ease: 'power2.out',
          overwrite: 'auto',
        });
        gsap.to(dot, { opacity: 0.85, duration: 0.2, overwrite: 'auto' });
      }
    };

    const handlePointerDown = () => {
      if (!currentTextRef.current) {
        gsap.to(follower, { scale: 0.84, duration: 0.12, ease: 'power2.out', overwrite: 'auto' });
      }
    };

    const handlePointerUp = () => {
      if (!currentTextRef.current) {
        gsap.to(follower, { scale: 1, duration: 0.2, ease: 'back.out(2)', overwrite: 'auto' });
      }
    };

    const handleMouseLeave = () => {
      hasMovedRef.current = false;
      gsap.to([follower, dot], { opacity: 0, duration: 0.25, ease: 'power2.out' });
    };

    const handleMouseEnter = () => {
      // Prepared for next pointermove
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    window.addEventListener('pointerdown', handlePointerDown);
    window.addEventListener('pointerup', handlePointerUp);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('pointerup', handlePointerUp);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
      mediaQuery.removeEventListener('change', listener);
      document.body.classList.remove('has-custom-cursor');
    };
  }, [isFinePointer]);

  if (!isFinePointer) return null;

  return (
    <aside
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none z-[99999] overflow-hidden select-none"
    >
      {/* Outer Contextual Follower Ring / Pill */}
      <div
        ref={followerRef}
        className="fixed top-0 left-0 rounded-full flex items-center justify-center will-change-transform backdrop-blur-2xs shadow-xs"
        style={{ width: 28, height: 28 }}
      >
        {activeLabel && (
          <span
            ref={labelRef}
            className="text-[9.5px] font-sans tracking-[0.24em] uppercase font-semibold text-[#faf8f4] select-none text-center px-1 leading-none animate-fade-in"
          >
            {activeLabel}
          </span>
        )}
      </div>

      {/* Tiny Precise Center Dot */}
      <div
        ref={dotRef}
        className="fixed top-0 left-0 w-1.5 h-1.5 bg-[#1e3325] rounded-full will-change-transform"
      />
    </aside>
  );
}
