# Review Service Frontend

A modern, responsive web application built with React and TypeScript that provides a platform for users to share and read company reviews. The application features a rich text editor for review content, real-time updates, and a clean, intuitive user interface.

## 🌟 Key Features

### Review Management
- Create, read, and interact with company reviews
- Rich text editor with formatting options (bold, italic, underline, strikethrough)
- Like/Dislike functionality for reviews
- Pagination and sorting options
- Search and filter capabilities

### User Experience
- Responsive design for all device sizes
- Real-time content updates
- Intuitive navigation
- Loading states and error handling
- Toast notifications for user feedback

### Technical Features
- TypeScript for type safety
- React Query for efficient data fetching and caching
- Environment-based configuration
- Automated deployment with Vercel
- API integration with backend services

## 🏗️ Architecture

### Frontend Structure
```
src/
├── components/     # Reusable UI components
├── pages/         # Page components
├── services/      # API and service integrations
├── hooks/         # Custom React hooks
├── context/       # React Context providers
├── utils/         # Utility functions
├── constants/     # Application constants
├── types/         # TypeScript type definitions
└── assets/        # Static assets
```

### Key Components
- **Review Editor**: TipTap-based rich text editor
- **Review List**: Paginated list with sorting and filtering
- **Review Card**: Individual review display component
- **API Service**: Axios-based API client
- **Auth Context**: Authentication state management

## 🚀 Getting Started

### Prerequisites
- Node.js 16+
- npm 7+

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/bmsujon/review-service-frontend.git
   cd review-service-frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env
   ```
   Update the `.env` file with your configuration:
   ```
   VITE_API_BASE_URL=your_api_url
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run linter
- `npm run test` - Run tests

## 🔧 Configuration

### Environment Variables
- `VITE_API_BASE_URL`: Base URL for the API (default: http://localhost:8080/api/v1)

### API Integration
The frontend integrates with the Review Service API endpoints:

#### Review Endpoints
- `GET /api/v1/reviews` - Get paginated list of reviews
- `GET /api/v1/reviews/{id}` - Get review by ID
- `POST /api/v1/reviews` - Create new review
- `PUT /api/v1/reviews/{id}/like` - Like a review
- `PUT /api/v1/reviews/{id}/dislike` - Dislike a review

#### Comment Endpoints
- `GET /api/v1/reviews/{reviewId}/comments` - Get comments for a review
- `POST /api/v1/reviews/{reviewId}/comments` - Add a comment
- `GET /api/v1/reviews/{reviewId}/comments/{commentId}/replies` - Get replies for a comment
- `PUT /api/v1/reviews/{reviewId}/comments/{commentId}/like` - Like a comment
- `PUT /api/v1/reviews/{reviewId}/comments/{commentId}/dislike` - Dislike a comment

## 🚀 Deployment

The application is configured for deployment on Vercel:

1. Connect your GitHub repository to Vercel
2. Configure environment variables in Vercel dashboard
3. Enable automatic deployments for the main branch
4. Deploy previews for pull requests

### Production Environment
- Frontend: Deployed on Vercel
- Backend: Deployed on Heroku
- API Base URL: https://review-service-8a48b7188802.herokuapp.com/api/v1

## 🛠️ Tech Stack

### Core Technologies
- React 18+
- TypeScript
- Vite
- React Router v6
- Axios
- React Query

### UI/UX
- Tailwind CSS
- Headless UI
- React Hook Form
- React Hot Toast

### Development Tools
- ESLint
- Prettier
- TypeScript
- Node.js

## 🔮 Future Plans

### Phase 1: Enterprise Authentication & Authorization
- **Role-Based Access Control (RBAC)**
  - Admin role for platform management
  - Company Admin role for company-specific management
  - Employee role for company members
  - External Reviewer role for non-employees
  - Custom role creation and management

- **Authentication System**
  - OAuth 2.0 / OpenID Connect integration
  - Multi-factor authentication (MFA)
  - Single Sign-On (SSO) support
  - Session management and security
  - Password policies and account recovery

### Phase 2: Multi-Tenant Architecture
- **Company Management**
  - Company profile and branding
  - Department/Team structure
  - Employee directory integration
  - Custom review templates
  - Company-specific analytics

- **Data Isolation**
  - Secure data segregation between companies
  - Company-specific data retention policies
  - Audit logging and compliance tracking
  - Data export and backup capabilities

### Phase 3: Advanced Features
- **Review Management**
  - Custom review workflows
  - Review approval processes
  - Anonymous review options
  - Review templates and categories
  - Review analytics and insights

- **Integration Capabilities**
  - HRIS system integration
  - Slack/Teams notifications
  - Email integration
  - Calendar integration
  - API for custom integrations

### Phase 4: Analytics & Reporting
- **Advanced Analytics**
  - Real-time dashboard
  - Custom report builder
  - Sentiment analysis
  - Trend identification
  - Predictive analytics

- **Compliance & Audit**
  - Compliance reporting
  - Audit trails
  - Data retention management
  - Privacy controls
  - Export capabilities

### Phase 5: Platform Enhancement
- **User Experience**
  - Mobile application
  - Progressive Web App (PWA)
  - Accessibility improvements
  - Internationalization
  - Custom themes and branding

- **Performance & Scalability**
  - Microservices architecture
  - Load balancing
  - Caching optimization
  - Database sharding
  - CDN integration

### Phase 6: Enterprise Features
- **Security Enhancements**
  - Advanced encryption
  - Security compliance (SOC 2, ISO 27001)
  - Penetration testing
  - Vulnerability scanning
  - Security monitoring

- **Business Features**
  - Subscription management
  - Billing integration
  - Usage analytics
  - SLA monitoring
  - Support ticketing system

