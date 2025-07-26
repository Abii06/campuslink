"use client"

import { useState, useEffect } from "react"

export default function Timetable() {
  const [schedule, setSchedule] = useState({})
  const [showAddForm, setShowAddForm] = useState(false)
  const [newClass, setNewClass] = useState({
    subject: "",
    instructor: "",
    room: "",
    startTime: "",
    endTime: "",
    day: "",
    color: "#667eea",
  })

  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
  const timeSlots = ["08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00"]

  const colors = [
    "#667eea",
    "#f093fb",
    "#4facfe",
    "#43e97b",
    "#fa709a",
    "#ffeaa7",
    "#fd79a8",
    "#fdcb6e",
    "#6c5ce7",
    "#a29bfe",
  ]

  useEffect(() => {
    // Mock schedule data
    const mockSchedule = {
      Monday: [
        {
          id: 1,
          subject: "Data Structures",
          instructor: "Dr. Smith",
          room: "Room 101",
          startTime: "09:00",
          endTime: "10:30",
          color: "#667eea",
        },
        {
          id: 2,
          subject: "Mathematics",
          instructor: "Prof. Johnson",
          room: "Room 205",
          startTime: "11:00",
          endTime: "12:30",
          color: "#f093fb",
        },
      ],
      Tuesday: [
        {
          id: 3,
          subject: "Physics Lab",
          instructor: "Dr. Wilson",
          room: "Lab 1",
          startTime: "14:00",
          endTime: "16:00",
          color: "#4facfe",
        },
      ],
      Wednesday: [
        {
          id: 4,
          subject: "Computer Networks",
          instructor: "Dr. Brown",
          room: "Room 301",
          startTime: "10:00",
          endTime: "11:30",
          color: "#43e97b",
        },
      ],
    }
    setSchedule(mockSchedule)
  }, [])

  const handleAddClass = (e) => {
    e.preventDefault()
    const classWithId = {
      ...newClass,
      id: Date.now(),
    }

    const updatedSchedule = {
      ...schedule,
      [newClass.day]: [...(schedule[newClass.day] || []), classWithId],
    }

    setSchedule(updatedSchedule)
    setNewClass({
      subject: "",
      instructor: "",
      room: "",
      startTime: "",
      endTime: "",
      day: "",
      color: "#667eea",
    })
    setShowAddForm(false)
  }

  const handleDeleteClass = (day, classId) => {
    const updatedSchedule = {
      ...schedule,
      [day]: schedule[day].filter((cls) => cls.id !== classId),
    }
    setSchedule(updatedSchedule)
  }

  const getTimeSlotPosition = (time) => {
    const hour = Number.parseInt(time.split(":")[0])
    return (hour - 8) * 60 + Number.parseInt(time.split(":")[1])
  }

  const getClassDuration = (startTime, endTime) => {
    const start = getTimeSlotPosition(startTime)
    const end = getTimeSlotPosition(endTime)
    return end - start
  }

  return (
    <div className="min-h-screen bg-primary">
      {/* Header */}
      <section className="background-pattern py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-primary mb-4">My Timetable 📅</h1>
            <p className="text-xl text-secondary">Organize and manage your class schedule</p>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Action Bar */}
        <div className="card mb-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div>
              <h2 className="text-xl font-bold text-primary">Weekly Schedule</h2>
              <p className="text-secondary">Manage your classes and study time</p>
            </div>
            <button onClick={() => setShowAddForm(!showAddForm)} className="btn btn-primary">
              ➕ Add New Class
            </button>
          </div>
        </div>

        {/* Add Class Form */}
        {showAddForm && (
          <div className="card mb-8">
            <h3 className="text-lg font-bold text-primary mb-4">Add New Class</h3>
            <form onSubmit={handleAddClass} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-primary mb-2">Subject *</label>
                <input
                  type="text"
                  required
                  className="input"
                  placeholder="e.g., Data Structures"
                  value={newClass.subject}
                  onChange={(e) => setNewClass({ ...newClass, subject: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-primary mb-2">Instructor</label>
                <input
                  type="text"
                  className="input"
                  placeholder="e.g., Dr. Smith"
                  value={newClass.instructor}
                  onChange={(e) => setNewClass({ ...newClass, instructor: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-primary mb-2">Room</label>
                <input
                  type="text"
                  className="input"
                  placeholder="e.g., Room 101"
                  value={newClass.room}
                  onChange={(e) => setNewClass({ ...newClass, room: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-primary mb-2">Day *</label>
                <select
                  required
                  className="input"
                  value={newClass.day}
                  onChange={(e) => setNewClass({ ...newClass, day: e.target.value })}
                >
                  <option value="">Select Day</option>
                  {days.map((day) => (
                    <option key={day} value={day}>
                      {day}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-primary mb-2">Start Time *</label>
                <input
                  type="time"
                  required
                  className="input"
                  value={newClass.startTime}
                  onChange={(e) => setNewClass({ ...newClass, startTime: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-primary mb-2">End Time *</label>
                <input
                  type="time"
                  required
                  className="input"
                  value={newClass.endTime}
                  onChange={(e) => setNewClass({ ...newClass, endTime: e.target.value })}
                />
              </div>
              <div className="md:col-span-2 lg:col-span-1">
                <label className="block text-sm font-medium text-primary mb-2">Color</label>
                <div className="flex space-x-2">
                  {colors.map((color) => (
                    <button
                      key={color}
                      type="button"
                      className={`w-8 h-8 rounded-full border-2 ${
                        newClass.color === color ? "border-accent" : "border-tertiary"
                      }`}
                      style={{ backgroundColor: color }}
                      onClick={() => setNewClass({ ...newClass, color })}
                    />
                  ))}
                </div>
              </div>
              <div className="flex space-x-2 md:col-span-2 lg:col-span-3">
                <button type="submit" className="btn btn-primary">
                  Add Class
                </button>
                <button type="button" onClick={() => setShowAddForm(false)} className="btn btn-secondary">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Timetable Grid */}
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <div className="min-w-[800px]">
              {/* Header */}
              <div className="grid grid-cols-8 gap-px bg-tertiary">
                <div className="bg-secondary p-4 text-center font-medium text-primary">Time</div>
                {days.map((day) => (
                  <div key={day} className="bg-secondary p-4 text-center font-medium text-primary">
                    {day}
                  </div>
                ))}
              </div>

              {/* Time Slots */}
              <div className="grid grid-cols-8 gap-px bg-tertiary min-h-[600px]">
                {/* Time Column */}
                <div className="bg-primary">
                  {timeSlots.map((time) => (
                    <div
                      key={time}
                      className="h-16 border-b border-tertiary flex items-center justify-center text-secondary text-sm"
                    >
                      {time}
                    </div>
                  ))}
                </div>

                {/* Days Columns */}
                {days.map((day) => (
                  <div key={day} className="bg-primary relative">
                    {/* Time Slot Lines */}
                    {timeSlots.map((time, index) => (
                      <div key={time} className="h-16 border-b border-tertiary" />
                    ))}

                    {/* Classes */}
                    {(schedule[day] || []).map((cls) => (
                      <div
                        key={cls.id}
                        className="absolute left-1 right-1 rounded-md p-2 text-white text-xs shadow-lg group hover:shadow-xl transition-shadow cursor-pointer"
                        style={{
                          backgroundColor: cls.color,
                          top: `${(getTimeSlotPosition(cls.startTime) / 60) * 64}px`,
                          height: `${(getClassDuration(cls.startTime, cls.endTime) / 60) * 64}px`,
                          minHeight: "40px",
                        }}
                      >
                        <div className="font-medium truncate">{cls.subject}</div>
                        <div className="text-xs opacity-90 truncate">{cls.instructor}</div>
                        <div className="text-xs opacity-75 truncate">{cls.room}</div>
                        <div className="text-xs opacity-75">
                          {cls.startTime} - {cls.endTime}
                        </div>
                        <button
                          onClick={() => handleDeleteClass(day, cls.id)}
                          className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white rounded-full text-xs opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
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

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <div className="card text-center">
            <div className="text-3xl font-bold gradient-bg-1 bg-clip-text text-transparent mb-2">
              {Object.values(schedule).flat().length}
            </div>
            <div className="text-secondary">Total Classes</div>
          </div>
          <div className="card text-center">
            <div className="text-3xl font-bold gradient-bg-2 bg-clip-text text-transparent mb-2">
              {Object.keys(schedule).length}
            </div>
            <div className="text-secondary">Active Days</div>
          </div>
          <div className="card text-center">
            <div className="text-3xl font-bold gradient-bg-3 bg-clip-text text-transparent mb-2">
              {Math.round(
                Object.values(schedule)
                  .flat()
                  .reduce((total, cls) => {
                    return total + getClassDuration(cls.startTime, cls.endTime)
                  }, 0) / 60,
              )}
              h
            </div>
            <div className="text-secondary">Weekly Hours</div>
          </div>
        </div>
      </div>
    </div>
  )
}
