import { useState, useEffect, useCallback } from 'react';
import type { User, Session, AuthChangeEvent } from '@supabase/supabase-js';
import { isSupabaseConfigured } from '../lib/supabaseClient';
import {
    signUpWithEmail,
    signInWithEmail,
    signInWithGoogle,
    signInWithMagicLink,
    resetPassword,
    signOut as authSignOut,
    getCurrentUser,
    onAuthStateChange
} from '../lib/authService';

interface UseAuthReturn {
    user: User | null;
    loading: boolean;
    error: Error | null;
    signUp: (email: string, password: string) => Promise<boolean>;
    signIn: (email: string, password: string) => Promise<void>;
    signInWithGoogle: () => Promise<void>;
    signInWithMagicLink: (email: string) => Promise<void>;
    resetPassword: (email: string) => Promise<void>;
    signOut: () => Promise<void>;
    isAuthenticated: boolean;
    isSupabaseConfigured: boolean;
    clearError: () => void;
}

export function useAuth(): UseAuthReturn {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        // Skip auth check if Supabase is not configured
        if (!isSupabaseConfigured) {
            setLoading(false);
            return;
        }

        // Get initial user
        getCurrentUser()
            .then(setUser)
            .catch((e) => {
                console.warn('Auth check failed:', e);
                setError(null); // Don't show error for unconfigured state
            })
            .finally(() => setLoading(false));

        // Subscribe to auth changes
        const subscription = onAuthStateChange(
            (event: AuthChangeEvent, session: Session | null) => {
                setUser(session?.user ?? null);
                setLoading(false);
            }
        );

        return () => {
            subscription.unsubscribe();
        };
    }, []);

    const handleSignUp = useCallback(async (email: string, password: string): Promise<boolean> => {
        if (!isSupabaseConfigured) {
            setError(new Error('请先配置 Supabase 以启用登录功能'));
            return false;
        }
        setError(null);
        setLoading(true);
        try {
            const result = await signUpWithEmail(email, password);
            setLoading(false);
            // Return true if email confirmation is needed
            return !result.session;
        } catch (e) {
            setError(e as Error);
            setLoading(false);
            throw e;
        }
    }, []);

    const handleSignIn = useCallback(async (email: string, password: string) => {
        if (!isSupabaseConfigured) {
            setError(new Error('请先配置 Supabase 以启用登录功能'));
            return;
        }
        setError(null);
        setLoading(true);
        try {
            await signInWithEmail(email, password);
        } catch (e) {
            setError(e as Error);
            setLoading(false);
            throw e;
        }
    }, []);

    const handleSignInWithGoogle = useCallback(async () => {
        if (!isSupabaseConfigured) {
            setError(new Error('请先配置 Supabase 以启用登录功能'));
            return;
        }
        setError(null);
        // Don't set loading to true immediately as it redirects
        try {
            await signInWithGoogle();
        } catch (e) {
            setError(e as Error);
            throw e;
        }
    }, []);

    const handleSignInWithMagicLink = useCallback(async (email: string) => {
        if (!isSupabaseConfigured) {
            setError(new Error('请先配置 Supabase 以启用登录功能'));
            return;
        }
        setError(null);
        setLoading(true);
        try {
            await signInWithMagicLink(email);
        } catch (e) {
            setError(e as Error);
            setLoading(false);
            throw e;
        } finally {
            setLoading(false);
        }
    }, []);

    const handleResetPassword = useCallback(async (email: string) => {
        if (!isSupabaseConfigured) {
            setError(new Error('请先配置 Supabase 以启用登录功能'));
            return;
        }
        setError(null);
        try {
            await resetPassword(email);
        } catch (e) {
            setError(e as Error);
            throw e;
        }
    }, []);

    const handleSignOut = useCallback(async () => {
        setError(null);
        try {
            await authSignOut();
            setUser(null);
        } catch (e) {
            setError(e as Error);
        }
    }, []);

    const clearError = useCallback(() => {
        setError(null);
    }, []);

    return {
        user,
        loading,
        error,
        signUp: handleSignUp,
        signIn: handleSignIn,
        signInWithGoogle: handleSignInWithGoogle,
        signInWithMagicLink: handleSignInWithMagicLink,
        resetPassword: handleResetPassword,
        signOut: handleSignOut,
        isAuthenticated: !!user,
        isSupabaseConfigured,
        clearError
    };
}
