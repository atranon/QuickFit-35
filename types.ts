
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
  tempo?: string;
  rpe?: number;
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
  rpe?: string;
  heartRate?: number;
}

export interface ExerciseLog {
  name: string;
  sets: SetData[];
}

// Swing speed data captured after speed training sessions
// All fields are optional because a golfer might only have a radar for driver speed
// but not a launch monitor for ball speed or carry
export interface SwingSpeedData {
  driverSpeed?: number;    // Clubhead speed in mph (the main metric)
  ballSpeed?: number;      // Ball speed in mph (optional — needs launch monitor)
  carryDistance?: number;   // Carry distance in yards (optional)
  device?: string;          // What they measured with: "superspeed", "prgr", "mevo", "trackman", "manual"
}

export interface WorkoutLog {
  id: number;
  date: string;
  dayKey: string;
  dayTitle: string;
  notes: string;
  exercises: ExerciseLog[];
  avgHeartRate?: number;
  swingSpeed?: SwingSpeedData;  // NEW: only populated on sessions with speed work
}

export interface LastStats {
    weight: string;
    reps: string;
    date: string;
}

export type ViewState = 'dashboard' | 'workout' | 'history' | 'progress' | 'settings' | 'preferences' | 'plan-selection' | 'onboarding' | 'feedback';

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
  selectedPlan?: WorkoutPlanFrequency;
  selectedProgram?: ProgramType;
  currentInputs?: Record<string, any>;
  currentCompleted?: Record<string, any>;
}

export type FitnessLevel = 'beginner' | 'intermediate' | 'advanced';
export type PrimaryGoal = 'distance' | 'strength' | 'stability' | 'fitness';
export type WeightUnit = 'lbs' | 'kg';
export type TrainingExperience = 'none' | 'some' | 'regular';

// Golf-specific types
export type DrivingDistance = 'under200' | '200-230' | '230-260' | '260-290' | '290plus';
export type HandicapRange = 'beginner' | 'high' | 'mid' | 'low' | 'scratch';
export type SeasonStatus = 'offseason' | 'preseason' | 'inseason' | 'yearround';
export type EquipmentAccess = 'full-gym' | 'home-basic' | 'bands-only' | 'no-equipment';

export interface UserPreferences {
  // Original fields (keeping these so nothing breaks)
  fitnessLevel: FitnessLevel;
  primaryGoal: PrimaryGoal;
  weightUnit: WeightUnit;
  trainingExperience: TrainingExperience;
  completedAt?: number;

  // Golf-specific fields (optional so old saved data still works)
  drivingDistance?: DrivingDistance;
  handicapRange?: HandicapRange;
  seasonStatus?: SeasonStatus;
  equipmentAccess?: EquipmentAccess;
  playerName?: string;
}
