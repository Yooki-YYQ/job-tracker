# Data Flow Architecture

## Overview

The application follows a strict unidirectional data flow pattern with clear separation between data sources, state management, and UI components.

## Data Flow Diagram

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Database      │    │   API Services  │    │   Custom Hooks  │
│   (PostgreSQL)  │◄──►│   (applicationApi)│◄──►│ (useApplications)│
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                                        │
                                                        ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   UI Components │◄──►│ Container Comp. │◄──►│   State Store   │
│ (Presentational)│    │ (NotionTable)   │    │ (React State)   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## Data Flow Layers

### 1. Data Source Layer
**Location**: `services/api/`
**Purpose**: External data access and API communication

#### applicationApi.ts
```typescript
// Data flows OUT to database
createApplication(data) → POST /api/applications → Database
updateApplication(id, data) → PUT /api/applications/:id → Database
deleteApplication(id) → DELETE /api/applications/:id → Database

// Data flows IN from database
getAll() → GET /api/applications ← Database
getById(id) → GET /api/applications/:id ← Database
```

#### fileApi.ts
```typescript
// File operations
uploadFiles(applicationId, files) → POST /api/applications/:id/files
getFiles(applicationId) → GET /api/applications/:id/files
downloadFile(fileId) → GET /api/applications/files/:id/download
deleteFile(fileId) → DELETE /api/applications/files/:id
```

### 2. State Management Layer
**Location**: `features/NotionTable/hooks/`
**Purpose**: Business logic and state management

#### useApplications Hook
```typescript
// State Management
const [applications, setApplications] = useState<Application[]>([])
const [loading, setLoading] = useState(true)
const [error, setError] = useState<Error | null>(null)

// Data Flow Operations
loadApplications() → applicationApi.getAll() → setApplications()
createApplication(data) → applicationApi.create() → setApplications(prev => [...prev, newApp])
updateApplication(id, data) → applicationApi.update() → setApplications(prev => prev.map(...))
deleteApplication(id) → applicationApi.delete() → setApplications(prev => prev.filter(...))
```

#### useColumns Hook
```typescript
// Column State Management
const [columns, setColumns] = useState<ColumnDefinition[]>(DEFAULT_COLUMNS)

// Column Operations
addColumn(column) → setColumns(prev => [...prev, column])
updateColumn(id, updates) → setColumns(prev => prev.map(...))
removeColumn(id) → setColumns(prev => prev.filter(...))
```

### 3. Container Component Layer
**Location**: `features/NotionTable/NotionTable.tsx`
**Purpose**: Orchestrates data flow and coordinates components

```typescript
// Data Flow Coordination
const { applications, loading, createApplication, updateApplication } = useApplications()
const { columns, addColumn, updateColumn } = useColumns()
const { columnDefs, defaultColDef } = useTableGrid(columns)

// Event Handling
handleRowClick(event) → setSelectedAppId(event.data.id)
handleAddRecord() → setIsSubmissionModalOpen(true)
```

### 4. Presentational Component Layer
**Location**: `features/NotionTable/components/`
**Purpose**: Pure UI rendering with props and callbacks

#### Data Flow Pattern
```typescript
// Props Flow Down
<TableGrid 
  data={applications}           // Data from container
  columnDefs={columnDefs}       // Configuration from container
  loading={loading}             // State from container
  onRowClick={handleRowClick}   // Callback to container
/>

// Events Flow Up
onRowClick={(event) => handleRowClick(event)}  // Event to container
onAddRecord={() => handleAddRecord()}          // Action to container
```

## Data Flow Patterns

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

### 4. Loading State Flow
```
API Call Start → Hook Loading State → Container Loading State → UI Loading Indicator
API Call End → Hook Loading State → Container Loading State → UI Content Display
```

## State Management Strategy

### Local Component State
- **Modal visibility**: `useState` in container components
- **Form data**: `useState` in form components
- **UI state**: `useState` in presentational components

### Custom Hook State
- **Application data**: `useApplications` hook
- **Column configuration**: `useColumns` hook
- **Table configuration**: `useTableGrid` hook

### Global State (Future)
- **User authentication**: Context API or state management library
- **Theme preferences**: Context API
- **Application settings**: Local storage with React state

## Data Validation Flow

### Input Validation
```
User Input → Form Validation → API Validation → Database Constraints → Error Response
```

### Type Safety
```
TypeScript Types → Runtime Validation → API Response Validation → Component Props Validation
```

## Performance Optimization

### Data Caching
- **API responses**: Cached in React state
- **Column definitions**: Cached in localStorage
- **AI configurations**: Cached in localStorage

### Memoization
```typescript
// Expensive calculations
const columnDefs = useMemo(() => createColumnDefs(columns), [columns])

// Event handlers
const handleRowClick = useCallback((event) => { ... }, [])
```

### Lazy Loading
- **Modal components**: Lazy loaded when needed
- **Large datasets**: Virtualized in AG Grid
- **File uploads**: Chunked uploads for large files

## Error Boundaries

### Error Flow
```
Component Error → Error Boundary → Fallback UI → Error Logging → User Notification
```

### Error Recovery
```
API Error → Retry Logic → Fallback Data → User Notification → Manual Refresh Option
```

## Future Data Flow Enhancements

### Real-time Updates
```
WebSocket Connection → Real-time Data → State Update → UI Re-render
```

### Offline Support
```
Network Status → Offline Detection → Local Storage → Sync Queue → Background Sync
```

### Data Synchronization
```
Multiple Devices → Conflict Resolution → Data Merging → State Update → UI Sync
```

## Data Flow Best Practices

### 1. Single Source of Truth
- Each piece of data has one authoritative source
- State flows down, events flow up
- No duplicate state management

### 2. Predictable State Updates
- All state changes go through defined functions
- Immutable state updates
- Clear state transition paths

### 3. Error Handling
- Errors are caught at the appropriate layer
- User-friendly error messages
- Graceful degradation

### 4. Performance
- Minimize unnecessary re-renders
- Use appropriate memoization
- Optimize data fetching patterns

### 5. Type Safety
- All data flows are typed
- Runtime validation where needed
- Clear interfaces between layers
