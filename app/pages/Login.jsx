"use client"

import { useState, useEffect, Suspense } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { useAuth } from "../contexts/AuthContext"

function LoginInner() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const [loading, setLoading] = useState(false)
  const [loginType, setLoginType] = useState("student")
  const [error, setError] = useState("")
  const { login } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const role = searchParams.get('role')
    if (role === 'admin' || role === 'student') {
      setLoginType(role)
      // Pre-fill credentials based on role for demo
      if (role === 'admin') {
        setFormData({
          email: "admin@campuslink.com",
          password: "admin123"
        })
      } else {
        setFormData({
          email: "john@student.com",
          password: "student123"
        })
      }
    }
  }, [searchParams])

  const backgroundImageUrl = "/placeholder.svg?height=600&width=800&text=Student+Login"

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const result = await login(formData.email, formData.password)
      
      if (result.success) {
        router.push("/dashboard")
      } else {
        setError(result.message || "Login failed")
      }
    } catch (error) {
      setError("Login failed. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  return (
    <div className="min-h-screen bg-primary flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl w-full grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        {/* Left Side - Image */}
        <div className="hidden lg:block">
          <div
            className="w-full h-96 rounded-2xl shadow-2xl"
            style={{
              backgroundImage: `url(${backgroundImageUrl})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />
        </div>

        {/* Right Side - Form */}
        <div className="card max-w-md mx-auto w-full">
          <div className="text-center mb-8">
            <div className="w-16 h-16 gradient-bg-1 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🎓</span>
            </div>
            <h2 className="text-3xl font-bold text-primary">
              {loginType === 'admin' ? 'Admin Login' : 'Student Login'}
            </h2>
            <p className="text-secondary mt-2">
              Sign in to your CampusLink {loginType} account
            </p>
            
            {/* Role Toggle */}
            <div className="mt-4 flex bg-gray-100 rounded-lg p-1">
              <button
                type="button"
                onClick={() => {
                  setLoginType('student')
                  setFormData({
                    email: "john@student.com",
                    password: "student123"
                  })
                }}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                  loginType === 'student'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                👨‍🎓 Student
              </button>
              <button
                type="button"
                onClick={() => {
                  setLoginType('admin')
                  setFormData({
                    email: "admin@campuslink.com",
                    password: "admin123"
                  })
                }}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                  loginType === 'admin'
                    ? 'bg-white text-purple-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                👨‍💼 Admin
              </button>
            </div>
            
            {/* Demo Credentials */}
            <div className="mt-4 p-3 bg-green-50 rounded-lg text-sm">
              <p className="font-medium text-green-800 mb-2">
                {loginType === 'admin' ? 'Admin' : 'Student'} Demo Credentials:
              </p>
              <div className="text-green-700">
                <p><strong>Email:</strong> {formData.email}</p>
                <p><strong>Password:</strong> {formData.password}</p>
              </div>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-primary mb-2">
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="input"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-primary mb-2">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="input"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input id="remember-me" name="remember-me" type="checkbox" className="h-4 w-4 text-accent" />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-secondary">
                  Remember me
                </label>
              </div>
              <Link href="#" className="text-sm text-accent hover:underline">
                Forgot password?
              </Link>
            </div>

            <button type="submit" disabled={loading} className="btn btn-primary w-full">
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-secondary">
            Don't have an account?{" "}
            <Link href="/register" className="text-accent hover:underline font-medium">
              Sign up here
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default function Login() {
  return (
    <Suspense>
      <LoginInner />
    </Suspense>
  )
}
