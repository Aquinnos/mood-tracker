import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';

export type Mood = {
  id: string;
  date: string;
  emoji: string; // teraz to będzie nazwa nastroju, np. 'happy'
  note: string;
};

export const MOOD_COLORS: Record<string, string> = {
  happy: 'bg-primary',
  neutral: 'bg-secondary',
  sad: 'bg-accent',
  angry: 'bg-red-400',
  sleepy: 'bg-gray-400',
};

export const MOOD_ICONS: Record<string, string> = {
  happy: './src/assets/images/happy.svg',
  neutral: './src/assets/images/neutral.svg',
  sad: './src/assets/images/sad.svg',
  angry: './src/assets/images/angry.svg',
  sleepy: './src/assets/images/sleepy.svg',
};

type MoodContextType = {
  moods: Mood[];
  addMood: (mood: Omit<Mood, 'id'>) => void;
  deleteMood: (id: string) => void;
  getMoodColor: (mood: string) => string;
  getMoodIcon: (mood: string) => string;
};

const MoodContext = createContext<MoodContextType | undefined>(undefined);

export function MoodProvider({ children }: { children: ReactNode }) {
  const [moods, setMoods] = useState<Mood[]>(() => {
    const savedMoods = localStorage.getItem('moods');
    return savedMoods ? JSON.parse(savedMoods) : [];
  });

  useEffect(() => {
    localStorage.setItem('moods', JSON.stringify(moods));
  }, [moods]);

  const addMood = (mood: Omit<Mood, 'id'>) => {
    const newMood: Mood = {
      ...mood,
      id: crypto.randomUUID(),
    };
    setMoods((prev) => [...prev, newMood]);
  };

  const deleteMood = (id: string) => {
    setMoods((prev) => prev.filter((mood) => mood.id !== id));
  };

  const getMoodColor = (mood: string) => {
    return MOOD_COLORS[mood] || 'bg-gray-200';
  };

  const getMoodIcon = (mood: string) => {
    return MOOD_ICONS[mood] || '';
  };

  return (
    <MoodContext.Provider
      value={{ moods, addMood, deleteMood, getMoodColor, getMoodIcon }}
    >
      {children}
    </MoodContext.Provider>
  );
}

export function useMood() {
  const context = useContext(MoodContext);
  if (context === undefined) {
    throw new Error('useMood must be used within a MoodProvider');
  }
  return context;
}
