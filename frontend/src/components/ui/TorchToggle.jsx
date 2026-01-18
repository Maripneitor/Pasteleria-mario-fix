import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

const TorchContainer = styled.div`
  /* Container sizing */
  width: 40px;
  height: 100px;
  position: relative;
  cursor: pointer;
  
  /* Torch Body styling */
  .torch-body {
    width: 14px;
    height: 50px;
    background: #5D4037; /* Dark Wood */
    position: absolute;
    bottom: 0;
    left: 13px;
    border-radius: 4px;
    background-image: repeating-linear-gradient(
      45deg,
      rgba(0,0,0,0.2) 0px,
      rgba(0,0,0,0.2) 2px,
      transparent 2px,
      transparent 8px
    );
    z-index: 10;
  }

  /* Connection ring */
  .torch-ring {
    width: 20px;
    height: 6px;
    background: #8D6E63;
    position: absolute;
    bottom: 46px;
    left: 10px;
    border-radius: 2px;
    z-index: 11;
  }

  /* The Flame */
  .flame {
    position: absolute;
    bottom: 52px;
    left: 10px;
    width: 20px;
    height: 20px;
    background: #ff8f00; /* Torch Fire */
    border-radius: 50% 0 50% 50%;
    transform: rotate(-45deg);
    transition: all 0.4s ease-out;
    opacity: 0; /* Default OFF */
    box-shadow: 0 0 0 rgba(255, 143, 0, 0);
    z-index: 5;
  }

  /* Active State (Dark Mode ON) */
  &.active .flame {
    opacity: 1;
    height: 35px;
    box-shadow: 
      0 0 15px #ff8f00,
      0 -10px 30px #ff6f00, 
      2px -5px 10px #FFD700; /* Gold inner */
    animation: flicker 1s infinite alternate;
  }

  /* Smoke when OFF */
  .smoke {
    position: absolute;
    bottom: 60px;
    left: 15px;
    width: 10px;
    height: 10px;
    background: rgba(100, 100, 100, 0.2);
    border-radius: 50%;
    opacity: 0;
  }

  &.inactive .smoke {
    animation: smokeCheck 1.5s ease-out;
  }

  @keyframes flicker {
    0%   { transform: rotate(-45deg) scale(1); opacity: 0.9; }
    20%  { transform: rotate(-43deg) scale(1.1); opacity: 1; }
    40%  { transform: rotate(-46deg) scale(0.9); opacity: 0.8; }
    60%  { transform: rotate(-44deg) scale(1.05); opacity: 1; }
    80%  { transform: rotate(-45deg) scale(0.95); opacity: 0.9; }
    100% { transform: rotate(-45deg) scale(1); opacity: 0.9; }
  }

  @keyframes smokeCheck {
    0% { opacity: 0.6; transform: translateY(0) scale(1); }
    100% { opacity: 0; transform: translateY(-30px) scale(2); }
  }
`;

const TorchToggle = () => {
  useEffect(() => {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setIsDark(true);
    }
  }, []);

  const toggle = () => {
    setIsDark(!isDark);
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <TorchContainer
        className={isDark ? 'active' : 'inactive'}
        onClick={toggle}
        title={isDark ? "Apagar Antorcha (Modo Claro)" : "Encender Antorcha (Modo Oscuro)"}
      >
        <div className="flame"></div>
        <div className="smoke"></div>
        <div className="torch-ring"></div>
        <div className="torch-body"></div>
      </TorchContainer>
      <span className="text-xs font-serif text-bakery-muted dark:text-gray-500 font-bold tracking-widest">
        {isDark ? 'NOCHE' : 'DÍA'}
      </span>
    </div>
  );
};

export default TorchToggle;
