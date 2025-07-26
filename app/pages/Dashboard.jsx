"use client"

import { useState } from "react"
import Link from "next/link"
import { useAuth } from "../contexts/AuthContext"
import { useData } from "../contexts/DataContext"

export default function Dashboard() {
  const { user, isAdmin } = useAuth()
  const { announcements, lostFoundItems, complaints } = useData()
  
  // Calculate real-time stats
  const stats = {
    announcements: announcements.length,
    lostItems: lostFoundItems.filter(item => item.type === "lost").length,
    foundItems: lostFoundItems.filter(item => item.type === "found").length,
    complaints: complaints.length,
    pendingComplaints: complaints.filter(complaint => complaint.status === "pending").length,
    upcomingClasses: 4, // This could be calculated from timetable data
  }

  const backgroundImageUrl = "/placeholder.svg?height=400&width=600&text=Campus+Dashboard"

  const quickActions = isAdmin() ? [
    {
      title: "Manage Announcements",
      description: "Create and manage campus announcements",
      icon: "📢",
      link: "/announcements",
      gradient: "gradient-bg-1",
    },
    {
      title: "Handle Complaints",
      description: "Review and resolve student complaints",
      icon: "🏠",
      link: "/complaints",
      gradient: "gradient-bg-4",
    },
    {
      title: "Admin Dashboard",
      description: "Access full admin controls",
      icon: "👨‍💼",
      link: "/admin",
      gradient: "gradient-bg-5",
    },
  ] : [
    {
      title: "View Announcements",
      description: "Check latest campus updates",
      icon: "📢",
      link: "/announcements",
      gradient: "gradient-bg-1",
    },
    {
      title: "Lost & Found",
      description: "Report or find lost items",
      icon: "🔍",
      link: "/lost-found",
      gradient: "gradient-bg-2",
    },
    {
      title: "My Timetable",
      description: "Manage your class schedule",
      icon: "📅",
      link: "/timetable",
      gradient: "gradient-bg-3",
    },
    {
      title: "Submit Complaint",
      description: "Report hostel issues",
      icon: "🏠",
      link: "/complaints",
      gradient: "gradient-bg-4",
    },
  ]

  // Generate recent activities from real data
  const recentActivities = [
    ...announcements.slice(0, 2).map(announcement => ({
      id: `ann-${announcement.id}`,
      type: "announcement",
      title: announcement.title,
      time: new Date(announcement.createdAt).toLocaleDateString(),
    })),
    ...lostFoundItems.slice(0, 2).map(item => ({
      id: `lf-${item.id}`,
      type: "lost-found",
      title: `${item.type === "lost" ? "Lost" : "Found"}: ${item.title}`,
      time: new Date(item.createdAt).toLocaleDateString(),
    })),
    ...complaints.slice(0, 2).map(complaint => ({
      id: `comp-${complaint.id}`,
      type: "complaint",
      title: `Complaint: ${complaint.title}`,
      time: new Date(complaint.createdAt).toLocaleDateString(),
    })),
  ].slice(0, 4)

  return (
    <div className="min-h-screen bg-primary">
      {/* Header Section */}
      <section className="relative overflow-hidden background-pattern py-16">
        <div
          className="absolute inset-0 z-0 opacity-5"
          style={{
            backgroundImage: `url(${backgroundImageUrl})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold text-primary mb-6">
              Welcome back, <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">{user?.name}</span>! 👋
            </h1>
            <p className="text-xl md:text-2xl text-secondary max-w-2xl mx-auto">
              Stay updated with your student portal
            </p>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          <div className="stats-card">
            <div className="stats-number">{stats.announcements}</div>
            <div className="stats-label">{isAdmin() ? "Published Announcements" : "Campus Announcements"}</div>
          </div>
          {!isAdmin() && (
            <>
              <div className="stats-card">
                <div className="stats-number">{stats.lostItems}</div>
                <div className="stats-label">Lost Items</div>
              </div>
              <div className="stats-card">
                <div className="stats-number">{stats.foundItems}</div>
                <div className="stats-label">Found Items</div>
              </div>
            </>
          )}
          <div className="stats-card">
            <div className="stats-number">{stats.pendingComplaints}</div>
            <div className="stats-label">{isAdmin() ? "Pending Complaints" : "My Complaints"}</div>
          </div>
          {isAdmin() && (
            <>
              <div className="stats-card">
                <div className="stats-number">{complaints.filter(c => c.status === "in-progress").length}</div>
                <div className="stats-label">In Progress</div>
              </div>
              <div className="stats-card">
                <div className="stats-number">{complaints.filter(c => c.status === "resolved").length}</div>
                <div className="stats-label">Resolved</div>
              </div>
            </>
          )}
        </div>

        {/* Admin Stats (if admin) */}
        {isAdmin() && (
          <div className="card mb-16">
            <h2 className="text-2xl font-bold text-primary mb-6">Admin Overview</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-yellow-50 p-6 rounded-2xl">
                <div className="text-3xl font-bold text-yellow-600 mb-2">{stats.pendingComplaints}</div>
                <div className="text-yellow-800 font-medium">Pending Complaints</div>
              </div>
              <div className="bg-blue-50 p-6 rounded-2xl">
                <div className="text-3xl font-bold text-blue-600 mb-2">
                  {complaints.filter(c => c.status === "in-progress").length}
                </div>
                <div className="text-blue-800 font-medium">In Progress</div>
              </div>
              <div className="bg-green-50 p-6 rounded-2xl">
                <div className="text-3xl font-bold text-green-600 mb-2">
                  {complaints.filter(c => c.status === "resolved").length}
                </div>
                <div className="text-green-800 font-medium">Resolved</div>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Quick Actions */}
          <div className="lg:col-span-2">
            <h2 className="text-3xl font-bold text-primary mb-8">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {quickActions.map((action, index) => (
                <Link
                  key={index}
                  href={action.link}
                  className="action-card"
                >
                  <div className={`action-card-icon ${action.gradient}`}>
                    <span>{action.icon}</span>
                  </div>
                  <h3 className="action-card-title">{action.title}</h3>
                  <p className="action-card-description">{action.description}</p>
                  <div className="action-card-arrow">
                    Explore {action.title} →
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Recent Activities */}
          <div>
            <h2 className="text-3xl font-bold text-primary mb-8">Recent Activities</h2>
            <div className="card">
              <div className="space-y-6">
                {recentActivities.map((activity) => (
                  <div key={activity.id} className="flex items-start space-x-4 p-4 rounded-2xl bg-secondary hover:bg-tertiary transition-colors">
                    <div className="w-12 h-12 gradient-bg-5 rounded-2xl flex items-center justify-center flex-shrink-0">
                      <span className="text-lg">
                        {activity.type === "announcement" && "📢"}
                        {activity.type === "lost-found" && "🔍"}
                        {activity.type === "complaint" && "🏠"}
                        {activity.type === "timetable" && "📅"}
                      </span>
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-primary mb-1">{activity.title}</p>
                      <p className="text-sm text-secondary">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
              <Link href="/recent-activities" className="btn btn-secondary w-full mt-6">
                View All Activities
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
