import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import './events.css';
import UpcomingEvents from './UpcomingEvents';

// ============ CLOUDINARY CONFIGURATION ============
const CLOUD_NAME = 'dambyonbn';
const getCloudinaryUrl = (folder, filename) => {
  const normalized = filename.replace(/[\s()]/g, '_');
  return `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/f_auto,q_auto/v1/events/${folder}/${normalized}`;
};

const pastEvents = [
  {
    title: "NorthEast Club inauguration",
    date: "May 2024",
    images: [
      getCloudinaryUrl('inaug', 'kmda.jpeg'),
      getCloudinaryUrl('inaug', 'WhatsApp Image 2026-02-09 at 10.32.54 PM.jpeg'),
      getCloudinaryUrl('inaug', 'WhatsApp Image 2025-02-07 at 11.28.01 PM (1).jpeg')
    ]
  },
  {
    title: "Uncensored Show",
    date: "Dec 2024",
    images: [
      getCloudinaryUrl('Uncensored', 'WhatsApp Image 2025-02-07 at 11.31.29 PM.jpeg'),
      getCloudinaryUrl('Uncensored', 'WhatsApp Image 2025-02-07 at 11.32.29 PM.jpeg')
    ]
  },
  {
    title: "Threads of Heritage",
    date: "Feb 2025",
    images: [
      getCloudinaryUrl('Threads_of_herit_1', 'toh1.jpg'),
      getCloudinaryUrl('Threads_of_herit_1', 'toh2.jpg'),
      getCloudinaryUrl('Threads_of_herit_1', 'toh3.jpg')
    ]
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

      <UpcomingEvents />

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