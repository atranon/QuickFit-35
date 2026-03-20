import { DaySchedule, Exercise, EquipmentAccess } from '../types';

/*
  HOW THE SUBSTITUTION MAP WORKS:

  Each entry maps a gym exercise name to alternatives for lower equipment tiers.
  The key is the original exercise name (matching constants.ts exactly).

  Each alternative includes:
  - name: the replacement exercise
  - defaultCategory: the category label (shown in the UI)
  - notes: why this is a good substitute (shown as a tooltip/cue)

  The tiers cascade: if there's no specific 'bands-only' entry,
  the system falls back to 'home-dumbbells', then uses the original.

  'full-gym' exercises are never substituted (they're the originals).
  Exercises that already work with minimal equipment (like walking lunges,
  dead bugs, 90/90 hip switches) don't need entries — they pass through unchanged.
*/

interface SubstitutionEntry {
  'home-dumbbells'?: { name: string; defaultCategory: string };
  'bands-only'?: { name: string; defaultCategory: string };
  'no-equipment'?: { name: string; defaultCategory: string };
}

const SUBSTITUTION_MAP: Record<string, SubstitutionEntry> = {

  // ============================================
  // LOWER BODY — HINGE PATTERN
  // ============================================

  "Trap Bar Deadlift": {
    'home-dumbbells': { name: "DB Romanian Deadlift", defaultCategory: "Hinge" },
    'bands-only': { name: "Band Pull-Through", defaultCategory: "Hinge" },
    'no-equipment': { name: "Single Leg Hip Hinge", defaultCategory: "Hinge" },
  },

  // ============================================
  // LOWER BODY — SQUAT PATTERN
  // ============================================

  "Front Squat": {
    'home-dumbbells': { name: "DB Goblet Squat", defaultCategory: "Squat" },
    'bands-only': { name: "Band-Resisted Squat", defaultCategory: "Squat" },
    'no-equipment': { name: "Bodyweight Squat (Tempo 3-1-3)", defaultCategory: "Squat" },
  },
  "Heel-Elevated Front Squat": {
    'home-dumbbells': { name: "Heel-Elevated Goblet Squat", defaultCategory: "Squat" },
    'bands-only': { name: "Heel-Elevated Band Squat", defaultCategory: "Squat" },
    'no-equipment': { name: "Heel-Elevated BW Squat (Slow)", defaultCategory: "Squat" },
  },
  "Goblet Squats": {
    // Already works with dumbbells — no sub needed for home-dumbbells
    'bands-only': { name: "Band-Resisted Squat", defaultCategory: "Squat" },
    'no-equipment': { name: "Bodyweight Squat (Pause Rep)", defaultCategory: "Squat" },
  },

  // ============================================
  // LOWER BODY — SINGLE LEG
  // ============================================

  "Bulgarian Split Squat": {
    // Works with dumbbells already — no sub needed
    'bands-only': { name: "Band Bulgarian Split Squat", defaultCategory: "Single Leg" },
    'no-equipment': { name: "Bodyweight Bulgarian Split Squat", defaultCategory: "Single Leg" },
  },
  "Walking Lunges": {
    // Works at all tiers — bodyweight is enough
    'bands-only': { name: "Band-Resisted Walking Lunges", defaultCategory: "Single Leg" },
    // no-equipment: bodyweight walking lunges work as-is
  },
  "Lateral Lunges": {
    'bands-only': { name: "Bodyweight Lateral Lunges", defaultCategory: "Lateral" },
    'no-equipment': { name: "Bodyweight Lateral Lunges", defaultCategory: "Lateral" },
  },
  "Split Squat": {
    'bands-only': { name: "Band Split Squat", defaultCategory: "Single Leg" },
    'no-equipment': { name: "Bodyweight Split Squat (Tempo)", defaultCategory: "Single Leg" },
  },

  // ============================================
  // LOWER BODY — MACHINE / ISOLATION
  // ============================================

  "Leg Extensions": {
    'home-dumbbells': { name: "DB Spanish Squat", defaultCategory: "Quads" },
    'bands-only': { name: "Band Terminal Knee Extension", defaultCategory: "Quads" },
    'no-equipment': { name: "Wall Sit (Timed)", defaultCategory: "Quads" },
  },
  "Leg Extensions (Rehab)": {
    'home-dumbbells': { name: "Seated DB Knee Extension", defaultCategory: "Rehab" },
    'bands-only': { name: "Band Terminal Knee Extension", defaultCategory: "Rehab" },
    'no-equipment': { name: "Seated Knee Extension (Slow)", defaultCategory: "Rehab" },
  },
  "Box Jumps": {
    'home-dumbbells': { name: "DB Jump Squats", defaultCategory: "Power" },
    'bands-only': { name: "Squat Jumps", defaultCategory: "Power" },
    'no-equipment': { name: "Squat Jumps", defaultCategory: "Power" },
  },
  "DB Hip Thrusts": {
    // Works with dumbbells already
    'bands-only': { name: "Band Hip Thrust", defaultCategory: "Glutes" },
    'no-equipment': { name: "Glute Bridge (Single Leg)", defaultCategory: "Glutes" },
  },

  // ============================================
  // UPPER BODY — PUSH
  // ============================================

  "Bench Press": {
    'home-dumbbells': { name: "DB Floor Press", defaultCategory: "Push" },
    'bands-only': { name: "Band Push-Up", defaultCategory: "Push" },
    'no-equipment': { name: "Push-Ups (Varied Tempo)", defaultCategory: "Push" },
  },
  "DB Bench Press": {
    // Works with dumbbells (it's literally a DB exercise)
    'bands-only': { name: "Band Push-Up", defaultCategory: "Push" },
    'no-equipment': { name: "Push-Ups", defaultCategory: "Push" },
  },
  "Incline DB Press": {
    // If they have DBs but no incline bench, floor press works
    'bands-only': { name: "Band Incline Push-Up", defaultCategory: "Upper Push" },
    'no-equipment': { name: "Decline Push-Ups (Feet Elevated)", defaultCategory: "Upper Push" },
  },
  "DB Press": {
    'bands-only': { name: "Band Chest Press", defaultCategory: "Push" },
    'no-equipment': { name: "Push-Ups (Explosive)", defaultCategory: "Push" },
  },
  "Overhead DB Press": {
    // Works with dumbbells already
    'bands-only': { name: "Band Overhead Press", defaultCategory: "Shoulders" },
    'no-equipment': { name: "Pike Push-Ups", defaultCategory: "Shoulders" },
  },
  "Landmine Press": {
    'home-dumbbells': { name: "Single-Arm DB Press (Half-Kneeling)", defaultCategory: "Push/Core" },
    'bands-only': { name: "Band Single-Arm Press (Half-Kneeling)", defaultCategory: "Push/Core" },
    'no-equipment': { name: "Single-Arm Push-Up (Elevated)", defaultCategory: "Push/Core" },
  },
  "Lateral Raises": {
    // Works with dumbbells already
    'bands-only': { name: "Band Lateral Raises", defaultCategory: "Shoulders" },
    'no-equipment': { name: "Prone Y-T-W Raises", defaultCategory: "Shoulders" },
  },
  "Tricep Pushdowns": {
    'home-dumbbells': { name: "DB Overhead Tricep Extension", defaultCategory: "Triceps" },
    'bands-only': { name: "Band Tricep Pushdown", defaultCategory: "Triceps" },
    'no-equipment': { name: "Diamond Push-Ups", defaultCategory: "Triceps" },
  },

  // ============================================
  // UPPER BODY — PULL
  // ============================================

  "Pullups": {
    'home-dumbbells': { name: "DB Bent-Over Row (Both Arms)", defaultCategory: "Pull" },
    'bands-only': { name: "Band Lat Pulldown", defaultCategory: "Pull" },
    'no-equipment': { name: "Inverted Row (Under Table)", defaultCategory: "Pull" },
  },
  "Weighted Pullups": {
    'home-dumbbells': { name: "DB Bent-Over Row (Heavy)", defaultCategory: "Pull" },
    'bands-only': { name: "Band Lat Pulldown (Doubled)", defaultCategory: "Pull" },
    'no-equipment': { name: "Inverted Row (Feet Elevated)", defaultCategory: "Pull" },
  },
  "1-Arm Row": {
    // Works with dumbbells already
    'bands-only': { name: "Band 1-Arm Row", defaultCategory: "Pull" },
    'no-equipment': { name: "Inverted 1-Arm Row", defaultCategory: "Pull" },
  },
  "1-Arm Rows": {
    'bands-only': { name: "Band 1-Arm Row", defaultCategory: "Pull" },
    'no-equipment': { name: "Inverted 1-Arm Row", defaultCategory: "Pull" },
  },
  "Single-Arm DB Row": {
    'bands-only': { name: "Band 1-Arm Row", defaultCategory: "Pull" },
    'no-equipment': { name: "Inverted 1-Arm Row", defaultCategory: "Pull" },
  },
  "Seated Cable Row": {
    'home-dumbbells': { name: "DB Bent-Over Row", defaultCategory: "Mid-Back" },
    'bands-only': { name: "Band Seated Row", defaultCategory: "Mid-Back" },
    'no-equipment': { name: "Prone Y-Raise", defaultCategory: "Mid-Back" },
  },
  "Seated Row": {
    'home-dumbbells': { name: "DB Bent-Over Row", defaultCategory: "Mid-Back" },
    'bands-only': { name: "Band Seated Row", defaultCategory: "Mid-Back" },
    'no-equipment': { name: "Prone Y-Raise", defaultCategory: "Mid-Back" },
  },
  "Face Pulls": {
    'home-dumbbells': { name: "DB Rear Delt Flyes (Bent Over)", defaultCategory: "Rear Delts" },
    'bands-only': { name: "Band Pull-Aparts", defaultCategory: "Rear Delts" },
    'no-equipment': { name: "Prone T-Raises", defaultCategory: "Rear Delts" },
  },
  "Hammer Curls": {
    // Works with dumbbells already
    'bands-only': { name: "Band Hammer Curls", defaultCategory: "Biceps" },
    'no-equipment': { name: "Chin-Up Hold (Isometric)", defaultCategory: "Biceps" },
  },

  // ============================================
  // CORE — CABLE/MACHINE EXERCISES
  // ============================================

  "Pallof Press": {
    'home-dumbbells': { name: "Band Pallof Press", defaultCategory: "Anti-Rotation" },
    'bands-only': { name: "Band Pallof Press", defaultCategory: "Anti-Rotation" },
    'no-equipment': { name: "Dead Bug (Anti-Rotation Focus)", defaultCategory: "Anti-Rotation" },
  },
  "Rotational Band Woodchop": {
    'home-dumbbells': { name: "DB Rotational Press", defaultCategory: "Rotation" },
    // Already a band exercise — works as-is for bands-only
    'no-equipment': { name: "Rotational Plank Reach", defaultCategory: "Rotation" },
  },

  // ============================================
  // GOLF SPEED — these generally DON'T change
  // because they use a golf club / speed sticks, not gym equipment.
  // But we provide bodyweight alternatives for someone without ANY clubs.
  // ============================================

  "Max Intent Swings (Driver)": {
    'no-equipment': { name: "Max Intent Swings (Towel Whip)", defaultCategory: "Speed" },
  },
  "Light Stick Swings": {
    'no-equipment': { name: "Speed Swings (Towel Whip)", defaultCategory: "Overspeed" },
  },
  "Heavy Stick Swings": {
    'no-equipment': { name: "Resisted Rotation (Band Anchor)", defaultCategory: "Overload" },
  },

  // ============================================
  // MED BALL — needs a wall and a ball
  // ============================================

  "Med-ball Throws": {
    'home-dumbbells': { name: "DB Rotational Press (Explosive)", defaultCategory: "Power" },
    'bands-only': { name: "Band Rotational Chop (Explosive)", defaultCategory: "Power" },
    'no-equipment': { name: "Rotational Slam (Imaginary)", defaultCategory: "Power" },
  },
};

/*
  THE NO-CHANGE LIST:

  These exercises work at all equipment tiers and don't need substitution:
  - Walking Lunges (bodyweight is fine)
  - Dead Bug (bodyweight)
  - Copenhagen Plank (bodyweight + any elevated surface)
  - 90/90 Hip Switches (bodyweight)
  - Slow-Mo Transition Drills (just need a club or stick)
  - Lead Arm Only Swings (just need a club)

  They're NOT in the substitution map, so they pass through unchanged.
*/

// ============================================
// PUBLIC FUNCTION
// ============================================

/**
 * Takes a DaySchedule and an equipment level, and returns
 * a modified copy with appropriate exercise substitutions.
 *
 * Full-gym users get the original plan unchanged.
 * Other tiers get substituted exercises based on the map.
 *
 * If an exercise has no substitution for the given tier,
 * it cascades: tries the current tier, then the next higher tier,
 * then passes the original through unchanged.
 *
 * IMPORTANT: This returns a NEW object — never mutates the original.
 */
export function applyEquipmentToSchedule(schedule: DaySchedule, equipment: EquipmentAccess): DaySchedule {
  // Full gym = no changes needed
  if (equipment === 'full-gym') return schedule;

  const modified: DaySchedule = {
    ...schedule,
    exercises: schedule.exercises.map(ex => substituteExercise(ex, equipment)),
  };

  return modified;
}

/**
 * Substitutes a single exercise based on equipment tier.
 * Uses cascading fallback: tries exact tier, then next higher tier.
 */
function substituteExercise(exercise: Exercise, equipment: EquipmentAccess): Exercise {
  const subs = SUBSTITUTION_MAP[exercise.name];
  if (!subs) return exercise; // No substitution needed — exercise works as-is

  // Cascade order: try exact tier, then try higher tiers
  const cascadeOrder: EquipmentAccess[] =
    equipment === 'no-equipment' ? ['no-equipment', 'bands-only', 'home-dumbbells'] :
    equipment === 'bands-only' ? ['bands-only', 'home-dumbbells'] :
    equipment === 'home-dumbbells' ? ['home-dumbbells'] :
    [];

  for (const tier of cascadeOrder) {
    const sub = subs[tier as keyof SubstitutionEntry];
    if (sub) {
      return {
        ...exercise,
        name: sub.name,
        defaultCategory: sub.defaultCategory,
        // Keep everything else (sets, reps, rest, type, tempo, rpe, group, order, id)
      };
    }
  }

  // No substitution found at any tier — return original
  return exercise;
}

/**
 * Returns the user's equipment level from preferences.
 * Defaults to 'full-gym' if not set.
 */
export function getUserEquipment(): EquipmentAccess {
  try {
    const prefsStr = localStorage.getItem('user_preferences');
    if (prefsStr) {
      const prefs = JSON.parse(prefsStr);
      return prefs.equipmentAccess || 'full-gym';
    }
  } catch (e) {
    // Fall through
  }
  return 'full-gym';
}
