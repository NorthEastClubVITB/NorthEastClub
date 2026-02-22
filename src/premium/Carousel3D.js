import React, { useEffect, useRef, useState } from 'react';
import { Play, Camera } from 'lucide-react';
import './premium.css';

const Carousel3D = ({ items, setLightboxItem, introText = "Swipe to Explore" }) => {
    const containerRef = useRef(null);

    // Dynamic 3D Effect on Scroll
    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        let rAFId = null;

        const handleScroll = () => {
            // Optimization: Cancel any pending frame to avoid stacking
            if (rAFId) cancelAnimationFrame(rAFId);

            rAFId = requestAnimationFrame(() => {
                const center = container.scrollLeft + container.offsetWidth / 2;

                // Handle Intro Text Opacity
                const intro = container.querySelector('.carousel-intro');
                if (intro) {
                    // Fade out quickly as we scroll
                    const progress = Math.min(container.scrollLeft / 400, 1);
                    intro.style.opacity = 1 - progress;
                    intro.style.transform = `translateX(${-progress * 100}px)`; // Move slightly left
                }

                // Handle Outro Text Opacity
                const outro = container.querySelector('.carousel-outro');
                if (outro) {
                    const rect = outro.getBoundingClientRect();
                    const containerRect = container.getBoundingClientRect();

                    // visible when it enters the right side of the screen
                    const isVisible = rect.left < containerRect.right;

                    if (isVisible) {
                        const progress = Math.max(0, Math.min((containerRect.right - rect.left) / 600, 1));
                        outro.style.opacity = progress;
                        outro.style.transform = `translateX(${(1 - progress) * 100}px)`;
                    } else {
                        outro.style.opacity = 0;
                    }
                }

                // Handle Cards
                Array.from(container.querySelectorAll('.card-3d')).forEach((child) => {
                    const childCenter = child.offsetLeft + child.offsetWidth / 2;
                    const dist = Math.abs(center - childCenter);
                    const normDist = Math.min(dist / 600, 1); // Broader range for smoother falloff

                    // Calculate 3D Transforms
                    // Smoother curve using cosine interpolation for scale
                    const scale = 0.8 + 0.2 * Math.cos(normDist * Math.PI / 2);
                    const z = -normDist * 300; // Deeper pushback
                    const rotate = (childCenter - center) / 25; // Gentler rotation

                    child.style.transform = `perspective(1000px) translate3d(0, 0, ${z}px) rotateY(${rotate * -0.5}deg) scale(${scale})`;

                    // Optimization: Only update zIndex if changed significantly to avoid thrashing
                    const newZIndex = 100 - Math.round(normDist * 20);
                    if (child.style.zIndex != newZIndex) {
                        child.style.zIndex = newZIndex;
                    }

                    child.style.opacity = 1;
                });
            });
        };

        container.addEventListener('scroll', handleScroll, { passive: true });
        // Initial setup
        handleScroll();

        return () => {
            container.removeEventListener('scroll', handleScroll);
            if (rAFId) cancelAnimationFrame(rAFId);
        };
    }, [items]);

    return (
        <div className="voyage-carousel-3d" ref={containerRef}>
            <div className="carousel-intro">
                <h3>{introText}</h3>
                <div className="intro-line"></div>
            </div>
            {items.map((item, index) => (
                <div key={index} className="card-3d" onClick={() => setLightboxItem && setLightboxItem(item)}>
                    {item.type === 'video' ? (
                        <video src={item.src} muted loop autoPlay playsInline />
                    ) : (
                        <img src={item.img || item.src} alt={item.title || item.caption || ""} loading="lazy" />
                    )}
                    <div className="card-overlay">
                        {item.type === 'video' ? <Play fill="white" /> : <Camera />}
                        {(item.title || item.caption) && <div className="card-title-overlay">{item.title || item.caption}</div>}
                    </div>
                </div>
            ))}
            <div className="carousel-outro">
                <h3>The Journey Continues...</h3>
                <p>Every end is just a new beginning.</p>
            </div>
        </div>
    );
};

export default Carousel3D;
