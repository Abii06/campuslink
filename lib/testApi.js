// API Testing Script
// This script tests all API endpoints to ensure they work correctly

import { 
  authService, 
  userService, 
  announcementService, 
  complaintService, 
  lostFoundService, 
  timetableService 
} from './services';

class ApiTester {
  constructor() {
    this.testResults = [];
    this.adminToken = null;
    this.studentToken = null;
    this.testUserId = null;
    this.testAnnouncementId = null;
    this.testComplaintId = null;
    this.testLostFoundId = null;
    this.testTimetableId = null;
  }

  // Log test results
  log(test, status, message = '') {
    const result = { test, status, message, timestamp: new Date().toISOString() };
    this.testResults.push(result);
    console.log(`${status === 'PASS' ? '✅' : '❌'} ${test}: ${message}`);
  }

  // Test authentication endpoints
  async testAuthentication() {
    console.log('\n🔐 Testing Authentication...');

    try {
      // Test admin login
      const adminLogin = await authService.login('admin@campuslink.com', 'admin123');
      if (adminLogin.success) {
        this.adminToken = adminLogin.token;
        this.log('Admin Login', 'PASS', 'Admin logged in successfully');
      } else {
        this.log('Admin Login', 'FAIL', adminLogin.message);
      }

      // Test student login
      const studentLogin = await authService.login('john@student.com', 'student123');
      if (studentLogin.success) {
        this.studentToken = studentLogin.token;
        this.log('Student Login', 'PASS', 'Student logged in successfully');
      } else {
        this.log('Student Login', 'FAIL', studentLogin.message);
      }

      // Test get current user
      const currentUser = await authService.getCurrentUser();
      if (currentUser.success) {
        this.log('Get Current User', 'PASS', `User: ${currentUser.user.name}`);
      } else {
        this.log('Get Current User', 'FAIL', currentUser.message);
      }

      // Test registration
      const newUser = {
        name: 'Test User',
        email: `test${Date.now()}@student.com`,
        password: 'test123',
        role: 'student',
        studentId: `TEST${Date.now()}`,
        department: 'Computer Science',
        year: 2,
        phone: '9876543999'
      };

      const registration = await authService.register(newUser);
      if (registration.success) {
        this.testUserId = registration.user._id;
        this.log('User Registration', 'PASS', 'New user registered successfully');
      } else {
        this.log('User Registration', 'FAIL', registration.message);
      }

    } catch (error) {
      this.log('Authentication Tests', 'FAIL', error.message);
    }
  }

  // Test announcement endpoints
  async testAnnouncements() {
    console.log('\n📢 Testing Announcements...');

    try {
      // Test get announcements
      const announcements = await announcementService.getAnnouncements();
      if (announcements.success) {
        this.log('Get Announcements', 'PASS', `Found ${announcements.data.length} announcements`);
      } else {
        this.log('Get Announcements', 'FAIL', announcements.message);
      }

      // Test create announcement (admin only)
      const newAnnouncement = {
        title: 'Test Announcement',
        content: 'This is a test announcement created by API test',
        category: 'general',
        priority: 'medium',
        targetAudience: ['all']
      };

      const createAnnouncement = await announcementService.createAnnouncement(newAnnouncement);
      if (createAnnouncement.success) {
        this.testAnnouncementId = createAnnouncement.data._id;
        this.log('Create Announcement', 'PASS', 'Announcement created successfully');
      } else {
        this.log('Create Announcement', 'FAIL', createAnnouncement.message);
      }

      // Test get single announcement
      if (this.testAnnouncementId) {
        const singleAnnouncement = await announcementService.getAnnouncementById(this.testAnnouncementId);
        if (singleAnnouncement.success) {
          this.log('Get Single Announcement', 'PASS', 'Retrieved announcement details');
        } else {
          this.log('Get Single Announcement', 'FAIL', singleAnnouncement.message);
        }
      }

    } catch (error) {
      this.log('Announcement Tests', 'FAIL', error.message);
    }
  }

  // Test complaint endpoints
  async testComplaints() {
    console.log('\n📝 Testing Complaints...');

    try {
      // Test get complaints
      const complaints = await complaintService.getComplaints();
      if (complaints.success) {
        this.log('Get Complaints', 'PASS', `Found ${complaints.data.length} complaints`);
      } else {
        this.log('Get Complaints', 'FAIL', complaints.message);
      }

      // Test create complaint
      const newComplaint = {
        title: 'Test Complaint',
        description: 'This is a test complaint created by API test',
        category: 'infrastructure',
        priority: 'medium',
        location: 'Test Location'
      };

      const createComplaint = await complaintService.createComplaint(newComplaint);
      if (createComplaint.success) {
        this.testComplaintId = createComplaint.data._id;
        this.log('Create Complaint', 'PASS', 'Complaint created successfully');
      } else {
        this.log('Create Complaint', 'FAIL', createComplaint.message);
      }

      // Test get single complaint
      if (this.testComplaintId) {
        const singleComplaint = await complaintService.getComplaintById(this.testComplaintId);
        if (singleComplaint.success) {
          this.log('Get Single Complaint', 'PASS', 'Retrieved complaint details');
        } else {
          this.log('Get Single Complaint', 'FAIL', singleComplaint.message);
        }
      }

    } catch (error) {
      this.log('Complaint Tests', 'FAIL', error.message);
    }
  }

  // Test lost and found endpoints
  async testLostFound() {
    console.log('\n🔍 Testing Lost & Found...');

    try {
      // Test get lost found items
      const lostFoundItems = await lostFoundService.getLostFoundItems();
      if (lostFoundItems.success) {
        this.log('Get Lost Found Items', 'PASS', `Found ${lostFoundItems.data.length} items`);
      } else {
        this.log('Get Lost Found Items', 'FAIL', lostFoundItems.message);
      }

      // Test create lost found item
      const newItem = {
        title: 'Test Lost Item',
        description: 'This is a test lost item created by API test',
        type: 'lost',
        category: 'electronics',
        itemName: 'Test Phone',
        location: 'Test Location',
        dateTime: new Date().toISOString(),
        contactInfo: {
          phone: '9876543210',
          email: 'test@student.com'
        }
      };

      const createItem = await lostFoundService.createLostFoundItem(newItem);
      if (createItem.success) {
        this.testLostFoundId = createItem.data._id;
        this.log('Create Lost Found Item', 'PASS', 'Item created successfully');
      } else {
        this.log('Create Lost Found Item', 'FAIL', createItem.message);
      }

      // Test get single item
      if (this.testLostFoundId) {
        const singleItem = await lostFoundService.getLostFoundItemById(this.testLostFoundId);
        if (singleItem.success) {
          this.log('Get Single Lost Found Item', 'PASS', 'Retrieved item details');
        } else {
          this.log('Get Single Lost Found Item', 'FAIL', singleItem.message);
        }
      }

    } catch (error) {
      this.log('Lost Found Tests', 'FAIL', error.message);
    }
  }

  // Test timetable endpoints
  async testTimetables() {
    console.log('\n📅 Testing Timetables...');

    try {
      // Test get timetables
      const timetables = await timetableService.getTimetables();
      if (timetables.success) {
        this.log('Get Timetables', 'PASS', `Found ${timetables.data.length} timetables`);
      } else {
        this.log('Get Timetables', 'FAIL', timetables.message);
      }

      // Test get current user timetable (student only)
      const currentTimetable = await timetableService.getCurrentUserTimetable();
      if (currentTimetable.success) {
        this.log('Get Current User Timetable', 'PASS', 'Retrieved user timetable');
      } else {
        this.log('Get Current User Timetable', 'FAIL', currentTimetable.message);
      }

    } catch (error) {
      this.log('Timetable Tests', 'FAIL', error.message);
    }
  }

  // Test user management endpoints (admin only)
  async testUserManagement() {
    console.log('\n👥 Testing User Management...');

    try {
      // Test get users (admin only)
      const users = await userService.getUsers();
      if (users.success) {
        this.log('Get Users', 'PASS', `Found ${users.data.length} users`);
      } else {
        this.log('Get Users', 'FAIL', users.message);
      }

      // Test get user stats (admin only)
      const userStats = await userService.getUserStats();
      if (userStats.success) {
        this.log('Get User Stats', 'PASS', 'Retrieved user statistics');
      } else {
        this.log('Get User Stats', 'FAIL', userStats.message);
      }

    } catch (error) {
      this.log('User Management Tests', 'FAIL', error.message);
    }
  }

  // Run all tests
  async runAllTests() {
    console.log('🚀 Starting API Tests...\n');
    
    await this.testAuthentication();
    await this.testAnnouncements();
    await this.testComplaints();
    await this.testLostFound();
    await this.testTimetables();
    await this.testUserManagement();

    this.printSummary();
  }

  // Print test summary
  printSummary() {
    console.log('\n📊 Test Summary:');
    console.log('================');
    
    const passed = this.testResults.filter(r => r.status === 'PASS').length;
    const failed = this.testResults.filter(r => r.status === 'FAIL').length;
    const total = this.testResults.length;

    console.log(`Total Tests: ${total}`);
    console.log(`Passed: ${passed} ✅`);
    console.log(`Failed: ${failed} ❌`);
    console.log(`Success Rate: ${((passed / total) * 100).toFixed(1)}%`);

    if (failed > 0) {
      console.log('\n❌ Failed Tests:');
      this.testResults
        .filter(r => r.status === 'FAIL')
        .forEach(r => console.log(`  - ${r.test}: ${r.message}`));
    }

    console.log('\n🎉 API Testing Complete!');
  }

  // Clean up test data
  async cleanup() {
    console.log('\n🧹 Cleaning up test data...');

    try {
      // Delete test announcement
      if (this.testAnnouncementId) {
        await announcementService.deleteAnnouncement(this.testAnnouncementId);
        this.log('Cleanup', 'PASS', 'Test announcement deleted');
      }

      // Delete test lost found item
      if (this.testLostFoundId) {
        await lostFoundService.deleteLostFoundItem(this.testLostFoundId);
        this.log('Cleanup', 'PASS', 'Test lost found item deleted');
      }

      // Delete test user
      if (this.testUserId) {
        await userService.deleteUser(this.testUserId);
        this.log('Cleanup', 'PASS', 'Test user deleted');
      }

    } catch (error) {
      this.log('Cleanup', 'FAIL', error.message);
    }
  }
}

// Export the tester
export default ApiTester;

// Function to run tests from browser console
export const runApiTests = async () => {
  const tester = new ApiTester();
  await tester.runAllTests();
  await tester.cleanup();
  return tester.testResults;
};