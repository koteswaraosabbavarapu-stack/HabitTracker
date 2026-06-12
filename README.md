"# HabitTracker

A full-stack web application for tracking and managing daily habits. Built with Node.js/Express backend and React frontend.

## Features

- 📝 Create and manage habits
- ✅ Track daily progress
- 📊 View habit statistics
- 🎯 Set and achieve goals
- 💾 Persistent data storage

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
- Node.js
- Express.js
- MongoDB or similar database

### Frontend
- React 19
- React Router DOM 
- Axios
- Vite
- ESLint

## Development

To work on both frontend and backend simultaneously, run them in separate terminal windows:

```bash
# Terminal 1: Backend
cd backend && npm start

# Terminal 2: Frontend
cd frontend && npm run dev
```

## License

This project is part of the FullStack learning series.

currently i am working with authentication and authorization to its fullest potential." 
