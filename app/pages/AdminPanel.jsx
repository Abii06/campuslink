"use client"

import { useState } from "react"
import AdminLostFoundManager from "./AdminLostFoundManager"
import { useAuth } from "../contexts/AuthContext"

export default function AdminPanel() {
  const { user, isAdmin } = useAuth()
  const [activeTab, setActiveTab] = useState("overview")
  const [stats, setStats] = useState({
    totalStudents: 1247,
    activeComplaints: 23,
    resolvedComplaints: 156,
    totalAnnouncements: 45,
    lostItems: 12,
    foundItems: 8,
  })

  if (!isAdmin()) {
    return (
      <div className="min-h-screen bg-primary flex items-center justify-center">
        <div className="text-center">
          <div className="w-24 h-24 gradient-bg-1 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">🚫</span>
          </div>
          <h2 className="text-2xl font-bold text-primary mb-2">Access Denied</h2>
          <p className="text-secondary">You don't have permission to access this page.</p>
        </div>
      </div>
    )
  }

  const tabs = [
    { id: "overview", name: "Overview", icon: "📊" },
    { id: "announcements", name: "Announcements", icon: "📢" },
    { id: "complaints", name: "Complaints", icon: "🏠" },
    { id: "lost-found", name: "Lost & Found", icon: "🔍" },
    { id: "users", name: "Users", icon: "👥" },
  ]

  return (
    <div className="min-h-screen bg-primary">
      {/* Header */}
      <section className="background-pattern py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-primary mb-4">Admin Panel 👨‍💼</h1>
            <p className="text-xl text-secondary">Manage campus operations and student services</p>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Navigation Tabs */}
        <div className="card mb-8">
          <div className="flex flex-wrap gap-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  activeTab === tab.id 
                    ? "bg-purple-600 text-white shadow-md" 
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-300"
                }`}
              >
                {tab.icon} {tab.name}
              </button>
            ))}
          </div>
        </div>

        {/* Overview Tab */}
        {activeTab === "overview" && (
          <div className="space-y-8">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="card text-center">
                <div className="text-3xl font-bold gradient-bg-1 bg-clip-text text-transparent mb-2">
                  {stats.totalStudents}
                </div>
                <div className="text-secondary">Total Students</div>
              </div>
              <div className="card text-center">
                <div className="text-3xl font-bold gradient-bg-2 bg-clip-text text-transparent mb-2">
                  {stats.activeComplaints}
                </div>
                <div className="text-secondary">Active Complaints</div>
              </div>
              <div className="card text-center">
                <div className="text-3xl font-bold gradient-bg-3 bg-clip-text text-transparent mb-2">
                  {stats.resolvedComplaints}
                </div>
                <div className="text-secondary">Resolved Complaints</div>
              </div>
              <div className="card text-center">
                <div className="text-3xl font-bold gradient-bg-4 bg-clip-text text-transparent mb-2">
                  {stats.totalAnnouncements}
                </div>
                <div className="text-secondary">Total Announcements</div>
              </div>
              <div className="card text-center">
                <div className="text-3xl font-bold gradient-bg-5 bg-clip-text text-transparent mb-2">
                  {stats.lostItems}
                </div>
                <div className="text-secondary">Lost Items</div>
              </div>
              <div className="card text-center">
                <div className="text-3xl font-bold gradient-bg-1 bg-clip-text text-transparent mb-2">
                  {stats.foundItems}
                </div>
                <div className="text-secondary">Found Items</div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="card">
              <h3 className="text-xl font-bold text-primary mb-6">Recent Activity</h3>
              <div className="space-y-4">
                {[
                  { type: "complaint", text: "New water complaint from Block A, Room 205", time: "2 hours ago" },
                  { type: "announcement", text: "Posted semester exam schedule", time: "4 hours ago" },
                  { type: "lost-found", text: "Blue backpack marked as found", time: "6 hours ago" },
                  { type: "user", text: "New student registration: John Doe", time: "1 day ago" },
                ].map((activity, index) => (
                  <div key={index} className="flex items-center space-x-3 p-3 rounded-lg bg-secondary">
                    <div className="w-8 h-8 gradient-bg-2 rounded-lg flex items-center justify-center flex-shrink-0">
                      <span className="text-sm">
                        {activity.type === "complaint" && "🏠"}
                        {activity.type === "announcement" && "📢"}
                        {activity.type === "lost-found" && "🔍"}
                        {activity.type === "user" && "👤"}
                      </span>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-primary">{activity.text}</p>
                      <p className="text-xs text-secondary">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Lost & Found Management for Admins */}
        {activeTab === "lost-found" && (
          <div className="card py-8 px-4">
            <h2 className="text-2xl font-bold text-primary mb-6">Lost & Found Management</h2>
            <AdminLostFoundManager />
          </div>
        )}
        {/* Placeholder for other tabs */}
        {activeTab !== "overview" && activeTab !== "lost-found" && (
          <div className="card text-center py-12">
            <div className="w-24 h-24 gradient-bg-3 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">🚧</span>
            </div>
            <h3 className="text-xl font-bold text-primary mb-2">
              {tabs.find((tab) => tab.id === activeTab)?.name} Management
            </h3>
            <p className="text-secondary mb-6">
              This section is under development. Advanced management features coming soon!
            </p>
            <button className="btn btn-primary">Coming Soon</button>
          </div>
        )}
      </div>
    </div>
  )
}
