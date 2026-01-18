import { supabase } from './supabaseClient';

const BUCKET_NAME = 'joy-images';

/**
 * Upload an image to Supabase Storage
 * @param file - File object or base64 data URL string
 * @returns Public URL of the uploaded image
 */
export async function uploadImage(file: File | string): Promise<string> {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        throw new Error('User must be logged in to upload images');
    }

    let fileToUpload: File;

    // Handle base64 data URL
    if (typeof file === 'string' && file.startsWith('data:')) {
        const response = await fetch(file);
        const blob = await response.blob();
        const extension = file.split(';')[0].split('/')[1] || 'png';
        fileToUpload = new File([blob], `image.${extension}`, { type: blob.type });
    } else if (file instanceof File) {
        fileToUpload = file;
    } else {
        throw new Error('Invalid file format');
    }

    const fileExt = fileToUpload.name.split('.').pop();
    const fileName = `${user.id}/${Date.now()}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
        .from(BUCKET_NAME)
        .upload(fileName, fileToUpload, {
            cacheControl: '3600',
            upsert: false
        });

    if (uploadError) throw uploadError;

    const { data } = supabase.storage
        .from(BUCKET_NAME)
        .getPublicUrl(fileName);

    return data.publicUrl;
}

/**
 * Upload an avatar to Supabase Storage
 * @param file - File object or base64 data URL string
 * @returns Public URL of the uploaded avatar
 */
export async function uploadAvatar(file: File | string): Promise<string> {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        throw new Error('User must be logged in to upload avatars');
    }

    let fileToUpload: File;

    if (typeof file === 'string' && file.startsWith('data:')) {
        const response = await fetch(file);
        const blob = await response.blob();
        const extension = file.split(';')[0].split('/')[1] || 'png';
        fileToUpload = new File([blob], `avatar.${extension}`, { type: blob.type });
    } else if (file instanceof File) {
        fileToUpload = file;
    } else {
        throw new Error('Invalid file format');
    }

    const fileExt = fileToUpload.name.split('.').pop();
    // Overwrite the existing avatar or use a timestamp to avoid caching issues?
    // Using simple path 'uid/avatar.ext' allows easy overwrite but might have caching issues.
    // Using timestamp 'uid/timestamp.ext' avoids caching but accumulates files.
    // Let's use timestamp for now to ensure update logic works visually.
    const fileName = `${user.id}/avatar_${Date.now()}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(fileName, fileToUpload, {
            cacheControl: '3600',
            upsert: false
        });

    if (uploadError) throw uploadError;

    const { data } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName);

    return data.publicUrl;
}

/**
 * Delete an image from Supabase Storage
 * @param imageUrl - The public URL of the image to delete
 */
export async function deleteImage(imageUrl: string): Promise<void> {
    try {
        // Extract file path from URL
        const url = new URL(imageUrl);
        const pathParts = url.pathname.split(`/${BUCKET_NAME}/`);
        if (pathParts.length < 2) return;

        const filePath = pathParts[1];

        const { error } = await supabase.storage
            .from(BUCKET_NAME)
            .remove([filePath]);

        if (error) throw error;
    } catch (e) {
        console.warn('Failed to delete image:', e);
    }
}

/**
 * Get public URL for an image path
 */
export function getImageUrl(path: string): string {
    const { data } = supabase.storage
        .from(BUCKET_NAME)
        .getPublicUrl(path);

    return data.publicUrl;
}
