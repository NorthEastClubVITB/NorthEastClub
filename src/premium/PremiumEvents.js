import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Camera } from 'lucide-react';
import { eventsData } from './eventsData';
import { GrainOverlay, HeroSection, FeaturedCarousel } from './EventsShared';
import { MomentsCarousel, TimelineSection, CapturedMomentsGrid, EventDetailPage, ReviewsCarousel } from './EventsSections';
import { useMultipleEventMedia } from './useEventMedia';

const PremiumEvents = () => {
    const [scrollProgress, setScrollProgress] = useState(0);
    const [activeCarouselIndex, setActiveCarouselIndex] = useState(0);
    const [activeMomentIndex, setActiveMomentIndex] = useState(0);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [activeTimelineCard, setActiveTimelineCard] = useState(0);
    const timelineRef = useRef(null);

    // List of folders to fetch media from
    const folders = useMemo(() => ['Threads_of_herit_1', 'Uncensored', 'inaug'], []);

    // Fetch all media dynamically from Cloudinary via backend
    const { allMedia: dynamicMoments, loading: mediaLoading } = useMultipleEventMedia(folders);

    // Fallback/Legacy captured moments from static data (if needed or as initial state)
    const staticCapturedMoments = useMemo(() => {
        const allImages = [];
        eventsData.forEach(event => {
            if (event.images) {
                event.images.forEach(img => allImages.push({ ...img, type: 'image', id: 'static-' + allImages.length, eventTitle: event.title }));
            }
        });
        return allImages;
    }, []);

    // Use dynamic moments if available, else fallback to static
    const capturedMoments = useMemo(() => {
        if (!dynamicMoments || dynamicMoments.length === 0) return staticCapturedMoments;

        return dynamicMoments.map(item => {
            // Find a caption from ANY event that matches this filename
            const dynamicName = item.public_id.split('/').pop().toLowerCase().replace(/[\s()_-]/g, '');

            const staticMatch = staticCapturedMoments.find(s => {
                const staticName = s.src.split('/').pop().split('.')[0].toLowerCase().replace(/[\s()_-]/g, '');
                return staticName === dynamicName || s.src.toLowerCase().includes(dynamicName);
            });

            return {
                ...item,
                caption: staticMatch?.caption || item.caption || `Memory of ${item.eventTitle}`,
                eventTitle: staticMatch?.eventTitle || item.eventTitle
            };
        });
    }, [dynamicMoments, staticCapturedMoments]);

    useEffect(() => {
        const handleScroll = () => {
            if (timelineRef.current) {
                const rect = timelineRef.current.getBoundingClientRect();
                const windowHeight = window.innerHeight;
                const elementHeight = timelineRef.current.offsetHeight;
                const progress = Math.max(0, Math.min(1, (windowHeight - rect.top) / (elementHeight + windowHeight)));
                setScrollProgress(progress);
                const cards = timelineRef.current.querySelectorAll('.event-card');
                cards.forEach((card, index) => {
                    const cardRect = card.getBoundingClientRect();
                    const cardCenter = cardRect.top + cardRect.height / 2;
                    if (cardCenter > windowHeight * 0.3 && cardCenter < windowHeight * 0.7) {
                        setActiveTimelineCard(index);
                    }
                });
            }
        };
        window.addEventListener('scroll', handleScroll);
        handleScroll();
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            setActiveCarouselIndex((prev) => (prev + 1) % eventsData.length);
        }, 4000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        if (capturedMoments.length === 0) return;
        const interval = setInterval(() => {
            setActiveMomentIndex((prev) => (prev + 1) % capturedMoments.length);
        }, 3500);
        return () => clearInterval(interval);
    }, [capturedMoments.length]);

    const [globalComments, setGlobalComments] = useState([]);

    // Fetch all comments from all events
    useEffect(() => {
        const fetchAllComments = async () => {
            try {
                // Ensure we hit /api/comments even if REACT_APP_API_URL is just the base /api
                const baseUrl = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';
                const finalUrl = baseUrl.endsWith('/comments') ? baseUrl : `${baseUrl}/comments`;

                const response = await fetch(finalUrl);
                if (response.ok) {
                    const data = await response.json();
                    setGlobalComments(data.comments || []);
                }
            } catch (err) {
                console.error('Fetch global comments error:', err);
            }
        };
        fetchAllComments();
    }, []);

    // Use only real database comments for the global view
    const globalVoices = useMemo(() => {
        return globalComments.map(c => ({ name: c.name, text: c.text, eventColor: '#09173d' }));
    }, [globalComments]);

    // Show event detail page when an event is selected
    if (selectedEvent) {
        return <EventDetailPage event={selectedEvent} onBack={() => setSelectedEvent(null)} />;
    }

    return (
        <div style={{
            minHeight: '100vh',
            background: 'rgba(255, 255, 255, 0.3)',
            fontFamily: "'Crimson Text', 'Georgia', serif",
            position: 'relative',
            overflow: 'hidden',
            color: '#333'
        }}>
            <GrainOverlay />
            <HeroSection />
            <FeaturedCarousel
                events={eventsData}
                activeCarouselIndex={activeCarouselIndex}
                setActiveCarouselIndex={setActiveCarouselIndex}
                setSelectedEvent={setSelectedEvent}
            />

            {mediaLoading ? (
                <div style={{ height: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#09173d' }}>
                    <div className="premium-loader">Reliving Memories...</div>
                </div>
            ) : (
                <>
                    <div style={{ textAlign: 'center', padding: 'clamp(4rem, 10vw, 6rem) clamp(1rem, 5vw, 2rem)' }}>
                        <h3 style={{ fontSize: 'clamp(1.75rem, 5vw, 3.5rem)', fontWeight: 400, color: '#09173d', fontFamily: "'Playfair Display', 'Georgia', serif", margin: 0 }}>Voices of the Community</h3>
                    </div>
                    <ReviewsCarousel
                        reviews={globalVoices}
                        eventColor="#09173d"
                        fallbackText="The story is just beginning... be the first to share a memory!"
                    />

                    <div style={{ position: 'relative', marginTop: 'clamp(2rem, 5vw, 4rem)' }}>
                        {/* Background Mesh for Moments */}
                        <div style={{ position: 'absolute', top: '10%', left: '50%', transform: 'translateX(-50%)', width: '120vw', height: '100%', background: 'radial-gradient(circle at 30% 20%, rgba(9, 23, 61, 0.04) 0%, transparent 50%), radial-gradient(circle at 70% 80%, rgba(9, 23, 61, 0.04) 0%, transparent 50%)', pointerEvents: 'none', zIndex: 1 }} />

                        <div style={{ textAlign: 'center', marginBottom: 'clamp(2.5rem, 8vw, 4rem)', position: 'relative', zIndex: 2 }}>
                            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem', padding: '0.5rem 1.25rem', background: 'rgba(9, 23, 61, 0.05)', borderRadius: '2rem', border: '1px solid rgba(9, 23, 61, 0.1)' }}>
                                <Camera style={{ width: '1rem', height: '1rem', color: '#09173d' }} />
                                <span style={{ fontSize: 'clamp(0.65rem, 1.5vw, 0.75rem)', letterSpacing: '0.15em', fontWeight: 600, color: '#09173d', textTransform: 'uppercase' }}>Memory Lane</span>
                            </div>
                            <h2 style={{ fontSize: 'clamp(2.25rem, 8vw, 4.75rem)', fontWeight: 400, margin: '0 0 1rem 0', color: '#09173d', fontFamily: "'Playfair Display', 'Georgia', serif", lineHeight: 1.1 }}>Moments in Motion</h2>
                            <p style={{ fontSize: 'clamp(1rem, 3.5vw, 1.25rem)', color: '#09173d', opacity: 0.7, maxWidth: 'min(90vw, 40rem)', margin: '0 auto', fontStyle: 'italic' }}>Swipe through our favorite memories</p>
                        </div>

                        <MomentsCarousel
                            capturedMoments={capturedMoments}
                            activeMomentIndex={activeMomentIndex}
                            setActiveMomentIndex={setActiveMomentIndex}
                        />
                    </div>
                    <TimelineSection
                        timelineRef={timelineRef}
                        events={eventsData}
                        scrollProgress={scrollProgress}
                        activeTimelineCard={activeTimelineCard}
                        setSelectedEvent={setSelectedEvent}
                    />
                    <CapturedMomentsGrid capturedMoments={capturedMoments} />
                </>
            )}

            <div style={{
                textAlign: 'center',
                padding: '40px 20px',
                borderTop: '1px solid rgba(9, 23, 61, 0.1)',
                position: 'relative',
                zIndex: 2
            }}>
                <p style={{
                    color: '#09173d',
                    fontSize: '14px',
                    opacity: 0.8,
                    letterSpacing: '1px'
                }}>
                    Every moment, a memory. Every memory, a treasure.
                </p>
            </div>
            <style>{`
                .premium-loader {
                    font-family: 'Playfair Display', serif;
                    font-style: italic;
                    font-size: 1.5rem;
                    animation: pulse 2s infinite;
                }
                @keyframes pulse {
                    0% { opacity: 0.5; }
                    50% { opacity: 1; }
                    100% { opacity: 0.5; }
                }
            `}</style>
        </div>
    );
};

export default PremiumEvents;
