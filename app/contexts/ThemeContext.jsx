"use client"

import { createContext, useContext, useState, useEffect } from "react"

const ThemeContext = createContext()

export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider")
  }
  return context
}

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState("light")

  useEffect(() => {
    const savedTheme = localStorage.getItem("campuslink-theme") || "light"
    setTheme(savedTheme)
    document.documentElement.className = savedTheme
  }, [])

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light"
    setTheme(newTheme)
    localStorage.setItem("campuslink-theme", newTheme)
    document.documentElement.className = newTheme
  }

  return <ThemeContext.Provider value={{ theme, toggleTheme }}>{children}</ThemeContext.Provider>
}
