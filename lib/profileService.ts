
import { supabase } from './supabaseClient';

export interface Profile {
    id: string;
    full_name: string | null;
    avatar_url: string | null;
    updated_at: string;
}

/**
 * Get user profile
 */
export async function getProfile(userId: string): Promise<Profile | null> {
    const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

    if (error) {
        if (error.code === 'PGRST116') {
            // Profile not found
            return null;
        }
        console.error('Error fetching profile:', error);
        return null;
    }

    return data;
}

/**
 * Update user profile
 */
export async function updateProfile(userId: string, updates: Partial<Profile>) {
    const { error } = await supabase
        .from('profiles')
        .upsert({
            id: userId,
            ...updates,
            updated_at: new Date().toISOString(),
        });

    if (error) {
        throw error;
    }
}
