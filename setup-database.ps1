# Database Setup Script for Job Tracker
# Run this script to properly set up the database

Write-Host "🚀 Setting up Job Tracker Database..." -ForegroundColor Green

# Step 1: Start Docker containers
Write-Host "📦 Starting Docker containers..." -ForegroundColor Yellow
cd infra
docker-compose up -d
Start-Sleep -Seconds 5

# Step 2: Navigate to backend
Write-Host "🔧 Setting up backend database..." -ForegroundColor Yellow
cd ..\backend

# Step 3: Reset and recreate database
Write-Host "🗑️ Resetting database..." -ForegroundColor Red
npx prisma migrate reset --force

# Step 4: Generate Prisma client
Write-Host "⚙️ Generating Prisma client..." -ForegroundColor Yellow
npx prisma generate

# Step 5: Run migrations
Write-Host "📊 Running database migrations..." -ForegroundColor Yellow
npx prisma migrate dev --name init

# Step 6: Seed database (optional)
Write-Host "🌱 Seeding database..." -ForegroundColor Yellow
npx prisma db seed

Write-Host "✅ Database setup complete!" -ForegroundColor Green
Write-Host "🌐 Backend API: http://localhost:5000" -ForegroundColor Cyan
Write-Host "🗄️ Database Admin: http://localhost:8080" -ForegroundColor Cyan
Write-Host "🎨 Frontend: http://localhost:5173" -ForegroundColor Cyan

