# Review Website Frontend

A React-based frontend application for the Review Service API, providing a user-friendly interface for managing and viewing reviews and comments.

## Project Structure
```
review-website-frontend/
├── src/
│   ├── components/
│   │   ├── common/
│   │   │   ├── Button/
│   │   │   ├── Input/
│   │   │   ├── Modal/
│   │   │   ├── Pagination/
│   │   │   └── Loading/
│   │   ├── layout/
│   │   │   ├── Header/
│   │   │   ├── Footer/
│   │   │   └── Sidebar/
│   │   ├── reviews/
│   │   │   ├── ReviewList/
│   │   │   ├── ReviewCard/
│   │   │   ├── ReviewForm/
│   │   │   └── ReviewFilters/
│   │   └── comments/
│   │       ├── CommentList/
│   │       ├── CommentCard/
│   │       └── CommentForm/
│   ├── pages/
│   │   ├── Home/
│   │   ├── ReviewDetail/
│   │   ├── CompanyReviews/
│   │   └── SubmitReview/
│   ├── services/
│   │   ├── api.ts
│   │   ├── reviewService.ts
│   │   └── commentService.ts
│   ├── hooks/
│   │   ├── useReviews.ts
│   │   └── useComments.ts
│   ├── context/
│   │   └── AuthContext.tsx
│   ├── utils/
│   │   ├── formatters.ts
│   │   └── validators.ts
│   ├── constants/
│   │   └── index.ts
│   ├── types/
│   │   └── index.ts
│   └── assets/
└── public/
```

## Key Features

1. **Home Page**
   - Featured reviews section
   - Recent reviews list
   - Search functionality
   - Filter by company name and review type
   - Pagination

2. **Review Detail Page**
   - Full review content
   - Like/Dislike functionality
   - Comments section with nested replies
   - Comment form
   - Related reviews

3. **Submit Review Page**
   - Multi-step form
   - Review type selection
   - Company information
   - Employee/Non-employee toggle
   - Rich text editor for content
   - Form validation

4. **Company Reviews Page**
   - Company-specific reviews
   - Company information
   - Review statistics
   - Filtering and sorting options

## Technical Stack

1. **Core Technologies**
   - React 18+
   - TypeScript
   - React Router v6
   - Axios for API calls
   - React Query for data fetching

2. **UI Components**
   - Tailwind CSS for styling
   - Headless UI for accessible components
   - React Hook Form for forms
   - React Hot Toast for notifications

3. **State Management**
   - React Context for global state
   - React Query for server state
   - Local storage for user preferences

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
4. Open [http://localhost:5173](http://localhost:5173) in your browser

## Development

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run test` - Run tests
- `npm run lint` - Run linter

## API Integration

The frontend integrates with the Review Service API endpoints:

### Review Endpoints
- `GET /api/v1/reviews` - Get paginated list of reviews
- `GET /api/v1/reviews/{id}` - Get review by ID
- `POST /api/v1/reviews` - Create new review
- `PUT /api/v1/reviews/{id}/like` - Like a review
- `PUT /api/v1/reviews/{id}/dislike` - Dislike a review

### Comment Endpoints
- `GET /api/v1/reviews/{reviewId}/comments` - Get comments for a review
- `POST /api/v1/reviews/{reviewId}/comments` - Add a comment
- `GET /api/v1/reviews/{reviewId}/comments/{commentId}/replies` - Get replies for a comment
- `PUT /api/v1/reviews/{reviewId}/comments/{commentId}/like` - Like a comment
- `PUT /api/v1/reviews/{reviewId}/comments/{commentId}/dislike` - Dislike a comment
# review-service-frontend
