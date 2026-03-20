import React, { useState, useRef, useEffect } from 'react';
import { X, Volume2, Loader2, StopCircle, Play, ExternalLink } from 'lucide-react';
import { generateSpeech } from '../services/geminiService';

interface GeminiModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  content: React.ReactNode;
  textContent?: string;
  loading: boolean;
  videoUrl?: string;          // YouTube search URL for this exercise
  isGolfSpecific?: boolean;   // flag for golf-specific badge
  onOpenVideo?: () => void;   // Callback to open video modal
}

const GeminiModal: React.FC<GeminiModalProps> = ({ isOpen, onClose, title, content, textContent, loading, videoUrl, isGolfSpecific, onOpenVideo }) => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isGeneratingAudio, setIsGeneratingAudio] = useState(false);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const sourceRef = useRef<AudioBufferSourceNode | null>(null);

  useEffect(() => {
    if (!isOpen) {
      stopAudio();
    }
  }, [isOpen]);

  const stopAudio = () => {
    if (sourceRef.current) {
      try {
        sourceRef.current.stop();
      } catch (e) { /* ignore if already stopped */ }
      sourceRef.current = null;
    }
    setIsSpeaking(false);
    setIsGeneratingAudio(false);
  };

  const handleSpeak = async () => {
    if (isSpeaking) {
      stopAudio();
      return;
    }

    if (!textContent) return;

    setIsGeneratingAudio(true);
    try {
      const audioBuffer = await generateSpeech(textContent);

      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!audioCtxRef.current) {
        audioCtxRef.current = new AudioContextClass();
      }

      const ctx = audioCtxRef.current;
      const source = ctx.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(ctx.destination);
      source.onended = () => setIsSpeaking(false);

      sourceRef.current = source;
      source.start();
      setIsSpeaking(true);
    } catch (e) {
      console.error("TTS failed", e);
      alert("Failed to generate speech.");
    } finally {
      setIsGeneratingAudio(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
      <div className="bg-slate-800 border border-slate-600 p-6 rounded-xl shadow-2xl max-w-md w-full relative">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-xl font-bold text-blue-400">{title}</h3>
            {isGolfSpecific && (
              <span className="inline-flex items-center gap-1 text-[8px] font-black bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded mt-1 uppercase tracking-widest">
                Golf-Specific Movement
              </span>
            )}
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition">
            <X size={20} />
          </button>
        </div>

        {/* Video Demo Button — PRIMARY action, shown first */}
        {videoUrl && onOpenVideo && (
          <button
            onClick={onOpenVideo}
            className="w-full mb-4 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center gap-3 transition shadow-lg shadow-red-500/20 active:scale-[0.98]"
          >
            <Play size={18} fill="currentColor" />
            Watch Demo Video
          </button>
        )}

        {/* AI-Generated Form Tips */}
        <div className="text-sm text-slate-300 space-y-3 max-h-80 overflow-y-auto mb-4 p-2 bg-slate-900/30 rounded-lg">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-8 text-slate-400">
              <Loader2 className="animate-spin mb-2" size={32} />
              <p>Consulting Gemini...</p>
            </div>
          ) : (
            content
          )}
        </div>

        <div className="flex justify-end gap-2">
           {textContent && !loading && (
            <button
              onClick={handleSpeak}
              disabled={isGeneratingAudio}
              className="bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white font-bold px-4 py-2 rounded-lg text-sm transition flex items-center gap-2"
            >
              {isGeneratingAudio ? (
                <><Loader2 className="animate-spin" size={16} /> Generating Audio...</>
              ) : isSpeaking ? (
                 <><StopCircle size={16} /> Stop</>
              ) : (
                 <><Volume2 size={16} /> Speak</>
              )}
            </button>
          )}
          <button
            onClick={onClose}
            className="bg-slate-700 hover:bg-slate-600 text-white font-bold px-4 py-2 rounded-lg text-sm transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default GeminiModal;
