import React, { useState, useRef } from 'react';

const SmartImage = ({ src, alt, className, onClick, type = 'image' }) => {
    const [tilt, setTilt] = useState({ x: 0, y: 0 });
    const ref = useRef(null);

    const handleMouseMove = (e) => {
        if (!ref.current) return;
        const { left, top, width, height } = ref.current.getBoundingClientRect();
        const x = (e.clientX - left) / width - 0.5;
        const y = (e.clientY - top) / height - 0.5;
        // Tilt range: -10deg to 10deg
        setTilt({ x: y * -10, y: x * 10 });
    };

    const handleMouseLeave = () => {
        setTilt({ x: 0, y: 0 });
    };

    return (
        <div
            ref={ref}
            className={`smart-media-container ${className}`}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            onClick={onClick}
            style={{
                transform: `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) scale3d(1.02, 1.02, 1.02)`,
                transition: 'transform 0.1s ease-out'
            }}
        >
            {type === 'video' ? (
                <>
                    <video src={src} muted loop autoPlay playsInline className="smart-media-content" />
                    <div className="smart-media-play-indicator">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
                    </div>
                </>
            ) : (
                <img src={src} alt={alt} className="smart-media-content" loading="lazy" />
            )}
            <div className="smart-media-glare"
                style={{
                    background: `radial-gradient(circle at ${50 + tilt.y * 5}% ${50 + tilt.x * 5}%, rgba(255,255,255,0.3), transparent 60%)`,
                    opacity: Math.abs(tilt.x) + Math.abs(tilt.y) > 0 ? 1 : 0
                }}
            />
            <div className="smart-media-overlay">
                <span className="view-text">Expand</span>
            </div>
        </div>
    );
};

export default SmartImage;
