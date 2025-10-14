# 🚨 STRICT DEVELOPMENT RULES - ZERO TOLERANCE POLICY

## ⚠️ CRITICAL VIOLATIONS - IMMEDIATE REJECTION

### 1. FILE SIZE LIMITS (ABSOLUTE)
- **App.tsx**: MAXIMUM 20 lines - ONLY routing and providers
- **Container Components**: MAXIMUM 200 lines
- **Presentational Components**: MAXIMUM 100 lines
- **Custom Hooks**: MAXIMUM 150 lines
- **Service Files**: MAXIMUM 100 lines
- **Type Files**: MAXIMUM 200 lines

### 2. COMPONENT RESPONSIBILITY RULES
- **App.tsx**: ONLY imports, providers, and routing - NO business logic
- **Container Components**: ONLY state management and event handling
- **Presentational Components**: ONLY UI rendering - NO state, NO API calls
- **Custom Hooks**: ONLY business logic and state management
- **Services**: ONLY API calls and external integrations

### 3. ARCHITECTURE VIOLATIONS (ZERO TOLERANCE)
- ❌ **NEVER** put business logic in App.tsx
- ❌ **NEVER** put API calls in presentational components
- ❌ **NEVER** put UI logic in service files
- ❌ **NEVER** create files over 200 lines
- ❌ **NEVER** use 'any' types
- ❌ **NEVER** put multiple components in one file

## 🔒 MANDATORY CODE REVIEW CHECKLIST

### Pre-Commit Checklist (MANDATORY)
- [ ] App.tsx is under 20 lines
- [ ] All components under their size limits
- [ ] No business logic in presentational components
- [ ] All API calls in service layer
- [ ] All props explicitly typed
- [ ] No 'any' types used
- [ ] Component follows single responsibility principle
- [ ] File follows naming conventions
- [ ] Imports use path aliases (@/)

### Architecture Compliance Check
- [ ] Component hierarchy is max 4 levels deep
- [ ] Data flows down via props, events flow up via callbacks
- [ ] Business logic is in custom hooks
- [ ] External integrations are in service layer
- [ ] Types are in domain-specific files
- [ ] No prop drilling beyond 2 levels

## 📏 SIZE LIMIT ENFORCEMENT

### Automatic Rejection Triggers
```typescript
// ❌ REJECTED - App.tsx over 20 lines
export default function App() {
  // 21+ lines of code = IMMEDIATE REJECTION
}

// ❌ REJECTED - Component over 200 lines
export default function SomeComponent() {
  // 201+ lines = IMMEDIATE REJECTION
}

// ❌ REJECTED - Business logic in presentational component
export default function TableRow({ data }) {
  const [loading, setLoading] = useState(false); // ❌ NO STATE
  const handleSubmit = async () => { // ❌ NO API CALLS
    await api.post('/data', data);
  };
  return <div>...</div>;
}
```

### ✅ CORRECT PATTERNS
```typescript
// ✅ CORRECT - App.tsx under 20 lines
export default function App() {
  return (
    <ConfigProvider theme={themeConfig}>
      <JobTrackerPage />
    </ConfigProvider>
  );
}

// ✅ CORRECT - Container component under 200 lines
export default function NotionTable() {
  const { applications, createApplication } = useApplications();
  const { columns } = useColumns();
  
  const handleSubmit = async (data) => {
    await createApplication(data);
  };
  
  return (
    <div>
      <TableGrid data={applications} columns={columns} />
    </div>
  );
}

// ✅ CORRECT - Presentational component under 100 lines
interface TableRowProps {
  data: Application;
  onEdit: (id: string) => void;
}

export default function TableRow({ data, onEdit }: TableRowProps) {
  return (
    <div onClick={() => onEdit(data.id)}>
      {data.companyName}
    </div>
  );
}
```

## 🏗️ MANDATORY FILE STRUCTURE

### Directory Organization (NON-NEGOTIABLE)
```
src/
├── App.tsx (MAX 20 lines)
├── pages/
│   └── [PageName]/
│       ├── [PageName].tsx (MAX 200 lines)
│       └── index.ts
├── features/
│   └── [FeatureName]/
│       ├── [FeatureName].tsx (MAX 200 lines)
│       ├── components/ (MAX 100 lines each)
│       ├── hooks/ (MAX 150 lines each)
│       ├── modals/ (Container + Presentation)
│       └── index.ts
├── shared/
│   ├── components/ (MAX 100 lines each)
│   ├── hooks/ (MAX 150 lines each)
│   └── utils/ (MAX 100 lines each)
├── services/
│   ├── api/ (MAX 100 lines each)
│   └── [service].ts (MAX 100 lines)
├── types/
│   └── [domain].types.ts (MAX 200 lines each)
└── config/
    └── [config].ts (MAX 100 lines each)
```

## 🚫 FORBIDDEN PATTERNS

### 1. Monolithic Components
```typescript
// ❌ FORBIDDEN - Everything in one component
export default function JobTracker() {
  // 500+ lines of mixed concerns
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [columns, setColumns] = useState([]);
  const [modals, setModals] = useState({});
  
  // API calls
  const fetchApplications = async () => { /* ... */ };
  const createApplication = async () => { /* ... */ };
  
  // UI logic
  const handleClick = () => { /* ... */ };
  const renderTable = () => { /* ... */ };
  const renderModals = () => { /* ... */ };
  
  return (
    <div>
      {/* 200+ lines of JSX */}
    </div>
  );
}
```

### 2. Business Logic in UI Components
```typescript
// ❌ FORBIDDEN - API calls in presentational component
export default function TableRow({ data }) {
  const handleDelete = async () => {
    await fetch('/api/applications/' + data.id, { method: 'DELETE' });
  };
  
  return <div onClick={handleDelete}>{data.name}</div>;
}
```

### 3. Mixed Concerns
```typescript
// ❌ FORBIDDEN - Multiple responsibilities
export default function ApplicationManager() {
  // State management
  const [applications, setApplications] = useState([]);
  
  // API calls
  const fetchData = async () => { /* ... */ };
  
  // UI logic
  const renderTable = () => { /* ... */ };
  
  // Business logic
  const calculateStats = () => { /* ... */ };
  
  // File handling
  const uploadFile = async () => { /* ... */ };
  
  return <div>{/* ... */}</div>;
}
```

## ✅ ENFORCEMENT MECHANISMS

### 1. Pre-commit Hooks
```json
{
  "husky": {
    "hooks": {
      "pre-commit": "npm run lint && npm run size-check"
    }
  }
}
```

### 2. Size Check Script
```json
{
  "scripts": {
    "size-check": "node scripts/check-file-sizes.js"
  }
}
```

### 3. ESLint Rules
```json
{
  "rules": {
    "max-lines": ["error", { "max": 200, "skipBlankLines": true, "skipComments": true }],
    "max-lines-per-function": ["error", { "max": 50 }],
    "@typescript-eslint/no-explicit-any": "error"
  }
}
```

## 🎯 SUCCESS METRICS

### Code Quality Metrics
- **File Size Compliance**: 100% of files under limits
- **Component Separation**: 100% of components follow single responsibility
- **Type Safety**: 100% TypeScript coverage, 0 'any' types
- **Architecture Compliance**: 100% of code follows enterprise patterns

### Performance Metrics
- **Bundle Size**: < 2MB total
- **Component Render Time**: < 16ms per component
- **API Response Time**: < 500ms average
- **Build Time**: < 30 seconds

## 🚨 VIOLATION CONSEQUENCES

### Immediate Actions
1. **Code Review Rejection**: Any violation = immediate rejection
2. **Architecture Review**: Major violations require architecture team review
3. **Refactoring Required**: No exceptions, must be fixed before merge
4. **Documentation Update**: Violations require updating these rules

### Escalation Process
1. **First Violation**: Warning + mandatory refactoring
2. **Second Violation**: Architecture review required
3. **Third Violation**: Development process review
4. **Pattern Violations**: Team training required

## 📚 MANDATORY TRAINING

### Before Any Development
1. Read and understand this document
2. Complete architecture training
3. Pass component design quiz
4. Demonstrate proper file organization

### Ongoing Requirements
1. Weekly architecture reviews
2. Monthly code quality audits
3. Quarterly training updates
4. Annual architecture certification

---

## 🏆 EXCELLENCE STANDARDS

This is not just about following rules - it's about building **enterprise-grade software** that:
- Scales to millions of users
- Maintains performance under load
- Enables rapid feature development
- Supports team collaboration
- Reduces technical debt
- Improves developer experience

**Remember: Every line of code is a commitment to quality, maintainability, and scalability.**

