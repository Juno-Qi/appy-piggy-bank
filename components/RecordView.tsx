
import React, { useState, useRef } from 'react';

interface RecordViewProps {
  onSave: (content: string, date: string, imageUrl?: string) => void;
  onCancel: () => void;
}

export const RecordView: React.FC<RecordViewProps> = ({ onSave, onCancel }) => {
  const [content, setContent] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | undefined>(undefined);
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const today = new Date().toISOString().split('T')[0];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
      e.target.value = '';
    }
  };

  const handleSave = () => {
    if (!content.trim()) return;

    setIsSaving(true);

    // Simulate coin animation and delay for effect
    // Simulate coin animation and delay for effect
    setTimeout(() => {
      setShowSuccess(true);
      setTimeout(() => {
        onSave(content, today, selectedImage);
      }, 1500); // Reduced from 3500ms for better UX
    }, 800); // Reduced from 1200ms
  };

  const triggerAlbum = () => {
    fileInputRef.current?.click();
  };

  if (showSuccess) {
    return (
      <div className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-white dark:bg-background-dark p-8 text-center animate-in fade-in duration-500">
        <div className="relative mb-12">
          <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-1 h-20 bg-primary/20"></div>
          <div className="bg-accent-yellow w-16 h-16 rounded-full flex items-center justify-center shadow-xl animate-bounce">
            <span className="material-symbols-outlined text-3xl text-[#b48a00] font-bold">monetization_on</span>
          </div>
          <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 flex gap-1">
            <span className="material-symbols-outlined text-primary animate-ping">favorite</span>
          </div>
        </div>
        <h2 className="text-3xl md:text-4xl font-black text-primary mb-6 animate-in slide-in-from-bottom-4 duration-700 delay-300">存入成功！</h2>
        <p className="max-w-md text-xl md:text-2xl text-[#a15c45] dark:text-gray-300 font-medium leading-relaxed animate-in fade-in duration-1000 delay-700">
          “把你的开心瞬间存起来，它们是抵御未来阴霾的宝贵财富。”
        </p>
        <div className="mt-12 flex items-center gap-2 text-gray-400 text-sm animate-pulse">
          <span className="material-symbols-outlined text-sm">auto_mode</span>
          正在为您放回架子...
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-5xl flex flex-col md:flex-row gap-12 items-start justify-center animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Coin Animation Overlay when saving */}
      {isSaving && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center pointer-events-none">
          <div className="w-12 h-12 bg-accent-yellow rounded-full flex items-center justify-center shadow-2xl absolute top-[20%] animate-[coin-drop_1s_ease-in_forwards]">
            <span className="material-symbols-outlined text-2xl text-[#b48a00]">monetization_on</span>
          </div>
        </div>
      )}

      <div className="flex flex-col gap-8 w-full md:w-1/3">
        <div className="space-y-4">
          <h1 className="text-4xl md:text-5xl font-extrabold text-[#1d100c] dark:text-white leading-[1.1] tracking-tight">
            记录<br />
            <span className="text-primary">此时此刻</span>的喜悦
          </h1>
          <p className="text-[#a15c45] dark:text-gray-400 text-lg leading-relaxed">
            把你的开心瞬间存起来，它们是抵御未来阴霾的宝贵财富。
          </p>
        </div>

        <div className="bg-white dark:bg-[#3d3935] p-6 rounded-xl shadow-lg border border-[#f4eae6] dark:border-[#4d4945]">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-bold text-primary uppercase tracking-widest">存入硬币</span>
            <span className="material-symbols-outlined text-primary">monetization_on</span>
          </div>
          <p className="text-xs text-gray-400 leading-relaxed mb-4">
            存入后，你可以随时在首页回顾这份心情。
          </p>
          <div className="w-full h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
            <div className="h-full bg-primary transition-all duration-1000" style={{ width: content.length > 0 ? '100%' : '0%' }}></div>
          </div>
        </div>
      </div>

      <div className="w-full md:w-2/3 relative">
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-24 h-8 washi-tape z-20 flex items-center justify-center opacity-60">
          <div className="w-full h-px bg-white/20 border-t border-dashed border-white/40"></div>
        </div>
        <div className="bg-sticky-yellow dark:bg-amber-100 p-8 md:p-12 rounded-lg shadow-2xl min-h-[500px] flex flex-col relative overflow-hidden">
          <div className="flex justify-between items-start mb-6">
            <h3 className="text-2xl font-bold text-[#1d100c] mb-1 flex items-center gap-2 font-display">
              <span className="material-symbols-outlined">auto_awesome</span>
              心情速记
            </h3>
          </div>

          <div className="flex-1 flex flex-col">
            <textarea
              disabled={isSaving}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full flex-1 bg-transparent border-none focus:ring-0 text-[#1d100c] text-xl md:text-2xl font-medium leading-[1.8] placeholder:text-[#a15c45]/40 resize-none py-2"
              placeholder="此刻发生了什么开心的事？"
              style={{
                backgroundImage: 'linear-gradient(transparent, transparent 44px, #a15c4520 44px)',
                backgroundSize: '100% 45px'
              }}
            />

            <div className="mt-4 flex flex-wrap gap-4">
              {selectedImage && (
                <div className="relative group w-40 h-40">
                  <img src={selectedImage} className="w-full h-full object-cover rounded-xl shadow-md border-4 border-white rotate-2 hover:rotate-0 transition-transform" alt="joy moment" />
                  {!isSaving && (
                    <button
                      onClick={() => setSelectedImage(undefined)}
                      className="absolute -top-3 -right-3 bg-red-500 text-white rounded-full p-1.5 shadow-lg hover:scale-110 transition-transform z-10"
                    >
                      <span className="material-symbols-outlined text-sm">close</span>
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-[#a15c45]/10 flex flex-wrap items-center justify-between gap-6">
            <div className="flex gap-4 items-center">
              <button
                disabled={isSaving}
                onClick={onCancel}
                className="text-[#a15c45] font-bold hover:underline px-2 disabled:opacity-30"
              >
                取消
              </button>

              <div className="flex gap-2">
                <button
                  disabled={isSaving}
                  onClick={triggerAlbum}
                  className="flex items-center gap-2 text-primary font-bold hover:bg-white/50 px-4 py-2 rounded-full transition-all border border-primary/20 disabled:opacity-30"
                >
                  <span className="material-symbols-outlined text-xl">photo_library</span>
                  <span className="text-sm">上传照片</span>
                </button>
              </div>

              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                onChange={handleFileChange}
              />
            </div>

            <button
              disabled={!content.trim() || isSaving}
              onClick={handleSave}
              className={`bg-primary hover:bg-[#ff7b52] disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 text-white px-10 py-4 rounded-xl font-bold text-lg shadow-lg shadow-primary/30 flex items-center gap-3 transition-all ${isSaving ? 'animate-pulse scale-95' : ''}`}
            >
              <span>{isSaving ? '正在存入...' : '存入储蓄罐'}</span>
              <span className={`material-symbols-outlined ${isSaving ? 'animate-spin' : ''}`}>{isSaving ? 'sync' : 'publish'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
