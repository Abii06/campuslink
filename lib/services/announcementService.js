import apiService from '../api';

class AnnouncementService {
  // Get all announcements with filters
  async getAnnouncements(filters = {}) {
    try {
      const params = new URLSearchParams();
      
      // Add filters to params
      if (filters.page) params.append('page', filters.page);
      if (filters.limit) params.append('limit', filters.limit);
      if (filters.category) params.append('category', filters.category);
      if (filters.priority) params.append('priority', filters.priority);
      if (filters.search) params.append('search', filters.search);
      if (filters.department) params.append('department', filters.department);
      if (filters.year) params.append('year', filters.year);

      const queryString = params.toString();
      const endpoint = `/announcements${queryString ? `?${queryString}` : ''}`;
      
      return await apiService.get(endpoint);
    } catch (error) {
      console.error('Get announcements error:', error);
      throw error;
    }
  }

  // Get single announcement by ID
  async getAnnouncementById(id) {
    try {
      return await apiService.get(`/announcements/${id}`);
    } catch (error) {
      console.error('Get announcement error:', error);
      throw error;
    }
  }

  // Create new announcement (Admin only)
  async createAnnouncement(announcementData) {
    try {
      const data = {
        title: announcementData.title,
        content: announcementData.content,
        category: announcementData.category,
        priority: announcementData.priority || 'medium',
        targetAudience: announcementData.targetAudience || ['all'],
        departments: announcementData.departments || [],
        years: announcementData.years || [],
        expiryDate: announcementData.expiryDate || null
      };

      const resp = await apiService.post('/announcements', data);
      if (!resp.success) {
        console.error('[ANNOUNCEMENT DEBUG] Full backend response:', resp);
      }
      return resp;
    } catch (error) {
      console.error('Create announcement error:', error);
      throw error;
    }
  }

  // Update announcement (Admin only)
  async updateAnnouncement(id, announcementData) {
    try {
      const data = {
        title: announcementData.title,
        content: announcementData.content,
        category: announcementData.category,
        priority: announcementData.priority,
        targetAudience: announcementData.targetAudience,
        departments: announcementData.departments,
        years: announcementData.years,
        expiryDate: announcementData.expiryDate
      };

      return await apiService.put(`/announcements/${id}`, data);
    } catch (error) {
      console.error('Update announcement error:', error);
      throw error;
    }
  }

  // Delete announcement (Admin only)
  async deleteAnnouncement(id) {
    try {
      return await apiService.delete(`/announcements/${id}`);
    } catch (error) {
      console.error('Delete announcement error:', error);
      throw error;
    }
  }

  // Like/Unlike announcement
  async toggleLike(id) {
    try {
      return await apiService.post(`/announcements/${id}/like`);
    } catch (error) {
      console.error('Toggle like error:', error);
      throw error;
    }
  }

  // Get announcements by category
  async getAnnouncementsByCategory(category, page = 1, limit = 10) {
    try {
      return await this.getAnnouncements({ category, page, limit });
    } catch (error) {
      console.error('Get announcements by category error:', error);
      throw error;
    }
  }

  // Get announcements by priority
  async getAnnouncementsByPriority(priority, page = 1, limit = 10) {
    try {
      return await this.getAnnouncements({ priority, page, limit });
    } catch (error) {
      console.error('Get announcements by priority error:', error);
      throw error;
    }
  }

  // Search announcements
  async searchAnnouncements(searchTerm, page = 1, limit = 10) {
    try {
      return await this.getAnnouncements({ search: searchTerm, page, limit });
    } catch (error) {
      console.error('Search announcements error:', error);
      throw error;
    }
  }
}

const announcementService = new AnnouncementService();
export default announcementService;