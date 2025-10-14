# Development Setup Guide

This document provides step-by-step instructions for setting up the Job Application Tracker development environment.

## 🎯 Prerequisites

### Required Software
- **Node.js**: Version 18.0.0 or higher
- **npm**: Version 8.0.0 or higher (comes with Node.js)
- **Git**: For version control
- **Code Editor**: VS Code recommended
- **Database**: PostgreSQL or SQLite

### Optional Software
- **Docker**: For containerized development
- **Postman**: For API testing
- **Google Cloud Console**: For Google Drive integration
- **OpenAI Account**: For AI parsing features

## 🚀 Quick Start

### 1. Clone Repository
```bash
git clone <repository-url>
cd job-tracker
```

### 2. Install Dependencies
```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 3. Environment Setup
```bash
# Copy environment template
cp .env.example .env

# Edit environment variables
nano .env
```

### 4. Start Development Servers
```bash
# Terminal 1: Backend
cd backend
npm run dev

# Terminal 2: Frontend
cd frontend
npm run dev
```

## 🔧 Detailed Setup

### Backend Setup

#### 1. Database Configuration
```bash
# Install PostgreSQL (Ubuntu/Debian)
sudo apt update
sudo apt install postgresql postgresql-contrib

# Create database
sudo -u postgres createdb jobtracker

# Create user
sudo -u postgres createuser --interactive
```

#### 2. Environment Variables
```env
# .env file
NODE_ENV=development
PORT=5000
DATABASE_URL="postgresql://username:password@localhost:5432/jobtracker"
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_REDIRECT_URI=http://localhost:5000/auth/google/callback
OPENAI_API_KEY=your-openai-api-key
JWT_SECRET=your-jwt-secret
```

#### 3. Database Migration
```bash
# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma migrate dev

# Seed database (optional)
npx prisma db seed
```

#### 4. Start Backend Server
```bash
npm run dev
```

### Frontend Setup

#### 1. Environment Variables
```env
# .env file
VITE_API_BASE_URL=http://localhost:5000/api
VITE_GOOGLE_CLIENT_ID=your-google-client-id
VITE_OPENAI_API_KEY=your-openai-api-key
```

#### 2. Start Frontend Server
```bash
npm run dev
```

## 🔑 API Keys Setup

### Google Drive API

#### 1. Create Google Cloud Project
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project
3. Enable Google Drive API
4. Create OAuth 2.0 credentials

#### 2. Configure OAuth
```json
{
  "web": {
    "client_id": "your-client-id.apps.googleusercontent.com",
    "project_id": "your-project-id",
    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
    "token_uri": "https://oauth2.googleapis.com/token",
    "client_secret": "your-client-secret",
    "redirect_uris": [
      "http://localhost:5000/auth/google/callback",
      "http://localhost:5173/auth/google/callback"
    ]
  }
}
```

### OpenAI API

#### 1. Get API Key
1. Go to [OpenAI Platform](https://platform.openai.com/)
2. Create an account
3. Generate API key
4. Add to environment variables

#### 2. Test API Connection
```bash
curl -H "Authorization: Bearer $OPENAI_API_KEY" \
     -H "Content-Type: application/json" \
     -d '{"model": "gpt-3.5-turbo", "messages": [{"role": "user", "content": "Hello"}]}' \
     https://api.openai.com/v1/chat/completions
```

## 🗄️ Database Setup

### PostgreSQL Setup

#### 1. Install PostgreSQL
```bash
# Ubuntu/Debian
sudo apt update
sudo apt install postgresql postgresql-contrib

# macOS
brew install postgresql
brew services start postgresql

# Windows
# Download from https://www.postgresql.org/download/windows/
```

#### 2. Create Database
```sql
-- Connect to PostgreSQL
sudo -u postgres psql

-- Create database
CREATE DATABASE jobtracker;

-- Create user
CREATE USER jobtracker_user WITH PASSWORD 'your_password';

-- Grant privileges
GRANT ALL PRIVILEGES ON DATABASE jobtracker TO jobtracker_user;

-- Exit
\q
```

#### 3. Update Connection String
```env
DATABASE_URL="postgresql://jobtracker_user:your_password@localhost:5432/jobtracker"
```

### SQLite Setup (Alternative)

#### 1. Install SQLite
```bash
# Ubuntu/Debian
sudo apt install sqlite3

# macOS
brew install sqlite

# Windows
# Download from https://www.sqlite.org/download.html
```

#### 2. Update Connection String
```env
DATABASE_URL="file:./dev.db"
```

## 🐳 Docker Development

### Docker Setup

#### 1. Create Dockerfile
```dockerfile
# Dockerfile
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./
RUN npm install

# Copy source code
COPY . .

# Expose port
EXPOSE 3000

# Start application
CMD ["npm", "run", "dev"]
```

#### 2. Docker Compose
```yaml
# docker-compose.yml
version: '3.8'
services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=development
      - DATABASE_URL=postgresql://user:password@db:5432/jobtracker
    depends_on:
      - db
    volumes:
      - .:/app
      - /app/node_modules
  
  db:
    image: postgres:15
    environment:
      - POSTGRES_DB=jobtracker
      - POSTGRES_USER=user
      - POSTGRES_PASSWORD=password
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

#### 3. Run with Docker
```bash
# Start services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

## 🧪 Testing Setup

### Unit Testing

#### 1. Install Testing Dependencies
```bash
# Backend
cd backend
npm install --save-dev jest @types/jest ts-jest supertest

# Frontend
cd ../frontend
npm install --save-dev vitest @testing-library/react @testing-library/jest-dom
```

#### 2. Jest Configuration
```javascript
// jest.config.js
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src'],
  testMatch: ['**/__tests__/**/*.ts', '**/?(*.)+(spec|test).ts'],
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/*.d.ts',
  ],
};
```

#### 3. Run Tests
```bash
# Backend tests
npm test

# Frontend tests
npm run test
```

### Integration Testing

#### 1. API Testing
```bash
# Install Postman
# Import API collection
# Run integration tests
```

#### 2. E2E Testing
```bash
# Install Playwright
npm install --save-dev @playwright/test

# Run E2E tests
npx playwright test
```

## 🔍 Debugging Setup

### VS Code Configuration

#### 1. Launch Configuration
```json
// .vscode/launch.json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Debug Backend",
      "type": "node",
      "request": "launch",
      "program": "${workspaceFolder}/backend/src/server.ts",
      "outFiles": ["${workspaceFolder}/backend/dist/**/*.js"],
      "env": {
        "NODE_ENV": "development"
      },
      "console": "integratedTerminal",
      "restart": true,
      "protocol": "inspector"
    },
    {
      "name": "Debug Frontend",
      "type": "chrome",
      "request": "launch",
      "url": "http://localhost:5173",
      "webRoot": "${workspaceFolder}/frontend/src"
    }
  ]
}
```

#### 2. Extensions
```json
// .vscode/extensions.json
{
  "recommendations": [
    "ms-vscode.vscode-typescript-next",
    "bradlc.vscode-tailwindcss",
    "esbenp.prettier-vscode",
    "ms-vscode.vscode-eslint",
    "prisma.prisma"
  ]
}
```

### Browser Debugging

#### 1. Chrome DevTools
- Open Chrome DevTools (F12)
- Use Sources tab for debugging
- Set breakpoints in TypeScript files
- Use Console for logging

#### 2. React DevTools
```bash
# Install React DevTools extension
# Available in Chrome Web Store
```

## 📊 Performance Monitoring

### Development Tools

#### 1. Bundle Analyzer
```bash
# Install bundle analyzer
npm install --save-dev webpack-bundle-analyzer

# Analyze bundle
npm run build:analyze
```

#### 2. Performance Profiling
```bash
# Install performance tools
npm install --save-dev clinic

# Profile application
npx clinic doctor -- node dist/server.js
```

## 🔧 Troubleshooting

### Common Issues

#### 1. Port Already in Use
```bash
# Find process using port
lsof -i :3000

# Kill process
kill -9 <PID>
```

#### 2. Database Connection Issues
```bash
# Check PostgreSQL status
sudo systemctl status postgresql

# Restart PostgreSQL
sudo systemctl restart postgresql
```

#### 3. Node Modules Issues
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

#### 4. Environment Variables
```bash
# Check environment variables
echo $NODE_ENV
echo $DATABASE_URL

# Load environment variables
source .env
```

### Logs and Debugging

#### 1. Application Logs
```bash
# Backend logs
tail -f backend/logs/app.log

# Frontend logs
# Check browser console
```

#### 2. Database Logs
```bash
# PostgreSQL logs
sudo tail -f /var/log/postgresql/postgresql-15-main.log
```

## 📚 Additional Resources

### Documentation
- [Node.js Documentation](https://nodejs.org/docs/)
- [React Documentation](https://react.dev/)
- [Prisma Documentation](https://www.prisma.io/docs/)
- [Google Drive API Documentation](https://developers.google.com/drive/api)

### Community
- [GitHub Issues](https://github.com/your-repo/issues)
- [Discord Community](https://discord.gg/your-community)
- [Stack Overflow](https://stackoverflow.com/questions/tagged/job-tracker)

---

**Last Updated**: September 2024
**Version**: 1.0.0

