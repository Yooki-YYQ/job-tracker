# Data Schema Documentation

This document outlines the complete data schema for the Job Application Tracker, including database structure, Google Drive organization, and data relationships.

## 🗄️ Database Schema

### Core Tables

#### Applications Table
```sql
CREATE TABLE applications (
    id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
    company_name TEXT NOT NULL,
    position_title TEXT NOT NULL,
    job_url TEXT,
    application_date DATETIME,
    status TEXT DEFAULT 'APPLIED' CHECK (status IN (
        'APPLIED', 'INTERVIEW_SCHEDULED', 'INTERVIEWED', 
        'OFFER_RECEIVED', 'REJECTED', 'WITHDRAWN', 'ACCEPTED'
    )),
    notes TEXT,
    location TEXT,
    salary TEXT,
    job_type TEXT,
    job_description TEXT,
    qualifications TEXT,
    confidence REAL CHECK (confidence >= 0 AND confidence <= 1),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    google_drive_id TEXT,
    sync_status TEXT DEFAULT 'pending' CHECK (sync_status IN (
        'pending', 'synced', 'error', 'conflict'
    )),
    sync_error TEXT,
    last_sync_at DATETIME
);

-- Indexes for performance
CREATE INDEX idx_applications_status ON applications(status);
CREATE INDEX idx_applications_company ON applications(company_name);
CREATE INDEX idx_applications_date ON applications(application_date);
CREATE INDEX idx_applications_sync_status ON applications(sync_status);
CREATE INDEX idx_applications_created_at ON applications(created_at);
```

#### Application Files Table
```sql
CREATE TABLE application_files (
    id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
    application_id TEXT NOT NULL,
    file_name TEXT NOT NULL,
    original_name TEXT NOT NULL,
    file_type TEXT NOT NULL,
    file_size INTEGER NOT NULL,
    mime_type TEXT NOT NULL,
    file_path TEXT,
    google_drive_id TEXT,
    google_drive_url TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    sync_status TEXT DEFAULT 'pending' CHECK (sync_status IN (
        'pending', 'synced', 'error', 'conflict'
    )),
    sync_error TEXT,
    last_sync_at DATETIME,
    FOREIGN KEY (application_id) REFERENCES applications(id) ON DELETE CASCADE
);

-- Indexes
CREATE INDEX idx_application_files_app_id ON application_files(application_id);
CREATE INDEX idx_application_files_type ON application_files(file_type);
CREATE INDEX idx_application_files_sync_status ON application_files(sync_status);
```

#### Custom Columns Table
```sql
CREATE TABLE custom_columns (
    id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
    column_name TEXT NOT NULL UNIQUE,
    column_type TEXT NOT NULL CHECK (column_type IN (
        'text', 'number', 'date', 'select', 'url', 'file', 'boolean'
    )),
    column_options TEXT, -- JSON string for select options
    is_required BOOLEAN DEFAULT FALSE,
    is_editable BOOLEAN DEFAULT TRUE,
    default_value TEXT,
    validation_rules TEXT, -- JSON string for validation rules
    display_order INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    google_drive_id TEXT,
    sync_status TEXT DEFAULT 'pending'
);

-- Indexes
CREATE INDEX idx_custom_columns_name ON custom_columns(column_name);
CREATE INDEX idx_custom_columns_order ON custom_columns(display_order);
```

#### Custom Column Values Table
```sql
CREATE TABLE custom_column_values (
    id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
    application_id TEXT NOT NULL,
    column_id TEXT NOT NULL,
    value TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (application_id) REFERENCES applications(id) ON DELETE CASCADE,
    FOREIGN KEY (column_id) REFERENCES custom_columns(id) ON DELETE CASCADE,
    UNIQUE(application_id, column_id)
);

-- Indexes
CREATE INDEX idx_custom_column_values_app_id ON custom_column_values(application_id);
CREATE INDEX idx_custom_column_values_column_id ON custom_column_values(column_id);
```

#### Sync Log Table
```sql
CREATE TABLE sync_log (
    id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
    operation TEXT NOT NULL CHECK (operation IN (
        'create', 'update', 'delete', 'sync', 'backup'
    )),
    entity_type TEXT NOT NULL CHECK (entity_type IN (
        'application', 'file', 'column', 'config'
    )),
    entity_id TEXT NOT NULL,
    status TEXT NOT NULL CHECK (status IN (
        'pending', 'success', 'error', 'conflict'
    )),
    error_message TEXT,
    retry_count INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    completed_at DATETIME
);

-- Indexes
CREATE INDEX idx_sync_log_operation ON sync_log(operation);
CREATE INDEX idx_sync_log_entity_type ON sync_log(entity_type);
CREATE INDEX idx_sync_log_status ON sync_log(status);
CREATE INDEX idx_sync_log_created_at ON sync_log(created_at);
```

#### User Preferences Table
```sql
CREATE TABLE user_preferences (
    id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
    preference_key TEXT NOT NULL UNIQUE,
    preference_value TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX idx_user_preferences_key ON user_preferences(preference_key);
```

#### AI Configuration Table
```sql
CREATE TABLE ai_config (
    id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
    provider TEXT NOT NULL CHECK (provider IN (
        'openai', 'claude', 'gemini', 'mock'
    )),
    api_key TEXT, -- Encrypted
    model TEXT NOT NULL,
    prompt TEXT NOT NULL,
    custom_prompt TEXT,
    use_custom_prompt BOOLEAN DEFAULT FALSE,
    is_enabled BOOLEAN DEFAULT FALSE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX idx_ai_config_provider ON ai_config(provider);
CREATE INDEX idx_ai_config_enabled ON ai_config(is_enabled);
```

## 📁 Google Drive Structure

### Folder Organization
```
JobTracker/                          # Root folder
├── config/                          # Application configuration
│   ├── app_config.json             # App settings
│   ├── columns_config.json         # Custom column definitions
│   ├── ai_config.json              # AI configuration
│   └── user_preferences.json       # User preferences
├── data/                           # Application data
│   ├── applications.json           # Main application data
│   ├── sync_metadata.json          # Sync status and timestamps
│   └── backup_metadata.json        # Backup information
├── files/                          # Uploaded files
│   ├── cv/                         # Resume files
│   │   ├── app_001_cv.pdf
│   │   ├── app_002_cv.docx
│   │   └── app_003_cv.pdf
│   ├── cl/                         # Cover letter files
│   │   ├── app_001_cl.pdf
│   │   ├── app_002_cl.docx
│   │   └── app_003_cl.pdf
│   └── other/                      # Other documents
│       ├── certificates/
│       ├── portfolios/
│       └── references/
└── backups/                        # Automatic backups
    ├── daily/
    │   ├── backup_2024-09-20.json
    │   └── backup_2024-09-21.json
    └── weekly/
        └── backup_2024-09-15.json
```

### File Naming Conventions

#### Application Files
```
{application_id}_{file_type}_{timestamp}.{extension}
Example: app_001_cv_20240920_143022.pdf
```

#### Data Files
```
{data_type}_{timestamp}.json
Example: applications_20240920_143022.json
```

#### Backup Files
```
backup_{type}_{date}.json
Example: backup_daily_2024-09-20.json
```

## 📊 Data Models

### Application Model
```typescript
interface Application {
  id: string;
  companyName: string;
  positionTitle: string;
  jobUrl?: string;
  applicationDate?: Date;
  status: ApplicationStatus;
  notes?: string;
  location?: string;
  salary?: string;
  jobType?: string;
  jobDescription?: string;
  qualifications?: string;
  confidence?: number;
  createdAt: Date;
  updatedAt: Date;
  googleDriveId?: string;
  syncStatus: SyncStatus;
  syncError?: string;
  lastSyncAt?: Date;
  files: ApplicationFile[];
  customValues: CustomColumnValue[];
}

enum ApplicationStatus {
  APPLIED = 'APPLIED',
  INTERVIEW_SCHEDULED = 'INTERVIEW_SCHEDULED',
  INTERVIEWED = 'INTERVIEWED',
  OFFER_RECEIVED = 'OFFER_RECEIVED',
  REJECTED = 'REJECTED',
  WITHDRAWN = 'WITHDRAWN',
  ACCEPTED = 'ACCEPTED'
}

enum SyncStatus {
  PENDING = 'pending',
  SYNCED = 'synced',
  ERROR = 'error',
  CONFLICT = 'conflict'
}
```

### Application File Model
```typescript
interface ApplicationFile {
  id: string;
  applicationId: string;
  fileName: string;
  originalName: string;
  fileType: string;
  fileSize: number;
  mimeType: string;
  filePath?: string;
  googleDriveId?: string;
  googleDriveUrl?: string;
  createdAt: Date;
  updatedAt: Date;
  syncStatus: SyncStatus;
  syncError?: string;
  lastSyncAt?: Date;
}
```

### Custom Column Model
```typescript
interface CustomColumn {
  id: string;
  columnName: string;
  columnType: ColumnType;
  columnOptions?: string; // JSON string
  isRequired: boolean;
  isEditable: boolean;
  defaultValue?: string;
  validationRules?: string; // JSON string
  displayOrder: number;
  createdAt: Date;
  updatedAt: Date;
  googleDriveId?: string;
  syncStatus: SyncStatus;
}

enum ColumnType {
  TEXT = 'text',
  NUMBER = 'number',
  DATE = 'date',
  SELECT = 'select',
  URL = 'url',
  FILE = 'file',
  BOOLEAN = 'boolean'
}
```

### Custom Column Value Model
```typescript
interface CustomColumnValue {
  id: string;
  applicationId: string;
  columnId: string;
  value?: string;
  createdAt: Date;
  updatedAt: Date;
}
```

### Sync Log Model
```typescript
interface SyncLog {
  id: string;
  operation: SyncOperation;
  entityType: EntityType;
  entityId: string;
  status: SyncStatus;
  errorMessage?: string;
  retryCount: number;
  createdAt: Date;
  completedAt?: Date;
}

enum SyncOperation {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  SYNC = 'sync',
  BACKUP = 'backup'
}

enum EntityType {
  APPLICATION = 'application',
  FILE = 'file',
  COLUMN = 'column',
  CONFIG = 'config'
}
```

## 🔄 Data Synchronization

### Sync Metadata Structure
```typescript
interface SyncMetadata {
  lastSync: string; // ISO timestamp
  version: string;
  recordCount: number;
  syncStatus: SyncStatus;
  conflicts: Conflict[];
  errors: SyncError[];
}

interface Conflict {
  entityType: EntityType;
  entityId: string;
  localVersion: string;
  remoteVersion: string;
  conflictType: 'update' | 'delete';
  resolution?: 'local' | 'remote' | 'manual';
}

interface SyncError {
  entityType: EntityType;
  entityId: string;
  error: string;
  timestamp: string;
  retryCount: number;
}
```

### Data Export/Import Format
```typescript
interface DataExport {
  version: string;
  exportDate: string;
  applications: Application[];
  customColumns: CustomColumn[];
  customColumnValues: CustomColumnValue[];
  userPreferences: UserPreference[];
  aiConfig: AIConfig;
  metadata: {
    totalApplications: number;
    totalFiles: number;
    totalColumns: number;
  };
}
```

## 🛡️ Data Validation

### Application Validation Rules
```typescript
const applicationValidationRules = {
  companyName: {
    required: true,
    minLength: 1,
    maxLength: 255,
    pattern: /^[a-zA-Z0-9\s\-\.&]+$/
  },
  positionTitle: {
    required: true,
    minLength: 1,
    maxLength: 255,
    pattern: /^[a-zA-Z0-9\s\-\.&]+$/
  },
  jobUrl: {
    required: false,
    pattern: /^https?:\/\/.+/,
    maxLength: 2048
  },
  applicationDate: {
    required: false,
    type: 'date',
    maxDate: 'today'
  },
  status: {
    required: true,
    enum: Object.values(ApplicationStatus)
  },
  confidence: {
    required: false,
    type: 'number',
    min: 0,
    max: 1
  }
};
```

### File Validation Rules
```typescript
const fileValidationRules = {
  fileName: {
    required: true,
    minLength: 1,
    maxLength: 255,
    pattern: /^[a-zA-Z0-9\s\-\._]+$/
  },
  fileSize: {
    required: true,
    type: 'number',
    min: 1,
    max: 50 * 1024 * 1024 // 50MB
  },
  mimeType: {
    required: true,
    enum: [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain'
    ]
  }
};
```

## 📈 Performance Optimization

### Database Indexes
```sql
-- Composite indexes for common queries
CREATE INDEX idx_applications_status_date ON applications(status, application_date);
CREATE INDEX idx_applications_company_status ON applications(company_name, status);
CREATE INDEX idx_applications_sync_status_updated ON applications(sync_status, updated_at);

-- Partial indexes for active records
CREATE INDEX idx_applications_active ON applications(id) WHERE sync_status != 'deleted';
CREATE INDEX idx_files_active ON application_files(id) WHERE sync_status != 'deleted';
```

### Query Optimization
```sql
-- Optimized query for dashboard
SELECT 
  status,
  COUNT(*) as count,
  AVG(confidence) as avg_confidence
FROM applications 
WHERE sync_status != 'deleted'
GROUP BY status;

-- Optimized query for recent applications
SELECT * FROM applications 
WHERE application_date >= date('now', '-30 days')
ORDER BY application_date DESC
LIMIT 50;
```

## 🔒 Data Security

### Encryption
```typescript
// Encrypt sensitive data
interface EncryptedField {
  encrypted: boolean;
  value: string;
  algorithm: 'AES-256-GCM';
  keyId: string;
}

// API keys and sensitive data
interface SecureData {
  apiKey: EncryptedField;
  personalNotes: EncryptedField;
  salary: EncryptedField;
}
```

### Data Privacy
```typescript
// Data retention policies
interface DataRetentionPolicy {
  applications: {
    active: 'indefinite',
    deleted: '30 days',
    archived: '1 year'
  };
  files: {
    active: 'indefinite',
    deleted: '7 days',
    archived: '6 months'
  };
  logs: {
    sync: '90 days',
    error: '1 year',
    audit: '7 years'
  };
}
```

---

**Last Updated**: September 2024
**Version**: 1.0.0

