import type { ActivePanel } from '../components/layout/PanelNav';

const PANEL_INDEX: Record<ActivePanel, number> = {
  home: 0,
  results: 1,
  extras: 2,
};

export function getPanelCount(hasData: boolean, hasExtras: boolean): number {
  if (!hasData) return 1;
  if (hasExtras) return 3;
  return 2;
}

export function getPanelTranslateX(activePanel: ActivePanel, panelCount: number): string {
  const index = Math.min(PANEL_INDEX[activePanel], panelCount - 1);
  return `-${(index * 100) / panelCount}%`;
}

export function getPanelWidthPercent(panelCount: number): string {
  return `${100 / panelCount}%`;
}
