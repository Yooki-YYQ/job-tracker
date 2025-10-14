# Job Tracker - Enterprise Architecture

## Overview

The Job Tracker application follows enterprise-grade software architecture principles with strict separation of concerns, component hierarchy, and data flow patterns. This architecture ensures maintainability, scalability, and developer productivity.

## Architecture Principles

### 1. Strict Separation of Concerns
- **Presentational Components**: Pure UI components that receive props and render (no business logic)
- **Container Components**: Handle data fetching, state management, and pass props to presentational components
- **Service Layer**: All API calls and external integrations
- **Type Layer**: Centralized TypeScript interfaces and types
- **Utility Layer**: Reusable helper functions

### 2. Component Hierarchy
```
App.tsx (Routing + Global Providers)
└── pages/
    └── JobTrackerPage.tsx (Page-level container)
        └── NotionTable/ (Feature module)
            ├── NotionTable.tsx (Container component)
            ├── components/
            │   ├── TableHeader.tsx
            │   ├── TableToolbar.tsx
            │   ├── TableGrid.tsx
            │   └── AddPropertyButton.tsx
            ├── modals/
            │   ├── JobSubmissionModal/
            │   ├── AIConfirmationModal/
            │   ├── ApplicationDetailModal/
            │   └── ColumnManagerModal/
            └── hooks/
                ├── useApplications.ts
                ├── useColumns.ts
                └── useTableGrid.ts
```

### 3. Data Flow Architecture
- **Unidirectional data flow**: Data flows down via props, events flow up via callbacks
- **Custom hooks**: Encapsulate business logic and state management
- **Service layer**: All API calls abstracted in service modules
- **Type safety**: Every component, hook, and service fully typed

## Project Structure

```
frontend/src/
├── App.tsx (minimal - routing + providers only)
├── pages/
│   └── JobTrackerPage/
│       ├── JobTrackerPage.tsx
│       └── index.ts
├── features/
│   └── NotionTable/
│       ├── NotionTable.tsx
│       ├── components/
│       ├── modals/
│       ├── hooks/
│       └── index.ts
├── shared/
│   ├── components/ (reusable UI components)
│   ├── hooks/ (shared custom hooks)
│   └── utils/ (helper functions)
├── services/
│   ├── api/
│   │   ├── applicationApi.ts
│   │   ├── fileApi.ts
│   │   └── index.ts
│   ├── aiService.ts
│   └── index.ts
├── types/
│   ├── application.types.ts
│   ├── table.types.ts
│   ├── ai.types.ts
│   └── index.ts
├── config/
│   ├── theme.config.ts
│   └── constants.ts
└── styles/
    ├── global.css
    └── variables.css
```

## Technology Stack

### Frontend
- **React 19**: UI framework with latest features
- **TypeScript**: Type-safe development
- **Ant Design**: UI component library
- **AG Grid**: Excel-like data grid
- **Vite**: Build tool and development server

### Backend
- **Node.js**: Runtime environment
- **Express**: Web framework
- **Prisma**: Database ORM
- **PostgreSQL**: Relational database

### Development Tools
- **ESLint**: Code linting
- **Prettier**: Code formatting
- **TypeScript**: Static type checking

## Component Architecture

### App.tsx (18 lines)
```typescript
import { ConfigProvider } from 'antd';
import { themeConfig } from '@/config/theme.config';
import { JobTrackerPage } from '@/pages';
import '@/styles';

export default function App() {
  return (
    <ConfigProvider theme={themeConfig}>
      <JobTrackerPage />
    </ConfigProvider>
  );
}
```

**Responsibilities**:
- Global theme configuration
- Global style imports
- Main page rendering
- **No business logic**

### JobTrackerPage (8 lines)
```typescript
import { NotionTable } from '@/features/NotionTable';

export default function JobTrackerPage() {
  return (
    <div className="job-tracker-page">
      <NotionTable />
    </div>
  );
}
```

**Responsibilities**:
- Page-level layout
- Route-specific setup
- **No business logic**

### NotionTable (Container Component)
```typescript
export default function NotionTable() {
  const { applications, loading, createApplication } = useApplications();
  const { columns, addColumn } = useColumns();
  const { columnDefs, defaultColDef } = useTableGrid(columns);
  
  // Event handlers and state management
  
  return (
    <div className="notion-table">
      <TableHeader title="Job Tracker" />
      <TableToolbar onAddRecord={handleAddRecord} />
      <TableGrid data={applications} columnDefs={columnDefs} />
      <AddPropertyButton onAddProperty={handleAddProperty} />
    </div>
  );
}
```

**Responsibilities**:
- State management coordination
- Event handling
- Modal state management
- Data flow orchestration

## Service Layer Architecture

### API Services
```typescript
// services/api/applicationApi.ts
export const applicationApi = {
  getAll: async (): Promise<Application[]> => { ... },
  getById: async (id: string): Promise<Application> => { ... },
  create: async (data: CreateApplicationDTO): Promise<Application> => { ... },
  update: async (id: string, data: UpdateApplicationDTO): Promise<Application> => { ... },
  delete: async (id: string): Promise<void> => { ... }
};
```

### AI Service
```typescript
// services/aiService.ts
export const aiService = {
  parseJobWithAI: async (jobDescription: string): Promise<AIParseResult> => { ... },
  parseJobWithMock: async (jobDescription: string): Promise<AIParseResult> => { ... },
  testAIConnection: async (config: AIConfig): Promise<boolean> => { ... }
};
```

## Custom Hooks Architecture

### useApplications Hook
```typescript
export function useApplications() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const loadApplications = useCallback(async () => { ... });
  const createApplication = useCallback(async (data) => { ... });
  const updateApplication = useCallback(async (id, data) => { ... });
  const deleteApplication = useCallback(async (id) => { ... });

  return {
    applications,
    loading,
    error,
    createApplication,
    updateApplication,
    deleteApplication,
    refreshApplications: loadApplications
  };
}
```

### useColumns Hook
```typescript
export function useColumns() {
  const [columns, setColumns] = useState<ColumnDefinition[]>(DEFAULT_COLUMNS);
  
  const addColumn = useCallback((column) => { ... });
  const updateColumn = useCallback((id, updates) => { ... });
  const removeColumn = useCallback((id) => { ... });

  return { columns, addColumn, updateColumn, removeColumn };
}
```

## Type System Architecture

### Domain-Specific Types
```typescript
// types/application.types.ts
export interface Application {
  id: string;
  companyName: string;
  positionTitle: string;
  // ... other fields
}

// types/table.types.ts
export interface ColumnDefinition {
  id: string;
  name: string;
  type: ColumnType;
  // ... other fields
}

// types/ai.types.ts
export interface AIConfig {
  apiKey: string;
  model: string;
  temperature: number;
  customPrompt: string;
}
```

## Data Flow Architecture

### 1. Initial Data Loading
```
Component Mount → useApplications() → applicationApi.getAll() → setApplications() → Re-render
```

### 2. User Interaction Flow
```
User Click → Presentational Component → Container Handler → Hook Function → API Call → State Update → Re-render
```

### 3. Error Handling Flow
```
API Error → Service Layer → Hook Error State → Container Error State → UI Error Display
```

## Configuration Architecture

### Theme Configuration
```typescript
// config/theme.config.ts
export const themeConfig = {
  algorithm: theme.defaultAlgorithm,
  token: {
    colorPrimary: '#1890ff',
    borderRadius: 6,
  },
};
```

### Constants
```typescript
// config/constants.ts
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
export const APPLICATION_STATUSES = ['APPLIED', 'INTERVIEW_SCHEDULED', ...] as const;
export const TABLE_CONFIG = { ROW_HEIGHT: 40, HEADER_HEIGHT: 40, ... } as const;
```

## Styling Architecture

### Global Styles
```css
/* styles/global.css */
* { margin: 0; padding: 0; box-sizing: border-box; }
body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
```

### CSS Variables
```css
/* styles/variables.css */
:root {
  --color-primary: #1890ff;
  --color-success: #52c41a;
  --spacing-md: 16px;
  --font-size-md: 16px;
}
```

## Performance Architecture

### Memoization Strategy
```typescript
// Expensive calculations
const columnDefs = useMemo(() => createColumnDefs(columns), [columns]);

// Event handlers
const handleRowClick = useCallback((event) => { ... }, []);
```

### Lazy Loading
- Modal components loaded on demand
- Large datasets virtualized in AG Grid
- File uploads chunked for large files

## Error Handling Architecture

### Error Boundaries
```typescript
// Error boundary for component errors
<ErrorBoundary fallback={<ErrorFallback />}>
  <NotionTable />
</ErrorBoundary>
```

### API Error Handling
```typescript
// Consistent error handling in services
try {
  const response = await api.get('/api/applications');
  return response.data;
} catch (error) {
  console.error('API Error:', error);
  throw new Error('Failed to load applications');
}
```

## Security Architecture

### API Security
- Request/response interceptors
- Authentication token handling
- CORS configuration
- Input validation

### Client Security
- Content Security Policy
- XSS protection
- Secure file uploads
- Input sanitization

## Testing Architecture

### Unit Tests
- Custom hooks testing
- Service layer testing
- Utility function testing
- Component testing

### Integration Tests
- API integration testing
- Component integration testing
- End-to-end testing

## Deployment Architecture

### Development
- Vite development server
- Hot module replacement
- Source maps
- Development tools

### Production
- Optimized bundle
- Code splitting
- Asset optimization
- Performance monitoring

## Monitoring Architecture

### Error Tracking
- Console error logging
- API error tracking
- User error reporting
- Performance monitoring

### Analytics
- User interaction tracking
- Performance metrics
- Feature usage analytics
- Error rate monitoring

## Future Architecture Enhancements

### Real-time Features
- WebSocket integration
- Real-time data updates
- Collaborative editing
- Live notifications

### Offline Support
- Service worker implementation
- Offline data caching
- Background sync
- Conflict resolution

### Microservices
- API gateway
- Service discovery
- Load balancing
- Circuit breakers

## Architecture Benefits

### Maintainability
- Clear separation of concerns
- Single responsibility principle
- Easy to locate and modify code
- Consistent patterns

### Scalability
- Feature-based organization
- Reusable components
- Modular architecture
- Performance optimization

### Developer Experience
- Clear file structure
- Type safety throughout
- Consistent naming conventions
- Comprehensive documentation

### Quality Assurance
- Strict TypeScript usage
- Comprehensive error handling
- Performance optimization
- Security best practices

## Architecture Decision Records (ADRs)

### ADR-001: Component Architecture
**Decision**: Use container/presentational component pattern
**Rationale**: Clear separation of concerns, easier testing, better maintainability
**Status**: Implemented

### ADR-002: State Management
**Decision**: Use custom hooks for state management
**Rationale**: Encapsulates business logic, reusable, follows React patterns
**Status**: Implemented

### ADR-003: Type System
**Decision**: Domain-specific type files with strict TypeScript
**Rationale**: Better organization, type safety, easier maintenance
**Status**: Implemented

### ADR-004: Service Layer
**Decision**: Separate API services from business logic
**Rationale**: Reusable, testable, clear separation of concerns
**Status**: Implemented

This architecture provides a solid foundation for building and maintaining a high-quality, scalable job tracking application.