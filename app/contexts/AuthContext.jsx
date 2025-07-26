"use client"

import { createContext, useContext, useState, useEffect } from "react"
import { authService } from "../../lib/services"

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check for saved token and get current user
    const checkAuth = async () => {
      if (authService.isAuthenticated()) {
        try {
          const response = await authService.getCurrentUser()
          if (response.success) {
            setUser(response.user)
          } else {
            // Token is invalid, remove it
            await authService.logout()
          }
        } catch (error) {
          console.error("Auth check failed:", error)
          await authService.logout()
        }
      }
      setLoading(false)
    }

    checkAuth()
  }, [])

  const login = async (email, password) => {
    try {
      setLoading(true)
      const response = await authService.login(email, password)
      if (response.success) {
        setUser(response.user)
        return { success: true, user: response.user }
      } else {
        return { success: false, message: response.message }
      }
    } catch (error) {
      console.error("Login error:", error)
      return { success: false, message: error.message || "Login failed" }
    } finally {
      setLoading(false)
    }
  }

  const register = async (userData) => {
    try {
      setLoading(true)
      const response = await authService.register(userData)
      if (response.success) {
        setUser(response.user)
        return { success: true, user: response.user }
      } else {
        return { success: false, message: response.message }
      }
    } catch (error) {
      console.error("Registration error:", error)
      return { success: false, message: error.message || "Registration failed" }
    } finally {
      setLoading(false)
    }
  }

  const logout = async () => {
    setUser(null)
    await authService.logout()
  }

  const updateProfile = async (userData) => {
    try {
      const response = await authService.updateProfile(userData)
      if (response.success) {
        setUser(response.user)
        return { success: true, user: response.user }
      } else {
        return { success: false, message: response.message }
      }
    } catch (error) {
      console.error("Profile update error:", error)
      return { success: false, message: error.message || "Profile update failed" }
    }
  }

  const isAdmin = () => {
    return user?.role === "admin"
  }

  const isAuthenticated = () => {
    return !!user && authService.isAuthenticated()
  }

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        login, 
        register, 
        logout, 
        updateProfile, 
        isAdmin, 
        isAuthenticated, 
        loading 
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
