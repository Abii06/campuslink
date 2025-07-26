import apiService from '../api';

class EfficientTimetableService {
  // Delete the student's personal timetable
  async deleteStudentTimetable() {
    try {
      const response = await apiService.delete('/personal-timetable');
      return response;
    } catch (error) {
      console.error('EfficientTimetableService error:', error);
      throw error;
    }
  }
  // Get the student's personal timetable
  async getStudentTimetable() {
    try {
      const response = await apiService.get('/personal-timetable');
      if (response.success && response.data) {
        return response.data;
      }
      return null;
    } catch (error) {
      console.error('EfficientTimetableService error:', error);
      throw error;
    }
  }

  // Update the student's personal timetable
  async updateStudentTimetable(schedule) {
    try {
      const response = await apiService.put('/personal-timetable', { schedule });
      return response;
    } catch (error) {
      console.error('EfficientTimetableService error:', error);
      throw error;
    }
  }
}

export default new EfficientTimetableService();
