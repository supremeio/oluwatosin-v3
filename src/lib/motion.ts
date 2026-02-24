import type { Transition, Variants } from 'framer-motion';

// ---------------------------------------------------------------------------
// Easing curves
// ---------------------------------------------------------------------------

/** Fast deceleration — the primary easing for entrances and interactive UI. */
export const EASE_OUT: [number, number, number, number] = [0.16, 1, 0.3, 1];

/** Smooth in-out for layout shifts and persistent elements. */
export const EASE_IN_OUT: [number, number, number, number] = [0.45, 0, 0.55, 1];

/** Fast acceleration for exits — content leaves quickly. */
export const EASE_IN: [number, number, number, number] = [0.4, 0, 1, 1];

// ---------------------------------------------------------------------------
// Spring presets
// ---------------------------------------------------------------------------

/** Snappy spring — tabs, pills, interactive state changes. */
export const SPRING_SNAPPY: Transition = {
  type: 'spring',
  stiffness: 420,
  damping: 30,
  mass: 0.8,
};

/** Gentle spring — larger panels, overlays. */
export const SPRING_GENTLE: Transition = {
  type: 'spring',
  stiffness: 280,
  damping: 28,
  mass: 1,
};

// ---------------------------------------------------------------------------
// Duration constants (seconds)
// ---------------------------------------------------------------------------

export const DUR_FAST = 0.18;
export const DUR_BASE = 0.25;
export const DUR_MODERATE = 0.35;

// ---------------------------------------------------------------------------
// Reusable transitions
// ---------------------------------------------------------------------------

export const TRANSITION_BASE: Transition = {
  duration: DUR_BASE,
  ease: EASE_OUT,
};

export const TRANSITION_FAST: Transition = {
  duration: DUR_FAST,
  ease: EASE_OUT,
};

export const TRANSITION_EXIT: Transition = {
  duration: DUR_FAST,
  ease: EASE_IN,
};

// ---------------------------------------------------------------------------
// Reusable variant sets
// ---------------------------------------------------------------------------

/** Fade + 6px upward slide — entrances. */
export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 6 },
  visible: { opacity: 1, y: 0 },
};

/** Pure opacity fade — overlays, subtle reveals. */
export const fade: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

/** Scale + fade — floating cards and panels. */
export const scaleFade: Variants = {
  hidden: { opacity: 0, scale: 0.97 },
  visible: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.97 },
};

/** Slide up from below — floating elements entering from bottom. */
export const slideUp: Variants = {
  hidden: { opacity: 0, y: 14 },
  visible: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 8 },
};

/**
 * Stagger container — wrap children that use fadeUp / scaleFade.
 * @param stagger  delay between each child (s)
 * @param delay    initial delay before first child (s)
 */
export function staggerContainer(stagger = 0.06, delay = 0): Variants {
  return {
    hidden: {},
    visible: {
      transition: { staggerChildren: stagger, delayChildren: delay },
    },
  };
}
