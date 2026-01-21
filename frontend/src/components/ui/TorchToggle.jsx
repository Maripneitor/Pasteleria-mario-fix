import React from 'react';
import Switch from './Switch';
import { useTheme } from '../../context/ThemeContext';

const TorchToggle = () => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <div className="flex flex-col items-center gap-2">
      <Switch
        checked={isDark}
        onChange={toggleTheme}
        label={isDark ? "Dark Mode" : "Light Mode"}
      />
    </div>
  );
};

export default TorchToggle;
