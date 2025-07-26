"use client"

import { useState, useEffect } from "react"

export default function Complaints() {
  const [complaints, setComplaints] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [filter, setFilter] = useState("all")
  const [newComplaint, setNewComplaint] = useState({
    title: "",
    category: "",
    description: "",
    hostelBlock: "",
    roomNumber: "",
    priority: "medium",
  })

  const categories = ["water", "electricity", "cleaning", "maintenance", "internet", "other"]
  const priorities = ["low", "medium", "high", "urgent"]
  const statuses = ["all", "pending", "in-progress", "resolved"]

  useEffect(() => {
    // Mock complaints data
    const mockComplaints = [
      {
        id: 1,
        title: "Water Supply Issue",
        category: "water",
        description: "No water supply in my room for the past 2 days. Please resolve urgently.",
        hostelBlock: "Block A",
        roomNumber: "205",
        priority: "high",
        status: "in-progress",
        dateSubmitted: "2024-01-15",
        lastUpdated: "2024-01-16",
        response: "Maintenance team has been notified. Work will start tomorrow.",
      },
      {
        id: 2,
        title: "Internet Connection Problem",
        category: "internet",
        description: "WiFi keeps disconnecting every few minutes. Unable to attend online classes.",
        hostelBlock: "Block B",
        roomNumber: "301",
        priority: "medium",
        status: "pending",
        dateSubmitted: "2024-01-14",
        lastUpdated: "2024-01-14",
      },
      {
        id: 3,
        title: "Electricity Fluctuation",
        category: "electricity",
        description: "Power keeps going on and off. This is affecting my studies and damaging electronics.",
        hostelBlock: "Block C",
        roomNumber: "102",
        priority: "urgent",
        status: "resolved",
        dateSubmitted: "2024-01-12",
        lastUpdated: "2024-01-13",
        response: "Electrical issue has been fixed. New stabilizer installed.",
      },
    ]
    setComplaints(mockComplaints)
  }, [])

  const handleSubmit = (e) => {
    e.preventDefault()
    const complaintWithId = {
      ...newComplaint,
      id: Date.now(),
      status: "pending",
      dateSubmitted: new Date().toISOString().split("T")[0],
      lastUpdated: new Date().toISOString().split("T")[0],
    }

    setComplaints([complaintWithId, ...complaints])
    setNewComplaint({
      title: "",
      category: "",
      description: "",
      hostelBlock: "",
      roomNumber: "",
      priority: "medium",
    })
    setShowForm(false)
  }

  const filteredComplaints = complaints.filter((complaint) => {
    return filter === "all" || complaint.status === filter
  })

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
      case "in-progress":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
      case "resolved":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
    }
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "low":
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
      case "medium":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
      case "high":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200"
      case "urgent":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
    }
  }

  const getCategoryIcon = (category) => {
    const icons = {
      water: "💧",
      electricity: "⚡",
      cleaning: "🧹",
      maintenance: "🔧",
      internet: "📶",
      other: "📋",
    }
    return icons[category] || "📋"
  }

  return (
    <div className="min-h-screen bg-primary">
      {/* Header */}
      <section className="background-pattern py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-primary mb-4">Hostel Complaints 🏠</h1>
            <p className="text-xl text-secondary">Report and track hostel-related issues</p>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Action Bar */}
        <div className="card mb-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div>
              <h2 className="text-xl font-bold text-primary">My Complaints</h2>
              <p className="text-secondary">Track your reported issues</p>
            </div>
            <div className="flex items-center space-x-4">
              {/* Status Filter */}
              <select value={filter} onChange={(e) => setFilter(e.target.value)} className="input min-w-[120px]">
                {statuses.map((status) => (
                  <option key={status} value={status}>
                    {status.charAt(0).toUpperCase() + status.slice(1).replace("-", " ")}
                  </option>
                ))}
              </select>
              <button onClick={() => setShowForm(!showForm)} className="btn btn-primary">
                ➕ New Complaint
              </button>
            </div>
          </div>
        </div>

        {/* Complaint Form */}
        {showForm && (
          <div className="card mb-8">
            <h3 className="text-lg font-bold text-primary mb-6">Submit New Complaint</h3>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-primary mb-2">Complaint Title *</label>
                  <input
                    type="text"
                    required
                    className="input"
                    placeholder="Brief description of the issue"
                    value={newComplaint.title}
                    onChange={(e) => setNewComplaint({ ...newComplaint, title: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-primary mb-2">Category *</label>
                  <select
                    required
                    className="input"
                    value={newComplaint.category}
                    onChange={(e) => setNewComplaint({ ...newComplaint, category: e.target.value })}
                  >
                    <option value="">Select Category</option>
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {getCategoryIcon(category)} {category.charAt(0).toUpperCase() + category.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-primary mb-2">Description *</label>
                <textarea
                  required
                  rows={4}
                  className="input resize-none"
                  placeholder="Provide detailed description of the issue..."
                  value={newComplaint.description}
                  onChange={(e) => setNewComplaint({ ...newComplaint, description: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-primary mb-2">Hostel Block *</label>
                  <select
                    required
                    className="input"
                    value={newComplaint.hostelBlock}
                    onChange={(e) => setNewComplaint({ ...newComplaint, hostelBlock: e.target.value })}
                  >
                    <option value="">Select Block</option>
                    <option value="Block A">Block A</option>
                    <option value="Block B">Block B</option>
                    <option value="Block C">Block C</option>
                    <option value="Block D">Block D</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-primary mb-2">Room Number *</label>
                  <input
                    type="text"
                    required
                    className="input"
                    placeholder="e.g., 205"
                    value={newComplaint.roomNumber}
                    onChange={(e) => setNewComplaint({ ...newComplaint, roomNumber: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-primary mb-2">Priority *</label>
                  <select
                    required
                    className="input"
                    value={newComplaint.priority}
                    onChange={(e) => setNewComplaint({ ...newComplaint, priority: e.target.value })}
                  >
                    {priorities.map((priority) => (
                      <option key={priority} value={priority}>
                        {priority.charAt(0).toUpperCase() + priority.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex space-x-4">
                <button type="submit" className="btn btn-primary">
                  Submit Complaint
                </button>
                <button type="button" onClick={() => setShowForm(false)} className="btn btn-secondary">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Complaints List */}
        <div className="space-y-6">
          {filteredComplaints.map((complaint) => (
            <div key={complaint.id} className="card hover:scale-[1.01] transition-all duration-300">
              <div className="flex flex-col lg:flex-row justify-between items-start gap-4">
                <div className="flex-1">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 gradient-bg-4 rounded-lg flex items-center justify-center">
                        <span className="text-lg">{getCategoryIcon(complaint.category)}</span>
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-primary">{complaint.title}</h3>
                        <p className="text-sm text-secondary">
                          #{complaint.id} • {complaint.hostelBlock} - Room {complaint.roomNumber}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(complaint.priority)}`}
                      >
                        {complaint.priority} priority
                      </span>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(complaint.status)}`}
                      >
                        {complaint.status.replace("-", " ")}
                      </span>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-secondary mb-4 line-clamp-2">{complaint.description}</p>

                  {/* Response */}
                  {complaint.response && (
                    <div className="bg-secondary rounded-lg p-4 mb-4">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="text-sm font-medium text-primary">📋 Admin Response:</span>
                      </div>
                      <p className="text-sm text-secondary">{complaint.response}</p>
                    </div>
                  )}

                  {/* Footer */}
                  <div className="flex items-center justify-between text-sm text-secondary">
                    <span>Submitted: {complaint.dateSubmitted}</span>
                    <span>Last updated: {complaint.lastUpdated}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredComplaints.length === 0 && (
          <div className="text-center py-12">
            <div className="w-24 h-24 gradient-bg-4 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">🏠</span>
            </div>
            <h3 className="text-xl font-bold text-primary mb-2">No complaints found</h3>
            <p className="text-secondary">
              {filter !== "all"
                ? `No complaints with ${filter.replace("-", " ")} status.`
                : "You haven't submitted any complaints yet."}
            </p>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-12">
          <div className="card text-center">
            <div className="text-2xl font-bold gradient-bg-1 bg-clip-text text-transparent mb-2">
              {complaints.filter((c) => c.status === "pending").length}
            </div>
            <div className="text-sm text-secondary">Pending</div>
          </div>
          <div className="card text-center">
            <div className="text-2xl font-bold gradient-bg-2 bg-clip-text text-transparent mb-2">
              {complaints.filter((c) => c.status === "in-progress").length}
            </div>
            <div className="text-sm text-secondary">In Progress</div>
          </div>
          <div className="card text-center">
            <div className="text-2xl font-bold gradient-bg-3 bg-clip-text text-transparent mb-2">
              {complaints.filter((c) => c.status === "resolved").length}
            </div>
            <div className="text-sm text-secondary">Resolved</div>
          </div>
          <div className="card text-center">
            <div className="text-2xl font-bold gradient-bg-4 bg-clip-text text-transparent mb-2">
              {complaints.length}
            </div>
            <div className="text-sm text-secondary">Total</div>
          </div>
        </div>
      </div>
    </div>
  )
}
