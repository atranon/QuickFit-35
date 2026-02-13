
export type WorkoutPlanFrequency = '2x' | '3x' | '4x' | '5x';
export type ProgramType = 'golf' | 'powerbuilding';

export interface Exercise {
  id: string;
  group: string;
  order: string;
  name: string;
  defaultCategory: string;
  sets: number;
  reps: string;
  rest: number;
  type?: 'strength' | 'speed' | 'technique';
}

export interface DaySchedule {
  title: string;
  subtitle: string;
  color: string;
  exercises: Exercise[];
  type?: 'strength' | 'speed' | 'technique' | 'rest';
}

export interface Schedule {
  [key: string]: DaySchedule;
}

export interface PlanData {
  id: WorkoutPlanFrequency;
  name: string;
  description: string;
  schedule: Schedule;
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

export type ViewState = 'dashboard' | 'workout' | 'history' | 'plan-selection';

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
  selectedPlan?: WorkoutPlanFrequency;
  selectedProgram?: ProgramType;
}
