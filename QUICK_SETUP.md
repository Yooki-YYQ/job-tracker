# 🚀 Quick Setup Guide

## 1. Fix CSP Error (Frontend)
The CSP error has been fixed in `vite.config.ts`. Restart your frontend server:

```bash
cd frontend
npm run dev
```

## 2. Fix Backend Database Issues

### Option A: Use the Setup Script (Recommended)
```bash
# Run the database setup script
.\setup-database.ps1
```

### Option B: Manual Setup
```bash
# 1. Start Docker
cd infra
docker-compose up -d

# 2. Reset database
cd ..\backend
npx prisma migrate reset --force

# 3. Generate client
npx prisma generate

# 4. Run migrations
npx prisma migrate dev --name init

# 5. Start backend
npm run dev
```

## 3. Start Frontend
```bash
cd frontend
npm run dev
```

## 4. Verify Everything Works
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000/api/applications
- **Database Admin**: http://localhost:8080

## 5. Enforce Strict Development Rules

### Before Any Development
```bash
# Run strict linting
npm run lint:strict

# Check file sizes
npm run size-check

# Run pre-commit checks
npm run pre-commit
```

### File Size Limits (ABSOLUTE)
- **App.tsx**: MAX 20 lines
- **Container Components**: MAX 200 lines
- **Presentational Components**: MAX 100 lines
- **Custom Hooks**: MAX 150 lines
- **Service Files**: MAX 100 lines

## 🚨 ZERO TOLERANCE POLICY

### Immediate Rejection Triggers
- App.tsx over 20 lines
- Any component over 200 lines
- Business logic in presentational components
- API calls outside service layer
- Use of 'any' types
- Multiple components in one file

### Architecture Rules
- Container components handle logic
- Presentational components handle UI only
- All API calls in service layer
- All business logic in custom hooks
- Maximum 4 levels of component hierarchy

## 📚 Required Reading
1. [STRICT_DEVELOPMENT_RULES.md](docs/STRICT_DEVELOPMENT_RULES.md)
2. [ARCHITECTURE.md](docs/ARCHITECTURE.md)
3. [COMPONENT_HIERARCHY.md](docs/COMPONENT_HIERARCHY.md)
4. [DATA_FLOW.md](docs/DATA_FLOW.md)

## 🎯 Success Criteria
- ✅ Frontend loads without CSP errors
- ✅ Backend API responds correctly
- ✅ Database schema is up to date
- ✅ All files under size limits
- ✅ Architecture rules followed
- ✅ Zero linting errors

---

**Remember: This is enterprise-grade software. Every line of code must meet the highest standards.**

