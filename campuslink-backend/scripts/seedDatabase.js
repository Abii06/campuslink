require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const Announcement = require('../models/Announcement');
const Complaint = require('../models/Complaint');
const LostFound = require('../models/LostFound');
const Timetable = require('../models/Timetable');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ MongoDB Connected for seeding');
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    process.exit(1);
  }
};

const seedUsers = async () => {
  try {
    // Clear existing users
    await User.deleteMany({});

    // Create admin user
    const admin = new User({
      name: 'Admin User',
      email: 'admin@campuslink.com',
      password: 'admin123',
      role: 'admin'
    });
    await admin.save();

    // Create sample students
    const studentData = [
      {
        name: 'John Doe',
        email: 'john@student.com',
        password: 'student123',
        role: 'student',
        studentId: 'CS2021001',
        department: 'Computer Science',
        year: 3,
        phone: '9876543210'
      },
      {
        name: 'Jane Smith',
        email: 'jane@student.com',
        password: 'student123',
        role: 'student',
        studentId: 'EC2021002',
        department: 'Electronics',
        year: 2,
        phone: '9876543211'
      },
      {
        name: 'Mike Johnson',
        email: 'mike@student.com',
        password: 'student123',
        role: 'student',
        studentId: 'ME2021003',
        department: 'Mechanical',
        year: 4,
        phone: '9876543212'
      }
    ];

    const students = [];
    for (const data of studentData) {
      const student = new User(data);
      await student.save();
      students.push(student);
    }

    console.log('✅ Users seeded successfully');
    return { admin, students };
  } catch (error) {
    console.error('❌ Error seeding users:', error);
    return { admin: null, students: [] };
  }
};

const seedAnnouncements = async (adminId) => {
  try {
    await Announcement.deleteMany({});

    const announcements = [
      {
        title: 'Welcome to New Academic Year 2024-25',
        content: 'We welcome all students to the new academic year. Classes will commence from Monday, July 15th, 2024.',
        category: 'academic',
        priority: 'high',
        targetAudience: ['all'],
        author: adminId
      },
      {
        title: 'Annual Sports Meet Registration Open',
        content: 'Registration for annual sports meet is now open. Last date for registration is August 15th, 2024.',
        category: 'sports',
        priority: 'medium',
        targetAudience: ['students'],
        author: adminId,
        expiryDate: new Date('2024-08-15')
      },
      {
        title: 'Library Timing Changes',
        content: 'Library will remain open till 10 PM from Monday to Friday starting this week.',
        category: 'general',
        priority: 'low',
        targetAudience: ['all'],
        author: adminId
      },
      {
        title: 'Cultural Fest - TechFest 2024',
        content: 'Annual cultural and technical fest will be held from September 20-22, 2024. Participation is open for all departments.',
        category: 'cultural',
        priority: 'high',
        targetAudience: ['all'],
        departments: ['Computer Science', 'Electronics', 'Mechanical'],
        author: adminId
      }
    ];

    for (const announcementData of announcements) {
      const announcement = new Announcement(announcementData);
      await announcement.save();
    }

    console.log('✅ Announcements seeded successfully');
  } catch (error) {
    console.error('❌ Error seeding announcements:', error);
  }
};

const seedComplaints = async (studentIds) => {
  try {
    await Complaint.deleteMany({});

    const complaints = [
      {
        title: 'WiFi connectivity issues in hostel',
        description: 'WiFi connection is very slow and frequently disconnects in Block A hostel rooms.',
        category: 'infrastructure',
        priority: 'high',
        location: 'Block A Hostel',
        submittedBy: studentIds[0]
      },
      {
        title: 'Food quality in canteen',
        description: 'The food quality in the main canteen has deteriorated. Please look into this matter.',
        category: 'food',
        priority: 'medium',
        location: 'Main Canteen',
        submittedBy: studentIds[1]
      },
      {
        title: 'Broken chairs in classroom',
        description: 'Several chairs in Room 301 are broken and need immediate replacement.',
        category: 'infrastructure',
        priority: 'low',
        location: 'Room 301, Academic Block',
        submittedBy: studentIds[2]
      }
    ];

    for (const complaintData of complaints) {
      const complaint = new Complaint(complaintData);
      await complaint.save();
    }

    console.log('✅ Complaints seeded successfully');
  } catch (error) {
    console.error('❌ Error seeding complaints:', error);
  }
};

const seedLostFound = async (studentIds) => {
  try {
    await LostFound.deleteMany({});

    const lostFoundItems = [
      {
        title: 'Lost iPhone 13',
        description: 'Black iPhone 13 with blue case. Lost near library.',
        type: 'lost',
        category: 'electronics',
        itemName: 'iPhone 13',
        brand: 'Apple',
        color: 'Black',
        location: 'Near Library',
        dateTime: new Date('2024-01-15T14:30:00'),
        contactInfo: {
          phone: '9876543210',
          email: 'john@student.com'
        },
        submittedBy: studentIds[0],
        isReward: true,
        rewardAmount: 500
      },
      {
        title: 'Found Wallet',
        description: 'Brown leather wallet found in parking area. Contains ID cards.',
        type: 'found',
        category: 'accessories',
        itemName: 'Wallet',
        color: 'Brown',
        location: 'Parking Area',
        dateTime: new Date('2024-01-16T09:15:00'),
        contactInfo: {
          phone: '9876543211',
          email: 'jane@student.com'
        },
        submittedBy: studentIds[1]
      },
      {
        title: 'Lost Textbook',
        description: 'Engineering Mathematics textbook by R.K. Jain. Has my name written inside.',
        type: 'lost',
        category: 'books',
        itemName: 'Engineering Mathematics Textbook',
        brand: 'R.K. Jain',
        location: 'Classroom 205',
        dateTime: new Date('2024-01-17T11:00:00'),
        contactInfo: {
          phone: '9876543212',
          email: 'mike@student.com'
        },
        submittedBy: studentIds[2]
      }
    ];

    for (const itemData of lostFoundItems) {
      const item = new LostFound(itemData);
      await item.save();
    }

    console.log('✅ Lost & Found items seeded successfully');
  } catch (error) {
    console.error('❌ Error seeding lost & found items:', error);
  }
};

const seedTimetables = async (adminId) => {
  try {
    await Timetable.deleteMany({});

    const timetable = {
      department: 'Computer Science',
      year: 3,
      semester: 5,
      section: 'A',
      academicYear: '2024-2025',
      effectiveFrom: new Date('2024-07-15'),
      effectiveTo: new Date('2024-12-15'),
      schedule: [
        {
          day: 'monday',
          periods: [
            {
              periodNumber: 1,
              startTime: '09:00',
              endTime: '09:50',
              subject: {
                code: 'CS501',
                name: 'Database Management Systems',
                credits: 4
              },
              faculty: {
                name: 'Dr. Smith Johnson',
                email: 'smith@college.edu',
                phone: '9876543220'
              },
              room: 'CS-301',
              type: 'lecture'
            },
            {
              periodNumber: 2,
              startTime: '10:00',
              endTime: '10:50',
              subject: {
                code: 'CS502',
                name: 'Software Engineering',
                credits: 3
              },
              faculty: {
                name: 'Prof. Alice Brown',
                email: 'alice@college.edu',
                phone: '9876543221'
              },
              room: 'CS-302',
              type: 'lecture'
            },
            {
              periodNumber: 3,
              startTime: '11:00',
              endTime: '11:50',
              subject: {
                code: 'BREAK',
                name: 'Break',
                credits: 1
              },
              faculty: {
                name: 'Break',
                email: '',
                phone: ''
              },
              room: 'Break',
              type: 'lecture',
              isBreak: true
            },
            {
              periodNumber: 4,
              startTime: '12:00',
              endTime: '12:50',
              subject: {
                code: 'CS503',
                name: 'Computer Networks',
                credits: 4
              },
              faculty: {
                name: 'Dr. Robert Wilson',
                email: 'robert@college.edu',
                phone: '9876543222'
              },
              room: 'CS-303',
              type: 'lecture'
            }
          ]
        },
        {
          day: 'tuesday',
          periods: [
            {
              periodNumber: 1,
              startTime: '09:00',
              endTime: '09:50',
              subject: {
                code: 'CS504',
                name: 'Operating Systems',
                credits: 4
              },
              faculty: {
                name: 'Dr. Emily Davis',
                email: 'emily@college.edu',
                phone: '9876543223'
              },
              room: 'CS-301',
              type: 'lecture'
            },
            {
              periodNumber: 2,
              startTime: '10:00',
              endTime: '12:50',
              subject: {
                code: 'CS501L',
                name: 'Database Lab',
                credits: 2
              },
              faculty: {
                name: 'Dr. Smith Johnson',
                email: 'smith@college.edu',
                phone: '9876543220'
              },
              room: 'CS-Lab1',
              type: 'lab'
            }
          ]
        }
      ],
      createdBy: adminId
    };

    const newTimetable = new Timetable(timetable);
    await newTimetable.save();

    console.log('✅ Timetables seeded successfully');
  } catch (error) {
    console.error('❌ Error seeding timetables:', error);
  }
};

const seedDatabase = async () => {
  try {
    await connectDB();

    console.log('🌱 Starting database seeding...');

    // Seed users first
    const { admin, students } = await seedUsers();
    const studentIds = students.map(student => student._id);

    // Seed other collections
    await seedAnnouncements(admin._id);
    await seedComplaints(studentIds);
    await seedLostFound(studentIds);
    await seedTimetables(admin._id);

    console.log('🎉 Database seeding completed successfully!');
    console.log('\n📊 Sample Data Created:');
    console.log('👤 Admin: admin@campuslink.com / admin123');
    console.log('👨‍🎓 Student 1: john@student.com / student123');
    console.log('👩‍🎓 Student 2: jane@student.com / student123');
    console.log('👨‍🎓 Student 3: mike@student.com / student123');
    console.log('\n🔗 You can now view this data in MongoDB Compass or Atlas');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

// Run seeding if this file is executed directly
if (require.main === module) {
  seedDatabase();
}

module.exports = seedDatabase;