import React from "react";
import { getRadiusBasedOnInfluence } from "../../utils";
import './Tooltip.css'; 

function Tooltip({ hoveredEvent, margin}) {
  console.log(hoveredEvent);
  
  return (
    <div
      className="Tooltip"
      style={{
        left: `${
          hoveredEvent.x +
          margin.left +
          getRadiusBasedOnInfluence(hoveredEvent["Overall influence"]) / 2
        }px`,
        top: `${
          hoveredEvent.y +
          margin.top +
          getRadiusBasedOnInfluence(hoveredEvent["Overall influence"]) / 2 
        }px`,
      }}
    >
      <b style={{ fontSize: '1.5em' }}>{hoveredEvent.person_name}</b>
      <br />
      <strong>Date:</strong> {hoveredEvent.article_date}
      <br />
      <strong>Sentiment:</strong> {hoveredEvent.sentiment_score}
      <br />
      <strong>Influence:</strong> {hoveredEvent["Overall influence"]}
      <br />
      <strong>Citation:</strong> {hoveredEvent.citation}
      <br />
      <em> {hoveredEvent["text"]}  </em> 
      <a className="EventBox-readmore" href={hoveredEvent.article_url} target="_blank" rel="noopener noreferrer">Read more</a>
    </div>
  );
}

export default Tooltip;
