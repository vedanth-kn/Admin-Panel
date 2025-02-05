// services/api/index.ts
import { API_CONFIG } from './config';
import { ENDPOINTS } from './endpoints';
import Cookies from 'js-cookie';
import type { ApiResponse, Brand, Voucher, Coupon, SendOTP, VerifyOTP, UserData, Milestone, User } from './types';

class ApiService {
  private getUrl(endpoint: string, queryParams?: Record<string, string>): string {
    const baseUrl = `${API_CONFIG.BASE_URL}${API_CONFIG.API_VERSION}${endpoint}`;
    
    if (!queryParams) {
      return baseUrl;
    }

    const searchParams = new URLSearchParams();
    Object.entries(queryParams).forEach(([key, value]) => {
      searchParams.append(key, value);
    });

    return `${baseUrl}?${searchParams.toString()}`;
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

    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('text/plain')) {
      const textResponse = await response.text();
      return {
        success: response.ok,
        data: textResponse as any,
        errorCode: null,
        errorMessage: null
      };
    }

    return response.json();
  }

  private setAuthCookies(token: string, user: UserData) {
    // Set auth token cookie with 7 days expiry
    Cookies.set('auth_token', token, {
      expires: 7,
      path: '/',
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict'
    });
  
    // Store complete user data
    const userData: UserData = {
      username: user.username || '',
      email: user.email || '',
      user_id: user.user_id || 0,
      first_name: user.first_name || '',
      last_name: user.last_name || '',
      phone_number: user.phone_number || ''
    };
  
    Cookies.set('user', JSON.stringify(userData), {
      expires: 7,
      path: '/',
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict'
    });
  
    // Log the stored data for debugging
    console.log('Stored user data:', userData);
  }

  private clearAuthCookies() {
    Cookies.remove('auth_token', { path: '/' });
    Cookies.remove('user', { path: '/' });
  }

  //Authh
  async sendOTP(phoneNumber: string): Promise<ApiResponse<SendOTP>> {
    try {
      // Create FormData and append phone_number
      const formData = new FormData();
      formData.append('phone_number', phoneNumber);

      // Log what's being sent
      console.log('Sending OTP request to:', ENDPOINTS.AUTH.SEND_OTP);
      console.log('FormData:', Array.from(formData.entries()));

      const response = await fetch(`${this.getUrl(ENDPOINTS.AUTH.SEND_OTP)}`, {
        method: 'POST',
        credentials: API_CONFIG.CREDENTIALS,
        body: formData  // Send as FormData
      });

      return this.handleResponse<SendOTP>(response);
    } catch (error) {
      console.error('Send OTP Error:', error);
      throw error;
    }
  }

  async verifyOTP(data: { phone_number: string; otp: string }): Promise<ApiResponse<VerifyOTP>> {
    try {
      const response = await fetch(this.getUrl(ENDPOINTS.AUTH.VERIFY_OTP), {
        method: 'POST',
        credentials: API_CONFIG.CREDENTIALS,
        headers: {
          ...API_CONFIG.getHeaders(),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
      });

      const result = await this.handleResponse<VerifyOTP>(response);

      // Log the API response for debugging
      console.log('Verify OTP Response:', result);

      // If verification successful, set auth cookies
      if (result.success && result.data?.token && result.data?.user) {
        this.setAuthCookies(result.data.token, result.data.user);
        
        // Log the stored cookies for debugging
        console.log('Auth Token Cookie:', Cookies.get('auth_token'));
        console.log('User Cookie:', Cookies.get('user'));
      }

      return result;
    } catch (error) {
      console.error('Verify OTP Error:', error);
      throw error;
    }
  }

  async logout(): Promise<void> {
    try {
      // Call logout endpoint if you have one
      await fetch(this.getUrl(ENDPOINTS.AUTH.LOGOUT), {
        method: 'POST',
        credentials: API_CONFIG.CREDENTIALS,
        headers: API_CONFIG.getHeaders(),
      });

      // Clear cookies
      this.clearAuthCookies();
      
      // Redirect to login page
      window.location.href = '/login';
    } catch (error) {
      console.error('Logout Error:', error);
      throw error;
    }
  }

  // Helper methods to check auth status
  isAuthenticated(): boolean {
    return !!Cookies.get('auth_token');
  }

  getUser(): UserData | null {
    try {
      const userStr = Cookies.get('user');
      if (!userStr) return null;
      
      const userData = JSON.parse(userStr);
      return {
        username: userData.username || '',
        email: userData.email || '',
        user_id: userData.user_id || 0,
        first_name: userData.first_name || '',
        last_name: userData.last_name || '',
        phone_number: userData.phone_number || ''
      };
    } catch (error) {
      console.error('Error parsing user data:', error);
      return null;
    }
  }

  getAuthToken(): string | undefined {
    return Cookies.get('auth_token');
  }

  private getUserId(): number {
    const user = this.getUser();
    if (!user || !user.user_id) {
      throw new Error('User ID not found. Please login again.');
    }
    return user.user_id;
  }

  // User API
  // async getUsers(): Promise<ApiResponse<User[]>> {
  //   const response = await fetch(this.getUrl(ENDPOINTS.USERS.LIST), {
  //     method: 'GET',
  //     credentials: API_CONFIG.CREDENTIALS,
  //     headers: API_CONFIG.getHeaders(),
  //   });
  //   return this.handleResponse<User[]>(response);
  // }

  async createUser(formData: FormData): Promise<ApiResponse<User>> {
    try {
      const response = await fetch(this.getUrl(ENDPOINTS.AUTH.REGISTER), {
        method: 'POST',
        credentials: API_CONFIG.CREDENTIALS,
        headers: API_CONFIG.getHeaders(),
        body: formData
      });
      return this.handleResponse<User>(response);
    } catch (error) {
      console.error('Create User Error:', error);
      throw error;
    }
  }

  // async updateUser(id: string, formData: FormData): Promise<ApiResponse<User>> {
  //   // Since we're sending JSON, we need to ensure the content type is set correctly
  //   const response = await fetch(this.getUrl(ENDPOINTS.USERS.UPDATE), {
  //     method: 'PUT',
  //     credentials: API_CONFIG.CREDENTIALS,
  //     headers: API_CONFIG.getHeaders(),
  //     body: JSON.stringify({
  //       id: id,
  //       ...JSON.parse(formData as unknown as string) // Since formData is already a JSON string in your code
  //     })
  //   });
  //   return this.handleResponse<User>(response);
  // }

  // async softDeleteUser(id: string): Promise<ApiResponse<void>> {
  //   const response = await fetch(this.getUrl(ENDPOINTS.USERS.DELETE(id)), {
  //     method: 'DELETE',
  //     credentials: API_CONFIG.CREDENTIALS,
  //     headers: API_CONFIG.getHeaders()
  //   });
  //   return this.handleResponse<void>(response);
  // }

  // Brands API
  async getBrands(): Promise<ApiResponse<Brand[]>> {
    const response = await fetch(this.getUrl(ENDPOINTS.BRANDS.LIST), {
      method: 'GET',
      credentials: API_CONFIG.CREDENTIALS,
      headers: API_CONFIG.getHeaders(),
    });
    return this.handleResponse<Brand[]>(response);
  }

  async createBrand(formData: FormData): Promise<ApiResponse<Brand>> {
    try {
      const response = await fetch(this.getUrl(ENDPOINTS.BRANDS.CREATE), {
        method: 'POST',
        credentials: API_CONFIG.CREDENTIALS,
        headers: API_CONFIG.getHeaders(),
        body: formData
      });
      return this.handleResponse<Brand>(response);
    } catch (error) {
      console.error('Create Brand Error:', error);
      throw error;
    }
  }

  async updateBrand(id: string, formData: FormData): Promise<ApiResponse<Brand>> {
    // Since we're sending JSON, we need to ensure the content type is set correctly
    const response = await fetch(this.getUrl(ENDPOINTS.BRANDS.UPDATE), {
      method: 'PUT',
      credentials: API_CONFIG.CREDENTIALS,
      headers: API_CONFIG.getHeaders(),
      body: JSON.stringify({
        id: id,
        ...JSON.parse(formData as unknown as string) // Since formData is already a JSON string in your code
      })
    });
    return this.handleResponse<Brand>(response);
  }

  async softDeleteBrand(id: string): Promise<ApiResponse<void>> {
    const response = await fetch(this.getUrl(ENDPOINTS.BRANDS.DELETE(id)), {
      method: 'DELETE',
      credentials: API_CONFIG.CREDENTIALS,
      headers: API_CONFIG.getHeaders()
    });
    return this.handleResponse<void>(response);
  }

  // Vouchers API
  async getVouchers(): Promise<ApiResponse<Voucher[]>> {
    const userId = this.getUserId();
    const response = await fetch(this.getUrl(ENDPOINTS.VOUCHERS.LIST(userId)), {
      method: 'GET',
      credentials: API_CONFIG.CREDENTIALS,
      headers: API_CONFIG.getHeaders(),
    });
    return this.handleResponse<Voucher[]>(response);
  }

  async createVouchers(formData: FormData): Promise<ApiResponse<Voucher>> {
    try {
      const userId = this.getUserId();
      const response = await fetch(this.getUrl(ENDPOINTS.VOUCHERS.CREATE(userId)), {
        method: 'POST',
        credentials: API_CONFIG.CREDENTIALS,
        headers: API_CONFIG.getHeaders(),
        body: formData
      });
      return this.handleResponse<Voucher>(response);
    } catch (error) {
      console.error('Create Voucher Error:', error);
      throw error;
    }
  }

  async updateVoucher(id: string, formData: FormData): Promise<ApiResponse<Brand>> {
    const userId = this.getUserId();
    const response = await fetch(this.getUrl(ENDPOINTS.VOUCHERS.UPDATE(userId)), {
      method: 'PUT',
      credentials: API_CONFIG.CREDENTIALS,
      headers: API_CONFIG.getHeaders(),
      body: JSON.stringify({
        id: id,
        ...JSON.parse(formData as unknown as string) // Since formData is already a JSON string in your code
      })
    });
    return this.handleResponse<Brand>(response);
  }

  async softDeleteVoucher(id: string): Promise<ApiResponse<void>> {
    const userId = this.getUserId();
    const response = await fetch(this.getUrl(ENDPOINTS.VOUCHERS.DELETE(userId, id)), {
      method: 'DELETE',
      credentials: API_CONFIG.CREDENTIALS,
      headers: API_CONFIG.getHeaders()
    });
    return this.handleResponse<void>(response);
  }

  async creatCoupons(formData: FormData): Promise<ApiResponse<Coupon>> {
    try {
      const response = await fetch(this.getUrl(ENDPOINTS.COUPONS.CREATE), {
        method: 'POST',
        credentials: API_CONFIG.CREDENTIALS,
        headers: API_CONFIG.getHeaders(),
        body: formData
      });
      return this.handleResponse<Coupon>(response);
    } catch (error) {
      console.error('Create Coupone Error:', error);
      throw error;
    }
  }

  async getMilestones(): Promise<ApiResponse<Milestone[]>> {
    const response = await fetch(this.getUrl(ENDPOINTS.MILESTONES.LIST), {
      method: 'GET',
      credentials: API_CONFIG.CREDENTIALS,
      headers: API_CONFIG.getHeaders(),
    });
    return this.handleResponse<Milestone[]>(response);
  }

  async createMilestone(formData: FormData): Promise<ApiResponse<Milestone>> {
    try {
      const response = await fetch(this.getUrl(ENDPOINTS.MILESTONES.CREATE), {
        method: 'POST',
        credentials: API_CONFIG.CREDENTIALS,
        headers: API_CONFIG.getHeaders(),
        body: formData
      });
      return this.handleResponse<Milestone>(response)
    } catch (error) {
      console.error('Create Milestone Error:', error)
      throw error;
    }
  }

  async updateMilestone(id: string, formData: FormData): Promise<ApiResponse<Milestone>> {
    // Since we're sending JSON, we need to ensure the content type is set correctly
    const response = await fetch(this.getUrl(ENDPOINTS.MILESTONES.UPDATE), {
      method: 'PUT',
      credentials: API_CONFIG.CREDENTIALS,
      headers: API_CONFIG.getHeaders(),
      body: JSON.stringify({
        id: id,
        ...JSON.parse(formData as unknown as string) // Since formData is already a JSON string in your code
      })
    });
    return this.handleResponse<Milestone>(response);
  }

  async softDeleteMilestone(id: string): Promise<ApiResponse<void>> {
    const response = await fetch(this.getUrl(ENDPOINTS.MILESTONES.DELETE(id)), {
      method: 'DELETE',
      credentials: API_CONFIG.CREDENTIALS,
      headers: API_CONFIG.getHeaders()
    });
    return this.handleResponse<void>(response);
  }

  
}

export const apiService = new ApiService();
export { ENDPOINTS, API_CONFIG };