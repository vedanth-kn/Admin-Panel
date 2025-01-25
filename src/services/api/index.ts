// services/api/index.ts
import { API_CONFIG } from './config';
import { ENDPOINTS } from './endpoints';
import type { ApiResponse, Brand, Voucher, Coupon } from './types';

class ApiService {
  private getUrl(endpoint: string): string {
    return `${API_CONFIG.BASE_URL}${API_CONFIG.API_VERSION}${endpoint}`;
  }

  private async handleResponse<T>(response: Response): Promise<ApiResponse<T>> {
    if (!response.ok) {
      try {
        const errorData = await response.json();
        const errorMessage = errorData.message || `HTTP ${response.status} - ${response.statusText}`;
        console.error('API Error:', errorMessage, errorData);
        throw new Error(errorMessage);
      } catch (err) {
        console.error('Error parsing API response:', err);
        throw new Error(`HTTP ${response.status} - ${response.statusText}`);
      }
    }
    return response.json();
  }

  // Brands API
  async getBrands(): Promise<ApiResponse<Brand[]>> {
    const response = await fetch(this.getUrl(ENDPOINTS.BRANDS.LIST), {
      method: 'GET',
      credentials: API_CONFIG.CREDENTIALS,
      headers: API_CONFIG.HEADERS,
    });
    return this.handleResponse<Brand[]>(response);
  }

  async createBrand(formData: FormData): Promise<ApiResponse<Brand>> {
    try {
      const response = await fetch(this.getUrl(ENDPOINTS.BRANDS.CREATE), {
        method: 'POST',
        credentials: API_CONFIG.CREDENTIALS,
        headers: API_CONFIG.HEADERS,
        body: formData
      });
      return this.handleResponse<Brand>(response);
    } catch (error) {
      console.error('Create Brand Error:', error);
      throw error;
    }
  }

  async updateBrand(id: string, formData: FormData): Promise<ApiResponse<Brand>> {
    const response = await fetch(this.getUrl(ENDPOINTS.BRANDS.UPDATE(id)), {
      method: 'PUT',
      credentials: API_CONFIG.CREDENTIALS,
      body: formData,
    });
    return this.handleResponse<Brand>(response);
  }

  async deleteBrand(id: string): Promise<ApiResponse<void>> {
    const response = await fetch(this.getUrl(ENDPOINTS.BRANDS.DELETE(id)), {
      method: 'DELETE',
      credentials: API_CONFIG.CREDENTIALS,
      headers: API_CONFIG.HEADERS,
    });
    return this.handleResponse<void>(response);
  }

  // Vouchers API
  async getVouchers(): Promise<ApiResponse<Voucher[]>> {
    const response = await fetch(this.getUrl(ENDPOINTS.VOUCHERS.LIST), {
      method: 'GET',
      credentials: API_CONFIG.CREDENTIALS,
      headers: API_CONFIG.HEADERS,
    });
    return this.handleResponse<Voucher[]>(response);
  }

  async createVouchers(formData: FormData): Promise<ApiResponse<Voucher>> {
    try {
      const response = await fetch(this.getUrl(ENDPOINTS.VOUCHERS.CREATE), {
        method: 'POST',
        credentials: API_CONFIG.CREDENTIALS,
        headers: API_CONFIG.HEADERS,
        body: formData
      });
      return this.handleResponse<Voucher>(response);
    } catch (error) {
      console.error('Create Voucher Error:', error);
      throw error;
    }
  }

  async creatCoupons(formData: FormData): Promise<ApiResponse<Coupon>> {
    try {
      const response = await fetch(this.getUrl(ENDPOINTS.COUPONS.CREATE), {
        method: 'POST',
        credentials: API_CONFIG.CREDENTIALS,
        headers: API_CONFIG.HEADERS,
        body: formData
      });
      return this.handleResponse<Coupon>(response);
    } catch (error) {
      console.error('Create Voucher Error:', error);
      throw error;
    }
  }
}

export const apiService = new ApiService();
export { ENDPOINTS, API_CONFIG };