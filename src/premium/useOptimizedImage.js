import { useState, useEffect } from 'react';

// In-memory cache so we only compress each image once per session
const imageCache = new Map();

/**
 * Compresses an image to the specified max dimensions and quality.
 * Returns a smaller blob URL suitable for rendering in carousels.
 */
function compressImage(src, maxWidth = 600, maxHeight = 800, quality = 0.7) {
    // Return cached version if available
    if (imageCache.has(src)) {
        return Promise.resolve(imageCache.get(src));
    }

    return new Promise((resolve) => {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => {
            let w = img.naturalWidth;
            let h = img.naturalHeight;

            // Scale down to fit within max dimensions
            if (w > maxWidth || h > maxHeight) {
                const ratio = Math.min(maxWidth / w, maxHeight / h);
                w = Math.round(w * ratio);
                h = Math.round(h * ratio);
            }

            const canvas = document.createElement('canvas');
            canvas.width = w;
            canvas.height = h;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0, w, h);

            canvas.toBlob(
                (blob) => {
                    if (blob) {
                        const url = URL.createObjectURL(blob);
                        imageCache.set(src, url);
                        resolve(url);
                    } else {
                        // Fallback to original if compression fails
                        imageCache.set(src, src);
                        resolve(src);
                    }
                },
                'image/webp',
                quality
            );
        };
        img.onerror = () => {
            imageCache.set(src, src);
            resolve(src);
        };
        img.src = src;
    });
}

/**
 * React hook that returns an optimized (compressed) version of the image.
 * Shows a low-quality or empty state while compressing, then swaps in.
 */
export function useOptimizedImage(src, maxWidth = 600, maxHeight = 800, quality = 0.7, returnOriginal = true) {
    const [optimizedSrc, setOptimizedSrc] = useState(() => imageCache.get(src) || null);

    useEffect(() => {
        if (!src) return;
        // If already cached, use it immediately
        if (imageCache.has(src)) {
            setOptimizedSrc(imageCache.get(src));
            return;
        }
        let cancelled = false;
        compressImage(src, maxWidth, maxHeight, quality).then((url) => {
            if (!cancelled) setOptimizedSrc(url);
        });
        return () => { cancelled = true; };
    }, [src, maxWidth, maxHeight, quality]);

    // Return compressed URL. If not ready:
    // - if returnOriginal is true, fall back to original src (instant load but heavy)
    // - if returnOriginal is false, return null (wait for compression aka smooth scroll)
    if (optimizedSrc) return optimizedSrc;
    return returnOriginal ? src : null;
}

/**
 * Preload and compress multiple images in parallel (for carousel pre-fetching).
 */
export function preloadImages(sources, maxWidth = 600, maxHeight = 800, quality = 0.7) {
    return Promise.all(sources.map(src => compressImage(src, maxWidth, maxHeight, quality)));
}
