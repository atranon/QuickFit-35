import React from 'react';
import { X, Play, ExternalLink } from 'lucide-react';

interface VideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  videoUrl: string;
  exerciseName: string;
}

const VideoModal: React.FC<VideoModalProps> = ({ isOpen, onClose, videoUrl, exerciseName }) => {
  if (!isOpen) return null;

  const handleOpenVideo = () => {
    window.open(videoUrl, '_blank', 'noopener,noreferrer');
    onClose(); // Close modal after opening video
  };

  return (
    <div
      className="fixed inset-0 bg-slate-900/95 backdrop-blur-md z-[110] flex items-center justify-center p-4 animate-in fade-in duration-300"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg bg-gradient-to-b from-slate-800 to-slate-900 border-2 border-red-500/30 rounded-3xl shadow-2xl overflow-hidden relative p-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white transition p-2 hover:bg-slate-700 rounded-lg"
        >
          <X size={20} />
        </button>

        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div className="p-6 bg-red-600/20 rounded-3xl">
            <Play size={48} className="text-red-400" fill="currentColor" />
          </div>
        </div>

        {/* Content */}
        <div className="text-center mb-8">
          <h3 className="text-2xl font-black text-white mb-2 uppercase tracking-tight leading-tight">
            {exerciseName}
          </h3>
          <p className="text-sm text-slate-400 font-medium leading-relaxed">
            Watch multiple demo videos on YouTube to see proper form and technique from different angles.
          </p>
        </div>

        {/* Main action button */}
        <button
          onClick={handleOpenVideo}
          className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-black py-5 rounded-2xl flex items-center justify-center gap-3 transition shadow-xl shadow-red-500/20 active:scale-[0.98] uppercase tracking-widest text-sm mb-4"
        >
          <Play size={20} fill="currentColor" />
          Watch Demo Videos
          <ExternalLink size={16} className="opacity-60" />
        </button>

        {/* Hint */}
        <p className="text-[10px] text-slate-600 text-center font-medium">
          Opens YouTube search results in a new tab • Click outside to close
        </p>
      </div>
    </div>
  );
};

export default VideoModal;
