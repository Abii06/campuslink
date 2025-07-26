import { useData } from "../contexts/DataContext";
import { useState } from "react";

export default function AdminLostFoundManager() {
  const { lostFoundItems, updateLostFoundItem, deleteLostFoundItem } = useData();
  const [editItemId, setEditItemId] = useState(null);
  const [editItem, setEditItem] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const categories = ["all", "electronics", "books", "clothing", "accessories", "documents", "keys", "bags", "other"];
  const types = ["all", "lost", "found"];

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
  };
  const filteredItems = lostFoundItems.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === "all" || item.category === categoryFilter;
    const matchesType = typeFilter === "all" || item.type === typeFilter;
    return matchesSearch && matchesCategory && matchesType;
  });
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
    };
    return icons[category] || "📦";
  };
  return (
    <div>
      <div className="mb-4 flex flex-col gap-2">
        <input
          type="text"
          placeholder="Search lost and found items..."
          className="input w-full"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <div className="flex flex-row flex-wrap gap-2">
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
        <div className="flex flex-row flex-wrap gap-2">
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
              {category === "all" ? "All Categories" : getCategoryIcon(category)} {category.charAt(0).toUpperCase() + category.slice(1)}
            </button>
          ))}
        </div>
      </div>
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
                <div className="mb-4 rounded-lg overflow-hidden">
                  <img
                    src={item.image || "/placeholder.svg"}
                    alt={item.title}
                    className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
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
                  </div>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
      {filteredItems.length === 0 && (
        <div className="text-center py-12">
          <div className="w-24 h-24 gradient-bg-2 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">🔍</span>
          </div>
          <h3 className="text-xl font-bold text-primary mb-2">No items found</h3>
          <p className="text-secondary">Try adjusting your search criteria or check back later.</p>
        </div>
      )}
    </div>
  );
}
