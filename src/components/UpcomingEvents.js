import React from 'react';
import './UpcomingEvents.css';
import advitya from '../images/advitya/1 (1).jpeg'
const UpcomingEvents = () => {
  const upcomingEvent = {
    title: "Threads of Heritage",
    date: "20 Feb 2025, 11:00 AM - 4:30 PM",
    description: "Dive into the vibrant culture of Northeast India at our Handicraft Workshop & Exhibition!",
    imageUrl: advitya,
    registrationLink: "https://docs.google.com/forms/d/e/1FAIpQLSej3JhBG1eoXla7OG4k_XJM80Iy43o6touE2_r5nEbbiH0-Aw/viewform"
  };

  return (
    <div className="upcoming-container">
      <h2 className="upcoming-main-title">Upcoming Event</h2>
      
      <div className="upcoming-card">
        <div className="upcoming-image-container">
          <img 
            src={upcomingEvent.imageUrl}
            alt={upcomingEvent.title}
            className="upcoming-image"
          />
        </div>
        
        <div className="upcoming-content">
          <div className="upcoming-header">
            <h3 className="upcoming-title">{upcomingEvent.title}</h3>
            <p className="upcoming-date">{upcomingEvent.date}</p>
          </div>
          
          <div className="upcoming-description">
            <p>{upcomingEvent.description}</p>
          </div>
          
          <div className="upcoming-footer">
            <a 
              href={upcomingEvent.registrationLink}
              target="_blank"
              rel="noopener noreferrer"
              className="register-button"
            >
              Register Now
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpcomingEvents;