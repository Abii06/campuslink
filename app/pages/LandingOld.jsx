"use client"

import Link from "next/link"
import { useAuth } from "../contexts/AuthContext"

export default function Landing() {
  const { user } = useAuth()

  const backgroundImageUrl = "/placeholder.svg?height=800&width=1200&text=Campus+Background"

  return (
    <div className="min-h-screen bg-primary">
      {/* Hero Section */}
      <section className="relative overflow-hidden background-pattern">
        <div
          className="absolute inset-0 z-0 opacity-10"
          style={{
            backgroundImage: `url(${backgroundImageUrl})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
        />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h1 className="text-5xl md:text-7xl font-bold text-primary mb-6">
              Welcome to{" "}
              <span className="bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
                CampusLink
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-secondary mb-8 max-w-3xl mx-auto">
              Your centralized hub for campus utilities - announcements, lost & found, timetables, and complaint
              management all in one place.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {user ? (
                <Link href="/dashboard" className="btn btn-primary text-lg px-8 py-4">
                  Go to Dashboard
                </Link>
              ) : (
                <>
                  <Link href="/register" className="btn btn-primary text-lg px-8 py-4">
                    Get Started
                  </Link>
                  <Link href="/login" className="btn btn-secondary text-lg px-8 py-4">
                    Sign In
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-secondary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-primary mb-4">Everything you need for campus life</h2>
            <p className="text-xl text-secondary max-w-2xl mx-auto">
              Streamline your student experience with our comprehensive suite of campus utilities
            </p>
          </div>

          {/* Features removed as requested */}
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-primary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="card">
              <div className="text-4xl font-bold gradient-bg-1 bg-clip-text text-transparent mb-2">500+</div>
              <div className="text-lg text-secondary">Active Students</div>
            </div>
            <div className="card">
              <div className="text-4xl font-bold gradient-bg-2 bg-clip-text text-transparent mb-2">50+</div>
              <div className="text-lg text-secondary">Daily Announcements</div>
            </div>
            <div className="card">
              <div className="text-4xl font-bold gradient-bg-3 bg-clip-text text-transparent mb-2">95%</div>
              <div className="text-lg text-secondary">Issue Resolution Rate</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 gradient-bg-5">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-white mb-6">Ready to simplify your campus life?</h2>
          <p className="text-xl text-white/90 mb-8">
            Join thousands of students who are already using CampusLink to stay organized and connected
          </p>
          {!user && (
            <Link href="/register" className="btn bg-white text-gray-900 hover:bg-gray-100 text-lg px-8 py-4">
              Sign Up Now - It's Free!
            </Link>
          )}
        </div>
      </section>
    </div>
  )
}
