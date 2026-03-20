import React, { useState } from 'react';
import { X, Play, ExternalLink, AlertTriangle, Target } from 'lucide-react';
import { ExerciseDemo } from '../types';

interface ExerciseDemoModalProps {
  isOpen: boolean;
  onClose: () => void;
  exerciseName: string;
  demo: ExerciseDemo | null;
  fallbackSearchUrl: string;
}

/*
  THE VIDEO TIER SYSTEM:

  This modal renders the best available video source:
  1. selfHostedUrl → <video> or <img> tag (your own content)
  2. youtubeVideoId → YouTube iframe embed (in-app)
  3. fallbackSearchUrl → link that opens YouTube in new tab

  The component checks in that order and renders the first
  available option. This means when you eventually record
  your own GIFs and add selfHostedUrl to an exercise,
  it automatically upgrades without changing this component.
*/

const ExerciseDemoModal: React.FC<ExerciseDemoModalProps> = ({ isOpen, onClose, exerciseName, demo, fallbackSearchUrl }) => {
  const [embedError, setEmbedError] = useState(false);

  if (!isOpen) return null;

  // Determine video source
  const hasSelfHosted = !!demo?.selfHostedUrl;
  const hasYouTubeId = !!demo?.youtubeVideoId && !embedError;
  const isSelfHostedGif = hasSelfHosted && demo!.selfHostedUrl!.endsWith('.gif');
  const isSelfHostedVideo = hasSelfHosted && !isSelfHostedGif;

  return (
    <div className="fixed inset-0 bg-slate-900/95 backdrop-blur-md z-[110] flex flex-col items-center justify-start p-0 animate-in fade-in duration-300 overflow-y-auto">
      <div className="max-w-md w-full min-h-full">

        {/* Header */}
        <div className="sticky top-0 z-10 bg-slate-900/90 backdrop-blur border-b border-slate-800 px-4 py-3 flex justify-between items-center">
          <div className="min-w-0 flex-1 mr-3">
            <h3 className="text-sm font-black text-white uppercase italic truncate">{exerciseName}</h3>
            <div className="flex items-center gap-2 mt-0.5">
              {demo?.muscles && <span className="text-[9px] text-slate-500 font-bold">{demo.muscles}</span>}
              {demo?.isGolfSpecific && (
                <span className="text-[7px] font-black bg-emerald-500/20 text-emerald-400 px-1.5 py-0.5 rounded uppercase tracking-tighter">Golf</span>
              )}
            </div>
          </div>
          <button onClick={() => { onClose(); setEmbedError(false); }} className="bg-slate-800 p-2 rounded-lg text-slate-400 hover:text-white transition shrink-0">
            <X size={20} />
          </button>
        </div>

        {/* Video Player Area */}
        <div className="px-4 pt-4">
          <div className="bg-slate-800 rounded-2xl overflow-hidden shadow-2xl border border-slate-700 mb-6">
            {hasSelfHosted ? (
              /* TIER 1: Self-hosted content */
              isSelfHostedGif ? (
                <img
                  src={demo!.selfHostedUrl}
                  alt={`${exerciseName} demo`}
                  className="w-full aspect-video object-cover"
                  loading="lazy"
                />
              ) : (
                <video
                  src={demo!.selfHostedUrl}
                  className="w-full aspect-video object-cover"
                  autoPlay
                  loop
                  muted
                  playsInline
                  controls
                />
              )
            ) : hasYouTubeId ? (
              /* TIER 2: YouTube embed */
              <div className="relative w-full aspect-video">
                <iframe
                  src={`https://www.youtube.com/embed/${demo!.youtubeVideoId}?rel=0&modestbranding=1&playsinline=1`}
                  title={`${exerciseName} demo`}
                  className="absolute inset-0 w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  onError={() => setEmbedError(true)}
                />
              </div>
            ) : (
              /* TIER 3: No embed available — show link */
              <a
                href={demo?.videoSearchUrl || fallbackSearchUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full aspect-video bg-slate-900 flex flex-col items-center justify-center gap-3 hover:bg-slate-800 transition group"
              >
                <div className="p-4 bg-red-600/20 rounded-2xl group-hover:bg-red-600/30 transition">
                  <Play size={32} className="text-red-400" fill="currentColor" />
                </div>
                <div className="text-center">
                  <p className="text-sm font-bold text-slate-300">Watch Demo on YouTube</p>
                  <p className="text-[10px] text-slate-600 flex items-center gap-1 justify-center mt-1">
                    Opens in new tab <ExternalLink size={10} />
                  </p>
                </div>
              </a>
            )}

            {/* Embed error fallback */}
            {embedError && (
              <a
                href={demo?.videoSearchUrl || fallbackSearchUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full aspect-video bg-slate-900 flex flex-col items-center justify-center gap-3"
              >
                <AlertTriangle size={24} className="text-amber-400" />
                <p className="text-xs text-slate-400">Video embed unavailable</p>
                <p className="text-xs text-blue-400 underline flex items-center gap-1">Open on YouTube <ExternalLink size={10} /></p>
              </a>
            )}
          </div>

          {/* Form Cue — big and prominent */}
          {demo?.formCue && (
            <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-4 mb-4">
              <p className="text-[9px] font-black text-emerald-400/70 uppercase tracking-widest mb-1">Key Cue</p>
              <p className="text-sm text-white font-bold italic leading-snug">{demo.formCue}</p>
            </div>
          )}

          {/* Coaching Points */}
          {demo?.coachingPoints && demo.coachingPoints.length > 0 && (
            <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4 mb-4">
              <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-3">Coaching Points</p>
              <div className="space-y-3">
                {demo.coachingPoints.map((point, i) => (
                  <div key={i} className="flex gap-3 items-start">
                    <span className="text-[9px] font-black text-slate-600 w-4 text-right shrink-0 mt-0.5">{i + 1}</span>
                    <p className="text-xs text-slate-300 leading-relaxed">{point}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* YouTube fallback link when using embed */}
          {(hasSelfHosted || hasYouTubeId) && (
            <a
              href={demo?.videoSearchUrl || fallbackSearchUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 text-[10px] text-slate-600 hover:text-slate-400 transition py-3 mb-6"
            >
              <ExternalLink size={10} /> Find more demos on YouTube
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExerciseDemoModal;
