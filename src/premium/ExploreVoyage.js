import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { eventsData, eventTypeMap } from './eventsData';
import { EventDetailPage } from './EventsSections';

// ExploreVoyage uses the EXACT same design as the Events page,
// but auto-opens the event detail page matching the eventType prop.
const ExploreVoyage = ({ eventType }) => {
    const navigate = useNavigate();
    const [event, setEvent] = useState(null);

    React.useLayoutEffect(() => {
        // Force scroll to top immediately and disable browser restoration
        if ('scrollRestoration' in window.history) {
            window.history.scrollRestoration = 'manual';
        }
        window.scrollTo(0, 0);
        document.body.scrollTop = 0;
        document.documentElement.scrollTop = 0;

        // Find the matching event based on eventType prop
        const eventId = eventTypeMap[eventType];
        const found = eventsData.find(e => e.id === eventId);
        if (found) {
            setEvent(found);
        } else {
            // Fallback to first event if type not found
            setEvent(eventsData[0]);
        }
    }, [eventType]);

    const handleBack = () => {
        navigate('/events');
    };

    if (!event) return null;

    return <EventDetailPage event={event} onBack={handleBack} useExploreMode={true} />;
};

export default ExploreVoyage;
