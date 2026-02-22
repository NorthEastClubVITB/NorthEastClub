import React, { useState, useEffect } from 'react';
import { Send, MessageSquare, Quote } from 'lucide-react';
import { ReviewsCarousel } from './EventsSections';

const CommentsSection = ({ eventId, eventColor, testimonials = [] }) => {
    const [comments, setComments] = useState([]);
    const [name, setName] = useState('');
    const [text, setText] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const baseUrl = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';
    const API_URL = baseUrl.endsWith('/comments') ? baseUrl : `${baseUrl}/comments`;

    useEffect(() => {
        fetchComments();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [eventId]);

    const fetchComments = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${API_URL}/${eventId}`);
            if (!response.ok) throw new Error('Failed to fetch');
            const data = await response.json();
            setComments(data.comments || []);
            setError(null);
        } catch (err) {
            console.error('Fetch error:', err);
            setError('Waiting for connection...');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!name.trim() || !text.trim()) return;

        setSubmitting(true);
        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ event_id: eventId, name, text })
            });

            if (!response.ok) throw new Error('Failed to post');
            const newComment = await response.json();

            setComments([newComment, ...comments]);
            setText('');
        } catch (err) {
            console.error('Submit error:', err);
        } finally {
            setSubmitting(false);
        }
    };

    const allVoiceItems = comments.map(c => ({ name: c.name, text: c.text }));

    return (
        <div style={{ padding: 'clamp(60px, 12vw, 100px) clamp(16px, 4vw, 40px)', background: `rgba(255, 255, 255, 0.2)`, position: 'relative', zIndex: 2, boxSizing: 'border-box' }}>
            <div style={{ maxWidth: '800px', margin: '0 auto' }}>

                {/* Voices Presentation (Carousel Style) */}
                <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                    <Quote style={{ width: 'clamp(32px, 6vw, 40px)', height: 'clamp(32px, 6vw, 40px)', color: eventColor, margin: '0 auto 16px', opacity: 0.3 }} />
                    <h3 style={{ fontSize: 'clamp(28px, 5vw, 56px)', fontWeight: 400, color: '#09173d', fontFamily: "'Playfair Display', 'Georgia', serif", margin: 0 }}>Voices of the Community</h3>
                </div>
                <ReviewsCarousel
                    reviews={allVoiceItems}
                    eventColor={eventColor}
                    fallbackText="No stories shared yet for this event. Be the first to leave a mark!"
                />

                <div style={{ textAlign: 'center', marginTop: allVoiceItems.length > 0 ? '60px' : '0', marginBottom: 'clamp(32px, 6vw, 48px)' }}>
                    <MessageSquare style={{ width: '24px', height: '24px', color: eventColor, margin: '0 auto 12px', opacity: 0.6 }} />
                    <p style={{ fontSize: 'clamp(16px, 3.5vw, 18px)', color: '#09173d', opacity: 0.8, margin: 0 }}>Share your experience with us</p>
                </div>

                {/* Comment Form */}
                <form onSubmit={handleSubmit} style={{
                    background: 'rgba(255, 255, 255, 0.8)', padding: 'clamp(20px, 4vw, 32px)',
                    borderRadius: '24px', boxShadow: '0 10px 40px rgba(0,0,0,0.05)',
                    border: `1px solid rgba(9, 23, 61, 0.1)`, marginBottom: '40px',
                    backdropFilter: 'blur(10px)', width: '100%', boxSizing: 'border-box'
                }}>
                    <div style={{ display: 'grid', gap: '20px' }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 600, color: eventColor, textTransform: 'uppercase', letterSpacing: '1px' }}>Your Name</label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Enter your name"
                                style={{
                                    width: '100%', padding: '16px', borderRadius: '12px', border: '1px solid rgba(0,0,0,0.1)',
                                    fontSize: '16px', outline: 'none', background: '#fff', color: '#333',
                                    transition: 'border 0.3s', boxSizing: 'border-box'
                                }}
                                onFocus={(e) => e.target.style.border = `1px solid #09173d`}
                                onBlur={(e) => e.target.style.border = '1px solid rgba(0,0,0,0.1)'}
                            />
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 600, color: eventColor, textTransform: 'uppercase', letterSpacing: '1px' }}>Your Message</label>
                            <textarea
                                value={text}
                                onChange={(e) => setText(e.target.value)}
                                placeholder="Share your thoughts..."
                                rows="3"
                                style={{
                                    width: '100%', padding: '16px', borderRadius: '12px', border: '1px solid rgba(0,0,0,0.1)',
                                    fontSize: '16px', outline: 'none', background: '#fff', resize: 'vertical',
                                    color: '#333', transition: 'border 0.3s', boxSizing: 'border-box'
                                }}
                                onFocus={(e) => e.target.style.border = `1px solid #09173d`}
                                onBlur={(e) => e.target.style.border = '1px solid rgba(0,0,0,0.1)'}
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={submitting || !name || !text}
                            style={{
                                background: `linear-gradient(135deg, #09173d, #1a237e)`,
                                color: 'white', padding: '16px 32px', borderRadius: '50px',
                                border: 'none', fontSize: '16px', fontWeight: 600, cursor: 'pointer',
                                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                                opacity: (submitting || !name || !text) ? 0.6 : 1, transition: 'all 0.3s',
                                boxShadow: '0 4px 15px rgba(9, 23, 61, 0.2)'
                            }}
                        >
                            {submitting ? 'Posting...' : <>{'Post Comment'} <Send size={18} /></>}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CommentsSection;
