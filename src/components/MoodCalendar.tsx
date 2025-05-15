import { useMood } from '../context/MoodContext';
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  isToday,
} from 'date-fns';
import { useState } from 'react';
import { MoodFilter } from './MoodFilter';

export function MoodCalendar() {
  const { moods, getMoodColor, getMoodIcon, deleteMood } = useMood();
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [currentDate, setCurrentDate] = useState(new Date());
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const getMoodForDate = (date: Date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    return moods.find((mood) => mood.date === dateStr);
  };

  const handleDayClick = (date: Date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    setSelectedDate(selectedDate === dateStr ? null : dateStr);
  };

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    deleteMood(id);
    setSelectedDate(null);
  };

  return (
    <div className="bg-white/90 rounded-2xl shadow-xl p-6 border border-[#f8f8e1]">
      <MoodFilter onDateChange={setCurrentDate} />
      <h2 className="text-xl font-bold mb-4 text-primary drop-shadow-sm">
        {format(currentDate, 'MMMM yyyy')}
      </h2>
      <div className="grid grid-cols-7 gap-2">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
          <div
            key={day}
            className="text-center text-sm font-semibold text-accent"
          >
            {day}
          </div>
        ))}
        {days.map((day) => {
          const mood = getMoodForDate(day);
          const isCurrentMonth = isSameMonth(day, currentDate);
          const isCurrentDay = isToday(day);
          const dateStr = format(day, 'yyyy-MM-dd');
          const isSelected = selectedDate === dateStr;

          return (
            <div
              key={day.toISOString()}
              onClick={() => handleDayClick(day)}
              className={`aspect-square p-2 rounded-xl transition-all cursor-pointer flex flex-col items-center justify-center border-2 ${
                mood ? getMoodColor(mood.emoji) : 'bg-[#f8f8e1]'
              } ${isCurrentDay ? 'ring-2 ring-primary' : ''} ${
                !isCurrentMonth ? 'opacity-50' : ''
              } ${
                isSelected
                  ? 'ring-4 ring-accent border-accent scale-105 shadow-lg'
                  : 'hover:scale-105 hover:shadow-md border-transparent'
              }`}
              style={{ minHeight: 64 }}
            >
              <div className="text-xs text-gray-600 mb-1 font-semibold">
                {format(day, 'd')}
              </div>
              {mood && (
                <img
                  src={getMoodIcon(mood.emoji)}
                  alt={mood.emoji}
                  className="w-8 h-8 mx-auto mb-1 drop-shadow mood-svg hover:scale-110 transition-transform"
                  draggable={false}
                />
              )}
              {isSelected && mood && (
                <div className="mt-2 text-xs text-gray-700 bg-white/80 rounded p-2 shadow-inner border border-[#f8f8e1] w-full">
                  {mood.note && (
                    <p className="mb-2 line-clamp-2">{mood.note}</p>
                  )}
                  <button
                    onClick={(e) => handleDelete(mood.id, e)}
                    className="text-red-500 hover:text-red-700 transition-colors font-bold"
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
