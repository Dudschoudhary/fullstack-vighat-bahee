// services/baheeApiService.ts
import apiService from '../api/apiService';
import type {
  BaheeDetails,
  BaheeEntry,
  ApiResponse,
  BaheeDetailsCreateRequest,
  BaheeEntryCreateRequest,
  ReturnNetLog
} from '../types/bahee.types';

class BaheeApiService {
  // Bahee Details methods
  async createBaheeDetails(data: BaheeDetailsCreateRequest): Promise<ApiResponse<BaheeDetails>> {
    try {
      console.log('🔥 Creating Bahee Details:', data);
      return await apiService.post<ApiResponse<BaheeDetails>>('/bahee-details', data);
    } catch (error: any) {
      console.error('❌ Bahee Details Creation Error:', error);
      if (error.response) {
        throw new Error(error.response.data?.message || 'Failed to create bahee details');
      } else if (error.request) {
        throw new Error('सर्वर से कनेक्शन नहीं हो पा रहा। कृपया सर्वर चालू करें।');
      } else {
        throw new Error(error.message || 'Unknown error occurred');
      }
    }
  }

  async getAllBaheeDetails(): Promise<ApiResponse<BaheeDetails[]>> {
    try {
      console.log('📋 Fetching All Bahee Details');
      return await apiService.get<ApiResponse<BaheeDetails[]>>('/bahee-details');
    } catch (error: any) {
      console.error('❌ Fetch Bahee Details Error:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch bahee details');
    }
  }

  async getBaheeDetailsByType(baheeType: string): Promise<ApiResponse<BaheeDetails[]>> {
    try {
      console.log('📋 Fetching Bahee Details by Type:', baheeType);
      return await apiService.get<ApiResponse<BaheeDetails[]>>(`/bahee-details/${baheeType}`);
    } catch (error: any) {
      console.error('❌ Fetch Bahee Details by Type Error:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch bahee details');
    }
  }

  async updateBaheeDetails(id: string, data: Partial<BaheeDetails>): Promise<ApiResponse<BaheeDetails>> {
    try {
      console.log('🔄 Updating Bahee Details:', { id, data });
      return await apiService.put<ApiResponse<BaheeDetails>>(`/bahee-details/${id}`, data);
    } catch (error: any) {
      console.error('❌ Update Bahee Details Error:', error);
      throw new Error(error.response?.data?.message || 'Failed to update bahee details');
    }
  }

  async deleteBaheeDetails(id: string): Promise<ApiResponse<any>> {
    try {
      console.log('🗑️ Deleting Bahee Details:', id);
      return await apiService.delete<ApiResponse<any>>(`/bahee-details/${id}`);
    } catch (error: any) {
      console.error('❌ Delete Bahee Details Error:', error);
      throw new Error(error.response?.data?.message || 'Failed to delete bahee details');
    }
  }

  // Bahee Entries methods
  async createBaheeEntry(data: BaheeEntryCreateRequest): Promise<ApiResponse<BaheeEntry>> {
    try {
      console.log('🔥 Creating Bahee Entry:', data);
      return await apiService.post<ApiResponse<BaheeEntry>>('/bahee-entries', data);
    } catch (error: any) {
      console.error('❌ Bahee Entry Creation Error:', error);
      if (error.response) {
        throw new Error(error.response.data?.message || 'Failed to create bahee entry');
      } else {
        throw new Error('Failed to create bahee entry');
      }
    }
  }

  async getAllBaheeEntries(): Promise<ApiResponse<BaheeEntry[]>> {
    try {
      console.log('📋 Fetching All Bahee Entries');
      return await apiService.get<ApiResponse<BaheeEntry[]>>('/bahee-entries');
    } catch (error: any) {
      console.error('❌ Fetch Bahee Entries Error:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch bahee entries');
    }
  }

  async getBaheeEntriesByHeader(baheeType: string, headerName: string): Promise<ApiResponse<BaheeEntry[]>> {
    try {
      console.log('📋 Fetching Bahee Entries by Header:', { baheeType, headerName });
      return await apiService.get<ApiResponse<BaheeEntry[]>>(`/bahee-entries/${baheeType}/${headerName}`);
    } catch (error: any) {
      console.error('❌ Fetch Bahee Entries by Header Error:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch bahee entries');
    }
  }

  async updateBaheeEntry(id: string, data: Partial<BaheeEntry>): Promise<ApiResponse<BaheeEntry>> {
    try {
      console.log('🔄 Updating Bahee Entry:', { id, data });
      return await apiService.put<ApiResponse<BaheeEntry>>(`/bahee-entries/${id}`, data);
    } catch (error: any) {
      console.error('❌ Update Bahee Entry Error:', error);
      throw new Error(error.response?.data?.message || 'Failed to update bahee entry');
    }
  }

  async deleteBaheeEntry(id: string): Promise<ApiResponse<any>> {
    try {
      console.log('🗑️ Deleting Bahee Entry:', id);
      return await apiService.delete<ApiResponse<any>>(`/bahee-entries/${id}`);
    } catch (error: any) {
      console.error('❌ Delete Bahee Entry Error:', error);
      throw new Error(error.response?.data?.message || 'Failed to delete bahee entry');
    }
  }

  // Return Net Logs methods (placeholder - you may need to implement backend)
  async getAllReturnNetLogs(): Promise<ApiResponse<ReturnNetLog[]>> {
    try {
      // For now, get from localStorage
      const logs = JSON.parse(localStorage.getItem('returnNetLogs') || '[]');
      return { success: true, data: logs };
    } catch (error: any) {
      console.error('❌ Fetch Return Net Logs Error:', error);
      return { success: false, data: [] };
    }
  }

  async createReturnNetLog(data: ReturnNetLog): Promise<ApiResponse<ReturnNetLog>> {
    try {
      // For now, this is a placeholder - you may need to implement backend endpoint
      return { success: true, data };
    } catch (error: any) {
      console.error('❌ Create Return Net Log Error:', error);
      throw new Error('Failed to create return net log');
    }
  }
}

export default new BaheeApiService();