import { ExerciseDemo } from '../types';

/*
  HOW TO ADD A NEW EXERCISE:

  1. Use the exercise name EXACTLY as it appears in constants.ts
  2. For videoSearchUrl: go to YouTube, search the exercise, copy the URL
     from the address bar. Or construct it manually:
     https://www.youtube.com/results?search_query=EXERCISE+NAME+form
  3. For formCue: write a single sentence (under 15 words) with the
     most critical coaching cue. Think "what's the #1 mistake people make?"
  4. For muscles: list 2-3 primary movers in plain English
  5. Set isGolfSpecific: true for exercises that are golf-performance specific

  The lookup function at the bottom handles fuzzy matching, so
  "1-Arm Row" and "1-Arm Rows" will both find the same entry.
*/

const EXERCISE_DEMOS: Record<string, ExerciseDemo> = {

  // ============================================
  // LOWER BODY — COMPOUND
  // ============================================

  "Trap Bar Deadlift": {
    videoSearchUrl: "https://www.youtube.com/results?search_query=trap+bar+deadlift+form+tutorial",
    formCue: "Hinge at hips, flat back, push the floor away.",
    muscles: "Glutes, hamstrings, quads, back",
  },
  "Front Squat": {
    videoSearchUrl: "https://www.youtube.com/results?search_query=front+squat+form+tutorial",
    formCue: "Elbows high, sit between hips, knees track toes.",
    muscles: "Quads, glutes, core",
  },
  "Heel-Elevated Front Squat": {
    videoSearchUrl: "https://www.youtube.com/results?search_query=heel+elevated+front+squat+form",
    formCue: "Heels on plates, upright torso, deep squat.",
    muscles: "Quads, glutes, core",
  },
  "Goblet Squats": {
    videoSearchUrl: "https://www.youtube.com/results?search_query=goblet+squat+form+tutorial",
    formCue: "Hold DB at chest, elbows between knees at bottom.",
    muscles: "Quads, glutes",
  },
  "Bulgarian Split Squat": {
    videoSearchUrl: "https://www.youtube.com/results?search_query=bulgarian+split+squat+form",
    formCue: "Rear foot elevated, torso upright, front knee over toe.",
    muscles: "Quads, glutes (single leg)",
    isGolfSpecific: true,
  },
  "Split Squat": {
    videoSearchUrl: "https://www.youtube.com/results?search_query=split+squat+form+tutorial",
    formCue: "Stagger feet, lower straight down, 90° both knees.",
    muscles: "Quads, glutes (single leg)",
    isGolfSpecific: true,
  },
  "Walking Lunges": {
    videoSearchUrl: "https://www.youtube.com/results?search_query=walking+lunges+form+tutorial",
    formCue: "Long stride, upright torso, push through front heel.",
    muscles: "Quads, glutes, balance",
    isGolfSpecific: true,
  },
  "Lateral Lunges": {
    videoSearchUrl: "https://www.youtube.com/results?search_query=lateral+lunge+form+tutorial",
    formCue: "Wide step to side, sit back into hip, opposite leg straight.",
    muscles: "Adductors, glutes, quads",
    isGolfSpecific: true,
  },
  "Box Jumps": {
    videoSearchUrl: "https://www.youtube.com/results?search_query=box+jump+form+tutorial",
    formCue: "Swing arms, explode up, land softly with knees bent.",
    muscles: "Quads, glutes, calves (power)",
  },

  // ============================================
  // LOWER BODY — ISOLATION / STABILITY
  // ============================================

  "Leg Extensions": {
    videoSearchUrl: "https://www.youtube.com/results?search_query=leg+extension+form+tutorial",
    formCue: "Squeeze quads at top, slow controlled lower.",
    muscles: "Quads (isolation)",
  },
  "Leg Extensions (Rehab)": {
    videoSearchUrl: "https://www.youtube.com/results?search_query=leg+extension+rehab+knee+form",
    formCue: "Light weight, full extension, focus on VMO squeeze.",
    muscles: "Quads — VMO (knee health)",
  },
  "DB Hip Thrusts": {
    videoSearchUrl: "https://www.youtube.com/results?search_query=dumbbell+hip+thrust+form",
    formCue: "Shoulder blades on bench, squeeze glutes hard at top.",
    muscles: "Glutes, hamstrings",
  },
  "Copenhagen Plank": {
    videoSearchUrl: "https://www.youtube.com/results?search_query=copenhagen+plank+form+tutorial",
    formCue: "Top leg on bench, lift hips, brace adductors.",
    muscles: "Adductors, obliques, core",
    isGolfSpecific: true,
  },
  "90/90 Hip Switches": {
    videoSearchUrl: "https://www.youtube.com/results?search_query=90+90+hip+switch+mobility+drill",
    formCue: "Both knees at 90°, rotate hips side to side smoothly.",
    muscles: "Hip internal/external rotation",
    isGolfSpecific: true,
  },

  // ============================================
  // UPPER BODY — PUSH
  // ============================================

  "DB Bench Press": {
    videoSearchUrl: "https://www.youtube.com/results?search_query=dumbbell+bench+press+form+tutorial",
    formCue: "Retract shoulder blades, lower to chest, press up and slightly in.",
    muscles: "Chest, front delts, triceps",
  },
  "Bench Press": {
    videoSearchUrl: "https://www.youtube.com/results?search_query=barbell+bench+press+form+tutorial",
    formCue: "Arch back, retract scapula, bar to mid-chest.",
    muscles: "Chest, front delts, triceps",
  },
  "Incline DB Press": {
    videoSearchUrl: "https://www.youtube.com/results?search_query=incline+dumbbell+press+form+tutorial",
    formCue: "30° incline, press up and together, squeeze at top.",
    muscles: "Upper chest, front delts, triceps",
  },
  "DB Press": {
    videoSearchUrl: "https://www.youtube.com/results?search_query=dumbbell+press+form+tutorial",
    formCue: "Retract shoulder blades, controlled lower, explosive press.",
    muscles: "Chest, front delts, triceps",
  },
  "Overhead DB Press": {
    videoSearchUrl: "https://www.youtube.com/results?search_query=overhead+dumbbell+press+form",
    formCue: "Brace core, press straight overhead, don't arch back.",
    muscles: "Shoulders, triceps, core",
  },
  "Landmine Press": {
    videoSearchUrl: "https://www.youtube.com/results?search_query=landmine+press+form+tutorial",
    formCue: "Half-kneeling or standing, press at an arc, brace core.",
    muscles: "Shoulders, chest, core (anti-rotation)",
    isGolfSpecific: true,
  },
  "Lateral Raises": {
    videoSearchUrl: "https://www.youtube.com/results?search_query=lateral+raise+form+tutorial",
    formCue: "Slight lean forward, lead with elbows, stop at shoulder height.",
    muscles: "Side delts",
  },
  "Tricep Pushdowns": {
    videoSearchUrl: "https://www.youtube.com/results?search_query=tricep+pushdown+form+tutorial",
    formCue: "Elbows pinned to sides, squeeze at bottom, slow return.",
    muscles: "Triceps",
  },

  // ============================================
  // UPPER BODY — PULL
  // ============================================

  "1-Arm Row": {
    videoSearchUrl: "https://www.youtube.com/results?search_query=single+arm+dumbbell+row+form",
    formCue: "Flat back, pull to hip, squeeze shoulder blade back.",
    muscles: "Lats, rhomboids, biceps",
  },
  "1-Arm Rows": {
    videoSearchUrl: "https://www.youtube.com/results?search_query=single+arm+dumbbell+row+form",
    formCue: "Flat back, pull to hip, squeeze shoulder blade back.",
    muscles: "Lats, rhomboids, biceps",
  },
  "Single-Arm DB Row": {
    videoSearchUrl: "https://www.youtube.com/results?search_query=single+arm+dumbbell+row+form",
    formCue: "Flat back, pull to hip, squeeze shoulder blade back.",
    muscles: "Lats, rhomboids, biceps",
  },
  "Seated Cable Row": {
    videoSearchUrl: "https://www.youtube.com/results?search_query=seated+cable+row+form+tutorial",
    formCue: "Chest up, pull to belly button, squeeze shoulder blades.",
    muscles: "Mid-back, lats, biceps",
  },
  "Seated Row": {
    videoSearchUrl: "https://www.youtube.com/results?search_query=seated+row+form+tutorial",
    formCue: "Chest up, pull to belly button, squeeze shoulder blades.",
    muscles: "Mid-back, lats, biceps",
  },
  "Pullups": {
    videoSearchUrl: "https://www.youtube.com/results?search_query=pull+up+form+tutorial+beginner",
    formCue: "Dead hang start, pull chest to bar, control the lower.",
    muscles: "Lats, biceps, core",
  },
  "Weighted Pullups": {
    videoSearchUrl: "https://www.youtube.com/results?search_query=weighted+pull+ups+form+tutorial",
    formCue: "Belt or DB between feet, dead hang, pull chest to bar.",
    muscles: "Lats, biceps, core (loaded)",
  },
  "Face Pulls": {
    videoSearchUrl: "https://www.youtube.com/results?search_query=face+pulls+form+tutorial",
    formCue: "Pull rope to forehead, externally rotate at end, squeeze rear delts.",
    muscles: "Rear delts, rotator cuff",
  },
  "Hammer Curls": {
    videoSearchUrl: "https://www.youtube.com/results?search_query=hammer+curl+form+tutorial",
    formCue: "Neutral grip, elbows still, squeeze at top.",
    muscles: "Biceps, brachialis, forearms",
  },

  // ============================================
  // CORE / ANTI-ROTATION
  // ============================================

  "Pallof Press": {
    videoSearchUrl: "https://www.youtube.com/results?search_query=pallof+press+form+tutorial",
    formCue: "Resist rotation, press cable straight out, brace core.",
    muscles: "Core anti-rotation, obliques",
    isGolfSpecific: true,
  },
  "Rotational Band Woodchop": {
    videoSearchUrl: "https://www.youtube.com/results?search_query=rotational+woodchop+cable+band+form",
    formCue: "Rotate through hips (not arms), brace and control.",
    muscles: "Obliques, hip rotators, core",
    isGolfSpecific: true,
  },
  "Dead Bug": {
    videoSearchUrl: "https://www.youtube.com/results?search_query=dead+bug+exercise+form+tutorial",
    formCue: "Low back pressed to floor, opposite arm/leg extend slowly.",
    muscles: "Deep core, anti-extension",
  },

  // ============================================
  // GOLF-SPECIFIC: SPEED TRAINING
  // ============================================

  "Max Intent Swings (Driver)": {
    videoSearchUrl: "https://www.youtube.com/results?search_query=superspeed+golf+max+intent+swing+training",
    formCue: "100% effort, swing as fast as possible, full rotation.",
    muscles: "Full body power chain — legs, core, arms",
    isGolfSpecific: true,
  },
  "Light Stick Swings": {
    videoSearchUrl: "https://www.youtube.com/results?search_query=superspeed+golf+overspeed+training+light+club",
    formCue: "Lighter than driver, swing FASTER than normal, train the nervous system.",
    muscles: "Neuromuscular speed — overspeed protocol",
    isGolfSpecific: true,
  },
  "Heavy Stick Swings": {
    videoSearchUrl: "https://www.youtube.com/results?search_query=superspeed+golf+overload+heavy+club+training",
    formCue: "Heavier than driver, maintain swing mechanics, build power resistance.",
    muscles: "Neuromuscular strength — overload protocol",
    isGolfSpecific: true,
  },

  // ============================================
  // GOLF-SPECIFIC: TECHNIQUE
  // ============================================

  "Slow-Mo Transition Drills": {
    videoSearchUrl: "https://www.youtube.com/results?search_query=golf+slow+motion+transition+drill+downswing",
    formCue: "Super slow backswing, pause at top, initiate with lower body.",
    muscles: "Sequencing — hips lead, torso follows, arms last",
    isGolfSpecific: true,
  },
  "Lead Arm Only Swings": {
    videoSearchUrl: "https://www.youtube.com/results?search_query=golf+lead+arm+only+swing+drill",
    formCue: "Left arm only (for righties), feel the release point, stay connected.",
    muscles: "Lead side connection — lat, oblique, forearm",
    isGolfSpecific: true,
  },

  // ============================================
  // POWER / ROTATIONAL
  // ============================================

  "Med-ball Throws": {
    videoSearchUrl: "https://www.youtube.com/results?search_query=medicine+ball+rotational+throw+golf+power",
    formCue: "Rotate from hips, release explosively, mimic golf rotation.",
    muscles: "Obliques, hip rotators, full body power",
    isGolfSpecific: true,
  },
};

/**
 * Looks up demo data for an exercise by name.
 * Uses case-insensitive matching and handles common variations
 * (e.g., "1-Arm Row" vs "1-Arm Rows" vs "Single-Arm DB Row").
 *
 * Returns null if no demo is found — the UI should handle this gracefully
 * (just don't show the video button).
 */
export function getExerciseDemo(exerciseName: string): ExerciseDemo | null {
  // Try exact match first
  if (EXERCISE_DEMOS[exerciseName]) {
    return EXERCISE_DEMOS[exerciseName];
  }

  // Try case-insensitive match
  const lowerName = exerciseName.toLowerCase();
  for (const [key, value] of Object.entries(EXERCISE_DEMOS)) {
    if (key.toLowerCase() === lowerName) {
      return value;
    }
  }

  // Try partial match (useful when users rename exercises slightly)
  // Only match if the database key is contained in the exercise name or vice versa
  for (const [key, value] of Object.entries(EXERCISE_DEMOS)) {
    if (lowerName.includes(key.toLowerCase()) || key.toLowerCase().includes(lowerName)) {
      return value;
    }
  }

  return null;
}

/**
 * Generates a YouTube search URL for any exercise name.
 * Used as a fallback when we don't have a curated entry in the database.
 * This way, EVERY exercise gets a "Watch Demo" option.
 */
export function getFallbackVideoUrl(exerciseName: string): string {
  const query = encodeURIComponent(`${exerciseName} form tutorial`);
  return `https://www.youtube.com/results?search_query=${query}`;
}
