
import React from 'react';
import type { User } from '@supabase/supabase-js';

interface NavbarProps {
  onNavigateHome: () => void;
  onOpenSettings: () => void;
  onNavigateLogin: () => void;
  onNavigateTimeline: () => void;
  user?: User | null;
  avatarUrl?: string; // Add this
  onSignOut?: () => Promise<void>;
}

export const Navbar: React.FC<NavbarProps> = ({
  onNavigateHome,
  onOpenSettings,
  onNavigateLogin,
  onNavigateTimeline,
  user,
  avatarUrl: propAvatarUrl, // Rename to avoid conflict if needed, or just use it
  onSignOut
}) => {
  const isLoggedIn = !!user;
  const avatarUrl = propAvatarUrl || user?.user_metadata?.avatar_url; // Use prop first
  const userName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || '';

  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  return (
    <>
      <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-[#f4eae6] dark:border-gray-700 px-6 md:px-20 py-4 bg-white/70 dark:bg-gray-800/70 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-3 cursor-pointer group" onClick={onNavigateHome}>
          <div className="bg-primary p-1.5 rounded-lg text-white group-hover:rotate-12 transition-transform">
            <span className="material-symbols-outlined text-2xl">savings</span>
          </div>
          <h2 className="text-[#1d100c] dark:text-white text-xl font-extrabold leading-tight tracking-tight font-display">快乐储蓄罐</h2>
        </div>

        <div className="flex flex-1 justify-end gap-6 items-center">
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-2 bg-gray-100/50 dark:bg-gray-700/50 p-1 rounded-full">
            <button
              onClick={onNavigateHome}
              className="text-sm font-bold px-4 py-2 rounded-full hover:bg-white dark:hover:bg-gray-600 transition-all flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-[18px]">grid_view</span>我的储蓄罐
            </button>
            <button
              onClick={onNavigateTimeline}
              className="text-sm font-bold px-4 py-2 rounded-full hover:bg-white dark:hover:bg-gray-600 transition-all flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-[18px]">timeline</span>快乐时间轴
            </button>
            <button
              onClick={onOpenSettings}
              className="text-sm font-bold px-4 py-2 rounded-full hover:bg-white dark:hover:bg-gray-600 transition-all flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-[18px]">settings</span>设置
            </button>
          </nav>

          {/* User Avatar / Login Button */}
          <div className="relative group hidden md:block">
            <button
              onClick={onNavigateLogin}
              className="size-10 rounded-full border-2 border-primary/20 bg-cover bg-center overflow-hidden ring-2 ring-primary/10 transition-transform hover:scale-110 active:scale-95 flex items-center justify-center bg-gray-100 dark:bg-gray-700"
              style={avatarUrl ? { backgroundImage: `url("${avatarUrl}")` } : undefined}
            >
              {!avatarUrl && (
                <span className="material-symbols-outlined text-gray-400 dark:text-gray-500">
                  {isLoggedIn ? 'person' : 'login'}
                </span>
              )}
            </button>

            {/* Dropdown for logged in users */}
            {isLoggedIn && (
              <div className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <div className="p-3 border-b border-gray-100 dark:border-gray-700">
                  <p className="text-sm font-bold text-[#1d100c] dark:text-white truncate">{userName}</p>
                  <p className="text-xs text-gray-400 truncate">{user?.email}</p>
                </div>
                <div className="p-1">
                  <button
                    onClick={onNavigateLogin}
                    className="w-full text-left px-3 py-2 text-sm text-[#1d100c] dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg flex items-center gap-2"
                  >
                    <span className="material-symbols-outlined text-lg">account_circle</span>
                    我的账户
                  </button>
                  <button
                    onClick={onSignOut}
                    className="w-full text-left px-3 py-2 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg flex items-center gap-2"
                  >
                    <span className="material-symbols-outlined text-lg">logout</span>
                    退出登录
                  </button>
                </div>
              </div>
            )}

            {/* Tooltip for not logged in */}
            {!isLoggedIn && (
              <div className="absolute right-0 top-full mt-2 px-3 py-2 bg-gray-800 text-white text-xs rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap">
                点击登录同步数据
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <span className="material-symbols-outlined text-2xl">
              {isMobileMenuOpen ? 'close' : 'menu'}
            </span>
          </button>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm md:hidden" onClick={() => setIsMobileMenuOpen(false)}>
          <div
            className="absolute top-[73px] left-0 w-full bg-white dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700 shadow-xl p-4 flex flex-col gap-2 animate-in slide-in-from-top-2 duration-200"
            onClick={e => e.stopPropagation()}
          >
            <button
              onClick={() => {
                onNavigateHome();
                setIsMobileMenuOpen(false);
              }}
              className="w-full text-left px-4 py-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-3 font-bold text-[#1d100c] dark:text-white"
            >
              <div className="bg-primary/10 p-2 rounded-lg text-primary">
                <span className="material-symbols-outlined">grid_view</span>
              </div>
              我的储蓄罐
            </button>

            <button
              onClick={() => {
                onNavigateTimeline();
                setIsMobileMenuOpen(false);
              }}
              className="w-full text-left px-4 py-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-3 font-bold text-[#1d100c] dark:text-white"
            >
              <div className="bg-purple-100 dark:bg-purple-900/30 p-2 rounded-lg text-purple-600 dark:text-purple-400">
                <span className="material-symbols-outlined">timeline</span>
              </div>
              快乐时间轴
            </button>

            <button
              onClick={() => {
                onOpenSettings();
                setIsMobileMenuOpen(false);
              }}
              className="w-full text-left px-4 py-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-3 font-bold text-[#1d100c] dark:text-white"
            >
              <div className="bg-gray-100 dark:bg-gray-700 p-2 rounded-lg text-gray-600 dark:text-gray-300">
                <span className="material-symbols-outlined">settings</span>
              </div>
              设置
            </button>

            <div className="h-px bg-gray-100 dark:bg-gray-700 my-1"></div>

            {/* Mobile User Section */}
            <div className="px-4 py-2">
              {isLoggedIn ? (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className="size-10 rounded-full bg-gray-200 bg-cover bg-center border border-gray-200"
                      style={avatarUrl ? { backgroundImage: `url("${avatarUrl}")` } : undefined}
                    ></div>
                    <div className="flex flex-col">
                      <span className="font-bold text-sm text-[#1d100c] dark:text-white">{userName}</span>
                      <span className="text-xs text-gray-400 truncate max-w-[150px]">{user?.email}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      onSignOut?.();
                      setIsMobileMenuOpen(false);
                    }}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                  >
                    <span className="material-symbols-outlined">logout</span>
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => {
                    onNavigateLogin();
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full px-4 py-3 bg-primary text-white rounded-xl font-bold shadow-lg shadow-primary/30 flex items-center justify-center gap-2"
                >
                  <span className="material-symbols-outlined">login</span>
                  登录 / 注册
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
