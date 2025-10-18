# 🎯 Job Tracker - Professional Job Application Management System

A modern, enterprise-grade job application tracking system built with React, Node.js, and AI-powered features. Track your job applications with a Notion-style interface, AI-powered job description parsing, and seamless file management.

![Job Tracker](https://img.shields.io/badge/Status-Active-brightgreen)
![React](https://img.shields.io/badge/React-19-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-100%25-blue)
![Node.js](https://img.shields.io/badge/Node.js-Express-green)

## ✨ Key Features

### 🎨 **Notion-Style Interface**
- Excel-like table with resizable columns
- Real-time data updates
- Drag-and-drop column reordering
- Inline editing capabilities

### 🤖 **AI-Powered Parsing**
- Automatic extraction of job details from descriptions
- OpenAI integration for smart data parsing
- Customizable AI prompts
- Manual override and validation

### 📁 **File Management**
- Upload CV, cover letters, and documents
- Google Drive integration for cloud storage
- File preview and download
- Organized file categorization

### 📊 **Advanced Tracking**
- Custom status workflows
- Application timeline tracking
- Company and position analytics
- Export capabilities (CSV, Excel)

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- Docker Desktop
- npm or yarn

### 1. Clone the Repository
```bash
git clone https://github.com/Yooki-YYQ/job-tracker.git
cd job-tracker
```

### 2. Start the Database
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

### 5. Access the Application
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000
- **Database Admin**: http://localhost:8080

## 🏗️ Architecture

### Frontend Stack
- **React 19** - Latest React with concurrent features
- **TypeScript** - Full type safety
- **Ant Design** - Professional UI components
- **AG Grid** - Excel-like data grid
- **Vite** - Fast build tool

### Backend Stack
- **Node.js + Express** - RESTful API
- **Prisma ORM** - Type-safe database access
- **PostgreSQL** - Relational database
- **Multer** - File upload handling

### Development Tools
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **Docker** - Database containerization

## 📋 Default Columns

| Column | Description | Type |
|--------|-------------|------|
| **ID** | Unique identifier | Auto-generated |
| **Date** | Application date | Auto-generated |
| **Position** | Job title | AI-extracted |
| **Company** | Company name | AI-extracted |
| **Status** | Application status | Select |
| **URL** | Job posting link | URL |
| **Job Description** | Full job description | Text |
| **Requirements** | Job requirements | AI-extracted |
| **CV** | Resume file | File |
| **CL** | Cover letter file | File |
| **Pay** | Salary information | AI-extracted |
| **Notes** | Personal notes | Text |

## 🤖 AI Integration

### Supported AI Providers
- **OpenAI GPT** - Primary AI provider
- **Claude** - Alternative AI provider
- **Gemini** - Google's AI model

### AI Features
- **Smart Parsing** - Extract structured data from job descriptions
- **Custom Prompts** - Configure AI prompts for better accuracy
- **Confidence Scoring** - AI confidence levels for parsed data
- **Manual Override** - Edit AI-parsed data before saving

### Setup AI
1. Get API key from your preferred AI provider
2. Add to environment variables:
   ```env
   OPENAI_API_KEY=your-api-key-here
   ```
3. Configure AI settings in the application

## 📁 Project Structure

```
job-tracker/
├── frontend/                 # React frontend application
│   ├── src/
│   │   ├── features/        # Feature-based modules
│   │   │   └── NotionTable/ # Main table feature
│   │   ├── services/        # API and external services
│   │   ├── types/          # TypeScript type definitions
│   │   └── components/     # Reusable components
├── backend/                 # Node.js backend API
│   ├── src/
│   │   ├── controllers/    # API controllers
│   │   ├── routes/         # API routes
│   │   └── config/         # Configuration files
│   └── prisma/             # Database schema and migrations
├── docs/                   # Comprehensive documentation
├── infra/                  # Docker and infrastructure
└── scripts/                # Utility scripts
```

## 🔧 Development

### Code Quality Standards
- **TypeScript** - 100% type coverage
- **ESLint** - Strict linting rules
- **Component Size** - Max 200 lines per component
- **Architecture** - Strict separation of concerns

### Adding New Features
1. Create feature module in `frontend/src/features/`
2. Add presentational components in `components/`
3. Create custom hooks for business logic
4. Add types in domain-specific type files
5. Update documentation

### Running Tests
```bash
# Frontend tests
cd frontend
npm run test

# Backend tests
cd backend
npm run test
```

## 📚 Documentation

- [Architecture Overview](docs/ARCHITECTURE.md) - Complete system architecture
- [Component Hierarchy](docs/COMPONENT_HIERARCHY.md) - Visual component tree
- [Data Flow](docs/DATA_FLOW.md) - How data moves through the application
- [Coding Standards](docs/CODING_STANDARDS.md) - Development guidelines
- [Features](docs/FEATURES.md) - Detailed feature documentation
- [Development Setup](docs/DEVELOPMENT_SETUP.md) - Setup instructions

## 🚀 Deployment

### Production Build
```bash
# Build frontend
cd frontend
npm run build

# Build backend
cd backend
npm run build
```

### Docker Deployment
```bash
docker-compose -f docker-compose.prod.yml up -d
```

## 🔒 Security Features

- **Content Security Policy** - Configured for XSS protection
- **Input Validation** - All forms validated
- **Secure File Upload** - File type and size validation
- **API Authentication** - Ready for authentication implementation
- **Environment Variables** - Sensitive data protection

## 📊 Performance

- **Code Splitting** - Lazy loading for better performance
- **Virtual Scrolling** - Handle large datasets efficiently
- **Memoization** - Optimized expensive calculations
- **Bundle Optimization** - Minimized bundle size

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow the established architecture patterns
- Write comprehensive tests
- Update documentation
- Ensure type safety
- Follow component size limits

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

### Getting Help
1. Check the [documentation](docs/)
2. Review [existing issues](https://github.com/Yooki-YYQ/job-tracker/issues)
3. Create a [new issue](https://github.com/Yooki-YYQ/job-tracker/issues/new) with detailed information

### Common Issues
- **Database connection issues** - Check Docker is running
- **AI parsing not working** - Verify API keys are set
- **File upload issues** - Check file size and type limits

## 🎯 Roadmap

### Phase 1 (Current)
- ✅ Core table functionality
- ✅ AI-powered parsing
- ✅ File management
- ✅ Google Drive integration

### Phase 2 (Planned)
- 🔄 Advanced analytics
- 🔄 Mobile responsiveness
- 🔄 Workflow automation
- 🔄 Enhanced customization

### Phase 3 (Future)
- ⏳ Mobile app
- ⏳ Advanced AI features
- ⏳ Enterprise features
- ⏳ Third-party integrations

---

**Built with ❤️ for job seekers who want to stay organized and efficient in their job search journey.**

[![GitHub stars](https://img.shields.io/github/stars/Yooki-YYQ/job-tracker?style=social)](https://github.com/Yooki-YYQ/job-tracker/stargazers)
[![GitHub forks](https://img.shields.io/github/forks/Yooki-YYQ/job-tracker?style=social)](https://github.com/Yooki-YYQ/job-tracker/network)
[![GitHub issues](https://img.shields.io/github/issues/Yooki-YYQ/job-tracker)](https://github.com/Yooki-YYQ/job-tracker/issues)