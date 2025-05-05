import React from 'react';
import './UpcomingEvents.css';

const UpcomingEvents = () => {
  const upcomingEvents = [
    
  ];

  if (upcomingEvents.length === 0) {
    return null;
  }

  return (
    <div className="upcoming-container">
      <h2 className="upcoming-main-title">Upcoming Event{upcomingEvents.length > 1 ? 's' : ''}</h2>
      
      {upcomingEvents.map((event, index) => (
        <div className="upcoming-card" key={index}>
          <div className="upcoming-image-container">
            <img 
              src={event.imageUrl}
              alt={event.title}
              className="upcoming-image"
            />
          </div>
          
          <div className="upcoming-content">
            <div className="upcoming-header">
              <h3 className="upcoming-title">{event.title}</h3>
              <p className="upcoming-date">{event.date}</p>
            </div>
            
            <div className="upcoming-description">
              <p>{event.description}</p>
            </div>
            
            <div className="upcoming-footer">
              <a 
                href={event.registrationLink}
                target="_blank"
                rel="noopener noreferrer"
                className="register-button"
              >
                Register Now
              </a>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default UpcomingEvents;