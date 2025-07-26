"use client"

import { useState } from "react"
import { useAuth } from "../contexts/AuthContext"
import { useData } from "../contexts/DataContext"
import { useRouter } from "next/navigation"

export default function Admin() {
  const { user, isAdmin } = useAuth()
  const { announcements, complaints, updateComplaint, deleteAnnouncement, deleteComplaint } = useData()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("overview")
  const [showResolvedComplaints, setShowResolvedComplaints] = useState(false)

  // Redirect if not admin
  if (!isAdmin()) {
    router.push("/dashboard")
    return null
  }

  const handleStatusUpdate = (complaintId, newStatus) => {
    updateComplaint(complaintId, { status: newStatus })
  }

  const stats = {
    totalAnnouncements: announcements.length,
    totalComplaints: complaints.length,
    pendingComplaints: complaints.filter(c => c.status === "pending").length,
    inProgressComplaints: complaints.filter(c => c.status === "in-progress").length,
    resolvedComplaints: complaints.filter(c => c.status === "resolved").length,
  }

  return (
    <div className="min-h-screen bg-primary">
      {/* Header */}
      <section className="background-pattern py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold text-primary mb-6">
              Admin Dashboard 👨‍💼
            </h1>
            <p className="text-xl md:text-2xl text-secondary max-w-2xl mx-auto">
              Manage campus announcements, complaints, and lost & found items
            </p>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Navigation Tabs */}
        <div className="card mb-8">
          <div className="flex flex-wrap gap-2">
            {[
              { id: "overview", label: "Overview", icon: "📊" },
              { id: "announcements", label: "Announcements", icon: "📢" },
              { id: "complaints", label: "Complaints", icon: "🏠" },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-3 rounded-lg font-medium transition-all ${
                  activeTab === tab.id
                    ? "bg-purple-600 text-white shadow-md"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-300"
                }`}
              >
                {tab.icon} {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Overview Tab */}
        {activeTab === "overview" && (
          <div className="space-y-8">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-blue-50 p-6 rounded-2xl">
                <div className="text-3xl font-bold text-blue-600 mb-2">{stats.totalAnnouncements}</div>
                <div className="text-blue-800 font-medium">Total Announcements</div>
              </div>

              <div className="bg-purple-50 p-6 rounded-2xl">
                <div className="text-3xl font-bold text-purple-600 mb-2">{stats.totalComplaints}</div>
                <div className="text-purple-800 font-medium">Total Complaints</div>
              </div>
            </div>

            {/* Complaint Status Breakdown */}
            <div className="card">
              <h3 className="text-xl font-bold text-primary mb-6">Complaint Status Overview</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-yellow-50 p-6 rounded-2xl">
                  <div className="text-3xl font-bold text-yellow-600 mb-2">{stats.pendingComplaints}</div>
                  <div className="text-yellow-800 font-medium">Pending</div>
                </div>
                <div className="bg-blue-50 p-6 rounded-2xl">
                  <div className="text-3xl font-bold text-blue-600 mb-2">{stats.inProgressComplaints}</div>
                  <div className="text-blue-800 font-medium">In Progress</div>
                </div>
                <div className="bg-green-50 p-6 rounded-2xl">
                  <div className="text-3xl font-bold text-green-600 mb-2">{stats.resolvedComplaints}</div>
                  <div className="text-green-800 font-medium">Resolved</div>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="card">
              <h3 className="text-xl font-bold text-primary mb-6">Recent Activity</h3>
              <div className="space-y-4">
                {[...announcements.slice(0, 3), ...complaints.slice(0, 3)].map((item, index) => (
                  <div key={index} className="flex items-center space-x-4 p-4 bg-secondary rounded-lg">
                    <div className="w-10 h-10 gradient-bg-1 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm">
                        {item.category ? "📢" : "🏠"}
                      </span>
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-primary">{item.title}</p>
                      <p className="text-sm text-secondary">
                        {item.category ? "Announcement" : "Complaint"} • {item.date}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Announcements Tab */}
        {activeTab === "announcements" && (
          <div className="card">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-primary">Manage Announcements</h3>
              <span className="text-sm text-secondary">{announcements.length} total announcements</span>
            </div>
            <div className="space-y-4">
              {announcements.map(announcement => (
                <div key={announcement.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-semibold text-primary mb-2">{announcement.title}</h4>
                      <p className="text-secondary text-sm mb-2">{announcement.content}</p>
                      <div className="flex items-center space-x-4 text-xs text-secondary">
                        <span>Category: {announcement.category}</span>
                        <span>Priority: {announcement.priority}</span>
                        <span>Date: {announcement.date}</span>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        if (window.confirm("Are you sure you want to delete this announcement?")) {
                          deleteAnnouncement(announcement.id)
                        }
                      }}
                      className="text-red-500 hover:text-red-700 text-sm ml-4"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Complaints Tab */}
        {activeTab === "complaints" && (
          <div className="card">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-primary">Manage Complaints</h3>
              <div className="flex items-center space-x-4">
                <span className="text-sm text-secondary">
                  {complaints.filter(c => c.status !== "resolved").length} active complaints 
                  ({complaints.filter(c => c.status === "resolved").length} resolved)
                </span>
                <button
                  onClick={() => setShowResolvedComplaints(!showResolvedComplaints)}
                  className={`px-3 py-1 rounded-lg text-sm font-medium transition-all ${
                    showResolvedComplaints 
                      ? "bg-green-100 text-green-800 hover:bg-green-200" 
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {showResolvedComplaints ? "Hide Resolved" : "Show Resolved"}
                </button>
              </div>
            </div>
            <div className="space-y-4">
              {complaints
                .filter(complaint => showResolvedComplaints || complaint.status !== "resolved")
                .map(complaint => (
                <div key={complaint.id} className={`border rounded-lg p-4 ${
                  complaint.status === "resolved" 
                    ? "border-green-200 bg-green-50 opacity-75" 
                    : "border-gray-200"
                }`}>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-semibold text-primary mb-2">{complaint.title}</h4>
                      <p className="text-secondary text-sm mb-2">{complaint.description}</p>
                      <div className="flex items-center space-x-4 text-xs text-secondary mb-3">
                        <span>Category: {complaint.category}</span>
                        <span>Priority: {complaint.priority}</span>
                        <span>Room: {complaint.block} - {complaint.roomNumber}</span>
                        <span>Reported by: {complaint.reportedBy}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-medium">Status:</span>
                        <select
                          value={complaint.status}
                          onChange={(e) => handleStatusUpdate(complaint.id, e.target.value)}
                          className="text-sm border border-gray-300 rounded px-2 py-1"
                        >
                          <option value="pending">Pending</option>
                          <option value="in-progress">In Progress</option>
                          <option value="resolved">Resolved</option>
                        </select>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        if (window.confirm("Are you sure you want to delete this complaint?")) {
                          deleteComplaint(complaint.id)
                        }
                      }}
                      className="text-red-500 hover:text-red-700 text-sm ml-4"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}