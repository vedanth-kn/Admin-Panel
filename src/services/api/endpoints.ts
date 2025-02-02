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
      LIST: '/1/voucher',
      CREATE: '/1/voucher',
      UPDATE: '/1/voucher',
      DELETE: (id: string) => `/1/voucher/${id}`,
    },
    COUPONS: {
      CREATE: '/coupon',
    },
  };