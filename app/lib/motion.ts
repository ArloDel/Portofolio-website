import { useEffect } from "react";
import anime from "animejs";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export const isReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ------------------------------------------------------------------
   useReveal — anime.js scroll-triggered stagger reveal
   Elements matching `selector` inside `ref` fade / slide up into view.
   Optional per-element `data-reveal-delay="120"` (ms) for offsets.
------------------------------------------------------------------- */
export interface RevealOptions {
  translateY?: number;
  duration?: number;
  once?: boolean;
}

export function useReveal(
  ref: React.RefObject<HTMLElement | null>,
  selector = "[data-reveal]",
  options: RevealOptions = {}
) {
  const { translateY = 20, duration = 750, once = true } = options;

  useEffect(() => {
    const container = ref.current;
    if (!container) return;

    const els = Array.from(container.querySelectorAll<HTMLElement>(selector));
    if (els.length === 0) return;

    if (isReducedMotion()) {
      anime.set(els, { opacity: 1, translateY: 0 });
      return;
    }

    anime.set(els, { opacity: 0, translateY });

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const delay = Number(
            (entry.target as HTMLElement).dataset.revealDelay ?? 0
          );
          anime({
            targets: entry.target,
            translateY: [translateY, 0],
            opacity: [0, 1],
            easing: "easeOutExpo",
            duration,
            delay,
          });
          if (once) io.unobserve(entry.target);
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
    );

    els.forEach((el) => io.observe(el));

    return () => {
      io.disconnect();
      anime.remove(els);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ref, selector]);
}

/* ------------------------------------------------------------------
   useParallax — GSAP ScrollTrigger scrub parallax
   Animate `[data-parallax]` children of `ref`.
   `data-parallax="0.3"` -> roughly how far the layer drifts vs scroll.
   `global: true` drives the motion from overall document scroll
   (intended for fixed background layers).
------------------------------------------------------------------- */
export function useParallax(
  ref: React.RefObject<HTMLElement | null>,
  options: { global?: boolean } = {}
) {
  const { global = false } = options;

  useEffect(() => {
    if (isReducedMotion()) return;

    const container = ref.current ?? (global ? document.body : null);
    if (!container) return;

    const els = Array.from(
      container.querySelectorAll<HTMLElement>("[data-parallax]")
    );
    if (els.length === 0) return;

    const tweens = els.map((el) => {
      const speed = Number(el.getAttribute("data-parallax") ?? 0.2);
      const drift = speed * 140;
      return gsap.fromTo(
        el,
        { y: drift },
        {
          y: -drift,
          ease: "none",
          scrollTrigger: global
            ? {
                trigger: document.body,
                start: "top top",
                end: "bottom bottom",
                scrub: 0.9,
              }
            : {
                trigger: el,
                start: "top bottom",
                end: "bottom top",
                scrub: 0.9,
              },
        }
      );
    });

    const refreshTimer = setTimeout(() => ScrollTrigger.refresh(), 500);

    return () => {
      clearTimeout(refreshTimer);
      tweens.forEach((tween) => {
        tween.scrollTrigger?.kill();
        tween.kill();
      });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ref, global]);
}

/* ------------------------------------------------------------------
   useSpotlight — soft radial highlight that trails the cursor
------------------------------------------------------------------- */
export function useSpotlight() {
  useEffect(() => {
    if (isReducedMotion()) return;
    if (window.matchMedia("(pointer: coarse)").matches) return;

    let raf = 0;
    const onMove = (event: MouseEvent) => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        document.documentElement.style.setProperty(
          "--spot-x",
          `${event.clientX}px`
        );
        document.documentElement.style.setProperty(
          "--spot-y",
          `${event.clientY}px`
        );
      });
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
    };
  }, []);
}

/* ------------------------------------------------------------------
   attachMouseParallax — anime.js micro-parallax following the cursor
------------------------------------------------------------------- */
export function attachMouseParallax(
  el: HTMLElement,
  selector: string,
  strength = 14
) {
  const targets = Array.from(el.querySelectorAll<HTMLElement>(selector));
  if (targets.length === 0) return () => {};

  const onMouseMove = (event: MouseEvent) => {
    const x = (event.clientX / window.innerWidth - 0.5) * strength;
    const y = (event.clientY / window.innerHeight - 0.5) * strength;

    targets.forEach((target, index) => {
      anime({
        targets: target,
        translateX: x * (1 + index * 0.25),
        translateY: y * (0.6 + index * 0.35),
        duration: 600,
        easing: "easeOutQuad",
      });
    });
  };

  el.addEventListener("mousemove", onMouseMove, { passive: true });
  return () => el.removeEventListener("mousemove", onMouseMove);
}
