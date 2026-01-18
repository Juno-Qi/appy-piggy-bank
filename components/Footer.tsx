
import React from 'react';

interface FooterProps {
  count: number;
}

export const Footer: React.FC<FooterProps> = ({ count }) => {
  return (
    <footer className="px-6 md:px-20 py-8 flex flex-col md:flex-row justify-between items-center gap-4 bg-white/30 dark:bg-black/10 mt-auto">
      <div className="flex items-center gap-6">
        <div className="flex flex-col">
          <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">累计存入</span>
          <span className="text-xl font-display font-bold">{count} 份</span>
        </div>
        <div className="w-[1px] h-8 bg-gray-200 dark:bg-gray-700"></div>
        <div className="flex flex-col">
          <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">幸福指数</span>
          <div className="flex items-center gap-1">
            <span className="material-symbols-outlined text-accent-yellow text-sm fill-current">star</span>
            <span className="material-symbols-outlined text-accent-yellow text-sm fill-current">star</span>
            <span className="material-symbols-outlined text-accent-yellow text-sm fill-current">star</span>
            <span className="material-symbols-outlined text-accent-yellow text-sm fill-current">star</span>
            <span className="material-symbols-outlined text-accent-yellow text-sm fill-current">star</span>
          </div>
        </div>
      </div>
      <div className="flex flex-col items-center md:items-end gap-1">
        <div className="flex gap-4 opacity-30 mb-1">
          <span className="material-symbols-outlined text-lg">sentiment_very_satisfied</span>
          <span className="material-symbols-outlined text-lg">auto_fix_high</span>
          <span className="material-symbols-outlined text-lg">sunny</span>
        </div>
        <p className="text-xs text-gray-400">© 2026 快乐储蓄罐 - 治愈你的每一天</p>
      </div>
    </footer>
  );
};
