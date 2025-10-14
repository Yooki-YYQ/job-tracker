# Component Hierarchy

## Visual Component Tree

```
App.tsx (18 lines)
├── ConfigProvider (Ant Design theme)
└── JobTrackerPage
    └── NotionTable (Container Component)
        ├── TableHeader (Presentational)
        ├── TableToolbar (Presentational)
        ├── TableGrid (Presentational)
        ├── AddPropertyButton (Presentational)
        └── Modals (Future Implementation)
            ├── JobSubmissionModal
            ├── AIConfirmationModal
            ├── ApplicationDetailModal
            └── ColumnManagerModal
```

## Component Responsibilities

### App.tsx
- **Purpose**: Application root with global providers
- **Lines**: 18 (target: <20)
- **Responsibilities**:
  - Configure Ant Design theme
  - Import global styles
  - Render main page component
- **No Business Logic**: ✅

### JobTrackerPage
- **Purpose**: Page-level container
- **Lines**: 8 (target: <50)
- **Responsibilities**:
  - Page-level layout
  - Route-specific setup
- **No Business Logic**: ✅

### NotionTable (Container)
- **Purpose**: Feature-level container
- **Lines**: 65 (target: <200)
- **Responsibilities**:
  - State management coordination
  - Event handling
  - Modal state management
  - Data flow orchestration
- **Business Logic**: ✅ (via hooks)

### Presentational Components

#### TableHeader
- **Purpose**: Top navigation bar
- **Lines**: 35 (target: <50)
- **Props**: `title: string`
- **No Business Logic**: ✅

#### TableToolbar
- **Purpose**: Action buttons and page title
- **Lines**: 45 (target: <50)
- **Props**: `onAddRecord: () => void`, `onRefresh: () => void`
- **No Business Logic**: ✅

#### TableGrid
- **Purpose**: AG Grid wrapper
- **Lines**: 55 (target: <100)
- **Props**: Data, column definitions, event handlers
- **No Business Logic**: ✅

#### AddPropertyButton
- **Purpose**: Add column button
- **Lines**: 25 (target: <30)
- **Props**: `onAddProperty: () => void`
- **No Business Logic**: ✅

## Custom Hooks

### useApplications
- **Purpose**: Application data management
- **Returns**: Data, loading state, CRUD operations
- **Business Logic**: ✅

### useColumns
- **Purpose**: Column configuration management
- **Returns**: Column state, add/update/remove operations
- **Business Logic**: ✅

### useTableGrid
- **Purpose**: AG Grid configuration
- **Returns**: Column definitions, event handlers
- **Business Logic**: ✅

## Service Layer

### applicationApi
- **Purpose**: Application CRUD operations
- **Methods**: getAll, getById, create, update, delete
- **No UI Logic**: ✅

### fileApi
- **Purpose**: File upload/download operations
- **Methods**: uploadFiles, getFiles, downloadFile, deleteFile
- **No UI Logic**: ✅

### aiService
- **Purpose**: AI parsing functionality
- **Methods**: parseJobWithAI, parseJobWithMock, testAIConnection
- **No UI Logic**: ✅

## Type System

### Domain Types
- **application.types.ts**: Application, ApplicationFile, DTOs
- **table.types.ts**: ColumnDefinition, TableConfig, CellProps
- **ai.types.ts**: AIConfig, ParsedJobData, AIParseResult

### Configuration
- **theme.config.ts**: Ant Design theme configuration
- **constants.ts**: Application constants and enums

## Data Flow

### Downward Flow (Props)
1. App → JobTrackerPage → NotionTable
2. NotionTable → Presentational Components
3. Hooks → Container Components

### Upward Flow (Events)
1. Presentational Components → NotionTable
2. NotionTable → Hooks
3. Hooks → Services

### Side Effects
1. Services → API calls
2. Hooks → State updates
3. Components → Re-renders

## Future Modal Structure

### JobSubmissionModal
```
JobSubmissionModal (Container)
├── JobSubmissionForm (Presentation)
├── FileUpload (Presentation)
└── JobDescriptionInput (Presentation)
```

### AIConfirmationModal
```
AIConfirmationModal (Container)
├── AIConfirmationForm (Presentation)
├── ParsedDataDisplay (Presentation)
└── EditForm (Presentation)
```

### ApplicationDetailModal
```
ApplicationDetailModal (Container)
├── ApplicationDetailView (Presentation)
├── FileList (Presentation)
└── EditForm (Presentation)
```

### ColumnManagerModal
```
ColumnManagerModal (Container)
├── ColumnManagerForm (Presentation)
├── ColumnList (Presentation)
└── AddColumnForm (Presentation)
```

## Architecture Benefits

### Maintainability
- Clear separation of concerns
- Single responsibility principle
- Easy to locate and modify code

### Testability
- Pure presentational components
- Isolated business logic in hooks
- Mockable service layer

### Scalability
- Feature-based organization
- Reusable components
- Consistent patterns

### Developer Experience
- Clear file structure
- Type safety throughout
- Consistent naming conventions
