import React, { useState, useRef } from 'react';
import { uploadAvatar } from '../lib/storageService';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  userName: string;
  avatarUrl?: string;
  onUpdateName: (name: string) => void;
  onUpdateAvatar: (url: string) => void;
  onClearAll: () => void;
}


export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  userName,
  avatarUrl,
  onUpdateName,
  onUpdateAvatar,
  onClearAll
}) => {
  const [nameInput, setNameInput] = useState(userName);
  const [showConfirm, setShowConfirm] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      const url = await uploadAvatar(file);
      onUpdateAvatar(url);
    } catch (error) {
      console.error('Error uploading avatar:', error);
      alert(`上传头像失败: ${(error as Error).message || '请检查是否已正确配置数据库'}`);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in zoom-in-95 duration-200">
      <div className="bg-white dark:bg-gray-800 w-full max-w-sm rounded-3xl p-8 shadow-2xl overflow-hidden">
        <h3 className="text-2xl font-black mb-8 flex items-center gap-2">
          <span className="material-symbols-outlined text-gray-400">settings</span>
          罐子设置
        </h3>

        <div className="space-y-8">

          {/* Avatar Section */}
          <div className="flex flex-col items-center gap-4">
            <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
              <div
                className="size-24 rounded-full bg-gray-100 dark:bg-gray-700 bg-cover bg-center border-4 border-white dark:border-gray-600 shadow-lg transition-transform group-hover:scale-105"
                style={{ backgroundImage: avatarUrl ? `url("${avatarUrl}")` : undefined }}
              >
                {!avatarUrl && (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    <span className="material-symbols-outlined text-4xl">person</span>
                  </div>
                )}
                {uploading && (
                  <div className="absolute inset-0 bg-black/30 rounded-full flex items-center justify-center backdrop-blur-sm">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                  </div>
                )}
              </div>
              <div className="absolute bottom-0 right-0 bg-primary text-white p-2 rounded-full shadow-md group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-sm">edit</span>
              </div>
            </div>
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept="image/*"
              onChange={handleFileChange}
            />
            <p className="text-xs text-gray-400">点击头像更换</p>
          </div>

          <div className="space-y-3">
            <label className="text-sm font-bold text-gray-500 flex items-center gap-2">
              <span className="material-symbols-outlined text-sm">edit</span>
              修改昵称
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                className="flex-1 bg-gray-50 dark:bg-gray-700 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 ring-primary"
              />
              <button
                onClick={() => onUpdateName(nameInput)}
                className="bg-primary text-white text-xs font-bold px-4 rounded-xl hover:brightness-110 transition-all"
              >
                保存
              </button>
            </div>
          </div>

          <div className="pt-6 border-t border-gray-100 dark:border-gray-700">
            <p className="text-sm font-bold text-gray-500 mb-4">危险区域</p>
            {!showConfirm ? (
              <button
                onClick={() => setShowConfirm(true)}
                className="w-full py-3 rounded-xl border-2 border-red-100 text-red-500 text-sm font-bold hover:bg-red-50 transition-all flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined text-sm">delete_forever</span>
                清空储蓄罐
              </button>
            ) : (
              <div className="space-y-3 animate-in fade-in slide-in-from-top-2">
                <p className="text-xs text-red-400 font-medium">确定要删除所有快乐记录吗？此操作不可撤销。</p>
                <div className="flex gap-2">
                  <button onClick={onClearAll} className="flex-1 py-2 bg-red-500 text-white rounded-lg text-xs font-bold">确认清空</button>
                  <button onClick={() => setShowConfirm(false)} className="flex-1 py-2 bg-gray-100 text-gray-500 rounded-lg text-xs font-bold">取消</button>
                </div>
              </div>
            )}
          </div>

          <button
            onClick={onClose}
            className="w-full py-4 text-gray-400 text-sm font-bold hover:text-gray-600 transition-all"
          >
            关闭窗口
          </button>
        </div>
      </div>
    </div>
  );
};
