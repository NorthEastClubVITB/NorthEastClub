import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Camera } from 'lucide-react';
import { useOptimizedImage } from './useOptimizedImage';

/* ================================================================
   COMPACT SHAPE MOSAIC — hirehuman.ai style (integrated)

   - Two tightly-packed flex rows of cards
   - Mixed shapes: circles, pill-tall, squircles, stadiums
   - One card at a time EXPANDS (flex grows) → neighbors COMPRESS
   - Expanded card morphs to squircle (14px radius)
   - Caption label slides up on active card
   - Auto-cycles sequentially through cards
   - Lightbox on click
   ================================================================ */

// Shape config per card position — cycles through this pattern
const SHAPE_PATTERN = [
    { shape: 'circle', br: '50%', flex: 1 },
    { shape: 'pill-tall', br: '999px', flex: 0.62 },
    { shape: 'squircle', br: '22%', flex: 1 },
    { shape: 'stadium', br: '999px', flex: 1.28 },
    { shape: 'circle', br: '50%', flex: 1 },
    { shape: 'stadium', br: '999px', flex: 1.28 },
    { shape: 'pill-tall', br: '999px', flex: 0.62 },
    { shape: 'squircle', br: '22%', flex: 1 },
    { shape: 'circle', br: '50%', flex: 1 },
    { shape: 'pill-tall', br: '999px', flex: 0.62 },
];

const ACTIVE_FLEX = 3.2;
const ACTIVE_BR = '14px';

// ========== SINGLE CARD ==========
const MomentCard = React.memo(function MomentCard({
    item, index, isActive, shapeConfig, labelVisible, onClick, eventColor
}) {
    const isVideo = item.type === 'video';
    const displaySrc = item.thumbnail || item.src;
    const optimized = useOptimizedImage(!isVideo ? displaySrc : null, 450, 500, 0.65, false);

    const flexVal = isActive ? ACTIVE_FLEX : shapeConfig.flex;
    const br = isActive ? ACTIVE_BR : shapeConfig.br;

    return (
        <div
            onClick={() => onClick(item)}
            style={{
                position: 'relative',
                flex: `${flexVal} ${flexVal} 0`,
                minWidth: 0,
                borderRadius: br,
                overflow: 'hidden',
                cursor: 'pointer',
                transition: [
                    'flex 0.4s cubic-bezier(0.2, 0.8, 0.2, 1)',
                    'border-radius 0.4s cubic-bezier(0.2, 0.8, 0.2, 1)',
                    'box-shadow 0.4s ease-out',
                    'transform 0.4s ease-out'
                ].join(', '),
                boxShadow: isActive
                    ? '0 12px 32px rgba(9, 23, 61, 0.25)'
                    : '0 4px 12px rgba(0,0,0,0.05)',
                willChange: 'flex, border-radius',
            }}
        >
            {/* Media */}
            {isVideo ? (
                <video src={item.src} muted loop playsInline preload="metadata"
                    style={{
                        position: 'absolute', inset: 0,
                        width: '100%', height: '100%', objectFit: 'cover',
                        objectPosition: 'center top', display: 'block',
                        transition: 'transform 0.4s cubic-bezier(0.2, 0.8, 0.2, 1), filter 0.4s ease',
                        transform: isActive ? 'scale(1.05)' : 'scale(1)',
                        filter: isActive
                            ? 'brightness(1) saturate(1.05)'
                            : 'brightness(0.62) saturate(0.7)',
                    }} />
            ) : optimized ? (
                <img src={optimized} alt={item.caption || ''} loading="lazy" decoding="async"
                    style={{
                        position: 'absolute', inset: 0,
                        width: '100%', height: '100%', objectFit: 'cover',
                        objectPosition: 'center top', display: 'block',
                        transition: 'transform 0.4s cubic-bezier(0.2, 0.8, 0.2, 1), filter 0.4s ease',
                        transform: isActive ? 'scale(1.05)' : 'scale(1)',
                        filter: isActive
                            ? 'brightness(1) saturate(1.05)'
                            : 'brightness(0.62) saturate(0.7)',
                    }} />
            ) : (
                <div style={{
                    position: 'absolute', inset: 0,
                    width: '100%', height: '100%',
                    background: `linear-gradient(135deg, ${eventColor}20, ${eventColor}35)`,
                }} />
            )}

            {/* Gradient on active */}
            <div style={{
                position: 'absolute', inset: 0,
                background: isActive
                    ? 'linear-gradient(to top, rgba(0,0,0,0.55) 0%, transparent 58%)'
                    : 'transparent',
                pointerEvents: 'none',
                transition: 'opacity 0.4s ease',
            }} />

            {/* Video badge */}
            {isVideo && isActive && (
                <div style={{
                    position: 'absolute', top: '8px', right: '8px',
                    padding: '3px 8px', borderRadius: '14px',
                    background: 'rgba(220,38,38,0.8)',
                    fontSize: '9px', fontWeight: 700, color: 'white',
                    letterSpacing: '1px', textTransform: 'uppercase',
                    display: 'flex', alignItems: 'center', gap: '4px',
                    animation: 'compFadeIn 0.4s ease 0.3s backwards',
                }}>
                    <span style={{
                        width: '4px', height: '4px', background: 'white',
                        borderRadius: '50%', animation: 'compDotPulse 1.5s ease infinite',
                    }} />
                    VIDEO
                </div>
            )}

            {/* Caption label — pill style */}
            {item.caption && (
                <div style={{
                    position: 'absolute',
                    bottom: 8,
                    left: '50%',
                    transform: `translateX(-50%) translateY(${labelVisible && isActive ? 0 : 8}px)`,
                    background: '#09173d',
                    color: 'white',
                    padding: 'clamp(4px, 1vw, 6px) clamp(16px, 3vw, 24px)',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    borderRadius: 999,
                    fontSize: 'clamp(10px, 1.8vw, 12px)',
                    fontFamily: "'system-ui', -apple-system, sans-serif",
                    fontWeight: 700,
                    letterSpacing: '0.06em',
                    textTransform: 'uppercase',
                    whiteSpace: 'nowrap',
                    pointerEvents: 'none',
                    opacity: labelVisible && isActive ? 1 : 0,
                    transition: 'opacity 0.3s ease, transform 0.3s ease',
                    maxWidth: '90%',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                }}>
                    {item.caption}
                </div>
            )}
        </div>
    );
});


// ========== LIGHTBOX ==========
function CompactLightbox({ moment, onClose, eventColor }) {
    const isVideo = moment.type === 'video';
    useEffect(() => {
        const esc = (e) => { if (e.key === 'Escape') onClose(); };
        window.addEventListener('keydown', esc);
        return () => window.removeEventListener('keydown', esc);
    }, [onClose]);

    return (
        <div style={{
            position: 'fixed', inset: 0, zIndex: 9999,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: 'rgba(0,0,0,0.94)', backdropFilter: 'blur(24px)',
            animation: 'compFadeIn 0.3s ease-out',
        }} onClick={onClose}>
            <button onClick={onClose} style={{
                position: 'absolute', top: '24px', right: '24px',
                background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '50%', width: '48px', height: '48px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: 'white', fontSize: '24px', cursor: 'pointer', zIndex: 10,
                transition: 'all 0.3s',
            }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.2)'; e.currentTarget.style.transform = 'rotate(90deg)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; e.currentTarget.style.transform = 'rotate(0)'; }}>
                ×
            </button>
            <div style={{
                position: 'relative', width: '90%', maxWidth: '1000px', maxHeight: '90vh',
                display: 'flex', flexDirection: 'column', alignItems: 'center',
            }} onClick={e => e.stopPropagation()}>
                {!isVideo && (
                    <div style={{
                        position: 'absolute', inset: '-40px', zIndex: -1,
                        background: `url(${moment.src}) center/cover no-repeat`,
                        filter: 'blur(60px) brightness(0.4) saturate(1.4)',
                        opacity: 0.5, borderRadius: '30px', transform: 'scale(1.15)',
                    }} />
                )}
                <div style={{
                    position: 'relative', width: '100%', maxHeight: '80vh',
                    borderRadius: '16px', overflow: 'hidden',
                    boxShadow: `0 40px 80px -20px ${eventColor}50`,
                    animation: 'compZoomIn 0.45s cubic-bezier(0.23, 1, 0.32, 1)',
                }}>
                    {isVideo ? (
                        <video src={moment.src} controls autoPlay muted playsInline
                            style={{ width: '100%', maxHeight: '80vh', objectFit: 'contain', display: 'block', background: 'black' }} />
                    ) : (
                        <img src={moment.src} alt={moment.caption}
                            style={{ width: '100%', maxHeight: '80vh', objectFit: 'contain', display: 'block' }} />
                    )}
                </div>
                {moment.caption && (
                    <div style={{
                        marginTop: '20px', padding: '14px 28px',
                        background: 'rgba(255,255,255,0.06)', backdropFilter: 'blur(16px)',
                        borderRadius: '40px', border: `1px solid ${eventColor}30`,
                        color: 'white', fontSize: '17px', fontWeight: 500,
                        textAlign: 'center', maxWidth: '80%',
                        animation: 'compSlideUp 0.5s ease 0.2s backwards',
                    }}>
                        {moment.caption}
                    </div>
                )}
            </div>
            <style>{`
                @keyframes compFadeIn { from { opacity: 0; } to { opacity: 1; } }
                @keyframes compZoomIn { from { transform: scale(0.82) translateY(40px); opacity: 0; } to { transform: scale(1) translateY(0); opacity: 1; } }
                @keyframes compSlideUp { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
            `}</style>
        </div>
    );
}


// ========== MAIN COMPONENT ==========
export default function CapturedMoments3D({ capturedMoments, event }) {
    const [activeIndex, setActiveIndex] = useState(2); // start on 3rd card
    const [labelVisible, setLabelVisible] = useState(true);
    const [selectedMoment, setSelectedMoment] = useState(null);
    const [isRevealed, setIsRevealed] = useState(false);
    const sectionRef = useRef(null);
    const timerRef = useRef(null);
    const total = capturedMoments.length;
    const eventColor = event?.color || '#8B4513';

    // Split into 2 rows
    const mid = Math.ceil(total / 2);
    const row1 = capturedMoments.slice(0, mid);
    const row2 = capturedMoments.slice(mid);

    // Scroll reveal
    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => { if (entry.isIntersecting) setIsRevealed(true); },
            { threshold: 0.1 }
        );
        if (sectionRef.current) observer.observe(sectionRef.current);
        return () => observer.disconnect();
    }, []);

    // Activate with label animation (matching HireHuman exactly)
    const activate = useCallback((idx) => {
        setLabelVisible(false);
        setTimeout(() => {
            setActiveIndex(idx);
            setTimeout(() => setLabelVisible(true), 80);
        }, 220);
    }, []);

    // Auto-cycle sequentially
    const startTimer = useCallback(() => {
        clearInterval(timerRef.current);
        if (selectedMoment || total === 0) return;
        timerRef.current = setInterval(() => {
            setActiveIndex(prev => {
                const next = (prev + 1) % total;
                activate(next);
                return prev; // activate handles the actual update
            });
        }, 2200);
    }, [total, selectedMoment, activate]);

    // Start auto-cycle on reveal
    useEffect(() => {
        if (isRevealed && !selectedMoment) {
            startTimer();
        }
        return () => clearInterval(timerRef.current);
    }, [isRevealed, selectedMoment, startTimer]);

    // Handle click — open lightbox
    const handleClick = useCallback((item) => {
        clearInterval(timerRef.current);
        setSelectedMoment(item);
    }, []);

    const handleCloseLightbox = useCallback(() => {
        setSelectedMoment(null);
    }, []);

    const rowHeight = 'clamp(100px, 22vw, 240px)';
    const gapValue = 'clamp(6px, 1.2vw, 14px)';

    return (
        <div
            ref={sectionRef}
            style={{
                padding: 'clamp(50px, 10vw, 100px) clamp(12px, 3vw, 28px)',
                background: `linear-gradient(180deg, rgba(255, 255, 255, 0.3) 0%, rgba(9, 23, 61, 0.05) 50%, rgba(255, 255, 255, 0.3) 100%)`,
                position: 'relative', zIndex: 2, overflow: 'hidden',
            }}
        >
            {/* Ambient */}
            <div style={{ position: 'absolute', top: '20%', left: '-5%', width: '30%', height: '35%', background: `radial-gradient(ellipse, ${eventColor}08, transparent 70%)`, filter: 'blur(80px)', pointerEvents: 'none' }} />
            <div style={{ position: 'absolute', bottom: '20%', right: '-3%', width: '30%', height: '35%', background: `radial-gradient(ellipse, ${eventColor}05, transparent 70%)`, filter: 'blur(100px)', pointerEvents: 'none' }} />

            {/* Header */}
            <div style={{
                textAlign: 'center', marginBottom: 'clamp(28px, 6vw, 50px)',
                position: 'relative', zIndex: 4,
            }}>
                <Camera style={{ width: 'clamp(20px, 3.5vw, 28px)', height: 'clamp(20px, 3.5vw, 28px)', color: '#09173d', margin: '0 auto clamp(6px, 1vw, 10px)', opacity: 0.3 }} />
                <h2 style={{
                    fontSize: 'clamp(28px, 6vw, 56px)', fontWeight: 300, margin: '0 0 8px',
                    color: '#09173d',
                    fontFamily: "'Playfair Display', 'Georgia', serif", lineHeight: 1,
                }}>
                    Captured <span style={{ fontStyle: 'italic', fontWeight: 600 }}>Moments</span>
                </h2>
                <p style={{
                    fontSize: 'clamp(12px, 2.5vw, 15px)', color: '#09173d',
                    maxWidth: '380px', margin: '0 auto', fontWeight: 400, opacity: 0.6
                }}>
                    Fragments of joy, frozen in time
                </p>
            </div>

            {/* ============ COMPACT MOSAIC ============ */}
            <div style={{
                width: '100%', maxWidth: 'clamp(300px, 90vw, 1000px)', margin: '0 auto',
                background: 'rgba(255, 255, 255, 0.05)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                borderRadius: 'clamp(1.2rem, 3.5vw, 2rem)',
                padding: gapValue,
                boxSizing: 'border-box',
                display: 'flex', flexDirection: 'column',
                gap: gapValue,
                boxShadow: '0 24px 80px rgba(9, 23, 61, 0.15), 0 0 0 1px rgba(255, 255, 255, 0.1) inset',
                position: 'relative', zIndex: 3,
                border: '1px solid rgba(255, 255, 255, 0.05)'
            }}>
                {/* Row 1 */}
                <div style={{
                    display: 'flex', alignItems: 'stretch',
                    gap: gapValue, height: rowHeight,
                    opacity: isRevealed ? 1 : 0,
                    transform: isRevealed ? 'translateY(0)' : 'translateY(24px)',
                    transition: 'opacity 0.6s ease 0.1s, transform 0.6s ease 0.1s',
                }}>
                    {row1.map((moment, i) => {
                        const globalIdx = i;
                        return (
                            <MomentCard
                                key={moment.id || globalIdx}
                                item={moment}
                                index={globalIdx}
                                isActive={activeIndex === globalIdx}
                                shapeConfig={SHAPE_PATTERN[globalIdx % SHAPE_PATTERN.length]}
                                labelVisible={labelVisible}
                                onClick={handleClick}
                                eventColor={eventColor}
                            />
                        );
                    })}
                </div>

                {/* Row 2 */}
                <div style={{
                    display: 'flex', alignItems: 'stretch',
                    gap: gapValue, height: rowHeight,
                    opacity: isRevealed ? 1 : 0,
                    transform: isRevealed ? 'translateY(0)' : 'translateY(24px)',
                    transition: 'opacity 0.6s ease 0.25s, transform 0.6s ease 0.25s',
                }}>
                    {row2.map((moment, i) => {
                        const globalIdx = mid + i;
                        return (
                            <MomentCard
                                key={moment.id || globalIdx}
                                item={moment}
                                index={globalIdx}
                                isActive={activeIndex === globalIdx}
                                shapeConfig={SHAPE_PATTERN[globalIdx % SHAPE_PATTERN.length]}
                                labelVisible={labelVisible}
                                onClick={handleClick}
                                eventColor={eventColor}
                            />
                        );
                    })}
                </div>
            </div>

            {/* Status */}
            <div style={{
                textAlign: 'center', marginTop: 'clamp(16px, 3vw, 28px)',
                fontSize: 'clamp(9px, 1.6vw, 11px)', color: '#09173d',
                letterSpacing: '2px', fontWeight: 600, textTransform: 'uppercase',
                position: 'relative', zIndex: 4, opacity: 0.4
            }}>
                {total} moments · auto
            </div>

            {/* Lightbox */}
            {selectedMoment && (
                <CompactLightbox moment={selectedMoment} eventColor={eventColor} onClose={handleCloseLightbox} />
            )}

            <style>{`
                @keyframes compDotPulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.3; } }
                @keyframes compFadeIn { from { opacity: 0; } to { opacity: 1; } }
            `}</style>
        </div>
    );
}
