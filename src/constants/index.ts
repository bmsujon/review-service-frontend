export const REVIEW_TYPES = {
  POSITIVE: 'POSITIVE',
  NEGATIVE: 'NEGATIVE',
  MIXED: 'MIXED',
} as const;

export type ReviewType = typeof REVIEW_TYPES[keyof typeof REVIEW_TYPES];

export const EMPLOYMENT_STATUS = {
  CURRENT: 'CURRENT',
  FORMER: 'FORMER',
} as const;

export type EmploymentStatus = typeof EMPLOYMENT_STATUS[keyof typeof EMPLOYMENT_STATUS];

export const REVIEW_STATUS = {
  PENDING: 'PENDING',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED',
} as const;

export type ReviewStatus = typeof REVIEW_STATUS[keyof typeof REVIEW_STATUS]; 