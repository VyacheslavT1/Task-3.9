import React, { useState, useEffect } from "react";
import styles from "./TimeLine.module.css";

interface TimeLineProps {
  cellHeight: number;
}

const TimeLine: React.FC<TimeLineProps> = ({ cellHeight }) => {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 60_000);
    return () => clearInterval(id);
  }, []);

  const hours = now.getHours();
  const minutes = now.getMinutes();
  const percents = (minutes / 60) * 100;

  return (
    <div className={styles.container}>
      <div
        className={`${styles.line} ${styles.current}`}
        style={{
          top: hours * cellHeight + cellHeight / 2 - 1,
          left: 0,
          width: `${percents}%`,
        }}
      />
    </div>
  );
};

export default TimeLine;
