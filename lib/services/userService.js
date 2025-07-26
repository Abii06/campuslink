import apiService from '../api';

class UserService {
  // Get all users with filters (Admin only)
  async getUsers(filters = {}) {
    try {
      const params = new URLSearchParams();
      
      // Add filters to params
      if (filters.page) params.append('page', filters.page);
      if (filters.limit) params.append('limit', filters.limit);
      if (filters.role) params.append('role', filters.role);
      if (filters.department) params.append('department', filters.department);
      if (filters.year) params.append('year', filters.year);
      if (filters.search) params.append('search', filters.search);

      const queryString = params.toString();
      const endpoint = `/users${queryString ? `?${queryString}` : ''}`;
      
      return await apiService.get(endpoint);
    } catch (error) {
      console.error('Get users error:', error);
      throw error;
    }
  }

  // Get single user by ID (Admin only)
  async getUserById(id) {
    try {
      return await apiService.get(`/users/${id}`);
    } catch (error) {
      console.error('Get user error:', error);
      throw error;
    }
  }

  // Update user (Admin only)
  async updateUser(id, userData) {
    try {
      const data = {
        name: userData.name,
        email: userData.email,
        role: userData.role,
        department: userData.department,
        year: userData.year ? parseInt(userData.year) : undefined,
        phone: userData.phone,
        isActive: userData.isActive
      };

      // Remove undefined values
      Object.keys(data).forEach(key => data[key] === undefined && delete data[key]);

      return await apiService.put(`/users/${id}`, data);
    } catch (error) {
      console.error('Update user error:', error);
      throw error;
    }
  }

  // Delete user (Admin only)
  async deleteUser(id) {
    try {
      return await apiService.delete(`/users/${id}`);
    } catch (error) {
      console.error('Delete user error:', error);
      throw error;
    }
  }

  // Get user statistics (Admin only)
  async getUserStats() {
    try {
      return await apiService.get('/users/stats/overview');
    } catch (error) {
      console.error('Get user stats error:', error);
      throw error;
    }
  }

  // Get users by role
  async getUsersByRole(role, page = 1, limit = 10) {
    try {
      return await this.getUsers({ role, page, limit });
    } catch (error) {
      console.error('Get users by role error:', error);
      throw error;
    }
  }

  // Get students only
  async getStudents(page = 1, limit = 10) {
    try {
      return await this.getUsersByRole('student', page, limit);
    } catch (error) {
      console.error('Get students error:', error);
      throw error;
    }
  }

  // Get admins only
  async getAdmins(page = 1, limit = 10) {
    try {
      return await this.getUsersByRole('admin', page, limit);
    } catch (error) {
      console.error('Get admins error:', error);
      throw error;
    }
  }

  // Get users by department
  async getUsersByDepartment(department, page = 1, limit = 10) {
    try {
      return await this.getUsers({ department, page, limit });
    } catch (error) {
      console.error('Get users by department error:', error);
      throw error;
    }
  }

  // Get users by year
  async getUsersByYear(year, page = 1, limit = 10) {
    try {
      return await this.getUsers({ year, page, limit });
    } catch (error) {
      console.error('Get users by year error:', error);
      throw error;
    }
  }

  // Search users
  async searchUsers(searchTerm, page = 1, limit = 10) {
    try {
      return await this.getUsers({ search: searchTerm, page, limit });
    } catch (error) {
      console.error('Search users error:', error);
      throw error;
    }
  }

  // Get active users
  async getActiveUsers(page = 1, limit = 10) {
    try {
      const response = await this.getUsers({ page, limit });
      if (response.success) {
        // Filter active users on frontend if backend doesn't support this filter
        const activeUsers = response.data.filter(user => user.isActive !== false);
        return {
          ...response,
          data: activeUsers
        };
      }
      return response;
    } catch (error) {
      console.error('Get active users error:', error);
      throw error;
    }
  }

  // Get inactive users
  async getInactiveUsers(page = 1, limit = 10) {
    try {
      const response = await this.getUsers({ page, limit });
      if (response.success) {
        // Filter inactive users on frontend if backend doesn't support this filter
        const inactiveUsers = response.data.filter(user => user.isActive === false);
        return {
          ...response,
          data: inactiveUsers
        };
      }
      return response;
    } catch (error) {
      console.error('Get inactive users error:', error);
      throw error;
    }
  }

  // Activate user
  async activateUser(id) {
    try {
      return await this.updateUser(id, { isActive: true });
    } catch (error) {
      console.error('Activate user error:', error);
      throw error;
    }
  }

  // Deactivate user
  async deactivateUser(id) {
    try {
      return await this.updateUser(id, { isActive: false });
    } catch (error) {
      console.error('Deactivate user error:', error);
      throw error;
    }
  }

  // Bulk operations
  async bulkUpdateUsers(userIds, updateData) {
    try {
      const promises = userIds.map(id => this.updateUser(id, updateData));
      const results = await Promise.allSettled(promises);
      
      const successful = results.filter(result => result.status === 'fulfilled').length;
      const failed = results.filter(result => result.status === 'rejected').length;

      return {
        success: true,
        message: `Updated ${successful} users successfully${failed > 0 ? `, ${failed} failed` : ''}`,
        successful,
        failed
      };
    } catch (error) {
      console.error('Bulk update users error:', error);
      throw error;
    }
  }

  // Bulk delete users
  async bulkDeleteUsers(userIds) {
    try {
      const promises = userIds.map(id => this.deleteUser(id));
      const results = await Promise.allSettled(promises);
      
      const successful = results.filter(result => result.status === 'fulfilled').length;
      const failed = results.filter(result => result.status === 'rejected').length;

      return {
        success: true,
        message: `Deleted ${successful} users successfully${failed > 0 ? `, ${failed} failed` : ''}`,
        successful,
        failed
      };
    } catch (error) {
      console.error('Bulk delete users error:', error);
      throw error;
    }
  }

  // Validate user data
  validateUserData(userData) {
    const errors = [];

    if (!userData.name || userData.name.trim().length < 2) {
      errors.push('Name must be at least 2 characters long');
    }

    if (!userData.email || !this.isValidEmail(userData.email)) {
      errors.push('Please enter a valid email address');
    }

    if (!userData.role || !['student', 'admin'].includes(userData.role)) {
      errors.push('Role must be either student or admin');
    }

    if (userData.role === 'student') {
      if (!userData.department || userData.department.trim().length === 0) {
        errors.push('Department is required for students');
      }

      if (!userData.year || userData.year < 1 || userData.year > 4) {
        errors.push('Year must be between 1-4 for students');
      }
    }

    if (userData.phone && !/^[0-9]{10}$/.test(userData.phone)) {
      errors.push('Phone number must be 10 digits');
    }

    return errors;
  }

  // Validate email format
  isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}

const userService = new UserService();
export default userService;