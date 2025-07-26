
"use client"
// Utility to map _id to id for all complaints
function mapComplaintsWithId(complaints) {
  return complaints.map(c => ({ ...c, id: c._id || c.id }));
}

import { useState, useEffect } from "react"
import { useAuth } from "../contexts/AuthContext"
import complaintService from "../../lib/services/complaintService"

export default function Complaints() {
  const { user, isAdmin } = useAuth();
  const [complaints, setComplaints] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [filter, setFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [sortBy, setSortBy] = useState("date");
  const [searchTerm, setSearchTerm] = useState("");
  const [newComplaint, setNewComplaint] = useState({
    title: "",
    category: "infrastructure",
    description: "",
    location: "",
    priority: "medium",
    isAnonymous: false,
  });

  // Fetch complaints from backend
  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const response = await complaintService.getComplaints();
        if (response.success && response.data) {
          setComplaints(mapComplaintsWithId(response.data));
        }
      } catch (error) {
        console.error("Error fetching complaints:", error);
      }
    };
    fetchComplaints();
  }, []);

  const categories = ["all", "infrastructure", "food", "transport", "academic", "hostel", "library", "sports", "other"]
  const priorities = ["low", "medium", "high", "urgent"]
  const statuses = ["all", "pending", "in-progress", "resolved"]

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newComplaint.title || !newComplaint.description) {
      alert("Please fill in all required fields");
      return;
    }
    try {
      const response = await complaintService.createComplaint({
        ...newComplaint,
        reportedBy: user?.name || "Anonymous",
        reportedById: user?.id || "anonymous",
      });
      if (response.success) {
        alert("Complaint submitted successfully!");
        // Refresh complaints list
        const refreshed = await complaintService.getComplaints();
        if (refreshed.success && refreshed.data) {
          setComplaints(mapComplaintsWithId(refreshed.data));
        }
      } else {
        alert("Failed to submit complaint. Please try again.");
      }
    } catch (error) {
      alert("Error submitting complaint. Please try again.");
      console.error("Error submitting complaint:", error);
    }
    setNewComplaint({
      title: "",
      category: "infrastructure",
      description: "",
      location: "",
      priority: "medium",
      isAnonymous: false,
    });
    setShowForm(false);
  };

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      await complaintService.updateComplaintStatus(id, newStatus);
      // Refresh complaints list
      const refreshed = await complaintService.getComplaints();
      if (refreshed.success && refreshed.data) {
        setComplaints(mapComplaintsWithId(refreshed.data));
      }
    } catch (error) {
      alert('Error updating complaint status. Please try again.');
      console.error('Error updating complaint status:', error);
    }
  }

  const handleDeleteComplaint = async (id) => {
    if (window.confirm("Are you sure you want to delete this complaint?")) {
      try {
        await complaintService.deleteComplaint(id);
        // Refresh complaints list
        const refreshed = await complaintService.getComplaints();
        if (refreshed.success && refreshed.data) {
          setComplaints(refreshed.data);
        }
      } catch (error) {
        alert("Error deleting complaint. Please try again.");
        console.error("Error deleting complaint:", error);
      }
    }
  }

  const filteredComplaints = complaints
    .filter((complaint) => {
      // Admin: Hide resolved complaints unless specifically filtering for them
      if (isAdmin() && complaint.status === "resolved" && filter !== "resolved") {
        return false
      }
      
      const matchesStatus = filter === "all" || complaint.status === filter
      const matchesCategory = categoryFilter === "all" || complaint.category === categoryFilter
      const matchesSearch = 
        complaint.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        complaint.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        complaint.block.toLowerCase().includes(searchTerm.toLowerCase()) ||
        complaint.roomNumber.toLowerCase().includes(searchTerm.toLowerCase())
      return matchesStatus && matchesCategory && matchesSearch
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "date":
          return new Date(b.createdAt) - new Date(a.createdAt)
        case "priority":
          const priorityOrder = { urgent: 4, high: 3, medium: 2, low: 1 }
          return priorityOrder[b.priority] - priorityOrder[a.priority]
        case "status":
          return a.status.localeCompare(b.status)
        case "category":
          return a.category.localeCompare(b.category)
        case "room":
          return a.block.localeCompare(b.block) || a.roomNumber.localeCompare(b.roomNumber)
        default:
          return 0
      }
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
      case "urgent":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
      case "high":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200"
      case "medium":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
      case "low":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
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
      <section className="background-pattern py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold text-primary mb-6">
              Hostel Complaints 🏠
            </h1>
            <p className="text-xl md:text-2xl text-secondary max-w-2xl mx-auto">
              Report and track hostel maintenance issues
            </p>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Action Bar */}
        <div className="card mb-8">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <h2 className="text-2xl font-bold text-primary">Complaint Management</h2>
            {!isAdmin() && (
              <button
                onClick={() => setShowForm(!showForm)}
                className="btn btn-primary"
              >
                {showForm ? "Cancel" : "Submit New Complaint"}
              </button>
            )}
          </div>
        </div>

        {/* Complaint Form */}
        {showForm && !isAdmin() && (
          <div className="card mb-8">
            <h3 className="text-xl font-bold text-primary mb-6">Submit New Complaint</h3>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Complaint Title"
                  className="input"
                  value={newComplaint.title}
                  onChange={(e) => setNewComplaint({...newComplaint, title: e.target.value})}
                  required
                />
                <select
                  className="input"
                  value={newComplaint.category}
                  onChange={(e) => setNewComplaint({...newComplaint, category: e.target.value})}
                >
                  {categories.filter(cat => cat !== "all").map(category => (
                    <option key={category} value={category}>
                      {getCategoryIcon(category)} {category.charAt(0).toUpperCase() + category.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <input
                  type="text"
                  placeholder="Block (e.g., Block A)"
                  className="input"
                  value={newComplaint.block}
                  onChange={(e) => setNewComplaint({...newComplaint, block: e.target.value})}
                  required
                />
                <input
                  type="text"
                  placeholder="Room Number"
                  className="input"
                  value={newComplaint.roomNumber}
                  onChange={(e) => setNewComplaint({...newComplaint, roomNumber: e.target.value})}
                  required
                />
                <select
                  className="input"
                  value={newComplaint.priority}
                  onChange={(e) => setNewComplaint({...newComplaint, priority: e.target.value})}
                >
                  {priorities.map(priority => (
                    <option key={priority} value={priority}>
                      {priority.charAt(0).toUpperCase() + priority.slice(1)} Priority
                    </option>
                  ))}
                </select>
              </div>
              
              <textarea
                placeholder="Describe the issue in detail..."
                className="input min-h-[120px]"
                value={newComplaint.description}
                onChange={(e) => setNewComplaint({...newComplaint, description: e.target.value})}
                required
              />
              
              <button type="submit" className="btn btn-primary">
                Submit Complaint
              </button>
            </form>
          </div>
        )}

        {/* Filters */}
        <div className="card mb-8">
          <div className="space-y-4">
            {/* Search and Sort */}
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="Search complaints by title, description, block, or room..."
                  className="input w-full"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="w-full lg:w-48">
                <select
                  className="input w-full"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="date">Sort by Date</option>
                  <option value="priority">Sort by Priority</option>
                  <option value="status">Sort by Status</option>
                  <option value="category">Sort by Category</option>
                  <option value="room">Sort by Room</option>
                </select>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-2">
              <span className="text-sm font-medium text-secondary">Filter by Status:</span>
              {statuses.map((status) => (
                <button
                  key={status}
                  onClick={() => setFilter(status)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    filter === status 
                      ? "bg-purple-600 text-white shadow-md" 
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-300"
                  }`}
                >
                  {status === "all" ? "All Status" : status.charAt(0).toUpperCase() + status.slice(1)}
                </button>
              ))}
            </div>
            <div className="flex flex-wrap gap-2">
              <span className="text-sm font-medium text-secondary">Filter by Category:</span>
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setCategoryFilter(category)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    categoryFilter === category 
                      ? "bg-blue-600 text-white shadow-md" 
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-300"
                  }`}
                >
                  {category === "all" ? "All Categories" : getCategoryIcon(category) + " " + category.charAt(0).toUpperCase() + category.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Complaints Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {filteredComplaints.map((complaint) => (
            <div key={complaint.id} className={`card ${
              !isAdmin() && complaint.status === "resolved" 
                ? "bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800" 
                : ""
            }`}>
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <span className="text-xl">{getCategoryIcon(complaint.category)}</span>
                  <div>
                    <h3 className="text-lg font-bold text-primary">{complaint.title}</h3>
                    <p className="text-sm text-secondary">
                      {complaint.block} - Room {complaint.roomNumber}
                    </p>
                  </div>
                </div>
                <div className="flex flex-col items-end space-y-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(complaint.status)}`}>
                    {complaint.status.toUpperCase()}
                  </span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(complaint.priority)}`}>
                    {complaint.priority} priority
                  </span>
                </div>
              </div>

              {/* Description */}
              <p className="text-secondary mb-4">{complaint.description}</p>
              
              {/* Resolved Message for Students */}
              {!isAdmin() && complaint.status === "resolved" && (
                <div className="bg-green-100 border border-green-300 rounded-lg p-3 mb-4">
                  <div className="flex items-center space-x-2">
                    <span className="text-green-600 text-lg">✅</span>
                    <p className="text-green-800 font-medium text-sm">
                      Great news! Your complaint has been resolved by the administration.
                    </p>
                  </div>
                </div>
              )}

              {/* Footer */}
              <div className="border-t border-opacity-20 pt-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-primary">Reported by: {complaint.reportedBy}</p>
                    <p className="text-xs text-secondary">Submitted: {complaint.date}</p>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    {isAdmin() && (
                      <>
                        <select
                          value={complaint.status}
                          onChange={(e) => handleStatusUpdate(complaint.id, e.target.value)}
                          className="text-xs border border-gray-300 rounded px-2 py-1"
                        >
                          <option value="pending">Pending</option>
                          <option value="in-progress">In Progress</option>
                          <option value="resolved">Resolved</option>
                        </select>
                        <button
                          onClick={() => handleDeleteComplaint(complaint.id)}
                          className="text-red-500 hover:text-red-700 text-sm"
                        >
                          Delete
                        </button>
                      </>
                    )}
                    {(user?.id === complaint.reportedById && complaint.status === "pending") && (
                      <button
                        onClick={() => {
                          if (!complaint.id) {
                            console.error('Delete attempted with missing id:', complaint);
                          }
                          handleDeleteComplaint(complaint.id);
                        }}
                        className="text-red-500 hover:text-red-700 text-sm"
                      >
                        Cancel
                      </button>
                    )}
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
              {filter !== "all" || categoryFilter !== "all"
                ? "Try adjusting your filter criteria."
                : "No complaints have been submitted yet."}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}