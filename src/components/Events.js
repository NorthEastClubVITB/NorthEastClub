import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import './events.css';
import UpcomingEvents from './UpcomingEvents';
import inuguration1 from '../images/events/WhatsApp Image 2025-02-07 at 11.28.01 PM (1).jpeg'
import inugu2 from '../images/events/WhatsApp Image 2025-02-07 at 11.28.01 PM.jpeg'
import latent from '../images/events/WhatsApp Image 2025-02-07 at 11.31.29 PM.jpeg'
import latent1 from '../images/events/WhatsApp Image 2025-02-07 at 11.32.29 PM.jpeg'
import inu from '../images/events/kmda.jpeg'
import toh1 from '../images/events/toh1.jpg'
import toh2 from '../images/events/toh2.jpg'
import toh3 from '../images/events/toh3.jpg'


const pastEvents = [
  {
    title: "NorthEast Club inauguration",
    date: "May 2024",
    images: [inu,inugu2,
      inuguration1
    ]
  },
  {
    title: "Uncensored Show",
    date: "Dec 2024",
    images: [
      latent,latent1
    ]
  },
  {
    title: "Threads of Heritage",
    date: "Feb 2025",
    images: [toh1, toh2, toh3]
  }
];


const ImageCarousel = ({ images }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextImage = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const previousImage = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
  };

  return (
    <div className="upcoming">
      <img 
        src={images[currentIndex]} 
        alt="" 
        className="upcoming-image"
      />
      <button 
        onClick={previousImage}
        className="button_prev"
        aria-label="Previous image"
      >
        <ChevronLeft size={20} />
      </button>
      <button 
        onClick={nextImage}
        className="button_next"
        aria-label="Next image"
      >
        <ChevronRight size={20} />
      </button>
      <div className="upcoming-dots">
        {images.map((_, index) => (
          <div
            key={index}
            className={`upcoming-dot ${index === currentIndex ? 'active' : ''}`}
          />
        ))}
      </div>
    </div>
  );
};

const Events = () => {
  // Function to chunk array into groups of 3
  

  return (
    <div className="events-container">

      <UpcomingEvents/>

      <h2 className="section-title">Events Timeline</h2>
      <div className="events-grid">
        {pastEvents.map((event, index) => (
          <div key={index} className="event-card">
            <ImageCarousel images={event.images} />
            <div className="event-content">
              <h3 className="event-title">{event.title}</h3>
              <p className="event-date">{event.date}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Events;