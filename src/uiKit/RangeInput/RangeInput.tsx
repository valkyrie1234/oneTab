import React, { useEffect, useState } from "react";
import styles from "./Range.module.css";

interface RangeInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size"> {
  inputSize?: "small" | "medium" | "large";
}

const RangeInput: React.FC<RangeInputProps> = ({
    inputSize = 'medium',
    className = '',
    value = 50,
    min = 0,
    max = 100,
    onChange,
    ...props
  }) => {
    const [progress, setProgress] = useState(Number(value));
  
    useEffect(() => {
      setProgress(Number(value));
    }, [value]);
  
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = Number(e.target.value);
      setProgress(newValue);
      if (onChange) {
        onChange(e);
      }
    };
  
    const calculatePosition = (val: number) => {
      const range = Number(max) - Number(min);
      const position = ((val - Number(min)) / range) * 100;
      return Math.min(100, Math.max(0, position));
    };
  
    const position = calculatePosition(progress);
  
    return (
      <div className={`${styles.rangeContainer} ${styles[inputSize]} ${className}`}>
        <input
          type="range"
          className={styles.rangeInput}
          value={progress}
          min={min}
          max={max}
          onChange={handleChange}
          {...props}
        />
        <div className={styles.track}>
          <div 
            className={styles.progress} 
            style={{ width: `${position}%` }} 
          />
        </div>
        <div 
          className={styles.thumb} 
          style={{ 
            left: `calc(${position}% - (var(--thumb-size) * ${position} / 100))` 
          }} 
        />
      </div>
    );
  };

export default RangeInput;
