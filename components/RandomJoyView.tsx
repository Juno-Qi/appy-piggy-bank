
import React, { useState, useEffect } from 'react';
import { JoyMoment } from '../types';

interface RandomJoyViewProps {
  moments: JoyMoment[];
  onBack: () => void;
}

export const RandomJoyView: React.FC<RandomJoyViewProps> = ({ moments, onBack }) => {
  const [current, setCurrent] = useState<JoyMoment | null>(null);
  const [isZoomed, setIsZoomed] = useState(false);

  const pickRandom = () => {
    if (moments.length === 0) return;
    const randomIndex = Math.floor(Math.random() * moments.length);
    setCurrent(moments[randomIndex]);
    setIsZoomed(false);
  };

  useEffect(() => {
    pickRandom();
  }, [moments]);

  if (!current) {
    return (
      <div className="text-center">
        <p className="text-xl">储蓄罐还是空的，快去存一份快乐吧！</p>
        <button onClick={onBack} className="mt-4 text-primary font-bold underline">返回首页</button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl flex flex-col items-center justify-center gap-12 animate-in zoom-in-95 duration-500">
      <h1 className="text-[#1d100c] dark:text-white tracking-tight text-3xl font-extrabold leading-tight text-center">
        还记得这个快乐瞬间吗？
      </h1>
      
      <div className="flex flex-col md:flex-row items-center justify-center gap-12 w-full">
        <div className="relative shrink-0">
          <div className="w-48 h-48 bg-primary/10 dark:bg-primary/5 rounded-full relative flex items-center justify-center shadow-inner">
            <div className="absolute -top-4 w-12 h-2 bg-primary/20 rounded-full blur-sm"></div>
            <div className="text-primary/60">
              <span className="material-symbols-outlined text-9xl">savings</span>
            </div>
          </div>
          <div className="absolute -bottom-6 -right-6 flex flex-col items-center gap-0 bg-white/90 dark:bg-[#3d3935]/90 px-5 py-2 rounded-2xl border border-[#ead4cd] dark:border-[#4d4945] shadow-lg backdrop-blur-sm">
            <p className="text-primary text-2xl font-black">{moments.length}</p>
            <p className="text-[#1d100c] dark:text-[#f4eae6] text-[10px] font-bold uppercase tracking-tighter">快乐瞬间</p>
          </div>
        </div>

        <div className="relative w-full max-w-md">
          <div className="absolute -top-8 left-1/2 -translate-x-1/2 w-full flex justify-between px-10 pointer-events-none">
            <span className="text-primary text-2xl rotate-45">✦</span>
            <span className="text-accent-gold text-xl -rotate-12">●</span>
            <span className="text-accent-mint text-2xl rotate-12">▲</span>
          </div>
          <div className="bg-white dark:bg-[#3d3935] p-10 rounded-lg shadow-[0_20px_50px_rgba(255,144,107,0.15)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.3)] border-t-8 border-primary relative overflow-hidden min-h-[280px] flex flex-col">
            <div className="absolute top-0 right-0 p-4 opacity-5">
              <span className="material-symbols-outlined text-6xl">format_quote</span>
            </div>
            <div className="flex flex-col items-center text-center gap-4 flex-1 justify-center">
              <span className="text-primary/80 text-[10px] font-bold uppercase tracking-[0.2em] bg-primary/10 px-3 py-1 rounded-full">✨ RANDOM JOY</span>
              
              <div className="flex flex-col md:flex-row items-center gap-6 w-full">
                {current.imageUrl && (
                  <div 
                    className="relative cursor-zoom-in group shrink-0"
                    onClick={() => setIsZoomed(true)}
                  >
                    <img 
                      src={current.imageUrl} 
                      className="w-24 h-24 object-cover rounded-xl shadow-md border-2 border-white dark:border-gray-600 rotate-[-3deg] group-hover:rotate-0 transition-transform" 
                      alt="Moment photo"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 rounded-xl transition-colors flex items-center justify-center">
                      <span className="material-symbols-outlined text-white opacity-0 group-hover:opacity-100 transition-opacity">zoom_in</span>
                    </div>
                  </div>
                )}
                
                <div className="flex-1 text-center md:text-left">
                  <p className="text-[#1d100c] dark:text-white text-xl md:text-2xl font-bold leading-relaxed">
                    {current.content}
                  </p>
                </div>
              </div>

              <div className="w-12 h-0.5 bg-primary/20 rounded-full my-2"></div>
              <div className="flex flex-col items-center">
                <p className="text-[#a15c45] dark:text-[#c4a49a] text-sm font-medium flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-xs">calendar_today</span>
                  {current.date}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-row gap-4 w-full max-w-md mt-4">
        <button 
          onClick={pickRandom}
          className="flex-1 flex items-center justify-center gap-2 rounded-xl h-14 px-6 bg-primary text-white text-lg font-extrabold hover:shadow-lg hover:translate-y-[-2px] transition-all"
        >
          <span className="material-symbols-outlined">refresh</span>
          <span>再拆一个</span>
        </button>
        <button 
          onClick={onBack}
          className="flex-1 flex items-center justify-center gap-2 rounded-xl h-14 px-6 bg-accent-mint text-white text-lg font-extrabold hover:shadow-lg hover:translate-y-[-2px] transition-all"
        >
          <span className="material-symbols-outlined">undo</span>
          <span>返回储蓄</span>
        </button>
      </div>

      {/* Zoom Modal */}
      {isZoomed && current.imageUrl && (
        <div 
          className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-4 cursor-zoom-out animate-in fade-in duration-300"
          onClick={() => setIsZoomed(false)}
        >
          <button className="absolute top-6 right-6 text-white p-2">
            <span className="material-symbols-outlined text-3xl">close</span>
          </button>
          <img 
            src={current.imageUrl} 
            className="max-w-full max-h-full object-contain rounded-lg shadow-2xl animate-in zoom-in-95 duration-300"
            alt="Full size joy moment"
          />
        </div>
      )}
    </div>
  );
};
