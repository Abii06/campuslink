"use client"

import { useEffect } from 'react'

export default function FormWrapper({ children }) {
  useEffect(() => {
    // Override console.error to filter out browser extension warnings
    const originalError = console.error
    console.error = (...args) => {
      const message = args.join(' ')
      
      // Filter out specific browser extension warnings
      if (
        message.includes('fdprocessedid') ||
        message.includes('Extra attributes from the server') ||
        message.includes('Warning: Extra attributes') ||
        message.includes('browser extension')
      ) {
        return // Don't log these errors
      }
      
      // Log all other errors normally
      originalError.apply(console, args)
    }

    // Also override console.warn for warnings
    const originalWarn = console.warn
    console.warn = (...args) => {
      const message = args.join(' ')
      
      if (
        message.includes('fdprocessedid') ||
        message.includes('Extra attributes from the server') ||
        message.includes('Warning: Extra attributes') ||
        message.includes('browser extension')
      ) {
        return
      }
      
      originalWarn.apply(console, args)
    }

    // Cleanup function to restore original console methods
    return () => {
      console.error = originalError
      console.warn = originalWarn
    }
  }, [])

  return <>{children}</>
}