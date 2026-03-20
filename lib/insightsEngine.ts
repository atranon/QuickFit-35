import { WorkoutLog } from '../types';

/*
  HOW THE INSIGHTS ENGINE WORKS:

  1. Load all workout history from localStorage
  2. Run every analysis function — each one returns an Insight or null
  3. Pick the highest-priority non-null Insight
  4. Return it with an icon hint, color, and display text

  Each analysis function is independent and self-contained.
  To add a new insight type, just write a new function
  and add it to the INSIGHT_GENERATORS array with a priority number.

  Lower priority number = shown first (higher importance).
*/

export interface Insight {
  text: string;        // The main message shown to the user
  subtext?: string;    // Optional secondary detail line
  priority: number;    // Lower = more important (shown first)
  type: string;        // Category key for icon/color selection
}

// Color and icon mapping for the UI
export const INSIGHT_STYLES: Record<string, { color: string; borderColor: string; icon: string }> = {
  comeback:     { color: 'text-orange-400', borderColor: 'border-orange-500/40', icon: 'flame' },
  speed:        { color: 'text-amber-400',  borderColor: 'border-amber-500/40',  icon: 'gauge' },
  pr:           { color: 'text-emerald-400', borderColor: 'border-emerald-500/40', icon: 'trophy' },
  volume:       { color: 'text-blue-400',   borderColor: 'border-blue-500/40',   icon: 'trending' },
  progression:  { color: 'text-purple-400', borderColor: 'border-purple-500/40', icon: 'chart' },
  consistency:  { color: 'text-emerald-400', borderColor: 'border-emerald-500/40', icon: 'zap' },
  milestone:    { color: 'text-amber-400',  borderColor: 'border-amber-500/40',  icon: 'star' },
  welcome:      { color: 'text-blue-400',   borderColor: 'border-blue-500/40',   icon: 'sparkle' },
  default:      { color: 'text-slate-400',  borderColor: 'border-slate-600',     icon: 'info' },
};

/**
 * Main function — call this from the dashboard.
 * Returns the single most relevant insight for the current user.
 */
export function getTopInsight(): Insight {
  let history: WorkoutLog[] = [];
  try {
    const raw = localStorage.getItem('workout_history');
    if (raw) {
      history = JSON.parse(raw);
      // Sort by date ascending (oldest first) for progression analysis
      history.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    }
  } catch (e) {
    // If history is corrupted, return default
    return { text: "Your program is ready. Start your first session to unlock insights.", priority: 100, type: 'welcome' };
  }

  // No history at all
  if (history.length === 0) {
    return {
      text: "Your program is ready. Complete your first session to unlock personalized insights.",
      subtext: "Every rep you log makes this dashboard smarter.",
      priority: 100,
      type: 'welcome'
    };
  }

  // Run all generators and collect non-null results
  const insights: Insight[] = [
    checkComeback(history),
    checkSpeedGain(history),
    checkRecentPRs(history),
    checkVolumeTrend(history),
    checkBestProgression(history),
    checkConsistency(history),
    checkMilestone(history),
    getDefaultInsight(history),
  ].filter((insight): insight is Insight => insight !== null);

  // Sort by priority (lowest number = highest priority)
  insights.sort((a, b) => a.priority - b.priority);

  // Return the top insight
  return insights[0] || { text: "Keep training. Your data tells a story.", priority: 99, type: 'default' };
}

// ============================================
// INSIGHT GENERATORS
// Each returns an Insight or null.
// ============================================

/**
 * COMEBACK NUDGE (Priority 1)
 * If they haven't trained in 7+ days, gently call it out.
 * This is highest priority because re-engagement is critical.
 */
function checkComeback(history: WorkoutLog[]): Insight | null {
  if (history.length === 0) return null;

  const lastWorkout = history[history.length - 1];
  const daysSinceLast = Math.floor((Date.now() - new Date(lastWorkout.date).getTime()) / (1000 * 60 * 60 * 24));

  if (daysSinceLast >= 14) {
    return {
      text: `It's been ${daysSinceLast} days since your last session. Your body doesn't lose strength that fast — but momentum is harder to rebuild. Today's a good day.`,
      priority: 1,
      type: 'comeback'
    };
  }

  if (daysSinceLast >= 7) {
    return {
      text: `${daysSinceLast} days since your last workout. A little break is fine — now let's get back on track.`,
      subtext: `Last session: ${lastWorkout.dayTitle}`,
      priority: 1,
      type: 'comeback'
    };
  }

  return null;
}

/**
 * SPEED GAIN (Priority 2)
 * If they've logged swing speed at least twice, show the trend.
 * This is the #1 golfer metric — trumps everything except comeback.
 */
function checkSpeedGain(history: WorkoutLog[]): Insight | null {
  const speedSessions = history.filter(log => log.swingSpeed?.driverSpeed);
  if (speedSessions.length < 2) return null;

  const first = speedSessions[0].swingSpeed!.driverSpeed!;
  const latest = speedSessions[speedSessions.length - 1].swingSpeed!.driverSpeed!;
  const gain = latest - first;

  // Estimate yards gained (roughly 2.5 yards per mph)
  const yardsEstimate = Math.round(gain * 2.5);

  if (gain > 0) {
    return {
      text: `Swing speed: ${first} → ${latest} mph (+${gain.toFixed(1)}). That's roughly ${yardsEstimate > 0 ? '+' + yardsEstimate : yardsEstimate} yards off the tee.`,
      subtext: `${speedSessions.length} speed sessions logged`,
      priority: 2,
      type: 'speed'
    };
  }

  if (gain === 0) {
    return {
      text: `Swing speed holding steady at ${latest} mph across ${speedSessions.length} sessions. Consistency is the foundation — gains are loading.`,
      priority: 5,
      type: 'speed'
    };
  }

  // Speed went down — still show it honestly but frame constructively
  return {
    text: `Latest swing speed: ${latest} mph. Down from your ${first} mph start — could be fatigue, could be a measurement difference. Track it again next session.`,
    priority: 5,
    type: 'speed'
  };
}

/**
 * RECENT PRs (Priority 3)
 * Check if their most recent workout had any sets where weight went up
 * while maintaining or increasing reps (a true PR).
 */
function checkRecentPRs(history: WorkoutLog[]): Insight | null {
  if (history.length < 2) return null;

  const latest = history[history.length - 1];
  const prNames: string[] = [];

  // For each exercise in the latest workout, check if any set beat
  // the best previous performance for that exercise
  latest.exercises.forEach(ex => {
    // Find this exercise's best previous weight
    let bestPrevWeight = 0;
    for (let i = 0; i < history.length - 1; i++) {
      const prevEx = history[i].exercises.find(e => e.name.toLowerCase() === ex.name.toLowerCase());
      if (prevEx) {
        prevEx.sets.forEach(set => {
          const w = parseFloat(set.weight.replace('#', '')) || 0;
          const normalized = set.weight.includes('#') ? w * 10 : w;
          if (normalized > bestPrevWeight) bestPrevWeight = normalized;
        });
      }
    }

    // Check if latest workout beat it
    if (bestPrevWeight > 0) {
      ex.sets.forEach(set => {
        const w = parseFloat(set.weight.replace('#', '')) || 0;
        const normalized = set.weight.includes('#') ? w * 10 : w;
        if (normalized > bestPrevWeight && !prNames.includes(ex.name)) {
          prNames.push(ex.name);
        }
      });
    }
  });

  if (prNames.length === 0) return null;

  // How recent was the last workout?
  const daysSince = Math.floor((Date.now() - new Date(latest.date).getTime()) / (1000 * 60 * 60 * 24));
  const recencyLabel = daysSince === 0 ? 'today' : daysSince === 1 ? 'yesterday' : `${daysSince} days ago`;

  if (prNames.length === 1) {
    return {
      text: `PR on ${prNames[0]} (${recencyLabel}). New weight record. The program is working.`,
      priority: 3,
      type: 'pr'
    };
  }

  return {
    text: `${prNames.length} PRs hit ${recencyLabel}: ${prNames.slice(0, 3).join(', ')}${prNames.length > 3 ? ` +${prNames.length - 3} more` : ''}. Strength is compounding.`,
    priority: 3,
    type: 'pr'
  };
}

/**
 * VOLUME TREND (Priority 4)
 * Compare total volume (weight × reps) of last 7 days vs. the 7 days before.
 */
function checkVolumeTrend(history: WorkoutLog[]): Insight | null {
  if (history.length < 3) return null;

  const now = Date.now();
  const oneWeekAgo = now - 7 * 24 * 60 * 60 * 1000;
  const twoWeeksAgo = now - 14 * 24 * 60 * 60 * 1000;

  const calcVolume = (logs: WorkoutLog[]): number => {
    let total = 0;
    logs.forEach(log => {
      log.exercises.forEach(ex => {
        ex.sets.forEach(set => {
          const w = parseFloat(set.weight.replace('#', '')) || 0;
          const normalized = set.weight.includes('#') ? w * 10 : w;
          const reps = parseInt(set.reps) || 0;
          total += normalized * reps;
        });
      });
    });
    return total;
  };

  const thisWeek = history.filter(log => new Date(log.date).getTime() >= oneWeekAgo);
  const lastWeek = history.filter(log => {
    const t = new Date(log.date).getTime();
    return t >= twoWeeksAgo && t < oneWeekAgo;
  });

  if (thisWeek.length === 0 || lastWeek.length === 0) return null;

  const thisVol = calcVolume(thisWeek);
  const lastVol = calcVolume(lastWeek);

  if (lastVol === 0) return null;

  const percentChange = ((thisVol - lastVol) / lastVol) * 100;

  if (percentChange > 5) {
    return {
      text: `Volume up ${Math.round(percentChange)}% this week vs. last. ${thisWeek.length} session${thisWeek.length > 1 ? 's' : ''} logged so far.`,
      subtext: `${Math.round(thisVol).toLocaleString()} lbs total work this week`,
      priority: 4,
      type: 'volume'
    };
  }

  if (percentChange < -10) {
    return {
      text: `Volume down ${Math.abs(Math.round(percentChange))}% this week. If it's a deload week, that's intentional. If not, let's pick it up.`,
      priority: 6,
      type: 'volume'
    };
  }

  return null; // Volume roughly flat — not interesting enough to show
}

/**
 * BEST PROGRESSION (Priority 5)
 * Find the exercise with the biggest weight increase since they started.
 * Shows the user their "signature lift" — the one they're crushing.
 */
function checkBestProgression(history: WorkoutLog[]): Insight | null {
  if (history.length < 3) return null;

  // Build a map of exercise → { firstWeight, latestWeight }
  const exerciseProgress: Record<string, { first: number; latest: number; unit: string }> = {};

  history.forEach(log => {
    log.exercises.forEach(ex => {
      const lastSet = ex.sets[ex.sets.length - 1];
      if (!lastSet) return;

      const isStack = lastSet.weight.includes('#');
      const raw = parseFloat(lastSet.weight.replace('#', '')) || 0;
      const normalized = isStack ? raw * 10 : raw;
      const unit = isStack ? '#' : 'lbs';

      if (!exerciseProgress[ex.name]) {
        exerciseProgress[ex.name] = { first: normalized, latest: normalized, unit };
      } else {
        exerciseProgress[ex.name].latest = normalized;
      }
    });
  });

  // Find the biggest absolute gain
  let bestName = '';
  let bestGain = 0;
  let bestData: { first: number; latest: number; unit: string } | null = null;

  Object.entries(exerciseProgress).forEach(([name, data]) => {
    const gain = data.latest - data.first;
    if (gain > bestGain && data.first > 0) {
      bestGain = gain;
      bestName = name;
      bestData = data;
    }
  });

  if (!bestData || bestGain <= 0) return null;

  const percentGain = ((bestGain / bestData.first) * 100).toFixed(0);
  const displayFirst = bestData.unit === '#' ? (bestData.first / 10) : bestData.first;
  const displayLatest = bestData.unit === '#' ? (bestData.latest / 10) : bestData.latest;
  const unitLabel = bestData.unit === '#' ? '#' : ' lbs';

  return {
    text: `Strongest progression: ${bestName} — ${displayFirst}${unitLabel} → ${displayLatest}${unitLabel} (+${percentGain}%).`,
    subtext: 'Calculated from your first to most recent logged weight.',
    priority: 5,
    type: 'progression'
  };
}

/**
 * CONSISTENCY (Priority 6)
 * Check how many of the last 4 calendar weeks they trained in.
 * Consistency is the #1 predictor of results.
 */
function checkConsistency(history: WorkoutLog[]): Insight | null {
  if (history.length < 4) return null;

  const now = Date.now();
  const weeksWithWorkouts = new Set<number>();

  history.forEach(log => {
    const logTime = new Date(log.date).getTime();
    const weeksAgo = Math.floor((now - logTime) / (7 * 24 * 60 * 60 * 1000));
    if (weeksAgo < 4) {
      weeksWithWorkouts.add(weeksAgo);
    }
  });

  const activeWeeks = weeksWithWorkouts.size;

  if (activeWeeks === 4) {
    // Count total sessions in last 4 weeks
    const fourWeeksAgo = now - 28 * 24 * 60 * 60 * 1000;
    const recentCount = history.filter(log => new Date(log.date).getTime() >= fourWeeksAgo).length;
    return {
      text: `4 straight weeks of training (${recentCount} sessions). That consistency is rare — and it's where real results come from.`,
      priority: 6,
      type: 'consistency'
    };
  }

  if (activeWeeks === 3) {
    return {
      text: `3 out of the last 4 weeks active. One more consistent week and you've built a real habit.`,
      priority: 7,
      type: 'consistency'
    };
  }

  return null;
}

/**
 * MILESTONES (Priority 7)
 * Celebrate round-number session counts.
 */
function checkMilestone(history: WorkoutLog[]): Insight | null {
  const count = history.length;

  // Only trigger on milestone numbers (within 1 session so they don't miss it)
  const milestones = [
    { count: 5, text: "5 sessions logged. You've outlasted most people who download a fitness app. The hard part was starting." },
    { count: 10, text: "10 sessions in the books. Your body is adapting — neural pathways are forming, movement patterns are locking in." },
    { count: 25, text: "25 sessions. This isn't a trial anymore — this is a training habit. Gains compound from here." },
    { count: 50, text: "50 sessions. Half a hundred. You're in a completely different place than when you started. The data proves it." },
    { count: 75, text: "75 sessions. Most people never get here. Your consistency is your competitive advantage." },
    { count: 100, text: "100 sessions. Triple digits. This is what commitment looks like in data form." },
  ];

  const milestone = milestones.find(m => count >= m.count && count <= m.count + 1);
  if (milestone) {
    return {
      text: milestone.text,
      priority: 7,
      type: 'milestone'
    };
  }

  return null;
}

/**
 * DEFAULT INSIGHT (Priority 99)
 * Always returns something. This is the fallback
 * when no other insight is interesting enough.
 */
function getDefaultInsight(history: WorkoutLog[]): Insight {
  const count = history.length;
  const lastWorkout = history[history.length - 1];
  const daysSince = Math.floor((Date.now() - new Date(lastWorkout.date).getTime()) / (1000 * 60 * 60 * 24));

  if (count < 3) {
    return {
      text: `${count} session${count > 1 ? 's' : ''} logged. The app gets smarter with every workout — keep building your baseline.`,
      subtext: 'Insights unlock as you log more data.',
      priority: 99,
      type: 'default'
    };
  }

  if (daysSince <= 1) {
    return {
      text: `${count} sessions tracked. You trained ${daysSince === 0 ? 'today' : 'yesterday'}. Recovery is where gains happen — fuel up and rest.`,
      priority: 99,
      type: 'default'
    };
  }

  return {
    text: `${count} sessions in the system. Every set is data. Every session makes the picture clearer.`,
    priority: 99,
    type: 'default'
  };
}
