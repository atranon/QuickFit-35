
import { GoogleGenAI, Modality } from "@google/genai";
import { decodeBase64, decodeAudioData } from "../utils/audioUtils";

const getAI = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key missing");
  }
  return new GoogleGenAI({ apiKey });
};

export const generateFormDescription = async (
  exName: string,
  exCategory: string
): Promise<string> => {
  const ai = getAI();
  const systemPrompt = "Act as an elite strength and conditioning coach. Provide a ultra-concise (max 40 words) technical breakdown of form cues and muscle recruitment for the exercise.";
  const userQuery = `Technique check: ${exName} (${exCategory})`;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: userQuery,
    config: {
      systemInstruction: systemPrompt,
    },
  });

  return response.text || "Form data unavailable.";
};

export const generateWorkoutRoutine = async (
  dayTitle: string,
  exerciseNames: string[]
): Promise<string> => {
  const ai = getAI();
  const systemPrompt = "Act as a professional performance coach. Design a specific 3-minute dynamic warm-up and a 2-minute specific cool-down for the provided exercise list. Focus on joint lubrication and CNS priming. Use Markdown.";
  const userQuery = `Session: "${dayTitle}". Exercises: ${exerciseNames.join(', ')}. Generate prep and recovery.`;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: userQuery,
    config: {
      systemInstruction: systemPrompt,
    },
  });

  return response.text || "Routine generation failed.";
};

export const generateSpeech = async (text: string): Promise<AudioBuffer> => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash-preview-tts",
    contents: `Coach Voice: ${text}`,
    config: {
      responseModalities: [Modality.AUDIO],
      speechConfig: {
        voiceConfig: {
          prebuiltVoiceConfig: { voiceName: "Kore" },
        },
      },
    },
  });

  const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
  if (!base64Audio) {
    throw new Error("No audio data returned");
  }

  const bytes = decodeBase64(base64Audio);
  const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
  const ctx = new AudioContextClass({ sampleRate: 24000 });
  
  return decodeAudioData(bytes, ctx, 24000, 1);
};
