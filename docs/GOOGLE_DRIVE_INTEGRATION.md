# Google Drive Integration Guide

This document provides comprehensive guidance for integrating Google Drive as the primary storage solution for the Job Application Tracker.

## 🎯 Overview

Google Drive integration provides:
- **Cloud Storage**: Secure, reliable data storage
- **Multi-Device Sync**: Access from multiple computers
- **Automatic Backups**: Built-in versioning and backup
- **Scalability**: No storage limits for individual users
- **Security**: Enterprise-grade security and encryption

## 🔧 Setup Requirements

### Prerequisites
- Google account with Drive access
- Google Cloud Console project
- OAuth 2.0 credentials
- Drive API enabled

### Required APIs
- **Google Drive API v3**: File and folder operations
- **Google Sheets API v4**: Optional for data export
- **Google OAuth 2.0**: Authentication

## 🚀 Initial Setup

### 1. Google Cloud Console Setup

```bash
# Create a new project in Google Cloud Console
# Enable the following APIs:
# - Google Drive API
# - Google Sheets API (optional)
```

### 2. OAuth 2.0 Configuration

```json
{
  "web": {
    "client_id": "your-client-id.apps.googleusercontent.com",
    "project_id": "your-project-id",
    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
    "token_uri": "https://oauth2.googleapis.com/token",
    "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
    "client_secret": "your-client-secret",
    "redirect_uris": [
      "http://localhost:3000/auth/google/callback",
      "https://yourdomain.com/auth/google/callback"
    ]
  }
}
```

### 3. Environment Configuration

```env
# .env file
GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-client-secret
GOOGLE_REDIRECT_URI=http://localhost:3000/auth/google/callback
GOOGLE_DRIVE_FOLDER_NAME=JobTracker
```

## 📁 Folder Structure

### Default Folder Organization

```
JobTracker/                          # Root folder
├── config/                          # Application configuration
│   ├── app_config.json             # App settings
│   ├── columns_config.json         # Custom column definitions
│   ├── ai_prompts.json             # AI prompt configurations
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

## 🔐 Authentication Flow

### OAuth 2.0 Implementation

```typescript
// Authentication service
class GoogleDriveAuth {
  private clientId: string;
  private clientSecret: string;
  private redirectUri: string;
  
  constructor(config: GoogleDriveConfig) {
    this.clientId = config.clientId;
    this.clientSecret = config.clientSecret;
    this.redirectUri = config.redirectUri;
  }
  
  // Step 1: Generate authorization URL
  getAuthUrl(): string {
    const params = new URLSearchParams({
      client_id: this.clientId,
      redirect_uri: this.redirectUri,
      response_type: 'code',
      scope: 'https://www.googleapis.com/auth/drive',
      access_type: 'offline',
      prompt: 'consent'
    });
    
    return `https://accounts.google.com/o/oauth2/auth?${params}`;
  }
  
  // Step 2: Exchange code for tokens
  async exchangeCodeForTokens(code: string): Promise<TokenResponse> {
    const response = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: this.clientId,
        client_secret: this.clientSecret,
        code: code,
        grant_type: 'authorization_code',
        redirect_uri: this.redirectUri,
      }),
    });
    
    return response.json();
  }
  
  // Step 3: Refresh access token
  async refreshAccessToken(refreshToken: string): Promise<TokenResponse> {
    const response = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: this.clientId,
        client_secret: this.clientSecret,
        refresh_token: refreshToken,
        grant_type: 'refresh_token',
      }),
    });
    
    return response.json();
  }
}
```

## 📊 Data Synchronization

### Sync Service Implementation

```typescript
class GoogleDriveSync {
  private drive: google.drive.Drive;
  private folderId: string;
  
  constructor(accessToken: string, folderId: string) {
    this.drive = google.drive({
      version: 'v3',
      auth: new google.auth.OAuth2().setCredentials({
        access_token: accessToken
      })
    });
    this.folderId = folderId;
  }
  
  // Upload data to Google Drive
  async uploadData(filename: string, data: any): Promise<string> {
    const fileMetadata = {
      name: filename,
      parents: [this.folderId]
    };
    
    const media = {
      mimeType: 'application/json',
      body: JSON.stringify(data, null, 2)
    };
    
    const response = await this.drive.files.create({
      requestBody: fileMetadata,
      media: media,
      fields: 'id'
    });
    
    return response.data.id!;
  }
  
  // Download data from Google Drive
  async downloadData(filename: string): Promise<any> {
    const files = await this.drive.files.list({
      q: `name='${filename}' and parents in '${this.folderId}'`,
      fields: 'files(id, name)'
    });
    
    if (files.data.files?.length === 0) {
      throw new Error(`File ${filename} not found`);
    }
    
    const fileId = files.data.files![0].id!;
    const response = await this.drive.files.get({
      fileId: fileId,
      alt: 'media'
    });
    
    return JSON.parse(response.data as string);
  }
  
  // Sync local data to cloud
  async syncToCloud(localData: any): Promise<void> {
    try {
      // Upload main data
      await this.uploadData('applications.json', localData.applications);
      
      // Upload metadata
      await this.uploadData('sync_metadata.json', {
        lastSync: new Date().toISOString(),
        version: '1.0.0',
        recordCount: localData.applications.length
      });
      
      console.log('Data synced to Google Drive successfully');
    } catch (error) {
      console.error('Failed to sync to Google Drive:', error);
      throw error;
    }
  }
  
  // Sync cloud data to local
  async syncFromCloud(): Promise<any> {
    try {
      const applications = await this.downloadData('applications.json');
      const metadata = await this.downloadData('sync_metadata.json');
      
      return {
        applications,
        metadata,
        lastSync: metadata.lastSync
      };
    } catch (error) {
      console.error('Failed to sync from Google Drive:', error);
      throw error;
    }
  }
}
```

## 📁 File Management

### File Upload Service

```typescript
class GoogleDriveFileManager {
  private drive: google.drive.Drive;
  private folderId: string;
  
  constructor(accessToken: string, folderId: string) {
    this.drive = google.drive({
      version: 'v3',
      auth: new google.auth.OAuth2().setCredentials({
        access_token: accessToken
      })
    });
    this.folderId = folderId;
  }
  
  // Upload file to specific folder
  async uploadFile(file: File, folderPath: string): Promise<string> {
    // Create folder if it doesn't exist
    const folderId = await this.ensureFolderExists(folderPath);
    
    const fileMetadata = {
      name: file.name,
      parents: [folderId]
    };
    
    const media = {
      mimeType: file.type,
      body: file
    };
    
    const response = await this.drive.files.create({
      requestBody: fileMetadata,
      media: media,
      fields: 'id, name, size, mimeType'
    });
    
    return response.data.id!;
  }
  
  // Download file from Google Drive
  async downloadFile(fileId: string): Promise<Blob> {
    const response = await this.drive.files.get({
      fileId: fileId,
      alt: 'media'
    });
    
    return response.data as Blob;
  }
  
  // Delete file from Google Drive
  async deleteFile(fileId: string): Promise<void> {
    await this.drive.files.delete({
      fileId: fileId
    });
  }
  
  // Ensure folder exists, create if not
  private async ensureFolderExists(folderPath: string): Promise<string> {
    const pathParts = folderPath.split('/');
    let currentFolderId = this.folderId;
    
    for (const folderName of pathParts) {
      const existingFolder = await this.findFolder(folderName, currentFolderId);
      
      if (existingFolder) {
        currentFolderId = existingFolder.id!;
      } else {
        const newFolder = await this.createFolder(folderName, currentFolderId);
        currentFolderId = newFolder.id!;
      }
    }
    
    return currentFolderId;
  }
  
  // Find folder by name
  private async findFolder(folderName: string, parentId: string): Promise<any> {
    const response = await this.drive.files.list({
      q: `name='${folderName}' and parents in '${parentId}' and mimeType='application/vnd.google-apps.folder'`,
      fields: 'files(id, name)'
    });
    
    return response.data.files?.[0] || null;
  }
  
  // Create new folder
  private async createFolder(folderName: string, parentId: string): Promise<any> {
    const fileMetadata = {
      name: folderName,
      mimeType: 'application/vnd.google-apps.folder',
      parents: [parentId]
    };
    
    const response = await this.drive.files.create({
      requestBody: fileMetadata,
      fields: 'id, name'
    });
    
    return response.data;
  }
}
```

## 🔄 Offline Support

### Offline-First Architecture

```typescript
class OfflineSyncManager {
  private localDB: LocalDatabase;
  private googleDrive: GoogleDriveSync;
  private isOnline: boolean = navigator.onLine;
  
  constructor(localDB: LocalDatabase, googleDrive: GoogleDriveSync) {
    this.localDB = localDB;
    this.googleDrive = googleDrive;
    
    // Listen for online/offline events
    window.addEventListener('online', () => this.handleOnline());
    window.addEventListener('offline', () => this.handleOffline());
  }
  
  // Handle coming online
  private async handleOnline(): Promise<void> {
    this.isOnline = true;
    console.log('Connection restored, syncing data...');
    
    try {
      await this.syncPendingChanges();
      await this.syncFromCloud();
    } catch (error) {
      console.error('Failed to sync after coming online:', error);
    }
  }
  
  // Handle going offline
  private handleOffline(): void {
    this.isOnline = false;
    console.log('Connection lost, working offline...');
  }
  
  // Sync pending changes when back online
  private async syncPendingChanges(): Promise<void> {
    const pendingChanges = await this.localDB.getPendingChanges();
    
    for (const change of pendingChanges) {
      try {
        await this.googleDrive.syncToCloud(change.data);
        await this.localDB.markChangeAsSynced(change.id);
      } catch (error) {
        console.error(`Failed to sync change ${change.id}:`, error);
      }
    }
  }
  
  // Save data with offline support
  async saveData(data: any): Promise<void> {
    // Always save locally first
    await this.localDB.saveData(data);
    
    // Mark as pending sync
    await this.localDB.markAsPendingSync(data.id);
    
    // Try to sync to cloud if online
    if (this.isOnline) {
      try {
        await this.googleDrive.syncToCloud(data);
        await this.localDB.markAsSynced(data.id);
      } catch (error) {
        console.error('Failed to sync to cloud, will retry later:', error);
      }
    }
  }
}
```

## 🛡️ Error Handling

### Error Types and Recovery

```typescript
enum GoogleDriveErrorType {
  AUTHENTICATION_ERROR = 'AUTHENTICATION_ERROR',
  PERMISSION_ERROR = 'PERMISSION_ERROR',
  QUOTA_EXCEEDED = 'QUOTA_EXCEEDED',
  NETWORK_ERROR = 'NETWORK_ERROR',
  FILE_NOT_FOUND = 'FILE_NOT_FOUND',
  RATE_LIMIT_EXCEEDED = 'RATE_LIMIT_EXCEEDED'
}

class GoogleDriveErrorHandler {
  static async handleError(error: any): Promise<void> {
    const errorType = this.classifyError(error);
    
    switch (errorType) {
      case GoogleDriveErrorType.AUTHENTICATION_ERROR:
        await this.handleAuthError();
        break;
      case GoogleDriveErrorType.PERMISSION_ERROR:
        await this.handlePermissionError();
        break;
      case GoogleDriveErrorType.QUOTA_EXCEEDED:
        await this.handleQuotaError();
        break;
      case GoogleDriveErrorType.NETWORK_ERROR:
        await this.handleNetworkError();
        break;
      case GoogleDriveErrorType.RATE_LIMIT_EXCEEDED:
        await this.handleRateLimitError();
        break;
      default:
        await this.handleGenericError(error);
    }
  }
  
  private static classifyError(error: any): GoogleDriveErrorType {
    if (error.code === 401) return GoogleDriveErrorType.AUTHENTICATION_ERROR;
    if (error.code === 403) return GoogleDriveErrorType.PERMISSION_ERROR;
    if (error.code === 507) return GoogleDriveErrorType.QUOTA_EXCEEDED;
    if (error.code === 429) return GoogleDriveErrorType.RATE_LIMIT_EXCEEDED;
    if (!navigator.onLine) return GoogleDriveErrorType.NETWORK_ERROR;
    return GoogleDriveErrorType.NETWORK_ERROR;
  }
  
  private static async handleAuthError(): Promise<void> {
    // Redirect to re-authentication
    window.location.href = '/auth/google';
  }
  
  private static async handlePermissionError(): Promise<void> {
    // Show permission error message
    alert('Permission denied. Please check your Google Drive permissions.');
  }
  
  private static async handleQuotaError(): Promise<void> {
    // Show quota exceeded message
    alert('Google Drive quota exceeded. Please free up space or upgrade your plan.');
  }
  
  private static async handleRateLimitError(): Promise<void> {
    // Implement exponential backoff
    await new Promise(resolve => setTimeout(resolve, 5000));
  }
}
```

## 📊 Performance Optimization

### Caching Strategy

```typescript
class GoogleDriveCache {
  private cache: Map<string, { data: any; timestamp: number }> = new Map();
  private readonly CACHE_TTL = 5 * 60 * 1000; // 5 minutes
  
  // Get data from cache or fetch from Google Drive
  async getData(key: string, fetchFunction: () => Promise<any>): Promise<any> {
    const cached = this.cache.get(key);
    
    if (cached && Date.now() - cached.timestamp < this.CACHE_TTL) {
      return cached.data;
    }
    
    const data = await fetchFunction();
    this.cache.set(key, { data, timestamp: Date.now() });
    
    return data;
  }
  
  // Invalidate cache entry
  invalidate(key: string): void {
    this.cache.delete(key);
  }
  
  // Clear all cache
  clear(): void {
    this.cache.clear();
  }
}
```

## 🔧 Configuration

### Google Drive Settings

```typescript
interface GoogleDriveConfig {
  // Authentication
  clientId: string;
  clientSecret: string;
  redirectUri: string;
  
  // Folder settings
  rootFolderName: string;
  createBackups: boolean;
  backupFrequency: 'daily' | 'weekly' | 'monthly';
  
  // Sync settings
  autoSync: boolean;
  syncInterval: number; // milliseconds
  conflictResolution: 'local' | 'remote' | 'manual';
  
  // Performance
  cacheEnabled: boolean;
  cacheTTL: number; // milliseconds
  batchSize: number; // files per batch
}
```

---

**Last Updated**: September 2024
**Version**: 1.0.0

