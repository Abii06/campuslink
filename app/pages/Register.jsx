"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useAuth } from "../contexts/AuthContext"
import { suppressBrowserExtensionWarnings } from "../utils/suppressWarnings"
import FormWrapper from "../components/FormWrapper"

export default function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "student",
    studentId: "",
    department: "",
    year: "",
    phone: "",
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const { register } = useAuth()
  const router = useRouter()

  const backgroundImageUrl = "/placeholder.svg?height=600&width=800&text=Student+Registration"

  // Suppress browser extension warnings on component mount
  useEffect(() => {
    suppressBrowserExtensionWarnings()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setSuccess("")
    
    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match!")
      return
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long!")
      return
    }

    if (formData.role === 'student' && !formData.studentId) {
      setError("Student ID is required for student accounts!")
      return
    }

    if (formData.role === 'student' && !formData.department) {
      setError("Department is required for student accounts!")
      return
    }

    if (formData.role === 'student' && !formData.year) {
      setError("Year is required for student accounts!")
      return
    }

    setLoading(true)

    try {
      // Prepare user data for API
      const userData = {
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
        role: formData.role,
      }

      // Only add phone if provided and not empty
      if (formData.phone && formData.phone.trim()) {
        userData.phone = formData.phone.trim()
      }

      // Add student-specific fields if role is student
      if (formData.role === 'student') {
        userData.studentId = formData.studentId.trim()
        userData.department = formData.department
        userData.year = parseInt(formData.year)
      }

      console.log('Registering user with data:', userData)

      // Call the register function from AuthContext
      const result = await register(userData)
      
      if (result.success) {
        setSuccess("Registration successful! Redirecting to dashboard...")
        setTimeout(() => {
          router.push("/dashboard")
        }, 1500)
      } else {
        setError(result.message || "Registration failed. Please try again.")
      }
    } catch (error) {
      console.error('Registration error:', error)
      setError(error.message || "Registration failed. Please try again.")
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
    <FormWrapper>
      <div className="min-h-screen bg-primary flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl w-full grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
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
            <div className="w-16 h-16 gradient-bg-2 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">📝</span>
            </div>
            <h2 className="text-3xl font-bold text-primary">Join CampusLink</h2>
            <p className="text-secondary mt-2">Create your account</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          {/* Success Message */}
          {success && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-primary mb-2">
                Full Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                className="input"
                placeholder="Enter your full name"
                value={formData.name}
                onChange={handleChange}
                suppressHydrationWarning={true}
                autoComplete="name"
              />
            </div>

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
                suppressHydrationWarning={true}
                autoComplete="email"
              />
            </div>

            <div>
              <label htmlFor="role" className="block text-sm font-medium text-primary mb-2">
                Account Type
              </label>
              <select
                id="role"
                name="role"
                required
                className="input"
                value={formData.role}
                onChange={handleChange}
              >
                <option value="student">Student</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-primary mb-2">
                Phone Number (Optional)
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                className="input"
                placeholder="Enter your 10-digit phone number"
                value={formData.phone}
                onChange={handleChange}
                pattern="[0-9]{10}"
                title="Please enter a 10-digit phone number"
                suppressHydrationWarning={true}
                autoComplete="tel"
              />
            </div>

            {/* Student-specific fields - only show for students */}
            {formData.role === 'student' && (
              <>
                <div>
                  <label htmlFor="studentId" className="block text-sm font-medium text-primary mb-2">
                    Student ID
                  </label>
                  <input
                    id="studentId"
                    name="studentId"
                    type="text"
                    required
                    className="input"
                    placeholder="Enter your student ID"
                    value={formData.studentId}
                    onChange={handleChange}
                    suppressHydrationWarning={true}
                    autoComplete="off"
                  />
                </div>

                <div>
                  <label htmlFor="department" className="block text-sm font-medium text-primary mb-2">
                    Department
                  </label>
                  <select
                    id="department"
                    name="department"
                    required
                    className="input"
                    value={formData.department}
                    onChange={handleChange}
                  >
                    <option value="">Select Department</option>
                    <option value="Computer Science">Computer Science</option>
                    <option value="Engineering">Engineering</option>
                    <option value="Business">Business</option>
                    <option value="Arts">Arts</option>
                    <option value="Science">Science</option>
                    <option value="Mathematics">Mathematics</option>
                    <option value="Physics">Physics</option>
                    <option value="Chemistry">Chemistry</option>
                    <option value="Biology">Biology</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="year" className="block text-sm font-medium text-primary mb-2">
                    Year
                  </label>
                  <select
                    id="year"
                    name="year"
                    required
                    className="input"
                    value={formData.year}
                    onChange={handleChange}
                  >
                    <option value="">Select Year</option>
                    <option value="1">1st Year</option>
                    <option value="2">2nd Year</option>
                    <option value="3">3rd Year</option>
                    <option value="4">4th Year</option>
                  </select>
                </div>
              </>
            )}

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
                placeholder="Create a password"
                value={formData.password}
                onChange={handleChange}
                suppressHydrationWarning={true}
                autoComplete="new-password"
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-primary mb-2">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                className="input"
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChange={handleChange}
                suppressHydrationWarning={true}
                autoComplete="new-password"
              />
            </div>

            <button type="submit" disabled={loading} className="btn btn-primary w-full">
              {loading ? "Creating Account..." : "Create Account"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-secondary">
            Already have an account?{" "}
            <Link href="/login" className="text-accent hover:underline font-medium">
              Sign in here
            </Link>
          </p>
        </div>
      </div>
    </div>
    </FormWrapper>
  )
}
