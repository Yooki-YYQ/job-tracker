// Application constants
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const APPLICATION_STATUSES = [
  'APPLIED',
  'INTERVIEW_SCHEDULED',
  'INTERVIEWED',
  'OFFER_RECEIVED',
  'REJECTED',
  'WITHDRAWN',
  'ACCEPTED',
] as const;

export const TABLE_CONFIG = {
  ROW_HEIGHT: 40,
  HEADER_HEIGHT: 40,
  MIN_COLUMN_WIDTH: 100,
  DEFAULT_COLUMN_WIDTH: 150,
} as const;

export const AI_CONFIG = {
  DEFAULT_MODEL: 'gpt-4o-mini',
  DEFAULT_TEMPERATURE: 0.3,
  MAX_RETRIES: 3,
  TIMEOUT: 30000,
} as const;
