'use client';

import { MotionConfig } from 'framer-motion';

/**
 * Wraps the app with Framer Motion's global config.
 * `reducedMotion="user"` automatically respects prefers-reduced-motion.
 */
export function MotionProvider({ children }: { children: React.ReactNode }): React.ReactElement {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
