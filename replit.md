# Overview

SafeCity is a community-driven safety reporting web application designed to help residents and visitors report and track safety incidents in currently available only in Lisbon. The application features an interactive map interface where users can view, filter, and report incidents such as theft, dangerous locations, harassment, and other safety concerns. Built with a modern full-stack architecture, it provides real-time incident tracking with commenting and rating capabilities.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture

The client is built using **React 18** with **TypeScript** and follows a component-based architecture. Key architectural decisions include:

- **Styling Framework**: Uses **Tailwind CSS** with **shadcn/ui** component library for consistent, accessible UI components
- **State Management**: Leverages **TanStack Query (React Query)** for server state management, providing caching, synchronization, and optimistic updates
- **Routing**: Implements **Wouter** as a lightweight client-side routing solution
- **UI Components**: Extensive use of **Radix UI** primitives for accessibility and customization
- **Mobile-First Design**: Responsive design with dedicated mobile components and navigation patterns

## Backend Architecture

The server follows a **REST API** pattern built with **Express.js** and **TypeScript**:

- **Database Layer**: Uses **Drizzle ORM** with **PostgreSQL** for type-safe database operations
- **Storage Pattern**: Implements an interface-based storage layer (`IStorage`) with both in-memory and database implementations
- **API Structure**: RESTful endpoints organized in `/api/*` routes for incidents, comments, and ratings
- **Development Setup**: Integrated **Vite** development server for hot module replacement and optimized builds

## Data Storage Solutions

The application uses a **PostgreSQL** database with the following schema design:

- **Users Table**: Stores user authentication data with username/password
- **Incidents Table**: Core entity storing incident details including type, location, severity, and metadata
- **Comments Table**: Enables community discussion on incidents
- **Ratings Table**: Allows users to rate incident reliability/severity

Key design patterns:
- **UUID Primary Keys**: Uses PostgreSQL's `gen_random_uuid()` for unique identifiers
- **Temporal Data**: Includes created timestamps and separate date/time fields for incidents
- **Geospatial Support**: Stores latitude/longitude as text fields for location data
- **Enum-like Fields**: Uses text fields with application-level validation for types and severity levels

## External Dependencies

### Core Infrastructure
- **Neon Database**: Serverless PostgreSQL database provider via `@neondatabase/serverless`
- **Drizzle Kit**: Database migration and schema management tool

### Frontend Libraries
- **Map Integration**: Leaflet.js for interactive mapping (dynamically imported)
- **Form Handling**: React Hook Form with Zod validation via `@hookform/resolvers`
- **Date Management**: `date-fns` for date formatting and manipulation
- **UI Framework**: Comprehensive Radix UI component suite for accessibility

### Development Tools
- **Vite**: Build tool and development server with React plugin
- **ESBuild**: Production bundling for server-side code
- **TypeScript**: Type safety across the entire stack
- **Tailwind CSS**: Utility-first CSS framework with PostCSS processing

### Session Management
- **PostgreSQL Sessions**: Uses `connect-pg-simple` for session storage in the database

The architecture prioritizes type safety, developer experience, and scalability while maintaining a clean separation between client and server concerns. The storage abstraction allows for easy testing and potential database migrations, while the component-based frontend ensures maintainable and reusable UI elements.