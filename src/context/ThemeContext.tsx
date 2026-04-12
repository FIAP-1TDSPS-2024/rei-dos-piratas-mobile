import React, { createContext, useContext, useState, useEffect } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { colors as baseColors } from '../styles/globalStyles'; // Puxando suas cores base pra reaproveitar

// Paleta Clara (O que você já usa hoje)
const lightColors = {
  ...baseColors, // Mantém sua cor primária, success, danger intactas
  background: "#f4f4f5", // Fundo geral das telas
  surface: "#ffffff",    // Fundo de cards/carrinho
  text: baseColors.gray800,
  textSecondary: baseColors.gray500,
  border: baseColors.gray200,
};

// Paleta Escura
const darkColors = {
  ...baseColors,
  background: "#121214", // Fundo geral dark (padrão bonito e não 100% preto)
  surface: "#202024",    // Fundo dos cards dark
  text: "#e1e1e6",       // Texto principal claro
  textSecondary: "#a8a8b3", // Texto secundário
  border: "#323238",     // Bordas mais sutis
};

type ThemeContextType = {
  isDark: boolean;
  colors: typeof lightColors;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextType>({} as ThemeContextType);

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const systemTheme = useColorScheme();
  const [isDark, setIsDark] = useState(systemTheme === 'dark');

  useEffect(() => {
    // Busca se o usuário forçou um tema na última vez que abriu o app
    AsyncStorage.getItem('@theme_preference').then(savedTheme => {
      if (savedTheme) {
        setIsDark(savedTheme === 'dark');
      }
    });
  }, []);

  const toggleTheme = () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    AsyncStorage.setItem('@theme_preference', newTheme ? 'dark' : 'light');
  };

  const currentColors = isDark ? darkColors : lightColors;

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme, colors: currentColors }}>
      {children}
    </ThemeContext.Provider>
  );
};

// Hook personalizado pra você chamar nas telas
export const useTheme = () => useContext(ThemeContext);