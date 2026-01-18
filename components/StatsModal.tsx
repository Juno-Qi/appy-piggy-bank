
import React from 'react';
import { JoyMoment } from '../types';

interface StatsModalProps {
  isOpen: boolean;
  onClose: () => void;
  moments: JoyMoment[];
}

export const StatsModal: React.FC<StatsModalProps> = ({ isOpen, onClose, moments }) => {
  if (!isOpen) return null;

  const colorCounts = moments.reduce((acc, m) => {
    acc[m.color] = (acc[m.color] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const total = moments.length;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white dark:bg-gray-800 w-full max-w-md rounded-3xl p-8 shadow-2xl relative">
        <button onClick={onClose} className="absolute top-6 right-6 text-gray-400 hover:text-gray-600">
          <span className="material-symbols-outlined">close</span>
        </button>
        
        <h3 className="text-2xl font-black mb-6 flex items-center gap-2">
          <span className="material-symbols-outlined text-primary">analytics</span>
          快乐数据报告
        </h3>

        <div className="space-y-6">
          <div className="bg-primary/5 rounded-2xl p-6 text-center">
            <p className="text-sm text-primary font-bold uppercase tracking-widest mb-1">累计幸福值</p>
            <p className="text-5xl font-black text-primary">{total}</p>
          </div>

          <div className="space-y-4">
            <p className="text-sm font-bold text-gray-500">心情色彩分布</p>
            {['primary', 'yellow', 'mint', 'blue'].map(color => {
              const count = colorCounts[color] || 0;
              const percent = total > 0 ? (count / total) * 100 : 0;
              const colorHex = color === 'primary' ? '#ff906b' : color === 'yellow' ? '#FDDD8C' : color === 'mint' ? '#6BBDA2' : '#e0f2fe';
              
              return (
                <div key={color} className="space-y-1">
                  <div className="flex justify-between text-xs font-bold">
                    <span className="capitalize">{color === 'primary' ? '核心快乐' : color}</span>
                    <span>{count} 次 ({percent.toFixed(0)}%)</span>
                  </div>
                  <div className="w-full h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div 
                      className="h-full transition-all duration-1000" 
                      style={{ width: `${percent}%`, backgroundColor: colorHex }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>

          <p className="text-xs text-center text-gray-400 italic">
            “快乐是会累加的，每一份存入都在发光。”
          </p>
        </div>
      </div>
    </div>
  );
};
