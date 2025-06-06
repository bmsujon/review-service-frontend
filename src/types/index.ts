import type { ReviewType, ReviewStatus } from '../constants';

export interface User {
  id: number;
  name: string;
  email: string;
  avatar?: string;
}

export interface Company {
  id: number;
  name: string;
  description?: string;
  website?: string;
  logo?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Review {
  id: number;
  reviewType: ReviewType;
  title: string;
  contentHtml: string;
  ipAddress: string;
  likeCount: number;
  dislikeCount: number;
  hasComment: boolean;
  status: ReviewStatus;
  isEmployee: boolean;
  dept?: string;
  role?: string;
  companyName: string;
  website?: string;
  workStartDate?: string;
  workEndDate?: string;
  createdAt: string;
  updatedAt: string;
  reviewerName: string;
  totalComments: number;
}

export interface Comment {
  id: number;
  content: string;
  reviewId: number;
  parentId: number | null;
  createdAt: string;
  updatedAt: string;
  status: 'ACTIVE' | 'INACTIVE';
  hasReplies: boolean;
  commenterName: string;
  totalReplies: number;
  likeCount: number;
  dislikeCount: number;
}

export interface ReviewFilters {
  companyName?: string;
  sort?: string;
  page?: number;
  size?: number;
  featured?: boolean;
  reviewType?: ReviewType;
}

export interface PaginatedResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
  empty: boolean;
  numberOfElements: number;
  pageable: {
    pageNumber: number;
    pageSize: number;
    sort: {
      empty: boolean;
      sorted: boolean;
      unsorted: boolean;
    };
    offset: number;
    paged: boolean;
    unpaged: boolean;
  };
  sort: {
    empty: boolean;
    sorted: boolean;
    unsorted: boolean;
  };
}

export interface ApiError {
  message: string;
  status: number;
  errors?: string[];
}

export interface CreateReviewPayload {
  reviewType: ReviewType;
  title: string;
  content: string;
  ipAddress: string;
  dept?: string;
  role?: string;
  companyName: string;
  website?: string;
  isEmployee: boolean;
  workStartDate?: string;
  workEndDate?: string;
  reviewerName: string;
} 