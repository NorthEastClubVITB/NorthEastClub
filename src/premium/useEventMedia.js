import { useState, useEffect } from 'react';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';

/**
 * Hook to fetch media for a specific event folder from the Cloudinary API (via backend).
 */
export const useEventMedia = (folder) => {
    const [media, setMedia] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!folder) return;

        let isMounted = true;
        const fetchMedia = async () => {
            setLoading(true);
            try {
                const response = await fetch(`${API_URL}/media/${folder}`);
                if (!response.ok) {
                    throw new Error(`Failed to fetch media: ${response.statusText}`);
                }
                const data = await response.json();

                if (isMounted) {
                    // Map Cloudinary resources to internal media format
                    const formattedMedia = data.resources.map(res => {
                        const isVideo = res.resource_type === 'video';
                        const thumb = isVideo ? res.secure_url : res.secure_url.replace('/image/upload/', '/image/upload/w_500,f_auto,q_auto/');

                        return {
                            type: isVideo ? 'video' : 'image',
                            src: res.secure_url,
                            thumbnail: thumb,
                            caption: '', // Default empty, will be matched in component
                            public_id: res.public_id,
                            id: res.public_id
                        };
                    });
                    setMedia(formattedMedia);
                    setLoading(false);
                }
            } catch (err) {
                console.error(`Error fetching media for ${folder}:`, err);
                if (isMounted) {
                    setError(err.message);
                    setLoading(false);
                }
            }
        };

        fetchMedia();

        return () => {
            isMounted = false;
        };
    }, [folder]);

    return { media, loading, error };
};

/**
 * Hook to fetch media for multiple folders and merge them.
 */
export const useMultipleEventMedia = (folders) => {
    const [allMedia, setAllMedia] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!folders || folders.length === 0) return;

        let isMounted = true;
        const fetchAll = async () => {
            setLoading(true);
            try {
                const results = await Promise.all(
                    folders.map(folder =>
                        fetch(`${API_URL}/media/${folder}`).then(res => res.json())
                    )
                );

                if (isMounted) {
                    const combined = results.flatMap((data, index) =>
                        (data.resources || []).map(res => {
                            const isVideo = res.resource_type === 'video';
                            const thumb = isVideo ? res.secure_url : res.secure_url.replace('/image/upload/', '/image/upload/w_500,f_auto,q_auto/');

                            return {
                                type: isVideo ? 'video' : 'image',
                                src: res.secure_url,
                                thumbnail: thumb,
                                caption: '',
                                eventTitle: folders[index].replace(/_/g, ' '),
                                public_id: res.public_id,
                                id: res.public_id
                            };
                        })
                    );
                    setAllMedia(combined);
                    setLoading(false);
                }
            } catch (err) {
                console.error("Error fetching multiple media:", err);
                if (isMounted) setLoading(false);
            }
        };

        fetchAll();
        return () => { isMounted = false; };
    }, [folders]);

    return { allMedia, loading };
};
