"# HabitTracker

A full-stack web application for tracking and managing daily habits. Built with Node.js/Express backend and React frontend.

## Features

- 📝 Create and manage habits
- ✅ Track daily progress
- 📊 View habit statistics
- 🎯 Set and achieve goals
- 💾 Persistent data storage
- 🔐 **Authentication & Authorization**
  - User registration and login with bcrypt password hashing
  - Google OAuth integration with Passport.js
  - Email/Password and Google authentication in unified user model
  - JWT-based authentication with secure HTTP-only cookies
  - Silent token refresh for seamless user experience
  - Token rotation and secure storage in database
- 🛡️ **Security Features**
  - Helmet.js for security headers
  - Rate limiting to prevent abuse
  - Input sanitization
  - CORS with credentials support
- 📧 **Email Service**
  - SendGrid integration for welcome emails
  - Streak milestone email notifications
- 🔑 **Access Control**
  - Role-based access control (RBAC) middleware
  - Protected and public route guards
  - User-specific habit filtering and isolation
- 🔄 **Axios Interceptors**
  - Auto-token attachment to requests
  - Automatic token refresh on expiration

## Project Structure

```
1stProject/
├── backend/          # Node.js/Express server
│   ├── controllers/  # Route handlers
│   ├── models/       # Database models
│   ├── routes/       # API routes
│   ├── middleware/   # Custom middleware
│   ├── config/       # Configuration files
│   ├── server.js     # Main server file
│   └── package.json
├── frontend/         # React application
│   ├── src/          # React components and pages
│   ├── public/       # Static assets
│   ├── index.html    # HTML entry point
│   ├── vite.config.js
│   └── package.json
└── README.md
```

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file with required environment variables (database URL, port, etc.)

4. Start the server:
   ```bash
   npm start
   ```

The backend will run on the configured port (typically `http://localhost:5000`)

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

The frontend will be available at `http://localhost:5173`

## Available Scripts

### Backend

- `npm start` - Run the server
- `npm run dev` - Run with nodemon (auto-reload)

### Frontend

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## API Endpoints

The backend provides RESTful API endpoints for habit management. See backend routes for detailed documentation.

## Technology Stack

### Backend
- **Node.js & Express.js** - Server framework
- **MongoDB** - NoSQL database
- **Passport.js** - Authentication middleware with local and Google OAuth strategies
- **JWT (jsonwebtoken)** - Token-based authentication
- **Bcrypt** - Password hashing
- **Helmet.js** - Security headers
- **Express-rate-limit** - Rate limiting
- **express-mongo-sanitize** - Input sanitization
- **SendGrid** - Email service
- **CORS** - Cross-origin resource sharing with credentials

### Frontend
- **React 19** - UI library
- **React Router DOM** - Client-side routing
- **Axios** - HTTP client with interceptors
- **Vite** - Build tool and dev server
- **ESLint** - Code linting

## Development

To work on both frontend and backend simultaneously, run them in separate terminal windows:

```bash
# Terminal 1: Backend
cd backend && npm start

# Terminal 2: Frontend
cd frontend && npm run dev
```

## Environment Configuration

### Backend (.env file required)

Create a `.env` file in the backend directory with the following variables:

```env
# Database
MONGODB_URI=mongodb://localhost:27017/habittracker

# Server
PORT=5000
NODE_ENV=development

# JWT
JWT_SECRET=your-secret-key-here
JWT_EXPIRY=15m
REFRESH_TOKEN_SECRET=your-refresh-secret-key
REFRESH_TOKEN_EXPIRY=7d

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_CALLBACK_URL=http://localhost:5000/auth/google/callback

# SendGrid
SENDGRID_API_KEY=your-sendgrid-api-key

# CORS
FRONTEND_URL=http://localhost:5173

# Rate Limiting
RATE_LIMIT_WINDOW_MS=15m
RATE_LIMIT_MAX_REQUESTS=100
```

### Frontend Environment

Create a `.env` file in the frontend directory:

```env
VITE_API_URL=http://localhost:5000
```

## Authentication Flow

1. **Registration/Login**
   - User registers with email and password
   - Password is hashed using bcrypt
   - JWT token is generated and stored in HTTP-only cookie

2. **Google OAuth**
   - User clicks "Login with Google"
   - Passport.js handles OAuth flow
   - User profile merged with existing email/password account if exists

3. **Token Refresh**
   - Silent refresh automatically triggers before token expiry
   - Refresh token stored securely in database
   - New tokens issued without user intervention

4. **Authorization**
   - Protected routes validate JWT token
   - Role-based access control enforced
   - User data isolated by userId

## Security Measures

- **Password Security**: Bcrypt hashing with salt rounds
- **Token Security**: HTTP-only cookies prevent XSS attacks
- **CSRF Protection**: SameSite cookie attributes
- **Rate Limiting**: Prevents brute force attacks
- **Input Sanitization**: Removes malicious data
- **CORS Configuration**: Restricted origins with credentials
- **Security Headers**: Helmet.js headers for protection

## Currently Working On

- Authentication and authorization to its fullest potential
- Advanced security hardening with additional measures"
