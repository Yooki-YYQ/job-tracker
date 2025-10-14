# Coding Standards

## Component Rules
1. Every component must be in its own file
2. Container components handle logic, presentational components handle UI
3. Maximum 200 lines per component (split if larger)
4. Props must be explicitly typed with interfaces

## Naming Conventions
- Components: PascalCase (e.g., TableHeader.tsx)
- Hooks: camelCase with 'use' prefix (e.g., useApplications.ts)
- Types: PascalCase with descriptive names (e.g., ApplicationStatus)
- Services: camelCase (e.g., applicationApi.ts)

## File Organization
- One component per file
- Co-locate related files (component + styles + tests)
- Index files for clean imports

## Data Flow Rules
1. Props flow down, events flow up
2. No prop drilling beyond 2 levels (use context/hooks)
3. All API calls in service layer
4. All business logic in hooks

## Type Safety Rules
1. No 'any' types allowed
2. All props must be typed
3. All API responses must be typed
4. Use discriminated unions for variants

## Architecture Principles

### Separation of Concerns
- **Presentational Components**: Pure UI components that receive props and render (no business logic)
- **Container Components**: Handle data fetching, state management, and pass props to presentational components
- **Service Layer**: All API calls and external integrations
- **Type Layer**: Centralized TypeScript interfaces and types
- **Utility Layer**: Reusable helper functions

### Component Hierarchy
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

### Data Flow Architecture
- **Unidirectional data flow**: Data flows down via props, events flow up via callbacks
- **Custom hooks**: Encapsulate business logic and state management
- **Service layer**: All API calls abstracted in service modules
- **Type safety**: Every component, hook, and service fully typed

## File Structure Standards

### Directory Organization
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

## Import/Export Standards

### Path Aliases
- Use `@/` prefix for all internal imports
- Examples: `@/types`, `@/services`, `@/features/NotionTable`

### Barrel Exports
- Every directory should have an `index.ts` file
- Export all public APIs from index files
- Use named exports, not default exports for utilities

### Import Order
1. React and external libraries
2. Internal services and utilities
3. Types (with `type` keyword)
4. Relative imports

## Error Handling Standards

### API Errors
- All API calls must have try-catch blocks
- Use consistent error handling patterns
- Log errors to console in development
- Show user-friendly error messages

### Component Errors
- Use Error Boundaries for component error handling
- Validate props with TypeScript
- Handle loading and error states explicitly

## Performance Standards

### Component Optimization
- Use React.memo for expensive components
- Use useMemo and useCallback appropriately
- Avoid unnecessary re-renders
- Keep components small and focused

### Bundle Optimization
- Use dynamic imports for large components
- Tree-shake unused code
- Optimize images and assets
- Use code splitting for routes

## Testing Standards

### Unit Tests
- Test all custom hooks
- Test utility functions
- Test service layer functions
- Aim for 80%+ code coverage

### Component Tests
- Test component rendering
- Test user interactions
- Test prop variations
- Use React Testing Library

## Documentation Standards

### Code Documentation
- Document all public APIs
- Use JSDoc for complex functions
- Document component props with TypeScript
- Keep README files updated

### Architecture Documentation
- Document design decisions
- Keep architecture diagrams current
- Document data flow patterns
- Maintain component hierarchy docs

## Git Standards

### Commit Messages
- Use conventional commit format
- Be descriptive and concise
- Reference issues when applicable
- Use present tense

### Branch Naming
- Use feature/ prefix for new features
- Use fix/ prefix for bug fixes
- Use refactor/ prefix for refactoring
- Use docs/ prefix for documentation

## Code Review Standards

### Review Checklist
- [ ] Follows naming conventions
- [ ] Has proper TypeScript types
- [ ] Follows component architecture
- [ ] Has appropriate error handling
- [ ] Includes tests if applicable
- [ ] Updates documentation if needed
- [ ] Follows performance best practices

### Review Process
- All code must be reviewed before merging
- Address all review comments
- Ensure CI/CD passes
- Test functionality manually
- Verify no breaking changes
