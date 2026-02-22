import React, { useRef, useEffect, useState } from 'react';

const SmartVideo = ({ src, className, poster }) => {
    const videoRef = useRef(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const videoElement = videoRef.current;
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    videoElement?.play().catch(() => { });
                } else {
                    setIsVisible(false);
                    videoElement?.pause();
                }
            },
            { threshold: 0.2 } // Play when 20% visible
        );

        if (videoElement) {
            observer.observe(videoElement);
        }

        return () => {
            if (videoElement) observer.unobserve(videoElement);
        };
    }, []);

    return (
        <video
            ref={videoRef}
            src={src}
            className={className}
            poster={poster}
            muted
            loop
            playsInline
            preload="metadata"
            style={{ opacity: isVisible ? 1 : 0.5, transition: 'opacity 1s ease' }}
        />
    );
};

export default SmartVideo;
