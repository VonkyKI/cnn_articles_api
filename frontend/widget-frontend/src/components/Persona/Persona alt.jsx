import React, { useState, useEffect } from 'react';
import './Persona.css';
import { getLegendData } from '../../data/getLegendData.js'; // Importing your events.json data
const icons = import.meta.glob('./icons/*.png', { eager: true });
const images = import.meta.glob('./img/*.png', { eager: true });

const Persona = ({ onFilterChange, innerWidth, filter }) => {
  const [widgets, setWidgets] = useState([]);
  const [selectedWidget, setSelectedWidget] = useState(null);
  const [loading, setLoading] = useState(true);


  const [events, setEvents] = useState([]); // State to store events data

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      const data = await getLegendData();
      if (data && data.events) {
        setEvents(data.events);
      } else {
        console.error("eventsData is undefined in the fetched data:", data);
      }
      setLoading(false);
    };
    fetchEvents();
  }, []);
  // Dynamically calculate width based on number of unique dates

  

  useEffect(() => {
    
    // Create a map for each person's earliest date and party
    const nameToDetails = events.reduce((acc, event) => {
      
      const eventDate = new Date(event.article_date);
      // If this name isn't in acc or if this event is earlier than the current one, add/update the record
      if (!acc[event.person_name] || eventDate < acc[event.person_name].date) {
        acc[event.person_name] = {
          date: eventDate,
          political_party: event["political_party"], // Default to "Independent" if not specified, other options could be "Republican" and "Democratic"
          consistency: event["inconsistencies"] === true ? "inconsistent" : "trusted",
          stance: event["stance"] || "for", // Assume initial stance, updated later
          summary: event.summary
        };
      } else {
        // Update the stance to the latest occurrence if there's a newer stance
        acc[event.person_name].political_party = event["political_party"] || acc[event.person_name].political_party;

        acc[event.person_name].stance = event["stance"] || acc[event.person_name].stance;
        
        // Check for any inconsistencies, if found set consistency to "Inconsistent"
        if (event["inconsistencies"] === true) {
          acc[event.person_name].consistency = "inconsistent";
        }
      }
      return acc;
    }, {});

    // Sort names by earliest date
    const sortedNames = Object.keys(nameToDetails).sort(
      (a, b) => new Date(nameToDetails[a].date) - new Date(nameToDetails[b].date)
    );

    
    // Map sorted widgets with details
    setWidgets(sortedNames.map(name => ({
      name,
      political_party: nameToDetails[name].political_party,
      consistency: nameToDetails[name].consistency,
      stance: nameToDetails[name].stance,
      summary: nameToDetails[name].summary
    })));
  }, [events]);

  

  const handleWidgetClick = (name) => {
    if (selectedWidget === name) {
      setSelectedWidget(null); // Deselect widget if already selected
      onFilterChange(null); // Clear the filter
    } else {
      setSelectedWidget(name); // Set clicked widget as selected
      onFilterChange(name); // Pass selected name to filter handler
    }
  };

  // Update selected widget based on filter
  useEffect(() => {
    setSelectedWidget(filter); 
  }, [filter]);

  const defaultWidth = innerWidth / widgets.length; // Calculate default widget width
  
  

  return (
    <div className="persona-grid" style={{ width: `${innerWidth}px` }}>
      {widgets.map((widget, index) => {
        let partyIconPath = null;
        try {
          partyIconPath = require(`./icons/${widget.political_party}.png`);
        } catch (e) {
          partyIconPath = null; // Set to null if not found
        }
        
        
        const consistencyIconPath = icons[`./icons/${widget.consistency}.png`]?.default || null;
        const imagePath = images[`./img/${widget.name}.png`]?.default || images[`./img/default.png`]?.default;


        // Log to check the values for each widget's image paths
        //console.log(`Widget: ${widget.name}`);
        //console.log(`Party Icon Path: ${partyIconPath}`);
        //console.log(`Consistency Icon Path: ${consistencyIconPath}`);
        //console.log(`Image Path: ${imagePath}`);
      
      return (
        <div
          key={index}
          className={`widget ${selectedWidget === widget.name ? 'expanded' : selectedWidget ? 'shrunk' : 'default'}`}
          onClick={() => handleWidgetClick(widget.name)}
          style={{
            // width: selectedWidget === widget.name ? `${defaultWidth * 3}px` : selectedWidget ? `${defaultWidth / 2}px` : `${defaultWidth}px`
            // width: `190px`,
          }}
        >
          <div className="widget-content">
            <div className="widget-left">
              
              {/* Profile image */}
              <img 
                  src={imagePath}
                  alt={widget.name || 'Default'}
                  className="widget-img"
                  />
                  
               {/* Container for icons and stance indicator */}
                  <div className="icon-container">
                  {/* Left-aligned icon for political party */}
                  {partyIconPath !== null ? (
                    <img src={partyIconPath} alt={widget.political_party} className="icon-party" />
                  ) : (
                    <div className="icon-placeholder"></div>
                  )}
                  
                  {/* Stance indicator, centered */}
                  <div className={`stance ${widget.stance.toLowerCase()}`}>
                    {widget.stance}
                  </div>
                  
                 {/* Right-aligned icon for consistency, or transparent placeholder */}
                  {consistencyIconPath !== null ? (
                    <img src={consistencyIconPath} alt={widget.consistency} className="icon-consistency" />
                  ) : (
                    <div className="icon-placeholder"></div>
                  )}
                  
                </div>
              <div className="widget-name">{widget.name}</div>
              {/* Stance indicator below the image */}
                
                </div>
            {selectedWidget === widget.name && (
              <div className="widget-right">
                <div className="widget-text">
                  <p>{widget.summary}
                  </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
export default Persona;
