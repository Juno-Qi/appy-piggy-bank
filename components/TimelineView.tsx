
import React, { useState } from 'react';
import { JoyMoment } from '../types';

interface TimelineViewProps {
  moments: JoyMoment[];
  onBack: () => void;
  onDelete: (id: string) => void;
}

export const TimelineView: React.FC<TimelineViewProps> = ({ moments, onBack, onDelete }) => {
  const sortedMoments = [...moments].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  return (
    <div className="w-full max-w-2xl px-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between mb-10">
        <h2 className="text-3xl font-black text-[#1d100c] dark:text-white flex items-center gap-3">
          <span className="material-symbols-outlined text-primary text-4xl">history_edu</span>
          快乐时间轴
        </h2>
        <button
          onClick={onBack}
          className="text-sm font-bold text-gray-400 hover:text-primary transition-colors flex items-center gap-1"
        >
          <span className="material-symbols-outlined text-sm">arrow_back</span>
          返回
        </button>
      </div>

      {sortedMoments.length === 0 ? (
        <div className="text-center py-20 bg-white/50 dark:bg-gray-800/50 rounded-3xl border border-dashed border-gray-200">
          <p className="text-gray-400">目前还没有快乐记录哦，快去存一份吧！</p>
        </div>
      ) : (
        <div className="relative border-l-2 border-primary/20 ml-4 py-4 space-y-12">
          {sortedMoments.map((moment) => (
            <div key={moment.id} className="relative pl-10 group">
              {/* Timeline Dot */}
              <div className="absolute left-[-9px] top-0 size-4 rounded-full bg-primary ring-4 ring-white dark:ring-background-dark group-hover:scale-125 transition-transform"></div>

              {/* Date Label */}
              <div className="mb-2">
                <span className="text-xs font-black text-primary bg-primary/10 px-3 py-1 rounded-full uppercase tracking-widest">
                  {moment.date}
                </span>
              </div>

              {/* Card */}
              <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow relative overflow-hidden">
                <button
                  onClick={() => onDelete(moment.id)}
                  className="absolute top-4 right-4 text-gray-300 hover:text-red-500 transition-colors"
                >
                  <span className="material-symbols-outlined text-lg">delete</span>
                </button>

                <div className="flex flex-col md:flex-row gap-4 items-start">
                  {moment.imageUrl && (
                    <img
                      src={moment.imageUrl}
                      className="w-full md:w-32 h-32 object-cover rounded-xl shadow-inner border border-gray-50 shrink-0 cursor-zoom-in hover:brightness-95 transition-all"
                      alt="Memory"
                      onClick={() => setSelectedImage(moment.imageUrl!)}
                    />
                  )}
                  <div className="flex-1">
                    <p className="text-lg text-[#1d100c] dark:text-white font-medium leading-relaxed">
                      {moment.content}
                    </p>
                  </div>
                </div>

                {/* Visual Flair */}
                <div className="absolute bottom-0 right-0 p-2 opacity-[0.03] pointer-events-none">
                  <span className="material-symbols-outlined text-6xl">favorite</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-20 text-center text-gray-400 text-sm pb-10">
        时间会流逝，但这些快乐永远属于你。
      </div>

      {/* Image Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-[200] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-4xl w-full max-h-[90vh] flex flex-col items-center">
            <button
              className="absolute -top-12 right-0 text-white hover:text-gray-300 transition-colors"
              onClick={() => setSelectedImage(null)}
            >
              <span className="material-symbols-outlined text-4xl">close</span>
            </button>
            <img
              src={selectedImage}
              alt="Full size memory"
              className="w-full h-full object-contain rounded-lg shadow-2xl animate-in zoom-in-95 duration-300"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      )}
    </div>
  );
};
