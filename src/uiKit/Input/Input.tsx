import React, { InputHTMLAttributes } from "react";
import styles from './Input.module.css'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

const Input: React.FC<InputProps> = ({ label, ...props }) => {
  return (
    <div className={styles.inputContainer}>
      {label && <label className={styles.inputLabel}>{label}</label>}
      <input className={styles.input} {...props} />
    </div>
  );
};

export default Input;
