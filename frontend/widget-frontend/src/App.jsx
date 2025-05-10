import React, { useState, useEffect, useRef} from 'react';
import * as d3 from 'd3'; // Import D3 library
import {getChartData} from './data/getChartData.js'; // Importing your events.json data
import './App.css'; // Import CSS for the pulsing effect
import './components/BubbleChart/BubbleChart.css'; // Import CSS for the pulsing effect
import EventTimeline from './components/EventTimeline/EventTimeline'; // Import the new component
import { getRadiusBasedOnInfluence, getOpacityBubbles } from './utils'; 
import Tooltip from './components/Tooltip/Tooltip';
import XAxis from './components/XAxis/XAxis';
import EventBoxConnectorLines from './components/EventBoxConnectorLines/EventBoxConnectorLines';
import BubbleLines from './components/BubbleLines/BubbleLines';
//import Persona from './components/Persona/Persona'; // Adjust path according to your structure
import Persona from './components/Persona/Persona alt'; // Adjust path according to your structure
import YAxis from './components/YAxis/YAxis';
import Legend from './components/Legend/BubbleLegend'; 

function BubbleChart() {
  const [chartData, setChartData] = useState([]);
  const [hoveredEvent, setHoveredEvent] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null); // State to track the selected event
  const [filter, setFilter] = useState(null); // State to track the selected filter

  const[eventsData, setEventsData] = useState([]); // State to store events data


  useEffect(() => {
    const fetchEvents = async () => {
      const data = await getChartData();
      if (data && data.eventsData) {
        setEventsData(data.eventsData);
      } else {
        console.error("eventsData is undefined in the fetched data:", data);
      }
    };
    fetchEvents();
  }, []);
  // Dynamically calculate width based on number of unique dates

  

  const uniqueDates = [...new Set(eventsData.map(d => d.article_date))];
  const width = (uniqueDates.length + 2) * 100; // Dynamically calculate width based on number of unique dates
  const height = 600;
  const margin = { top: 20, right: 50, bottom: 150, left: 70 };


  const innerWidth = width - margin.left - margin.right;

  
  const innerHeight = height - margin.top - margin.bottom;

  const svgRef = useRef(null);

  // Create Y scale to map sentiment_score (-1.5 to 1.5) to a positive range
  const yScale = d3.scaleLinear()
    .domain([-1.15, 1.15]) // Input domain: sentiment_score range (-1.5 to 1.5)
    .range([innerHeight, 0]); // Map the Y-axis from top (1.5) to bottom (-1.5)
  
  // Function to prepare force simulation for clustering bubbles
  const createForceSimulation = (nodes, xScale, getRadiusBasedOnInfluence) => {
    const simulation = d3.forceSimulation(nodes)
      .force("x", d3.forceX(d => xScale(d.dateIndex)).strength(0.8))
      .force("y", d3.forceY(d => yScale(d.sentiment_score)).strength(1))
      .force("collision", d3.forceCollide(d => getRadiusBasedOnInfluence() + 2))
      .tick(300)
      .stop();

  };

  // Prepare the data
  const allDates = [...new Set(eventsData.map(d => d.article_date))].sort((a, b) => new Date(a) - new Date(b));
  const dateIndexMap = allDates.reduce((acc, date, i) => {
    acc[date] = i;
    return acc;
  }, {});
  

  // Create X scale
  const xScale = d3.scaleLinear()
    .domain([0, allDates.length - 1])
    .range([50, allDates.length * 100]); // Dynamically set the width to accommodate all points

  const nodes = eventsData.map(event => ({    
    ...event,
    dateIndex: dateIndexMap[event.article_date], // Assign each event a date index
    x: 0, // Initial X position (will be set by force simulation)
    y: yScale(event.sentiment_score), // Set Y position based on sentiment score
  }));
  
  
  createForceSimulation(nodes, xScale, getRadiusBasedOnInfluence);
  
   
  
  useEffect(() => {
  
    setChartData(nodes);

  }, []);

  

 
  

  

  const bubbleOpacities = nodes.map(event => 
    getOpacityBubbles(event, hoveredEvent, selectedEvent, filter)
  );

  // Scroll to the selected bubble based on Persona widget selection
  useEffect(() => {
    if (filter && svgRef.current) {
      const selectedBubble = nodes.find(event => event.name === filter);
      if (selectedBubble) {
        // Calculate bubble position within the SVG
        const svgRect = svgRef.current.getBoundingClientRect();
        const bubbleX = window.scrollX + svgRect.left + margin.left + selectedBubble.x;

        // Smooth scroll to bring the bubble to the center of the viewport
        window.scrollTo({
          left: bubbleX - window.innerWidth / 2,
          behavior: 'smooth',
        });
      }
    }
  }, [filter, nodes, margin.left]);
  

  return (
    <div className="App">
        <div className="Persona">
            <h1></h1>
            {<Persona onFilterChange={setFilter} innerWidth={innerWidth} filter={filter}/>}
        </div>
        <div className="Legend">
            <Legend />  
        </div>
        
      <div className='SvgTooltipWrapper'>
        {/* SVG without overflow styling */}
        <svg 
          ref={svgRef}
          width={width} 
          height={height} 
          onClick={(ev) => {
            // if clicked outside of the bubbles, deselect the selected event
            if(!ev.target.classList.contains('bubble-main')) {
              setSelectedEvent(null); 
              setFilter(null); 
            }

            // find event with event id from data-event-id attribute of the clicked element and set it as selected event
            const event = nodes.find(d => d.fk_origin_article_id === Number(ev.target.dataset.eventId));

            
            if(event) {
              setSelectedEvent(event);
              setHoveredEvent(event); // also set hovered event to show tooltip immediately (otherwise it would only show on mouseout and mouseover again)
              setFilter(event.person_name); // clear the filter or set it to the persona name setFilter(event.name)
            }
          }}
        >
          <YAxis innerHeight={innerHeight} innerWidth={innerWidth} margin={margin} />
          <g transform={`translate(${margin.left}, ${margin.top})`}>
            {/* Render unique date labels and axis line */}
            <XAxis chartData={nodes} innerHeight={innerHeight} innerWidth={innerWidth} />
              
            <BubbleLines chartData={nodes} hoveredEvent={hoveredEvent} selectedEvent={selectedEvent} filter={filter}/>

            {/* Render bubbles */}
            <g className="bubbles">
              {nodes.map((event, index) => (
                /* Fade non-relevant bubbles based on the 'name' field */
                <g 
                  key={index} 
                  className="bubbleGroup"
                  opacity={bubbleOpacities[index]}
                >
                {/* Pulsing effect if inconsistency is TRUE */}
                {event.inconsistencies === true && (
                  <>
                  <circle
                    className="pulsing"
                    cx={event.x}
                    cy={event.y}
                    r={getRadiusBasedOnInfluence(event["Overall influence"])}
                    fill="deepskyblue"
                    opacity={0.5}
                    style={{ transformOrigin: `${event.x}px ${event.y}px`, animationDelay: '0s'}}
                  />
                  <circle
                    className="pulsing"
                    cx={event.x}
                    cy={event.y}
                    r={getRadiusBasedOnInfluence(event["Overall influence"])}
                    fill="orange"
                    opacity={0.5}
                    style={{ transformOrigin: `${event.x}px ${event.y}px`, animationDelay: '1s'}}
                  />
                  </>
                )}
                {/* Normal bubble */}
                <circle
                  cx={event.x} // Bubble X position from force simulation
                  cy={event.y} // Set Y position from force simulation
                  r={getRadiusBasedOnInfluence(event["Overall influence"])}
                  fill={hoveredEvent === null || event.person_name === hoveredEvent.person_name ? 'darkblue' : 'darkblue'} //#b7c9e2
                  opacity={1}
                  onMouseOver={() => {
                    // only show tooltip if no event is selected or if the hovered event is the same as the selected event
                    if(selectedEvent === null || selectedEvent.person_name === event.person_name) {
                      setHoveredEvent(event);
                    }
                  }}
                  onMouseOut={() => {
                    setHoveredEvent(null);
                  }}
                  className='bubble-main'
                  data-event-id={event.fk_origin_article_id} // Add data attribute to identify the event
                  // onClick={() => {}} --> on click event is handled on the SVG element
                >
                </circle>
                <h1 className="bubble-label" x={event.x} y={event.y} opacity={1} textAnchor="middle" dy=".3em">{event.headline}</h1>
                </g>
              ))}
            </g>
          
            {/* Render connector lines between x axis and event boxes in timeline */}
            <EventBoxConnectorLines xScale={xScale} dateIndexMap={dateIndexMap} innerHeight={innerHeight} />
          </g>
        </svg>
        {/* Render tooltip when hovered or when a filter is applied */}
        {hoveredEvent ? (
          <Tooltip hoveredEvent={hoveredEvent} margin={margin} />
        ) : null}
      </div>

      {/* Render the EventTimeline component */}
      <EventTimeline width={width}/>
    </div>
  );
}

export default BubbleChart;