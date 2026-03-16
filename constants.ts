
import { PlanData, WorkoutPlanFrequency, Exercise } from './types';

export const COACH_AUDIT = {
    status: "Elite Performance Optimized",
    assessment: "Biomechanical integrity verified. Using Force-Velocity Profiling for Golf and Antagonistic Hypertrophy protocols for Powerbuilding. CNS load management is integrated via rest-interval scaling.",
    recommendations: [
        "Golf Speed: Execute 'Max Intent' swings at 100% neural effort. Quality over quantity.",
        "Supersets: Pairing Push/Pull movements (e.g., Bench/Row) maximizes recovery via reciprocal inhibition.",
        "Tempo: Focus on explosive concentrics (X) and controlled eccentrics (3).",
        "RPE: Target RPE 8-9 for hypertrophy; RPE 7-8 for technical speed sessions."
    ]
};

const SPEED_BLOCK_SCIENTIFIC: Exercise[] = [
    { id: "g_sp1", group: "Neural Drive", order: "1", name: "Max Intent Swings (Driver)", defaultCategory: "Speed", sets: 4, reps: "5", rest: 120, type: 'speed', rpe: 10 },
    { id: "g_sp2", group: "Neural Drive", order: "2", name: "Light Stick Swings", defaultCategory: "Overspeed", sets: 3, reps: "8", rest: 90, type: 'speed', rpe: 9 },
    { id: "g_sp3", group: "Neural Drive", order: "3", name: "Heavy Stick Swings", defaultCategory: "Overload", sets: 3, reps: "8", rest: 90, type: 'speed', rpe: 9 }
];

const TECH_BLOCK_ELITE: Exercise[] = [
    { id: "g_te1", group: "Patterning", order: "1", name: "Slow-Mo Transition Drills", defaultCategory: "Sequence", sets: 2, reps: "10", rest: 30, type: 'technique' },
    { id: "g_te2", group: "Sequence", order: "2", name: "Lead Arm Only Swings", defaultCategory: "Isolation", sets: 2, reps: "10", rest: 30, type: 'technique' }
];

export const GOLF_PLANS: Record<WorkoutPlanFrequency, PlanData> = {
    '2x': {
        id: '2x',
        name: 'In-Season Force',
        description: 'Optimized for maintenance. Prioritizes clubhead speed preservation and baseline force.',
        schedule: {
            tuesday: {
                title: "Force & Tech A", subtitle: "Ground Force Focus • 35m", color: "border-blue-500", type: 'strength',
                exercises: [
                    { id: "g2a1", group: "Main", order: "1", name: "Trap Bar Deadlift", defaultCategory: "Lower", sets: 3, reps: "3-5", rest: 150, tempo: "2-0-X-1" },
                    { id: "g2a2", group: "Upper", order: "2", name: "DB Bench Press", defaultCategory: "Push", sets: 3, reps: "8-10", rest: 60 },
                    ...TECH_BLOCK_ELITE
                ]
            },
            thursday: {
                title: "Force & Tech B", subtitle: "Rotational Power • 35m", color: "border-purple-500", type: 'strength',
                exercises: [
                    { id: "g2b1", group: "Main", order: "1", name: "Goblet Squats", defaultCategory: "Squat", sets: 3, reps: "8-12", rest: 90 },
                    { id: "g2b2", group: "Upper", order: "2", name: "1-Arm Row", defaultCategory: "Pull", sets: 3, reps: "10/side", rest: 60 },
                    ...TECH_BLOCK_ELITE
                ]
            }
        }
    },
    '3x': {
        id: '3x',
        name: 'The Speed Engine',
        description: 'Targeted performance expansion. 3 Force, 3 Speed sessions per week.',
        schedule: {
            monday: { title: "Lower Force Focus", subtitle: "Ground Load • 35m", color: "border-green-500", type: 'strength', exercises: [{ id: "g3a1", group: "Force", order: "1", name: "Trap Bar Deadlift", defaultCategory: "Lower", sets: 3, reps: "3-5", rest: 120 }, { id: "g3a2", group: "Stability", order: "2", name: "Walking Lunges", defaultCategory: "Lead Leg", sets: 3, reps: "8/leg", rest: 60 }, ...TECH_BLOCK_ELITE] },
            tuesday: { title: "Speed Session", subtitle: "Neural Priming • 25m", color: "border-amber-500", type: 'speed', exercises: SPEED_BLOCK_SCIENTIFIC },
            wednesday: { title: "Upper Force Focus", subtitle: "Rotational Push/Pull • 35m", color: "border-blue-500", type: 'strength', exercises: [{ id: "g3b1", group: "Push", order: "1", name: "DB Bench Press", defaultCategory: "Upper", sets: 3, reps: "5-8", rest: 90 }, { id: "g3b2", group: "Pull", order: "2", name: "1-Arm Rows", defaultCategory: "Upper", sets: 3, reps: "8-10", rest: 90 }, { id: "g3b3", group: "Core", order: "3", name: "Pallof Press", defaultCategory: "Anti-Rotation", sets: 3, reps: "12/side", rest: 60 }] },
            friday: { title: "Rotational Power", subtitle: "Explosive Transfer • 35m", color: "border-purple-500", type: 'strength', exercises: [{ id: "g3c1", group: "Power", order: "1", name: "Med-ball Throws", defaultCategory: "Power", sets: 4, reps: "6/side", rest: 60 }, { id: "g3c2", group: "Main", order: "2", name: "Front Squat", defaultCategory: "Lower", sets: 3, reps: "5", rest: 90 }] }
        }
    },
    '4x': {
        id: '4x',
        name: 'Force-Velocity Split',
        description: 'Elite split for high-level athletes. Balances structural hypertrophy and speed.',
        schedule: {
            monday: { title: "Upper: Hypertrophy", subtitle: "X-Factor Stretch • 35m", color: "border-blue-500", type: 'strength', exercises: [{ id: "g4a1", group: "Push", order: "1", name: "Incline DB Press", defaultCategory: "Chest", sets: 3, reps: "10-12", rest: 60 }, { id: "g4a2", group: "Pull", order: "2", name: "Seated Row", defaultCategory: "Back", sets: 3, reps: "10-12", rest: 60 }, ...TECH_BLOCK_ELITE] },
            tuesday: { title: "Lower: Force + Speed", subtitle: "Neural Load • 35m", color: "border-green-500", type: 'strength', exercises: [SPEED_BLOCK_SCIENTIFIC[0], { id: "g4b1", group: "Force", order: "1", name: "Trap Bar Deadlift", defaultCategory: "Lower", sets: 3, reps: "5-8", rest: 90 }] },
            thursday: { title: "Upper: Power + Speed", subtitle: "Vertical Drive • 35m", color: "border-purple-500", type: 'strength', exercises: [SPEED_BLOCK_SCIENTIFIC[1], { id: "g4c1", group: "Main", order: "1", name: "Weighted Pullups", defaultCategory: "Upper", sets: 3, reps: "6-8", rest: 90 }] },
            friday: { title: "Lower: Stability", subtitle: "Lead Leg Focus • 35m", color: "border-orange-500", type: 'strength', exercises: [{ id: "g4d1", group: "Lead Leg", order: "1", name: "Bulgarian Split Squat", defaultCategory: "Stability", sets: 3, reps: "10/leg", rest: 60 }, { id: "g4d2", group: "Core", order: "2", name: "Copenhagen Plank", defaultCategory: "Core", sets: 2, reps: "30s", rest: 45 }] }
        }
    },
    '5x': {
        id: '5x',
        name: 'Pro Performance Protocol',
        description: 'Maximum frequency for dedicated speed development.',
        schedule: {
            monday: { title: "Lower: Force", subtitle: "Max Ground Load • 35m", color: "border-green-500", exercises: [{ id: "g5a1", group: "Force", order: "1", name: "Trap Bar Deadlift", defaultCategory: "Lower", sets: 3, reps: "3-5", rest: 120 }] },
            tuesday: { title: "Upper Push + Speed", subtitle: "Vertical Power • 35m", color: "border-blue-500", exercises: [SPEED_BLOCK_SCIENTIFIC[0], { id: "g5b1", group: "Push", order: "1", name: "DB Press", defaultCategory: "Upper", sets: 3, reps: "8-10", rest: 90 }] },
            wednesday: { title: "Lead Leg Integrity", subtitle: "Sequence Logic • 35m", color: "border-orange-500", exercises: [...TECH_BLOCK_ELITE, { id: "g5c1", group: "Stability", order: "1", name: "Split Squat", defaultCategory: "Lead Leg", sets: 3, reps: "10/leg", rest: 60 }] },
            thursday: { title: "Upper Pull + Speed", subtitle: "Horizontal Power • 35m", color: "border-purple-500", exercises: [SPEED_BLOCK_SCIENTIFIC[1], { id: "g5d1", group: "Pull", order: "1", name: "1-Arm Row", defaultCategory: "Upper", sets: 3, reps: "10/side", rest: 60 }] },
            friday: { title: "Dynamic Output", subtitle: "Explosive Transfer • 35m", color: "border-indigo-500", exercises: [{ id: "g5e1", group: "Power", order: "1", name: "Box Jumps", defaultCategory: "Vertical", sets: 3, reps: "5", rest: 90 }, { id: "g5e2", group: "Power", order: "2", name: "Med-ball Throws", defaultCategory: "Rotational", sets: 3, reps: "6/side", rest: 60 }] }
        }
    }
};

export const POWERBUILDING_PLANS: Record<WorkoutPlanFrequency, PlanData> = {
    '2x': {
        id: '2x',
        name: 'Full Body Power',
        description: 'Scientific consolidation of the 4-day split.',
        schedule: {
            tuesday: {
                title: "Power & Force A", subtitle: "Upper/Lower Compounds • 35m", color: "border-blue-600",
                exercises: [
                    { id: "pb2a1", group: "Superset 1", order: "1", name: "Bench Press", defaultCategory: "Chest", sets: 3, reps: "6-8", rest: 90 },
                    { id: "pb2a2", group: "Superset 1", order: "2", name: "Pullups", defaultCategory: "Back", sets: 3, reps: "8-10", rest: 90 },
                    { id: "pb2a3", group: "Main", order: "3", name: "Trap Bar Deadlift", defaultCategory: "Force", sets: 3, reps: "3-5", rest: 120 },
                ]
            },
            thursday: {
                title: "Power & Force B", subtitle: "Squat Focus • 35m", color: "border-purple-600",
                exercises: [
                    { id: "pb2b1", group: "Main", order: "1", name: "Heel-Elevated Front Squat", defaultCategory: "Squat", sets: 3, reps: "6-8", rest: 120 },
                    { id: "pb2b2", group: "Superset 1", order: "2", name: "Incline DB Press", defaultCategory: "Chest", sets: 3, reps: "8-10", rest: 90 },
                    { id: "pb2b3", group: "Superset 1", order: "3", name: "Seated Cable Row", defaultCategory: "Back", sets: 3, reps: "10-12", rest: 60 },
                ]
            }
        }
    },
    '3x': {
        id: '3x',
        name: 'The Strength Cycle',
        description: 'M/W/F rotation for consistent strength and hypertrophy gains.',
        schedule: {
            monday: {
                title: "Upper Strength", subtitle: "Horizontal Power • 35m", color: "border-blue-500",
                exercises: [
                    { id: "pb3a1", group: "Superset 1", order: "1", name: "Bench Press", defaultCategory: "Chest", sets: 3, reps: "6-8", rest: 90 },
                    { id: "pb3a2", group: "Superset 1", order: "2", name: "Pullups", defaultCategory: "Back", sets: 3, reps: "8-10", rest: 90 },
                    { id: "pb3a3", group: "Superset 2", order: "3", name: "Overhead DB Press", defaultCategory: "Shoulders", sets: 3, reps: "8-10", rest: 90 },
                    { id: "pb3a4", group: "Superset 2", order: "4", name: "Single-Arm DB Row", defaultCategory: "Back", sets: 3, reps: "10/side", rest: 60 },
                ]
            },
            wednesday: {
                title: "Lower Force Focus", subtitle: "Hinge & Stability • 35m", color: "border-green-500",
                exercises: [
                    { id: "pb3b1", group: "Main", order: "1", name: "Trap Bar Deadlift", defaultCategory: "Force", sets: 3, reps: "3-5", rest: 120 },
                    { id: "pb3b2", group: "Superset 1", order: "2", name: "Lateral Lunges", defaultCategory: "Lower", sets: 3, reps: "10/leg", rest: 60 },
                    { id: "pb3b3", group: "Superset 1", order: "3", name: "Pallof Press", defaultCategory: "Core", sets: 3, reps: "12/side", rest: 60 },
                ]
            },
            friday: {
                title: "Squat & Pump", subtitle: "Leg Drive • 35m", color: "border-purple-500",
                exercises: [
                    { id: "pb3c1", group: "Main", order: "1", name: "Heel-Elevated Front Squat", defaultCategory: "Squat", sets: 3, reps: "6-8", rest: 120 },
                    { id: "pb3c2", group: "Superset 1", order: "2", name: "Incline DB Press", defaultCategory: "Chest", sets: 3, reps: "8-10", rest: 90 },
                    { id: "pb3c3", group: "Superset 1", order: "3", name: "Seated Cable Row", defaultCategory: "Back", sets: 3, reps: "10-12", rest: 60 },
                ]
            }
        }
    },
    '4x': {
        id: '4x',
        name: 'Historical Split',
        description: 'Restoration of your exact requested 4-day antagonistic routine.',
        schedule: {
            monday: {
                title: "Upper Strength", subtitle: "Horizontal Focus • 35m", color: "border-blue-500",
                exercises: [
                    { id: "pb4a1", group: "Superset 1", order: "1", name: "Bench Press", defaultCategory: "Chest", sets: 3, reps: "6-8", rest: 90, tempo: "3-1-X-1" },
                    { id: "pb4a2", group: "Superset 1", order: "2", name: "Pullups", defaultCategory: "Back", sets: 3, reps: "8-10", rest: 90, tempo: "2-1-X-2" },
                    { id: "pb4a3", group: "Superset 2", order: "3", name: "Overhead DB Press", defaultCategory: "Shoulders", sets: 3, reps: "8-10", rest: 90 },
                    { id: "pb4a4", group: "Superset 2", order: "4", name: "Single-Arm DB Row", defaultCategory: "Back", sets: 3, reps: "10/side", rest: 60 },
                    { id: "pb4a5", group: "Superset 3", order: "5", name: "Landmine Press", defaultCategory: "Shoulders", sets: 3, reps: "10/side", rest: 60 },
                    { id: "pb4a6", group: "Superset 3", order: "6", name: "Dead Bug", defaultCategory: "Core", sets: 3, reps: "12/side", rest: 45 },
                ]
            },
            tuesday: {
                title: "Lower Body: Force", subtitle: "Hinge Focus • 35m", color: "border-green-500",
                exercises: [
                    { id: "pb4b1", group: "Main", order: "1", name: "Trap Bar Deadlift", defaultCategory: "Force", sets: 3, reps: "3-5", rest: 120, tempo: "2-1-X-1" },
                    { id: "pb4b2", group: "Superset 1", order: "2", name: "Lateral Lunges", defaultCategory: "Lower", sets: 3, reps: "10/leg", rest: 60 },
                    { id: "pb4b3", group: "Superset 1", order: "3", name: "Pallof Press", defaultCategory: "Core", sets: 3, reps: "12/side", rest: 60 },
                    { id: "pb4b4", group: "Superset 2", order: "4", name: "Leg Extensions", defaultCategory: "Quads", sets: 3, reps: "12-15", rest: 60 },
                    { id: "pb4b5", group: "Superset 2", order: "5", name: "Rotational Band Woodchop", defaultCategory: "Core", sets: 3, reps: "12/side", rest: 45 },
                ]
            },
            thursday: {
                title: "Upper Hypertrophy", subtitle: "Incline & Pump • 35m", color: "border-purple-500",
                exercises: [
                    { id: "pb4c1", group: "Superset 1", order: "1", name: "Incline DB Press", defaultCategory: "Chest", sets: 3, reps: "8-10", rest: 90, tempo: "3-2-1-1" },
                    { id: "pb4c2", group: "Superset 1", order: "2", name: "Seated Cable Row", defaultCategory: "Back", sets: 3, reps: "10-12", rest: 60, tempo: "2-1-2-1" },
                    { id: "pb4c3", group: "Superset 2", order: "3", name: "Lateral Raises", defaultCategory: "Delts", sets: 3, reps: "12-15", rest: 45 },
                    { id: "pb4c4", group: "Superset 2", order: "4", name: "Face Pulls", defaultCategory: "Back", sets: 3, reps: "15", rest: 45 },
                    { id: "pb4c5", group: "Superset 3", order: "5", name: "Tricep Pushdowns", defaultCategory: "Arms", sets: 3, reps: "12-15", rest: 45 },
                    { id: "pb4c6", group: "Superset 3", order: "6", name: "Hammer Curls", defaultCategory: "Arms", sets: 3, reps: "12-15", rest: 45 },
                ]
            },
            friday: {
                title: "Lower Body: Engine", subtitle: "Squat Focus • 35m", color: "border-orange-500",
                exercises: [
                    { id: "pb4d1", group: "Main", order: "1", name: "Heel-Elevated Front Squat", defaultCategory: "Squat", sets: 3, reps: "6-8", rest: 120, tempo: "3-2-1-1" },
                    { id: "pb4d2", group: "Superset 1", order: "2", name: "Leg Extensions (Rehab)", defaultCategory: "Quads", sets: 3, reps: "15", rest: 60 },
                    { id: "pb4d3", group: "Superset 1", order: "3", name: "DB Hip Thrusts", defaultCategory: "Glutes", sets: 3, reps: "12", rest: 60 },
                    { id: "pb4d4", group: "Superset 2", order: "4", name: "Copenhagen Plank", defaultCategory: "Core", sets: 3, reps: "30s/side", rest: 60 },
                    { id: "pb4d5", group: "Superset 2", order: "5", name: "90/90 Hip Switches", defaultCategory: "Mobility", sets: 3, reps: "10/side", rest: 45 },
                ]
            }
        }
    },
    '5x': {
        id: '5x',
        name: 'Hypertrophy Max',
        description: 'Elite 5-day cycle with dedicated refinement day.',
        schedule: {
            monday: { title: "Upper Strength", subtitle: "Horizontal Focus • 35m", color: "border-blue-500", exercises: [{ id: "pb5a1", group: "SS1", order: "1", name: "Bench Press", defaultCategory: "Chest", sets: 3, reps: "6-8", rest: 90 }, { id: "pb5a2", group: "SS1", order: "2", name: "Pullups", defaultCategory: "Back", sets: 3, reps: "8-10", rest: 90 }] },
            tuesday: { title: "Lower Force", subtitle: "Hinge Focus • 35m", color: "border-green-500", exercises: [{ id: "pb5b1", group: "Main", order: "1", name: "Trap Bar Deadlift", defaultCategory: "Force", sets: 3, reps: "3-5", rest: 120 }] },
            wednesday: { title: "Weakness Refinement", subtitle: "Mobility • 30m", color: "border-amber-500", exercises: [{ id: "pb5c1", group: "Mobility", order: "1", name: "90/90 Hip Switches", defaultCategory: "Hips", sets: 3, reps: "10/side", rest: 30 }, { id: "pb5c2", group: "Core", order: "2", name: "Dead Bug", defaultCategory: "Abs", sets: 3, reps: "15", rest: 45 }] },
            thursday: { title: "Upper Hypertrophy", subtitle: "Incline Focus • 35m", color: "border-purple-500", exercises: [{ id: "pb5d1", group: "SS1", order: "1", name: "Incline DB Press", defaultCategory: "Upper", sets: 3, reps: "8-10", rest: 90 }, { id: "pb5d2", group: "SS1", order: "2", name: "Seated Row", defaultCategory: "Back", sets: 3, reps: "10-12", rest: 60 }] },
            friday: { title: "Lower Engine", subtitle: "Squat Focus • 35m", color: "border-orange-500", exercises: [{ id: "pb5e1", group: "Main", order: "1", name: "Heel-Elevated Front Squat", defaultCategory: "Squat", sets: 3, reps: "6-8", rest: 120 }] }
        }
    }
};

export const PLANS = {
    golf: GOLF_PLANS,
    powerbuilding: POWERBUILDING_PLANS
};
