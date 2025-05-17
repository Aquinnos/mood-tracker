import { createContext } from 'react';

export type Mood = {
  id: string;
  date: string;
  emoji: string;
  note: string;
};

export type MoodContextType = {
  moods: Mood[];
  addMood: (mood: Omit<Mood, 'id'>) => void;
  editMood: (id: string, updates: Partial<Omit<Mood, 'id' | 'date'>>) => void;
  getMoodByDate: (date: string) => Mood | undefined;
  deleteMood: (id: string) => void;
  getMoodColor: (mood: string) => string;
  getMoodIcon: (mood: string) => string;
};

export const MoodContext = createContext<MoodContextType | undefined>(
  undefined
);
