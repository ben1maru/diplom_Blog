import React from 'react';

interface ButtonPanelProps {
  increaseFontSize: () => void;
  decreaseFontSize: () => void;
  toggleDarkMode: () => void;
  isDarkMode: boolean; // Доданий проп isDarkMode
}
const ButtonPanel: React.FC<ButtonPanelProps> = ({
  increaseFontSize,
  decreaseFontSize,
  toggleDarkMode,
  isDarkMode,
}) => {
  return (
    <div className="flex justify-end mb-1 mt-1">
      <button
        className={`bg-blue-500 hover:bg-blue-700 ${isDarkMode ? 'text-black' : 'text-white' } font-bold py-2 px-4 rounded mr-2`}onClick={increaseFontSize}>
        А+
      </button>
      <button
        className={`bg-blue-500 hover:bg-blue-700 ${isDarkMode ? 'text-black' : 'text-white'} font-bold py-2 px-4 rounded`} onClick={decreaseFontSize}>
        А-
      </button>
      <button
        className={`bg-blue-500 hover:bg-blue-700 ${isDarkMode ? 'text-black' : 'text-white' } font-bold py-2 px-4 rounded ml-2`} onClick={toggleDarkMode}>
        <img src="https://dsns.gov.ua/images/public/contrast.svg" alt="Інверсія"  className={` object-cover rounded-lg ${isDarkMode ? 'grayscale' : ''}`}/>
      </button>
    </div>
  );
};

export default ButtonPanel;
