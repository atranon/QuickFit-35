import { Haptics, ImpactStyle } from '@capacitor/haptics';

export const decodeBase64 = (base64: string): Uint8Array => {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
};

export const decodeAudioData = async (
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number = 24000,
  numChannels: number = 1
): Promise<AudioBuffer> => {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
};

export const playBeep = async () => {
  // Haptic feedback on native devices
  try {
    await Haptics.impact({ style: ImpactStyle.Heavy });
  } catch {
    // Silently fail on web — haptics only work on native
  }

  // Audio beep
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    const ctx = new AudioContextClass();

    const playBurst = (startTime: number) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "square";
      osc.frequency.setValueAtTime(783.99, startTime); // G5
      osc.frequency.setValueAtTime(1046.5, startTime + 0.1); // C6
      osc.frequency.setValueAtTime(783.99, startTime + 0.2); // G5

      gain.gain.setValueAtTime(0.1, startTime);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.5);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(startTime);
      osc.stop(startTime + 0.5);
    };

    const now = ctx.currentTime;
    // Play sequence 3 times
    playBurst(now);
    playBurst(now + 0.6);
    playBurst(now + 1.2);

  } catch (e) {
    console.error("Audio beep failed", e);
  }
};

/**
 * Plays a soft tick sound for countdown warnings.
 * Much quieter and shorter than the completion beep.
 */
export const playTick = async () => {
  // Light haptic feedback on native devices
  try {
    await Haptics.impact({ style: ImpactStyle.Light });
  } catch {
    // Silently fail on web — haptics only work on native
  }

  // Audio tick
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    const ctx = new AudioContextClass();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(1200, ctx.currentTime); // High, short tick

    gain.gain.setValueAtTime(0.05, ctx.currentTime); // Very quiet
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.08);
  } catch (e) {
    // Silent fail — audio isn't critical
  }
};
