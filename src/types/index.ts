// src/types/index.ts
export type Language = 'es' | 'fr' | 'de' | 'it';

export interface TranslationProgress {
  progress: number;
  status: string;
}

export interface SrtEntry {
  id: number;
  startTime: string;
  endTime: string;
  text: string;
}