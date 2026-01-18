import { supabase } from './supabaseClient';
import type { User, AuthChangeEvent, Session } from '@supabase/supabase-js';

export type AuthUser = User;

/**
 * Sign up with email and password
 */
export async function signUpWithEmail(email: string, password: string) {
    const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            emailRedirectTo: window.location.origin
        }
    });

    if (error) throw error;
    return data;
}

/**
 * Sign in with email and password
 */
export async function signInWithEmail(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
    });

    if (error) throw error;
    return data;
}

/**
 * Send password reset email
 */
export async function resetPassword(email: string) {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`
    });

    if (error) throw error;
}

/**
 * Sign out the current user
 */
export async function signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
}

/**
 * Get current authenticated user
 */
export async function getCurrentUser(): Promise<User | null> {
    const { data: { user } } = await supabase.auth.getUser();
    return user;
}

/**
 * Get current session
 */
export async function getSession(): Promise<Session | null> {
    const { data: { session } } = await supabase.auth.getSession();
    return session;
}

/**
 * Subscribe to auth state changes
 */
export function onAuthStateChange(
    callback: (event: AuthChangeEvent, session: Session | null) => void
) {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(callback);
    return subscription;
}

/**
 * Sign in with Google
 */
export async function signInWithGoogle() {
    const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
            redirectTo: `${window.location.origin}`
        }
    });

    if (error) throw error;
    return data;
}

/**
 * Sign in with Magic Link (Email)
 */
export async function signInWithMagicLink(email: string) {
    const { data, error } = await supabase.auth.signInWithOtp({
        email,
        options: {
            emailRedirectTo: window.location.origin
        }
    });

    if (error) throw error;
    return data;
}
