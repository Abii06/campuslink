import apiService from '../api';

class AuthService {
  // User registration/signup
  async register(userData) {
    try {
      // Validate required fields
      const errors = this.validateRegistrationData(userData);
      if (errors.length > 0) {
        throw new Error(errors.join(', '));
      }

      const data = {
        name: userData.name,
        email: userData.email,
        password: userData.password,
        role: userData.role || 'student'
      };

      // Only add student-specific fields if role is student
      if (userData.role === 'student') {
        data.studentId = userData.studentId || '';
        data.department = userData.department || '';
        data.year = userData.year ? parseInt(userData.year) : null;
      }

      // Only add phone if provided and not empty
      if (userData.phone && userData.phone.trim()) {
        data.phone = userData.phone.trim();
      }

      const response = await apiService.post('/auth/register', data);
      
      if (response.success && response.token) {
        apiService.setAuthToken(response.token);
        return {
          success: true,
          user: response.user,
          token: response.token,
          message: response.message
        };
      } else {
        return {
          success: false,
          message: response.message || 'Registration failed'
        };
      }
    } catch (error) {
      console.error('Registration error:', error);
      return {
        success: false,
        message: error.message || 'Registration failed'
      };
    }
  }

  // User login
  async login(email, password) {
    try {
      // Validate input
      if (!email || !password) {
        throw new Error('Email and password are required');
      }

      if (!this.isValidEmail(email)) {
        throw new Error('Please enter a valid email address');
      }

      const response = await apiService.post('/auth/login', { email, password });
      
      if (response.success && response.token) {
        apiService.setAuthToken(response.token);
        return {
          success: true,
          user: response.user,
          token: response.token,
          message: response.message
        };
      } else {
        return {
          success: false,
          message: response.message || 'Invalid email or password'
        };
      }
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        message: error.message || 'Login failed'
      };
    }
  }

  // User logout
  async logout() {
    try {
      apiService.removeAuthToken();
      return {
        success: true,
        message: 'Logged out successfully'
      };
    } catch (error) {
      console.error('Logout error:', error);
      return {
        success: false,
        message: 'Logout failed'
      };
    }
  }

  // Get current user
  async getCurrentUser() {
    try {
      const response = await apiService.get('/auth/me');
      
      if (response.success) {
        return {
          success: true,
          user: response.user
        };
      } else {
        return {
          success: false,
          message: response.message || 'Failed to get user data'
        };
      }
    } catch (error) {
      console.error('Get current user error:', error);
      return {
        success: false,
        message: error.message || 'Failed to get user data'
      };
    }
  }

  // Update user profile
  async updateProfile(userData) {
    try {
      const data = {
        name: userData.name,
        email: userData.email,
        phone: userData.phone,
        department: userData.department,
        year: userData.year ? parseInt(userData.year) : null
      };

      // Remove undefined values
      Object.keys(data).forEach(key => data[key] === undefined && delete data[key]);

      const response = await apiService.put('/auth/profile', data);
      
      if (response.success) {
        return {
          success: true,
          user: response.user,
          message: response.message
        };
      } else {
        return {
          success: false,
          message: response.message || 'Profile update failed'
        };
      }
    } catch (error) {
      console.error('Update profile error:', error);
      return {
        success: false,
        message: error.message || 'Profile update failed'
      };
    }
  }

  // Change password
  async changePassword(currentPassword, newPassword) {
    try {
      if (!currentPassword || !newPassword) {
        throw new Error('Current password and new password are required');
      }

      if (newPassword.length < 6) {
        throw new Error('New password must be at least 6 characters long');
      }

      const data = {
        currentPassword,
        newPassword
      };

      const response = await apiService.put('/auth/change-password', data);
      
      if (response.success) {
        return {
          success: true,
          message: response.message || 'Password changed successfully'
        };
      } else {
        return {
          success: false,
          message: response.message || 'Password change failed'
        };
      }
    } catch (error) {
      console.error('Change password error:', error);
      return {
        success: false,
        message: error.message || 'Password change failed'
      };
    }
  }

  // Check if user is authenticated
  isAuthenticated() {
    return !!apiService.getAuthToken();
  }

  // Get stored auth token
  getAuthToken() {
    return apiService.getAuthToken();
  }

  // Validate registration data
  validateRegistrationData(userData) {
    const errors = [];

    if (!userData.name || userData.name.trim().length < 2) {
      errors.push('Name must be at least 2 characters long');
    }

    if (!userData.email || !this.isValidEmail(userData.email)) {
      errors.push('Please enter a valid email address');
    }

    if (!userData.password || userData.password.length < 6) {
      errors.push('Password must be at least 6 characters long');
    }

    if (userData.role === 'student') {
      if (!userData.studentId || userData.studentId.trim().length === 0) {
        errors.push('Student ID is required for students');
      }

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

  // Get user role
  getUserRole() {
    const token = this.getAuthToken();
    if (!token) return null;

    try {
      // Decode JWT token to get user role (basic decode, not verification)
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.role || null;
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  }

  // Check if user is admin
  isAdmin() {
    return this.getUserRole() === 'admin';
  }

  // Check if user is student
  isStudent() {
    return this.getUserRole() === 'student';
  }
}

const authService = new AuthService();
export default authService;