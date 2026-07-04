import { motion, useReducedMotion } from 'motion/react';
import type { ReactNode } from 'react';
import {
  getPanelCount,
  getPanelTranslateX,
  getPanelWidthPercent,
} from '../../utils/panelNavigation';
import { PanelNav, type ActivePanel } from './PanelNav';

interface AppViewportProps {
  activePanel: ActivePanel;
  hasData: boolean;
  hasExtras: boolean;
  onNavigate: (panel: ActivePanel) => void;
  home: ReactNode;
  results: ReactNode;
  extras: ReactNode;
}

export function AppViewport({
  activePanel,
  hasData,
  hasExtras,
  onNavigate,
  home,
  results,
  extras,
}: AppViewportProps) {
  const prefersReducedMotion = useReducedMotion();
  const panelCount = getPanelCount(hasData, hasExtras);
  const panelWidth = getPanelWidthPercent(panelCount);

  return (
    <div className="panel-shell relative">
      <motion.div
        className="flex h-full"
        style={{ width: `${panelCount * 100}%` }}
        animate={{ x: getPanelTranslateX(activePanel, panelCount) }}
        transition={
          prefersReducedMotion
            ? { duration: 0 }
            : { type: 'spring', stiffness: 320, damping: 32 }
        }
      >
        <div
          className={
            hasData
              ? 'panel-page panel-page-scroll scrollbar-thin'
              : 'panel-page-scroll scrollbar-thin h-full shrink-0'
          }
          style={{ width: panelCount === 1 ? '100%' : panelWidth }}
        >
          {home}
        </div>

        {hasData && (
          <div className="panel-page panel-page-fixed" style={{ width: panelWidth }}>
            {results}
          </div>
        )}

        {hasData && hasExtras && (
          <div className="panel-page panel-page-fixed" style={{ width: panelWidth }}>
            {extras}
          </div>
        )}
      </motion.div>

      <PanelNav
        activePanel={activePanel}
        hasData={hasData}
        hasExtras={hasExtras}
        onNavigate={onNavigate}
      />
    </div>
  );
}
