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
  const systemPrompt = "Act as a concise strength and conditioning coach. Provide a very brief (max 50 words) description of the proper form and primary muscle focus for the given exercise.";
  const userQuery = `Provide the form and muscle focus for: ${exName} (${exCategory})`;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: userQuery,
    config: {
      systemInstruction: systemPrompt,
    },
  });

  return response.text || "No description available.";
};

export const generateWorkoutRoutine = async (
  dayTitle: string,
  exerciseNames: string[]
): Promise<string> => {
  const ai = getAI();
  const systemPrompt = "Act as a professional fitness coach specializing in hypertrophy. Generate a specific 5-minute dynamic warm-up and a 5-minute static cool-down tailored to the provided list of exercises. Format using Markdown.";
  const userQuery = `The workout is titled "${dayTitle}" and includes: ${exerciseNames.join(', ')}. Generate the warm-up and cool-down.`;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: userQuery,
    config: {
      systemInstruction: systemPrompt,
    },
  });

  return response.text || "No routine generated.";
};

export const generateSpeech = async (text: string): Promise<AudioBuffer> => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash-preview-tts",
    contents: `Say in a professional and motivational tone: ${text}`,
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