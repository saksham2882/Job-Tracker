# JobTracker

**JobTracker** is a full-stack application to manage and track job applications seamlessly. The frontend, built with React and Vite, is deployed on [Vercel](https://jobtracket-frontend.vercel.app), offering a responsive UI and Progressive Web App (PWA) support. The backend, built with Node.js and Express, is deployed on [Render](https://job-tracker-lpiv.onrender.com), providing a RESTful API with MongoDB for data storage.

## Table of Contents
- [Overview](#overview)
- [Technologies Used](#technologies-used)
  - [Frontend](#frontend)
  - [Backend](#backend)
- [Features](#features)
- [Project Structure](#project-structure)
- [Setup and Installation](#setup-and-installation)
  - [Prerequisites](#prerequisites)
  - [Frontend Setup](#frontend-setup)
  - [Backend Setup](#backend-setup)
- [API Documentation](#api-documentation)
  - [Health Check](#health-check)
  - [User Routes](#user-routes)
  - [Job Routes](#job-routes)
  - [Notification Routes](#notification-routes)
- [Documentation](#documentation)
- [Contributing](#contributing)

## Overview
JobTracker helps users manage their job application process with a user-friendly interface and robust backend. Key functionalities include tracking job applications, setting reminders, visualizing progress, and managing resumes tailored for different companies and roles. The frontend provides an interactive dashboard, while the backend handles data storage, authentication, and notifications.

## Technologies Used

### Frontend
- **React**: JavaScript library for building user interfaces.
- **Vite**: Fast build tool with PWA support.
- **React Router**: Routing and navigation.
- **Tailwind CSS**: Utility-first CSS framework.
- **Axios**: HTTP client for API requests.
- **JWT Decode**: Client-side JWT decoding.
- **Validator**: Client-side data validation.
- **Chart.js**: Job application statistics visualization.
- **FullCalendar**: Interactive calendar for deadlines and interviews.
- **Framer Motion**: Smooth animations and transitions.
- **React Hot Toast & Sonner**: In-app notifications.
- **React Icons**: Icon library.

### Backend
- **Node.js**: Server-side JavaScript runtime.
- **Express.js**: Web framework for APIs.
- **MongoDB**: NoSQL database (via MongoDB Atlas).
- **Mongoose**: ODM for MongoDB.
- **JSON Web Tokens (JWT)**: Secure authentication.
- **Bcrypt.js**: Password hashing.
- **Nodemailer**: Email notifications (e.g., password resets).
- **Cloudinary**: Cloud-based file storage (resumes).
- **Node Cron**: Scheduled tasks (reminders).
- **Express Validator**: Data validation.
- **Express Rate Limit**: API request rate-limiting.

## Features
JobTracker offers a comprehensive set of features for job application management:

- **User Authentication**:
  - Secure sign-up, sign-in, and password reset with email validation to block disposable emails (`AuthContext`, `/api/users`).
- **Dashboard**:
  - Centralized hub with:
    - **Bar Charts**: Visualize job stats (e.g., Applied, Interviewing, Offers) using Chart.js.
    - **Interactive Calendar**: Displays deadlines and interviews; clickable dates redirect to job details (FullCalendar).
    - **Recent Jobs List**: Shows recently added/updated jobs (`RecentJobList`).
- **Comprehensive Job Management**:
  - **Full CRUD**: Create, read, update, delete job applications (`JobEntryPage`, `EditJobPage`, `JobListPage`, `JobDetails`).
  - **Advanced Filtering**: Filter by status, priority, source, location, or search terms (`Filters`, `/api/jobs`).
  - **Pinned Jobs**: Pin important jobs to top (`/api/jobs/:id/pin`).
  - **Job Notes**: Add/edit job-specific notes for follow-ups or details.
  - **Resume Tracking**: Manage resumes tailored per company (`/api/jobs/upload`).
  - **Status History**: Tracks job status changes (e.g., Applied → Interviewing).
  - **Timeline View**: Visualizes job application history (`Timeline`).
  - **Interview Management**: Add/track/update interview rounds with details (`/api/jobs`).
- **Reminders**:
  - Automated reminders 1 and 2 days before deadlines/interviews (`scheduler.js`, `ReminderContext`, `/api/jobs/:id/reminder`).
  - Toggle reminders per job or all jobs (`/api/jobs/disable-notifications`).
- **In-App Notifications**:
  - Real-time notifications for job additions, updates, or status changes (`Notifications`, `/api/notifications`).
- **User Settings**:
  - Update profile and password (`Settings`, `/api/users/profile`).
  - Toggle light/dark themes (`ThemeContext`).
  - Enable/disable email notifications (`/api/users/notification-settings`).
- **Responsive Design**:
  - Optimized for phones, tablets, and laptops (`Tailwind CSS`, `Framer Motion`).
- **Progressive Web App (PWA)**:
  - Installable as an app on devices for native-like experience.

## Project Structure
```
JobTracket/
├── backend/
│   ├── config/
│   │   └── db.js                     # MongoDB connection
│   ├── controllers/
│   │   ├── jobController.js          # Job logic
│   │   ├── notificationController.js # Notification logic
│   │   └── userController.js         # User logic
│   ├── middleware/
│   │   ├── auth.js                   # JWT authentication
│   │   └── errorHandler.js           # Error handling
│   ├── models/
│   │   ├── Interview.js              # Interview schema
│   │   ├── Job.js                    # Job schema
│   │   ├── Notification.js           # Notification schema
│   │   └── User.js                   # User schema
│   ├── routes/
│   │   ├── jobRoutes.js              # Job API routes
│   │   ├── notificationRoutes.js     # Notification API routes
│   │   └── userRoutes.js             # User API routes
│   ├── utils/
│   │   ├── cloudinaryUpload.js       # Cloudinary file upload
│   │   ├── email.js                  # Email utilities
│   │   ├── emailTemplates.js         # Email templates
│   │   └── jwt.js                    # JWT utilities
│   ├── .gitignore
│   ├── api.js                        # Main Express app
│   ├── package.json
│   ├── README.md                     # Backend documentation
│   └── scheduler.js                  # Scheduled tasks
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   │   └── api.js                # API request handlers
│   │   ├── assets/
│   │   │   └── react.svg             # Static assets
│   │   ├── components/
│   │   │   ├── Layouts/
│   │   │   │   ├── AuthLayout.jsx    # Auth pages layout
│   │   │   │   └── Layout.jsx        # Main app layout
│   │   │   ├── ui/
│   │   │   │   ├── CustomDropdown.jsx # Reusable dropdown
│   │   │   │   ├── InputField.jsx    # Reusable input
│   │   │   │   └── LoadingSpinner.jsx # Loading indicator
│   │   │   ├── Calendar.jsx          # Interactive calendar
│   │   │   ├── ErrorBoundary.jsx     # Error handling
│   │   │   ├── FileUploader.jsx      # Resume upload
│   │   │   ├── Filters.jsx           # Job filtering/sorting
│   │   │   ├── Footer.jsx            # Footer
│   │   │   ├── Header.jsx            # Navigation bar
│   │   │   ├── JobEntry.jsx          # Job creation/edit
│   │   │   ├── JobList.jsx           # Job list
│   │   │   ├── Modal.jsx             # Reusable modal
│   │   │   ├── Notifications.jsx     # In-app notifications
│   │   │   ├── ProtectedRoute.jsx    # Auth-protected routes
│   │   │   ├── RecentJobList.jsx     # Recent jobs
│   │   │   ├── Sidebar.jsx           # Mobile navigation
│   │   │   ├── Timeline.jsx          # Job history
│   │   │   └── ToastMessage.jsx      # Toast notifications
│   │   ├── contexts/
│   │   │   ├── AuthContext.jsx       # Authentication
│   │   │   ├── ReminderContext.jsx   # Reminders
│   │   │   └── ThemeContext.jsx      # Theme management
│   │   ├── pages/
│   │   │   ├── Auth/
│   │   │   │   ├── ForgotPassword.jsx # Password reset request
│   │   │   │   ├── ResetPassword.jsx  # Password reset
│   │   │   │   ├── SignIn.jsx        # Sign-in
│   │   │   │   └── SignUp.jsx        # Sign-up
│   │   │   ├── Jobs/
│   │   │   │   ├── EditJobPage.jsx   # Edit job
│   │   │   │   ├── JobDetails.jsx    # Job details
│   │   │   │   ├── JobEntryPage.jsx  # Create job
│   │   │   │   └── JobListPage.jsx   # Job list
│   │   │   ├── Dashboard.jsx         # Main dashboard
│   │   │   ├── Landing.jsx           # Homepage
│   │   │   └── Settings.jsx          # User settings
│   │   ├── utils/
│   │   │   └── validation.js         # Client-side validation
│   │   ├── App.jsx                   # Main app
│   │   ├── index.css                 # Global styles
│   │   └── main.jsx                  # Entry point
│   ├── .gitignore
│   ├── package.json
│   ├── vite.config.js
│   ├── README.md                     # Frontend documentation
│   └── public/
│       └── manifest.json             # PWA manifest
├── .gitignore
└── README.md                         # This file
```

## Setup and Installation

### Prerequisites
- Node.js and npm (or yarn) installed.
- MongoDB Atlas account (free tier, 512MB).
- Cloudinary account for file uploads.
- Gmail account with app password for Nodemailer.

### Frontend Setup
1. Clone the repository:
   ```bash
   git clone https://github.com/saksham2882/Job-Tracker.git
   ```
2. Navigate to `frontend/`:
   ```bash
   cd Job-Tracker/frontend
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Create `.env` in `frontend/`:
   ```
   VITE_API_URL=https://localhost:5000/api
   ```
5. Run development server:
   ```bash
   npm run dev
   ```
   Runs on `http://localhost:5173`.


### Backend Setup
1. Navigate to `backend/`:
   ```bash
   cd Job-Tracker/backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create `.env` in `backend/`:
   ```
   PORT=5000
   CLIENT_URL=https://localhost:5173
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   GMAIL_USER=your_email@gmail.com
   GMAIL_PASS=your_gmail_app_password
   CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret
   CLOUDINARY_UPLOAD_PRESET=your_cloudinary_upload_preset
   ```
4. Run development server:
   ```bash
   npm run dev
   ```
   Runs on `http://localhost:5000`.


## API Documentation
Base URL: `https://localhost:5000/api`

### Health Check
- **Method**: `GET`
- **Endpoint**: `/health`
- **Description**: Checks if backend is running (wakes Render from sleep).
- **Response** (200):
  ```json
  {"status":"OK"}
  ```

### User Routes (`/api/users`)
| Endpoint              | Method | Description                        | Auth Required |
|-----------------------|--------|------------------------------------|---------------|
| `/register`           | POST   | Register a new user                | No            |
| `/login`              | POST   | Log in an existing user            | No            |
| `/me`                 | GET    | Get current user profile           | Yes           |
| `/profile`            | PATCH  | Update user profile                | Yes           |
| `/password`           | PATCH  | Update user password               | Yes           |
| `/forgot-password`    | POST   | Send password reset code           | No            |
| `/reset-password`     | POST   | Reset password with code           | No            |
| `/delete`             | DELETE | Delete user account                | Yes           |
| `/notification-settings` | PATCH | Enable/disable notifications     | Yes           |


### Job Routes (`/api/jobs`)
| Endpoint              | Method | Description                     | Auth Required |
|-----------------------|--------|---------------------------------|---------------|
| `/`                   | POST   | Add a new job                   | Yes           |
| `/`                   | GET    | Get all jobs (with filters)     | Yes           |
| `/:id`                | GET    | Get a single job                | Yes           |
| `/:id`                | PUT    | Update a job                    | Yes           |
| `/:id`                | DELETE | Delete a job                    | Yes           |
| `/:id/reminder`       | PATCH  | Toggle job reminder             | Yes           |
| `/:id/pin`            | PATCH  | Toggle job pin status           | Yes           |
| `/upload`             | POST   | Upload resume                   | Yes           |
| `/:id/details`        | GET    | Get job details                 | Yes           |
| `/disable-notifications` | GET | Disable notifications for all jobs | Yes           |


### Notification Routes (`/api/notifications`)
| Endpoint    | Method | Description                     | Auth Required |
|-------------|--------|---------------------------------|---------------|
| `/`         | GET    | Get all notifications           | Yes           |
| `/:id/read` | PUT    | Mark notification as read       | Yes           |
| `/:id`      | DELETE | Delete a notification           | Yes           |


## Documentation
For detailed information on each component of the project:
- **Frontend Documentation**: [frontend/README.md](frontend/README.md)
- **Backend Documentation**: [backend/README.md](backend/README.md)

## Contributing
1. Fork the repository: [saksham2882/Job-Tracker](https://github.com/saksham2882/Job-Tracker).
2. Create a feature branch: `git checkout -b feature/your-feature-name`.
3. Commit changes: `git commit -m "Add feature"`.
4. Push to branch: `git push origin feature/your-feature-name`.
5. Open a pull request on GitHub.


---
