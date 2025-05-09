import * as d3 from 'd3'; // Import D3 library

// Function to calculate the radius size based on "Overall influence"
export const getRadiusBasedOnInfluence = (influence) => {
 /* switch (influence) {
    case "high":
      return 25;
    case "medium":
      return 15;
    case "low":
      return 8;
    default: */
    return 15;
  //}
};


// Format date using D3's timeFormat utility
export const formatDate = d3.timeFormat("%Y-%m-%d");


const opacityDimmed = 0.1;
// Function to calculate the opacity of the lines based on the hovered event and selected event and filter state
export const getOpacityLines = (event, hoveredEvent, selectedEvent, filter) => {
  if(hoveredEvent === null && selectedEvent === null && filter === null) {
    return opacityDimmed;
  }
  if(hoveredEvent !== null && selectedEvent === null && filter === null) {
    if(event.name === hoveredEvent.name) {
      return 1;
    }else{
      return opacityDimmed;
    }
  }
  if(hoveredEvent === null && selectedEvent !== null && filter === null) {
    if(event.name === selectedEvent.name) {
      return 1;
    }else{
      return opacityDimmed;
    }
  }
  if(hoveredEvent !== null && selectedEvent !== null && filter === null) {
    if(event.name === selectedEvent.name) {
      return 1;
    }else if(event.name === hoveredEvent.name) {
      return opacityDimmed;
    }else{
      return opacityDimmed;
    }
  }
  if(filter !== null) {
    if(event.name === filter) {
      return 1;
    }else{
      return opacityDimmed;
    }
  }
  return 1;
} 

// Function to calculate the opacity of the bubbles based on the hovered event and selected event and filter state
export const getOpacityBubbles = (event, hoveredEvent, selectedEvent, filter) => {
  if(hoveredEvent === null && selectedEvent === null && filter === null) {
    return 1;
  }
  if(hoveredEvent !== null && selectedEvent === null && filter === null) {
    if(event.name === hoveredEvent.name) {
      return 1;
    }else{
      return opacityDimmed;
    }
  }
  if(hoveredEvent === null && selectedEvent !== null && filter === null) {
    if(event.name === selectedEvent.name) {
      return 1;
    }else{
      return opacityDimmed;
    }
  }
  if(hoveredEvent !== null && selectedEvent !== null && filter === null) {
    if(event.name === selectedEvent.name) {
      return 1;
    }else if(event.name === hoveredEvent.name) {
      return opacityDimmed;
    }else{
      return opacityDimmed;
    }
  }

  if(filter !== null) {
    if(event.name === filter) {
      return 1;
    }else{
      return opacityDimmed;
    }
  }

  return 1;
};

  