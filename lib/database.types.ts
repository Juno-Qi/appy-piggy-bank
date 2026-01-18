export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[];

export interface Database {
    public: {
        Tables: {
            joy_moments: {
                Row: {
                    id: string;
                    user_id: string;
                    content: string;
                    date: string;
                    color: 'yellow' | 'mint' | 'primary' | 'blue';
                    image_url: string | null;
                    created_at: string;
                };
                Insert: {
                    id?: string;
                    user_id: string;
                    content: string;
                    date: string;
                    color: 'yellow' | 'mint' | 'primary' | 'blue';
                    image_url?: string | null;
                    created_at?: string;
                };
                Update: {
                    id?: string;
                    user_id?: string;
                    content?: string;
                    date?: string;
                    color?: 'yellow' | 'mint' | 'primary' | 'blue';
                    image_url?: string | null;
                    created_at?: string;
                };
            };
        };
        Views: Record<string, never>;
        Functions: Record<string, never>;
        Enums: Record<string, never>;
    };
}

export type JoyMomentRow = Database['public']['Tables']['joy_moments']['Row'];
export type JoyMomentInsert = Database['public']['Tables']['joy_moments']['Insert'];
