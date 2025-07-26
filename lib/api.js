const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  // Get auth token from localStorage
  getAuthToken() {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('token');
    }
    return null;
  }

  // Set auth token in localStorage
  setAuthToken(token) {
    if (typeof window !== 'undefined') {
      localStorage.setItem('token', token);
    }
  }

  // Remove auth token from localStorage
  removeAuthToken() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
    }
  }

  // Generic request method
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const token = this.getAuthToken();

    console.log('🔍 API Request Debug:', {
      url,
      method: options.method || 'GET',
      hasToken: !!token,
      tokenPreview: token ? `${token.substring(0, 20)}...` : 'No token'
    });

    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    };

    try {
      console.log('🚀 Making API request to:', url);
      console.log('🚀 Request config:', {
        method: config.method || 'GET',
        headers: config.headers,
        bodyPreview: config.body ? config.body.substring(0, 200) + '...' : 'No body'
      });

      const response = await fetch(url, config);
      
      console.log('📡 Raw response received:', {
        status: response.status,
        statusText: response.statusText,
        ok: response.ok,
        headers: Object.fromEntries(response.headers.entries())
      });

      let data;
      try {
        data = await response.json();
        console.log('📡 Parsed response data:', data);
      } catch (parseError) {
        console.error('❌ Failed to parse response as JSON:', parseError);
        const textResponse = await response.text();
        console.error('❌ Raw response text:', textResponse);
        throw new Error('Invalid JSON response from server');
      }

      console.log('📡 API Response Debug:', {
        status: response.status,
        ok: response.ok,
        success: data.success,
        hasData: !!data.data
      });

      if (!response.ok) {
        console.error('❌ API Error Response:', {
          status: response.status,
          statusText: response.statusText,
          data: data,
          errors: data.errors
        });
        const error = new Error(data.message || 'Something went wrong');
        error.response = { data, status: response.status };
        throw error;
      }

      return data;
    } catch (error) {
      console.error('❌ API Request Error:', error);
      console.error('❌ Error type:', typeof error);
      console.error('❌ Error name:', error.name);
      console.error('❌ Error message:', error.message);
      if (error.response) {
        console.error('❌ Error response:', error.response);
      }
      throw error;
    }
  }

  // GET request
  async get(endpoint) {
    return this.request(endpoint, { method: 'GET' });
  }

  // POST request
  async post(endpoint, data) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // PUT request
  async put(endpoint, data) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  // DELETE request
  async delete(endpoint) {
    return this.request(endpoint, { method: 'DELETE' });
  }

  // Authentication methods
  async login(email, password) {
    try {
      const response = await this.post('/auth/login', { email, password });
      if (response.success && response.token) {
        this.setAuthToken(response.token);
      }
      return response;
    } catch (error) {
      console.error('Login API error:', error);
      throw error;
    }
  }

  async register(userData) {
    try {
      const response = await this.post('/auth/register', userData);
      if (response.success && response.token) {
        this.setAuthToken(response.token);
      }
      return response;
    } catch (error) {
      console.error('Register API error:', error);
      throw error;
    }
  }

  async logout() {
    this.removeAuthToken();
    return { success: true };
  }

  async getCurrentUser() {
    try {
      return await this.get('/auth/me');
    } catch (error) {
      console.error('Get current user error:', error);
      throw error;
    }
  }

  async updateProfile(userData) {
    try {
      return await this.put('/auth/profile', userData);
    } catch (error) {
      console.error('Update profile error:', error);
      throw error;
    }
  }

  // Announcements methods
  async getAnnouncements(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.get(`/announcements${queryString ? `?${queryString}` : ''}`);
  }

  async getAnnouncement(id) {
    return this.get(`/announcements/${id}`);
  }

  async createAnnouncement(data) {
    return this.post('/announcements', data);
  }

  async updateAnnouncement(id, data) {
    return this.put(`/announcements/${id}`, data);
  }

  async deleteAnnouncement(id) {
    return this.delete(`/announcements/${id}`);
  }

  async likeAnnouncement(id) {
    return this.post(`/announcements/${id}/like`);
  }

  // Complaints methods
  async getComplaints(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.get(`/complaints${queryString ? `?${queryString}` : ''}`);
  }

  async getComplaint(id) {
    return this.get(`/complaints/${id}`);
  }

  async createComplaint(data) {
    return this.post('/complaints', data);
  }

  async updateComplaintStatus(id, status, adminResponse) {
    return this.put(`/complaints/${id}/status`, { status, adminResponse });
  }

  async upvoteComplaint(id) {
    return this.post(`/complaints/${id}/upvote`);
  }

  async addComplaintComment(id, message) {
    return this.post(`/complaints/${id}/comments`, { message });
  }

  async getComplaintStats() {
    return this.get('/complaints/stats/overview');
  }

  // Lost & Found methods
  async getLostFoundItems(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.get(`/lost-found${queryString ? `?${queryString}` : ''}`);
  }

  async getLostFoundItem(id) {
    return this.get(`/lost-found/${id}`);
  }

  async createLostFoundItem(data) {
    return this.post('/lost-found', data);
  }

  async updateLostFoundItem(id, data) {
    return this.put(`/lost-found/${id}`, data);
  }

  async claimLostFoundItem(id) {
    return this.post(`/lost-found/${id}/claim`);
  }

  async verifyLostFoundReturn(id, verificationCode) {
    return this.post(`/lost-found/${id}/verify`, { verificationCode });
  }

  async deleteLostFoundItem(id) {
    return this.delete(`/lost-found/${id}`);
  }

  // Timetable methods
  async getTimetables(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.get(`/timetable${queryString ? `?${queryString}` : ''}`);
  }

  async getTimetable(id) {
    return this.get(`/timetable/${id}`);
  }

  async createTimetable(data) {
    return this.post('/timetable', data);
  }

  async updateTimetable(id, data) {
    return this.put(`/timetable/${id}`, data);
  }

  async deleteTimetable(id) {
    return this.delete(`/timetable/${id}`);
  }

  async getCurrentUserTimetable() {
    return this.get('/timetable/my/current');
  }

  async getDepartments() {
    return this.get('/timetable/departments/list');
  }

  // Users methods (Admin only)
  async getUsers(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.get(`/users${queryString ? `?${queryString}` : ''}`);
  }

  async getUser(id) {
    return this.get(`/users/${id}`);
  }

  async updateUser(id, data) {
    return this.put(`/users/${id}`, data);
  }

  async deleteUser(id) {
    return this.delete(`/users/${id}`);
  }

  async getUserStats() {
    return this.get('/users/stats/overview');
  }
}

// Create and export a singleton instance
const apiService = new ApiService();
export default apiService;