
import React, { useState } from 'react';
import type { User } from '@supabase/supabase-js';

type AuthMode = 'login' | 'magic_link';

interface LoginViewProps {
  onBack: () => void;
  onSignIn: (email: string, password: string) => Promise<void>;
  onSignUp: (email: string, password: string) => Promise<boolean>;
  onSignInWithGoogle: () => Promise<void>;
  onSignInWithMagicLink: (email: string) => Promise<void>;
  onResetPassword: (email: string) => Promise<void>;
  isAuthenticated: boolean;
  user: User | null;
  onSignOut: () => Promise<void>;
}

export const LoginView: React.FC<LoginViewProps> = ({
  onBack,
  onSignInWithGoogle,
  onSignInWithMagicLink,
  isAuthenticated,
  user,
  onSignOut
}) => {
  const [mode, setMode] = useState<AuthMode>('login'); // login = main view, magic_link = email input
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleGoogleLogin = async () => {
    setError(null);
    try {
      await onSignInWithGoogle();
    } catch (err: any) {
      setError(err.message || 'Google 登录失败');
    }
  };

  const handleMagicLinkLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError('请输入邮箱地址');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      await onSignInWithMagicLink(email);
      setSuccess('登录链接已发送！请查看您的邮箱（包括垃圾邮件文件夹）。');
      setMode('login'); // Go back to main or stay? Maybe stay to show success message clearly.
    } catch (err: any) {
      setError(err.message || '发送登录链接失败，请稍后再试');
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await onSignOut();
    } catch (e) {
      setError('登出失败，请稍后再试');
    }
  };

  // Already logged in view
  if (isAuthenticated && user) {
    return (
      <div className="w-full max-w-md flex flex-col items-center justify-center gap-8 py-10 animate-in fade-in slide-in-from-bottom-8 duration-500">
        <div className="text-center space-y-2">
          <div className="bg-accent-mint/20 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 overflow-hidden border-4 border-white shadow-lg">
            {user.user_metadata?.avatar_url ? (
              <img
                src={user.user_metadata.avatar_url}
                alt="Avatar"
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="material-symbols-outlined text-4xl text-accent-mint">person</span>
            )}
          </div>
          <h1 className="text-3xl font-black text-[#1d100c] dark:text-white font-display">
            欢迎回来！
          </h1>
          <p className="text-[#a15c45] dark:text-gray-400">
            {user.email || '快乐储蓄者'}
          </p>
        </div>

        <div className="w-full bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
          <div className="flex items-center gap-4 mb-4">
            <span className="material-symbols-outlined text-primary text-2xl">cloud_done</span>
            <div>
              <p className="font-bold text-[#1d100c] dark:text-white">数据同步已开启</p>
              <p className="text-sm text-gray-400">您的快乐瞬间会自动保存到云端</p>
            </div>
          </div>
        </div>

        <div className="w-full space-y-4 mt-4">
          <button
            onClick={handleSignOut}
            className="w-full flex items-center justify-center gap-3 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-[#1d100c] dark:text-white h-14 rounded-2xl font-bold transition-all active:scale-[0.98] shadow-sm"
          >
            <span className="material-symbols-outlined">logout</span>
            退出登录
          </button>
        </div>

        <div className="text-center mt-4">
          <button
            onClick={onBack}
            className="text-sm font-bold text-gray-400 hover:text-primary transition-colors flex items-center gap-1 mx-auto"
          >
            <span className="material-symbols-outlined text-sm">arrow_back</span>
            返回首页
          </button>
        </div>
      </div>
    );
  }

  // Main Login View
  return (
    <div className="w-full max-w-md flex flex-col items-center justify-center gap-8 py-10 animate-in fade-in slide-in-from-bottom-8 duration-500">
      <div className="text-center space-y-2">
        <div className="bg-primary/10 w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-6 text-primary">
          <span className="material-symbols-outlined text-4xl">lock_open</span>
        </div>
        <h1 className="text-3xl font-black text-[#1d100c] dark:text-white font-display">
          登录 / 注册
        </h1>
        <p className="text-[#a15c45] dark:text-gray-400">
          选择您喜欢的登录方式
        </p>
      </div>

      {error && (
        <div className="w-full bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 text-red-600 dark:text-red-400 text-sm">
          <span className="material-symbols-outlined text-sm mr-2 align-middle">error</span>
          {error}
        </div>
      )}

      {success && (
        <div className="w-full bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-4 text-green-600 dark:text-green-400 text-sm">
          <span className="material-symbols-outlined text-sm mr-2 align-middle">check_circle</span>
          {success}
        </div>
      )}

      <div className="w-full space-y-4">
        {/* Google Login Button */}
        <button
          onClick={handleGoogleLogin}
          className="w-full flex items-center justify-center gap-3 bg-white hover:bg-gray-50 dark:bg-gray-800 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-600 text-[#1d100c] dark:text-white h-14 rounded-2xl font-bold transition-all active:scale-[0.98] shadow-sm"
        >
          <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-6 h-6" />
          Google 账号登录
        </button>

        <div className="relative flex items-center py-2">
          <div className="flex-grow border-t border-gray-200 dark:border-gray-700"></div>
          <span className="flex-shrink-0 mx-4 text-gray-400 text-sm">或者</span>
          <div className="flex-grow border-t border-gray-200 dark:border-gray-700"></div>
        </div>

        {/* Email Magic Link Form */}
        {mode === 'login' ? (
          <button
            onClick={() => setMode('magic_link')}
            className="w-full flex items-center justify-center gap-3 bg-primary hover:bg-primary/90 text-white h-14 rounded-2xl font-bold transition-all active:scale-[0.98] shadow-lg shadow-primary/20"
          >
            <span className="material-symbols-outlined">mail</span>
            邮箱验证码登录
          </button>
        ) : (
          <form onSubmit={handleMagicLinkLogin} className="space-y-4 animate-in fade-in slide-in-from-top-4">
            <div className="relative">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">mail</span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="请输入您的邮箱"
                required
                className="w-full h-14 pl-12 pr-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl text-[#1d100c] dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
              />
            </div>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setMode('login')}
                className="flex-1 flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 h-14 rounded-2xl font-bold transition-all"
              >
                取消
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-[2] flex items-center justify-center gap-3 bg-primary hover:bg-primary/90 disabled:bg-primary/50 text-white h-14 rounded-2xl font-bold transition-all active:scale-[0.98] shadow-lg shadow-primary/20"
              >
                {loading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                ) : (
                  <>
                    <span className="material-symbols-outlined">send</span>
                    发送登录链接
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>

      <div className="text-center mt-4">
        <button
          onClick={onBack}
          className="text-sm font-bold text-gray-400 hover:text-primary transition-colors flex items-center gap-1 mx-auto"
        >
          <span className="material-symbols-outlined text-sm">arrow_back</span>
          返回首页
        </button>
      </div>

      <div className="text-center mt-4">
        <p className="text-[10px] text-gray-400 max-w-[280px] leading-relaxed">
          登录即表示您同意我们的 <span className="underline cursor-pointer hover:text-primary">服务条款</span> 和 <span className="underline cursor-pointer hover:text-primary">隐私协议</span>
        </p>
      </div>
    </div>
  );
};
