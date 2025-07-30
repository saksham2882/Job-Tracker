# JobTracker Frontend 🗓️

The frontend for **JobTracker**, a powerful and intuitive tool to manage and track job applications seamlessly. Built with React and Vite, styled with Tailwind CSS, deployed on Vercel, and integrated with a Node.js backend. Supports **Progressive Web App (PWA)** functionality for app-like experience on any device.

---

## Table of Contents
- [Technologies Used](#technologies-used)
- [Features](#features)
- [Project Structure](#project-structure)
- [Components and Pages Overview](#components-and-pages-overview)
  - [Components](#components)
  - [Pages](#pages)
- [Setup and Installation](#setup-and-installation)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Variables](#environment-variables)
  - [Running the Development Server](#running-the-development-server)
- [Contributing](#contributing)

---

## Technologies Used
- **React**: JavaScript library for building user interfaces.
- **Vite**: Fast build tool for modern web projects.
- **React Router**: Routing and navigation.
- **Tailwind CSS**: Utility-first CSS framework for styling.
- **Axios**: Promise-based HTTP client for API requests.
- **JWT Decode**: Client-side JWT token decoding.
- **Validator**: Client-side data validation.
- **Chart.js**: Charts and visualizations.
- **FullCalendar**: Calendar view for job events.
- **Framer Motion**: Smooth animations and transitions.
- **React Hot Toast**: Notifications and toasts.
- **React Icons**: Collection of popular icons.

---

## Features
JobTracker offers a comprehensive set of features to streamline your job application process:

- **User Authentication**:
  - Secure sign-up, sign-in, and password reset with email validation to block disposable emails.
- **Dashboard**:
  - Centralized hub with:
    - **Bar Charts**: Visualize job application statistics (e.g., applied, interviewing, offers) using Chart.js.
    - **Interactive Calendar**: Displays deadlines and interview dates. Clicking a date redirects to the job's details page.
    - **Recent Jobs List**: Shows recently added or updated jobs for quick access.
- **Comprehensive Job Management**:
  - **Full CRUD**: Create, read, update, and delete job applications.
   - **Advanced Filtering**: Filter by status, priority, source, location, or search terms.
  - **Pinned Jobs**: Pin important jobs to top.
  - **Job Notes**: Add and edit specific notes directly in job details.
  - **Resume Tracking**: Record and manage different resumes tailored for specific companies.
   - **Status History**: Tracks job status changes (e.g., Applied → Interviewing).
  - **Timeline View**: Visualize the complete job application process history.
  - **Interview Management**: Add, track, and update multiple interview rounds per job with details like round, date, and comments.
- **Reminders**:
  - Automated email reminders 1 and 2 days before job deadlines/interviews.
  - Toggle reminders per job.
- **In-App Notifications**:
  - Real-time notifications for events like job Reminder, additions, updates.
- **User Settings**:
  - Update profile and password.
  - Toggle between light and dark themes.
  - Enable/disable email notifications for all jobs.
- **Responsive Design**:
  - Fully responsive UI, optimized for phones, tablets, and laptops.
  - Smooth animations for transitions and interactions.
- **Progressive Web App (PWA)**:
  - Installable as an app on phones, tablets, and laptops for native-like experience.
 
---

## Project Structure
```
frontend/
├── src/
│   ├── api/
│   │   └── api.js                     # API request handlers
│   ├── assets/
│   │   └── react.svg                  # Static assets
│   ├── components/
│   │   ├── Layouts/
│   │   │   ├── AuthLayout.jsx         # Layout for auth pages
│   │   │   └── Layout.jsx             # Main app layout
│   │   ├── ui/
│   │   │   ├── CustomDropdown.jsx     # Reusable dropdown
│   │   │   ├── InputField.jsx         # Reusable input field
│   │   │   └── LoadingSpinner.jsx     # Loading indicator
│   │   ├── Calendar.jsx               # Interactive calendar
│   │   ├── ErrorBoundary.jsx          # Error handling wrapper
│   │   ├── FileUploader.jsx           # Resume upload component
│   │   ├── Filters.jsx                # Job filtering/sorting
│   │   ├── Footer.jsx                 # Footer component
│   │   ├── Header.jsx                 # Navigation bar
│   │   ├── JobEntry.jsx               # Job creation/edit form
│   │   ├── JobList.jsx                # Job list renderer
│   │   ├── Modal.jsx                  # Reusable modal
│   │   ├── Notifications.jsx          # In-app notifications
│   │   ├── ProtectedRoute.jsx         # Auth-protected routes
│   │   ├── RecentJobList.jsx          # Recent jobs list
│   │   ├── Sidebar.jsx                # Mobile navigation
│   │   ├── Timeline.jsx               # Job process history
│   │   └── ToastMessage.jsx           # Toast notifications
│   ├── contexts/
│   │   ├── AuthContext.jsx            # Authentication context
│   │   ├── ReminderContext.jsx        # Reminder management
│   │   └── ThemeContext.jsx           # Theme management
│   ├── pages/
│   │   ├── Auth/
│   │   │   ├── ForgotPassword.jsx     # Password reset request
│   │   │   ├── ResetPassword.jsx      # Password reset form
│   │   │   ├── SignIn.jsx             # Sign-in page
│   │   │   └── SignUp.jsx             # Sign-up page
│   │   ├── Jobs/
│   │   │   ├── EditJobPage.jsx        # Edit job page
│   │   │   ├── JobDetails.jsx         # Job details view
│   │   │   ├── JobEntryPage.jsx       # Create job page
│   │   │   └── JobListPage.jsx        # Job list page
│   │   ├── Dashboard.jsx              # Main dashboard
│   │   ├── Landing.jsx                # Homepage
│   │   └── Settings.jsx               # User settings
│   ├── utils/
│   │   └── validation.js              # Client-side validation
│   ├── App.jsx                        # Main app component
│   ├── index.css                      # Global styles
│   └── main.jsx                       # Entry point
├── .gitignore
├── package.json
└── vite.config.js
```

---

## Components and Pages Overview

### Components
| Component         | Description                                      |
|-------------------|--------------------------------------------------|
| `Calendar`        | Interactive calendar for deadlines and interviews; clickable dates redirect to job details. |
| `Filters`         | Filter/sort jobs by status, priority, source, etc. |
| `Header`          | Main navigation bar with links to key pages.    |
| `JobEntry`        | Form for creating/editing job applications.     |
| `JobList`         | Displays list of jobs with pinning support.     |
| `Modal`           | Reusable modal for dialogs and confirmations.   |
| `Notifications`   | Shows real-time in-app notifications.           |
| `ProtectedRoute`  | Protects routes requiring authentication.       |
| `Sidebar`         | Mobile-friendly navigation sidebar.             |
| `Timeline`        | Visualizes job application status history.      |
| `ToastMessage`    | Displays toast notifications for user actions.  |
| `FileUploader`    | Uploads resumes tailored for companies.         |
| `RecentJobList`   | Shows recently added/updated jobs.              |

### Pages
| Page             | Description                                      |
|------------------|--------------------------------------------------|
| `Dashboard`      | Hub with stats, calendar, and recent jobs.      |
| `JobListPage`    | Full job list with filtering and sorting.       |
| `JobEntryPage`   | Create new job application.                     |
| `EditJobPage`    | Edit existing job application.                  |
| `JobDetails`     | Detailed view of a job with notes and timeline. |
| `Settings`       | Manage profile, password, theme, notifications. |
| `SignIn`         | User sign-in page.                             |
| `SignUp`         | User sign-up page.                             |
| `ForgotPassword` | Request password reset code.                   |
| `ResetPassword`  | Reset password using code.                     |
| `Landing`        | Homepage for unauthenticated users.             |

---

## Setup and Installation

### Prerequisites
- Node.js and npm (or yarn) installed.

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/saksham2882/Job-Tracker.git
   ```
2. Navigate to the `frontend` directory:
   ```bash
   cd Job-Tracker/frontend
   ```
3. Install dependencies:
   ```bash
   npm install
   ```

### Environment Variables
Create a `.env` file in `frontend/` with:
```
VITE_API_URL=https://localhost:5000/api
```
This points to the backend API on locally.

### Running the Development Server
```bash
npm run dev
```
Runs on `http://localhost:5173`.

---

## Contributing
1. Fork the repository: [saksham2882/Job-Tracker](https://github.com/saksham2882/Job-Tracker).
2. Create a feature branch: `git checkout -b feature/your-feature-name`.
3. Commit changes: `git commit -m "Add feature"`.
4. Push to branch: `git push origin feature/your-feature-name`.
5. Open a pull request on GitHub.

---

