import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import type { ReactNode } from 'react';

interface CollapsibleSectionProps {
  open: boolean;
  children: ReactNode;
  className?: string;
}

export function CollapsibleSection({ open, children, className = '' }: CollapsibleSectionProps) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <AnimatePresence initial={false}>
      {open && (
        <motion.div
          key="content"
          initial={prefersReducedMotion ? false : { height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={prefersReducedMotion ? undefined : { height: 0, opacity: 0 }}
          transition={{ duration: prefersReducedMotion ? 0 : 0.25, ease: [0.4, 0, 0.2, 1] }}
          className={`overflow-hidden ${className}`}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
