/*
  SHARE CARD GENERATOR

  Renders a branded image using HTML Canvas and either shares it
  via the Web Share API (mobile) or downloads it (desktop fallback).

  Canvas dimensions: 1080 x 1350 (4:5 ratio — optimized for Instagram Stories
  and iMessage preview, also works well for Twitter/X cards).

  Why Canvas instead of html2canvas or dom-to-image:
  - Zero dependencies
  - Pixel-perfect control over the output
  - No DOM rendering quirks
  - Works offline
  - ~100 lines of drawing code
*/

export interface ShareCardData {
  // Speed data (required for speed cards, optional for general progress)
  firstSpeed?: number;
  latestSpeed?: number;
  speedGain?: number;
  estimatedYards?: number;

  // General progress data
  totalSessions: number;
  weekStreak?: number;
  bestLift?: { name: string; startWeight: number; endWeight: number };

  // Metadata
  playerName?: string;  // Optional — from preferences
  dateRange?: string;   // e.g., "Jan 15 – Mar 20, 2026"
}

// Color palette matching the app's emerald/slate theme
const COLORS = {
  bg1: '#0f172a',        // slate-900
  bg2: '#1e293b',        // slate-800
  emerald: '#10b981',    // emerald-500
  emeraldDark: '#059669', // emerald-600
  amber: '#f59e0b',      // amber-500
  amberDark: '#d97706',  // amber-600
  white: '#ffffff',
  gray100: '#f1f5f9',
  gray400: '#94a3b8',
  gray500: '#64748b',
  gray600: '#475569',
  gray800: '#1e293b',
};

/**
 * Renders a progress card to a Canvas and returns it as a Blob.
 */
export async function generateShareCard(data: ShareCardData): Promise<Blob> {
  const width = 1080;
  const height = 1350;

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d')!;

  // ── Background gradient ──
  const bgGrad = ctx.createLinearGradient(0, 0, 0, height);
  bgGrad.addColorStop(0, COLORS.bg1);
  bgGrad.addColorStop(1, '#020617'); // slate-950
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, width, height);

  // ── Decorative glow circle (top center) ──
  const glowGrad = ctx.createRadialGradient(width / 2, 200, 0, width / 2, 200, 400);
  glowGrad.addColorStop(0, 'rgba(16, 185, 129, 0.15)');
  glowGrad.addColorStop(1, 'rgba(16, 185, 129, 0)');
  ctx.fillStyle = glowGrad;
  ctx.fillRect(0, 0, width, 600);

  // ── Helper: draw rounded rect ──
  function roundRect(x: number, y: number, w: number, h: number, r: number) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
  }

  // ── Brand header ──
  ctx.fillStyle = COLORS.emerald;
  ctx.font = 'bold 42px system-ui, -apple-system, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('QUICKFIT', width / 2 - 30, 100);
  ctx.fillStyle = COLORS.white;
  ctx.fillText('35', width / 2 + 120, 100);

  ctx.fillStyle = COLORS.gray500;
  ctx.font = '600 22px system-ui, -apple-system, sans-serif';
  ctx.fillText('Golf Performance Training', width / 2, 140);

  let yPos = 220;

  // ── Speed section (if speed data available) ──
  if (data.latestSpeed && data.firstSpeed && data.speedGain !== undefined) {
    // Speed card background
    roundRect(60, yPos, width - 120, 360, 32);
    const speedBg = ctx.createLinearGradient(60, yPos, width - 60, yPos + 360);
    speedBg.addColorStop(0, 'rgba(245, 158, 11, 0.1)');
    speedBg.addColorStop(1, 'rgba(217, 119, 6, 0.05)');
    ctx.fillStyle = speedBg;
    ctx.fill();
    ctx.strokeStyle = 'rgba(245, 158, 11, 0.3)';
    ctx.lineWidth = 2;
    ctx.stroke();

    // "CLUBHEAD SPEED" label
    ctx.fillStyle = COLORS.amber;
    ctx.font = 'bold 24px system-ui, -apple-system, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('CLUBHEAD SPEED', width / 2, yPos + 55);

    // Big speed numbers: "102 → 112"
    ctx.fillStyle = COLORS.gray400;
    ctx.font = 'bold 80px system-ui, -apple-system, sans-serif';
    ctx.textAlign = 'right';
    ctx.fillText(`${data.firstSpeed}`, width / 2 - 40, yPos + 165);

    ctx.fillStyle = COLORS.gray600;
    ctx.font = 'bold 50px system-ui, -apple-system, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('→', width / 2, yPos + 155);

    ctx.fillStyle = COLORS.white;
    ctx.font = 'bold 80px system-ui, -apple-system, sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText(`${data.latestSpeed}`, width / 2 + 40, yPos + 165);

    // MPH label
    ctx.fillStyle = COLORS.amber;
    ctx.font = 'bold 30px system-ui, -apple-system, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('MPH', width / 2, yPos + 205);

    // Gain badge
    const gainText = `+${data.speedGain.toFixed(1)} mph`;
    const gainWidth = ctx.measureText(gainText).width + 48;
    roundRect(width / 2 - gainWidth / 2, yPos + 240, gainWidth, 50, 25);
    ctx.fillStyle = data.speedGain > 0 ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)';
    ctx.fill();
    ctx.fillStyle = data.speedGain > 0 ? COLORS.emerald : '#ef4444';
    ctx.font = 'bold 26px system-ui, -apple-system, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(gainText, width / 2, yPos + 273);

    // Estimated yards
    if (data.estimatedYards) {
      ctx.fillStyle = COLORS.gray500;
      ctx.font = '500 24px system-ui, -apple-system, sans-serif';
      ctx.fillText(`≈ +${data.estimatedYards} yards off the tee`, width / 2, yPos + 330);
    }

    yPos += 400;
  }

  // ── Stats grid ──
  const statsY = yPos + 20;
  const cardW = (width - 120 - 30) / 2;
  const cardH = 160;

  // Card 1: Sessions
  roundRect(60, statsY, cardW, cardH, 24);
  ctx.fillStyle = COLORS.bg2;
  ctx.fill();
  ctx.strokeStyle = 'rgba(100, 116, 139, 0.3)';
  ctx.lineWidth = 1;
  ctx.stroke();

  ctx.fillStyle = COLORS.gray500;
  ctx.font = 'bold 18px system-ui, -apple-system, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('SESSIONS', 60 + cardW / 2, statsY + 50);
  ctx.fillStyle = COLORS.white;
  ctx.font = 'bold 64px system-ui, -apple-system, sans-serif';
  ctx.fillText(`${data.totalSessions}`, 60 + cardW / 2, statsY + 120);

  // Card 2: Streak or best lift
  roundRect(60 + cardW + 30, statsY, cardW, cardH, 24);
  ctx.fillStyle = COLORS.bg2;
  ctx.fill();
  ctx.strokeStyle = 'rgba(100, 116, 139, 0.3)';
  ctx.lineWidth = 1;
  ctx.stroke();

  if (data.weekStreak && data.weekStreak > 0) {
    ctx.fillStyle = COLORS.gray500;
    ctx.font = 'bold 18px system-ui, -apple-system, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('WEEK STREAK', 60 + cardW + 30 + cardW / 2, statsY + 50);
    ctx.fillStyle = COLORS.amber;
    ctx.font = 'bold 64px system-ui, -apple-system, sans-serif';
    ctx.fillText(`${data.weekStreak}`, 60 + cardW + 30 + cardW / 2, statsY + 120);
  } else {
    ctx.fillStyle = COLORS.gray500;
    ctx.font = 'bold 18px system-ui, -apple-system, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('TRAINING', 60 + cardW + 30 + cardW / 2, statsY + 50);
    ctx.fillStyle = COLORS.emerald;
    ctx.font = 'bold 48px system-ui, -apple-system, sans-serif';
    ctx.fillText('ACTIVE', 60 + cardW + 30 + cardW / 2, statsY + 115);
  }

  yPos = statsY + cardH + 40;

  // ── Best lift progression (if available) ──
  if (data.bestLift && data.bestLift.endWeight > data.bestLift.startWeight) {
    roundRect(60, yPos, width - 120, 120, 24);
    ctx.fillStyle = COLORS.bg2;
    ctx.fill();
    ctx.strokeStyle = 'rgba(100, 116, 139, 0.3)';
    ctx.lineWidth = 1;
    ctx.stroke();

    ctx.fillStyle = COLORS.gray500;
    ctx.font = 'bold 18px system-ui, -apple-system, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('STRONGEST PROGRESSION', width / 2, yPos + 40);

    ctx.fillStyle = COLORS.white;
    ctx.font = 'bold 28px system-ui, -apple-system, sans-serif';
    ctx.fillText(`${data.bestLift.name}`, width / 2, yPos + 75);

    ctx.fillStyle = COLORS.gray400;
    ctx.font = '500 22px system-ui, -apple-system, sans-serif';
    const pct = (((data.bestLift.endWeight - data.bestLift.startWeight) / data.bestLift.startWeight) * 100).toFixed(0);
    ctx.fillText(`${data.bestLift.startWeight} → ${data.bestLift.endWeight} lbs  (+${pct}%)`, width / 2, yPos + 105);

    yPos += 150;
  }

  // ── Motivational tagline ──
  yPos += 20;
  ctx.fillStyle = COLORS.gray400;
  ctx.font = 'italic 500 28px system-ui, -apple-system, sans-serif';
  ctx.textAlign = 'center';

  const taglines = data.latestSpeed ? [
    'Every mph is earned in the gym.',
    'Speed is built, not found.',
    'The tee box notices.',
    'Your swing speed is your signature.',
  ] : [
    'Consistency is the cheat code.',
    'Every session is proof.',
    'Stronger body, better golf.',
    'The work speaks for itself.',
  ];
  const tagline = taglines[Math.floor(Math.random() * taglines.length)];
  ctx.fillText(`"${tagline}"`, width / 2, yPos);

  // ── Date range ──
  if (data.dateRange) {
    ctx.fillStyle = COLORS.gray600;
    ctx.font = '500 20px system-ui, -apple-system, sans-serif';
    ctx.fillText(data.dateRange, width / 2, yPos + 40);
  }

  // ── Footer CTA ──
  ctx.fillStyle = COLORS.gray600;
  ctx.font = '500 22px system-ui, -apple-system, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('Train smarter. Swing faster.', width / 2, height - 80);

  ctx.fillStyle = COLORS.emerald;
  ctx.font = 'bold 24px system-ui, -apple-system, sans-serif';
  ctx.fillText('quickfit35.app', width / 2, height - 45);

  // ── Convert to Blob ──
  return new Promise((resolve, reject) => {
    canvas.toBlob(blob => {
      if (blob) resolve(blob);
      else reject(new Error('Failed to generate image'));
    }, 'image/png');
  });
}

/**
 * Shares the card using the Web Share API (mobile) or downloads it (desktop).
 *
 * Web Share API shows the native share sheet — iMessage, WhatsApp, Instagram Stories,
 * Twitter/X, etc. It's available on iOS Safari, Chrome Android, and some desktop browsers.
 *
 * Fallback: download the image as a PNG file.
 */
export async function shareOrDownloadCard(data: ShareCardData): Promise<'shared' | 'downloaded' | 'error'> {
  try {
    const blob = await generateShareCard(data);
    const file = new File([blob], 'quickfit-progress.png', { type: 'image/png' });

    // Try native share first
    if (navigator.share && navigator.canShare?.({ files: [file] })) {
      await navigator.share({
        title: 'My Golf Fitness Progress',
        text: data.latestSpeed
          ? `Swing speed: ${data.firstSpeed} → ${data.latestSpeed} mph (+${data.speedGain?.toFixed(1)}). Trained with QuickFit 35.`
          : `${data.totalSessions} sessions logged with QuickFit 35. The work is paying off.`,
        files: [file],
      });
      return 'shared';
    }

    // Fallback: download
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `quickfit-progress-${new Date().toISOString().slice(0, 10)}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    return 'downloaded';
  } catch (e: any) {
    // User cancelled the share sheet (AbortError) — not a real error
    if (e.name === 'AbortError') return 'shared';
    console.error('Share failed:', e);
    return 'error';
  }
}

/**
 * Helper: builds ShareCardData from workout history in localStorage.
 * Extracts all the stats needed to render a progress card.
 */
export function buildShareDataFromHistory(): ShareCardData {
  const data: ShareCardData = { totalSessions: 0 };

  try {
    const historyStr = localStorage.getItem('workout_history');
    if (!historyStr) return data;

    const history = JSON.parse(historyStr);
    if (!Array.isArray(history) || history.length === 0) return data;

    // Sort chronologically
    history.sort((a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime());

    data.totalSessions = history.length;

    // Date range
    const firstDate = new Date(history[0].date);
    const lastDate = new Date(history[history.length - 1].date);
    data.dateRange = `${firstDate.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })} – ${lastDate.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}`;

    // Speed data
    const speedSessions = history.filter((h: any) => h.swingSpeed?.driverSpeed);
    if (speedSessions.length >= 2) {
      data.firstSpeed = speedSessions[0].swingSpeed.driverSpeed;
      data.latestSpeed = speedSessions[speedSessions.length - 1].swingSpeed.driverSpeed;
      data.speedGain = data.latestSpeed! - data.firstSpeed!;
      data.estimatedYards = Math.round(data.speedGain! * 2.5);
    } else if (speedSessions.length === 1) {
      data.latestSpeed = speedSessions[0].swingSpeed.driverSpeed;
      data.firstSpeed = data.latestSpeed;
      data.speedGain = 0;
    }

    // Week streak (how many of the last 4 calendar weeks had workouts)
    const now = Date.now();
    const weeksWithWorkouts = new Set<number>();
    history.forEach((h: any) => {
      const weeksAgo = Math.floor((now - new Date(h.date).getTime()) / (7 * 24 * 60 * 60 * 1000));
      if (weeksAgo < 4) weeksWithWorkouts.add(weeksAgo);
    });
    data.weekStreak = weeksWithWorkouts.size;

    // Best lift progression
    const exerciseProgress: Record<string, { start: number; end: number }> = {};
    history.forEach((h: any) => {
      if (!h.exercises) return;
      h.exercises.forEach((ex: any) => {
        const lastSet = ex.sets?.[ex.sets.length - 1];
        if (!lastSet?.weight) return;
        const w = parseFloat(lastSet.weight.replace('#', '')) || 0;
        const normalized = lastSet.weight.includes('#') ? w * 10 : w;
        if (!exerciseProgress[ex.name]) {
          exerciseProgress[ex.name] = { start: normalized, end: normalized };
        } else {
          exerciseProgress[ex.name].end = normalized;
        }
      });
    });

    let bestGain = 0;
    let bestName = '';
    let bestData: { start: number; end: number } | null = null;
    Object.entries(exerciseProgress).forEach(([name, d]) => {
      const gain = d.end - d.start;
      if (gain > bestGain && d.start > 0) {
        bestGain = gain;
        bestName = name;
        bestData = d;
      }
    });
    if (bestData && bestGain > 0) {
      data.bestLift = { name: bestName, startWeight: bestData.start, endWeight: bestData.end };
    }

  } catch (e) {
    console.error('Failed to build share data:', e);
  }

  return data;
}
