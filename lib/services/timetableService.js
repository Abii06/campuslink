import apiService from '../api';

class TimetableService {
  // Get all timetables with filters
  async getTimetables(filters = {}) {
    try {
      const params = new URLSearchParams();
      
      // Add filters to params
      if (filters.page) params.append('page', filters.page);
      if (filters.limit) params.append('limit', filters.limit);
      if (filters.department) params.append('department', filters.department);
      if (filters.year) params.append('year', filters.year);
      if (filters.semester) params.append('semester', filters.semester);
      if (filters.section) params.append('section', filters.section);
      if (filters.academicYear) params.append('academicYear', filters.academicYear);

      const queryString = params.toString();
      const endpoint = `/timetable${queryString ? `?${queryString}` : ''}`;
      
      return await apiService.get(endpoint);
    } catch (error) {
      console.error('Get timetables error:', error);
      throw error;
    }
  }

  // Get single timetable by ID
  async getTimetableById(id) {
    try {
      return await apiService.get(`/timetable/${id}`);
    } catch (error) {
      console.error('Get timetable error:', error);
      throw error;
    }
  }

  // Create new timetable (Admin only)
  async createTimetable(timetableData) {
    try {
      const data = {
        department: timetableData.department,
        year: parseInt(timetableData.year),
        semester: parseInt(timetableData.semester),
        section: timetableData.section.toUpperCase(),
        academicYear: timetableData.academicYear,
        effectiveFrom: timetableData.effectiveFrom,
        effectiveTo: timetableData.effectiveTo,
        schedule: timetableData.schedule
      };

      return await apiService.post('/timetable', data);
    } catch (error) {
      console.error('Create timetable error:', error);
      throw error;
    }
  }

  // Update timetable (Admin only)
  async updateTimetable(id, timetableData) {
    try {
      const data = {
        department: timetableData.department,
        year: timetableData.year ? parseInt(timetableData.year) : undefined,
        semester: timetableData.semester ? parseInt(timetableData.semester) : undefined,
        section: timetableData.section ? timetableData.section.toUpperCase() : undefined,
        academicYear: timetableData.academicYear,
        effectiveFrom: timetableData.effectiveFrom,
        effectiveTo: timetableData.effectiveTo,
        schedule: timetableData.schedule
      };

      // Remove undefined values
      Object.keys(data).forEach(key => data[key] === undefined && delete data[key]);

      return await apiService.put(`/timetable/${id}`, data);
    } catch (error) {
      console.error('Update timetable error:', error);
      throw error;
    }
  }

  // Delete timetable (Admin only)
  async deleteTimetable(id) {
    try {
      return await apiService.delete(`/timetable/${id}`);
    } catch (error) {
      console.error('Delete timetable error:', error);
      throw error;
    }
  }

  // Get current user's timetable (Students only)
  async getCurrentUserTimetable() {
    try {
      return await apiService.get('/timetable/my/current');
    } catch (error) {
      console.error('Get current user timetable error:', error);
      throw error;
    }
  }

  // Get list of departments (Admin only)
  async getDepartments() {
    try {
      return await apiService.get('/timetable/departments/list');
    } catch (error) {
      console.error('Get departments error:', error);
      throw error;
    }
  }

  // Get timetables by department
  async getTimetablesByDepartment(department, page = 1, limit = 10) {
    try {
      return await this.getTimetables({ department, page, limit });
    } catch (error) {
      console.error('Get timetables by department error:', error);
      throw error;
    }
  }

  // Get timetables by year
  async getTimetablesByYear(year, page = 1, limit = 10) {
    try {
      return await this.getTimetables({ year, page, limit });
    } catch (error) {
      console.error('Get timetables by year error:', error);
      throw error;
    }
  }

  // Get timetables by department and year
  async getTimetablesByDepartmentAndYear(department, year, page = 1, limit = 10) {
    try {
      return await this.getTimetables({ department, year, page, limit });
    } catch (error) {
      console.error('Get timetables by department and year error:', error);
      throw error;
    }
  }

  // Get timetables by semester
  async getTimetablesBySemester(semester, page = 1, limit = 10) {
    try {
      return await this.getTimetables({ semester, page, limit });
    } catch (error) {
      console.error('Get timetables by semester error:', error);
      throw error;
    }
  }

  // Get timetables by section
  async getTimetablesBySection(section, page = 1, limit = 10) {
    try {
      return await this.getTimetables({ section, page, limit });
    } catch (error) {
      console.error('Get timetables by section error:', error);
      throw error;
    }
  }

  // Get timetables by academic year
  async getTimetablesByAcademicYear(academicYear, page = 1, limit = 10) {
    try {
      return await this.getTimetables({ academicYear, page, limit });
    } catch (error) {
      console.error('Get timetables by academic year error:', error);
      throw error;
    }
  }

  // Helper method to create a complete schedule structure
  createScheduleStructure() {
    const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const schedule = [];

    days.forEach(day => {
      schedule.push({
        day: day,
        periods: []
      });
    });

    return schedule;
  }

  // Helper method to add period to schedule
  addPeriodToSchedule(schedule, day, period) {
    const daySchedule = schedule.find(s => s.day === day);
    if (daySchedule) {
      daySchedule.periods.push(period);
      // Sort periods by period number
      daySchedule.periods.sort((a, b) => a.periodNumber - b.periodNumber);
    }
    return schedule;
  }

  // Helper method to validate timetable data
  validateTimetableData(timetableData) {
    const errors = [];

    if (!timetableData.department) errors.push('Department is required');
    if (!timetableData.year || timetableData.year < 1 || timetableData.year > 4) {
      errors.push('Year must be between 1-4');
    }
    if (!timetableData.semester || timetableData.semester < 1 || timetableData.semester > 8) {
      errors.push('Semester must be between 1-8');
    }
    if (!timetableData.section) errors.push('Section is required');
    if (!timetableData.academicYear || !/^\d{4}-\d{4}$/.test(timetableData.academicYear)) {
      errors.push('Academic year format should be YYYY-YYYY');
    }
    if (!timetableData.effectiveFrom) errors.push('Effective from date is required');
    if (!timetableData.effectiveTo) errors.push('Effective to date is required');
    if (!timetableData.schedule || !Array.isArray(timetableData.schedule) || timetableData.schedule.length === 0) {
      errors.push('Schedule is required');
    }

    return errors;
  }
}

const timetableService = new TimetableService();
export default timetableService;