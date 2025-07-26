import apiService from '../api';

class ComplaintService {
  // Delete complaint by ID
  async deleteComplaint(id) {
    try {
      return await apiService.delete(`/complaints/${id}`);
    } catch (error) {
      console.error('Delete complaint error:', error);
      throw error;
    }
  }
  // Get all complaints with filters
  async getComplaints(filters = {}) {
    try {
      const params = new URLSearchParams();
      
      // Add filters to params
      if (filters.page) params.append('page', filters.page);
      if (filters.limit) params.append('limit', filters.limit);
      if (filters.category) params.append('category', filters.category);
      if (filters.status) params.append('status', filters.status);
      if (filters.priority) params.append('priority', filters.priority);
      if (filters.search) params.append('search', filters.search);
      if (filters.my) params.append('my', filters.my);

      const queryString = params.toString();
      const endpoint = `/complaints${queryString ? `?${queryString}` : ''}`;
      
      return await apiService.get(endpoint);
    } catch (error) {
      console.error('Get complaints error:', error);
      throw error;
    }
  }

  // Get single complaint by ID
  async getComplaintById(id) {
    try {
      return await apiService.get(`/complaints/${id}`);
    } catch (error) {
      console.error('Get complaint error:', error);
      throw error;
    }
  }

  // Create new complaint
  async createComplaint(complaintData) {
    try {
      const data = {
        title: complaintData.title,
        description: complaintData.description,
        category: complaintData.category,
        priority: complaintData.priority || 'medium',
        location: complaintData.location || '',
        isAnonymous: complaintData.isAnonymous || false,
        block: complaintData.block || '',
        roomNumber: complaintData.roomNumber || ''
      };

      return await apiService.post('/complaints', data);
    } catch (error) {
      console.error('Create complaint error:', error);
      throw error;
    }
  }

  // Update complaint status (Admin only)
  async updateComplaintStatus(id, status, adminResponse = '') {
    try {
      const data = {
        status: status,
        adminResponse: adminResponse
      };

      return await apiService.put(`/complaints/${id}/status`, data);
    } catch (error) {
      console.error('Update complaint status error:', error);
      throw error;
    }
  }

  // Upvote/Remove upvote from complaint
  async toggleUpvote(id) {
    try {
      return await apiService.post(`/complaints/${id}/upvote`);
    } catch (error) {
      console.error('Toggle upvote error:', error);
      throw error;
    }
  }

  // Add comment to complaint
  async addComment(id, message) {
    try {
      const data = { message };
      return await apiService.post(`/complaints/${id}/comments`, data);
    } catch (error) {
      console.error('Add comment error:', error);
      throw error;
    }
  }

  // Get complaint statistics (Admin only)
  async getComplaintStats() {
    try {
      return await apiService.get('/complaints/stats/overview');
    } catch (error) {
      console.error('Get complaint stats error:', error);
      throw error;
    }
  }

  // Get my complaints
  async getMyComplaints(page = 1, limit = 10) {
    try {
      return await this.getComplaints({ my: true, page, limit });
    } catch (error) {
      console.error('Get my complaints error:', error);
      throw error;
    }
  }

  // Get complaints by category
  async getComplaintsByCategory(category, page = 1, limit = 10) {
    try {
      return await this.getComplaints({ category, page, limit });
    } catch (error) {
      console.error('Get complaints by category error:', error);
      throw error;
    }
  }

  // Get complaints by status
  async getComplaintsByStatus(status, page = 1, limit = 10) {
    try {
      return await this.getComplaints({ status, page, limit });
    } catch (error) {
      console.error('Get complaints by status error:', error);
      throw error;
    }
  }

  // Search complaints
  async searchComplaints(searchTerm, page = 1, limit = 10) {
    try {
      return await this.getComplaints({ search: searchTerm, page, limit });
    } catch (error) {
      console.error('Search complaints error:', error);
      throw error;
    }
  }

  // Get pending complaints (Admin)
  async getPendingComplaints(page = 1, limit = 10) {
    try {
      return await this.getComplaints({ status: 'pending', page, limit });
    } catch (error) {
      console.error('Get pending complaints error:', error);
      throw error;
    }
  }

  // Get resolved complaints
  async getResolvedComplaints(page = 1, limit = 10) {
    try {
      return await this.getComplaints({ status: 'resolved', page, limit });
    } catch (error) {
      console.error('Get resolved complaints error:', error);
      throw error;
    }
  }
}

const complaintService = new ComplaintService();
export default complaintService;