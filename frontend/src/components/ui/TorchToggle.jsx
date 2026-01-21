import React from 'react';
import VelaSwitch from './VelaSwitch';

const TorchToggle = () => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <div className="flex flex-col items-center gap-2">
      <VelaSwitch isChecked={isDark} onChange={toggleTheme} />
    </div>
  );
};

export default TorchToggle;
