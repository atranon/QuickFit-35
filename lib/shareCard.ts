export interface ShareCardData {
  firstSpeed?: number;
  latestSpeed?: number;
  speedGain?: number;
  estimatedYards?: number;
  totalSessions: number;
  weekStreak?: number;
  bestLift?: { name: string; startWeight: number; endWeight: number };
  playerName?: string;
  dateRange?: string;
}

/**
 * Renders a premium, share-worthy progress card using Canvas.
 *
 * Design philosophy: This should look like a card from a premium sports brand.
 * Bold gradients, huge typography, and a clear visual hierarchy that
 * makes the golfer look impressive when they share it.
 */
export async function generateShareCard(data: ShareCardData): Promise<Blob> {
  const W = 1080;
  const H = 1350;

  const canvas = document.createElement('canvas');
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d')!;

  // ── Helper: rounded rect path ──
  function rr(x: number, y: number, w: number, h: number, r: number) {
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

  // ════════════════════════════════════════════
  // LAYER 1: RICH BACKGROUND
  // ════════════════════════════════════════════

  // Base dark fill
  ctx.fillStyle = '#020617';
  ctx.fillRect(0, 0, W, H);

  // Angled gradient sweep (emerald → teal → transparent)
  ctx.save();
  ctx.translate(W * 0.3, -H * 0.1);
  ctx.rotate(0.35); // ~20 degrees
  const sweep = ctx.createLinearGradient(0, 0, W * 0.8, H * 0.6);
  sweep.addColorStop(0, 'rgba(16, 185, 129, 0.18)');
  sweep.addColorStop(0.4, 'rgba(6, 182, 212, 0.12)');
  sweep.addColorStop(0.7, 'rgba(245, 158, 11, 0.06)');
  sweep.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = sweep;
  ctx.fillRect(-200, -200, W + 400, H + 400);
  ctx.restore();

  // Second glow — lower right (amber warmth)
  const glow2 = ctx.createRadialGradient(W * 0.8, H * 0.7, 0, W * 0.8, H * 0.7, 500);
  glow2.addColorStop(0, 'rgba(245, 158, 11, 0.08)');
  glow2.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = glow2;
  ctx.fillRect(0, 0, W, H);

  // Subtle diagonal grid lines (texture)
  ctx.save();
  ctx.strokeStyle = 'rgba(148, 163, 184, 0.03)';
  ctx.lineWidth = 1;
  for (let i = -H; i < W + H; i += 60) {
    ctx.beginPath();
    ctx.moveTo(i, 0);
    ctx.lineTo(i + H, H);
    ctx.stroke();
  }
  ctx.restore();

  // Top edge accent line (thin emerald)
  const topLine = ctx.createLinearGradient(0, 0, W, 0);
  topLine.addColorStop(0, 'rgba(16, 185, 129, 0)');
  topLine.addColorStop(0.3, 'rgba(16, 185, 129, 0.8)');
  topLine.addColorStop(0.7, 'rgba(6, 182, 212, 0.6)');
  topLine.addColorStop(1, 'rgba(16, 185, 129, 0)');
  ctx.fillStyle = topLine;
  ctx.fillRect(0, 0, W, 4);

  // ════════════════════════════════════════════
  // LAYER 2: BRAND HEADER
  // ════════════════════════════════════════════

  // Logo wordmark
  ctx.textAlign = 'center';
  ctx.font = '900 52px system-ui, -apple-system, "Segoe UI", sans-serif';
  ctx.fillStyle = '#ffffff';
  ctx.fillText('QUICKFIT', W / 2 - 40, 90);
  ctx.fillStyle = '#10b981';
  ctx.fillText(' 35', W / 2 + 130, 90);

  // Tagline
  ctx.font = '700 20px system-ui, -apple-system, sans-serif';
  ctx.fillStyle = '#64748b';
  ctx.letterSpacing = '8px';
  ctx.fillText('G O L F   P E R F O R M A N C E', W / 2, 125);

  // Thin separator line
  const sep = ctx.createLinearGradient(W * 0.2, 0, W * 0.8, 0);
  sep.addColorStop(0, 'rgba(100, 116, 139, 0)');
  sep.addColorStop(0.5, 'rgba(100, 116, 139, 0.3)');
  sep.addColorStop(1, 'rgba(100, 116, 139, 0)');
  ctx.fillStyle = sep;
  ctx.fillRect(W * 0.15, 150, W * 0.7, 1);

  // Player name (if available)
  if (data.playerName) {
    ctx.font = '600 24px system-ui, -apple-system, sans-serif';
    ctx.fillStyle = '#94a3b8';
    ctx.fillText(data.playerName.toUpperCase(), W / 2, 190);
  }

  let y = data.playerName ? 230 : 195;

  // ════════════════════════════════════════════
  // LAYER 3: HERO SPEED SECTION
  // ════════════════════════════════════════════

  if (data.latestSpeed && data.firstSpeed !== undefined && data.speedGain !== undefined) {

    // Giant glow behind the speed number
    const heroGlow = ctx.createRadialGradient(W / 2, y + 180, 0, W / 2, y + 180, 350);
    heroGlow.addColorStop(0, 'rgba(245, 158, 11, 0.12)');
    heroGlow.addColorStop(0.5, 'rgba(245, 158, 11, 0.04)');
    heroGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = heroGlow;
    ctx.fillRect(0, y, W, 400);

    // "CLUBHEAD SPEED" label
    ctx.font = '800 22px system-ui, -apple-system, sans-serif';
    ctx.fillStyle = '#f59e0b';
    ctx.textAlign = 'center';
    ctx.fillText('C L U B H E A D   S P E E D', W / 2, y + 50);

    // Show either progression (first → latest) or single speed
    if (data.speedGain !== 0 && data.firstSpeed !== data.latestSpeed) {
      // Starting speed (smaller, muted)
      ctx.font = '800 72px system-ui, -apple-system, sans-serif';
      ctx.fillStyle = '#475569';
      ctx.textAlign = 'right';
      ctx.fillText(`${data.firstSpeed}`, W / 2 - 30, y + 155);

      // Arrow with gradient trail
      ctx.save();
      const arrowGrad = ctx.createLinearGradient(W / 2 - 25, y + 130, W / 2 + 25, y + 130);
      arrowGrad.addColorStop(0, '#475569');
      arrowGrad.addColorStop(1, '#f59e0b');
      ctx.fillStyle = arrowGrad;
      ctx.font = '700 48px system-ui, -apple-system, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('→', W / 2, y + 148);
      ctx.restore();

      // Latest speed (huge, white, bold)
      ctx.font = '900 100px system-ui, -apple-system, sans-serif';
      ctx.fillStyle = '#ffffff';
      ctx.textAlign = 'left';
      ctx.fillText(`${data.latestSpeed}`, W / 2 + 25, y + 162);

    } else {
      // Single speed — show it big and centered
      ctx.font = '900 130px system-ui, -apple-system, sans-serif';
      ctx.fillStyle = '#ffffff';
      ctx.textAlign = 'center';
      ctx.fillText(`${data.latestSpeed}`, W / 2, y + 170);
    }

    // "MPH" unit
    ctx.font = '800 36px system-ui, -apple-system, sans-serif';
    ctx.fillStyle = 'rgba(245, 158, 11, 0.6)';
    ctx.textAlign = 'center';
    ctx.fillText('MPH', W / 2, y + 210);

    // Gain pill
    if (data.speedGain !== 0) {
      const gainStr = `${data.speedGain > 0 ? '+' : ''}${data.speedGain.toFixed(1)} MPH`;
      ctx.font = '800 28px system-ui, -apple-system, sans-serif';
      const pillW = ctx.measureText(gainStr).width + 56;
      const pillX = W / 2 - pillW / 2;
      const pillY = y + 240;

      rr(pillX, pillY, pillW, 48, 24);
      ctx.fillStyle = data.speedGain > 0 ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.15)';
      ctx.fill();
      ctx.strokeStyle = data.speedGain > 0 ? 'rgba(16, 185, 129, 0.4)' : 'rgba(239, 68, 68, 0.3)';
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.fillStyle = data.speedGain > 0 ? '#34d399' : '#f87171';
      ctx.textAlign = 'center';
      ctx.fillText(gainStr, W / 2, pillY + 34);
    }

    // ── ESTIMATED YARDS — bold standalone callout ──
    if (data.estimatedYards && data.estimatedYards > 0) {
      const yardsY = y + 330;
      ctx.font = '900 56px system-ui, -apple-system, sans-serif';
      ctx.fillStyle = '#ffffff';
      ctx.textAlign = 'center';
      ctx.fillText(`+${data.estimatedYards} YARDS`, W / 2, yardsY);

      ctx.font = '600 20px system-ui, -apple-system, sans-serif';
      ctx.fillStyle = '#64748b';
      ctx.fillText('estimated distance gained off the tee', W / 2, yardsY + 35);
    }

    y += data.estimatedYards ? 420 : 340;

  } else {
    // No speed data — show a different hero: sessions count
    const heroGlow = ctx.createRadialGradient(W / 2, y + 140, 0, W / 2, y + 140, 300);
    heroGlow.addColorStop(0, 'rgba(16, 185, 129, 0.1)');
    heroGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = heroGlow;
    ctx.fillRect(0, y, W, 300);

    ctx.font = '800 22px system-ui, -apple-system, sans-serif';
    ctx.fillStyle = '#10b981';
    ctx.textAlign = 'center';
    ctx.fillText('S E S S I O N S   L O G G E D', W / 2, y + 50);

    ctx.font = '900 140px system-ui, -apple-system, sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.fillText(`${data.totalSessions}`, W / 2, y + 195);

    ctx.font = '600 22px system-ui, -apple-system, sans-serif';
    ctx.fillStyle = '#64748b';
    ctx.fillText('workouts completed', W / 2, y + 235);

    y += 300;
  }

  // ════════════════════════════════════════════
  // LAYER 4: STATS ROW
  // ════════════════════════════════════════════

  y += 20;

  // Glass-morphism-style stat cards
  const statCardW = (W - 120 - 30) / 2;
  const statCardH = 140;

  // Card backgrounds (glass effect)
  const drawGlassCard = (x: number, cy: number, w: number, h: number) => {
    rr(x, cy, w, h, 20);
    ctx.fillStyle = 'rgba(30, 41, 59, 0.6)';
    ctx.fill();
    ctx.strokeStyle = 'rgba(148, 163, 184, 0.1)';
    ctx.lineWidth = 1;
    ctx.stroke();
  };

  // Card 1: Sessions (or streak if speed card already showed sessions)
  drawGlassCard(60, y, statCardW, statCardH);
  if (data.latestSpeed) {
    // Speed card showed the speed hero — show sessions here
    ctx.fillStyle = '#64748b';
    ctx.font = '700 16px system-ui, -apple-system, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('SESSIONS', 60 + statCardW / 2, y + 40);
    ctx.fillStyle = '#e2e8f0';
    ctx.font = '900 56px system-ui, -apple-system, sans-serif';
    ctx.fillText(`${data.totalSessions}`, 60 + statCardW / 2, y + 105);
  } else {
    // Non-speed card — show streak
    ctx.fillStyle = '#64748b';
    ctx.font = '700 16px system-ui, -apple-system, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('WEEK STREAK', 60 + statCardW / 2, y + 40);
    ctx.fillStyle = '#f59e0b';
    ctx.font = '900 56px system-ui, -apple-system, sans-serif';
    ctx.fillText(`${data.weekStreak || 0}`, 60 + statCardW / 2, y + 105);
  }

  // Card 2: Streak or training status
  const card2X = 60 + statCardW + 30;
  drawGlassCard(card2X, y, statCardW, statCardH);

  if (data.weekStreak && data.weekStreak >= 2 && data.latestSpeed) {
    ctx.fillStyle = '#64748b';
    ctx.font = '700 16px system-ui, -apple-system, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('WEEK STREAK', card2X + statCardW / 2, y + 40);
    ctx.fillStyle = '#f59e0b';
    ctx.font = '900 56px system-ui, -apple-system, sans-serif';
    ctx.fillText(`${data.weekStreak}`, card2X + statCardW / 2, y + 105);
  } else {
    ctx.fillStyle = '#64748b';
    ctx.font = '700 16px system-ui, -apple-system, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('STATUS', card2X + statCardW / 2, y + 40);
    ctx.fillStyle = '#10b981';
    ctx.font = '800 32px system-ui, -apple-system, sans-serif';
    ctx.fillText('ACTIVE', card2X + statCardW / 2, y + 95);
  }

  y += statCardH + 30;

  // ── Best Lift (if available) ──
  if (data.bestLift && data.bestLift.endWeight > data.bestLift.startWeight) {
    drawGlassCard(60, y, W - 120, 100);
    const pct = (((data.bestLift.endWeight - data.bestLift.startWeight) / data.bestLift.startWeight) * 100).toFixed(0);

    ctx.fillStyle = '#64748b';
    ctx.font = '700 14px system-ui, -apple-system, sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText('STRONGEST LIFT', 90, y + 35);

    ctx.fillStyle = '#e2e8f0';
    ctx.font = '800 22px system-ui, -apple-system, sans-serif';
    ctx.fillText(data.bestLift.name, 90, y + 65);

    ctx.fillStyle = '#10b981';
    ctx.font = '800 22px system-ui, -apple-system, sans-serif';
    ctx.textAlign = 'right';
    ctx.fillText(`${data.bestLift.startWeight} → ${data.bestLift.endWeight} lbs (+${pct}%)`, W - 90, y + 65);

    y += 130;
  }

  // ════════════════════════════════════════════
  // LAYER 5: MOTIVATIONAL TAGLINE
  // ════════════════════════════════════════════

  y += 10;
  const taglines = data.latestSpeed ? [
    'Every mph is earned in the gym.',
    'Speed is built, not found.',
    'The tee box will notice.',
    'Faster swings. Longer drives.',
    'The work shows up on the radar.',
  ] : [
    'Consistency is the cheat code.',
    'Stronger body. Better golf.',
    'Every rep is an investment.',
    'The work speaks for itself.',
    'Built different. Built for golf.',
  ];
  const tagline = taglines[Math.floor(Math.random() * taglines.length)];

  ctx.font = 'italic 600 30px system-ui, -apple-system, sans-serif';
  ctx.fillStyle = '#94a3b8';
  ctx.textAlign = 'center';
  ctx.fillText(`"${tagline}"`, W / 2, y);

  // Date range
  if (data.dateRange) {
    ctx.font = '500 18px system-ui, -apple-system, sans-serif';
    ctx.fillStyle = '#475569';
    ctx.fillText(data.dateRange, W / 2, y + 40);
  }

  // ════════════════════════════════════════════
  // LAYER 6: FOOTER CTA
  // ════════════════════════════════════════════

  // Bottom gradient bar
  const footerGrad = ctx.createLinearGradient(0, H - 120, 0, H);
  footerGrad.addColorStop(0, 'rgba(2, 6, 23, 0)');
  footerGrad.addColorStop(1, 'rgba(16, 185, 129, 0.08)');
  ctx.fillStyle = footerGrad;
  ctx.fillRect(0, H - 120, W, 120);

  // Bottom line accent
  const botLine = ctx.createLinearGradient(0, 0, W, 0);
  botLine.addColorStop(0, 'rgba(16, 185, 129, 0)');
  botLine.addColorStop(0.5, 'rgba(16, 185, 129, 0.5)');
  botLine.addColorStop(1, 'rgba(16, 185, 129, 0)');
  ctx.fillStyle = botLine;
  ctx.fillRect(0, H - 4, W, 4);

  ctx.font = '500 20px system-ui, -apple-system, sans-serif';
  ctx.fillStyle = '#64748b';
  ctx.textAlign = 'center';
  ctx.fillText('Built with', W / 2 - 80, H - 35);

  ctx.font = '800 22px system-ui, -apple-system, sans-serif';
  ctx.fillStyle = '#10b981';
  ctx.fillText('QuickFit 35', W / 2 + 40, H - 35);

  // ── Export as PNG ──
  return new Promise((resolve, reject) => {
    canvas.toBlob(blob => {
      if (blob) resolve(blob);
      else reject(new Error('Failed to generate image'));
    }, 'image/png');
  });
}

/**
 * Shares the card via Web Share API (mobile) or downloads it (desktop fallback).
 */
export async function shareOrDownloadCard(data: ShareCardData): Promise<'shared' | 'downloaded' | 'error'> {
  try {
    const blob = await generateShareCard(data);
    const file = new File([blob], 'quickfit-progress.png', { type: 'image/png' });

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
    if (e.name === 'AbortError') return 'shared';
    console.error('Share failed:', e);
    return 'error';
  }
}

/**
 * Builds ShareCardData from workout history in localStorage.
 */
export function buildShareDataFromHistory(): ShareCardData {
  const data: ShareCardData = { totalSessions: 0 };

  try {
    const historyStr = localStorage.getItem('workout_history');
    if (!historyStr) return data;

    const history = JSON.parse(historyStr);
    if (!Array.isArray(history) || history.length === 0) return data;

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

    // Player name
    try {
      const prefs = JSON.parse(localStorage.getItem('user_preferences') || '{}');
      if (prefs.playerName) data.playerName = prefs.playerName;
    } catch {}

    // Week streak
    const now = Date.now();
    const weeksWithWorkouts = new Set<number>();
    history.forEach((h: any) => {
      const weeksAgo = Math.floor((now - new Date(h.date).getTime()) / (7 * 24 * 60 * 60 * 1000));
      if (weeksAgo < 4) weeksWithWorkouts.add(weeksAgo);
    });
    data.weekStreak = weeksWithWorkouts.size;

    // Best lift
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
      data.bestLift = { name: bestName, startWeight: (bestData as any).start, endWeight: (bestData as any).end };
    }
  } catch (e) {
    console.error('Failed to build share data:', e);
  }

  return data;
}
