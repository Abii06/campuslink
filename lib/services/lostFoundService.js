import apiService from '../api';

class LostFoundService {
  // Get all lost and found items with filters
  async getLostFoundItems(filters = {}) {
    try {
      const params = new URLSearchParams();
      
      // Add filters to params
      if (filters.page) params.append('page', filters.page);
      if (filters.limit) params.append('limit', filters.limit);
      if (filters.type) params.append('type', filters.type);
      if (filters.category) params.append('category', filters.category);
      if (filters.status) params.append('status', filters.status);
      if (filters.search) params.append('search', filters.search);
      if (filters.my) params.append('my', filters.my);

      const queryString = params.toString();
      const endpoint = `/lost-found${queryString ? `?${queryString}` : ''}`;
      
      return await apiService.get(endpoint);
    } catch (error) {
      console.error('Get lost found items error:', error);
      throw error;
    }
  }

  // Get single lost/found item by ID
  async getLostFoundItemById(id) {
    try {
      return await apiService.get(`/lost-found/${id}`);
    } catch (error) {
      console.error('Get lost found item error:', error);
      throw error;
    }
  }

  // Create new lost/found item
  async createLostFoundItem(itemData) {
    try {
      const data = {
        title: itemData.title,
        description: itemData.description,
        type: itemData.type, // 'lost' or 'found'
        category: itemData.category,
        itemName: itemData.itemName,
        location: itemData.location,
        dateTime: itemData.dateTime,
        isReward: itemData.isReward || false,
        rewardAmount: itemData.rewardAmount || 0
      };

      // Only add brand and color if they have values
      if (itemData.brand && itemData.brand.trim() !== '') {
        data.brand = itemData.brand.trim();
      }
      if (itemData.color && itemData.color.trim() !== '') {
        data.color = itemData.color.trim();
      }

      // Only add contactInfo if we have valid contact information
      const contactInfo = {};
      if (itemData.contactInfo?.email && itemData.contactInfo.email.trim() !== '') {
        contactInfo.email = itemData.contactInfo.email.trim();
      }
      if (itemData.contactInfo?.phone && itemData.contactInfo.phone.trim() !== '') {
        contactInfo.phone = itemData.contactInfo.phone.trim();
      }
      
      // Only add contactInfo to data if it has at least one field
      if (Object.keys(contactInfo).length > 0) {
        data.contactInfo = contactInfo;
      }

      // Add images if provided
      if (itemData.images && Array.isArray(itemData.images) && itemData.images.length > 0) {
        data.images = itemData.images;
      }

      console.log('🔍 LostFoundService - Sending data to API:', JSON.stringify(data, null, 2));
      console.log('🔍 LostFoundService - Original itemData:', JSON.stringify(itemData, null, 2));

      return await apiService.post('/lost-found', data);
    } catch (error) {
      console.error('Create lost found item error:', error);
      throw error;
    }
  }

  // Update lost/found item (Owner only)
  async updateLostFoundItem(id, itemData) {
    try {
      const data = {
        title: itemData.title,
        description: itemData.description,
        location: itemData.location,
        contactInfo: itemData.contactInfo,
        status: itemData.status
      };

      return await apiService.put(`/lost-found/${id}`, data);
    } catch (error) {
      console.error('Update lost found item error:', error);
      throw error;
    }
  }

  // Claim a lost/found item
  async claimItem(id) {
    try {
      return await apiService.post(`/lost-found/${id}/claim`);
    } catch (error) {
      console.error('Claim item error:', error);
      throw error;
    }
  }

  // Verify item return with verification code (Owner only)
  async verifyReturn(id, verificationCode) {
    try {
      const data = { verificationCode };
      return await apiService.post(`/lost-found/${id}/verify`, data);
    } catch (error) {
      console.error('Verify return error:', error);
      throw error;
    }
  }

  // Delete lost/found item (Owner only)
  async deleteLostFoundItem(id) {
    try {
      return await apiService.delete(`/lost-found/${id}`);
    } catch (error) {
      console.error('Delete lost found item error:', error);
      throw error;
    }
  }

  // Get my lost/found items
  async getMyItems(page = 1, limit = 10) {
    try {
      return await this.getLostFoundItems({ my: true, page, limit });
    } catch (error) {
      console.error('Get my items error:', error);
      throw error;
    }
  }

  // Get lost items only
  async getLostItems(page = 1, limit = 10) {
    try {
      return await this.getLostFoundItems({ type: 'lost', page, limit });
    } catch (error) {
      console.error('Get lost items error:', error);
      throw error;
    }
  }

  // Get found items only
  async getFoundItems(page = 1, limit = 10) {
    try {
      return await this.getLostFoundItems({ type: 'found', page, limit });
    } catch (error) {
      console.error('Get found items error:', error);
      throw error;
    }
  }

  // Get items by category
  async getItemsByCategory(category, page = 1, limit = 10) {
    try {
      return await this.getLostFoundItems({ category, page, limit });
    } catch (error) {
      console.error('Get items by category error:', error);
      throw error;
    }
  }

  // Search items
  async searchItems(searchTerm, page = 1, limit = 10) {
    try {
      return await this.getLostFoundItems({ search: searchTerm, page, limit });
    } catch (error) {
      console.error('Search items error:', error);
      throw error;
    }
  }

  // Get active items (not claimed/returned)
  async getActiveItems(page = 1, limit = 10) {
    try {
      return await this.getLostFoundItems({ status: 'active', page, limit });
    } catch (error) {
      console.error('Get active items error:', error);
      throw error;
    }
  }

  // Get claimed items
  async getClaimedItems(page = 1, limit = 10) {
    try {
      return await this.getLostFoundItems({ status: 'claimed', page, limit });
    } catch (error) {
      console.error('Get claimed items error:', error);
      throw error;
    }
  }

  // Get returned items
  async getReturnedItems(page = 1, limit = 10) {
    try {
      return await this.getLostFoundItems({ status: 'returned', page, limit });
    } catch (error) {
      console.error('Get returned items error:', error);
      throw error;
    }
  }
}

const lostFoundService = new LostFoundService();
export default lostFoundService;