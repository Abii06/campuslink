import apiService from '../api';

class PersonalTimetableService {
  // Get user's personal timetable
  async getPersonalTimetable() {
    try {
      console.log('🔍 PersonalTimetableService - Getting personal timetable');
      return await apiService.get('/personal-timetable');
    } catch (error) {
      console.error('Get personal timetable error:', error);
      throw error;
    }
  }

  // Update user's personal timetable
  async updatePersonalTimetable(schedule) {
    try {
      console.log('🔍 PersonalTimetableService - Updating personal timetable');
      console.log('🔍 PersonalTimetableService - Schedule data:', JSON.stringify(schedule, null, 2));
      
      const data = { schedule };
      return await apiService.put('/personal-timetable', data);
    } catch (error) {
      console.error('Update personal timetable error:', error);
      throw error;
    }
  }

  // Delete user's personal timetable
  async deletePersonalTimetable() {
    try {
      console.log('🔍 PersonalTimetableService - Deleting personal timetable');
      return await apiService.delete('/personal-timetable');
    } catch (error) {
      console.error('Delete personal timetable error:', error);
      throw error;
    }
  }
}

const personalTimetableService = new PersonalTimetableService();
export default personalTimetableService;