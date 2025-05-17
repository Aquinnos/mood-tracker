import React, { useState } from 'react';
import type { ReactNode } from 'react';
import toast from 'react-hot-toast';
import { MOOD_COLORS, MOOD_ICONS } from '../constants/mood';
import { MoodContext, type Mood } from './MoodContextDefinition';

export function MoodProvider({ children }: { children: ReactNode }) {
  const [moods, setMoods] = useState<Mood[]>(() => {
    const savedMoods = localStorage.getItem('moods');
    return savedMoods ? JSON.parse(savedMoods) : [];
  });

  React.useEffect(() => {
    localStorage.setItem('moods', JSON.stringify(moods));
  }, [moods]);

  const addMood = (mood: Omit<Mood, 'id'>) => {
    const today = new Date().toISOString().split('T')[0];
    if (mood.date > today) {
      toast.error('Cannot add mood for future dates!');
      return;
    }

    setMoods((prev) => {
      const existing = prev.find((m) => m.date === mood.date);
      if (existing) {
        toast.success('Mood updated!');
        return prev.map((m) =>
          m.date === mood.date
            ? { ...m, emoji: mood.emoji, note: mood.note }
            : m
        );
      }
      const newMood: Mood = {
        ...mood,
        id: crypto.randomUUID(),
      };
      toast.success('Mood added!');
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
    toast.success('Mood updated!');
  };

  const getMoodByDate = (date: string) => {
    return moods.find((mood) => mood.date === date);
  };

  const deleteMood = (id: string) => {
    setMoods((prev) => prev.filter((mood) => mood.id !== id));
    toast.success('Mood deleted!');
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
