"use client"

import Link from "next/link"
import { useAuth } from "../contexts/AuthContext"
import { useRouter } from "next/navigation"

export default function Landing() {
  const { user } = useAuth()
  const router = useRouter()

  const handleAdminLogin = () => {
    router.push("/login?role=admin")
  }

  const handleStudentLogin = () => {
    router.push("/login?role=student")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob" style={{animationDelay: '2s'}}></div>
        <div className="absolute top-40 left-40 w-80 h-80 bg-indigo-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob" style={{animationDelay: '4s'}}></div>
      </div>

      {/* Header */}
      <nav className="bg-white/80 backdrop-blur-lg shadow-lg relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl flex items-center justify-center shadow-lg transform hover:scale-110 transition-transform">
                <span className="text-white font-bold text-2xl">🎓</span>
              </div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                CampusLink
              </h1>
            </div>
            {user && (
              <Link href="/dashboard" className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-xl hover:from-purple-700 hover:to-blue-700 transition-all transform hover:scale-105 shadow-lg">
                Dashboard
              </Link>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="animate-fade-in-up">
            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-gray-900 mb-8 leading-tight">
              Welcome to{" "}
              <span className="bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 bg-clip-text text-transparent animate-gradient block sm:inline" style={{backgroundSize: '400% 400%'}}>
                CampusLink
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-700 max-w-4xl mx-auto mb-20 leading-relaxed" style={{animationDelay: '0.3s', animationFillMode: 'both'}}>
              Your centralized hub for campus utilities - announcements, lost & found, timetables, and hostel complaints
            </p>
          </div>

          {!user && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-5xl mx-auto animate-fade-in-up" style={{animationDelay: '0.5s', animationFillMode: 'both'}}>
              {/* Student Login Card */}
              <div className="group bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-10 hover:shadow-3xl transition-all duration-500 transform hover:-translate-y-2 border border-white/20">
                <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-3xl flex items-center justify-center mx-auto mb-8 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <span className="text-4xl">👨‍🎓</span>
                </div>
                <h3 className="text-3xl font-bold text-gray-900 mb-6 text-center">Student Portal</h3>
                <p className="text-gray-600 mb-8 text-center leading-relaxed">
                  Access announcements, manage your timetable, report lost items, and submit hostel complaints
                </p>
                <button
                  onClick={handleStudentLogin}
                  className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-bold py-4 px-8 rounded-2xl hover:from-blue-600 hover:to-cyan-600 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl text-lg"
                >
                  Student Login →
                </button>
              </div>

              {/* Admin Login Card */}
              <div className="group bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-10 hover:shadow-3xl transition-all duration-500 transform hover:-translate-y-2 border border-white/20">
                <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-3xl flex items-center justify-center mx-auto mb-8 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <span className="text-4xl">👨‍💼</span>
                </div>
                <h3 className="text-3xl font-bold text-gray-900 mb-6 text-center">Admin Portal</h3>
                <p className="text-gray-600 mb-8 text-center leading-relaxed">
                  Manage campus announcements, handle complaints, and oversee all campus activities
                </p>
                <button
                  onClick={handleAdminLogin}
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold py-4 px-8 rounded-2xl hover:from-purple-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl text-lg"
                >
                  Admin Login →
                </button>
              </div>
            </div>
          )}

          {user && (
            <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-12 max-w-3xl mx-auto border border-white/20 animate-fade-in-up">
              <div className="text-center">
                <div className="w-24 h-24 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-8 shadow-lg">
                  <span className="text-4xl">👋</span>
                </div>
                <h3 className="text-4xl font-bold text-gray-900 mb-6">
                  Welcome back, {user.name}!
                </h3>
                <p className="text-xl text-gray-600 mb-10">
                  You're logged in as <span className="font-semibold text-purple-600">{user.role === 'admin' ? 'Administrator' : 'Student'}</span>
                </p>
                <Link href="/dashboard" className="inline-block bg-gradient-to-r from-purple-600 to-blue-600 text-white px-12 py-4 rounded-2xl hover:from-purple-700 hover:to-blue-700 transition-all transform hover:scale-105 shadow-lg hover:shadow-xl text-xl font-bold">
                  Go to Dashboard →
                </Link>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Footer Section */}
      <section className="py-20 bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-full h-full bg-black/10"></div>
          <div className="absolute -top-20 -left-20 w-40 h-40 bg-white/10 rounded-full blur-xl"></div>
          <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-white/10 rounded-full blur-xl"></div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 animate-fade-in-up">
            Welcome to the Future of Campus Management
          </h2>
          <p className="text-xl md:text-2xl text-purple-100 max-w-3xl mx-auto leading-relaxed animate-fade-in-up animation-delay-300">
            Join thousands of students and administrators who trust CampusLink for seamless campus operations
          </p>
          <div className="mt-12 flex justify-center space-x-8 animate-fade-in-up animation-delay-500">
            <div className="text-center">
              <div className="text-3xl font-bold text-white">1000+</div>
              <div className="text-purple-200">Active Students</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white">50+</div>
              <div className="text-purple-200">Administrators</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white">24/7</div>
              <div className="text-purple-200">Support</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}