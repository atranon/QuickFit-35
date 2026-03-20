
export type WorkoutPlanFrequency = '2x' | '3x' | '4x' | '5x';
export type ProgramType = 'golf' | 'powerbuilding';

// Phase system — 4-week mesocycle that repeats
export type Phase = 'foundation' | 'build' | 'peak' | 'deload';

// PhaseInfo is what the phase engine returns — everything the UI needs to display
export interface PhaseInfo {
  phase: Phase;           // Which phase we're in right now
  weekNumber: number;     // Absolute week number since they started (1, 2, 3...)
  cycleNumber: number;    // Which 4-week cycle they're on (1, 2, 3...)
  weekInCycle: number;    // Week within the current cycle (1-4)
  label: string;          // Human-readable label like "Build — Week 6"
  description: string;    // Short coaching cue for this phase
  color: string;          // Tailwind color class for UI badges
}

// Demo data for each exercise — video, form cues, and metadata
// The video system has a 3-tier fallback:
//   1. selfHostedUrl (your own GIF/video hosted on Supabase Storage or CDN)
//   2. youtubeVideoId (specific YouTube video embedded in-app)
//   3. videoSearchUrl (YouTube search link — opens externally as last resort)
export interface ExerciseDemo {
  videoSearchUrl: string;         // YouTube search URL (Tier 3 fallback)
  youtubeVideoId?: string;        // Specific YouTube video ID for in-app embed (Tier 2)
  selfHostedUrl?: string;         // Your own hosted GIF/video URL (Tier 1 — best)
  formCue: string;                // One-line coaching cue shown inline
  coachingPoints?: string[];      // 3-5 detailed coaching bullet points for the demo modal
  muscles: string;                // Target muscles in plain English
  isGolfSpecific?: boolean;       // Flag for golf-performance exercises
}

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

export type ViewState = 'dashboard' | 'workout' | 'history' | 'progress' | 'settings' | 'preferences' | 'plan-selection' | 'onboarding' | 'feedback' | 'assessment';

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
export type EquipmentAccess = 'full-gym' | 'home-dumbbells' | 'bands-only' | 'no-equipment';

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

// Mobility assessment — TPI-lite self-screening
export type MobilityScore = 'pass' | 'partial' | 'fail';
export type MobilityTestId = 'overhead_squat' | 'trunk_rotation' | 'toe_touch' | 'single_leg_balance' | 'pelvic_tilt';

export interface MobilityResult {
  testId: MobilityTestId;
  score: MobilityScore;
  side?: 'left' | 'right' | 'both';  // Some tests are bilateral
}

export interface MobilityAssessmentData {
  results: MobilityResult[];
  completedAt: number;
  // Derived flags — calculated when assessment is completed
  flags: MobilityFlag[];
}

export interface MobilityFlag {
  area: string;           // e.g., "Hip Mobility", "Thoracic Rotation"
  severity: 'warning' | 'limitation';  // warning = partial, limitation = fail
  message: string;        // e.g., "Limited hip rotation may restrict backswing turn"
  correctives: string[];  // Exercise names to include in warm-up
}

// Warm-up exercise (simpler than a full Exercise — no sets/reps tracking)
export interface WarmUpExercise {
  name: string;
  duration: string;        // e.g., "30 seconds", "10 each side"
  cue: string;             // One-line coaching cue
  isCorrectiveFor?: MobilityTestId;  // If this targets a specific assessment area
}
