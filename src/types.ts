export type AppStage = 'intro' | 'game1' | 'game2' | 'invitation';

export interface RSVPData {
  name: string;
  coming: 'yes' | 'no' | 'maybe';
  guestsCount: number;
  message?: string;
  timestamp?: string;
}

export interface CatchingItem {
  id: number;
  x: number; // percentage 0 - 100
  y: number; // percentage 0 - 100
  type: 'diamond' | 'emerald' | 'gold' | 'coal' | 'tnt';
  speed: number;
}

export interface ChessPos {
  row: number;
  col: number;
}
