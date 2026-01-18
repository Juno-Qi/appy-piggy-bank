import { supabase } from './supabaseClient';
import type { JoyMoment } from '../types';

type MomentColor = 'yellow' | 'mint' | 'primary' | 'blue';

interface JoyMomentRow {
    id: string;
    user_id: string;
    content: string;
    date: string;
    color: MomentColor;
    image_url: string | null;
    created_at: string;
}

/**
 * Convert database row to JoyMoment type
 */
function toJoyMoment(row: JoyMomentRow): JoyMoment {
    return {
        id: row.id,
        content: row.content,
        date: row.date,
        color: row.color,
        imageUrl: row.image_url || undefined
    };
}

/**
 * Fetch all joy moments for the current user
 */
export async function fetchMoments(): Promise<JoyMoment[]> {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return [];
    }

    const { data, error } = await supabase
        .from('joy_moments')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

    if (error) throw error;

    return (data || []).map((row: JoyMomentRow) => toJoyMoment(row));
}

/**
 * Create a new joy moment
 */
export async function createMoment(
    content: string,
    date: string,
    color: MomentColor,
    imageUrl?: string
): Promise<JoyMoment> {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        throw new Error('User must be logged in to create moments');
    }

    const { data, error } = await supabase
        .from('joy_moments')
        .insert({
            user_id: user.id,
            content,
            date,
            color,
            image_url: imageUrl || null
        })
        .select()
        .single();

    if (error) throw error;

    return toJoyMoment(data as JoyMomentRow);
}

/**
 * Delete a joy moment by ID
 */
export async function deleteMoment(id: string): Promise<void> {
    const { error } = await supabase
        .from('joy_moments')
        .delete()
        .eq('id', id);

    if (error) throw error;
}

/**
 * Delete all moments for the current user
 */
export async function deleteAllMoments(): Promise<void> {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        throw new Error('User must be logged in');
    }

    const { error } = await supabase
        .from('joy_moments')
        .delete()
        .eq('user_id', user.id);

    if (error) throw error;
}
