"use client"

import { useState, useEffect } from "react"
import { useAuth } from "../contexts/AuthContext"
import { useData } from "../contexts/DataContext"

export default function Announcements() {
  const { user, isAdmin } = useAuth()
  const { announcements, addAnnouncement, deleteAnnouncement } = useData()
  const [filter, setFilter] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState("date")
  const [showAddForm, setShowAddForm] = useState(false)
  const [newAnnouncement, setNewAnnouncement] = useState({
    title: "",
    content: "",
    category: "general",
    priority: "medium",
    image: "",
  })
  const [addError, setAddError] = useState("");

  const categories = ["all", "academic", "event", "general", "urgent", "sports", "cultural"]

  const handleAddAnnouncement = async (e) => {
    e.preventDefault();
    setAddError("");
    if (!newAnnouncement.title || !newAnnouncement.content) return;

    const result = await addAnnouncement({
      ...newAnnouncement,
      author: user?.name || "Admin",
      authorId: user?.id || "admin",
    });

    if (result === true) {
      setNewAnnouncement({
        title: "",
        content: "",
        category: "general",
        priority: "medium",
        image: "",
      });
      setShowAddForm(false);
    } else if (typeof result === 'string') {
      setAddError(result);
    } else {
      setAddError("Failed to add announcement. Please check all fields and try again. (See console for details)");
    }
  }

  const handleDeleteAnnouncement = (id) => {
    if (window.confirm("Are you sure you want to delete this announcement?")) {
      deleteAnnouncement(id)
    }
  }

  const filteredAnnouncements = announcements
    .filter((announcement) => {
      const matchesCategory = filter === "all" || announcement.category === filter
      const matchesSearch =
        announcement.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        announcement.content.toLowerCase().includes(searchTerm.toLowerCase())
      return matchesCategory && matchesSearch
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "date":
          return new Date(b.date) - new Date(a.date)
        case "priority":
          const priorityOrder = { high: 3, medium: 2, low: 1 }
          return priorityOrder[b.priority] - priorityOrder[a.priority]
        case "title":
          return a.title.localeCompare(b.title)
        case "category":
          return a.category.localeCompare(b.category)
        default:
          return 0
      }
    })

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
      case "medium":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
      case "low":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
    }
  }

  const getCategoryColor = (category) => {
    const colors = {
      academics: "gradient-bg-1",
      events: "gradient-bg-2",
      holidays: "gradient-bg-3",
      hostel: "gradient-bg-4",
      general: "gradient-bg-5",
    }
    return colors[category] || "gradient-bg-1"
  }

  return (
    <div className="min-h-screen bg-primary">
      {/* Header */}
      <section className="background-pattern py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-primary mb-4">Campus Announcements 📢</h1>
            <p className="text-xl text-secondary">Stay updated with the latest campus news and important notices</p>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Admin Controls */}
        {isAdmin() && (
          <div className="card mb-8">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-primary">Admin Controls</h2>
              <button
                onClick={() => setShowAddForm(!showAddForm)}
                className="btn btn-primary"
              >
                {showAddForm ? "Cancel" : "Add Announcement"}
              </button>
            </div>
            
            {showAddForm && (
              <form onSubmit={handleAddAnnouncement} className="mt-6 space-y-4">
                {addError && (
                  <div className="text-red-600 font-semibold mb-2">{addError}</div>
                )}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Announcement Title"
                    className="input"
                    value={newAnnouncement.title}
                    onChange={(e) => setNewAnnouncement({...newAnnouncement, title: e.target.value})}
                    required
                  />
                  <select
                    className="input"
                    value={newAnnouncement.category}
                    onChange={(e) => setNewAnnouncement({...newAnnouncement, category: e.target.value.toLowerCase()})}
                  >
                    {categories.filter(cat => cat !== "all").map(category => (
                      <option key={category} value={category}>
                        {category.charAt(0).toUpperCase() + category.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <select
                    className="input"
                    value={newAnnouncement.priority}
                    onChange={(e) => setNewAnnouncement({...newAnnouncement, priority: e.target.value})}
                  >
                    <option value="low">Low Priority</option>
                    <option value="medium">Medium Priority</option>
                    <option value="high">High Priority</option>
                  </select>
                  <input
                    type="url"
                    placeholder="Image URL (optional)"
                    className="input"
                    value={newAnnouncement.image}
                    onChange={(e) => setNewAnnouncement({...newAnnouncement, image: e.target.value})}
                  />
                </div>
                <textarea
                  placeholder="Announcement Content"
                  className="input min-h-[120px]"
                  value={newAnnouncement.content}
                  onChange={(e) => setNewAnnouncement({...newAnnouncement, content: e.target.value})}
                  required
                />
                <button type="submit" className="btn btn-primary">
                  Publish Announcement
                </button>
              </form>
            )}
          </div>
        )}

        {/* Filters */}
        <div className="card mb-8">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <div className="w-full lg:w-96">
              <input
                type="text"
                placeholder="Search announcements..."
                className="input"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Sort Dropdown */}
            <div className="w-full lg:w-48">
              <select
                className="input"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="date">Sort by Date</option>
                <option value="priority">Sort by Priority</option>
                <option value="title">Sort by Title</option>
                <option value="category">Sort by Category</option>
              </select>
            </div>

            {/* Category Filter */}
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setFilter(category)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    filter === category 
                      ? "bg-purple-600 text-white shadow-md" 
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-300"
                  }`}
                >
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Announcements Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {filteredAnnouncements.map((announcement) => (
            <div key={announcement.id} className="card group hover:scale-[1.02] transition-all duration-300">
              {/* Image */}
              <div className="mb-4 rounded-lg overflow-hidden">
                <img
                  src={announcement.image || "/placeholder.svg"}
                  alt={announcement.title}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>

              {/* Content */}
              <div className="space-y-4">
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-2">
                    <div className={`w-3 h-3 rounded-full ${getCategoryColor(announcement.category)}`}></div>
                    <span className="text-sm font-medium text-secondary capitalize">{announcement.category}</span>
                  </div>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(announcement.priority)}`}
                  >
                    {announcement.priority} priority
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-xl font-bold text-primary group-hover:text-accent transition-colors">
                  {announcement.title}
                </h3>

                {/* Content */}
                <p className="text-secondary line-clamp-3">{announcement.content}</p>

                {/* Footer */}
                <div className="flex items-center justify-between pt-4 border-t border-opacity-20">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 gradient-bg-5 rounded-full flex items-center justify-center">
                      <span className="text-xs font-bold text-white">{announcement.author.charAt(0)}</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-primary">{announcement.author}</p>
                      <p className="text-xs text-secondary">{announcement.date}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button className="text-accent hover:underline text-sm font-medium">Read More</button>
                    {isAdmin() && (
                      <button
                        onClick={() => handleDeleteAnnouncement(announcement.id)}
                        className="text-red-500 hover:text-red-700 text-sm font-medium ml-2"
                      >
                        Delete
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredAnnouncements.length === 0 && (
          <div className="text-center py-12">
            <div className="w-24 h-24 gradient-bg-1 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">📢</span>
            </div>
            <h3 className="text-xl font-bold text-primary mb-2">No announcements found</h3>
            <p className="text-secondary">
              {searchTerm || filter !== "all"
                ? "Try adjusting your search or filter criteria."
                : "Check back later for new announcements."}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
