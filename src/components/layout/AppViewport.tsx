import { motion, useReducedMotion } from 'motion/react';
import type { ReactNode } from 'react';
import { PanelNav, type ActivePanel } from './PanelNav';

interface AppViewportProps {
  activePanel: ActivePanel;
  hasData: boolean;
  onNavigate: (panel: ActivePanel) => void;
  home: ReactNode;
  results: ReactNode;
}

export function AppViewport({
  activePanel,
  hasData,
  onNavigate,
  home,
  results,
}: AppViewportProps) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <div className="panel-shell relative">
      <motion.div
        className="flex h-full"
        style={{ width: hasData ? '200%' : '100%' }}
        animate={{ x: hasData && activePanel === 'results' ? '-50%' : '0%' }}
        transition={
          prefersReducedMotion
            ? { duration: 0 }
            : { type: 'spring', stiffness: 320, damping: 32 }
        }
      >
        <div className={hasData ? 'panel-page' : 'h-full w-full shrink-0'}>{home}</div>
        {hasData && <div className="panel-page">{results}</div>}
      </motion.div>

      <PanelNav activePanel={activePanel} hasData={hasData} onNavigate={onNavigate} />
    </div>
  );
}
