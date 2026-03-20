import { Phase, PhaseInfo, DaySchedule, Exercise } from '../types';

/*
  HOW WEEK COUNTING WORKS:

  We use the onboarding completion date (stored in user_preferences.completedAt)
  as "Day 1." From there, we count how many full weeks have passed.

  Week 1 = days 0-6 after start
  Week 2 = days 7-13 after start
  ...and so on.

  We then use modulo 4 to figure out which phase they're in:
  - weekInCycle 1 → Foundation
  - weekInCycle 2 → Build
  - weekInCycle 3 → Peak
  - weekInCycle 4 → Deload

  If there's no onboarding date (old user who hasn't re-onboarded),
  we fall back to their first workout date, or just default to Foundation.
*/

// Phase definitions — the metadata for each phase
const PHASE_CONFIG: Record<Phase, { label: string; description: string; color: string }> = {
  foundation: {
    label: 'Foundation',
    description: 'Build patterns. Moderate weight, focus on form. RPE 7.',
    color: 'bg-blue-600 border-blue-400 text-blue-100'
  },
  build: {
    label: 'Build',
    description: 'Volume up. Extra set on main lifts. Push the work. RPE 8.',
    color: 'bg-purple-600 border-purple-400 text-purple-100'
  },
  peak: {
    label: 'Peak',
    description: 'Heavy week. Fewer reps, more weight. Chase PRs. RPE 9.',
    color: 'bg-amber-600 border-amber-400 text-amber-100'
  },
  deload: {
    label: 'Deload',
    description: 'Recovery week. Light and easy. Let your body absorb the gains. RPE 6.',
    color: 'bg-emerald-600 border-emerald-400 text-emerald-100'
  }
};

/**
 * Calculates the current phase based on when the user started.
 * Returns a PhaseInfo object with everything the UI needs.
 */
export function getCurrentPhase(): PhaseInfo {
  // Try to get the onboarding date first
  let startTimestamp: number | null = null;

  try {
    const prefsStr = localStorage.getItem('user_preferences');
    if (prefsStr) {
      const prefs = JSON.parse(prefsStr);
      if (prefs.completedAt) {
        startTimestamp = prefs.completedAt;
      }
    }
  } catch (e) {
    // If preferences are corrupted, fall through to backup
  }

  // Fallback: use the date of their first workout
  if (!startTimestamp) {
    try {
      const historyStr = localStorage.getItem('workout_history');
      if (historyStr) {
        const history = JSON.parse(historyStr);
        if (history.length > 0) {
          // Sort by date ascending, take the first
          const sorted = history.sort((a: any, b: any) =>
            new Date(a.date).getTime() - new Date(b.date).getTime()
          );
          startTimestamp = new Date(sorted[0].date).getTime();
        }
      }
    } catch (e) {
      // Fall through to default
    }
  }

  // If we still don't have a start date, they just started — week 1
  if (!startTimestamp) {
    const config = PHASE_CONFIG['foundation'];
    return {
      phase: 'foundation',
      weekNumber: 1,
      cycleNumber: 1,
      weekInCycle: 1,
      label: `${config.label} — Week 1`,
      description: config.description,
      color: config.color
    };
  }

  // Calculate weeks elapsed
  const now = Date.now();
  const msElapsed = now - startTimestamp;
  const daysElapsed = Math.floor(msElapsed / (1000 * 60 * 60 * 24));
  const weekNumber = Math.floor(daysElapsed / 7) + 1; // 1-indexed

  // Map to 4-week cycle
  // weekInCycle: 1=Foundation, 2=Build, 3=Peak, 4=Deload
  const weekInCycle = ((weekNumber - 1) % 4) + 1; // 1-4
  const cycleNumber = Math.floor((weekNumber - 1) / 4) + 1;

  // Map weekInCycle to phase
  const phaseMap: Record<number, Phase> = {
    1: 'foundation',
    2: 'build',
    3: 'peak',
    4: 'deload'
  };
  const phase = phaseMap[weekInCycle];
  const config = PHASE_CONFIG[phase];

  return {
    phase,
    weekNumber,
    cycleNumber,
    weekInCycle,
    label: `${config.label} — Week ${weekNumber}`,
    description: config.description,
    color: config.color
  };
}

/**
 * Takes a base DaySchedule and returns a MODIFIED copy
 * with phase-appropriate sets, reps, and RPE.
 *
 * IMPORTANT: This returns a NEW object — it never mutates the original.
 * This is crucial because the originals in constants.ts are shared
 * across the whole app. Mutating them would cause subtle bugs.
 *
 * HOW THE MODIFICATIONS WORK:
 *
 * Foundation (week 1 of cycle):
 *   - Sets: unchanged (base)
 *   - Reps: use the HIGHER end of any range (e.g., "6-8" → shows "8")
 *   - RPE guidance: 7
 *   - Philosophy: learn the movements, build work capacity
 *
 * Build (week 2 of cycle):
 *   - Sets: +1 on exercises in "Main", "Force", "Push", "Pull" groups
 *   - Reps: use the FULL range as-is
 *   - RPE guidance: 8
 *   - Philosophy: accumulate volume, push work capacity
 *
 * Peak (week 3 of cycle):
 *   - Sets: unchanged (base)
 *   - Reps: use the LOWER end of any range (e.g., "6-8" → shows "6")
 *   - RPE guidance: 9
 *   - Philosophy: express strength, heavier loads
 *
 * Deload (week 4 of cycle):
 *   - Sets: -1 (minimum 2)
 *   - Reps: use the HIGHER end of any range
 *   - RPE guidance: 6
 *   - Philosophy: active recovery, reduce fatigue
 */
export function applyPhaseToSchedule(schedule: DaySchedule, phase: Phase): DaySchedule {
  // Deep clone to avoid mutating the original constants
  const modified: DaySchedule = {
    ...schedule,
    exercises: schedule.exercises.map(ex => applyPhaseToExercise(ex, phase))
  };

  // Update subtitle to include phase context
  const phaseLabel = PHASE_CONFIG[phase].label;
  modified.subtitle = `${phaseLabel} Phase • ${schedule.subtitle}`;

  return modified;
}

/**
 * Applies phase modifications to a single exercise.
 * Returns a new Exercise object.
 */
function applyPhaseToExercise(exercise: Exercise, phase: Phase): Exercise {
  const ex = { ...exercise }; // Shallow clone

  // Don't modify speed or technique exercises — those are neurological
  // and shouldn't change volume/intensity the same way
  if (ex.type === 'speed' || ex.type === 'technique') {
    // Just add RPE guidance for context
    if (phase === 'deload') {
      ex.rpe = 7; // Slightly reduced even for speed work during deload
    }
    return ex;
  }

  // Determine if this is a "main" lift (gets the extra set in Build phase)
  const mainGroups = ['main', 'force', 'push', 'pull', 'power'];
  const isMainLift = mainGroups.some(g => ex.group.toLowerCase().includes(g));

  switch (phase) {
    case 'foundation':
      ex.reps = getHighEndReps(ex.reps);
      ex.rpe = 7;
      break;

    case 'build':
      // Main lifts get +1 set during Build
      if (isMainLift) {
        ex.sets = ex.sets + 1;
      }
      // Reps stay as the full range
      ex.rpe = 8;
      break;

    case 'peak':
      ex.reps = getLowEndReps(ex.reps);
      ex.rpe = 9;
      break;

    case 'deload':
      ex.sets = Math.max(2, ex.sets - 1);
      ex.reps = getHighEndReps(ex.reps);
      ex.rpe = 6;
      break;
  }

  return ex;
}

/**
 * Parses rep ranges and returns the HIGH end.
 * Examples:
 *   "6-8"     → "8"
 *   "8-10"    → "10"
 *   "3-5"     → "5"
 *   "10"      → "10"     (single number, unchanged)
 *   "8/leg"   → "8/leg"  (has modifier, unchanged)
 *   "30s"     → "30s"    (time-based, unchanged)
 *   "12/side" → "12/side" (has modifier, unchanged)
 */
function getHighEndReps(reps: string): string {
  // If it has a slash (like "8/leg" or "12/side"), don't modify
  if (reps.includes('/')) return reps;
  // If it has a letter (like "30s"), don't modify
  if (/[a-zA-Z]/.test(reps)) return reps;
  // If it's a range like "6-8", return the high end
  if (reps.includes('-')) {
    const parts = reps.split('-');
    return parts[parts.length - 1].trim();
  }
  // Single number, return as-is
  return reps;
}

/**
 * Parses rep ranges and returns the LOW end.
 * Same logic as above but takes the first number in a range.
 */
function getLowEndReps(reps: string): string {
  if (reps.includes('/')) return reps;
  if (/[a-zA-Z]/.test(reps)) return reps;
  if (reps.includes('-')) {
    const parts = reps.split('-');
    return parts[0].trim();
  }
  return reps;
}
