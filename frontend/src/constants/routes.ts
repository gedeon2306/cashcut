// src/constants/routes.ts
export const ROUTES = {
  HOME: '/',
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
    EMAIL_SEND: '/auth/email-send',
    CONFIRM: '/auth/confirm',
  },
  DASHBOARD: {
    ROOT: '/dashboard',
    BARBERS: '/dashboard/barbers',
    TRANSACTIONS: '/dashboard/transactions',
    SALARY: '/dashboard/salary',
    SETTINGS: '/dashboard/settings',
  },
  LEGAL: {
    MENTIONS: '/mentions-legales',
    PRIVACY: '/politique-confidentialite',
    LICENCE: '/licence',
  },
  ABOUT: '/a-propos',
} as const;