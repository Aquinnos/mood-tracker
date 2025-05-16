import React, { useState } from 'react';
import { useMood } from '../context/MoodContext';
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  isToday,
  getDay,
} from 'date-fns';
import { MoodFilter } from './MoodFilter';

const MOODS = [
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

export function MoodCalendar() {
  const { getMoodColor, deleteMood, getMoodByDate, addMood, editMood } =
    useMood();
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [editingNote, setEditingNote] = useState('');
  const [editingMood, setEditingMood] = useState<string | null>(null);
  const [selectedFilter, setSelectedFilter] = useState('all');

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });
  const startWeekDay = getDay(monthStart); // 0 (Sun) - 6 (Sat)
  const endWeekDay = getDay(monthEnd); // 0 (Sun) - 6 (Sat)
  // Liczba pustych komórek na początku
  const leadingEmpty = Array.from({ length: startWeekDay });
  // Liczba pustych komórek na końcu, by siatka była pełna (dopełniamy do 7)
  const trailingEmpty = Array.from({ length: (7 - 1 - endWeekDay + 7) % 7 });

  const handleDayClick = (date: Date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    const existingMood = getMoodByDate(dateStr);

    setSelectedDate(dateStr);
    setEditingNote(existingMood?.note || '');
    setEditingMood(existingMood?.emoji || null);
  };

  const handleSave = () => {
    if (!selectedDate) return;

    const existingMood = getMoodByDate(selectedDate);
    if (existingMood) {
      editMood(existingMood.id, {
        emoji: editingMood || existingMood.emoji,
        note: editingNote,
      });
    } else if (editingMood) {
      addMood({
        date: selectedDate,
        emoji: editingMood,
        note: editingNote,
      });
    }

    setSelectedDate(null);
    setEditingNote('');
    setEditingMood(null);
  };

  const handleFilterChange = (mood: string) => {
    setSelectedFilter(mood);
  };

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    deleteMood(id);
    setSelectedDate(null);
  };

  return (
    <div className="bg-white/90 rounded-2xl shadow-xl p-3 md:p-6 border border-[#f8f8e1]">
      <MoodFilter
        onDateChange={setCurrentDate}
        onFilterChange={handleFilterChange}
      />
      <h2 className="text-xl font-bold mb-4 text-primary drop-shadow-sm">
        {format(currentDate, 'MMMM yyyy')}
      </h2>
      <div className="overflow-x-auto">
        <div className="grid grid-cols-7 gap-1 md:gap-2 w-full mb-1">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
            <div
              key={day}
              className="text-center text-sm font-semibold text-accent"
            >
              {day}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1 md:gap-2 w-full">
          {/* Puste komórki na początek tygodnia */}
          {leadingEmpty.map((_, i) => (
            <div key={`empty-start-${i}`} className="" />
          ))}
          {/* Dni miesiąca */}
          {days.map((day) => {
            const mood = getMoodByDate(format(day, 'yyyy-MM-dd'));
            const isCurrentMonth = isSameMonth(day, currentDate);
            const isCurrentDay = isToday(day);
            const dateStr = format(day, 'yyyy-MM-dd');
            const isSelected = selectedDate === dateStr;
            const showMood =
              selectedFilter === 'all' ||
              (mood && mood.emoji === selectedFilter);
            return (
              <div
                key={day.toISOString()}
                onClick={() => handleDayClick(day)}
                className={`aspect-square p-1 md:p-2 rounded-xl transition-all cursor-pointer flex flex-col items-center justify-center border-2 ${
                  mood ? getMoodColor(mood.emoji) : 'bg-[#f8f8e1]'
                } ${isCurrentDay ? 'ring-2 ring-primary' : ''} ${
                  !isCurrentMonth ? 'opacity-50' : ''
                } ${
                  isSelected
                    ? 'ring-2 ring-pink-200 border-pink-200 shadow-lg'
                    : 'hover:scale-105 hover:shadow-md border-transparent'
                }`}
                style={{ minHeight: 48 }}
              >
                <div className="text-xs text-gray-600 mb-1 font-semibold">
                  {format(day, 'd')}
                </div>
                {showMood && mood && (
                  <img
                    src={MOODS.find((m) => m.value === mood.emoji)?.icon}
                    alt={mood.emoji}
                    className="w-8 h-8 mx-auto mb-1 drop-shadow mood-svg hover:scale-110 transition-transform"
                    draggable={false}
                  />
                )}
                {isSelected && mood && (
                  <div className="mt-2 bg-white/80 rounded p-1 shadow-inner border border-[#f8f8e1] w-full flex flex-col items-center">
                    <button
                      onClick={(e) => handleDelete(mood.id, e)}
                      className="text-red-500 hover:text-red-700 transition-colors font-bold text-xs pointer-events-auto"
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>
            );
          })}
          {/* Puste komórki na koniec tygodnia */}
          {trailingEmpty.map((_, i) => (
            <div key={`empty-end-${i}`} className="" />
          ))}
        </div>
      </div>

      {selectedDate && (
        <div className="mt-4 p-4 bg-white rounded-lg shadow">
          <h3 className="font-semibold mb-2">
            {format(new Date(selectedDate), 'MMMM d, yyyy')}
          </h3>
          <div className="flex gap-2 mb-4">
            {MOODS.map(({ value, label, icon }) => (
              <button
                key={value}
                type="button"
                onClick={() => setEditingMood(value)}
                className={`mood-button flex items-center justify-center rounded-full transition-all w-12 h-12 bg-white focus:outline-none focus:ring-2 focus:ring-[#ff90bb]
                  ${
                    editingMood === value
                      ? 'border-primary ring-1 ring-[#ff90bb] scale-110 shadow'
                      : 'border-gray-200'
                  }
                `}
                aria-label={label}
              >
                <img src={icon} alt={value} className="w-6 h-6 md:w-8 md:h-8" />
              </button>
            ))}
          </div>
          <textarea
            value={editingNote}
            onChange={(e) => setEditingNote(e.target.value)}
            className="note-input mb-4"
            placeholder="Add a note about your day..."
          />
          <button
            onClick={handleSave}
            className="save-button"
            disabled={!editingMood}
          >
            Save Changes
          </button>
        </div>
      )}
    </div>
  );
}
