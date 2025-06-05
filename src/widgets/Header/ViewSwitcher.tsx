import React from "react";
import { Dropdown } from "shared/ui/components";
import { useLazySVG } from "shared/hooks/useLazySVG";

interface ViewSwitcherProps {
  value: string;
  onChange: (newView: string) => void;
}

const viewOptions = [
  { value: "/weekView", label: "Week" },
  { value: "/dayView", label: "Day" },
];

const ViewSwitcher: React.FC<ViewSwitcherProps> = ({ value, onChange }) => {
  const DownIcon = useLazySVG("shared/icons/down-small.svg?react");

  return (
    <Dropdown
      variant="primary"
      options={viewOptions}
      value={value}
      onSelect={onChange}
      icon={DownIcon && <DownIcon />}
    />
  );
};

export default ViewSwitcher;
