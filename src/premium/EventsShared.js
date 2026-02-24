import React, { useEffect, useRef, useState } from 'react';
import { MapPin, Users, Clock, Star } from 'lucide-react';
import { useOptimizedImage } from './useOptimizedImage';

// ========== GRAIN OVERLAY ==========
export function GrainOverlay() {
    return (
        <div style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            background: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 400 400\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\' opacity=\'0.05\'/%3E%3C/svg%3E")',
            pointerEvents: 'none', opacity: 0.6, zIndex: 1
        }} />
    );
}

// ========== HERO SECTION ==========
export function HeroSection() {
    return (
        <div style={{ padding: '120px 20px 80px', textAlign: 'center', position: 'relative', zIndex: 2 }}>
            <div style={{
                display: 'inline-block', marginBottom: '20px', padding: '8px 24px',
                background: 'rgba(9, 23, 61, 0.05)', border: '1px solid rgba(9, 23, 61, 0.2)',
                borderRadius: '30px', fontSize: '14px', letterSpacing: '2px', color: '#09173d',
                fontWeight: 600, textTransform: 'uppercase'
            }}>Our Journey</div>
            <h1 style={{
                fontSize: 'clamp(48px, 8vw, 96px)', fontWeight: 400, margin: '0 0 24px 0',
                background: 'linear-gradient(135deg, #09173d 0%, #1a237e 100%)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
                lineHeight: 1.1, fontFamily: "'Playfair Display', 'Georgia', serif"
            }}>Events Timeline</h1>
            <p style={{ fontSize: '20px', color: '#09173d', maxWidth: '600px', margin: '0 auto', lineHeight: 1.6, opacity: 0.8 }}>
                Reliving the moments that shaped our community, one memory at a time
            </p>
        </div>
    );
}

// ========== OPTIMIZED IMAGE COMPONENT ==========
function OptimizedImg({ src, alt, maxW, maxH, quality, style, ...props }) {
    const optimized = useOptimizedImage(src, maxW || 600, maxH || 800, quality || 0.7);
    return <img src={optimized} alt={alt || ''} decoding="async" {...props} style={style} />;
}

// ========== FEATURED CAROUSEL (GPU-accelerated + compressed images) ==========
export function FeaturedCarousel({ events, activeCarouselIndex, setActiveCarouselIndex, setSelectedEvent }) {
    // Cache window width in state to avoid reading DOM during render
    const [viewW, setViewW] = useState(window.innerWidth);
    useEffect(() => {
        const onResize = () => setViewW(window.innerWidth);
        window.addEventListener('resize', onResize);
        return () => window.removeEventListener('resize', onResize);
    }, []);

    return (
        <div style={{ padding: 'clamp(3rem, 10vw, 6rem) clamp(1rem, 5vw, 2rem)', position: 'relative', zIndex: 2, overflow: 'hidden' }}>
            <div style={{ textAlign: 'center', marginBottom: 'clamp(2rem, 6vw, 4rem)' }}>
                <h2 style={{ fontSize: 'clamp(2rem, 5vw, 4rem)', fontWeight: 400, margin: '0 0 1rem 0', color: '#09173d', fontFamily: "'Playfair Display', 'Georgia', serif" }}>Featured Highlights</h2>
                <p style={{ fontSize: 'clamp(1rem, 2.5vw, 1.25rem)', color: '#09173d', opacity: 0.7 }}>Swipe through our most memorable events</p>
            </div>
            <div style={{ position: 'relative', height: 'clamp(25rem, 60vw, 35rem)', display: 'flex', alignItems: 'center', justifyContent: 'center', perspective: '1500px' }}>
                {events.map((event, index) => {
                    const offset = index - activeCarouselIndex;
                    const isActive = index === activeCarouselIndex;
                    const slideX = offset * Math.min(viewW < 768 ? 200 : 280, viewW * 0.6);
                    return (
                        <CarouselCard key={event.id || index} event={event} isActive={isActive} offset={offset} slideX={slideX}
                            onClick={() => { if (isActive) setSelectedEvent(event); else setActiveCarouselIndex(index); }} />
                    );
                })}
            </div>
            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', marginTop: 'clamp(2rem, 5vw, 4rem)' }}>
                {events.map((_, index) => (
                    <button key={index} onClick={() => setActiveCarouselIndex(index)} style={{
                        width: activeCarouselIndex === index ? '2.5rem' : '0.75rem', height: '0.75rem', borderRadius: '0.5rem',
                        background: activeCarouselIndex === index ? 'linear-gradient(135deg, #09173d, #1a237e)' : 'rgba(9, 23, 61, 0.2)',
                        border: 'none', cursor: 'pointer', transition: 'all 0.4s cubic-bezier(0.25, 1, 0.5, 1)'
                    }} />
                ))}
            </div>
        </div>
    );
}

// Individual carousel card — memoized to prevent unnecessary re-renders
const CarouselCard = React.memo(function CarouselCard({ event, isActive, offset, slideX, onClick }) {
    const optimizedCover = useOptimizedImage(event.coverImage, 500, 600, 0.65);
    const absOffset = Math.abs(offset);

    return (
        <div onClick={onClick} style={{
            position: 'absolute', width: 'min(90vw, 36rem)', height: 'clamp(16rem, 40vw, 22rem)',
            borderRadius: 'clamp(1rem, 3vw, 1.5rem)', cursor: 'pointer',
            /* GPU-only properties for silky transitions */
            transition: 'transform 0.5s cubic-bezier(0.2, 0.8, 0.2, 1), opacity 0.4s ease, box-shadow 0.5s ease',
            transform: `translate3d(${slideX}px, ${isActive ? 0 : '10%'}, ${isActive ? 0 : -200}px) rotateY(${offset * 20}deg) scale(${isActive ? 1 : 0.85})`,
            willChange: 'transform, opacity, box-shadow',
            opacity: absOffset > 1 ? 0 : 1,
            zIndex: isActive ? 10 : 5 - absOffset,
            boxShadow: isActive ? '0 25px 60px rgba(9,23,61,0.4), 0 0 0 1px rgba(255,255,255,0.2) inset' : '0 10px 30px rgba(0,0,0,0.15)',
            pointerEvents: absOffset > 1 ? 'none' : 'auto',
            border: isActive ? '1px solid rgba(255,255,255,0.3)' : '1px solid rgba(255,255,255,0.1)',
            overflow: 'hidden',
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden'
        }}
            onMouseEnter={isActive ? (e) => { e.currentTarget.style.transform = `translate3d(${slideX}px, -2%, 0) scale(1.02)`; e.currentTarget.style.boxShadow = '0 30px 80px rgba(9,23,61,0.5), 0 0 0 1.5px rgba(255,255,255,0.4) inset'; } : undefined}
            onMouseLeave={isActive ? (e) => { e.currentTarget.style.transform = `translate3d(${slideX}px, 0, 0) scale(1)`; e.currentTarget.style.boxShadow = '0 25px 60px rgba(9,23,61,0.4), 0 0 0 1px rgba(255,255,255,0.2) inset'; } : undefined}
        >
            {/* Compressed cover image */}
            <img src={optimizedCover} alt={event.title} decoding="async"
                style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', pointerEvents: 'none', filter: isActive ? 'none' : 'grayscale(30%) brightness(0.8)', transition: 'filter 0.5s ease' }} />
            {/* Dark overlay */}
            <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(to top, ${event.color}ee 0%, ${event.color}66 50%, transparent 100%)` }} />
            <div style={{ height: '100%', display: 'flex', flexDirection: 'column', color: 'white', position: 'relative', zIndex: 2, padding: 'clamp(1.5rem, 5vw, 2rem)', justifyContent: 'flex-end', opacity: isActive ? 1 : 0.8, transition: 'opacity 0.4s' }}>
                <div style={{ fontSize: 'clamp(0.7rem, 2vw, 0.85rem)', opacity: 0.8, marginBottom: '0.75rem', letterSpacing: '0.15em', textTransform: 'uppercase', fontWeight: 600 }}>{event.date}</div>
                <h3 style={{ fontSize: 'clamp(1.75rem, 5vw, 2.5rem)', fontWeight: 600, margin: '0 0 0.75rem 0', fontFamily: "'Playfair Display', 'Georgia', serif", lineHeight: 1.1 }}>{event.title}</h3>
                <p style={{ fontSize: 'clamp(0.85rem, 2.5vw, 1rem)', lineHeight: 1.6, opacity: 0.9, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', margin: 0 }}>{event.description}</p>
                <div style={{ display: 'flex', gap: 'clamp(1rem, 3vw, 1.5rem)', paddingTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.2)', fontSize: 'clamp(0.8rem, 2vw, 0.9rem)', opacity: 0.9, flexWrap: 'wrap', marginTop: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><MapPin style={{ width: '1rem', height: '1rem', flexShrink: 0 }} /><span>{event.location.split(',')[0]}</span></div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Users style={{ width: '1rem', height: '1rem', flexShrink: 0 }} /><span>{event.attendees}</span></div>
                </div>
            </div>
            <div style={{ position: 'absolute', top: 'clamp(1rem, 3vw, 1.5rem)', right: 'clamp(1rem, 3vw, 1.5rem)', width: 'clamp(2.5rem, 8vw, 3.5rem)', height: 'clamp(2.5rem, 8vw, 3.5rem)', borderRadius: '50%', background: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2, backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.2)', boxShadow: '0 4px 15px rgba(0,0,0,0.1)' }}>
                <Star style={{ width: 'clamp(1rem, 3vw, 1.5rem)', height: 'clamp(1rem, 3vw, 1.5rem)', color: 'white', fill: isActive ? 'rgba(255,255,255,0.8)' : 'transparent', transition: 'fill 0.4s ease' }} />
            </div>
        </div>
    );
});

// ========== EVENT CARD (Timeline) - uses coverImage ==========
export function EventCard({ event, index, onEventClick, isActive }) {
    const [isVisible, setIsVisible] = useState(false);
    const cardRef = useRef(null);
    useEffect(() => {
        const node = cardRef.current;
        if (!node) return;
        const observer = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) setIsVisible(true); }, { threshold: 0.2 });
        observer.observe(node);
        return () => observer.unobserve(node);
    }, []);

    return (
        <div ref={cardRef} className="event-card" style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '120px', position: 'relative',
            opacity: isVisible ? 1 : 0, transform: isVisible ? 'translate3d(0,0,0)' : 'translate3d(0,50px,0)',
            transition: `opacity 0.8s cubic-bezier(0.4, 0, 0.2, 1) ${index * 0.2}s, transform 0.8s cubic-bezier(0.4, 0, 0.2, 1) ${index * 0.2}s`,
            willChange: 'transform, opacity'
        }}>
            <div style={{
                position: 'absolute', left: '50%', top: '40px', width: '24px', height: '24px',
                background: isActive ? event.color : `${event.color}80`, borderRadius: '50%', transform: 'translateX(-50%)',
                border: `4px solid ${isActive ? '#fff' : 'rgba(0,0,0,0.1)'}`,
                boxShadow: isActive ? `0 0 0 8px ${event.color}30, 0 0 30px ${event.color}80, 0 4px 20px rgba(0,0,0,0.2)` : `0 0 0 8px ${event.color}10, 0 4px 20px rgba(0,0,0,0.1)`,
                zIndex: 10, opacity: isVisible ? 1 : 0, transition: `all 0.6s cubic-bezier(0.4, 0, 0.2, 1) ${index * 0.2 + 0.3}s`,
                animation: isActive ? 'pulse 2s infinite' : 'none'
            }} />
            <div style={{
                width: '100%', maxWidth: '600px',
                background: isActive ? `linear-gradient(135deg, ${event.color}10, rgba(255, 255, 255, 0.95))` : 'linear-gradient(135deg, rgba(255,255,255,0.95), rgba(255,255,255,0.85))',
                borderRadius: '20px', overflow: 'hidden',
                boxShadow: isActive ? `0 20px 60px ${event.color}20, 0 0 0 2px ${event.color}20` : '0 10px 40px rgba(0,0,0,0.1)',
                border: isActive ? `2px solid ${event.color}40` : '1px solid rgba(0,0,0,0.05)',
                transition: 'transform 0.4s ease, box-shadow 0.4s ease', cursor: 'pointer',
                backdropFilter: 'blur(10px)',
                transform: isActive ? 'scale(1.02)' : 'scale(1)'
            }} onClick={() => onEventClick(event)}
                onMouseEnter={(e) => { if (!isActive) { e.currentTarget.style.transform = 'translateY(-8px) scale(1.01)'; e.currentTarget.style.boxShadow = `0 20px 60px ${event.color}15`; } }}
                onMouseLeave={(e) => { if (!isActive) { e.currentTarget.style.transform = 'translateY(0) scale(1)'; e.currentTarget.style.boxShadow = '0 10px 40px rgba(0,0,0,0.1)'; } }}>
                {/* Compressed cover image */}
                <div style={{ height: 'clamp(200px, 40vw, 280px)', position: 'relative', overflow: 'hidden' }}>
                    <OptimizedImg src={event.coverImage} alt={event.title} maxW={700} maxH={400} quality={0.7}
                        loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                    <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(to bottom, transparent 0%, ${event.color}aa 100%)`, display: 'flex', alignItems: 'flex-end', padding: 'clamp(20px, 4vw, 24px)' }}>
                        <div style={{ display: 'inline-block', padding: '8px 20px', background: 'rgba(255,255,255,0.2)', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.3)', fontSize: 'clamp(12px, 2.5vw, 14px)', color: 'white', fontWeight: 600, letterSpacing: '1px' }}>{event.date}</div>
                    </div>
                </div>
                <div style={{ padding: 'clamp(24px, 5vw, 32px)' }}>
                    <h3 style={{ fontSize: 'clamp(24px, 5vw, 32px)', fontWeight: 600, margin: '0 0 16px 0', color: '#09173d', fontFamily: "'Playfair Display', 'Georgia', serif", lineHeight: 1.2 }}>{event.title}</h3>
                    <p style={{ fontSize: 'clamp(14px, 3vw, 16px)', lineHeight: 1.7, color: '#444', margin: '0 0 24px 0', opacity: 0.9 }}>{event.description}</p>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '16px', paddingTop: '24px', borderTop: '1px solid rgba(0,0,0,0.06)' }}>
                        <div style={{ textAlign: 'center' }}><Clock style={{ width: '20px', height: '20px', color: '#09173d', margin: '0 auto 8px', opacity: 0.8 }} /><div style={{ fontSize: 'clamp(11px, 2vw, 12px)', color: '#09173d', opacity: 0.8, fontWeight: 600 }}>{event.time}</div></div>
                        <div style={{ textAlign: 'center' }}><MapPin style={{ width: '20px', height: '20px', color: '#09173d', margin: '0 auto 8px', opacity: 0.8 }} /><div style={{ fontSize: 'clamp(11px, 2vw, 12px)', color: '#09173d', opacity: 0.8, fontWeight: 600 }}>{event.location}</div></div>
                        <div style={{ textAlign: 'center' }}><Users style={{ width: '20px', height: '20px', color: '#09173d', margin: '0 auto 8px', opacity: 0.8 }} /><div style={{ fontSize: 'clamp(11px, 2vw, 12px)', color: '#09173d', opacity: 0.8, fontWeight: 600 }}>{event.attendees}</div></div>
                    </div>
                </div>
            </div>
        </div>
    );
}

// ========== MOMENT CARD - uses compressed images ==========
export function MomentCard({ image, index }) {
    const [isVisible, setIsVisible] = useState(false);
    const cardRef = useRef(null);
    const optimized = useOptimizedImage(image.src, 400, 500, 0.65);
    useEffect(() => {
        const node = cardRef.current;
        if (!node) return;
        const observer = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) setIsVisible(true); }, { threshold: 0.1 });
        observer.observe(node);
        return () => observer.unobserve(node);
    }, []);
    return (
        <div ref={cardRef} style={{
            aspectRatio: '4/5', borderRadius: 'clamp(8px, 2vw, 12px)',
            position: 'relative', overflow: 'hidden', opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'translate3d(0,0,0) scale(1) rotate(0deg)' : 'translate3d(0,0,0) scale(0.8) rotate(-5deg)',
            transition: `opacity 0.6s cubic-bezier(0.4, 0, 0.2, 1) ${index * 0.1}s, transform 0.6s cubic-bezier(0.4, 0, 0.2, 1) ${index * 0.1}s`,
            cursor: 'pointer', willChange: 'transform, opacity',
            border: 'clamp(4px, 1.5vw, 8px) solid rgba(0,0,0,0.04)', boxShadow: '0 8px 30px rgba(0,0,0,0.12)', minHeight: '200px',
            backfaceVisibility: 'hidden'
        }}
            onMouseEnter={(e) => { e.currentTarget.style.transform = 'translate3d(0,0,0) scale(1.05) rotate(2deg)'; e.currentTarget.style.boxShadow = '0 15px 50px rgba(0,0,0,0.18)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = 'translate3d(0,0,0) scale(1) rotate(0deg)'; e.currentTarget.style.boxShadow = '0 8px 30px rgba(0,0,0,0.12)'; }}>
            <img src={optimized} alt={image.caption || ''} decoding="async" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
            {/* Caption overlay on hover */}
            <div className="moment-caption" style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: 'clamp(12px, 3vw, 20px)', background: 'linear-gradient(to top, rgba(0,0,0,0.7), transparent)', color: 'white', fontSize: 'clamp(12px, 2.5vw, 14px)', fontWeight: 600, transform: 'translateY(100%)', transition: 'transform 0.4s ease' }}>
                {image.caption}
            </div>
            {/* Vintage corners */}
            <div style={{ position: 'absolute', top: 'clamp(8px, 2vw, 12px)', right: 'clamp(8px, 2vw, 12px)', width: 'clamp(4px, 1vw, 6px)', height: 'clamp(4px, 1vw, 6px)', background: 'white', opacity: 0.6, clipPath: 'polygon(0 0, 100% 0, 100% 100%)' }} />
            <div style={{ position: 'absolute', bottom: 'clamp(8px, 2vw, 12px)', left: 'clamp(8px, 2vw, 12px)', width: 'clamp(4px, 1vw, 6px)', height: 'clamp(4px, 1vw, 6px)', background: 'white', opacity: 0.6, clipPath: 'polygon(0 0, 0 100%, 100% 100%)' }} />
            <style>{`.moment-caption { pointer-events: none; } div:hover > .moment-caption { transform: translateY(0) !important; }`}</style>
        </div>
    );
}

// ========== MEMORY CARD (Detail Page) - handles both image and video ==========
export function MemoryCard({ memory, index, event, tall, wide }) {
    const [isVisible, setIsVisible] = useState(false);
    const cardRef = useRef(null);
    const isVideo = memory.type === 'video';
    const optimized = useOptimizedImage(isVideo ? null : memory.src, 500, 600, 0.7);
    useEffect(() => {
        const node = cardRef.current;
        if (!node) return;
        const observer = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) setIsVisible(true); }, { threshold: 0.1 });
        observer.observe(node);
        return () => observer.unobserve(node);
    }, []);
    return (
        <div ref={cardRef} style={{
            gridRow: tall ? 'span 2' : 'span 1', gridColumn: wide ? 'span 2' : 'span 1',
            borderRadius: 'clamp(12px, 2vw, 16px)',
            position: 'relative', overflow: 'hidden', opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'translate3d(0,0,0) scale(1) rotate(0deg)' : 'translate3d(0,0,0) scale(0.9) rotate(-3deg)',
            transition: `opacity 0.6s cubic-bezier(0.4, 0, 0.2, 1) ${index * 0.05}s, transform 0.6s cubic-bezier(0.4, 0, 0.2, 1) ${index * 0.05}s`,
            cursor: 'pointer', willChange: 'transform, opacity',
            border: 'clamp(4px, 1vw, 8px) solid rgba(0,0,0,0.04)', boxShadow: '0 10px 40px rgba(0,0,0,0.12)',
            minHeight: 'clamp(180px, 30vw, 200px)', backfaceVisibility: 'hidden'
        }}
            onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translate3d(0,0,0) scale(1.03) rotate(1deg)';
                e.currentTarget.style.boxShadow = '0 20px 60px rgba(0,0,0,0.25)';
                e.currentTarget.style.zIndex = '10';
                const c = e.currentTarget.querySelector('.caption');
                if (c) c.style.transform = 'translateY(0)';
                const v = e.currentTarget.querySelector('video');
                if (v) v.play().catch(() => { });
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translate3d(0,0,0) scale(1) rotate(0deg)';
                e.currentTarget.style.boxShadow = '0 10px 40px rgba(0,0,0,0.15)';
                e.currentTarget.style.zIndex = '1';
                const c = e.currentTarget.querySelector('.caption');
                if (c) c.style.transform = 'translateY(100%)';
                const v = e.currentTarget.querySelector('video');
                if (v) v.pause();
            }}>
            {isVideo ? (
                <video src={memory.src} muted loop playsInline preload="metadata" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
            ) : (
                <img src={optimized} alt={memory.caption || ''} decoding="async" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
            )}
            {/* Play icon overlay for videos */}
            {isVideo && (
                <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 'clamp(40px, 8vw, 56px)', height: 'clamp(40px, 8vw, 56px)', borderRadius: '50%', background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none', transition: 'opacity 0.3s ease' }}>
                    <div style={{ width: 0, height: 0, borderLeft: 'clamp(12px, 2.5vw, 16px) solid white', borderTop: 'clamp(8px, 1.5vw, 10px) solid transparent', borderBottom: 'clamp(8px, 1.5vw, 10px) solid transparent', marginLeft: '3px' }} />
                </div>
            )}
            <div className="caption" style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: 'clamp(16px, 4vw, 24px)', background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)', color: 'white', fontSize: 'clamp(14px, 3vw, 16px)', fontWeight: 600, transform: 'translateY(100%)', transition: 'transform 0.4s ease' }}>{memory.caption}</div>
            <div style={{ position: 'absolute', top: 'clamp(12px, 2vw, 16px)', right: 'clamp(12px, 2vw, 16px)', width: 'clamp(6px, 1.5vw, 8px)', height: 'clamp(6px, 1.5vw, 8px)', background: 'white', opacity: 0.6, clipPath: 'polygon(0 0, 100% 0, 100% 100%)' }} />
            <div style={{ position: 'absolute', bottom: 'clamp(12px, 2vw, 16px)', left: 'clamp(12px, 2vw, 16px)', width: 'clamp(6px, 1.5vw, 8px)', height: 'clamp(6px, 1.5vw, 8px)', background: 'white', opacity: 0.6, clipPath: 'polygon(0 0, 0 100%, 100% 100%)' }} />
        </div>
    );
}
