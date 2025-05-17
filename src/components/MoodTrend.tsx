import { useMood } from '../hooks/useMood';
import { format, subDays } from 'date-fns';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import type { ChartOptions } from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const MOOD_VALUES = {
  happy: 5,
  neutral: 3,
  sad: 1,
  angry: 2,
  sleepy: 4,
};

export function MoodTrend() {
  const { moods } = useMood();

  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = subDays(new Date(), i);
    return format(date, 'yyyy-MM-dd');
  }).reverse();

  const moodData = last7Days.map((date) => {
    const mood = moods.find((m) => m.date === date);
    return mood ? MOOD_VALUES[mood.emoji as keyof typeof MOOD_VALUES] : null;
  });

  const data = {
    labels: last7Days.map((date) => format(new Date(date), 'MMM d')),
    datasets: [
      {
        label: 'Mood Trend',
        data: moodData,
        borderColor: '#FF6B6B',
        backgroundColor: 'rgba(255, 107, 107, 0.1)',
        tension: 0.4,
        fill: true,
        pointBackgroundColor: '#FF6B6B',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
      },
    ],
  };

  const options: ChartOptions<'line'> = {
    responsive: true,
    animation: {
      duration: 2000,
      easing: 'easeInOutQuart',
    },
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: 'Mood Trend (Last 7 Days)',
        font: {
          family: 'Comfortaa',
          size: 16,
        },
        padding: {
          top: 10,
          bottom: 20,
        },
      },
      tooltip: {
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        titleColor: '#333',
        bodyColor: '#666',
        borderColor: '#FF6B6B',
        borderWidth: 1,
        padding: 10,
        displayColors: false,
        callbacks: {
          label: function (context) {
            const value = context.parsed.y;
            const mood = Object.entries(MOOD_VALUES).find(
              ([, v]) => v === value
            );
            return mood
              ? `Mood: ${mood[0].charAt(0).toUpperCase() + mood[0].slice(1)}`
              : 'No mood recorded';
          },
        },
      },
    },
    scales: {
      y: {
        type: 'linear',
        min: 0,
        max: 6,
        grid: {
          color: 'rgba(0, 0, 0, 0.05)',
        },
        ticks: {
          stepSize: 1,
          callback: function (value) {
            const mood = Object.entries(MOOD_VALUES).find(
              ([, v]) => v === value
            );
            return mood
              ? mood[0].charAt(0).toUpperCase() + mood[0].slice(1)
              : '';
          },
        },
      },
      x: {
        grid: {
          display: false,
        },
      },
    },
    interaction: {
      intersect: false,
      mode: 'index',
    },
  };

  return (
    <div className="mood-card bg-white/95 rounded-2xl shadow-xl p-6 border border-[#f8f8e1] transition-all duration-300 hover:shadow-2xl">
      <Line data={data} options={options} />
    </div>
  );
}
