"use client"

import { useState } from "react"
import { useAuth } from "../contexts/AuthContext"
import { useData } from "../contexts/DataContext"
import Link from "next/link"

export default function RecentActivities() {
  const { user, isAdmin } = useAuth()
  const { announcements, complaints, lostFoundItems } = useData()
  const [filter, setFilter] = useState("all")
  const [sortBy, setSortBy] = useState("date")
  const [selectedActivity, setSelectedActivity] = useState(null)
  const [showDetailModal, setShowDetailModal] = useState(false)

  // Combine all activities from different sources
  const getAllActivities = () => {
    const activities = []

    // Add announcements
    announcements.forEach(announcement => {
      activities.push({
        id: `announcement-${announcement.id}`,
        type: "announcement",
        title: announcement.title,
        description: announcement.content,
        time: announcement.date,
        category: announcement.category,
        priority: announcement.priority,
        icon: "📢",
        color: "bg-blue-100 text-blue-800",
        itemId: announcement.id,
        itemData: announcement
      })
    })

    // Add complaints (only user's own complaints for students, all for admin)
    const relevantComplaints = isAdmin() 
      ? complaints 
      : complaints.filter(c => c.reportedById === user?.id)
    
    relevantComplaints.forEach(complaint => {
      activities.push({
        id: `complaint-${complaint.id}`,
        type: "complaint",
        title: complaint.title,
        description: `${complaint.category} issue in ${complaint.block} - Room ${complaint.roomNumber}`,
        time: complaint.date,
        category: complaint.category,
        priority: complaint.priority,
        status: complaint.status,
        icon: "🏠",
        color: complaint.status === "resolved" 
          ? "bg-green-100 text-green-800" 
          : complaint.status === "in-progress" 
          ? "bg-blue-100 text-blue-800" 
          : "bg-yellow-100 text-yellow-800",
        itemId: complaint.id,
        itemData: complaint
      })
    })

    // Add lost & found items (only for students)
    if (!isAdmin()) {
      lostFoundItems.forEach(item => {
        activities.push({
          id: `lostfound-${item.id}`,
          type: "lostfound",
          title: `${item.type === "lost" ? "Lost" : "Found"}: ${item.title}`,
          description: `${item.category} item in ${item.location}`,
          time: item.date,
          category: item.category,
          icon: item.type === "lost" ? "❌" : "✅",
          color: item.type === "lost" ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800",
          itemId: item.id,
          itemData: item
        })
      })
    }

    return activities
  }

  const filteredActivities = getAllActivities()
    .filter(activity => {
      if (filter === "all") return true
      return activity.type === filter
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "date":
          return new Date(b.time) - new Date(a.time)
        case "type":
          return a.type.localeCompare(b.type)
        case "priority":
          if (!a.priority || !b.priority) return 0
          const priorityOrder = { urgent: 4, high: 3, medium: 2, low: 1 }
          return priorityOrder[b.priority] - priorityOrder[a.priority]
        default:
          return 0
      }
    })

  const getActivityTypeLabel = (type) => {
    switch (type) {
      case "announcement": return "Announcements"
      case "complaint": return "Complaints"
      case "lostfound": return "Lost & Found"
      default: return "All Activities"
    }
  }

  const handleViewDetails = (activity) => {
    setSelectedActivity(activity)
    setShowDetailModal(true)
  }

  const closeDetailModal = () => {
    setShowDetailModal(false)
    setSelectedActivity(null)
  }

  const filters = ["all", "announcement", "complaint"]
  if (!isAdmin()) {
    filters.push("lostfound")
  }

  return (
    <div className="min-h-screen bg-secondary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-primary mb-2">Recent Activities</h1>
              <p className="text-secondary">
                {isAdmin() 
                  ? "All campus activities and administrative updates" 
                  : "Your recent activities and campus updates"}
              </p>
            </div>
            <Link href="/dashboard" className="btn btn-secondary">
              ← Back to Dashboard
            </Link>
          </div>
        </div>

        {/* Filters and Controls */}
        <div className="card mb-8">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="flex flex-wrap gap-2">
              <span className="text-sm font-medium text-secondary">Filter by Type:</span>
              {filters.map((filterType) => (
                <button
                  key={filterType}
                  onClick={() => setFilter(filterType)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    filter === filterType 
                      ? "bg-purple-600 text-white shadow-md" 
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-300"
                  }`}
                >
                  {getActivityTypeLabel(filterType)}
                </button>
              ))}
            </div>
            <div className="flex items-center space-x-4">
              <select
                className="input"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="date">Sort by Date</option>
                <option value="type">Sort by Type</option>
                <option value="priority">Sort by Priority</option>
              </select>
            </div>
          </div>
        </div>

        {/* Activities List */}
        <div className="space-y-4">
          {filteredActivities.length === 0 ? (
            <div className="card text-center py-12">
              <div className="text-6xl mb-4">📭</div>
              <h3 className="text-xl font-semibold text-primary mb-2">No Activities Found</h3>
              <p className="text-secondary">
                {filter === "all" 
                  ? "No recent activities to display." 
                  : `No ${getActivityTypeLabel(filter).toLowerCase()} found.`}
              </p>
            </div>
          ) : (
            filteredActivities.map((activity) => (
              <div key={activity.id} className="card hover:shadow-lg transition-shadow">
                <div className="flex items-start space-x-4">
                  {/* Icon */}
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center text-white text-xl">
                      {activity.icon}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-primary mb-1">
                          {activity.title}
                        </h3>
                        <p className="text-secondary text-sm mb-3">
                          {activity.description}
                        </p>
                        <div className="flex flex-wrap items-center gap-2">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${activity.color}`}>
                            {activity.type.charAt(0).toUpperCase() + activity.type.slice(1)}
                          </span>
                          {activity.status && (
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              activity.status === "resolved" 
                                ? "bg-green-100 text-green-800" 
                                : activity.status === "in-progress" 
                                ? "bg-blue-100 text-blue-800" 
                                : "bg-yellow-100 text-yellow-800"
                            }`}>
                              {activity.status.toUpperCase()}
                            </span>
                          )}
                          {activity.priority && (
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              activity.priority === "urgent" 
                                ? "bg-red-100 text-red-800" 
                                : activity.priority === "high" 
                                ? "bg-orange-100 text-orange-800" 
                                : activity.priority === "medium" 
                                ? "bg-yellow-100 text-yellow-800" 
                                : "bg-gray-100 text-gray-800"
                            }`}>
                              {activity.priority} priority
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex flex-col items-end space-y-2">
                        <span className="text-xs text-secondary">{activity.time}</span>
                        <button 
                          onClick={() => handleViewDetails(activity)}
                          className="text-purple-600 hover:text-purple-800 text-sm font-medium hover:underline"
                        >
                          View Details →
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Summary Stats */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="card text-center">
            <div className="text-2xl font-bold text-blue-600 mb-2">
              {getAllActivities().filter(a => a.type === "announcement").length}
            </div>
            <div className="text-sm text-secondary">Total Announcements</div>
          </div>
          <div className="card text-center">
            <div className="text-2xl font-bold text-orange-600 mb-2">
              {getAllActivities().filter(a => a.type === "complaint").length}
            </div>
            <div className="text-sm text-secondary">
              {isAdmin() ? "Total Complaints" : "Your Complaints"}
            </div>
          </div>
          {!isAdmin() && (
            <div className="card text-center">
              <div className="text-2xl font-bold text-green-600 mb-2">
                {getAllActivities().filter(a => a.type === "lostfound").length}
              </div>
              <div className="text-sm text-secondary">Lost & Found Items</div>
            </div>
          )}
        </div>

        {/* Detail Modal */}
        {showDetailModal && selectedActivity && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              {/* Modal Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <h2 className="text-2xl font-bold text-gray-900">
                  {selectedActivity.type.charAt(0).toUpperCase() + selectedActivity.type.slice(1)} Details
                </h2>
                <button
                  onClick={closeDetailModal}
                  className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
                >
                  ×
                </button>
              </div>

              {/* Modal Content */}
              <div className="p-6">
                {selectedActivity.type === "announcement" && (
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        {selectedActivity.itemData.title}
                      </h3>
                      <div className="flex flex-wrap gap-2 mb-4">
                        <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                          {selectedActivity.itemData.category}
                        </span>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                          selectedActivity.itemData.priority === "urgent" 
                            ? "bg-red-100 text-red-800" 
                            : selectedActivity.itemData.priority === "high" 
                            ? "bg-orange-100 text-orange-800" 
                            : selectedActivity.itemData.priority === "medium" 
                            ? "bg-yellow-100 text-yellow-800" 
                            : "bg-gray-100 text-gray-800"
                        }`}>
                          {selectedActivity.itemData.priority} priority
                        </span>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-700 mb-2">Content:</h4>
                      <p className="text-gray-600 leading-relaxed">
                        {selectedActivity.itemData.content}
                      </p>
                    </div>
                    <div className="flex items-center justify-between text-sm text-gray-500 pt-4 border-t">
                      <span>Posted: {selectedActivity.itemData.date}</span>
                      <span>By: Administration</span>
                    </div>
                  </div>
                )}

                {selectedActivity.type === "complaint" && (
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        {selectedActivity.itemData.title}
                      </h3>
                      <div className="flex flex-wrap gap-2 mb-4">
                        <span className="px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm font-medium">
                          {selectedActivity.itemData.category}
                        </span>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                          selectedActivity.itemData.status === "resolved" 
                            ? "bg-green-100 text-green-800" 
                            : selectedActivity.itemData.status === "in-progress" 
                            ? "bg-blue-100 text-blue-800" 
                            : "bg-yellow-100 text-yellow-800"
                        }`}>
                          {selectedActivity.itemData.status.toUpperCase()}
                        </span>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                          selectedActivity.itemData.priority === "urgent" 
                            ? "bg-red-100 text-red-800" 
                            : selectedActivity.itemData.priority === "high" 
                            ? "bg-orange-100 text-orange-800" 
                            : selectedActivity.itemData.priority === "medium" 
                            ? "bg-yellow-100 text-yellow-800" 
                            : "bg-gray-100 text-gray-800"
                        }`}>
                          {selectedActivity.itemData.priority} priority
                        </span>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-700 mb-2">Description:</h4>
                      <p className="text-gray-600 leading-relaxed">
                        {selectedActivity.itemData.description}
                      </p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-semibold text-gray-700 mb-1">Location:</h4>
                        <p className="text-gray-600">{selectedActivity.itemData.block} - Room {selectedActivity.itemData.roomNumber}</p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-700 mb-1">Reported By:</h4>
                        <p className="text-gray-600">{selectedActivity.itemData.reportedBy}</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-sm text-gray-500 pt-4 border-t">
                      <span>Submitted: {selectedActivity.itemData.date}</span>
                      <span>ID: #{selectedActivity.itemData.id}</span>
                    </div>
                  </div>
                )}

                {selectedActivity.type === "lostfound" && (
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        {selectedActivity.itemData.title}
                      </h3>
                      <div className="flex flex-wrap gap-2 mb-4">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                          selectedActivity.itemData.type === "lost" 
                            ? "bg-red-100 text-red-800" 
                            : "bg-green-100 text-green-800"
                        }`}>
                          {selectedActivity.itemData.type === "lost" ? "❌ Lost Item" : "✅ Found Item"}
                        </span>
                        <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                          {selectedActivity.itemData.category}
                        </span>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-700 mb-2">Description:</h4>
                      <p className="text-gray-600 leading-relaxed">
                        {selectedActivity.itemData.description}
                      </p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-semibold text-gray-700 mb-1">Location:</h4>
                        <p className="text-gray-600">{selectedActivity.itemData.location}</p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-700 mb-1">Contact:</h4>
                        <p className="text-gray-600">{selectedActivity.itemData.contactInfo}</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-sm text-gray-500 pt-4 border-t">
                      <span>Reported: {selectedActivity.itemData.date}</span>
                      <span>By: {selectedActivity.itemData.reportedBy}</span>
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex justify-end space-x-3 mt-6 pt-4 border-t">
                  <button
                    onClick={closeDetailModal}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium"
                  >
                    Close
                  </button>
                  <Link
                    href={
                      selectedActivity.type === "announcement" ? "/announcements" :
                      selectedActivity.type === "complaint" ? "/complaints" :
                      "/lost-found"
                    }
                    className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-medium"
                    onClick={closeDetailModal}
                  >
                    Go to {selectedActivity.type === "announcement" ? "Announcements" : 
                           selectedActivity.type === "complaint" ? "Complaints" : "Lost & Found"}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}