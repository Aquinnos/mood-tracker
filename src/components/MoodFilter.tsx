import { useState } from 'react';
import { subMonths, addMonths } from 'date-fns';

type MoodFilterProps = {
  onDateChange: (date: Date) => void;
};

export function MoodFilter({ onDateChange }: MoodFilterProps) {
  const [currentDate, setCurrentDate] = useState(new Date());

  const handlePreviousMonth = () => {
    const newDate = subMonths(currentDate, 1);
    setCurrentDate(newDate);
    onDateChange(newDate);
  };

  const handleNextMonth = () => {
    const newDate = addMonths(currentDate, 1);
    setCurrentDate(newDate);
    onDateChange(newDate);
  };

  const handleToday = () => {
    const today = new Date();
    setCurrentDate(today);
    onDateChange(today);
  };

  return (
    <div className="flex items-center justify-between mb-4">
      <button
        onClick={handlePreviousMonth}
        className="px-3 py-1 rounded-lg bg-white hover:bg-primary hover:text-white transition-colors"
      >
        ←
      </button>
      <button
        onClick={handleToday}
        className="px-4 py-1 rounded-lg bg-primary text-white hover:bg-opacity-90 transition-colors"
      >
        Today
      </button>
      <button
        onClick={handleNextMonth}
        className="px-3 py-1 rounded-lg bg-white hover:bg-primary hover:text-white transition-colors"
      >
        →
      </button>
    </div>
  );
}
