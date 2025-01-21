import React, { createContext, useContext, useState } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const theme = {
    isDarkMode,
    colors: isDarkMode ? {
      background: 'black',
      surface: '#1E1E1E', 
      text: '#FFFFFF',
      textSecondary: '#B3B3B3',
      border: '#2C2C2C',
      primary: '#FFFFFF',
      card: '#242424',
      icon: '#FFFFFF'
    } : {
      background: '#FFFFFF',
      surface: '#FFFFFF',
      text: '#000000',
      textSecondary: '#666666',
      border: '#EEEEEE',
      primary: '#000000',
      card: '#F5F5F5',
      icon: '#000000'
    },
    toggleTheme: () => setIsDarkMode(prev => !prev)
  };

  return (
    <ThemeContext.Provider value={theme}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext); 