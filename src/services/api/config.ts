// services/api/config.ts
export const API_CONFIG = {
    BASE_URL: process.env.NEXT_PUBLIC_API_URL,
    API_VERSION: '/zogg/api/v1',
    TIMEOUT: 30000,
    CREDENTIALS: 'include' as RequestCredentials,
    HEADERS: {
      'Authorization': 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiI2MzY0NjQ0MDU2IiwiaWF0IjoxNzM3NzkwMTM4LCJleHAiOjE3MzkxMDQxMzh9.238SWcvdYtDAoDPwXXMnyRAUIRudkiY3TQqPBXOtEB0',
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
  };