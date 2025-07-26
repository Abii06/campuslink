"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useAuth } from "../contexts/AuthContext"
import { useTheme } from "../contexts/ThemeContext"

export default function Navbar() {
  const { user, logout } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const router = useRouter()

  const handleLogout = () => {
    logout()
    router.push("/")
  }

  // Don't show navbar on landing page if user is not logged in
  if (!user) {
    return null
  }

  return (
    <nav className="bg-white/80 backdrop-blur-xl sticky top-0 z-50 border-b border-purple-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3">
            <div className="w-12 h-12 gradient-bg-1 rounded-2xl flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-xl">🎓</span>
            </div>
            <span className="text-primary font-bold text-2xl">CampusLink</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            {user ? (
              <>
                <Link href="/dashboard" className="text-secondary hover:text-accent transition-colors font-medium px-3 py-2 rounded-lg hover:bg-purple-50">
                  Dashboard
                </Link>
                <Link href="/announcements" className="text-secondary hover:text-accent transition-colors font-medium px-3 py-2 rounded-lg hover:bg-purple-50">
                  Announcements
                </Link>
                <Link href="/recent-activities" className="text-secondary hover:text-accent transition-colors font-medium px-3 py-2 rounded-lg hover:bg-purple-50">
                  Activities
                </Link>
                {user.role === "student" && (
                  <>
                    <Link href="/lost-found" className="text-secondary hover:text-accent transition-colors font-medium px-3 py-2 rounded-lg hover:bg-purple-50">
                      Lost & Found
                    </Link>
                    <Link href="/timetable" className="text-secondary hover:text-accent transition-colors font-medium px-3 py-2 rounded-lg hover:bg-purple-50">
                      Timetable
                    </Link>
                  </>
                )}
                <Link href="/complaints" className="text-secondary hover:text-accent transition-colors font-medium px-3 py-2 rounded-lg hover:bg-purple-50">
                  Complaints
                </Link>
                {user.role === "admin" && (
                  <Link href="/admin" className="text-secondary hover:text-accent transition-colors font-medium px-3 py-2 rounded-lg hover:bg-purple-50">
                    Admin
                  </Link>
                )}
                <button
                  onClick={toggleTheme}
                  className="p-3 rounded-xl bg-purple-50 hover:bg-purple-100 transition-colors"
                >
                  {theme === "light" ? "🌙" : "☀️"}
                </button>
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 gradient-bg-1 rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold text-sm">{user.name?.charAt(0) || "U"}</span>
                  </div>
                  <span className="text-primary font-semibold">{user.name}</span>
                  <button onClick={handleLogout} className="btn btn-secondary">
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <>
                <button
                  onClick={toggleTheme}
                  className="p-3 rounded-xl bg-purple-50 hover:bg-purple-100 transition-colors"
                >
                  {theme === "light" ? "🌙" : "☀️"}
                </button>
                <Link href="/login" className="btn btn-secondary">
                  Login
                </Link>
                <Link href="/register" className="btn btn-primary">
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-lg bg-secondary hover:bg-tertiary transition-colors"
          >
            <div className="w-6 h-6 flex flex-col justify-center items-center">
              <span
                className={`block h-0.5 w-6 bg-primary transition-all ${isMenuOpen ? "rotate-45 translate-y-1" : ""}`}
              ></span>
              <span
                className={`block h-0.5 w-6 bg-primary transition-all mt-1 ${isMenuOpen ? "opacity-0" : ""}`}
              ></span>
              <span
                className={`block h-0.5 w-6 bg-primary transition-all mt-1 ${isMenuOpen ? "-rotate-45 -translate-y-1" : ""}`}
              ></span>
            </div>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-opacity-20">
            {user ? (
              <div className="space-y-3">
                <Link href="/dashboard" className="block text-secondary hover:text-accent transition-colors py-2">
                  Dashboard
                </Link>
                <Link href="/announcements" className="block text-secondary hover:text-accent transition-colors py-2">
                  Announcements
                </Link>
                <Link href="/recent-activities" className="block text-secondary hover:text-accent transition-colors py-2">
                  Activities
                </Link>
                {user.role === "student" && (
                  <>
                    <Link href="/lost-found" className="block text-secondary hover:text-accent transition-colors py-2">
                      Lost & Found
                    </Link>
                    <Link href="/timetable" className="block text-secondary hover:text-accent transition-colors py-2">
                      Timetable
                    </Link>
                  </>
                )}
                <Link href="/complaints" className="block text-secondary hover:text-accent transition-colors py-2">
                  Complaints
                </Link>
                {user.role === "admin" && (
                  <Link href="/admin" className="block text-secondary hover:text-accent transition-colors py-2">
                    Admin Panel
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="block text-secondary hover:text-accent transition-colors py-2 w-full text-left"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                <Link href="/login" className="block btn btn-secondary">
                  Login
                </Link>
                <Link href="/register" className="block btn btn-primary">
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  )
}
