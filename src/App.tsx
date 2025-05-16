import { useState } from 'react';
import { MoodProvider, useMood } from './context/MoodContext';
import { format } from 'date-fns';
import { MoodCalendar } from './components/MoodCalendar';
import { MoodStats } from './components/MoodStats';
import { MoodTrend } from './components/MoodTrend';

const MOODS = [
  { name: 'happy', src: '/happy.svg', alt: 'Happy' },
  { name: 'neutral', src: '/neutral.svg', alt: 'Neutral' },
  { name: 'sad', src: '/sad.svg', alt: 'Sad' },
  { name: 'angry', src: '/angry.svg', alt: 'Angry' },
  { name: 'sleepy', src: '/sleepy.svg', alt: 'Sleepy' },
];

function MoodTracker() {
  const { addMood } = useMood();
  const [selectedMood, setSelectedMood] = useState<string>('');
  const [note, setNote] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMood) return;

    addMood({
      date: format(new Date(), 'yyyy-MM-dd'),
      emoji: selectedMood,
      note,
    });

    setSelectedMood('');
    setNote('');
  };

  return (
    <div className="min-h-screen bg-[#fdfcf7] py-8">
      <div className="max-w-2xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-center mb-8 text-primary">
          Mood Tracker
        </h1>

        <form
          onSubmit={handleSubmit}
          className="bg-white/95 rounded-2xl shadow-xl p-8 mb-10 border border-[#f8f8e1]"
        >
          <div className="mb-6">
            <label className="block text-accent text-base font-bold mb-3">
              How are you feeling today?
            </label>
            <div className="flex gap-6 justify-center">
              {MOODS.map((mood) => (
                <button
                  key={mood.name}
                  type="button"
                  onClick={() => setSelectedMood(mood.name)}
                  tabIndex={0}
                  className={`p-2 rounded-xl transition-all bg-white hover:border-primary pointer-events-auto ${
                    selectedMood === mood.name
                      ? 'border-primary ring-2 ring-[#ff90bb]'
                      : 'border-transparent'
                  }`}
                  aria-label={mood.alt}
                >
                  <img
                    src={mood.src}
                    alt={mood.alt}
                    className="w-8 h-8 md:w-15 md:h-10"
                  />
                </button>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-accent text-base font-bold mb-2">
              Add a note (optional)
            </label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-[#f8f8e1]"
              rows={3}
              placeholder="How was your day?"
            />
          </div>

          <button
            type="submit"
            disabled={!selectedMood}
            className="w-full bg-primary text-white py-3 px-4 rounded-lg text-lg font-semibold shadow-md hover:bg-opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all pointer-events-auto"
          >
            Save Mood
          </button>
        </form>

        <div className="space-y-8">
          <MoodCalendar />
          <MoodTrend />
          <MoodStats />
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <MoodProvider>
      <MoodTracker />
    </MoodProvider>
  );
}

export default App;
