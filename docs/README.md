# Job Tracker - Enterprise Application

A professional job application tracking system built with enterprise-grade architecture, featuring AI-powered job description parsing and Notion-style table interface.

## 🏗️ Architecture

This application follows strict enterprise software development principles:

- **Strict Separation of Concerns**: Presentational components, container components, service layer, and type system
- **Component Hierarchy**: Clear 4-level component structure with feature-based organization
- **Unidirectional Data Flow**: Props flow down, events flow up, with custom hooks managing business logic
- **Type Safety**: 100% TypeScript coverage with domain-specific type definitions
- **Service Layer**: All API calls abstracted in modular service files

## 📁 Project Structure

```
frontend/src/
├── App.tsx (18 lines - minimal routing + providers)
├── pages/JobTrackerPage/ (Page-level container)
├── features/NotionTable/ (Feature module)
│   ├── NotionTable.tsx (Container component)
│   ├── components/ (Presentational components)
│   ├── hooks/ (Business logic)
│   └── modals/ (Modal components)
├── services/ (API and external services)
├── types/ (Domain-specific types)
├── config/ (Configuration files)
└── styles/ (Global styles and variables)
```

## 🚀 Features

### Core Functionality
- **Notion-style Table**: Excel-like interface with resizable columns
- **Real-time Data**: Live updates from PostgreSQL database
- **AI-Powered Parsing**: OpenAI integration for job description analysis
- **File Management**: Upload and download CV/CL files
- **Dynamic Columns**: Add/remove custom columns
- **Status Tracking**: Visual status indicators with color coding

### Default Columns
- **Aa ID**: Unique identifier with hover effects
- **Date**: Auto-generated application date
- **Position**: Job title (AI-extracted)
- **Company**: Company name (AI-extracted)
- **Status**: Application status with colored dots
- **URL**: Clickable job posting links
- **Job Description**: AI-parsed job details
- **Requirement**: Qualifications and requirements
- **CV**: Resume file management
- **CL**: Cover letter file management
- **Pay**: Salary information
- **Notes**: Additional notes

### AI Integration
- **Smart Parsing**: Extracts structured data from job descriptions
- **Custom Prompts**: Configurable AI prompts for better accuracy
- **Confidence Scoring**: AI confidence levels for parsed data
- **Manual Override**: Edit AI-parsed data before saving

## 🛠️ Technology Stack

### Frontend
- **React 19**: Latest React with concurrent features
- **TypeScript**: Full type safety
- **Ant Design**: Professional UI components
- **AG Grid**: Excel-like data grid
- **Vite**: Fast build tool

### Backend
- **Node.js + Express**: RESTful API
- **Prisma ORM**: Type-safe database access
- **PostgreSQL**: Relational database
- **Multer**: File upload handling

### Development
- **ESLint**: Code linting
- **Prettier**: Code formatting
- **Docker**: Database containerization

## 📋 Prerequisites

- Node.js 18+
- Docker Desktop
- npm or yarn

## 🚀 Quick Start

### 1. Clone and Setup
```bash
git clone <repository-url>
cd job-tracker
```

### 2. Start Database
```bash
cd infra
docker-compose up -d
```

### 3. Setup Backend
```bash
cd ../backend
npm install
npx prisma migrate dev
npm run dev
```

### 4. Setup Frontend
```bash
cd ../frontend
npm install
npm run dev
```

### 5. Access Application
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000
- Database Admin: http://localhost:8080

## 🏛️ Architecture Principles

### Component Rules
1. Every component in its own file
2. Container components handle logic, presentational components handle UI
3. Maximum 200 lines per component
4. Props must be explicitly typed

### Data Flow Rules
1. Props flow down, events flow up
2. No prop drilling beyond 2 levels
3. All API calls in service layer
4. All business logic in hooks

### Type Safety Rules
1. No 'any' types allowed
2. All props must be typed
3. All API responses must be typed
4. Use discriminated unions for variants

## 📚 Documentation

- [Architecture Overview](ARCHITECTURE.md) - Complete system architecture
- [Component Hierarchy](COMPONENT_HIERARCHY.md) - Visual component tree
- [Data Flow](DATA_FLOW.md) - How data moves through the application
- [Coding Standards](CODING_STANDARDS.md) - Development guidelines
- [API Integration](API_INTEGRATION.md) - Backend API documentation
- [Features](FEATURES.md) - Detailed feature documentation

## 🔧 Development

### Adding New Features
1. Create feature module in `features/`
2. Add presentational components in `components/`
3. Create custom hooks for business logic
4. Add types in domain-specific type files
5. Update documentation

### Code Quality
- All code must pass TypeScript checks
- ESLint rules enforced
- Components under 200 lines
- 100% type coverage
- Comprehensive error handling

## 🧪 Testing

### Unit Tests
```bash
npm run test
```

### Integration Tests
```bash
npm run test:integration
```

### E2E Tests
```bash
npm run test:e2e
```

## 📦 Deployment

### Development
```bash
npm run dev
```

### Production Build
```bash
npm run build
```

### Docker Deployment
```bash
docker-compose -f docker-compose.prod.yml up -d
```

## 🔒 Security

- Content Security Policy configured
- Input validation on all forms
- Secure file upload handling
- API authentication ready
- XSS protection enabled

## 📊 Performance

- Code splitting implemented
- Lazy loading for modals
- AG Grid virtualization
- Memoized expensive calculations
- Optimized bundle size

## 🤝 Contributing

1. Follow coding standards
2. Write comprehensive tests
3. Update documentation
4. Ensure type safety
5. Follow component architecture

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For questions or issues:
1. Check documentation
2. Review architecture guidelines
3. Check existing issues
4. Create new issue with details

---

**Built with enterprise-grade architecture principles for maintainability, scalability, and developer productivity.**