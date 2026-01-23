import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

const TorchCheckbox = () => {
    const [isChecked, setIsChecked] = useState(false);

    useEffect(() => {
        // Check local storage or system preference
        const darkMode = localStorage.getItem('theme') === 'dark' ||
            (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches);
        setIsChecked(darkMode);
        if (darkMode) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, []);

    const handleToggle = () => {
        const newState = !isChecked;
        setIsChecked(newState);
        if (newState) {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    };

    return (
        <StyledWrapper>
            <input type="checkbox" id="torch-toggle" checked={isChecked} onChange={handleToggle} />
            <label htmlFor="torch-toggle" className="container">
                <div className="torch" />
            </label>
        </StyledWrapper>
    );
}

const StyledWrapper = styled.div`
  /* Hide the default checkbox */
  input[type="checkbox"] {
    position: absolute;
    opacity: 0;
    width: 0;
    height: 0;
  }

  .container {
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    width: 50px;  /* Ajustado para encajar en el sidebar */
    height: 80px;
  }

  .torch {
    position: relative;
    width: 15px;
    height: 40px;
    background: #5d4037; /* Madera oscura */
    border-radius: 3px;
    transition: all 0.3s ease;
  }
  
  /* Top of the torch handle detail */
  .torch::before {
    content: '';
    position: absolute;
    top: -5px;
    left: -2px;
    width: 19px;
    height: 8px;
    background: #8d6e63;
    border-radius: 2px;
  }

  /* Flame Logic */
  .torch::after {
    content: '';
    position: absolute;
    top: -30px; /* Position flame above torch */
    left: 50%;
    transform: translateX(-50%) scale(0);
    width: 25px;
    height: 35px;
    background: radial-gradient(ellipse at bottom, #ffee58 0%, #ff7043 50%, transparent 80%);
    border-radius: 50% 50% 20% 20%;
    filter: blur(2px);
    opacity: 0;
    transition: all 0.4s ease-out;
    animation: none;
  }

  /* Checked State (Dark Mode Active) */
  input:checked + .container .torch::after {
    transform: translateX(-50%) scale(1);
    opacity: 1;
    animation: flicker 0.2s infinite alternate;
    box-shadow: 0 -10px 30px 10px rgba(255, 112, 67, 0.4); /* Glow effect */
  }
  
  /* Glow on the torch body */
  input:checked + .container .torch {
     box-shadow: 0 0 10px rgba(255, 167, 38, 0.3);
  }

  @keyframes flicker {
    0% { transform: translateX(-50%) scale(1) skewX(-2deg); opacity: 0.9; }
    50% { transform: translateX(-50%) scale(1.05) skewX(2deg); opacity: 1; height: 37px; }
    100% { transform: translateX(-50%) scale(0.95) skewX(-1deg); opacity: 0.8; }
  }
`;

export default TorchCheckbox;
