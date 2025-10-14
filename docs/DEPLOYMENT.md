# Deployment Strategy

This document outlines the deployment strategy for the Job Application Tracker, covering both web demo deployment and desktop application packaging.

## 🎯 Deployment Overview

The Job Application Tracker supports multiple deployment options:
- **Web Demo**: Deploy to your domain for showcasing
- **Desktop Application**: Packaged as EXE for easy installation
- **Development Environment**: Local development setup

## 🌐 Web Demo Deployment

### Prerequisites
- Domain name and hosting service
- SSL certificate (HTTPS required for Google Drive API)
- Node.js hosting environment
- Google Cloud Console project

### Deployment Steps

#### 1. Environment Setup
```bash
# Production environment variables
NODE_ENV=production
PORT=3000
GOOGLE_CLIENT_ID=your-production-client-id
GOOGLE_CLIENT_SECRET=your-production-client-secret
GOOGLE_REDIRECT_URI=https://yourdomain.com/auth/google/callback
DATABASE_URL=your-production-database-url
```

#### 2. Build Process
```bash
# Build frontend
cd frontend
npm run build

# Build backend
cd ../backend
npm run build

# Copy build files to deployment directory
cp -r dist/* /path/to/deployment/
cp -r ../frontend/dist/* /path/to/deployment/public/
```

#### 3. Server Configuration
```javascript
// server.js - Production server configuration
const express = require('express');
const path = require('path');
const cors = require('cors');

const app = express();

// Security middleware
app.use(cors({
  origin: ['https://yourdomain.com'],
  credentials: true
}));

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// API routes
app.use('/api', require('./routes'));

// SPA fallback
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

#### 4. Nginx Configuration
```nginx
# /etc/nginx/sites-available/job-tracker
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name yourdomain.com www.yourdomain.com;
    
    ssl_certificate /path/to/ssl/certificate.crt;
    ssl_certificate_key /path/to/ssl/private.key;
    
    # Security headers
    add_header X-Frame-Options DENY;
    add_header X-Content-Type-Options nosniff;
    add_header X-XSS-Protection "1; mode=block";
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains";
    
    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/javascript application/xml+rss application/json;
    
    # Static files
    location / {
        root /path/to/deployment/public;
        try_files $uri $uri/ /index.html;
    }
    
    # API proxy
    location /api {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

#### 5. Process Management
```bash
# Install PM2 for process management
npm install -g pm2

# Create PM2 ecosystem file
cat > ecosystem.config.js << EOF
module.exports = {
  apps: [{
    name: 'job-tracker',
    script: './dist/server.js',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_file: './logs/combined.log',
    time: true
  }]
};
EOF

# Start application
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

## 💻 Desktop Application Deployment

### Electron Setup

#### 1. Install Electron
```bash
npm install --save-dev electron electron-builder
```

#### 2. Electron Main Process
```javascript
// electron/main.js
const { app, BrowserWindow, Menu, ipcMain } = require('electron');
const path = require('path');
const isDev = process.env.NODE_ENV === 'development';

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    },
    icon: path.join(__dirname, 'assets/icon.png'),
    titleBarStyle: 'default',
    show: false
  });

  // Load the app
  if (isDev) {
    mainWindow.loadURL('http://localhost:5173');
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
  }

  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
```

#### 3. Preload Script
```javascript
// electron/preload.js
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  // File system operations
  saveFile: (data) => ipcRenderer.invoke('save-file', data),
  loadFile: () => ipcRenderer.invoke('load-file'),
  
  // Google Drive operations
  authenticateGoogleDrive: () => ipcRenderer.invoke('auth-google-drive'),
  syncToGoogleDrive: (data) => ipcRenderer.invoke('sync-to-drive', data),
  syncFromGoogleDrive: () => ipcRenderer.invoke('sync-from-drive'),
  
  // App information
  getVersion: () => ipcRenderer.invoke('get-version'),
  getPlatform: () => ipcRenderer.invoke('get-platform')
});
```

#### 4. Package Configuration
```json
// package.json
{
  "name": "job-tracker",
  "version": "1.0.0",
  "description": "Job Application Tracker",
  "main": "electron/main.js",
  "homepage": "./",
  "scripts": {
    "electron": "electron .",
    "electron:dev": "concurrently \"npm run dev\" \"wait-on http://localhost:5173 && electron .\"",
    "build:electron": "npm run build && electron-builder",
    "dist": "npm run build && electron-builder --publish=never"
  },
  "build": {
    "appId": "com.yourcompany.job-tracker",
    "productName": "Job Tracker",
    "directories": {
      "output": "dist-electron"
    },
    "files": [
      "dist/**/*",
      "electron/**/*",
      "node_modules/**/*"
    ],
    "win": {
      "target": "nsis",
      "icon": "assets/icon.ico"
    },
    "mac": {
      "target": "dmg",
      "icon": "assets/icon.icns"
    },
    "linux": {
      "target": "AppImage",
      "icon": "assets/icon.png"
    },
    "nsis": {
      "oneClick": false,
      "allowToChangeInstallationDirectory": true,
      "createDesktopShortcut": true,
      "createStartMenuShortcut": true
    }
  }
}
```

#### 5. Build Scripts
```bash
# Build for Windows
npm run dist -- --win

# Build for macOS
npm run dist -- --mac

# Build for Linux
npm run dist -- --linux

# Build for all platforms
npm run dist -- --win --mac --linux
```

### Desktop App Features

#### 1. Offline Support
```javascript
// Offline data management
class OfflineManager {
  constructor() {
    this.db = new LocalDatabase();
    this.syncManager = new SyncManager();
  }
  
  async saveData(data) {
    // Save to local database
    await this.db.save(data);
    
    // Try to sync to cloud
    try {
      await this.syncManager.syncToCloud(data);
    } catch (error) {
      console.log('Offline mode - data saved locally');
    }
  }
  
  async loadData() {
    // Try to load from cloud first
    try {
      const cloudData = await this.syncManager.syncFromCloud();
      await this.db.save(cloudData);
      return cloudData;
    } catch (error) {
      // Fallback to local data
      return await this.db.load();
    }
  }
}
```

#### 2. Auto-Updater
```javascript
// Auto-updater implementation
const { autoUpdater } = require('electron-updater');

autoUpdater.checkForUpdatesAndNotify();

autoUpdater.on('update-available', () => {
  // Notify user about update
  dialog.showMessageBox(mainWindow, {
    type: 'info',
    title: 'Update Available',
    message: 'A new version is available. It will be downloaded in the background.',
    buttons: ['OK']
  });
});

autoUpdater.on('update-downloaded', () => {
  // Restart app to apply update
  autoUpdater.quitAndInstall();
});
```

#### 3. System Integration
```javascript
// System tray integration
const { Tray, Menu } = require('electron');

function createTray() {
  const tray = new Tray(path.join(__dirname, 'assets/tray-icon.png'));
  
  const contextMenu = Menu.buildFromTemplate([
    {
      label: 'Show App',
      click: () => {
        mainWindow.show();
      }
    },
    {
      label: 'Quit',
      click: () => {
        app.quit();
      }
    }
  ]);
  
  tray.setContextMenu(contextMenu);
  tray.setToolTip('Job Tracker');
}
```

## 🔧 Development Environment

### Local Development Setup
```bash
# Clone repository
git clone <repository-url>
cd job-tracker

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your configuration

# Start development servers
npm run dev
```

### Docker Development
```dockerfile
# Dockerfile
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./
RUN npm install

# Copy source code
COPY . .

# Build application
RUN npm run build

# Expose port
EXPOSE 3000

# Start application
CMD ["npm", "start"]
```

```yaml
# docker-compose.yml
version: '3.8'
services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - DATABASE_URL=postgresql://user:password@db:5432/jobtracker
    depends_on:
      - db
  
  db:
    image: postgres:15
    environment:
      - POSTGRES_DB=jobtracker
      - POSTGRES_USER=user
      - POSTGRES_PASSWORD=password
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

## 📊 Monitoring and Logging

### Application Monitoring
```javascript
// Monitoring setup
const winston = require('winston');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' }),
    new winston.transports.Console({
      format: winston.format.simple()
    })
  ]
});
```

### Health Checks
```javascript
// Health check endpoint
app.get('/health', (req, res) => {
  const health = {
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    version: process.env.npm_package_version
  };
  
  res.json(health);
});
```

## 🔒 Security Considerations

### Production Security
- **HTTPS**: Always use HTTPS in production
- **CORS**: Configure CORS properly
- **Rate Limiting**: Implement rate limiting
- **Input Validation**: Validate all inputs
- **SQL Injection**: Use parameterized queries
- **XSS Protection**: Sanitize user inputs
- **CSRF Protection**: Implement CSRF tokens

### Environment Variables
```bash
# Production environment variables
NODE_ENV=production
PORT=3000
GOOGLE_CLIENT_ID=your-client-id
GOOGLE_CLIENT_SECRET=your-client-secret
GOOGLE_REDIRECT_URI=https://yourdomain.com/auth/callback
DATABASE_URL=postgresql://user:password@localhost:5432/jobtracker
JWT_SECRET=your-jwt-secret
ENCRYPTION_KEY=your-encryption-key
```

## 📈 Performance Optimization

### Frontend Optimization
- **Code Splitting**: Split code into chunks
- **Lazy Loading**: Load components on demand
- **Image Optimization**: Optimize images
- **Caching**: Implement proper caching
- **CDN**: Use CDN for static assets

### Backend Optimization
- **Database Indexing**: Optimize database queries
- **Connection Pooling**: Use connection pooling
- **Caching**: Implement Redis caching
- **Compression**: Enable gzip compression
- **Load Balancing**: Use load balancers

---

**Last Updated**: September 2024
**Version**: 1.0.0

