"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "../contexts/AuthContext"
import efficientTimetableService from "../../lib/services/efficientTimetableService"

export default function Timetable() {
  const { user } = useAuth()
  const router = useRouter()

  // Redirect admin users to dashboard
  useEffect(() => {
    if (user && user.role === "admin") {
      router.push("/dashboard")
    }
  }, [user, router])
  // Remove updateTimetable, getTimetable for students
  const [schedule, setSchedule] = useState({})
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingClass, setEditingClass] = useState(null)
  const [newClass, setNewClass] = useState({
    subject: "",
    instructor: "",
    room: "",
    startTime: "",
    endTime: "",
    day: "Monday",
    color: "#8b5cf6",
  })

  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
  const timeSlots = ["08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00"]

  const colors = [
    "#8b5cf6", "#ec4899", "#06b6d4", "#10b981", "#f59e0b",
    "#ef4444", "#6366f1", "#14b8a6", "#f97316", "#84cc16"
  ]

  useEffect(() => {
    const loadTimetable = async () => {
      if (user && user.role === "student") {
        try {
          // Fetch personal timetable for this student
          const schedule = await efficientTimetableService.getStudentTimetable();
          if (schedule) {
            setSchedule(schedule);
          } else {
            setSchedule({});
          }
        } catch (error) {
          console.error("Error loading timetable:", error);
          setSchedule({});
        }
      }
    };
    loadTimetable();
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!newClass.subject || !newClass.instructor || !newClass.room || !newClass.startTime || !newClass.endTime) {
      alert("Please fill in all required fields")
      return
    }

    try {
      console.log("🔍 Timetable - Form submission started");
      console.log("🔍 Timetable - Current user:", user);
      console.log("🔍 Timetable - New class data:", newClass);
      
      // Show loading state
      e.target.disabled = true;

      const classData = {
        ...newClass,
        id: editingClass ? editingClass.id : Date.now().toString(),
      }

      const updatedSchedule = { ...schedule };
      if (!updatedSchedule[newClass.day]) {
        updatedSchedule[newClass.day] = [];
      }
      if (editingClass) {
        // Update existing class
        updatedSchedule[newClass.day] = updatedSchedule[newClass.day].map(cls =>
          cls.id === editingClass.id ? classData : cls
        );
      } else {
        // Add new class
        updatedSchedule[newClass.day].push(classData);
      }

      // Ensure all days are present as arrays for backend validation
      const daysList = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
      const scheduleForBackend = {};
      daysList.forEach(day => {
        scheduleForBackend[day] = Array.isArray(updatedSchedule[day]) ? updatedSchedule[day] : [];
      });

      setSchedule(scheduleForBackend);
      const response = await efficientTimetableService.updateStudentTimetable(scheduleForBackend);
      if (response.success) {
        alert("Class saved successfully!")
      } else {
        alert("Class saved locally. Please check your internet connection.")
      }

      // Reset form
      setNewClass({
        subject: "",
        instructor: "",
        room: "",
        startTime: "",
        endTime: "",
        day: "Monday",
        color: "#8b5cf6",
      })
      setShowAddForm(false)
      setEditingClass(null)
    } catch (error) {
      console.error("Error submitting class:", error);
      alert("Error saving class. Please try again.");
    } finally {
      // Re-enable button
      e.target.disabled = false;
    }
  }

  const handleEdit = (classItem, day) => {
    setNewClass({
      subject: classItem.subject,
      instructor: classItem.instructor,
      room: classItem.room,
      startTime: classItem.startTime,
      endTime: classItem.endTime,
      day: day,
      color: classItem.color,
    })
    setEditingClass(classItem)
    setShowAddForm(true)
  }

  const handleDelete = async (classId, day) => {
    if (window.confirm("Are you sure you want to delete this class?")) {
      try {
        console.log("🔍 Timetable - Deleting class:", classId, "from", day);
        const updatedSchedule = { ...schedule };
        updatedSchedule[day] = updatedSchedule[day].filter(cls => cls.id !== classId);
        // Ensure all days are present as arrays for backend validation
        const daysList = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        const scheduleForBackend = {};
        daysList.forEach(dayName => {
          scheduleForBackend[dayName] = Array.isArray(updatedSchedule[dayName]) ? updatedSchedule[dayName] : [];
        });
        setSchedule(scheduleForBackend);
        const response = await efficientTimetableService.updateStudentTimetable(scheduleForBackend);
        if (response.success) {
          alert("Class deleted successfully!");
        } else {
          alert("Class deleted locally. Please check your internet connection.");
        }
      } catch (error) {
        console.error("Error deleting class:", error);
        alert("Error deleting class. Please try again.");
      }
    }
  }

  const getTimePosition = (time) => {
    const [hours, minutes] = time.split(':').map(Number)
    const startHour = 8 // 8 AM
    const position = ((hours - startHour) * 60 + minutes) / 60
    return Math.max(0, position * 60) // 60px per hour
  }

  const getClassDuration = (startTime, endTime) => {
    const start = getTimePosition(startTime)
    const end = getTimePosition(endTime)
    return Math.max(60, end - start) // Minimum 60px height
  }

  return (
    <div className="min-h-screen bg-primary">
      {/* Header */}
      <section className="background-pattern py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold text-primary mb-6">
              My Timetable 📅
            </h1>
            <p className="text-xl md:text-2xl text-secondary max-w-2xl mx-auto">
              Manage your weekly class schedule
            </p>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Action Bar */}
        <div className="card mb-8">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <h2 className="text-2xl font-bold text-primary">Weekly Schedule</h2>
            <button
              onClick={() => {
                setShowAddForm(!showAddForm)
                setEditingClass(null)
                setNewClass({
                  subject: "",
                  instructor: "",
                  room: "",
                  startTime: "",
                  endTime: "",
                  day: "Monday",
                  color: "#8b5cf6",
                })
              }}
              className="btn btn-primary"
            >
              {showAddForm ? "Cancel" : "Add Class"}
            </button>
          </div>
        </div>

        {/* Add/Edit Form */}
        {showAddForm && (
          <div className="card mb-8">
            <h3 className="text-xl font-bold text-primary mb-6">
              {editingClass ? "Edit Class" : "Add New Class"}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Subject Name"
                  className="input"
                  value={newClass.subject}
                  onChange={(e) => setNewClass({...newClass, subject: e.target.value})}
                  required
                />
                <input
                  type="text"
                  placeholder="Instructor Name"
                  className="input"
                  value={newClass.instructor}
                  onChange={(e) => setNewClass({...newClass, instructor: e.target.value})}
                  required
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <input
                  type="text"
                  placeholder="Room/Location"
                  className="input"
                  value={newClass.room}
                  onChange={(e) => setNewClass({...newClass, room: e.target.value})}
                  required
                />
                <select
                  className="input"
                  value={newClass.day}
                  onChange={(e) => setNewClass({...newClass, day: e.target.value})}
                >
                  {days.map(day => (
                    <option key={day} value={day}>{day}</option>
                  ))}
                </select>
                <input
                  type="time"
                  placeholder="Start Time"
                  className="input"
                  value={newClass.startTime}
                  onChange={(e) => setNewClass({...newClass, startTime: e.target.value})}
                  required
                />
                <input
                  type="time"
                  placeholder="End Time"
                  className="input"
                  value={newClass.endTime}
                  onChange={(e) => setNewClass({...newClass, endTime: e.target.value})}
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-primary mb-2">Color</label>
                <div className="flex flex-wrap gap-2">
                  {colors.map(color => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setNewClass({...newClass, color})}
                      className={`w-8 h-8 rounded-full border-2 ${
                        newClass.color === color ? 'border-gray-800' : 'border-gray-300'
                      }`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>
              
              <button type="submit" className="btn btn-primary">
                {editingClass ? "Update Class" : "Add Class"}
              </button>
            </form>
          </div>
        )}

        {/* Timetable Grid */}
        <div className="card">
          <div className="overflow-x-auto">
            <div className="min-w-[800px]">
              {/* Header */}
              <div className="grid grid-cols-7 gap-2 mb-4">
                <div className="text-center font-semibold text-primary py-2">Time</div>
                {days.map(day => (
                  <div key={day} className="text-center font-semibold text-primary py-2 bg-secondary rounded-lg">
                    {day}
                  </div>
                ))}
              </div>

              {/* Time Grid */}
              <div className="grid grid-cols-7 gap-2" style={{ minHeight: '600px' }}>
                {/* Time Column */}
                <div className="space-y-2">
                  {timeSlots.map(time => (
                    <div key={time} className="h-12 flex items-center justify-center text-sm text-secondary border-b border-gray-200">
                      {time}
                    </div>
                  ))}
                </div>

                {/* Day Columns */}
                {days.map(day => (
                  <div key={day} className="relative bg-secondary rounded-lg p-2" style={{ minHeight: '600px' }}>
                    {schedule[day]?.map(classItem => (
                      <div
                        key={classItem.id}
                        className="absolute left-2 right-2 rounded-lg p-2 text-white text-xs cursor-pointer hover:opacity-90 transition-opacity"
                        style={{
                          backgroundColor: classItem.color,
                          top: `${getTimePosition(classItem.startTime) + 8}px`,
                          height: `${getClassDuration(classItem.startTime, classItem.endTime)}px`,
                        }}
                        onClick={() => handleEdit(classItem, day)}
                      >
                        <div className="font-semibold truncate">{classItem.subject}</div>
                        <div className="truncate">{classItem.instructor}</div>
                        <div className="truncate">{classItem.room}</div>
                        <div className="text-xs opacity-90">
                          {classItem.startTime} - {classItem.endTime}
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            handleDelete(classItem.id, day)
                          }}
                          className="absolute top-1 right-1 text-white hover:text-red-200 text-xs"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}