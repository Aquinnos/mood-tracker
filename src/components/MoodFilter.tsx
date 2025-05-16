import { useState } from 'react';
import { subMonths, addMonths } from 'date-fns';

const MOODS = [
  { value: 'all', label: 'All Moods' },
  { value: 'happy', label: 'Happy', icon: '/happy.svg' },
  {
    value: 'neutral',
    label: 'Neutral',
    icon: '/neutral.svg',
  },
  { value: 'sad', label: 'Sad', icon: '/sad.svg' },
  { value: 'angry', label: 'Angry', icon: '/angry.svg' },
  { value: 'sleepy', label: 'Sleepy', icon: '/sleepy.svg' },
];

type MoodFilterProps = {
  onDateChange: (date: Date) => void;
  onFilterChange: (mood: string) => void;
};

export function MoodFilter({ onDateChange, onFilterChange }: MoodFilterProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isOpen, setIsOpen] = useState(false);
  const [selectedMood, setSelectedMood] = useState('all');

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

  const handleMoodSelect = (mood: string) => {
    setSelectedMood(mood);
    onFilterChange(mood);
    setIsOpen(false);
  };

  return (
    <div className="flex flex-col gap-4 mb-4">
      <div className="flex justify-between items-center">
        <button
          onClick={handlePreviousMonth}
          className="p-2 hover:bg-gray-100 rounded-lg"
        >
          ←
        </button>
        <button
          onClick={handleToday}
          className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
        >
          Today
        </button>
        <button
          onClick={handleNextMonth}
          className="p-2 hover:bg-gray-100 rounded-lg"
        >
          →
        </button>
      </div>

      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full p-2 text-left bg-white rounded-lg shadow-sm border border-gray-200 flex items-center justify-between"
        >
          <span className="flex items-center gap-2">
            {selectedMood === 'all' ? (
              'All Moods'
            ) : (
              <>
                <img
                  src={MOODS.find((m) => m.value === selectedMood)?.icon}
                  alt={selectedMood}
                  className="w-6 h-6"
                />
                <span>
                  {MOODS.find((m) => m.value === selectedMood)?.label}
                </span>
              </>
            )}
          </span>
          <span className="text-gray-500">▼</span>
        </button>

        {isOpen && (
          <div className="absolute z-10 w-full mt-1 bg-white rounded-lg shadow-lg border border-gray-200">
            {MOODS.map(({ value, label, icon }) => (
              <button
                key={value}
                onClick={() => handleMoodSelect(value)}
                className={`w-full p-2 text-left hover:bg-gray-100 flex items-center gap-2 ${
                  selectedMood === value ? 'bg-gray-50' : ''
                }`}
              >
                {value !== 'all' && (
                  <img src={icon} alt={value} className="w-6 h-6" />
                )}
                <span>{label}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
