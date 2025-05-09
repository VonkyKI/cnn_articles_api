import React, { useState, useEffect, useRef} from 'react';
import "./EventTimeline.css";
import { getEvents } from '../../data/getEvents';

function EventTimeline({ width }) {


  const [generalEvents, setEventsData] = useState([]); // State to store events data

  useEffect(() => {
      const fetchEvents = async () => {
        const generalEvents = await getEvents();
        setEventsData(generalEvents);
      };
  
      fetchEvents();
  }, []);
    
  console.log("generalEvents", generalEvents);
  

  const sortedEvents = generalEvents.sort(
    (a, b) => new Date(a.date) - new Date(b.date)
  );
  
  

  return (
    <div className="EventTimeline" style={{width: width}}>
      {sortedEvents.map((event, index) => {
        
        return (
          <div className="EventBox" key={index}>
            <p className="EventBox-title">{event.title}</p>
            <p className="EventBox-date">{event.date.split('T')[0]}</p>
            {/* <img className="EventBox-image" src="./img/profile.png" alt="" /> */}
            <p className="EventBox-description">{event.description}</p>
            <a className="EventBox-readmore" href={event.url} target="_blank" rel="noopener noreferrer">Read more</a>
          </div>
        );
      })}
    </div>
  );
}

export default EventTimeline;