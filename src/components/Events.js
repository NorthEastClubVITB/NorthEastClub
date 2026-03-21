import React, { useState, useRef, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Camera } from "lucide-react";
import "./events.css";
import UpcomingEvents from "./UpcomingEvents";

// ============ CLOUDINARY CONFIGURATION ============
const CLOUD_NAME = 'dambyonbn';
const getCloudinaryUrl = (folder, filename) => {
  const normalized = filename.replace(/[\s()]/g, '_');
  return `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/f_auto,q_auto,w_800/v1/events/${folder}/${normalized}`;
};

// Curated gallery photos - mapped to the Surf Carousel format
const BASE_CARDS = [
  { id: 1, tag: "NORTH EAST CLUB", title: "A Grand Beginning", time: "May 2024", image: getCloudinaryUrl('inaug', 'kmda.jpeg') },
  { id: 2, tag: "THREADS OF HERITAGE", title: "A Tapestry of Culture", time: "Feb 2025", image: getCloudinaryUrl('Threads_of_herit_1', 'toh1.jpg') },
  { id: 3, tag: "UNCENSORED", title: "Raw & Real Expression", time: "Dec 2024", image: getCloudinaryUrl('Uncensored', 'WhatsApp Image 2026-02-09 at 10.32.34 PM.jpg') },
  { id: 4, tag: "CULTURAL ROOTS", title: "Elegance in Tradition", time: "Feb 2025", image: getCloudinaryUrl('Threads_of_herit_1', '20250220_113837.jpg') },
  { id: 5, tag: "INAUGURATION", title: "Words of Wisdom", time: "May 2024", image: getCloudinaryUrl('inaug', 'WhatsApp Image 2026-02-09 at 10.32.53 PM.jpg') },
  { id: 6, tag: "HERITAGE", title: "United in Diversity", time: "Feb 2025", image: getCloudinaryUrl('Threads_of_herit_1', 'toh2.jpg') },
  { id: 7, tag: "DRAMA ON DECK", title: "Bollywood Nights", time: "Feb 2026", image: "https://res.cloudinary.com/dambyonbn/image/upload/f_auto,q_auto,w_800/v1772311775/drama_poster_ry9rze.jpg" },
];

const N = BASE_CARDS.length;

const TAG_COLORS = {
  "NORTH EAST CLUB": "#09173d",
  "THREADS OF HERITAGE": "#1a237e",
  "UNCENSORED": "#102a43",
  "DRAMA ON DECK": "#8b4513",
  "CULTURAL ROOTS": "#0d47a1",
  "INAUGURATION": "#0a192f",
  "HERITAGE": "#283593",
};

// Get card by virtual index (infinite loop)
function getCard(virtualIndex) {
  const i = ((virtualIndex % N) + N) % N;
  return BASE_CARDS[i];
}

// Responsive width ratios
function getWidths(vw) {
  if (vw < 480) {
    const full = vw * 0.85;
    return { sliver: vw * 0.08, full, half: full * 0.50, quarter: full * 0.25 };
  } else if (vw < 768) {
    const full = vw * 0.75;
    return { sliver: vw * 0.08, full, half: full * 0.50, quarter: full * 0.25 };
  } else if (vw < 1024) {
    const full = vw * 0.60;
    return { sliver: 80, full, half: full * 0.50, quarter: full * 0.25 };
  } else {
    return { sliver: 80, full: 480, half: 240, quarter: 120 };
  }
}

function lerp(a, b, t) { return a + (b - a) * t; }
function easeInOut(t) { return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t; }

function getWidthAtPos(pos, widths) {
  const stops = [
    [-2, 0],
    [-1, widths.sliver],
    [0, widths.full],
    [1, widths.half],
    [2, widths.quarter],
    [3, 0],
  ];
  const floor = Math.floor(pos);
  const t = easeInOut(pos - floor);
  const w0 = stops.find(([p]) => p === Math.max(-2, Math.min(3, floor)))?.[1] ?? 0;
  const w1 = stops.find(([p]) => p === Math.max(-2, Math.min(3, floor + 1)))?.[1] ?? 0;
  return Math.max(0, lerp(w0, w1, t));
}

const GAP = 12;
const AUTO_SCROLL_DELAY = 3500;
const AUTO_RESUME_AFTER = 4000;

export default function Events() {
  const navigate = useNavigate();
  const [vw, setVw] = useState(() => (typeof window !== "undefined" ? window.innerWidth : 375));
  const [vh, setVh] = useState(() => (typeof window !== "undefined" ? window.innerHeight : 700));
  const [isVisible, setIsVisible] = useState(false); // Track if component is in viewport

  const targetRef = useRef(1);
  const [target, setTarget] = useState(1);
  const displayRef = useRef(1);
  const [display, setDisplay] = useState(1);

  const rafRef = useRef(null);
  const dragging = useRef(false);
  const dragStartX = useRef(null);
  const dragBaseDisplay = useRef(null);
  const velocityRef = useRef(0);
  const lastXRef = useRef(null);
  const containerRef = useRef(null);
  const sectionRef = useRef(null); // Ref for the main section to observe

  // Auto-scroll
  const autoTimerRef = useRef(null);
  const userActivityRef = useRef(null);
  const isPausedRef = useRef(false);

  // Intersection Observer to detect visibility
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.05 } // Trigger when 5% visible for better reliability
    );

    const node = sectionRef.current;
    if (node) {
      observer.observe(node);
    }

    return () => {
      if (node) observer.unobserve(node);
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    const onResize = () => {
      setVw(window.innerWidth);
      setVh(window.innerHeight);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const cardHeight = Math.min(Math.round(vh * 0.65), 520);
  const widths = getWidths(vw);

  useEffect(() => {
    let startVal = displayRef.current;
    let startTime = null;
    const DURATION = 1100;

    const tick = (now) => {
      if (dragging.current || !isVisible) return; // Only animate if visible
      if (!startTime) startTime = now;
      const elapsed = now - startTime;
      const tgt = targetRef.current;

      if (Math.abs(startVal - tgt) < 0.0005) {
        displayRef.current = tgt;
        setDisplay(tgt);
        return;
      }

      const progress = Math.min(elapsed / DURATION, 1);
      const eased = 1 - Math.pow(1 - progress, 5);
      const next = startVal + (tgt - startVal) * eased;

      displayRef.current = next;
      setDisplay(next);

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        displayRef.current = tgt;
        setDisplay(tgt);
      }
    };

    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    startVal = displayRef.current;
    startTime = null;
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [target, isVisible]); // Re-run if visibility changes to resume animation

  const goTo = useCallback((virtualIndex) => {
    targetRef.current = virtualIndex;
    setTarget(virtualIndex);
  }, []);

  const scheduleAuto = useCallback(() => {
    clearTimeout(autoTimerRef.current);
    if (!isVisible) return; // Don't schedule if not visible
    autoTimerRef.current = setTimeout(() => {
      isPausedRef.current = false;
      goTo(targetRef.current + 1);
      scheduleAuto();
    }, AUTO_SCROLL_DELAY);
  }, [goTo, isVisible]);

  const pauseAuto = useCallback(() => {
    clearTimeout(autoTimerRef.current);
    clearTimeout(userActivityRef.current);
    isPausedRef.current = true;
    userActivityRef.current = setTimeout(() => {
      scheduleAuto();
    }, AUTO_RESUME_AFTER);
  }, [scheduleAuto]);

  useEffect(() => {
    scheduleAuto();
    return () => {
      clearTimeout(autoTimerRef.current);
      clearTimeout(userActivityRef.current);
    };
  }, [scheduleAuto]);

  const onPointerDown = useCallback((e) => {
    if (e.target.closest('.register-button')) return;
    pauseAuto();
    dragging.current = true;
    const x = e.touches ? e.touches[0].clientX : e.clientX;
    dragStartX.current = x;
    dragBaseDisplay.current = displayRef.current;
    lastXRef.current = x;
    velocityRef.current = 0;
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
  }, [pauseAuto]);

  const onPointerMove = useCallback((e) => {
    if (!dragging.current) return;
    const x = e.touches ? e.touches[0].clientX : e.clientX;
    velocityRef.current = x - (lastXRef.current ?? x);
    lastXRef.current = x;
    const dx = dragStartX.current - x;
    const newVal = dragBaseDisplay.current + dx / widths.full;
    displayRef.current = newVal;
    setDisplay(newVal);
  }, [widths.full]);

  const onPointerUp = useCallback(() => {
    if (!dragging.current) return;
    dragging.current = false;
    const vi = velocityRef.current;
    let snap = Math.round(displayRef.current);
    if (vi < -5) snap = Math.floor(displayRef.current);
    else if (vi > 5) snap = Math.ceil(displayRef.current);
    goTo(snap);
  }, [goTo]);

  useEffect(() => {
    window.addEventListener("mousemove", onPointerMove);
    window.addEventListener("mouseup", onPointerUp);
    window.addEventListener("touchmove", onPointerMove, { passive: false });
    window.addEventListener("touchend", onPointerUp);
    return () => {
      window.removeEventListener("mousemove", onPointerMove);
      window.removeEventListener("mouseup", onPointerUp);
      window.removeEventListener("touchmove", onPointerMove);
      window.removeEventListener("touchend", onPointerUp);
    };
  }, [onPointerMove, onPointerUp]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    let debounce = null;
    const onWheel = (e) => {
      const isHorizontal = Math.abs(e.deltaX) > Math.abs(e.deltaY);
      if (isHorizontal) {
        e.preventDefault();
        pauseAuto();
        clearTimeout(debounce);
        const d = e.deltaX;
        debounce = setTimeout(() => {
          if (d > 15) goTo(targetRef.current + 1);
          else if (d < -15) goTo(targetRef.current - 1);
        }, 40);
      }
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [goTo, pauseAuto]);

  const startVirtual = Math.floor(display) - 1;
  const endVirtual = Math.floor(display) + 3;
  const virtualCards = [];
  for (let vi = startVirtual; vi <= endVirtual; vi++) {
    virtualCards.push(vi);
  }

  const activeVirtual = Math.round(display);
  const activeCardIndex = ((activeVirtual % N) + N) % N;

  return (
    <div className="events-container" ref={sectionRef}>
      <UpcomingEvents />

      <div className="gallery-header" style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <div className="gallery-badge" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.4rem 1rem', background: 'rgba(9, 23, 61, 0.06)', borderRadius: '2rem', border: '1px solid rgba(9, 23, 61, 0.1)', marginBottom: '1rem', fontSize: '0.75rem', fontWeight: 600, color: '#09173d', textTransform: 'uppercase', letterSpacing: '0.15em' }}>
          <Camera size={14} />
          <span>Our Journey</span>
        </div>
        <h2 className="gallery-title" style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', color: '#09173d', fontFamily: "'Playfair Display', serif", margin: '0 0 0.75rem 0' }}>Relive the Moments</h2>
        <p className="gallery-subtitle" style={{ color: '#09173d', opacity: 0.6, fontStyle: 'italic' }}>A cinematic experience through our favorite chapters</p>
      </div>

      <div
        style={{
          width: "100%",
          padding: "2rem 0",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "center",
          overflow: "hidden",
          userSelect: "none",
          touchAction: "none",
          position: "relative"
        }}
      >
        <div
          ref={containerRef}
          onMouseDown={onPointerDown}
          onTouchStart={onPointerDown}
          style={{
            display: "flex",
            alignItems: "stretch",
            gap: GAP,
            height: cardHeight,
            cursor: dragging.current ? "grabbing" : "grab",
            flexShrink: 0,
            paddingLeft: vw < 768 ? "10vw" : "15vw"
          }}
        >
          {virtualCards.map((vi) => {
            const card = getCard(vi);
            const pos = vi - display;
            const w = getWidthAtPos(pos, widths);
            if (w < 1) return null;

            const isFull = Math.abs(pos) < 0.5;
            const isSliver = pos < -0.4;
            const opacity = pos > 2.6 ? 0 : pos < -1.6 ? 0 : 1;

            return (
              <div
                key={`${vi}-${card.id}`}
                onClick={() => { if (!dragging.current) { pauseAuto(); if (isFull) navigate('/events'); else goTo(vi); } }}
                style={{
                  width: w,
                  minWidth: w,
                  maxWidth: w,
                  height: cardHeight,
                  borderRadius: 24,
                  overflow: "hidden",
                  position: "relative",
                  flexShrink: 0,
                  opacity,
                  transition: "opacity 0.6s cubic-bezier(0.2, 0.8, 0.2, 1), transform 0.6s cubic-bezier(0.2, 0.8, 0.2, 1)",
                  cursor: isFull ? "pointer" : "pointer",
                  boxShadow: isFull ? "0 25px 50px rgba(9, 23, 61, 0.25)" : "0 8px 16px rgba(0,0,0,0.1)",
                  willChange: "transform, opacity"
                }}
              >
                {/* Ambient Blur Background */}
                <div style={{
                  position: "absolute",
                  inset: "-20px",
                  backgroundImage: `url(${card.image})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  filter: "blur(30px) brightness(0.7)",
                  opacity: 0.6,
                  zIndex: 0
                }} />

                {/* Main 'Contained' Image */}
                <img
                  src={card.image}
                  alt=""
                  draggable={false}
                  style={{
                    position: "absolute",
                    inset: 0,
                    width: "100%",
                    height: "100%",
                    objectFit: "contain",
                    pointerEvents: "none",
                    zIndex: 1,
                    transition: "transform 0.6s ease"
                  }}
                />

                <div style={{
                  position: "absolute",
                  inset: 0,
                  background: isFull
                    ? "linear-gradient(to top, rgba(9,23,61,0.9) 0%, rgba(9,23,61,0.2) 55%, transparent 100%)"
                    : "linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 100%)",
                  zIndex: 1
                }} />

                {!isSliver && (
                  <div style={{
                    position: "absolute",
                    top: 20,
                    left: 20,
                    background: TAG_COLORS[card.tag] || "#09173d",
                    color: "white",
                    fontSize: 9,
                    fontWeight: 800,
                    letterSpacing: "0.15em",
                    padding: "6px 12px",
                    borderRadius: 30,
                    zIndex: 2,
                    textTransform: "uppercase"
                  }}>
                    {card.tag}
                  </div>
                )}



                {!isSliver && (
                  <div style={{
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    right: 0,
                    padding: isFull ? "32px 28px" : "20px 16px",
                    zIndex: 2,
                  }}>
                    <h2 style={{
                      color: "white",
                      fontSize: isFull ? "clamp(1.2rem, 3vw, 1.8rem)" : "clamp(0.8rem, 2vw, 1.1rem)",
                      fontWeight: 600,
                      margin: "0 0 8px",
                      lineHeight: 1.2,
                      fontFamily: "'Playfair Display', serif",
                      textShadow: "0 2px 10px rgba(0,0,0,0.5)",
                      overflow: "hidden",
                      display: "-webkit-box",
                      WebkitLineClamp: isFull ? 3 : 2,
                      WebkitBoxOrient: "vertical",
                    }}>
                      {card.title}
                    </h2>
                    <div style={{
                      color: "rgba(255,255,255,0.6)",
                      fontSize: 12,
                      marginBottom: isFull ? 16 : 0,
                      fontWeight: 500,
                      letterSpacing: "0.05em"
                    }}>
                      {card.time}
                    </div>
                    {isFull && (
                      <div style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                        color: "white",
                        fontSize: 13,
                        fontWeight: 600,
                        letterSpacing: "0.05em"
                      }}>
                        <span style={{
                          width: 28,
                          height: 28,
                          borderRadius: "50%",
                          border: "2px solid rgba(255,255,255,0.4)",
                          display: "inline-flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: 14,
                          flexShrink: 0,
                          transition: "background 0.3s"
                        }}>→</span>
                        Relive Memory
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div style={{
          display: "flex",
          gap: 12,
          marginTop: 40,
          paddingLeft: "15vw",
          alignItems: "center",
          width: "100%"
        }}>
          {BASE_CARDS.map((_, i) => {
            const active = i === activeCardIndex;
            return (
              <div
                key={i}
                onClick={() => {
                  pauseAuto();
                  const currentBase = ((Math.round(displayRef.current) % N) + N) % N;
                  const diff = i - currentBase;
                  const adjusted = Math.round(displayRef.current) + diff;
                  goTo(adjusted);
                }}
                style={{
                  width: active ? 32 : 8,
                  height: 8,
                  borderRadius: 4,
                  background: active ? "#09173d" : "rgba(9,23,61,0.2)",
                  cursor: "pointer",
                  transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                }}
              />
            );
          })}
        </div>
      </div>

      <style>{`
        @keyframes pulseRing {
          0%,100% { opacity:0.4; transform:scale(1); }
          50% { opacity:1; transform:scale(1.15); }
        }
        .events-container img {
          transition: transform 0.6s ease;
        }
        .events-container .gallery-tile:hover img {
          transform: translateX(-50%) scale(1.05);
        }
      `}</style>
    </div>
  );
}