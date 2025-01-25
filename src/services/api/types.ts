// services/api/types.ts
export interface ApiResponse<T> {
    success: boolean;
    data: T;
    errorCode: string | null;
    errorMessage: string | null;
  }

  export interface MediaDetail {
    display_type: string;
    file_name: string;
    media_url: string;
  }
  
  export interface Brand {
    id: string;
    name: string;
    description: string;
    website_url: string;
    business_category: string;
    mediaDetails?: MediaDetail[];
  }
  
  export interface Voucher {
    id: string;
    brand_id: string;
    name: string;
    description: string;
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
  