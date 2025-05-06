import React from "react";
import styles from "../styles/legend.module.css";
import LegendCard from "./LegendCard";

const LegendPanel = ({ data }) => {
  return (
    <div className={styles.legendContainer}>
      {data.map((item, idx) => (        
        <LegendCard key={idx} {...item} />
      ))}
    </div>
  );
};

export default LegendPanel;
