import React, { useEffect, useState, useRef } from 'react';
import { Camera, MapPin, Users, Clock, Quote } from 'lucide-react';
import { EventCard, MomentCard, MemoryCard, GrainOverlay } from './EventsShared';
import { useOptimizedImage } from './useOptimizedImage';
import CommentsSection from './CommentsSection';
import CapturedMoments3D from './CapturedMoments3D';
import { useEventMedia } from './useEventMedia';

// Memoised slide for God-Level Orbital Cylinder
const MomentSlide = React.memo(function MomentSlide({ moment, index, activeIndex, total, onClick }) {
    const displaySrc = moment.thumbnail || moment.src;
    const optimized = useOptimizedImage(displaySrc, 400, 500, 0.6);

    // Calculate shortest path offset for infinite looping cylinder
    let offset = index - activeIndex;
    if (offset > total / 2) offset -= total;
    if (offset < -total / 2) offset += total;

    // God-level 3D Cylinder Math
    const angleStep = 360 / Math.max(total, 1);
    const angle = offset * angleStep;
    const isActive = offset === 0;
    const absOffset = Math.abs(offset);

    // Smooth fluid radius for the cylinder (Expanded massively)
    const radius = 'clamp(25rem, 75vw, 45rem)';
    // Push active card forward so flat planes don't intersect
    const zTranslate = isActive ? `calc(${radius} + 2rem)` : radius;

    return (
        <div onClick={onClick} style={{
            position: 'absolute',
            top: '50%', left: '50%',
            width: 'clamp(18rem, 50vw, 30rem)', height: 'clamp(12rem, 35vw, 18rem)',
            // Perfect center alignment
            margin: 'calc(-1 * clamp(12rem, 35vw, 18rem)/2) 0 0 calc(-1 * clamp(18rem, 50vw, 30rem)/2)',
            borderRadius: 'clamp(1rem, 3vw, 1.5rem)', cursor: 'pointer',
            // Fast, sharp transition
            transition: 'transform 0.4s ease-out, opacity 0.4s ease-out, filter 0.4s ease-out, box-shadow 0.4s ease-out',
            transform: `rotateY(${angle}deg) translateZ(${zTranslate}) scale(${isActive ? 1 : 0.85})`,
            opacity: isActive ? 1 : 0.6,
            // DO NOT USE BLUR HERE - it breaks hardware 3D preserve-3d sorting!
            filter: isActive ? 'none' : 'brightness(0.4)',
            zIndex: isActive ? 10 : 5 - Math.floor(absOffset),
            boxShadow: isActive
                ? '0 30px 80px rgba(9, 23, 61, 0.6), 0 0 0 1px rgba(255, 255, 255, 0.2) inset'
                : 'none',
            border: isActive ? '1px solid rgba(255,255,255,0.4)' : '1px solid rgba(255,255,255,0.05)',
            overflow: 'hidden',
            pointerEvents: absOffset > 1.5 ? 'none' : 'auto',
            background: isActive ? '#09173d' : 'rgba(9, 23, 61, 0.5)',
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden'
        }}
            onMouseEnter={isActive ? (e) => { e.currentTarget.style.transform = `rotateY(${angle}deg) translateZ(calc(${radius} + 4rem)) scale(1.02)`; e.currentTarget.style.boxShadow = '0 40px 100px rgba(9, 23, 61, 0.8), 0 0 0 1.5px rgba(255, 255, 255, 0.3) inset'; } : undefined}
            onMouseLeave={isActive ? (e) => { e.currentTarget.style.transform = `rotateY(${angle}deg) translateZ(${zTranslate}) scale(1)`; e.currentTarget.style.boxShadow = '0 30px 80px rgba(9, 23, 61, 0.6), 0 0 0 1px rgba(255, 255, 255, 0.2) inset'; } : undefined}
        >
            {/* Compressed image */}
            <img src={optimized} alt={moment.caption || ''} decoding="async"
                style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />

            {/* Glass Overlays */}
            <div style={{ position: 'absolute', inset: 0, background: isActive ? 'none' : 'rgba(9, 23, 61, 0.2)', transition: 'background 0.5s ease' }} />

            {/* Caption on active card */}
            <div style={{
                position: 'absolute', bottom: 0, left: 0, right: 0,
                padding: 'clamp(1rem, 3vw, 1.5rem)',
                background: 'linear-gradient(to top, rgba(9, 23, 61, 0.9) 0%, rgba(9,23,61,0.4) 60%, transparent 100%)',
                color: 'white', opacity: isActive ? 1 : 0,
                transform: isActive ? 'translateY(0)' : 'translateY(1rem)',
                transition: 'all 0.6s cubic-bezier(0.2, 0.8, 0.2, 1) 0.1s',
            }}>
                {moment.eventTitle && (
                    <div style={{ fontSize: 'clamp(0.65rem, 2vw, 0.75rem)', textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: '0.25rem', opacity: 0.8, fontWeight: 600 }}>
                        {moment.eventTitle}
                    </div>
                )}
                <div style={{ fontSize: 'clamp(0.9rem, 3vw, 1.1rem)', fontWeight: 400, fontFamily: "'Playfair Display', serif", lineHeight: 1.4 }}>
                    {moment.caption}
                </div>
            </div>
            {/* Vintage borders (Subtle) */}
            <div style={{ position: 'absolute', top: '1rem', left: '1rem', width: '1.25rem', height: '1.25rem', borderTop: '1px solid rgba(255,255,255,0.5)', borderLeft: '1px solid rgba(255,255,255,0.5)', opacity: isActive ? 1 : 0, transition: 'opacity 0.5s' }} />
            <div style={{ position: 'absolute', bottom: '1rem', right: '1rem', width: '1.25rem', height: '1.25rem', borderBottom: '1px solid rgba(255,255,255,0.5)', borderRight: '1px solid rgba(255,255,255,0.5)', opacity: isActive ? 1 : 0, transition: 'opacity 0.5s' }} />
        </div>
    );
});

// ========== MOMENTS CAROUSEL (clean card-stack, no z-index issues) ==========
export function MomentsCarousel({ capturedMoments, activeMomentIndex, setActiveMomentIndex }) {
    if (!capturedMoments || capturedMoments.length === 0) return null;

    return (
        <div style={{
            padding: 'clamp(60px, 12vw, 100px) 0',
            position: 'relative',
            zIndex: 2,
            overflow: 'hidden',
            background: 'linear-gradient(to bottom, transparent, rgba(9, 23, 61, 0.03), transparent)'
        }}>
            {/* Ambient Background Glow */}
            <div style={{
                position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
                width: '60vw', height: '60vw',
                background: 'radial-gradient(circle, rgba(9, 23, 61, 0.08) 0%, transparent 70%)',
                filter: 'blur(100px)', pointerEvents: 'none', zIndex: -1
            }} />

            <div style={{
                maxWidth: '1200px', margin: '0 auto', position: 'relative',
                height: 'clamp(20rem, 50vw, 36rem)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                perspective: '1500px',
                transformStyle: 'preserve-3d'
            }}>
                {/* Orbital Engine: Centered 3D Origin */}
                <div style={{
                    position: 'absolute', top: '50%', left: '50%', width: 0, height: 0,
                    transformStyle: 'preserve-3d',
                    // Nullify the active card's translateZ to keep it centered on screen
                    transform: 'translateZ(calc(-1 * clamp(25rem, 75vw, 45rem)))'
                }}>
                    {capturedMoments.map((moment, index) => (
                        <MomentSlide
                            key={moment.id || index}
                            moment={moment}
                            index={index}
                            activeIndex={activeMomentIndex}
                            total={capturedMoments.length}
                            onClick={() => setActiveMomentIndex(index)}
                        />
                    ))}
                </div>
            </div>

            {/* Carousel Navigation Dot Indicators */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: 'clamp(0.5rem, 2.5vw, 1rem)', marginTop: 'clamp(2rem, 6vw, 3rem)', flexWrap: 'wrap', padding: '0 1rem' }}>
                {capturedMoments.map((_, index) => (
                    <div
                        key={index}
                        onClick={() => setActiveMomentIndex(index)}
                        style={{
                            width: activeMomentIndex === index ? 'clamp(1.5rem, 5vw, 2.5rem)' : 'clamp(0.5rem, 2vw, 0.65rem)',
                            height: 'clamp(0.5rem, 2vw, 0.65rem)',
                            borderRadius: '0.5rem',
                            background: activeMomentIndex === index ? '#09173d' : 'rgba(9, 23, 61, 0.15)',
                            cursor: 'pointer',
                            transition: 'all 0.4s ease-out'
                        }}
                    />
                ))}
            </div>
            <style>{`
                @keyframes float {
                    0% { transform: translateX(0) scale(1) rotateY(0) translateY(0); }
                    50% { transform: translateX(0) scale(1.02) rotateY(0) translateY(-15px); }
                    100% { transform: translateX(0) scale(1) rotateY(0) translateY(0); }
                }
            `}</style>
        </div>
    );
}

// ========== TIMELINE SECTION ==========
export function TimelineSection({ timelineRef, events, scrollProgress, activeTimelineCard, setSelectedEvent }) {
    return (
        <div ref={timelineRef} style={{ maxWidth: '800px', margin: '60px auto', padding: '0 20px', position: 'relative', zIndex: 2 }}>
            <svg style={{ position: 'absolute', left: '50%', top: 0, height: '100%', width: '200px', transform: 'translateX(-50%)', zIndex: 0, pointerEvents: 'none' }} viewBox="0 0 200 2000" preserveAspectRatio="none">
                <path d="M100,0 Q120,250 100,500 Q80,750 100,1000 Q120,1250 100,1500 Q80,1750 100,2000" stroke="rgba(9, 23, 61, 0.08)" strokeWidth="3" fill="none" />
                <path d="M100,0 Q120,250 100,500 Q80,750 100,1000 Q120,1250 100,1500 Q80,1750 100,2000" stroke="url(#timelineGradient)" strokeWidth="3" fill="none" strokeDasharray="2000" strokeDashoffset={2000 - (scrollProgress * 2000)} style={{ transition: 'stroke-dashoffset 0.1s ease-out', filter: 'drop-shadow(0 0 12px rgba(9, 23, 61, 0.3))' }} />
                <defs><linearGradient id="timelineGradient" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stopColor="#09173d" /><stop offset="100%" stopColor="#1a237e" /></linearGradient></defs>
            </svg>
            {events.map((event, index) => (
                <EventCard key={index} event={event} index={index} onEventClick={setSelectedEvent} isActive={activeTimelineCard === index} />
            ))}
        </div>
    );
}

// ========== SCROLL-TRIGGERED ANIMATED SECTION WRAPPER ==========
function ScrollReveal({ children, style = {}, delay = 0 }) {
    const ref = React.useRef(null);
    const [visible, setVisible] = useState(false);
    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } }, { threshold: 0.15 });
        obs.observe(el);
        return () => obs.disconnect();
    }, []);
    return (
        <div ref={ref} style={{
            ...style,
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0)' : 'translateY(40px)',
            transition: `opacity 0.7s ease ${delay}s, transform 0.7s ease ${delay}s`,
            willChange: 'opacity, transform'
        }}>{children}</div>
    );
}

// ========== DYNAMIC AMBIENT LIGHTBOX ==========
function MomentLightbox({ moment, onClose, event }) {
    const isVideo = moment.type === 'video';
    const videoRef = React.useRef(null);

    // Close on escape
    useEffect(() => {
        const handleEsc = (e) => { if (e.key === 'Escape') onClose(); };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [onClose]);

    return (
        <div style={{
            position: 'fixed', inset: 0, zIndex: 9999,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: 'rgba(0,0,0,0.9)', backdropFilter: 'blur(10px)',
            animation: 'fadeIn 0.3s ease-out'
        }} onClick={onClose}>
            {/* Close button */}
            <button onClick={onClose} style={{
                position: 'absolute', top: '24px', right: '24px',
                background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '50%',
                width: '48px', height: '48px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: 'white', fontSize: '24px', cursor: 'pointer', zIndex: 10,
                transition: 'background 0.2s', backdropFilter: 'blur(5px)'
            }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'}
                onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}>
                ×
            </button>

            {/* Content Container with Ambient Glow */}
            <div style={{
                position: 'relative', width: '90%', maxWidth: '1000px', maxHeight: '90vh',
                display: 'flex', flexDirection: 'column', alignItems: 'center',
                // Prevent click on content from closing
            }} onClick={e => e.stopPropagation()}>

                {/* Ambient Background (behind image) */}
                {!isVideo && (
                    <div style={{
                        position: 'absolute', inset: '-20px', zIndex: -1,
                        background: `url(${moment.src}) center/cover no-repeat`,
                        filter: 'blur(40px) brightness(0.6) saturate(1.2)',
                        opacity: 0.5, borderRadius: '30px',
                        transform: 'scale(1.05)', transition: 'all 0.5s ease'
                    }} />
                )}

                {/* Main Media */}
                <div style={{
                    position: 'relative', width: '100%', height: 'auto', maxHeight: '80vh',
                    borderRadius: '16px', overflow: 'hidden',
                    boxShadow: `0 40px 80px -20px ${event.color}60`,
                    animation: 'zoomIn 0.4s ease-out'
                }}>
                    {isVideo ? (
                        <video src={moment.src} controls autoPlay muted playsInline
                            style={{ width: '100%', height: '100%', maxHeight: '80vh', objectFit: 'contain', display: 'block', background: 'black' }} />
                    ) : (
                        <img src={moment.src} alt={moment.caption}
                            style={{ width: '100%', height: '100%', maxHeight: '80vh', objectFit: 'contain', display: 'block', background: '#00000040' }} />
                    )}
                </div>

                {/* Caption - Refined & Animated */}
                {moment.caption && (
                    <div style={{
                        marginTop: '24px', padding: '16px 24px',
                        background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(12px)',
                        borderRadius: '30px', border: `1px solid ${event.color}40`,
                        color: 'white', fontSize: '18px', fontWeight: 500, letterSpacing: '0.5px',
                        textAlign: 'center', maxWidth: '80%',
                        animation: 'slideUp 0.5s ease 0.2s backwards',
                        boxShadow: '0 8px 32px rgba(0,0,0,0.2)'
                    }}>
                        {moment.caption}
                    </div>
                )}
            </div>

            <style>{`
                @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
                @keyframes zoomIn { from { transform: scale(0.9); opacity: 0; } to { transform: scale(1); opacity: 1; } }
                @keyframes slideUp { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
            `}</style>
        </div>
    );
}

// ========== COMPRESSED MOMENT CARD FOR GRID ==========
const OptimizedMomentCard = React.memo(function OptimizedMomentCard({ item, index, event, onClick }) {
    const isVideo = item.type === 'video';
    const displaySrc = item.thumbnail || item.src;
    const optimized = useOptimizedImage(!isVideo ? displaySrc : null, 500, 600, 0.65, false);
    const [tilt, setTilt] = useState({ x: 0, y: 0 });
    const cardRef = useRef(null);

    const handleMouseMove = (e) => {
        if (!window.matchMedia('(min-width: 1024px)').matches || !cardRef.current) return;
        const rect = cardRef.current.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        setTilt({ x: x * 15, y: -y * 15 });
    };

    const handleMouseLeave = () => {
        setTilt({ x: 0, y: 0 });
    };

    return (
        <ScrollReveal delay={Math.min(index * 0.08, 0.4)} style={{ height: '100%' }}>
            <div
                ref={cardRef}
                onClick={() => onClick(item)}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                className="moment-card"
                style={{
                    position: 'relative', borderRadius: 'clamp(1rem, 3vw, 1.5rem)', overflow: 'hidden',
                    cursor: 'pointer', height: '100%', minHeight: 'clamp(10rem, 30vw, 16rem)',
                    transition: 'transform 0.3s cubic-bezier(0.2, 0.8, 0.2, 1), box-shadow 0.3s ease',
                    transform: `perspective(1000px) rotateX(${tilt.y}deg) rotateY(${tilt.x}deg) scale(${tilt.x !== 0 ? 1.02 : 1})`,
                    boxShadow: tilt.x !== 0
                        ? `0 20px 40px rgba(9, 23, 61, 0.25), 0 0 0 1px rgba(255,255,255,0.1) inset`
                        : '0 8px 24px rgba(0,0,0,0.08)',
                    background: '#09173d'
                }}
            >
                {/* Media Container */}
                <div style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
                    {isVideo ? (
                        <video src={item.src} muted loop playsInline preload="metadata"
                            style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.8 }}
                            onMouseEnter={e => e.currentTarget.play()}
                            onMouseLeave={e => { e.currentTarget.pause(); e.currentTarget.currentTime = 0; }} />
                    ) : (
                        <img src={optimized || displaySrc} alt=""
                            style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.9, transition: 'transform 0.6s ease' }} />
                    )}
                </div>

                {/* Overlays */}
                <div style={{
                    position: 'absolute', inset: 0,
                    background: 'linear-gradient(to top, rgba(9, 23, 61, 0.9) 0%, rgba(9, 23, 61, 0.2) 50%, transparent 100%)',
                    opacity: 0.8
                }} />

                {/* Shine Effect */}
                <div style={{
                    position: 'absolute', inset: 0,
                    background: `radial-gradient(circle at ${(tilt.x + 15) * 3}% ${(tilt.y + 15) * 3}%, rgba(255,255,255,0.15), transparent 60%)`,
                    pointerEvents: 'none',
                    opacity: tilt.x !== 0 ? 1 : 0,
                    transition: 'opacity 0.3s'
                }} />

                {/* Content */}
                <div style={{ position: 'absolute', bottom: '1.25rem', left: '1.25rem', right: '1.25rem', zIndex: 2 }}>
                    <div style={{ fontSize: 'clamp(0.65rem, 1.5vw, 0.75rem)', color: 'white', opacity: 0.8, textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: '0.5rem', fontWeight: 600 }}>
                        {item.eventTitle || 'Memory'}
                    </div>
                    <div style={{ fontSize: 'clamp(0.9rem, 2vw, 1.1rem)', color: 'white', fontWeight: 500, fontFamily: "'Playfair Display', serif", lineHeight: 1.3 }}>
                        {item.caption}
                    </div>
                </div>

                {/* Play Icon for Videos */}
                {isVideo && (
                    <div style={{ position: 'absolute', top: '1.25rem', right: '1.25rem', width: '2rem', height: '2rem', borderRadius: '50%', background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(5px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <div style={{ width: 0, height: 0, borderTop: '0.3rem solid transparent', borderBottom: '0.3rem solid transparent', borderLeft: '0.5rem solid white', marginLeft: '0.15rem' }} />
                    </div>
                )}
            </div>
        </ScrollReveal>
    );
});

// ========== CAPTURED MOMENTS GRID (mobile-optimized + compressed) ==========
export function CapturedMomentsGrid({ capturedMoments, event }) {
    const [selectedMoment, setSelectedMoment] = useState(null);

    return (
        <div style={{
            padding: 'clamp(80px, 15vw, 120px) clamp(20px, 5vw, 40px)',
            background: 'linear-gradient(180deg, #fff 0%, rgba(9, 23, 61, 0.05) 50%, #fff 100%)',
            position: 'relative', zIndex: 2
        }}>
            {/* Decorative elements */}
            <div style={{ position: 'absolute', top: '10%', right: '5%', width: '300px', height: '300px', background: 'radial-gradient(circle, rgba(9, 23, 61, 0.03), transparent)', filter: 'blur(60px)', pointerEvents: 'none' }} />
            <div style={{ position: 'absolute', bottom: '20%', left: '0', width: '250px', height: '250px', background: 'radial-gradient(circle, rgba(9, 23, 61, 0.02), transparent)', filter: 'blur(50px)', pointerEvents: 'none' }} />

            <ScrollReveal>
                <div style={{ textAlign: 'center', marginBottom: 'clamp(60px, 12vw, 100px)' }}>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', marginBottom: '20px', padding: '8px 20px', background: 'rgba(9, 23, 61, 0.05)', borderRadius: '30px', border: '1px solid rgba(9, 23, 61, 0.1)' }}>
                        <Camera size={14} color="#09173d" />
                        <span style={{ fontSize: '11px', letterSpacing: '2px', fontWeight: 600, color: '#09173d', textTransform: 'uppercase' }}>Visual Anthology</span>
                    </div>
                    <h2 style={{ fontSize: 'clamp(36px, 8vw, 76px)', fontWeight: 400, margin: '0 0 24px 0', color: '#09173d', fontFamily: "'Playfair Display', 'Georgia', serif", lineHeight: 1.1 }}>Captured Moments</h2>
                    <p style={{ fontSize: 'clamp(16px, 3.5vw, 20px)', color: '#09173d', opacity: 0.7, maxWidth: '600px', margin: '0 auto', fontStyle: 'italic' }}>Fragments of joy, etched into eternity</p>
                </div>
            </ScrollReveal>

            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                gap: 'clamp(20px, 4vw, 40px)',
                maxWidth: '1300px',
                margin: '0 auto',
                alignItems: 'start'
            }}>
                {capturedMoments.map((moment, index) => (
                    <div key={moment.id || index} style={{
                        transform: index % 2 === 0 ? 'translateY(0)' : 'translateY(clamp(0px, 5vw, 40px))',
                        marginTop: index % 3 === 0 ? 'clamp(0px, 3vw, 20px)' : '0'
                    }}>
                        <OptimizedMomentCard
                            item={moment}
                            index={index}
                            event={event || { color: '#09173d' }}
                            onClick={setSelectedMoment}
                        />
                    </div>
                ))}
            </div>

            {/* Lightbox Modal */}
            {selectedMoment && (
                <MomentLightbox
                    moment={selectedMoment}
                    event={event || { color: '#8B4513' }}
                    onClose={() => setSelectedMoment(null)}
                />
            )}
            <style>{`
                @keyframes shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }
            `}</style>
        </div>
    );
}

// ========== REVIEWS CAROUSEL (Auto-scrolling) ==========
export const ReviewsCarousel = ({ reviews, eventColor, fallbackText = "Joining the conversation... share your memory below!" }) => {
    const [activeIndex, setActiveIndex] = useState(0);
    const total = reviews?.length || 0;

    useEffect(() => {
        if (total <= 1) return;
        const timer = setInterval(() => {
            setActiveIndex((prev) => (prev + 1) % total);
        }, 5000);
        return () => clearInterval(timer);
    }, [total]);

    return (
        <div style={{ padding: 'clamp(30px, 6vw, 40px) 0', position: 'relative', zIndex: 2 }}>
            <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                <div style={{ position: 'relative', minHeight: 'clamp(150px, 30vw, 200px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {total > 0 ? (
                        reviews.map((review, index) => (
                            <div key={index} style={{
                                position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                                opacity: activeIndex === index ? 1 : 0,
                                transform: activeIndex === index ? 'translateX(0)' : (index < activeIndex ? 'translateX(-50px)' : 'translateX(50px)'),
                                transition: 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
                                pointerEvents: activeIndex === index ? 'auto' : 'none',
                            }}>
                                <p style={{ fontSize: 'clamp(18px, 4vw, 28px)', lineHeight: 1.5, color: '#09173d', fontStyle: 'italic', textAlign: 'center', marginBottom: '24px', fontFamily: "'Playfair Display', serif" }}>
                                    "{review.text}"
                                </p>
                                <div style={{ fontWeight: 700, fontSize: 'clamp(14px, 2.5vw, 16px)', color: eventColor, textTransform: 'uppercase', letterSpacing: '2px' }}>
                                    — {review.name}
                                </div>
                            </div>
                        ))
                    ) : (
                        <div style={{ textAlign: 'center', opacity: 0.5 }}>
                            <p style={{ fontSize: 'clamp(16px, 3.5vw, 20px)', color: '#09173d', fontStyle: 'italic', fontFamily: "'Playfair Display', serif" }}>
                                {fallbackText}
                            </p>
                        </div>
                    )}
                </div>

                {/* Progress Indicators */}
                {total > 1 && (
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '20px' }}>
                        {reviews.map((_, index) => (
                            <div key={index} onClick={() => setActiveIndex(index)} style={{
                                width: activeIndex === index ? '24px' : '8px', height: '8px', borderRadius: '4px',
                                background: activeIndex === index ? eventColor : 'rgba(9, 23, 61, 0.1)',
                                cursor: 'pointer', transition: 'all 0.3s ease'
                            }} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

// ========== CINEMATIC VIDEO PLAYER SECTION ==========
function CinematicVideoSection({ event }) {
    const sectionRef = React.useRef(null);
    const videoRef = React.useRef(null);
    const [scrollPct, setScrollPct] = useState(0);
    const [isInView, setIsInView] = useState(false);

    // Get all video items from event media
    const videos = (event.media || []).filter(m => m.type === 'video');
    const heroVid = event.heroVideo;
    const [activeVid, setActiveVid] = useState(0);
    const hasVideos = heroVid || videos.length > 0;

    // Scroll parallax for text reveal
    useEffect(() => {
        const el = sectionRef.current;
        if (!el) return;
        const onScroll = () => {
            const rect = el.getBoundingClientRect();
            const vh = window.innerHeight;
            const pct = Math.max(0, Math.min(1, 1 - (rect.top / vh)));
            setScrollPct(pct);
        };
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    // Auto-play/pause video when in viewport
    useEffect(() => {
        const el = sectionRef.current;
        if (!el) return;
        const obs = new IntersectionObserver(([e]) => {
            setIsInView(e.isIntersecting);
            const vid = videoRef.current;
            if (vid) { e.isIntersecting ? vid.play().catch(() => { }) : vid.pause(); }
        }, { threshold: 0.3 });
        obs.observe(el);
        return () => obs.disconnect();
    }, []);

    // No videos at all? Hide section
    if (!hasVideos) return null;
    const currentSrc = activeVid === 0 && heroVid ? heroVid : (videos[activeVid > 0 ? activeVid - 1 : 0]?.src || heroVid);
    const allVideos = heroVid ? [{ src: heroVid, caption: 'Highlights' }, ...videos] : videos;

    return (
        <div ref={sectionRef} style={{ padding: 'clamp(80px, 15vw, 140px) clamp(16px, 4vw, 40px)', position: 'relative', zIndex: 2, background: `linear-gradient(180deg, rgba(255, 255, 255, 0.4), rgba(9, 23, 61, 0.05) 50%, rgba(255, 255, 255, 0.4))`, overflow: 'hidden' }}>
            {/* Ambient glow */}
            <div style={{ position: 'absolute', top: '20%', left: '-10%', width: '50%', height: '60%', background: `radial-gradient(ellipse, rgba(9, 23, 61, 0.05), transparent)`, filter: 'blur(80px)', pointerEvents: 'none' }} />
            <div style={{ position: 'absolute', bottom: '10%', right: '-10%', width: '40%', height: '50%', background: `radial-gradient(ellipse, rgba(9, 23, 61, 0.03), transparent)`, filter: 'blur(60px)', pointerEvents: 'none' }} />

            <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                {/* Scroll-reveal heading */}
                <div style={{ textAlign: 'center', marginBottom: 'clamp(48px, 10vw, 80px)' }}>
                    <ScrollReveal>
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', marginBottom: 'clamp(16px, 3vw, 24px)', padding: '8px 20px', background: 'rgba(9, 23, 61, 0.08)', border: '1px solid rgba(9, 23, 61, 0.1)', borderRadius: '30px' }}>
                            <Camera style={{ width: '1rem', height: '1rem', color: '#09173d' }} />
                            <span style={{ fontSize: 'clamp(11px, 2.2vw, 13px)', letterSpacing: '2px', color: '#09173d', fontWeight: 600, textTransform: 'uppercase' }}>Cinematic Rewind</span>
                        </div>
                    </ScrollReveal>
                    <ScrollReveal delay={0.1}>
                        <h2 style={{
                            fontSize: 'clamp(36px, 8vw, 80px)', fontWeight: 400, margin: '0 0 clamp(12px, 2.5vw, 20px)', color: event.color,
                            fontFamily: "'Playfair Display', 'Georgia', serif", lineHeight: 1.1,
                            opacity: Math.min(1, scrollPct * 2.5),
                            transform: `translateY(${Math.max(0, 20 - scrollPct * 40)}px)`,
                            transition: 'opacity 0.1s ease, transform 0.1s ease'
                        }}>Relive the Experience</h2>
                    </ScrollReveal>
                    <ScrollReveal delay={0.2}>
                        <p style={{ fontSize: 'clamp(15px, 3.2vw, 19px)', color: '#09173d', opacity: 0.8, maxWidth: '550px', margin: '0 auto', lineHeight: 1.7 }}>
                            Watch the raw, unfiltered highlights — every beat, every cheer, every unforgettable moment
                        </p>
                    </ScrollReveal>
                </div>

                {/* Main video player — cinematic frame */}
                <ScrollReveal delay={0.15}>
                    <div style={{
                        position: 'relative', borderRadius: 'clamp(16px, 3vw, 28px)', overflow: 'hidden',
                        boxShadow: isInView
                            ? `0 30px 80px rgba(9, 23, 61, 0.2), 0 0 0 1px rgba(9, 23, 61, 0.1)`
                            : `0 20px 50px rgba(0,0,0,0.1)`,
                        transition: 'box-shadow 0.6s ease',
                        aspectRatio: '16/9', background: '#000', maxWidth: '1000px', margin: '0 auto'
                    }}>
                        <video ref={videoRef} key={currentSrc} src={currentSrc}
                            controls muted loop playsInline preload="metadata"
                            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                        {/* Top film-grain overlay */}
                        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(0,0,0,0.15) 0%, transparent 8%, transparent 92%, rgba(0,0,0,0.15) 100%)', pointerEvents: 'none' }} />
                    </div>
                </ScrollReveal>

                {/* Video selector thumbnails (only show if >1 video) */}
                {allVideos.length > 1 && (
                    <ScrollReveal delay={0.25}>
                        <div style={{ display: 'flex', gap: 'clamp(10px, 2vw, 16px)', justifyContent: 'center', marginTop: 'clamp(24px, 5vw, 40px)', flexWrap: 'wrap', padding: '0 clamp(8px, 2vw, 16px)' }}>
                            {allVideos.map((v, i) => (
                                <button key={i} onClick={() => setActiveVid(i)} style={{
                                    padding: 'clamp(8px, 1.8vw, 12px) clamp(16px, 3.5vw, 24px)',
                                    borderRadius: '30px', border: `2px solid ${activeVid === i ? '#09173d' : 'rgba(9, 23, 61, 0.1)'}`,
                                    background: activeVid === i ? '#09173d' : 'rgba(255, 255, 255, 0.7)',
                                    color: activeVid === i ? 'white' : '#09173d',
                                    fontSize: 'clamp(11px, 2.3vw, 13px)', fontWeight: 600, cursor: 'pointer',
                                    transition: 'all 0.3s ease', letterSpacing: '0.5px',
                                    boxShadow: activeVid === i ? `0 4px 16px rgba(9, 23, 61, 0.2)` : 'none',
                                    display: 'flex', alignItems: 'center', gap: '6px', whiteSpace: 'nowrap'
                                }}>
                                    <span style={{ fontSize: '0.85em' }}>▶</span> {v.caption || `Clip ${i + 1}`}
                                </button>
                            ))}
                        </div>
                    </ScrollReveal>
                )}
            </div>
        </div>
    );
}



// ========== EVENT DETAIL PAGE (ultra attractive with dynamic loading) ==========
export function EventDetailPage({ event, onBack, useExploreMode = false }) {
    const { media: dynamicMedia, loading: mediaLoading } = useEventMedia(event.folder);

    React.useLayoutEffect(() => {
        // Force scroll to top immediately
        if ('scrollRestoration' in window.history) {
            window.history.scrollRestoration = 'manual';
        }
        window.scrollTo(0, 0);
        document.body.scrollTop = 0;
        document.documentElement.scrollTop = 0;

        const t = setTimeout(() => {
            window.scrollTo(0, 0);
        }, 50);
        return () => clearTimeout(t);
    }, []);

    // Merge dynamic media from Cloudinary with static metadata (captions) from event.media
    const galleryItems = React.useMemo(() => {
        const staticMedia = (useExploreMode ? event.media : event.images) || [];

        if (!dynamicMedia || dynamicMedia.length === 0) {
            // Fallback to static if dynamic not loaded yet
            return staticMedia.map(item => ({
                ...item,
                type: item.type || 'image',
                thumbnail: item.src.includes('/image/upload/') ? item.src.replace('/image/upload/', '/image/upload/w_500,f_auto,q_auto/') : item.src
            }));
        }

        // Try to match dynamic media with static captions using normalized filename comparison
        return dynamicMedia.map(item => {
            const dynamicName = item.public_id.split('/').pop().toLowerCase().replace(/[\s()_-]/g, '');

            const staticMatch = staticMedia.find(s => {
                const staticName = s.src.split('/').pop().split('.')[0].toLowerCase().replace(/[\s()_-]/g, '');
                return staticName === dynamicName || s.src.toLowerCase().includes(dynamicName);
            });

            // Create thumbnail URL using Cloudinary transforms
            const thumbnail = item.type === 'image'
                ? item.src.replace('/image/upload/', '/image/upload/w_500,f_auto,q_auto/')
                : item.src; // Keep original for video posters for now or add poster transform

            return {
                ...item,
                thumbnail,
                caption: staticMatch?.caption || item.caption || `Memory from ${event.title}`
            };
        });
    }, [dynamicMedia, event.media, event.images, event.title, useExploreMode]);

    return (
        <div style={{ minHeight: '100vh', background: 'rgba(255, 255, 255, 0.3)', fontFamily: "'Crimson Text', 'Georgia', serif", overflowX: 'hidden', color: '#333' }}>
            <GrainOverlay />
            {/* Back Button */}
            <button onClick={onBack} style={{ position: 'fixed', top: 'clamp(16px, 4vw, 32px)', left: 'clamp(16px, 4vw, 32px)', padding: 'clamp(10px, 2.5vw, 12px) clamp(16px, 4vw, 20px)', background: 'rgba(255, 255, 255, 0.9)', border: `2px solid rgba(9, 23, 61, 0.2)`, borderRadius: '50px', fontSize: 'clamp(14px, 3vw, 16px)', fontWeight: 600, color: '#09173d', cursor: 'pointer', transition: 'all 0.3s ease', zIndex: 10001, backdropFilter: 'blur(10px)', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', display: 'flex', alignItems: 'center', gap: '8px', letterSpacing: '1px' }}
                onMouseEnter={(e) => { e.currentTarget.style.background = '#09173d'; e.currentTarget.style.color = 'white'; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255, 255, 255, 0.9)'; e.currentTarget.style.color = '#09173d'; }}>← Back</button>

            {/* Hero with real cover image */}
            <div style={{ height: '100vh', minHeight: '-webkit-fill-available', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                <img src={event.coverImage} alt={event.title} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
                <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(to bottom, ${event.color}cc 0%, ${event.color}ee 100%)` }} />
                <div style={{ position: 'relative', zIndex: 2, textAlign: 'center', color: 'white', maxWidth: '1000px', padding: '0 clamp(20px, 5vw, 40px)' }}>
                    <div style={{ fontSize: 'clamp(12px, 3vw, 16px)', letterSpacing: 'clamp(2px, 0.5vw, 4px)', textTransform: 'uppercase', marginBottom: 'clamp(16px, 3vw, 20px)', opacity: 0.9, fontWeight: 600 }}>{event.date}</div>
                    <h1 style={{ fontSize: 'clamp(36px, 10vw, 120px)', fontWeight: 600, margin: '0 0 clamp(20px, 4vw, 32px) 0', fontFamily: "'Playfair Display', 'Georgia', serif", lineHeight: 1.1 }}>{event.title}</h1>
                    <p style={{ fontSize: 'clamp(16px, 4vw, 24px)', lineHeight: 1.6, maxWidth: '700px', margin: '0 auto clamp(32px, 6vw, 48px)', opacity: 0.95 }}>{event.fullDescription}</p>
                    <div style={{ display: 'flex', gap: 'clamp(16px, 4vw, 32px)', justifyContent: 'center', flexWrap: 'wrap' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: 'clamp(14px, 3vw, 18px)' }}><Clock style={{ width: 'clamp(20px, 4vw, 24px)', height: 'clamp(20px, 4vw, 24px)' }} /><span>{event.time}</span></div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: 'clamp(14px, 3vw, 18px)' }}><MapPin style={{ width: 'clamp(20px, 4vw, 24px)', height: 'clamp(20px, 4vw, 24px)' }} /><span>{event.location}</span></div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: 'clamp(14px, 3vw, 18px)' }}><Users style={{ width: 'clamp(20px, 4vw, 24px)', height: 'clamp(20px, 4vw, 24px)' }} /><span>{event.attendees} Attendees</span></div>
                    </div>
                </div>
                <div style={{ position: 'absolute', bottom: 'clamp(24px, 5vw, 40px)', left: '50%', transform: 'translateX(-50%)', animation: 'bounce 2s infinite', zIndex: 10, pointerEvents: 'none' }}>
                    <div style={{ width: '2px', height: 'clamp(40px, 8vw, 60px)', background: 'rgba(255,255,255,0.5)', margin: '0 auto 12px', borderRadius: '2px' }} />
                    <div style={{ fontSize: 'clamp(11px, 2.5vw, 14px)', color: 'white', opacity: 0.7, letterSpacing: '2px', textTransform: 'uppercase' }}>Scroll</div>
                </div>
            </div>

            {/* Cinematic Video Section */}
            <CinematicVideoSection event={event} />

            {/* Highlights */}
            <div style={{ padding: 'clamp(60px, 12vw, 80px) clamp(20px, 5vw, 40px)', background: `linear-gradient(to bottom, transparent, ${event.color}08)`, position: 'relative', zIndex: 2 }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                    <ScrollReveal>
                        <h3 style={{ fontSize: 'clamp(28px, 5vw, 56px)', fontWeight: 400, textAlign: 'center', marginBottom: 'clamp(40px, 8vw, 60px)', color: event.color, fontFamily: "'Playfair Display', 'Georgia', serif" }}>Event Highlights</h3>
                    </ScrollReveal>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(220px, 100%), 1fr))', gap: 'clamp(16px, 3vw, 24px)' }}>
                        {event.highlights.map((highlight, index) => (
                            <ScrollReveal key={index} delay={index * 0.08}>
                                <div style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.9), rgba(255,255,255,0.6))', padding: 'clamp(24px, 5vw, 32px)', borderRadius: 'clamp(12px, 2.5vw, 16px)', border: `2px solid ${event.color}20`, textAlign: 'center', transition: 'transform 0.4s ease, box-shadow 0.4s ease', cursor: 'pointer', position: 'relative', overflow: 'hidden' }}
                                    onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-8px)'; e.currentTarget.style.boxShadow = `0 20px 40px ${event.color}30`; }}
                                    onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}>
                                    <div style={{ fontSize: 'clamp(15px, 3.5vw, 18px)', fontWeight: 600, color: event.color, lineHeight: 1.5 }}>{highlight}</div>
                                </div>
                            </ScrollReveal>
                        ))}
                    </div>
                </div>
            </div>

            {/* Gallery — dynamic loading */}
            {mediaLoading ? (
                <div style={{ padding: '100px 0', textAlign: 'center', color: event.color }}>
                    <div className="premium-loader">Fetching Treasures...</div>
                </div>
            ) : (
                <CapturedMoments3D capturedMoments={galleryItems} event={event} />
            )}

            {/* Comments & Testimonials Section */}
            <CommentsSection eventId={event.id} eventColor={event.color} testimonials={event.testimonials || []} />

            {/* Footer CTA */}
            <div style={{ padding: 'clamp(60px, 12vw, 80px) clamp(20px, 5vw, 40px)', textAlign: 'center', position: 'relative', zIndex: 2 }}>
                <ScrollReveal>
                    <button onClick={onBack} style={{ padding: 'clamp(14px, 3vw, 16px) clamp(28px, 6vw, 32px)', background: `linear-gradient(135deg, ${event.color}, ${event.color}dd)`, border: 'none', borderRadius: '50px', fontSize: 'clamp(14px, 3vw, 18px)', fontWeight: 600, color: 'white', cursor: 'pointer', transition: 'all 0.4s ease', boxShadow: `0 10px 30px ${event.color}40`, letterSpacing: '1px', textTransform: 'uppercase' }}
                        onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-4px) scale(1.05)'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0) scale(1)'; }}>Explore More Events</button>
                </ScrollReveal>
            </div>

            <style>{`
        @keyframes pulse { 0% { opacity: 0.5; } 50% { opacity: 1; } 100% { opacity: 0.5; } }
        .premium-loader { font-family: 'Playfair Display', serif; font-style: italic; font-size: 1.5rem; animation: pulse 2s infinite; }
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes bounce { 0%, 100% { transform: translateX(-50%) translateY(0); } 50% { transform: translateX(-50%) translateY(-10px); } }
        @media (max-width: 768px) { body { overflow-x: hidden; } * { -webkit-tap-highlight-color: transparent; } button { min-height: 44px; min-width: 44px; } }
        @media (max-width: 480px) { html, body { max-width: 100vw; overflow-x: hidden; } }
      `}</style>
        </div>
    );
}
