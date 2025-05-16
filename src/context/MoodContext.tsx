import React, { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';

export type Mood = {
  id: string;
  date: string;
  emoji: string;
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
  happy: '/happy.svg',
  neutral: '/neutral.svg',
  sad: '/sad.svg',
  angry: '/angry.svg',
  sleepy: '/sleepy.svg',
};

type MoodContextType = {
  moods: Mood[];
  addMood: (mood: Omit<Mood, 'id'>) => void;
  editMood: (id: string, updates: Partial<Omit<Mood, 'id' | 'date'>>) => void;
  getMoodByDate: (date: string) => Mood | undefined;
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

  React.useEffect(() => {
    localStorage.setItem('moods', JSON.stringify(moods));
  }, [moods]);

  const addMood = (mood: Omit<Mood, 'id'>) => {
    setMoods((prev) => {
      const existing = prev.find((m) => m.date === mood.date);
      if (existing) {
        // Nadpisz istniejący wpis
        return prev.map((m) =>
          m.date === mood.date
            ? { ...m, emoji: mood.emoji, note: mood.note }
            : m
        );
      }
      // Dodaj nowy jeśli nie istnieje
      const newMood: Mood = {
        ...mood,
        id: crypto.randomUUID(),
      };
      return [...prev, newMood];
    });
  };

  const editMood = (
    id: string,
    updates: Partial<Omit<Mood, 'id' | 'date'>>
  ) => {
    setMoods((prev) =>
      prev.map((mood) => (mood.id === id ? { ...mood, ...updates } : mood))
    );
  };

  const getMoodByDate = (date: string) => {
    return moods.find((mood) => mood.date === date);
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
      value={{
        moods,
        addMood,
        editMood,
        getMoodByDate,
        deleteMood,
        getMoodColor,
        getMoodIcon,
      }}
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
