import React, { useState } from 'react';


type CheckboxProps = {
    label?:string;
    defaultChecked?: boolean
};

// Переписать нормально

const Checkbox: React.FC<CheckboxProps> = ({ label = "выполнить", defaultChecked = false }) => {
    const [checked, setChecked] = useState(defaultChecked);
  
    return (
      <label style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '8px',
        cursor: 'pointer',
        userSelect: 'none'
      }}>
        <div style={{
          width: '16px',
          height: '16px',
          position: 'relative',
          backgroundColor: '#E8C9A7', // Цвет дерева
          border: '2px solid #5D4037', // Темная рамка
          boxShadow: `
            inset 2px 2px 0 rgba(255,255,255,0.2),
            1px 1px 0 #5D4037` // Тени
        }}>
          {/* Галочка (появляется при checked) */}
          {checked && (
            <div style={{
              position: 'absolute',
              width: '12px',
              height: '12px',
              left: '50%',
              top: '50%',
              transform: 'translate(-50%, -50%)', // Центрирование
              backgroundColor: '#5D4037', // Темный цвет галочки
              clipPath: `
                polygon(
                  14% 44%,
                  0% 64%,
                  50% 100%,
                  100% 16%,
                  80% 0%,
                  40% 62%
                )`
            }}/>
          )}
        </div>
        {label && (
          <span style={{
            fontFamily: '"Courier New", monospace',
            fontSize: '16px',
            color: '#5D4037',
            textShadow: '1px 1px 0 rgba(0,0,0,0.1)'
          }}>
            {label}
          </span>
        )}
        <input
          type="checkbox"
          checked={checked}
          onChange={() => setChecked(!checked)}
          style={{
            position: 'absolute',
            opacity: 0,
            width: 0,
            height: 0
          }}
        />
      </label>
    );
  };
   
export default Checkbox;