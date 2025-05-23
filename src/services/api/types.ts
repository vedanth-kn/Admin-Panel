// services/api/types.ts
export interface ApiResponse<T> {
    success: boolean;
    data: T;
    errorCode: string | null;
    errorMessage: string | null;
  }

  export interface SendOTP {
    id: string;
    phoneNumber: number;
  }
  
  export interface UserData {
    username: string;
    email: string;
    user_id: number;
    first_name: string;
    last_name: string;
    phone_number: string;
    gender: string;
    profile_picture: string;
    date_of_birth: string
  }
  
  export interface VerifyOTP {
    token: string;
    tokenType: string;
    user: UserData;
    expires_in: number;
  }

  export interface MediaDetail {
    display_type: string;
    file_name: string;
    media_url: string;
  }

  export interface User {
    id: string;
    username: string;
    email: string;
    first_name: string;
    last_name: string;
    profile_picture: MediaDetail[];
    date_of_birth: Date;
    gender: string;
    address: string;
    city: string;
    state: string;
    country: string;
    zip_code: string;
  }
  
  export interface Brand {
    id: string;
    name: string;
    description: string;
    website_url: string;
    business_category: string;
    active: boolean; 
    media_details?: MediaDetail[];
    createdAt?: string;
    updatedAt?: string;
}
  
  export interface Voucher {
    id: string;
    brand_id: string;
    name: string;
    full_offer_description: string;
    pre_offer_description: string;
    voucher_url: string;
    start_date_time: Date | string;
    end_date_time: Date | string;
    coins_to_redeem: number; 
    voucher_type: string;
    media_details?: MediaDetail[]; 
    usage_limit?: number;
    used_count?: number;
    active: boolean;
    terms_and_conditions?: string[]; 
    how_to_avail?: string[]; 
    createdAt: Date | string; 
    updatedAt: Date | string;
  }

  export interface Coupon {
    id: string;
    voucher_id: string;
    coupon_codes: number[];
  }
  

  export interface Milestone {
    id: string;
    name: string;
    description: string;
    target_value: number;
    reward_coins: number;
    milestone_type: string;
    start_time: Date | string;
    end_time: Date | string;
    active: boolean;
  }