import { useContext } from 'react';
import { MoodContext } from '../context/MoodContextDefinition';

export function useMood() {
  const context = useContext(MoodContext);
  if (context === undefined) {
    throw new Error('useMood must be used within a MoodProvider');
  }
  return context;
}
