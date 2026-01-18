import { useState, useEffect, useCallback } from 'react';
import type { JoyMoment } from '../types';
import {
    fetchMoments,
    createMoment,
    deleteMoment,
    deleteAllMoments
} from '../lib/momentsService';
import { uploadImage } from '../lib/storageService';

const STORAGE_KEY = 'happy_piggy_bank_moments_v2';

interface UseMomentsReturn {
    moments: JoyMoment[];
    loading: boolean;
    error: Error | null;
    addMoment: (content: string, date: string, imageDataUrl?: string) => Promise<void>;
    removeMoment: (id: string) => Promise<void>;
    clearAll: () => Promise<void>;
    refresh: () => Promise<void>;
}

/**
 * Hook for managing joy moments
 * When authenticated, uses Supabase backend
 * When not authenticated, falls back to localStorage
 */
export function useMoments(isAuthenticated: boolean): UseMomentsReturn {
    const [moments, setMoments] = useState<JoyMoment[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    // Load moments
    const loadMoments = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            if (isAuthenticated) {
                // Fetch from Supabase
                const data = await fetchMoments();
                setMoments(data);
            } else {
                // Fall back to localStorage
                const saved = localStorage.getItem(STORAGE_KEY);
                if (saved) {
                    setMoments(JSON.parse(saved));
                } else {
                    // Demo moments
                    const demoMoments: JoyMoment[] = [
                        { id: '1', content: '今天喝到了好喝的拿铁 ✨', date: '2023-10-10', color: 'yellow' },
                        { id: '2', content: '在公园看到一只可爱的小狗 🐶', date: '2023-10-11', color: 'mint' },
                        { id: '3', content: '项目终于上线啦！🎉', date: '2023-10-12', color: 'primary' }
                    ];
                    setMoments(demoMoments);
                    localStorage.setItem(STORAGE_KEY, JSON.stringify(demoMoments));
                }
            }
        } catch (e) {
            setError(e as Error);
        } finally {
            setLoading(false);
        }
    }, [isAuthenticated]);

    useEffect(() => {
        loadMoments();
    }, [loadMoments]);

    // Add a new moment
    const addMoment = useCallback(async (content: string, date: string, imageDataUrl?: string) => {
        const colors: Array<'yellow' | 'mint' | 'primary' | 'blue'> = ['yellow', 'mint', 'primary', 'blue'];
        const randomColor = colors[Math.floor(Math.random() * colors.length)];

        try {
            if (isAuthenticated) {
                // Upload image if provided
                let imageUrl: string | undefined;
                if (imageDataUrl) {
                    imageUrl = await uploadImage(imageDataUrl);
                }

                // Create in Supabase
                const newMoment = await createMoment(content, date, randomColor, imageUrl);
                setMoments(prev => [newMoment, ...prev]);
            } else {
                // Create locally
                const newMoment: JoyMoment = {
                    id: Date.now().toString(),
                    content,
                    date,
                    color: randomColor,
                    imageUrl: imageDataUrl
                };
                const updated = [newMoment, ...moments];
                setMoments(updated);
                localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
            }
        } catch (e) {
            setError(e as Error);
            throw e;
        }
    }, [isAuthenticated, moments]);

    // Remove a moment
    const removeMoment = useCallback(async (id: string) => {
        try {
            if (isAuthenticated) {
                await deleteMoment(id);
            }

            const updated = moments.filter(m => m.id !== id);
            setMoments(updated);

            if (!isAuthenticated) {
                localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
            }
        } catch (e) {
            setError(e as Error);
            throw e;
        }
    }, [isAuthenticated, moments]);

    // Clear all moments
    const clearAll = useCallback(async () => {
        try {
            if (isAuthenticated) {
                await deleteAllMoments();
            }

            setMoments([]);

            if (!isAuthenticated) {
                localStorage.removeItem(STORAGE_KEY);
            }
        } catch (e) {
            setError(e as Error);
            throw e;
        }
    }, [isAuthenticated]);

    return {
        moments,
        loading,
        error,
        addMoment,
        removeMoment,
        clearAll,
        refresh: loadMoments
    };
}
