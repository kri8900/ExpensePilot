# MoneyTracker Pro - Personal Finance Management Application

## Overview

MoneyTracker Pro is a comprehensive personal finance management application built with a modern full-stack architecture. The application provides users with tools to track transactions, manage budgets, categorize expenses, and gain insights into their financial habits through visual analytics and reporting features.

The system is designed as a single-page application (SPA) with a React frontend and Express.js backend, featuring real-time data visualization, comprehensive budget management, and export capabilities for financial data.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript for type safety and modern development patterns
- **Build Tool**: Vite for fast development and optimized production builds
- **UI Framework**: Radix UI primitives with shadcn/ui component library for consistent, accessible design
- **Styling**: Tailwind CSS with CSS custom properties for theming support (light/dark modes)
- **State Management**: TanStack Query (React Query) for server state management and caching
- **Routing**: Wouter for lightweight client-side routing
- **Forms**: React Hook Form with Zod validation for type-safe form handling
- **Charts**: Chart.js for data visualization and financial analytics

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules for modern JavaScript features
- **API Pattern**: RESTful API design with JSON communication
- **Development Mode**: Vite middleware integration for hot module replacement during development
- **Production Build**: esbuild for server bundling and optimization

### Data Storage Solutions
- **Database**: PostgreSQL with Drizzle ORM for type-safe database operations
- **Connection**: Neon Database serverless PostgreSQL for cloud hosting
- **Schema Management**: Drizzle Kit for migrations and schema synchronization
- **Development Storage**: In-memory storage implementation with default demo data for development/testing
- **Data Validation**: Zod schemas shared between frontend and backend for consistent validation

### Authentication and Authorization
- **Session Management**: Express sessions with PostgreSQL session store (connect-pg-simple)
- **User Model**: Simple username/password authentication with encrypted password storage
- **Authorization**: User-scoped data access with default user fallback for demo purposes

### External Dependencies

#### Database and ORM
- **Drizzle ORM**: Type-safe database toolkit with PostgreSQL dialect
- **Neon Database**: Serverless PostgreSQL hosting platform
- **connect-pg-simple**: PostgreSQL session store for Express sessions

#### UI and Styling
- **Radix UI**: Unstyled, accessible React components (@radix-ui/react-*)
- **Tailwind CSS**: Utility-first CSS framework with custom design system
- **Lucide React**: Feather-inspired icon library
- **shadcn/ui**: Pre-built component library built on Radix UI and Tailwind

#### Development and Build Tools
- **Vite**: Modern build tool with TypeScript support and React plugin
- **esbuild**: Fast JavaScript bundler for production server builds
- **TSX**: TypeScript execution environment for development server
- **PostCSS**: CSS processing with Tailwind CSS and Autoprefixer plugins

#### Data Visualization and Export
- **Chart.js**: Canvas-based charting library for financial analytics
- **jsPDF**: Client-side PDF generation for financial reports
- **date-fns**: Modern date utility library for date formatting and manipulation

#### Form Handling and Validation
- **React Hook Form**: Performant forms with minimal re-renders
- **Zod**: TypeScript-first schema validation library
- **@hookform/resolvers**: Zod resolver integration for React Hook Form

#### State Management and API
- **TanStack Query**: Powerful data synchronization for React applications
- **Wouter**: Minimalist routing library for React

#### Development Environment
- **Replit Integration**: Development environment with cartographer plugin and error modal overlay
- **TypeScript**: Static type checking with strict configuration
- **ESLint/Prettier**: Code formatting and linting (implied by project structure)

The architecture emphasizes type safety throughout the stack, modern development practices, and a component-based approach that scales well for additional features and complexity.