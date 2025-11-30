export interface BuriedSite {
  id: string;
  url: string;
  name: string;
  buriedAt: number; // timestamp
  unlockAt: number; // timestamp
  attempts: number;
}

export interface RitualState {
  isActive: boolean;
  step: 'intro' | 'dragging' | 'burying' | 'sealed';
  targetSite: string | null;
}

export type ViewState = 'dashboard' | 'ritual' | 'horror' | 'penance';