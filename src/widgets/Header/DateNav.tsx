import React from "react";
import { Button } from "shared/ui/components";
import { useLazySVG } from "shared/hooks/useLazySVG";
import styles from "./Header.module.css";

interface DateNavProps {
  onToday: () => void;
  onPrevious: () => void;
  onNext: () => void;
  headerLabel: string;
}

const DateNav: React.FC<DateNavProps> = ({
  onToday,
  onPrevious,
  onNext,
  headerLabel,
}) => {
  const PrevIcon = useLazySVG("shared/icons/chevron-left.svg?react");
  const NextIcon = useLazySVG("shared/icons/chevron-right.svg?react");

  return (
    <div className={styles.leftSide}>
      <Button variant="primary" onClick={onToday}>
        Today
      </Button>
      <Button variant="secondary" onClick={onPrevious}>
        {PrevIcon && <PrevIcon />}
      </Button>
      <Button variant="secondary" onClick={onNext}>
        {NextIcon && <NextIcon />}
      </Button>

      <span className={styles.currentMonth}>{headerLabel}</span>
    </div>
  );
};

export default DateNav;
