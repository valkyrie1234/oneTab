import React from "react";
import styles from './Button.module.css'
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  size?: "small" | "medium" | "large";
}

const Button: React.FC<ButtonProps> = ({
  children,
  size = "medium",
  className = "",
  ...props
}) => {
  return (
    <button
      {...props}
      className={`${styles.button} ${styles[size]} ${className}`}
    >
      <span className={styles.content}>{children}</span>
    </button>
  );
};

export default Button;
