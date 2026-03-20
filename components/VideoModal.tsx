import React from 'react';
import { X } from 'lucide-react';

interface VideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  videoUrl: string;
  exerciseName: string;
}

const VideoModal: React.FC<VideoModalProps> = ({ isOpen, onClose, videoUrl, exerciseName }) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-slate-900/95 backdrop-blur-md z-[110] flex items-center justify-center p-4 animate-in fade-in duration-300"
      onClick={onClose}
    >
      <div
        className="w-full max-w-4xl bg-slate-800 border-2 border-slate-700 rounded-2xl shadow-2xl overflow-hidden relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center p-4 bg-slate-900/50 border-b border-slate-700">
          <div>
            <h3 className="text-lg font-black text-white uppercase tracking-tight">{exerciseName}</h3>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Video Demos</p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition p-2 hover:bg-slate-700 rounded-lg"
          >
            <X size={20} />
          </button>
        </div>

        {/* Video iframe */}
        <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
          <iframe
            src={videoUrl}
            className="absolute top-0 left-0 w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            title={`${exerciseName} demo video`}
          />
        </div>

        {/* Footer hint */}
        <div className="p-3 bg-slate-900/30 border-t border-slate-700">
          <p className="text-[9px] text-slate-500 text-center font-medium">
            Click outside or press ESC to close • Click any video to watch the full demo
          </p>
        </div>
      </div>
    </div>
  );
};

export default VideoModal;
