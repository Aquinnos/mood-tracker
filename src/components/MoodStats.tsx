import { useMood } from '../hooks/useMood';
import { format, subDays } from 'date-fns';

export function MoodStats() {
  const { moods, getMoodColor, getMoodIcon } = useMood();

  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = subDays(new Date(), i);
    return format(date, 'yyyy-MM-dd');
  }).reverse();

  const moodCounts = moods.reduce((acc, mood) => {
    acc[mood.emoji] = (acc[mood.emoji] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const mostFrequentMood = Object.entries(moodCounts).sort(
    (a, b) => b[1] - a[1]
  )[0];

  return (
    <div className="bg-white/90 rounded-2xl shadow-xl p-3 md:p-6 border border-[#f8f8e1]">
      <h2 className="text-xl font-bold mb-4 text-primary drop-shadow-sm">
        Mood Statistics
      </h2>

      <div className="space-y-6">
        <div>
          <h3 className="text-sm font-semibold text-accent mb-2">
            Last 7 Days
          </h3>
          <div className="flex gap-1 md:gap-2">
            {last7Days.map((date) => {
              const mood = moods.find((m) => m.date === date);
              return (
                <div
                  key={date}
                  className={`flex-1 aspect-square rounded-xl flex flex-col items-center justify-center border-2 shadow-inner min-w-[36px] md:min-w-[48px] min-h-[36px] md:min-h-[48px] p-3 md:p-2 text-xs md:text-sm ${
                    mood ? getMoodColor(mood.emoji) : 'bg-[#f8f8e1]'
                  }`}
                >
                  <span className="text-xs text-gray-600 mb-1">
                    {format(new Date(date), 'EEE')}
                  </span>
                  {mood ? (
                    <img
                      src={getMoodIcon(mood.emoji)}
                      alt={mood.emoji}
                      className="w-8 h-8 drop-shadow mood-svg hover:scale-110 transition-transform"
                      draggable={false}
                    />
                  ) : (
                    <span className="text-gray-300">-</span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {mostFrequentMood && (
          <div>
            <h3 className="text-sm font-semibold text-accent mb-2">
              Most Frequent Mood
            </h3>
            <div className="flex items-center gap-2">
              <img
                src={getMoodIcon(mostFrequentMood[0])}
                alt={mostFrequentMood[0]}
                className="w-8 h-8 drop-shadow mood-svg"
                draggable={false}
              />
              <span className="text-gray-600 font-bold">
                ({mostFrequentMood[1]} times)
              </span>
            </div>
          </div>
        )}

        <div>
          <h3 className="text-sm font-semibold text-accent mb-2">
            Total Entries
          </h3>
          <p className="text-2xl font-bold text-primary drop-shadow-sm">
            {moods.length}
          </p>
        </div>
      </div>
    </div>
  );
}
