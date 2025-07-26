"use client"

import { ThemeProvider } from "../contexts/ThemeContext"
import { AuthProvider } from "../contexts/AuthContext"
import { DataProvider } from "../contexts/DataContext"
import Navbar from "./Navbar"

export default function ClientLayout({ children }) {
  return (
    <ThemeProvider>
      <AuthProvider>
        <DataProvider>
          <div className="min-h-screen transition-colors duration-300">
            <Navbar />
            {children}
          </div>
        </DataProvider>
      </AuthProvider>
    </ThemeProvider>
  )
}