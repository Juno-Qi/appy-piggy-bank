
import React from 'react';
import { JoyMoment } from '../types';

interface HomeViewProps {
  moments: JoyMoment[];
  onRecord: () => void;
  onRandom: () => void;
  onDelete: (id: string) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({ moments, onRecord, onRandom, onDelete }) => {
  return (
    <div className="max-w-[1000px] w-full flex flex-col items-center z-10">
      <div className="text-center mb-12 animate-in fade-in slide-in-from-top-4 duration-700">
        <h1 className="text-[#1d100c] dark:text-white tracking-tight text-[42px] font-extrabold leading-tight pb-2 font-display">捕捉生活的小确幸</h1>
        <div className="inline-flex items-center gap-2 bg-accent-yellow px-4 py-1.5 rounded-full shadow-sm">
          <span className="material-symbols-outlined text-sm font-bold">stars</span>
          <p className="text-[#1d100c] text-sm font-bold leading-normal">已有 {moments.length} 份快乐存入</p>
        </div>
      </div>

      <div className="relative group cursor-pointer transition-transform hover:scale-105 active:scale-95 duration-300 mb-12 animate-float" onClick={onRandom}>
        <div className="absolute inset-0 bg-primary/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="relative w-64 h-64 md:w-80 md:h-80 bg-gradient-to-br from-pink-100 to-primary/30 dark:from-pink-900/40 dark:to-primary/20 rounded-full flex flex-col items-center justify-center shadow-[inset_-10px_-10px_20px_rgba(0,0,0,0.05),20px_20px_40px_rgba(255,144,107,0.15)] border-8 border-white dark:border-gray-700/50">
          <div className="absolute -top-4 left-10 w-16 h-16 bg-pink-200 dark:bg-pink-800 rounded-tl-[100px] rounded-br-3xl -rotate-12 border-b-4 border-pink-300"></div>
          <div className="absolute -top-4 right-10 w-16 h-16 bg-pink-200 dark:bg-pink-800 rounded-tr-[100px] rounded-bl-3xl rotate-12 border-b-4 border-pink-300"></div>
          <div className="w-20 h-4 bg-black/10 rounded-full mb-8 shadow-inner overflow-hidden flex items-center justify-center">
             <div className="w-10 h-1 bg-white/30 rounded-full"></div>
          </div>
          <div className="flex gap-12 mb-4">
            <div className="w-4 h-4 bg-[#1d100c] dark:bg-white rounded-full"></div>
            <div className="w-4 h-4 bg-[#1d100c] dark:bg-white rounded-full"></div>
          </div>
          <div className="relative group/nose">
            <div className="w-24 h-16 bg-primary rounded-[40px] shadow-lg border-b-8 border-[#e87a55] flex items-center justify-center gap-3 transition-all">
              <div className="w-3 h-5 bg-[#1d100c]/20 rounded-full"></div>
              <div className="w-3 h-5 bg-[#1d100c]/20 rounded-full"></div>
            </div>
            <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 opacity-0 group-hover/nose:opacity-100 transition-opacity whitespace-nowrap bg-background-dark text-white text-[10px] px-2 py-1 rounded">
              点我，拆开一个惊喜
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-center justify-center w-full px-4 mb-20">
        <button 
          onClick={onRecord}
          className="group flex min-w-[200px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-14 px-8 bg-primary text-white text-lg font-bold shadow-xl shadow-primary/30 transition-all hover:brightness-110 active:scale-95"
        >
          <span className="material-symbols-outlined mr-2 transition-transform group-hover:rotate-12">add_circle</span>
          <span>存入一份快乐</span>
        </button>
        <button 
          onClick={onRandom}
          className="flex min-w-[200px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-14 px-8 border-2 border-[#1d100c]/10 dark:border-white/10 hover:bg-white dark:hover:bg-gray-800 text-[#1d100c] dark:text-white text-lg font-bold transition-all shadow-sm"
        >
          <span className="material-symbols-outlined mr-2">shuffle</span>
          <span>随机回顾</span>
        </button>
      </div>
    </div>
  );
};
