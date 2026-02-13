import React, { useState, useEffect, useMemo } from 'react';
import { ArrowLeft, TrendingUp, Calendar, Dumbbell, Target, ChevronDown, ChevronUp } from 'lucide-react';
import { WorkoutLog } from '../types';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface ProgressViewProps {
  onBack: () => void;
}

interface ExerciseProgress {
  name: string;
  data: Array<{
    date: string;
    weight: number;
    reps: number;
    volume: number;
  }>;
  startWeight: number;
  endWeight: number;
  percentChange: number;
}

const ProgressView: React.FC<ProgressViewProps> = ({ onBack }) => {
  const [history, setHistory] = useState<WorkoutLog[]>([]);
  const [selectedExercise, setSelectedExercise] = useState<string | null>(null);
  const [showAllExercises, setShowAllExercises] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('workout_history');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setHistory(parsed.sort((a: WorkoutLog, b: WorkoutLog) => new Date(a.date).getTime() - new Date(b.date).getTime()));
      } catch (e) {
        console.error("Failed to parse history", e);
        setHistory([]);
      }
    }
  }, []);

  // Calculate total workouts
  const totalWorkouts = history.length;

  // Calculate current streak
  const currentStreak = useMemo(() => {
    if (history.length === 0) return 0;

    const sortedDesc = [...history].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    let streak = 0;
    let lastDate = new Date();

    for (const workout of sortedDesc) {
      const workoutDate = new Date(workout.date);
      const daysDiff = Math.floor((lastDate.getTime() - workoutDate.getTime()) / (1000 * 60 * 60 * 24));

      if (daysDiff <= 7) {
        streak++;
        lastDate = workoutDate;
      } else {
        break;
      }
    }

    return streak;
  }, [history]);

  // Calculate volume per workout over time
  const volumeData = useMemo(() => {
    return history.map(log => {
      let totalVolume = 0;
      log.exercises.forEach(ex => {
        ex.sets.forEach(set => {
          const weight = parseFloat(set.weight.replace('#', '')) || 0;
          const reps = parseInt(set.reps) || 0;
          totalVolume += weight * reps;
        });
      });

      return {
        date: new Date(log.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        volume: Math.round(totalVolume),
        dayTitle: log.dayTitle
      };
    });
  }, [history]);

  // Calculate exercise-specific progress
  const exerciseProgress = useMemo(() => {
    const exerciseMap = new Map<string, ExerciseProgress['data']>();

    history.forEach(log => {
      log.exercises.forEach(ex => {
        if (!exerciseMap.has(ex.name)) {
          exerciseMap.set(ex.name, []);
        }

        const validSets = ex.sets.filter(set => set.weight && set.reps);
        if (validSets.length > 0) {
          const avgWeight = validSets.reduce((sum, set) => {
            return sum + (parseFloat(set.weight.replace('#', '')) || 0);
          }, 0) / validSets.length;

          const avgReps = validSets.reduce((sum, set) => {
            return sum + (parseInt(set.reps) || 0);
          }, 0) / validSets.length;

          exerciseMap.get(ex.name)!.push({
            date: new Date(log.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            weight: Math.round(avgWeight * 10) / 10,
            reps: Math.round(avgReps),
            volume: Math.round(avgWeight * avgReps)
          });
        }
      });
    });

    const progressArray: ExerciseProgress[] = [];
    exerciseMap.forEach((data, name) => {
      if (data.length >= 2) {
        const startWeight = data[0].weight;
        const endWeight = data[data.length - 1].weight;
        const percentChange = startWeight > 0 ? ((endWeight - startWeight) / startWeight) * 100 : 0;

        progressArray.push({
          name,
          data,
          startWeight,
          endWeight,
          percentChange
        });
      }
    });

    return progressArray.sort((a, b) => Math.abs(b.percentChange) - Math.abs(a.percentChange));
  }, [history]);

  // Workout frequency by day
  const workoutsByDay = useMemo(() => {
    const dayCounts: { [key: string]: number } = {};
    history.forEach(log => {
      dayCounts[log.dayTitle] = (dayCounts[log.dayTitle] || 0) + 1;
    });

    return Object.entries(dayCounts).map(([day, count]) => ({
      day,
      count
    }));
  }, [history]);

  if (history.length === 0) {
    return (
      <div className="pb-24">
        <div className="flex items-center gap-3 mb-6">
          <button onClick={onBack} className="bg-slate-800 p-2 rounded-lg text-white hover:bg-slate-700">
            <ArrowLeft size={20} />
          </button>
          <h2 className="text-xl font-bold text-white">Progress</h2>
        </div>

        <div className="text-center py-12 text-slate-500">
          <Target size={48} className="mx-auto mb-4 opacity-50" />
          <p>Complete your first workout to see progress stats!</p>
        </div>
      </div>
    );
  }

  const displayedExercises = showAllExercises ? exerciseProgress : exerciseProgress.slice(0, 5);

  return (
    <div className="pb-24">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={onBack} className="bg-slate-800 p-2 rounded-lg text-white hover:bg-slate-700">
          <ArrowLeft size={20} />
        </button>
        <h2 className="text-xl font-bold text-white">Progress</h2>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="bg-gradient-to-br from-blue-500/20 to-blue-600/10 border border-blue-500/30 rounded-xl p-4 text-center">
          <Dumbbell className="mx-auto mb-2 text-blue-400" size={24} />
          <div className="text-2xl font-bold text-white">{totalWorkouts}</div>
          <div className="text-xs text-slate-400">Workouts</div>
        </div>

        <div className="bg-gradient-to-br from-green-500/20 to-green-600/10 border border-green-500/30 rounded-xl p-4 text-center">
          <TrendingUp className="mx-auto mb-2 text-green-400" size={24} />
          <div className="text-2xl font-bold text-white">{currentStreak}</div>
          <div className="text-xs text-slate-400">Week Streak</div>
        </div>

        <div className="bg-gradient-to-br from-orange-500/20 to-orange-600/10 border border-orange-500/30 rounded-xl p-4 text-center">
          <Calendar className="mx-auto mb-2 text-orange-400" size={24} />
          <div className="text-2xl font-bold text-white">{workoutsByDay.length}</div>
          <div className="text-xs text-slate-400">Days Hit</div>
        </div>
      </div>

      {/* Volume Over Time */}
      <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4 mb-6">
        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <TrendingUp size={18} className="text-blue-400" />
          Volume Per Workout
        </h3>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={volumeData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis
              dataKey="date"
              stroke="#94a3b8"
              style={{ fontSize: '12px' }}
              angle={-45}
              textAnchor="end"
              height={60}
            />
            <YAxis stroke="#94a3b8" style={{ fontSize: '12px' }} />
            <Tooltip
              contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569', borderRadius: '8px' }}
              labelStyle={{ color: '#e2e8f0' }}
            />
            <Line
              type="monotone"
              dataKey="volume"
              stroke="#3b82f6"
              strokeWidth={2}
              dot={{ fill: '#3b82f6', r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Workout Frequency */}
      <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4 mb-6">
        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <Calendar size={18} className="text-green-400" />
          Workout Frequency
        </h3>
        <ResponsiveContainer width="100%" height={180}>
          <BarChart data={workoutsByDay}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis
              dataKey="day"
              stroke="#94a3b8"
              style={{ fontSize: '11px' }}
              angle={-45}
              textAnchor="end"
              height={80}
            />
            <YAxis stroke="#94a3b8" style={{ fontSize: '12px' }} />
            <Tooltip
              contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569', borderRadius: '8px' }}
              labelStyle={{ color: '#e2e8f0' }}
            />
            <Bar dataKey="count" fill="#10b981" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Exercise Progress */}
      <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4 mb-6">
        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <Dumbbell size={18} className="text-orange-400" />
          Weight Progression
        </h3>

        <div className="space-y-3">
          {displayedExercises.map(exercise => (
            <div key={exercise.name} className="bg-slate-900/50 border border-slate-700/50 rounded-lg p-3">
              <div
                className="flex justify-between items-center cursor-pointer"
                onClick={() => setSelectedExercise(selectedExercise === exercise.name ? null : exercise.name)}
              >
                <div className="flex-1">
                  <div className="font-semibold text-white text-sm">{exercise.name}</div>
                  <div className="text-xs text-slate-400 mt-1">
                    {exercise.startWeight} lbs → {exercise.endWeight} lbs
                    <span className={`ml-2 font-bold ${exercise.percentChange >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      ({exercise.percentChange >= 0 ? '+' : ''}{exercise.percentChange.toFixed(1)}%)
                    </span>
                  </div>
                </div>
                {selectedExercise === exercise.name ? (
                  <ChevronUp size={18} className="text-slate-400" />
                ) : (
                  <ChevronDown size={18} className="text-slate-400" />
                )}
              </div>

              {selectedExercise === exercise.name && (
                <div className="mt-4">
                  <ResponsiveContainer width="100%" height={150}>
                    <LineChart data={exercise.data}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                      <XAxis
                        dataKey="date"
                        stroke="#94a3b8"
                        style={{ fontSize: '10px' }}
                        angle={-45}
                        textAnchor="end"
                        height={50}
                      />
                      <YAxis stroke="#94a3b8" style={{ fontSize: '10px' }} />
                      <Tooltip
                        contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569', borderRadius: '8px', fontSize: '12px' }}
                        labelStyle={{ color: '#e2e8f0' }}
                      />
                      <Line
                        type="monotone"
                        dataKey="weight"
                        stroke="#f97316"
                        strokeWidth={2}
                        dot={{ fill: '#f97316', r: 3 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>
          ))}
        </div>

        {exerciseProgress.length > 5 && (
          <button
            onClick={() => setShowAllExercises(!showAllExercises)}
            className="mt-3 w-full text-center text-sm text-blue-400 hover:text-blue-300 font-semibold transition"
          >
            {showAllExercises ? 'Show Less' : `Show ${exerciseProgress.length - 5} More Exercises`}
          </button>
        )}
      </div>
    </div>
  );
};

export default ProgressView;
