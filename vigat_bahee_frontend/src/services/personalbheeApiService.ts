// services/baheeApiService.ts
import apiService from '../api/apiService';
import type { ReturnNetLog } from '../types/addNewEntriesInterface.types';
import type {
  BaheeEntry,
  ApiResponse,
  BaheeEntryCreateRequest,
} from '../types/bahee.types';

class BaheeApiService {
  // Bahee Details methods
  // Bahee Entries methods
  async personalCreateBaheeEntry(data: BaheeEntryCreateRequest): Promise<ApiResponse<BaheeEntry>> {
    try {
      return await apiService.post<ApiResponse<BaheeEntry>>('/personalbahee', data);
    } catch (error: any) {
      console.error('❌ Bahee Entry Creation Error:', error);
      if (error.response) {
        throw new Error(error.response.data?.message || 'Failed to create bahee entry');
      } else {
        throw new Error('Failed to create bahee entry');
      }
    }
  }

  async getPersonalAllBaheeEntries(): Promise<ApiResponse<BaheeEntry[]>> {
    try {
      return await apiService.get<ApiResponse<BaheeEntry[]>>('/personalbahee');
    } catch (error: any) {
      console.error('❌ Fetch Bahee Entries Error:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch bahee entries');
    }
  }

  async getPersonalBaheeEntriesByHeader(baheeType: string, headerName: string): Promise<ApiResponse<BaheeEntry[]>> {
    try {
      return await apiService.get<ApiResponse<BaheeEntry[]>>(`/personalbahee/${baheeType}/${headerName}`);
    } catch (error: any) {
      console.error('❌ Fetch Bahee Entries by Header Error:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch bahee entries');
    }
  } 

  async personalUpdateBaheeEntry(id: string, data: Partial<BaheeEntry>): Promise<ApiResponse<BaheeEntry>> {
    try {
      return await apiService.put<ApiResponse<BaheeEntry>>(`/personalbahee/${id}`, data);
    } catch (error: any) {
      console.error('❌ Update Bahee Entry Error:', error);
      throw new Error(error.response?.data?.message || 'Failed to update bahee entry');
    }
  }

  async personalDeleteBaheeEntry(id: string): Promise<ApiResponse<any>> {
    try {
      return await apiService.delete<ApiResponse<any>>(`/personalbahee/${id}`);
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

  async addReturnNetLog(data: ReturnNetLog): Promise<ApiResponse<ReturnNetLog>> {
    try {
      // Backend API call (if you have endpoint)
      // return await apiService.post<ApiResponse<ReturnNetLog>>('/return-net-logs', data);
      
      // For now, same as createReturnNetLog
      return await this.createReturnNetLog(data);
    } catch (error: any) {
      console.error('❌ Add Return Net Log Error:', error);
      throw new Error('Failed to add return net log');
    }
  }
}

export default new BaheeApiService();