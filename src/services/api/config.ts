// services/api/config.ts
export const API_CONFIG = {
    BASE_URL: process.env.NEXT_PUBLIC_API_URL,
    API_VERSION: '/zogg/api/v1',
    TIMEOUT: 30000,
    CREDENTIALS: 'include' as RequestCredentials,
    HEADERS: {
      'Authorization': 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiI5NzM5NTI2NDE1IiwiaWF0IjoxNzM3ODc3Mjc1LCJleHAiOjE3MzkxOTEyNzV9.Ysz-M-JjZxOfuhOg9OOLVeh8HorRaZaLsBZOKR67jyA',
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
  };