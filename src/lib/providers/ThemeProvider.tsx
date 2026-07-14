'use client';

import React, { createContext, useState, useEffect, useContext } from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextProps {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextProps | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
//   const [theme, setThemeState] = useState<Theme>('dark');
const [theme, setThemeState] = useState<Theme>(() => {
  if (typeof window === "undefined") return "dark";

  const stored = localStorage.getItem("theme");

  return stored === "light" ? "light" : "dark";
});

//   useEffect(() => {
//     if (typeof window === 'undefined') return;
//     const storedTheme = window.localStorage.getItem('theme') as Theme | null;
//     if (storedTheme === 'dark' || storedTheme === 'light') {
//       setThemeState(storedTheme);
//     }
//   }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
      root.classList.remove('light');
    } else {
      root.classList.remove('dark');
      root.classList.add('light');
    }

    window.localStorage.setItem('theme', theme);
  }, [theme]);

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
  };

  const toggleTheme = () => {
    setThemeState((current) => (current === 'dark' ? 'light' : 'dark'));
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useThemeContext() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useThemeContext must be used within a ThemeProvider');
  }
  return context;
}
