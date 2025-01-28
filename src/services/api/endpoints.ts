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
      UPDATE: (id: string) => `/brand/${id}`,
      DELETE: (id: string) => `/brand/${id}`,
      GET_ONE: (id: string) => `/brand/${id}`,
    },
    VOUCHERS: {
      LIST: '/1/voucher',
      CREATE: '/1/voucher',
      UPDATE: (id: string) => `/voucher/${id}`,
      DELETE: (id: string) => `/voucher/${id}`,
      GET_ONE: (id: string) => `/voucher/${id}`,
    },
    COUPONS: {
      CREATE: '/coupon',
    },
  };