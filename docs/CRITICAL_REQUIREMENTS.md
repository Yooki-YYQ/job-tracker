# CRITICAL REQUIREMENTS - DO NOT FORGET

## Core Understanding

### 1. AI's Role (CRITICAL)
- **AI NEVER SAVES ANYTHING**
- AI receives job posting text → runs prompt → returns parsed JSON → THAT'S ALL
- Workflow: User pastes → AI extracts → User sees confirmation modal → User edits/confirms → User clicks save → Database stores it
- AI is just a parser to help fill forms faster

### 2. Database Structure (CRITICAL)

**MUST BE 100% SCALABLE** - Users can add ANY column, just like Excel/Notion

#### System Fields (Fixed, Not Editable by User):
```prisma
model Application {
  id        String   @id @default(uuid())
  data      Json     @default("{}")  // ALL user data here
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

#### User Data (ALL stored in `data` JSONB):
- companyName
- positionTitle
- **jobDescription** (CRITICAL - must save because job URLs die)
- **qualifications** (CRITICAL - must save because job URLs die)
- jobUrl
- applicationDate
- status
- notes
- pay
- location
- jobType
- **ANY other custom fields user adds**

### 3. Default Columns
These are pre-configured but user can add unlimited more:
- ID (system)
- Date
- Position
- Company
- Status
- URL
- **Job Description** (CRITICAL - from AI extraction)
- **Requirements/Qualifications** (CRITICAL - from AI extraction)
- CV (file)
- CL (file)
- Pay
- Notes

### 4. File Storage

**Store files as PATHS in JSONB** - This supports Google Drive sync!

```json
{
  "data": {
    "companyName": "Google",
    "positionTitle": "Software Engineer",
    "cv": "/uploads/resume_xyz.pdf",
    "cl": "/uploads/coverletter_abc.pdf",
    "otherFiles": [
      "/uploads/transcript.pdf",
      "/uploads/portfolio.pdf"
    ]
  }
}
```

**Why paths work with Google Drive:**
- Local: Files at `/uploads/resume_xyz.pdf`
- Google Drive: Sync this folder to Google Drive
- Multi-device: Google Drive keeps files synced
- Path stays same across devices
- No database changes needed

### 5. AI Prompt (CRITICAL - Already Implemented)

Location: `frontend/src/types/ai.types.ts`

The prompt extracts:
- position
- company
- location
- pay
- job_type
- job_description
- qualifications

From pasted job posting content (like Indeed pages).

### 6. Google Drive Integration (Planned)

**How it works:**
1. Local files stored in `uploads/` folder
2. User links Google Drive in settings
3. App syncs `uploads/` folder to Google Drive
4. Paths stored in database (e.g., `/uploads/resume.pdf`)
5. Works offline: uses local files
6. Works online: syncs to Google Drive
7. Multi-device: Google Drive keeps everything synced

**Benefits:**
- Security (Google's infrastructure)
- Capacity (Google Drive storage)
- Reliability (Google's uptime)
- No data migration needed
- Big data management handled by Google
- Each customer uses their own Google Drive

### 7. Why Job Description & Qualifications MUST BE SAVED

**THE WHOLE POINT OF THIS APP:**
- When you apply for a job, you save the URL
- Weeks later, you get an interview
- You go back to check the job requirements
- **THE URL IS DEAD** - job posting closed/removed
- **YOU HAVE NO WAY TO REVIEW WHAT THE JOB WAS ABOUT**
- **SOLUTION: Save full jobDescription and qualifications to database**

This is why the app exists - to preserve job details even when URLs die!

### 8. Two-Step Submission Process

**Step 1: Upload & Paste**
- User uploads files (CV, CL, etc.)
- User pastes ENTIRE job posting (Ctrl+A, Ctrl+C, Ctrl+V from Indeed/LinkedIn/etc.)
- User enters job URL (optional)

**Step 2: AI Confirmation**
- AI extracts: company, position, jobDescription, qualifications, pay, location, jobType
- Shows in confirmation modal
- User reviews and can edit ANY field
- User clicks "Save"
- Data goes to database

### 9. Notion-Style Table

- Looks EXACTLY like Notion table
- **Resizable columns (like Excel) - NO FIXED WIDTHS!**
- Can add unlimited custom columns
- Inline editing
- Click row ID to open detail view
- "Add property" button for new columns

### 10. Dynamic Columns - How It Works

**Adding a column:**
```typescript
// User adds "Interview Date" column
// Automatically stores as: data.interviewDate
// Column can be: text, number, date, select, url, file
// Width: User can resize to ANY width (like Excel)
```

**Storage:**
```json
{
  "data": {
    "companyName": "Microsoft",
    "positionTitle": "Developer",
    "interviewDate": "2025-01-15",  // Custom field
    "recruiterName": "John Smith",   // Custom field
    "transcript": "/uploads/transcript.pdf"  // Custom field
  }
}
```

### 11. Key Architecture Principles

1. **Nothing is hard-coded** - all data-driven
2. **Components properly separated** - container/presentation pattern
3. **No file >200 lines** - enforced by pre-commit hooks
4. **Strict design principles** - like professional software company
5. **All business logic in custom hooks** - not in components
6. **AI service is frontend-only** - never touches database
7. **Column widths are NEVER fixed** - always resizable like Excel/Notion

### 12. Technology Stack

- **Frontend**: React 19 + TypeScript + Ant Design + AG Grid + Vite
- **Backend**: Node.js + Express + Prisma
- **Database**: PostgreSQL with JSONB for dynamic data
- **File Storage**: Local uploads/ folder (synced to Google Drive)
- **AI**: OpenAI API (frontend-only, user provides API key)
- **Future**: Google Drive API for sync, Electron for desktop app

### 13. What Makes This App Valuable

1. **Preserves job details when URLs die** (THE MAIN POINT)
2. **AI auto-fills forms** (saves time)
3. **Unlimited customization** (any columns)
4. **File management** (CV, CL, transcripts, etc.)
5. **Multi-device sync** (via Google Drive)
6. **Offline capable** (local storage)
7. **Privacy** (your own Google Drive)

### 14. Current Status

- ✅ Backend running (port 5000)
- ✅ Frontend running (port 5173)
- ✅ Database connected (PostgreSQL)
- ✅ AI prompt implemented
- ✅ Basic table structure
- ❌ Database schema needs fix (has hardcoded columns)
- ❌ Need to migrate to JSONB structure
- ❌ Google Drive sync not yet implemented

### 15. Next Steps

1. Fix database schema (remove hardcoded columns, use JSONB)
2. Migrate existing data
3. Test full workflow (paste → AI parse → confirm → save)
4. Implement Google Drive sync
5. Package as desktop app (Electron)

---

**REMEMBER: This document is the SINGLE SOURCE OF TRUTH. Read this first before making ANY changes!**