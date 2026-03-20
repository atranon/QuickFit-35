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
    youtubeVideoId: "GXqkSClNHnM", // Verify: popular trap bar DL tutorial
    formCue: "Hinge at hips, flat back, push the floor away.",
    coachingPoints: [
      "Stand in the center of the trap bar, feet hip-width apart",
      "Push your hips BACK first (hinge), then bend knees to reach the handles",
      "Chest up, lats engaged — imagine bending the bar around your legs",
      "Drive through the full foot, squeeze glutes hard at lockout",
      "Control the descent — don't just drop it"
    ],
    muscles: "Glutes, hamstrings, quads, back",
  },
  "Front Squat": {
    videoSearchUrl: "https://www.youtube.com/results?search_query=front+squat+form+tutorial",
    youtubeVideoId: "m4ytaCJZpl0", // Verify: front squat tutorial
    formCue: "Elbows high, sit between hips, knees track toes.",
    coachingPoints: [
      "Clean grip or cross-arm grip — elbows must stay HIGH throughout",
      "Initiate by pushing hips back slightly, then break at the knees",
      "Keep torso as vertical as possible — if elbows drop, the bar rolls forward",
      "Drive knees outward, sit between your hips, hit full depth",
      "Stand up by driving elbows toward the ceiling"
    ],
    muscles: "Quads, glutes, core",
  },
  "Heel-Elevated Front Squat": {
    videoSearchUrl: "https://www.youtube.com/results?search_query=heel+elevated+front+squat+form",
    youtubeVideoId: "m4ytaCJZpl0", // Same as front squat
    formCue: "Heels on plates, upright torso, deep squat.",
    coachingPoints: [
      "Place heels on 5-10lb plates or a wedge to shift emphasis to quads",
      "Same form as front squat but you'll naturally stay more upright",
      "The heel elevation compensates for limited ankle mobility",
      "Go DEEP — the point of the elevation is to access more range",
      "Great for golfers who struggle to maintain posture at address"
    ],
    muscles: "Quads, glutes, core",
  },
  "Goblet Squats": {
    videoSearchUrl: "https://www.youtube.com/results?search_query=goblet+squat+form+tutorial",
    youtubeVideoId: "MeIiIdhvXT4", // Verify: goblet squat
    formCue: "Hold DB at chest, elbows between knees at bottom.",
    coachingPoints: [
      "Hold a dumbbell vertically at your chest, cupping the top end",
      "Feet slightly wider than shoulder-width, toes turned out 15-30°",
      "Squat DOWN, not BACK — let your elbows track inside your knees",
      "Use your elbows to push your knees out at the bottom for depth",
      "Perfect teaching tool for the squat pattern"
    ],
    muscles: "Quads, glutes",
  },
  "Bulgarian Split Squat": {
    videoSearchUrl: "https://www.youtube.com/results?search_query=bulgarian+split+squat+form",
    youtubeVideoId: "2C-uNgKwPLE", // Verify: BSS tutorial
    formCue: "Rear foot elevated, torso upright, front knee over toe.",
    coachingPoints: [
      "Rear foot on a bench, laces down — don't grip with your toes",
      "Front foot far enough forward that your knee stays over your ankle at the bottom",
      "Drop your back knee STRAIGHT DOWN toward the floor",
      "Keep torso upright — slight forward lean is okay but don't collapse",
      "Critical for lead-leg stability in the golf swing"
    ],
    muscles: "Quads, glutes (single leg)",
    isGolfSpecific: true,
  },
  "Split Squat": {
    videoSearchUrl: "https://www.youtube.com/results?search_query=split+squat+form+tutorial",
    youtubeVideoId: "2C-uNgKwPLE", // Similar to BSS
    formCue: "Stagger feet, lower straight down, 90° both knees.",
    coachingPoints: [
      "Both feet on the floor in a staggered stance",
      "Lower straight down until both knees are at roughly 90°",
      "Keep 80% of your weight on the front leg",
      "Torso stays upright — core braced",
      "Builds the unilateral stability you need for a powerful downswing"
    ],
    muscles: "Quads, glutes (single leg)",
    isGolfSpecific: true,
  },
  "Walking Lunges": {
    videoSearchUrl: "https://www.youtube.com/results?search_query=walking+lunges+form+tutorial",
    youtubeVideoId: "L8fvypPH6EI", // Verify
    formCue: "Long stride, upright torso, push through front heel.",
    coachingPoints: [
      "Take a long enough stride that your back knee nearly touches the ground",
      "Push through the HEEL of the front foot to stand up and step forward",
      "Keep your torso upright — don't lean forward",
      "Alternate legs with each step, maintain rhythm",
      "Builds dynamic stability and coordination"
    ],
    muscles: "Quads, glutes, balance",
    isGolfSpecific: true,
  },
  "Lateral Lunges": {
    videoSearchUrl: "https://www.youtube.com/results?search_query=lateral+lunge+form+tutorial",
    youtubeVideoId: "gwWv7aPcD88", // Verify
    formCue: "Wide step to side, sit back into hip, opposite leg straight.",
    coachingPoints: [
      "Take a wide step directly to the side — wider than you think",
      "Push your hips BACK and DOWN into the stepping leg",
      "The trailing leg stays straight with foot flat on the floor",
      "Keep your chest up and weight in the heel of the working leg",
      "Strengthens the adductors and lateral hip muscles used in weight shift"
    ],
    muscles: "Adductors, glutes, quads",
    isGolfSpecific: true,
  },
  "Box Jumps": {
    videoSearchUrl: "https://www.youtube.com/results?search_query=box+jump+form+tutorial",
    youtubeVideoId: "hxldG9FX4j8", // Verify
    formCue: "Swing arms, explode up, land softly with knees bent.",
    coachingPoints: [
      "Start with a box height you can land on comfortably — build up over time",
      "Swing arms back, hinge hips, then EXPLODE up using the arm swing",
      "Land softly with both feet on the box, knees slightly bent — absorb the landing",
      "Stand fully upright on the box, then STEP down (don't jump down)",
      "Trains the explosive power you need for clubhead speed"
    ],
    muscles: "Quads, glutes, calves (power)",
  },

  // ============================================
  // LOWER BODY — ISOLATION / STABILITY
  // ============================================

  "Leg Extensions": {
    videoSearchUrl: "https://www.youtube.com/results?search_query=leg+extension+form+tutorial",
    youtubeVideoId: "YyvSfVjQeL0", // Verify
    formCue: "Squeeze quads at top, slow controlled lower.",
    coachingPoints: [
      "Adjust the pad so it sits on the front of your ankles, not your shins",
      "Extend legs fully and SQUEEZE the quads for a 1-second hold at the top",
      "Lower slowly — 2-3 seconds on the way down",
      "Don't swing or use momentum — this is an isolation exercise",
    ],
    muscles: "Quads (isolation)",
  },
  "Leg Extensions (Rehab)": {
    videoSearchUrl: "https://www.youtube.com/results?search_query=leg+extension+rehab+knee+form",
    youtubeVideoId: "YyvSfVjQeL0", // Same machine, lighter approach
    formCue: "Light weight, full extension, focus on VMO squeeze.",
    coachingPoints: [
      "Use LIGHT weight — this is about the muscle connection, not load",
      "Focus on the VMO (the teardrop muscle above the inner knee)",
      "Full lockout at the top with a 2-second squeeze",
      "Rebuilds knee stability and quad activation patterns",
    ],
    muscles: "Quads — VMO (knee health)",
  },
  "DB Hip Thrusts": {
    videoSearchUrl: "https://www.youtube.com/results?search_query=dumbbell+hip+thrust+form",
    youtubeVideoId: "SEdqd1n0cvg", // Verify
    formCue: "Shoulder blades on bench, squeeze glutes hard at top.",
    coachingPoints: [
      "Sit on the floor with shoulder blades on the edge of a bench",
      "Place a dumbbell on your hip crease, hold it with both hands",
      "Drive through your heels, pushing hips to the ceiling",
      "At the top: SQUEEZE glutes hard, chin slightly tucked, ribs down",
      "Lower with control — don't just drop"
    ],
    muscles: "Glutes, hamstrings",
  },
  "Copenhagen Plank": {
    videoSearchUrl: "https://www.youtube.com/results?search_query=copenhagen+plank+form+tutorial",
    youtubeVideoId: "V0a1pLiYBB0", // Verify
    formCue: "Top leg on bench, lift hips, brace adductors.",
    coachingPoints: [
      "Lie on your side with your top leg on a bench, bottom leg underneath",
      "Lift your hips so your body forms a straight line",
      "The top leg's inner thigh is doing the work — squeeze it",
      "If too hard, start with just the knee on the bench instead of the foot",
      "Critical for adductor strength and lateral stability in the golf swing"
    ],
    muscles: "Adductors, obliques, core",
    isGolfSpecific: true,
  },
  "90/90 Hip Switches": {
    videoSearchUrl: "https://www.youtube.com/results?search_query=90+90+hip+switch+mobility+drill",
    youtubeVideoId: "bSJB0kBPm8A", // Verify
    formCue: "Both knees at 90°, rotate hips side to side smoothly.",
    coachingPoints: [
      "Sit on the floor, both knees bent at 90° in front of you",
      "Rotate both legs to one side (one knee goes to the floor each way)",
      "Try to keep your torso upright and chest facing forward",
      "Move smoothly — don't force through painful ranges",
      "This is the hip rotation pattern you use in every golf swing"
    ],
    muscles: "Hip internal/external rotation",
    isGolfSpecific: true,
  },

  // ============================================
  // UPPER BODY — PUSH
  // ============================================

  "DB Bench Press": {
    videoSearchUrl: "https://www.youtube.com/results?search_query=dumbbell+bench+press+form+tutorial",
    youtubeVideoId: "VmB1G1K7v94", // Verify
    formCue: "Retract shoulder blades, lower to chest, press up and slightly in.",
    coachingPoints: [
      "Sit on the bench, kick the dumbbells up as you lie back",
      "RETRACT your shoulder blades — squeeze them together and DOWN",
      "Lower the dumbbells to the sides of your chest, elbows at ~45°",
      "Press up and slightly inward — the DBs almost touch at the top",
      "Maintain the shoulder blade retraction throughout every rep"
    ],
    muscles: "Chest, front delts, triceps",
  },
  "Bench Press": {
    videoSearchUrl: "https://www.youtube.com/results?search_query=barbell+bench+press+form+tutorial",
    youtubeVideoId: "rT7DgCr-3pg", // Verify
    formCue: "Arch back, retract scapula, bar to mid-chest.",
    coachingPoints: [
      "Set up with eyes under the bar, feet flat on the floor",
      "Retract and depress your shoulder blades — create a stable shelf",
      "Slight natural arch in the lower back — butt stays on the bench",
      "Unrack, lower the bar to your mid-chest/nipple line with control",
      "Press in a slight arc — bar finishes over your shoulders, not your face"
    ],
    muscles: "Chest, front delts, triceps",
  },
  "Incline DB Press": {
    videoSearchUrl: "https://www.youtube.com/results?search_query=incline+dumbbell+press+form+tutorial",
    youtubeVideoId: "8iPEnn-ltC8", // Verify
    formCue: "30° incline, press up and together, squeeze at top.",
    coachingPoints: [
      "Set bench to 30° incline (one or two notches up — not too steep)",
      "Same shoulder blade retraction as flat bench",
      "Press dumbbells up AND slightly together — they nearly touch at the top",
      "Lower with control, elbows at ~45° angle to your torso",
      "Targets the upper chest and front delts more than flat bench"
    ],
    muscles: "Upper chest, front delts, triceps",
  },
  "DB Press": {
    videoSearchUrl: "https://www.youtube.com/results?search_query=dumbbell+press+form+tutorial",
    youtubeVideoId: "VmB1G1K7v94", // Same as DB bench
    formCue: "Retract shoulder blades, controlled lower, explosive press.",
    coachingPoints: [
      "Same setup as DB bench press",
      "Focus on explosive pressing with a controlled 2-second lowering phase",
      "Full range of motion — dumbbells touch the sides of your chest",
      "Shoulder blades stay pinned back the entire time"
    ],
    muscles: "Chest, front delts, triceps",
  },
  "Overhead DB Press": {
    videoSearchUrl: "https://www.youtube.com/results?search_query=overhead+dumbbell+press+form",
    youtubeVideoId: "qEwKCR5JCog", // Verify
    formCue: "Brace core, press straight overhead, don't arch back.",
    coachingPoints: [
      "Seated or standing — standing requires more core stability",
      "Start with dumbbells at shoulder height, palms facing forward",
      "Brace your core HARD — squeeze your abs like you're about to get punched",
      "Press straight up until arms are fully extended overhead",
      "If your back arches excessively, reduce the weight"
    ],
    muscles: "Shoulders, triceps, core",
  },
  "Landmine Press": {
    videoSearchUrl: "https://www.youtube.com/results?search_query=landmine+press+form+tutorial",
    youtubeVideoId: "CyMSXbKkJjk", // Verify
    formCue: "Half-kneeling or standing, press at an arc, brace core.",
    coachingPoints: [
      "Wedge one end of a barbell into a corner or landmine attachment",
      "Half-kneeling position: one knee down, same-side hand holds the bar end",
      "Press the bar up and forward along an arc (not straight up)",
      "Core stays braced, no rotation — this IS anti-rotation training",
      "Excellent for golf-specific shoulder and core integration"
    ],
    muscles: "Shoulders, chest, core (anti-rotation)",
    isGolfSpecific: true,
  },
  "Lateral Raises": {
    videoSearchUrl: "https://www.youtube.com/results?search_query=lateral+raise+form+tutorial",
    youtubeVideoId: "3VcKaXpzqRo", // Verify
    formCue: "Slight lean forward, lead with elbows, stop at shoulder height.",
    coachingPoints: [
      "Slight forward lean — about 10-15° at the hips",
      "Lead the movement with your ELBOWS, not your hands",
      "Raise to shoulder height — no higher (traps take over above that)",
      "Controlled lowering — don't just swing the weights",
    ],
    muscles: "Side delts",
  },
  "Tricep Pushdowns": {
    videoSearchUrl: "https://www.youtube.com/results?search_query=tricep+pushdown+form+tutorial",
    youtubeVideoId: "2-LAMcpzODU", // Verify
    formCue: "Elbows pinned to sides, squeeze at bottom, slow return.",
    coachingPoints: [
      "Pin your elbows to your sides — they should NOT move throughout the set",
      "Push the cable down until arms are fully extended",
      "SQUEEZE the triceps hard at the bottom for 1 second",
      "Control the return — don't let the cable yank your arms up"
    ],
    muscles: "Triceps",
  },

  // ============================================
  // UPPER BODY — PULL
  // ============================================

  "1-Arm Row": {
    videoSearchUrl: "https://www.youtube.com/results?search_query=single+arm+dumbbell+row+form",
    youtubeVideoId: "pYcpY20QaE8", // Verify
    formCue: "Flat back, pull to hip, squeeze shoulder blade back.",
    coachingPoints: [
      "One hand and knee on a bench, other foot on the floor",
      "Flat back — your spine should be a straight line from head to hips",
      "Pull the dumbbell to your HIP, not your armpit",
      "Think about pulling your elbow toward the ceiling",
      "Squeeze the shoulder blade back at the top, 1-second hold"
    ],
    muscles: "Lats, rhomboids, biceps",
  },
  "1-Arm Rows": {
    videoSearchUrl: "https://www.youtube.com/results?search_query=single+arm+dumbbell+row+form",
    youtubeVideoId: "pYcpY20QaE8",
    formCue: "Flat back, pull to hip, squeeze shoulder blade back.",
    coachingPoints: [
      "One hand and knee on a bench, other foot on the floor",
      "Pull the dumbbell to your HIP — squeeze the shoulder blade"
    ],
    muscles: "Lats, rhomboids, biceps",
  },
  "Single-Arm DB Row": {
    videoSearchUrl: "https://www.youtube.com/results?search_query=single+arm+dumbbell+row+form",
    youtubeVideoId: "pYcpY20QaE8",
    formCue: "Flat back, pull to hip, squeeze shoulder blade back.",
    coachingPoints: [
      "Same movement as 1-arm row — different name, same execution"
    ],
    muscles: "Lats, rhomboids, biceps",
  },
  "Seated Cable Row": {
    videoSearchUrl: "https://www.youtube.com/results?search_query=seated+cable+row+form+tutorial",
    youtubeVideoId: "GZbfZ033f74", // Verify
    formCue: "Chest up, pull to belly button, squeeze shoulder blades.",
    coachingPoints: [
      "Sit with a slight natural arch in your lower back — chest UP",
      "Pull the handle to your belly button, not your chest",
      "Squeeze your shoulder blades together at the end of each rep",
      "Control the return — let the cable stretch your lats before pulling again",
      "Don't swing your torso back and forth — stay upright"
    ],
    muscles: "Mid-back, lats, biceps",
  },
  "Seated Row": {
    videoSearchUrl: "https://www.youtube.com/results?search_query=seated+row+form+tutorial",
    youtubeVideoId: "GZbfZ033f74",
    formCue: "Chest up, pull to belly button, squeeze shoulder blades.",
    coachingPoints: [
      "Same as seated cable row — maintain upright posture throughout"
    ],
    muscles: "Mid-back, lats, biceps",
  },
  "Pullups": {
    videoSearchUrl: "https://www.youtube.com/results?search_query=pull+up+form+tutorial+beginner",
    youtubeVideoId: "eGo4IYlbE5g", // Verify
    formCue: "Dead hang start, pull chest to bar, control the lower.",
    coachingPoints: [
      "Start from a DEAD HANG — arms fully extended, shoulders engaged",
      "Initiate by pulling your shoulder blades DOWN and BACK",
      "Pull until your chin clears the bar (or chest touches for advanced)",
      "Lower with control — 2-3 seconds on the way down",
      "If you can't do a full pull-up yet, use an assisted pull-up machine or band"
    ],
    muscles: "Lats, biceps, core",
  },
  "Weighted Pullups": {
    videoSearchUrl: "https://www.youtube.com/results?search_query=weighted+pull+ups+form+tutorial",
    youtubeVideoId: "eGo4IYlbE5g",
    formCue: "Belt or DB between feet, dead hang, pull chest to bar.",
    coachingPoints: [
      "Use a dip belt with plates, or hold a DB between your feet/knees",
      "Same form as bodyweight pull-ups — dead hang start, full range",
      "The added weight forces recruitment of more motor units",
      "Start light (5-10 lbs) and progress gradually"
    ],
    muscles: "Lats, biceps, core (loaded)",
  },
  "Face Pulls": {
    videoSearchUrl: "https://www.youtube.com/results?search_query=face+pulls+form+tutorial",
    youtubeVideoId: "rep-qVOkqgk", // Verify
    formCue: "Pull rope to forehead, externally rotate at end, squeeze rear delts.",
    coachingPoints: [
      "Set the cable at face height, use a rope attachment",
      "Pull the rope toward your FOREHEAD, not your chest",
      "At the end of the pull, rotate your hands outward (external rotation)",
      "You should feel this in your rear delts and between your shoulder blades",
      "This is a shoulder-health essential — do it every session if you can"
    ],
    muscles: "Rear delts, rotator cuff",
  },
  "Hammer Curls": {
    videoSearchUrl: "https://www.youtube.com/results?search_query=hammer+curl+form+tutorial",
    youtubeVideoId: "zC3nLlEvin4", // Verify
    formCue: "Neutral grip, elbows still, squeeze at top.",
    coachingPoints: [
      "Hold dumbbells with a neutral grip (palms facing each other)",
      "Elbows PINNED to your sides — they should not drift forward",
      "Curl up to full contraction, squeeze for 1 second",
      "Lower with control — no swinging"
    ],
    muscles: "Biceps, brachialis, forearms",
  },

  // ============================================
  // CORE / ANTI-ROTATION
  // ============================================

  "Pallof Press": {
    videoSearchUrl: "https://www.youtube.com/results?search_query=pallof+press+form+tutorial",
    youtubeVideoId: "AH_QZLm_0-s", // Verify
    formCue: "Resist rotation, press cable straight out, brace core.",
    coachingPoints: [
      "Stand perpendicular to a cable machine, handle at chest height",
      "Hold the handle at your chest with both hands",
      "Press your arms STRAIGHT out — the cable will try to rotate you",
      "Your job is to RESIST the rotation — core braced, no turning",
      "This is the exact anti-rotation stability you need in the golf swing"
    ],
    muscles: "Core anti-rotation, obliques",
    isGolfSpecific: true,
  },
  "Rotational Band Woodchop": {
    videoSearchUrl: "https://www.youtube.com/results?search_query=rotational+woodchop+cable+band+form",
    youtubeVideoId: "pAplQXk3dkU", // Verify
    formCue: "Rotate through hips (not arms), brace and control.",
    coachingPoints: [
      "Set the cable at chest height, stand perpendicular",
      "Rotate FROM YOUR HIPS — arms are just along for the ride",
      "This mimics the golf swing rotation pattern",
      "Control the return — don't let the cable snap you back",
      "The power comes from the ground up, through the hips, into the hands"
    ],
    muscles: "Obliques, hip rotators, core",
    isGolfSpecific: true,
  },
  "Dead Bug": {
    videoSearchUrl: "https://www.youtube.com/results?search_query=dead+bug+exercise+form+tutorial",
    youtubeVideoId: "I5xbsA71v1A", // Verify
    formCue: "Low back pressed to floor, opposite arm/leg extend slowly.",
    coachingPoints: [
      "Lie on your back, arms pointing at the ceiling, knees at 90°",
      "Press your lower back INTO the floor — it should NOT arch up",
      "Slowly extend one arm overhead while extending the opposite leg out",
      "Return to start, then switch sides",
      "If your lower back arches off the floor, reduce the range of motion"
    ],
    muscles: "Deep core, anti-extension",
  },

  // ============================================
  // GOLF-SPECIFIC: SPEED TRAINING
  // ============================================

  "Max Intent Swings (Driver)": {
    videoSearchUrl: "https://www.youtube.com/results?search_query=superspeed+golf+max+intent+swing+training",
    youtubeVideoId: "tKbsBqd4s7I", // Verify: SuperSpeed protocol
    formCue: "100% effort, swing as fast as possible, full rotation.",
    coachingPoints: [
      "This is about MAXIMUM EFFORT — not accuracy or ball flight",
      "Full, aggressive rotation — let your body unwind completely",
      "Swing as fast as you physically can on every rep",
      "Rest fully between sets (2 minutes) — this is neural training",
      "If using a radar, log your top speed for tracking"
    ],
    muscles: "Full body power chain — legs, core, arms",
    isGolfSpecific: true,
  },
  "Light Stick Swings": {
    videoSearchUrl: "https://www.youtube.com/results?search_query=superspeed+golf+overspeed+training+light+club",
    youtubeVideoId: "tKbsBqd4s7I", // SuperSpeed protocol covers all sticks
    formCue: "Lighter than driver, swing FASTER than normal, train the nervous system.",
    coachingPoints: [
      "The light stick (or lighter training club) lets you exceed your normal speed",
      "This is overspeed training — your nervous system learns a faster pattern",
      "Swing at 100% effort — the lighter weight lets you go faster than your driver",
      "Do both dominant and non-dominant side swings if your protocol calls for it",
      "Track your speed if possible — overspeed should exceed your normal driver speed"
    ],
    muscles: "Neuromuscular speed — overspeed protocol",
    isGolfSpecific: true,
  },
  "Heavy Stick Swings": {
    videoSearchUrl: "https://www.youtube.com/results?search_query=superspeed+golf+overload+heavy+club+training",
    youtubeVideoId: "tKbsBqd4s7I",
    formCue: "Heavier than driver, maintain swing mechanics, build power resistance.",
    coachingPoints: [
      "The heavy stick builds strength in the swing pattern",
      "Your speed will be LOWER than your driver — that's the point",
      "Focus on maintaining proper swing mechanics under the heavier load",
      "The contrast between heavy and light sticks creates a speed-building effect",
      "Don't sacrifice form for speed — mechanics first, then effort"
    ],
    muscles: "Neuromuscular strength — overload protocol",
    isGolfSpecific: true,
  },

  // ============================================
  // GOLF-SPECIFIC: TECHNIQUE
  // ============================================

  "Slow-Mo Transition Drills": {
    videoSearchUrl: "https://www.youtube.com/results?search_query=golf+slow+motion+transition+drill+downswing",
    youtubeVideoId: "4nMbM2DKGP4", // Verify: golf transition drill
    formCue: "Super slow backswing, pause at top, initiate with lower body.",
    coachingPoints: [
      "Take a club or alignment stick, set up in your normal golf posture",
      "Take 5 seconds to complete the backswing — exaggeratedly slow",
      "PAUSE at the top for 2 seconds — feel the stretch",
      "Start the downswing with your LOWER BODY — hips lead, then torso, then arms",
      "This ingrains the correct sequencing pattern: ground → hips → torso → arms → club"
    ],
    muscles: "Sequencing — hips lead, torso follows, arms last",
    isGolfSpecific: true,
  },
  "Lead Arm Only Swings": {
    videoSearchUrl: "https://www.youtube.com/results?search_query=golf+lead+arm+only+swing+drill",
    youtubeVideoId: "JOLUxV2WDXE", // Verify: lead arm drill
    formCue: "Left arm only (for righties), feel the release point, stay connected.",
    coachingPoints: [
      "Hold the club with your lead arm only (left arm for right-handed golfers)",
      "Make controlled half-to-three-quarter swings",
      "Focus on feeling the club 'release' through impact",
      "Your lead arm should feel connected to your body — not disconnected and floppy",
      "This drill builds the lead-side connection that creates consistent contact"
    ],
    muscles: "Lead side connection — lat, oblique, forearm",
    isGolfSpecific: true,
  },

  // ============================================
  // POWER / ROTATIONAL
  // ============================================

  "Med-ball Throws": {
    videoSearchUrl: "https://www.youtube.com/results?search_query=medicine+ball+rotational+throw+golf+power",
    youtubeVideoId: "JQ1LlpYkYp0", // Verify: rotational med ball throw
    formCue: "Rotate from hips, release explosively, mimic golf rotation.",
    coachingPoints: [
      "Stand perpendicular to a wall, 3-5 feet away, with a 6-12 lb medicine ball",
      "Load into your trail hip (like a backswing), then EXPLOSIVELY rotate and throw",
      "The power comes from the HIPS and TRUNK — not your arms",
      "The ball should hit the wall hard — this is a max-effort exercise",
      "This IS your golf swing pattern under load — it directly transfers"
    ],
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
