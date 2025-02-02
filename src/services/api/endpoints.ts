// services/api/endpoints.ts

export const ENDPOINTS = {
    AUTH: {
      LOGIN: '/auth/login',
      LOGOUT: '/auth/logout',
      REGISTER: '/auth/register',
      SEND_OTP: '/auth/send-otp',
      VERIFY_OTP: '/auth/verify-otp',
    },

    BRANDS: {
      LIST: '/brand',
      CREATE: '/brand',
      UPDATE: '/brand',
      DELETE: (id: string) => `/brand/${id}`,
    },
    
    VOUCHERS: {
      LIST: (userId: number) => `/${userId}/voucher`,
      CREATE: (userId: number) => `/${userId}/voucher`,
      UPDATE: (userId: number) => `/${userId}/voucher`,
      DELETE: (userId: number, voucherId: string) => `/${userId}/voucher/${voucherId}`,
    },

    COUPONS: {
      CREATE: '/coupon',
    },
  };