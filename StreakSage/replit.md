# Spiritual Growth Habit Tracker - "Streak Prompt"

## Overview

This is a full-stack web application called "Streak Prompt" - a beautiful, spiritually-inspired daily habit tracker designed to be the perfect accountability buddy. The application features Bhagavad Gita quotes, streak analytics, and an addiction-inducing design that helps users build positive habits and maintain consistency through self-growth.

## User Preferences

Preferred communication style: Simple, everyday language.
User feedback: "Perfect" - confirmed satisfaction with the overall design and functionality.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter for lightweight client-side routing
- **UI Framework**: Shadcn/ui components built on Radix UI primitives
- **Styling**: Tailwind CSS with custom spiritual color palette (forest greens, sage, cream, warm orange)
- **State Management**: TanStack Query (React Query) for server state management
- **Build Tool**: Vite for fast development and optimized builds

### Backend Architecture
- **Runtime**: Node.js with Express.js
- **Language**: TypeScript with ES modules
- **API Design**: RESTful API endpoints with proper error handling
- **Session Management**: Express sessions with PostgreSQL session store
- **Middleware**: Custom logging, JSON parsing, and error handling

### Data Storage Solutions
- **Database**: PostgreSQL with Drizzle ORM
- **Schema Management**: Drizzle Kit for migrations and schema management
- **Database Provider**: Neon Database (serverless PostgreSQL)
- **Storage Implementation**: In-memory storage for development with interface for easy database integration

## Key Components

### Database Schema
The application uses a well-structured PostgreSQL schema with the following main entities:
- **Users**: Profile information, streak counters, and statistics
- **Tasks**: User-defined habits with emojis, descriptions, and weekend/weekday variants
- **Task Completions**: Daily completion tracking with timestamps
- **Quotes**: Daily inspirational quotes from spiritual texts
- **Reflections**: User's daily reflection notes
- **Streak History**: Daily progress tracking for analytics

### Core Features
1. **Morning Wisdom**: Daily inspirational quotes displayed at 6:00 AM
2. **Task Management**: Create and track spiritual practices with emoji representation
3. **Streak Tracking**: Visual calendar showing completion streaks with color coding
4. **Progress Analytics**: Circular progress indicators and weekly completion metrics
5. **Evening Reflection**: Prompted reflection time at 9:30 PM with auto-save
6. **Quick Stats**: Motivational statistics and achievement badges

### UI Components
- **Glass Morphism Design**: Translucent cards with backdrop blur effects
- **Responsive Layout**: Mobile-first design with adaptive components
- **Toast Notifications**: User feedback for actions and time-based reminders
- **Loading States**: Skeleton components for smooth user experience
- **Accessibility**: Proper ARIA labels and keyboard navigation support

## Data Flow

### Client-Server Communication
1. **API Layer**: RESTful endpoints under `/api` namespace
2. **Data Fetching**: TanStack Query for caching, background updates, and optimistic updates
3. **Real-time Updates**: Automatic refetching every 30 seconds for task status
4. **Error Handling**: Comprehensive error boundaries and user-friendly error messages

### State Management Flow
1. **Server State**: Managed by TanStack Query with automatic caching
2. **Local State**: React hooks for UI state and form management
3. **Optimistic Updates**: Immediate UI updates with server reconciliation
4. **Background Sync**: Automatic data synchronization without user intervention

## External Dependencies

### Production Dependencies
- **UI Components**: Radix UI primitives for accessible components
- **Database**: Drizzle ORM with Neon Database driver
- **Validation**: Zod for runtime type checking and schema validation
- **Date Handling**: date-fns for date manipulation and formatting
- **Icons**: Lucide React for consistent iconography
- **Animations**: Class Variance Authority for dynamic styling

### Development Tools
- **Build System**: Vite with React plugin and TypeScript support
- **Code Quality**: TypeScript strict mode with comprehensive type checking
- **CSS Processing**: PostCSS with Tailwind CSS and Autoprefixer
- **Development Server**: Vite dev server with HMR and error overlay

## Deployment Strategy

### Build Process
1. **Frontend Build**: Vite compiles React app with code splitting and optimization
2. **Backend Build**: ESBuild bundles server code for Node.js deployment
3. **Static Assets**: Built files served from `/dist/public` directory
4. **Development Mode**: Vite middleware integration for seamless development

### Environment Configuration
- **Database Connection**: Environment variable for DATABASE_URL
- **Session Management**: Secure session configuration for production
- **Static File Serving**: Express static middleware for production builds
- **Error Handling**: Production-ready error boundaries and logging

### Scalability Considerations
- **Database Connection Pooling**: Configured through Drizzle ORM
- **Session Store**: PostgreSQL-backed sessions for horizontal scaling
- **Static Asset Optimization**: Vite's built-in optimization for performance
- **API Rate Limiting**: Prepared for implementation with Express middleware

The application follows modern web development best practices with a focus on user experience, maintainability, and spiritual growth facilitation. The architecture supports both individual use and potential future multi-user scenarios.