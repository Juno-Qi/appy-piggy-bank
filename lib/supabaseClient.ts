import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Check if we have valid Supabase configuration
const isValidUrl = (url: string): boolean => {
    try {
        new URL(url);
        return true;
    } catch {
        return false;
    }
};

export const isSupabaseConfigured = !!(
    supabaseUrl &&
    supabaseAnonKey &&
    isValidUrl(supabaseUrl) &&
    !supabaseUrl.includes('your_supabase') // Check for placeholder values
);

if (!isSupabaseConfigured) {
    console.warn(
        'Supabase credentials not configured. App will run in local-only mode.\n' +
        'To enable cloud sync, please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env.local'
    );
}

// Create a mock client or real client based on configuration
let supabase: SupabaseClient;

if (isSupabaseConfigured) {
    supabase = createClient(supabaseUrl, supabaseAnonKey, {
        auth: {
            autoRefreshToken: true,
            persistSession: true,
            detectSessionInUrl: true
        }
    });
} else {
    // Create a dummy client with placeholder URL for development
    // This prevents the app from crashing when credentials aren't set
    supabase = createClient('https://placeholder.supabase.co', 'placeholder_key', {
        auth: {
            autoRefreshToken: false,
            persistSession: false,
            detectSessionInUrl: false
        }
    });
}

export { supabase };
