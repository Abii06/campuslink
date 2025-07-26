"use client"

import { createContext, useContext, useState, useEffect } from "react"
import lostFoundService from "../../lib/services/lostFoundService"
import personalTimetableService from "../../lib/services/personalTimetableService"
import announcementService from "../../lib/services/announcementService"

const DataContext = createContext()

export const useData = () => {
  const context = useContext(DataContext)
  if (!context) {
    throw new Error("useData must be used within a DataProvider")
  }
  return context
}

export const DataProvider = ({ children }) => {
  // Announcements State
  const [announcements, setAnnouncements] = useState([])
  
  // Lost & Found State
  const [lostFoundItems, setLostFoundItems] = useState([])
  
  // Timetable State
  const [timetables, setTimetables] = useState({})
  
  // Complaints State
  const [complaints, setComplaints] = useState([])

  // Fetch real data from API
  useEffect(() => {
    // Fetch lost and found items from API
    const fetchLostFoundItems = async () => {
      try {
        const response = await lostFoundService.getLostFoundItems();
        if (response.success && response.data) {
          // Map API data to match our frontend structure
          const items = response.data.map(item => ({
            id: item._id,
            title: item.title,
            description: item.description,
            type: item.type,
            category: item.category,
            location: item.location,
            contactInfo: item.contactInfo?.email || '',
            reportedBy: item.submittedBy?.name || 'Anonymous',
            reportedById: item.submittedBy?._id || 'anonymous',
            date: new Date(item.createdAt).toISOString().split('T')[0],
            status: item.status,
            image: item.images?.[0]?.url || "/placeholder.svg",
            createdAt: item.createdAt,
          }));
          setLostFoundItems(items);
        }
      } catch (error) {
        console.error("Error fetching lost and found items:", error);
        // Fall back to mock data if API fails
        loadMockData();
      }
    };

    // Fetch timetable for logged-in user on mount
    const fetchTimetableForUser = async () => {
      try {
        const token = localStorage.getItem('token');
        const userId = localStorage.getItem('userId');
        if (token && userId) {
          const response = await personalTimetableService.getPersonalTimetable();
          if (response.success && response.data) {
            setTimetables(prev => ({
              ...prev,
              [userId]: response.data
            }));
          }
        }
      } catch (error) {
        console.error("Error fetching timetable on mount:", error);
      }
    };

    fetchLostFoundItems();
    fetchTimetableForUser();
    // For now, still use mock data for other sections
    loadMockData();
  }, []);

  // Load mock data as fallback
  const loadMockData = () => {
    // Mock Announcements
    const mockAnnouncements = [
      {
        id: 1,
        title: "Semester Examination Schedule Released",
        content: "The final examination schedule for Fall 2024 has been published. Please check your respective department portals for detailed timing.",
        category: "academics",
        author: "Academic Office",
        authorId: "admin1",
        date: "2024-01-15",
        priority: "high",
        image: "/placeholder.svg?height=200&width=400&text=Exam+Schedule",
        createdAt: new Date("2024-01-15").toISOString(),
      },
      {
        id: 2,
        title: "Annual Tech Fest 2024",
        content: "Join us for the biggest tech event of the year! Register now for various competitions, workshops, and keynote sessions.",
        category: "events",
        author: "Student Council",
        authorId: "admin2",
        date: "2024-01-14",
        priority: "medium",
        image: "/placeholder.svg?height=200&width=400&text=Tech+Fest",
        createdAt: new Date("2024-01-14").toISOString(),
      },
      {
        id: 3,
        title: "Winter Break Holiday Notice",
        content: "The college will remain closed from December 20th to January 5th for winter break. Classes will resume on January 6th.",
        category: "holidays",
        author: "Administration",
        authorId: "admin1",
        date: "2024-01-13",
        priority: "low",
        image: "/placeholder.svg?height=200&width=400&text=Winter+Break",
        createdAt: new Date("2024-01-13").toISOString(),
      },
    ]

    // Mock Complaints
    const mockComplaints = [
      {
        id: 1,
        title: "Water Supply Issue",
        description: "No water supply in Room 201, Block A since yesterday morning.",
        category: "water",
        priority: "high",
        status: "pending",
        reportedBy: "Alice Johnson",
        reportedById: "student3",
        roomNumber: "201",
        block: "A",
        date: "2024-01-15",
        createdAt: new Date("2024-01-15").toISOString(),
        updatedAt: new Date("2024-01-15").toISOString(),
      },
      {
        id: 2,
        title: "Electricity Problem",
        description: "Frequent power cuts in Block B. Need immediate attention.",
        category: "electricity",
        priority: "medium",
        status: "in-progress",
        reportedBy: "Bob Wilson",
        reportedById: "student4",
        roomNumber: "305",
        block: "B",
        date: "2024-01-14",
        createdAt: new Date("2024-01-14").toISOString(),
        updatedAt: new Date("2024-01-14").toISOString(),
      },
    ]

    setAnnouncements(mockAnnouncements)
    setComplaints(mockComplaints)
  }

  // Announcement Functions

  // Add announcement (admin only, persists to backend)
  // MOCK: Always add announcement locally for demo, never error
  const addAnnouncement = async (announcement) => {
    const newAnnouncement = {
      ...announcement,
      id: Date.now(),
      date: new Date().toISOString().split('T')[0],
    };
    setAnnouncements(prev => [newAnnouncement, ...prev]);
    return true;
  }

  const updateAnnouncement = (id, updates) => {
    setAnnouncements(prev => 
      prev.map(announcement => 
        announcement.id === id ? { ...announcement, ...updates } : announcement
      )
    )
  }

  // MOCK: Always delete announcement locally for demo, never error
  const deleteAnnouncement = async (id) => {
    setAnnouncements(prev => prev.filter(announcement => announcement.id !== id));
    return true;
  }

  // Lost & Found Functions
  const addLostFoundItem = async (item) => {
    try {
      console.log("🔍 DataContext - Starting addLostFoundItem");
      console.log("🔍 DataContext - User from localStorage:", localStorage.getItem('token') ? 'Token exists' : 'No token');
      
      // Prepare data for API - only include fields that the backend expects
      const itemData = {
        title: item.title,
        description: item.description,
        type: item.type,
        category: item.category,
        itemName: item.title,
        location: item.location,
        dateTime: new Date().toISOString(),
        // Handle image field - convert single image URL to images array format
        ...(item.image && item.image.trim() !== '' ? {
          images: [{ url: item.image, filename: '' }]
        } : {})
        // Note: reportedBy and reportedById are frontend-only fields, not sent to API
        // The backend will set submittedBy from the authenticated user
      };

      // Only add contactInfo if we have valid contact information
      const email = typeof item.contactInfo === 'string' ? item.contactInfo : item.contactInfo?.email || '';
      const phone = typeof item.contactInfo === 'object' ? item.contactInfo?.phone : '';
      
      if (email.trim() !== '' || phone.trim() !== '') {
        itemData.contactInfo = {};
        if (email.trim() !== '') itemData.contactInfo.email = email.trim();
        if (phone.trim() !== '') itemData.contactInfo.phone = phone.trim();
      }

      console.log("🔍 DataContext - Sending to API:", JSON.stringify(itemData, null, 2));
      console.log("🔍 DataContext - Original item:", JSON.stringify(item, null, 2));
      
      // Call API to create item
      const response = await lostFoundService.createLostFoundItem(itemData);
      console.log("API Response:", response);
      console.log("Response success:", response?.success);
      console.log("Response data:", response?.data);
      
      if (response.success && response.data) {
        // Add to local state with API data
        const newItem = {
          id: response.data._id,
          title: response.data.title,
          description: response.data.description,
          type: response.data.type,
          category: response.data.category,
          location: response.data.location,
          contactInfo: response.data.contactInfo?.email || '',
          reportedBy: response.data.submittedBy?.name || 'Anonymous',
          reportedById: response.data.submittedBy?._id || 'anonymous',
          date: new Date(response.data.createdAt).toISOString().split('T')[0],
          status: response.data.status,
          image: response.data.images?.[0]?.url || "/placeholder.svg",
          createdAt: response.data.createdAt,
        };
        setLostFoundItems(prev => [newItem, ...prev]);
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error adding lost found item:", error);
      console.error("Error details:", error.message);
      console.error("Error response:", error.response?.data);
      console.error("Error status:", error.response?.status);
      
      // Show specific validation errors if available
      if (error.response?.data?.errors) {
        console.error("❌ Validation errors:", error.response.data.errors);
        error.response.data.errors.forEach((err, index) => {
          console.error(`❌ Error ${index + 1}:`, err);
        });
      }
      
      console.error("Full error object:", JSON.stringify(error, Object.getOwnPropertyNames(error), 2));
      
      // Fallback to local state only if API fails
      const newItem = {
        ...item,
        id: Date.now(),
        createdAt: new Date().toISOString(),
        date: new Date().toISOString().split('T')[0],
        status: "active",
      };
      setLostFoundItems(prev => [newItem, ...prev]);
      return false;
    }
  }

  const updateLostFoundItem = async (id, updates) => {
    try {
      // Call API to update item
      const response = await lostFoundService.updateLostFoundItem(id, updates);
      
      if (response.success && response.data) {
        // Update local state
        setLostFoundItems(prev => 
          prev.map(item => 
            item.id === id ? { 
              ...item, 
              ...updates,
              title: response.data.title,
              description: response.data.description,
              location: response.data.location,
              contactInfo: response.data.contactInfo?.email || '',
              status: response.data.status
            } : item
          )
        );
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error updating lost found item:", error);
      // Fallback to local update if API fails
      setLostFoundItems(prev => 
        prev.map(item => 
          item.id === id ? { ...item, ...updates } : item
        )
      );
      return false;
    }
  }

  const deleteLostFoundItem = async (id) => {
    try {
      // Call API to delete item
      const response = await lostFoundService.deleteLostFoundItem(id);
      
      if (response.success) {
        // Remove from local state
        setLostFoundItems(prev => prev.filter(item => item.id !== id));
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error deleting lost found item:", error);
      // Fallback to local delete if API fails
      setLostFoundItems(prev => prev.filter(item => item.id !== id));
      return false;
    }
  }

  // Timetable Functions
  const updateTimetable = async (userId, timetableData) => {
    try {
      // Always get userId from localStorage if not provided
      const effectiveUserId = userId || localStorage.getItem('userId');
      console.log("🔍 DataContext - Starting updateTimetable");
      console.log("🔍 DataContext - User ID:", effectiveUserId);
      console.log("🔍 DataContext - Auth token exists:", !!localStorage.getItem('token'));
      console.log("🔍 DataContext - Timetable data:", JSON.stringify(timetableData, null, 2));
      
      // Only send the schedule object as required by backend
      const response = await personalTimetableService.updatePersonalTimetable({ schedule: timetableData });
      console.log("🔍 DataContext - API Response:", response);
      
      if (response.success && response.data) {
        // Update local state with API data
        console.log("🔍 DataContext - API success, updating local state");
        setTimetables(prev => ({
          ...prev,
          [effectiveUserId]: response.data
        }));
        return true;
      }
      console.log("🔍 DataContext - API response not successful");
      return false;
    } catch (error) {
      console.error("❌ DataContext - Error updating timetable:", error);
      console.error("❌ DataContext - Error details:", error.message);
      console.error("❌ DataContext - Error response:", error.response?.data);
      console.error("❌ DataContext - Error status:", error.response?.status);
      
      // Show specific validation errors if available
      if (error.response?.data?.errors) {
        console.error("❌ Validation errors:", error.response.data.errors);
        error.response.data.errors.forEach((err, index) => {
          console.error(`❌ Error ${index + 1}:`, err);
        });
      }

      // Fallback to local state only if API fails
      console.log("🔍 DataContext - Falling back to local state");
      setTimetables(prev => ({
        ...prev,
        [userId || localStorage.getItem('userId')]: timetableData
      }));
      return false;
    }
  }

  const getTimetable = async (userId) => {
    try {
      // Always get userId from localStorage if not provided
      const effectiveUserId = userId || localStorage.getItem('userId');
      console.log("🔍 DataContext - Starting getTimetable");
      console.log("🔍 DataContext - User ID:", effectiveUserId);
      console.log("🔍 DataContext - Auth token exists:", !!localStorage.getItem('token'));

      // Always fetch from API to ensure latest data
      const response = await personalTimetableService.getPersonalTimetable();
      console.log("🔍 DataContext - API Response:", response);

      if (response.success && response.data) {
        // Update local state with API data
        console.log("🔍 DataContext - Updating local state with API data");
        setTimetables(prev => ({
          ...prev,
          [effectiveUserId]: response.data
        }));
        return response.data;
      }

      console.log("🔍 DataContext - API response not successful, returning empty object");
      return {};
    } catch (error) {
      console.error("❌ DataContext - Error getting timetable:", error);
      console.error("❌ DataContext - Error details:", error.message);
      console.error("❌ DataContext - Error response:", error.response?.data);
      console.error("❌ DataContext - Error status:", error.response?.status);

      // Return cached data or empty object if API fails
      return timetables[userId || localStorage.getItem('userId')] || {};
    }
  }

  // Complaint Functions
  const addComplaint = (complaint) => {
    const newComplaint = {
      ...complaint,
      id: Date.now(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      date: new Date().toISOString().split('T')[0],
      status: "pending",
    }

    setComplaints(prev => [newComplaint, ...prev])
  }

  const updateComplaint = (id, updates) => {
    setComplaints(prev => 
      prev.map(complaint => 
        complaint.id === id 
          ? { ...complaint, ...updates, updatedAt: new Date().toISOString() } 
          : complaint
      )
    )
  }

  const deleteComplaint = (id) => {
    setComplaints(prev => prev.filter(complaint => complaint.id !== id))
  }

  const value = {
    // Announcements
    announcements,
    addAnnouncement,
    updateAnnouncement,
    deleteAnnouncement,

    // Lost & Found
    lostFoundItems,
    addLostFoundItem,
    updateLostFoundItem,
    deleteLostFoundItem,

    // Timetable
    updateTimetable,
    getTimetable,

    // Complaints
    complaints,
    addComplaint,
    updateComplaint,
    deleteComplaint,
  }

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>
}