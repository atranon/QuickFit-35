
export interface Exercise {
  id: string;
  group: string;
  order: string;
  name: string;
  defaultCategory: string;
  sets: number;
  reps: string;
  rest: number;
}

export interface DaySchedule {
  title: string;
  subtitle: string;
  color: string;
  exercises: Exercise[];
}

export interface Schedule {
  [key: string]: DaySchedule;
}

export interface SetData {
  set: number;
  weight: string; // Can contain '#' prefix for plate math
  reps: string;
}

export interface ExerciseLog {
  name: string;
  sets: SetData[];
}

export interface WorkoutLog {
  id: number;
  date: string;
  dayKey: string;
  dayTitle: string;
  notes: string;
  exercises: ExerciseLog[];
}

export interface LastStats {
    weight: string;
    reps: string;
    date: string;
}

export type ViewState = 'dashboard' | 'workout' | 'history' | 'progress' | 'settings' | 'preferences';

export interface SyncConfig {
  apiKey: string;
  binId: string;
}

export interface BackupData {
  version: number;
  timestamp: number;
  history: WorkoutLog[];
  customNames: Record<string, string>;
  lastStats: Record<string, any>;
  notes: Record<string, string>;
  preferences?: UserPreferences;
}

export type FitnessLevel = 'beginner' | 'intermediate' | 'advanced';
export type PrimaryGoal = 'distance' | 'strength' | 'stability' | 'fitness';
export type WeightUnit = 'lbs' | 'kg';
export type TrainingExperience = 'none' | 'some' | 'regular';

export interface UserPreferences {
  fitnessLevel: FitnessLevel;
  primaryGoal: PrimaryGoal;
  weightUnit: WeightUnit;
  trainingExperience: TrainingExperience;
  completedAt?: number;
}
