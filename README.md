# LinkedOut - Professional Social Media Platform

A professional social networking mobile application built with React Native and GraphQL. This project demonstrates full-stack mobile development capabilities with modern technologies and best practices for social media platforms.

## Tech Stack

**Mobile Client:**
- React Native with Expo
- Apollo Client for GraphQL
- React Navigation for routing
- Expo SecureStore for authentication
- Vector Icons for UI elements

**Backend Server:**
- Apollo Server with GraphQL
- MongoDB with native driver
- Redis for caching
- JWT authentication
- bcryptjs for password security

**Architecture:**
- GraphQL API with type-safe schema
- MongoDB aggregation pipelines
- Redis caching layer
- JWT-based authentication
- Modular resolver patterns

## Features

**User Management**
- User registration and authentication
- Secure login with JWT tokens
- User profile management
- Search users by name or username

**Social Networking**
- Follow and unfollow users
- View followers and following lists
- User profile pages with statistics
- Real-time follower counts

**Content Management**
- Create posts with text content
- Add hashtags to posts
- Upload images via URL
- Post timeline with chronological ordering

**Engagement Features**
- Like posts with duplicate prevention
- Comment on posts with threading
- Real-time engagement statistics
- Interactive post detail views

**Performance Features**
- Redis caching for improved response times
- GraphQL query optimization
- MongoDB aggregation for complex data
- Efficient data fetching patterns

## Architecture

The application follows a modern mobile-first architecture:

- **Frontend**: React Native with Expo for cross-platform mobile development
- **Backend**: GraphQL API server with Apollo Server
- **Database**: MongoDB with structured collections and relationships
- **Cache**: Redis for optimized data retrieval
- **Authentication**: JWT tokens with secure storage
- **State Management**: Apollo Client cache and React Context

## Project Structure

```
├── app/                      # React Native mobile client
│   ├── screens/             # Application screens
│   ├── navigators/          # Navigation configuration
│   ├── contexts/            # React context providers
│   └── config/              # Apollo client setup
└── server/                  # GraphQL server
    ├── models/              # Data models and business logic
    ├── schemas/             # GraphQL type definitions and resolvers
    └── config/              # Database and Redis configuration
```

## Key Implementations

- GraphQL schema with type-safe operations
- MongoDB aggregation pipelines for complex user relationships
- Redis caching strategy for improved performance
- JWT authentication with secure token storage
- React Native navigation with stack and tab navigators
- Real-time UI updates with Apollo Client cache
- Image handling and display optimization
- Cross-platform mobile UI with consistent design patterns

## Data Relationships

- Users can follow other users (many-to-many relationship)
- Posts belong to users with embedded comments and likes
- Comments and likes are embedded documents for performance
- User profiles aggregate follower/following data using MongoDB lookup operations
