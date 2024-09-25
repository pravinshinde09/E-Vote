import React, { createContext, useContext, useState, useEffect } from "react";
import { useColorScheme } from "react-native";
import { COLORS } from "../theme/colors";
import { type ColorCodes } from "../theme/colors";
import AsyncStorage from '@react-native-async-storage/async-storage';

export type ColorScheme = "light" | "dark";
export type Colors = Record<ColorCodes, string>;
export type StyleProps = {
  colors: Colors;
};
type ThemeContextType = {
  colorScheme: ColorScheme;
  colors: Colors;
  setColorScheme: (scheme: "light" | "dark") => void;
};

export const ThemeContext = createContext<ThemeContextType>({
  colorScheme: "light",
  colors: COLORS.light,
  setColorScheme: () => { },
});

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const systemColorScheme = useColorScheme();
  const [appColorScheme, setAppColorScheme] = useState<ColorScheme>(systemColorScheme as ColorScheme);

  useEffect(() => {
    const loadTheme = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem('@app_theme');
        if (savedTheme) {
          setAppColorScheme(savedTheme as ColorScheme);
        }
      } catch (error) {
        console.error('Failed to load the theme from storage', error);
      }
    };
    loadTheme();
  }, []);

  const setColorScheme = async (scheme: "light" | "dark") => {
    try {
      await AsyncStorage.setItem('@app_theme', scheme);
      setAppColorScheme(scheme);
    } catch (error) {
      console.error('Failed to save the theme to storage', error);
    }
  };

  const DefaultTheme = {
    colorScheme: appColorScheme,
    colors: COLORS[appColorScheme],
    setColorScheme,
  };

  return (
    <ThemeContext.Provider value={DefaultTheme}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
