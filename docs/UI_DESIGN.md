# UI Design Specifications

This document outlines the complete user interface design for the Job Application Tracker, based on the provided UI mockups and requirements.

## 🎨 Overall Design Philosophy

- **Clean and Minimalist**: Inspired by Notion and modern productivity tools
- **Excel-like Functionality**: Familiar spreadsheet interface for data management
- **Responsive Layout**: Two-panel design with table and detail views
- **Intuitive Interactions**: Hover effects and clear visual feedback

## 📱 Layout Structure

### Main Layout
```
┌─────────────────────────────────────────────────────────────┐
│ Header: Job Tracker | Private ▼ | Share | ⭐ | ⋮           │
├─────────────────────────────────────────────────────────────┤
│ Job Tracker                                    [Table] ▼   │
├─────────────────────────────────────────────────────────────┤
│ Toolbar: 🔄 ⇅ ⚡ 🔍 [New] ▼                                │
├─────────────────────────────────────────────────────────────┤
│ ┌─────────────────────────┐ ┌─────────────────────────────┐ │
│ │                         │ │                             │ │
│ │    Table View           │ │    Detail View              │ │
│ │    (50% width)          │ │    (50% width)              │ │
│ │                         │ │                             │ │
│ │                         │ │                             │ │
│ └─────────────────────────┘ └─────────────────────────────┘ │
├─────────────────────────────────────────────────────────────┤
│ [+ New page]                                                │
└─────────────────────────────────────────────────────────────┘
```

## 📊 Table View Specifications

### Default Columns

| Column | Type | Width | Features |
|--------|------|-------|----------|
| **Aa ID** | Auto-increment | 80px | Hover shows "open tag" icon, click opens detail view |
| **Date** | Auto-generated | 180px | Format: "September 25, 2025 4:04 PM" |
| **Position** | Text | 200px | Truncated with ellipsis |
| **Company** | Text | 150px | Truncated with ellipsis |
| **Status** | Select | 120px | Colored dots + text (In progress, Not started, Done) |
| **URL** | URL | 200px | Clickable external links (blue, underlined) |
| **Job Description** | Text | 250px | Truncated, full text in detail view |
| **Requirement** | Text | 250px | Truncated, full text in detail view |
| **CV** | File | 150px | File name with download capability |
| **CL** | File | 150px | File name with download capability |
| **Pay** | Text | 120px | Salary information |
| **Notes** | Text | 200px | Personal notes |

### Status Indicators

| Status | Color | Dot | Description |
|--------|-------|-----|-------------|
| **In Progress** | Blue | 🔵 | Application submitted, waiting for response |
| **Not Started** | Gray | ⚪ | Application not yet submitted |
| **Done** | Green | 🟢 | Application completed (hired/rejected) |
| **Interview Scheduled** | Orange | 🟠 | Interview arranged |
| **Rejected** | Red | 🔴 | Application rejected |

### Table Interactions

#### Hover Effects
- **ID Column**: Shows "Open in side peek" tooltip with "OPEN" button on hover
- **Row Hover**: Subtle background highlight
- **Column Headers**: Show sort/filter icons on hover

#### Click Actions
- **ID Click**: Opens detail view in right half-screen panel
- **Row Click**: Opens detail view in right half-screen panel
- **URL Click**: Opens job posting in new tab (URL type, blue underlined)
- **File Click**: Downloads the file (CV, CL files)
- **"New" Button**: Add new columns or new applications

## 🔍 Detail View Specifications

### Layout Structure
```
┌─────────────────────────────────────┐
│ [Add icon] [Add cover] [Customize]  │
│                                     │
│ ID: 1                               │
│                                     │
│ 📎 CL: Yuqing Yang-Stud...          │
│ 📎 CV: Yuqing Yang_Corp...          │
│                                     │
│ Company: UofT                       │
│ Date: September 25, 2025 4:04 PM   │
│                                     │
│ ▼ Position                          │
│ Student Recruitment & Communications │
│                                     │
│ ▼ Requirements                      │
│ Essential Qualifications:           │
│ • Bachelor's Degree                 │
│ • Minimum of two (2) years...       │
│                                     │
│ Assets (Nonessential):              │
│ • Familiarity with University...    │
│                                     │
│ To be successful in this role:      │
│ • Adaptable                         │
│ • Communicator                      │
│                                     │
│ Status: 🔵 In progress              │
│ URL: jobs.utoronto.ca/job...        │
│ Notes: [Empty]                      │
│ [+ Add a property]                  │
│                                     │
│ Comments:                           │
│ [Y Add a comment...]                │
└─────────────────────────────────────┘
```

### Detail View Features

#### Header Section
- **ID Display**: Large, prominent ID number (e.g., "1")
- **Action Buttons**: Share button, star icon, three-dot menu
- **File Attachments**: CV and CL files with download links (e.g., "Yuqing Yang-Stud...")

#### Information Sections
- **Job Description**: Full job description with company information
- **Requirements**: Essential qualifications and assets (nonessential)
- **Success Criteria**: "To be successful in this role you will be:" with soft skills
- **Rich Text**: Support for formatted text and bullet points

#### Properties Section
- **Status Indicator**: Colored dot with status text (e.g., "In progress" with blue dot)
- **URL Link**: Clickable job posting link (blue, underlined, e.g., "jobs.utoronto.ca/job...10817/")
- **Notes Field**: Editable text area (currently "Empty")
- **Add Property Button**: "+ Add a property" for custom fields

#### Comments Section
- **Comment Input**: "Y Add a comment..." input field
- **Comment Thread**: Support for multiple comments with timestamps

## 🎛️ Toolbar Specifications

### Left Side Tools
- **🔄 Refresh**: Reload data from Google Drive
- **⇅ Sort**: Sort by any column
- **⚡ Filter**: Filter by status, company, etc.
- **🔍 Search**: Global search across all fields

### Right Side Tools
- **[New] ▼**: Add new application or column
  - Add New Application
  - Add New Column
  - Import Data
  - Export Data

## 📱 Responsive Design

### Desktop (1200px+)
- Two-panel layout (60% table, 40% detail)
- Full toolbar with all features
- Hover effects and animations

### Tablet (768px - 1199px)
- Collapsible detail panel
- Simplified toolbar
- Touch-friendly interactions

### Mobile (767px and below)
- Single panel view
- Tab-based navigation
- Swipe gestures for navigation

## 🎨 Visual Design System

### Colors
```css
/* Primary Colors */
--primary-blue: #1890ff;
--success-green: #52c41a;
--warning-orange: #faad14;
--error-red: #ff4d4f;

/* Status Colors */
--status-in-progress: #1890ff;
--status-not-started: #8c8c8c;
--status-done: #52c41a;
--status-interview: #faad14;
--status-rejected: #ff4d4f;

/* Neutral Colors */
--background: #ffffff;
--surface: #fafafa;
--border: #d9d9d9;
--text-primary: #262626;
--text-secondary: #8c8c8c;
```

### Typography
```css
/* Font Family */
font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;

/* Font Sizes */
--text-xs: 12px;
--text-sm: 14px;
--text-base: 16px;
--text-lg: 18px;
--text-xl: 20px;
--text-2xl: 24px;
```

### Spacing
```css
/* Spacing Scale */
--space-1: 4px;
--space-2: 8px;
--space-3: 12px;
--space-4: 16px;
--space-6: 24px;
--space-8: 32px;
--space-12: 48px;
```

## 🔄 Animation Specifications

### Hover Animations
- **Duration**: 200ms
- **Easing**: ease-out
- **Properties**: background-color, transform, opacity

### Transitions
- **Page Load**: Fade in (300ms)
- **Panel Switch**: Slide (250ms)
- **Modal Open**: Scale + fade (200ms)

### Loading States
- **Skeleton Loading**: For table rows
- **Spinner**: For API calls
- **Progress Bar**: For file uploads

## 📋 Accessibility Features

### Keyboard Navigation
- **Tab Order**: Logical tab sequence
- **Arrow Keys**: Navigate table cells
- **Enter**: Open detail view
- **Escape**: Close modals

### Screen Reader Support
- **ARIA Labels**: All interactive elements
- **Role Attributes**: Table, button, link roles
- **Live Regions**: Status updates

### Visual Accessibility
- **High Contrast**: Support for high contrast mode
- **Focus Indicators**: Clear focus outlines
- **Color Independence**: Information not conveyed by color alone

---

**Last Updated**: September 2024
**Version**: 1.0.0
