import React from "react";
import styles from "./Select.module.css";
import { DifficultyStatus } from "../../Consts/status";

type SelectProps = {
  onStatusChange: (status: DifficultyStatus) => void;
  currentStatus: DifficultyStatus;
  options: {
    value: string;
    label: string
  }[]
};

const Select: React.FC<SelectProps> = ({ onStatusChange, options, currentStatus }) => {
  
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onStatusChange(e.target.value as DifficultyStatus);
  };

  return (
    <div className={styles.selectСontainer}>
      <select className={styles.select} value={currentStatus} onChange={handleChange}>
        {
          options?.map((option) => (
            <option key={option.value} value={option.value}>
            {option.label}
          </option>
          ))
        }
      </select>
    </div>
  );
};

export default Select;
