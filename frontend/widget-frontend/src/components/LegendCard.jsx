import React from "react";
import styles from "../styles/legend.module.css";

const LegendCard = ({ name, party, color, avatar }) => {
  const partyIcon = party === "Democrat" ? "🐴" : party === "Republican" ? "🐘" : "❓";

  return (
    <div className={styles.card}>
      <img src={avatar} alt={name} className={styles.avatar} />
      <div className={styles.name}>{name}</div>
      <div>{partyIcon}</div>
      <div className={styles.colorDot} style={{ backgroundColor: color }} />
    </div>
  );
};

export default LegendCard;
