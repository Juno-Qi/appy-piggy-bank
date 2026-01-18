
import React, { useState, useCallback } from 'react';
import { HomeView } from './components/HomeView';
import { RecordView } from './components/RecordView';
import { RandomJoyView } from './components/RandomJoyView';
import { LoginView } from './components/LoginView';
import { TimelineView } from './components/TimelineView';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { SettingsModal } from './components/SettingsModal';
import { useAuth } from './hooks/useAuth';
import { useMoments } from './hooks/useMoments';
import { getProfile, updateProfile } from './lib/profileService';

const USER_CONFIG_KEY = 'happy_piggy_bank_user_config';

const App: React.FC = () => {
  const [view, setView] = useState<'home' | 'record' | 'random' | 'login' | 'timeline'>('home');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [userName, setUserName] = useState(() => {
    return localStorage.getItem(USER_CONFIG_KEY) || 'Happy User';
  });
  const [avatarUrl, setAvatarUrl] = useState<string | undefined>(undefined);

  // Authentication hook
  const {
    user,
    loading: authLoading,
    isAuthenticated,
    signIn,
    signInWithGoogle,
    signInWithMagicLink,
    signUp,
    resetPassword,
    signOut
  } = useAuth();

  // Moments data hook
  const {
    moments,
    loading: momentsLoading,
    addMoment,
    removeMoment,
    clearAll: clearAllMoments
  } = useMoments(isAuthenticated);

  // Fetch profile when user changes
  React.useEffect(() => {
    if (user) {
      getProfile(user.id).then(profile => {
        if (profile) {
          if (profile.full_name) setUserName(profile.full_name);
          if (profile.avatar_url) setAvatarUrl(profile.avatar_url);
        }
      });
    } else {
      setAvatarUrl(undefined);
    }
  }, [user]);

  const handleAddMoment = useCallback(async (content: string, date: string, imageUrl?: string) => {
    await addMoment(content, date, imageUrl);
    setView('home');
  }, [addMoment]);

  const handleDeleteMoment = useCallback(async (id: string) => {
    await removeMoment(id);
  }, [removeMoment]);

  const handleClearAll = useCallback(async () => {
    await clearAllMoments();
    setIsSettingsOpen(false);
  }, [clearAllMoments]);

  const updateUserName = async (name: string) => {
    setUserName(name);
    localStorage.setItem(USER_CONFIG_KEY, name);
    if (user) {
      await updateProfile(user.id, { full_name: name });
    }
  };

  const handleUpdateAvatar = async (url: string) => {
    setAvatarUrl(url);
    if (user) {
      await updateProfile(user.id, { avatar_url: url });
    }
  };

  const handleSignOut = useCallback(async () => {
    await signOut();
    setView('home');
  }, [signOut]);

  // Show loading state
  if (authLoading) {
    return (
      <div className="flex flex-col min-h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        <p className="mt-4 text-gray-500">加载中...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar
        onNavigateHome={() => setView('home')}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onNavigateLogin={() => setView('login')}
        onNavigateTimeline={() => setView('timeline')}
        user={user}
        avatarUrl={avatarUrl}
        onSignOut={handleSignOut}
      />

      <main className="flex-1 flex flex-col items-center justify-start py-10 px-4">
        {momentsLoading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <p className="mt-4 text-gray-400 text-sm">正在同步数据...</p>
          </div>
        ) : (
          <>
            {view === 'home' && (
              <HomeView
                moments={moments}
                onRecord={() => setView('record')}
                onRandom={() => setView('random')}
                onDelete={handleDeleteMoment}
              />
            )}

            {view === 'record' && (
              <RecordView
                onSave={handleAddMoment}
                onCancel={() => setView('home')}
              />
            )}

            {view === 'random' && (
              <RandomJoyView
                moments={moments}
                onBack={() => setView('home')}
              />
            )}

            {view === 'login' && (
              <LoginView
                onBack={() => setView('home')}
                onSignIn={signIn}
                onSignUp={signUp}
                onSignInWithGoogle={signInWithGoogle}
                onSignInWithMagicLink={signInWithMagicLink}
                onResetPassword={resetPassword}
                isAuthenticated={isAuthenticated}
                user={user}
                onSignOut={handleSignOut}
              />
            )}

            {view === 'timeline' && (
              <TimelineView
                moments={moments}
                onBack={() => setView('home')}
                onDelete={handleDeleteMoment}
              />
            )}
          </>
        )}
      </main>

      <Footer count={moments.length} />

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        userName={userName}
        avatarUrl={avatarUrl}
        onUpdateName={updateUserName}
        onUpdateAvatar={handleUpdateAvatar}
        onClearAll={handleClearAll}
      />
    </div>
  );
};

export default App;
