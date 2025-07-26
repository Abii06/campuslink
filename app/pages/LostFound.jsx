"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "../contexts/AuthContext"
import { useData } from "../contexts/DataContext"

export default function LostFound() {
  const { user } = useAuth()
  const router = useRouter()

  // Debug user authentication
  useEffect(() => {
    console.log("🔍 LostFound - User state changed:", user);
    console.log("🔍 LostFound - Token in localStorage:", localStorage.getItem('token') ? 'EXISTS' : 'MISSING');
  }, [user]);

  // Redirect admin users to dashboard
  useEffect(() => {
    if (user && user.role === "admin") {
      router.push("/dashboard")
    }
  }, [user, router])
  const { lostFoundItems, addLostFoundItem, deleteLostFoundItem, updateLostFoundItem } = useData()
  const [activeTab, setActiveTab] = useState("search")
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [typeFilter, setTypeFilter] = useState("all")
  const [newItem, setNewItem] = useState({
    title: "",
    description: "",
    category: "",
    location: "",
    contactInfo: "",
    type: "lost", // lost or found
    image: "",
  })
  const [editItemId, setEditItemId] = useState(null);
  const [editItem, setEditItem] = useState(null);

  const categories = ["all", "electronics", "books", "clothing", "accessories", "documents", "keys", "bags", "other"]
  const types = ["all", "lost", "found"]

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!newItem.title || !newItem.description || !newItem.category || !newItem.location || !newItem.contactInfo) {
      alert("Please fill in all required fields")
      return
    }

    try {
      console.log("🔍 LostFound - Form submission started");
      console.log("🔍 LostFound - Current user:", user);
      console.log("🔍 LostFound - Form data:", newItem);
      console.log("🔍 LostFound - Auth token exists:", !!localStorage.getItem('token'));
      
      // Show loading state
      e.target.disabled = true;
      
      // Add item to database via API
      const success = await addLostFoundItem({
        ...newItem,
        reportedBy: user?.name || "Anonymous",
        reportedById: user?.id || "anonymous",
      })

      if (success) {
        alert("Item reported successfully!")
      } else {
        alert("Item saved locally. Please check your internet connection.")
      }

      // Reset form
      setNewItem({
        title: "",
        description: "",
        category: "",
        location: "",
        contactInfo: "",
        type: "lost",
        image: "",
      })
      setActiveTab("search")
    } catch (error) {
      console.error("Error submitting lost/found item:", error)
      alert("There was an error submitting your item. Please try again.")
    } finally {
      e.target.disabled = false;
    }
  }

  const handleEditItem = (item) => {
    setEditItemId(item.id);
    setEditItem({ ...item });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditItem((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const updates = {
        title: editItem.title,
        description: editItem.description,
        category: editItem.category,
        location: editItem.location,
        contactInfo: editItem.contactInfo,
        type: editItem.type,
        image: editItem.image,
      };
      const success = await updateLostFoundItem(editItemId, updates);
      if (success) {
        alert("Item updated successfully!");
        setEditItemId(null);
        setEditItem(null);
      } else {
        alert("Failed to update item. Please try again.");
      }
    } catch (error) {
      alert("There was an error updating the item. Please try again.");
      console.error("Error updating item:", error);
    }
  };

  const handleDeleteItem = async (id) => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      try {
        const success = await deleteLostFoundItem(id);
        if (success) {
          alert("Item deleted successfully!");
        } else {
          alert("Item removed from view. Database update may have failed.");
        }
      } catch (error) {
        console.error("Error deleting item:", error);
        alert("There was an error deleting the item. Please try again.");
      }
    }
  }

  const filteredItems = lostFoundItems.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = categoryFilter === "all" || item.category === categoryFilter
    const matchesType = typeFilter === "all" || item.type === typeFilter
    return matchesSearch && matchesCategory && matchesType
  })

  const getCategoryIcon = (category) => {
    const icons = {
      electronics: "📱",
      books: "📚",
      clothing: "👕",
      accessories: "🎒",
      documents: "📄",
      keys: "🔑",
      bags: "👜",
      other: "📦",
    }
    return icons[category] || "📦"
  }

  return (
    <div className="min-h-screen bg-primary">
      {/* Header */}
      <section className="background-pattern py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-primary mb-4">Lost & Found 🔍</h1>
            <p className="text-xl text-secondary">Help your fellow students find their lost belongings</p>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Tabs */}
        <div className="card mb-8">
          <div className="flex space-x-1 bg-secondary rounded-lg p-1">
            <button
              onClick={() => setActiveTab("search")}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
                activeTab === "search" ? "bg-primary text-primary shadow-sm" : "text-secondary hover:text-primary"
              }`}
            >
              🔍 Search Items
            </button>
            <button
              onClick={() => setActiveTab("report")}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
                activeTab === "report" ? "bg-primary text-primary shadow-sm" : "text-secondary hover:text-primary"
              }`}
            >
              📝 Report Item
            </button>
          </div>
        </div>

        {activeTab === "search" ? (
          <>
            {/* Search and Filters */}
            <div className="card mb-8">
              <div className="space-y-4">
                <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                  <div className="w-full md:w-96">
                    <input
                      type="text"
                      placeholder="Search lost and found items..."
                      className="input"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {types.map((type) => (
                      <button
                        key={type}
                        onClick={() => setTypeFilter(type)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                          typeFilter === type
                            ? "bg-green-600 text-white shadow-md"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-300"
                        }`}
                      >
                        {type === "all" ? "All Items" : type === "lost" ? "❌ Lost" : "✅ Found"}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
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
                      {category === "all" ? "All Categories" : getCategoryIcon(category)}{" "}
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Items Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredItems.map((item) => (
                <div key={item.id} className="card group hover:scale-105 transition-all duration-300">
                  {editItemId === item.id ? (
                    <form onSubmit={handleEditSubmit} className="space-y-3">
                      <div className="flex flex-col md:flex-row gap-2">
                        <input
                          name="title"
                          type="text"
                          className="input flex-1"
                          value={editItem.title}
                          onChange={handleEditChange}
                          required
                        />
                        <select
                          name="type"
                          className="input"
                          value={editItem.type}
                          onChange={handleEditChange}
                        >
                          <option value="lost">Lost</option>
                          <option value="found">Found</option>
                        </select>
                      </div>
                      <textarea
                        name="description"
                        className="input"
                        value={editItem.description}
                        onChange={handleEditChange}
                        required
                      />
                      <input
                        name="category"
                        type="text"
                        className="input"
                        value={editItem.category}
                        onChange={handleEditChange}
                        required
                      />
                      <input
                        name="location"
                        type="text"
                        className="input"
                        value={editItem.location}
                        onChange={handleEditChange}
                        required
                      />
                      <input
                        name="contactInfo"
                        type="text"
                        className="input"
                        value={editItem.contactInfo}
                        onChange={handleEditChange}
                        required
                      />
                      <input
                        name="image"
                        type="url"
                        className="input"
                        value={editItem.image}
                        onChange={handleEditChange}
                        placeholder="Image URL"
                      />
                      <div className="flex gap-2">
                        <button type="submit" className="btn btn-primary">Save</button>
                        <button type="button" className="btn btn-secondary" onClick={() => { setEditItemId(null); setEditItem(null); }}>Cancel</button>
                      </div>
                    </form>
                  ) : (
                    <>
                      {/* Status Badge */}
                      <div className="flex justify-between items-start mb-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            item.type === "lost"
                              ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                              : "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                          }`}
                        >
                          {item.type === "lost" ? "❌ LOST" : "✅ FOUND"}
                        </span>
                        <span className="text-xs text-secondary">{item.date}</span>
                      </div>

                      {/* Image */}
                      <div className="mb-4 rounded-lg overflow-hidden">
                        <img
                          src={item.image || "/placeholder.svg"}
                          alt={item.title}
                          className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>

                      {/* Content */}
                      <div className="space-y-3">
                        <div className="flex items-center space-x-2">
                          <span className="text-lg">{getCategoryIcon(item.category)}</span>
                          <h3 className="font-bold text-primary">{item.title}</h3>
                        </div>

                        <p className="text-secondary text-sm line-clamp-2">{item.description}</p>

                        <div className="space-y-2">
                          <div className="flex items-center space-x-2 text-sm">
                            <span>📍</span>
                            <span className="text-secondary">Location: {item.location}</span>
                          </div>
                          <div className="flex items-center space-x-2 text-sm">
                            <span>📧</span>
                            <span className="text-accent">{item.contactInfo}</span>
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <button 
                            onClick={() => window.open(`mailto:${item.contactInfo}?subject=Regarding ${item.title}&body=Hi, I saw your ${item.type} item posting on CampusLink...`)}
                            className="btn btn-primary flex-1"
                          >
                            Contact {item.type === "lost" ? "Owner" : "Finder"}
                          </button>
                          {(user?.id === item.reportedById || user?.role === "admin") && (
                            <>
                              <button
                                onClick={() => handleEditItem(item)}
                                className="btn btn-secondary text-blue-500 hover:text-blue-700"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => handleDeleteItem(item.id)}
                                className="btn btn-secondary text-red-500 hover:text-red-700"
                              >
                                Delete
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>

            {/* Empty State */}
            {filteredItems.length === 0 && (
              <div className="text-center py-12">
                <div className="w-24 h-24 gradient-bg-2 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">🔍</span>
                </div>
                <h3 className="text-xl font-bold text-primary mb-2">No items found</h3>
                <p className="text-secondary">Try adjusting your search criteria or check back later.</p>
              </div>
            )}
          </>
        ) : (
          /* Report Form */
          <div className="max-w-2xl mx-auto">
            <div className="card">
              <h2 className="text-2xl font-bold text-primary mb-6">Report Lost or Found Item</h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Item Type */}
                <div>
                  <label className="block text-sm font-medium text-primary mb-3">Item Status</label>
                  <div className="flex space-x-4">
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="radio"
                        name="type"
                        value="lost"
                        checked={newItem.type === "lost"}
                        onChange={(e) => setNewItem({ ...newItem, type: e.target.value })}
                        className="text-accent"
                      />
                      <span className="text-secondary">❌ I lost this item</span>
                    </label>
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="radio"
                        name="type"
                        value="found"
                        checked={newItem.type === "found"}
                        onChange={(e) => setNewItem({ ...newItem, type: e.target.value })}
                        className="text-accent"
                      />
                      <span className="text-secondary">✅ I found this item</span>
                    </label>
                  </div>
                </div>

                {/* Title */}
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-primary mb-2">
                    Item Name *
                  </label>
                  <input
                    id="title"
                    type="text"
                    required
                    className="input"
                    placeholder="e.g., Blue Backpack, iPhone 13, etc."
                    value={newItem.title}
                    onChange={(e) => setNewItem({ ...newItem, title: e.target.value })}
                  />
                </div>

                {/* Category */}
                <div>
                  <label htmlFor="category" className="block text-sm font-medium text-primary mb-2">
                    Category *
                  </label>
                  <select
                    id="category"
                    required
                    className="input"
                    value={newItem.category}
                    onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
                  >
                    <option value="">Select a category</option>
                    {categories.slice(1).map((category) => (
                      <option key={category} value={category}>
                        {getCategoryIcon(category)} {category.charAt(0).toUpperCase() + category.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Description */}
                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-primary mb-2">
                    Description *
                  </label>
                  <textarea
                    id="description"
                    required
                    rows={4}
                    className="input resize-none"
                    placeholder="Provide detailed description including color, size, brand, distinctive features..."
                    value={newItem.description}
                    onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                  />
                </div>

                {/* Location */}
                <div>
                  <label htmlFor="location" className="block text-sm font-medium text-primary mb-2">
                    Location *
                  </label>
                  <input
                    id="location"
                    type="text"
                    required
                    className="input"
                    placeholder="Where was it lost/found? (e.g., Library, Cafeteria, Lecture Hall 101)"
                    value={newItem.location}
                    onChange={(e) => setNewItem({ ...newItem, location: e.target.value })}
                  />
                </div>

                {/* Contact Info */}
                <div>
                  <label htmlFor="contactInfo" className="block text-sm font-medium text-primary mb-2">
                    Contact Information *
                  </label>
                  <input
                    id="contactInfo"
                    type="email"
                    required
                    className="input"
                    placeholder="Your email address"
                    value={newItem.contactInfo}
                    onChange={(e) => setNewItem({ ...newItem, contactInfo: e.target.value })}
                  />
                </div>

                {/* Image URL */}
                <div>
                  <label htmlFor="image" className="block text-sm font-medium text-primary mb-2">
                    Image URL (Optional)
                  </label>
                  <input
                    id="image"
                    type="url"
                    className="input"
                    placeholder="https://example.com/image.jpg"
                    value={newItem.image}
                    onChange={(e) => setNewItem({ ...newItem, image: e.target.value })}
                  />
                  <p className="text-xs text-secondary mt-1">Provide a URL to an image of the item</p>
                </div>

                <button type="submit" className="btn btn-primary w-full">
                  {newItem.type === "lost" ? "Report Lost Item" : "Report Found Item"}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
