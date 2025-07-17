# JobTracker Backend

The backend for the JobTracker application, providing a RESTful API to manage users, jobs, and notifications.

## Table of Contents
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Setup and Installation](#setup-and-installation)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Variables](#environment-variables)
  - [Running the Development Server](#running-the-development-server)
- [API Documentation](#api-documentation)
  - [Health Check](#health-check)
  - [User Routes](#user-routes)
  - [Job Routes](#job-routes)
  - [Notification Routes](#notification-routes)

## Tech Stack
- **Node.js**: JavaScript runtime for server-side applications.
- **Express.js**: Web framework for Node.js.
- **MongoDB**: NoSQL database for data storage.
- **Mongoose**: Object Data Modeling (ODM) for MongoDB.
- **JSON Web Tokens (JWT)**: Secure user authentication.
- **Bcrypt.js**: Password hashing.
- **Nodemailer**: Email sending (e.g., password resets, notifications).
- **Cloudinary**: Cloud-based file storage (e.g., resumes).
- **Node Cron**: Scheduled tasks (e.g., reminder).
- **Express Validator**: Data validation.
- **Express Rate Limit**: Rate-limiting API requests.

## Project Structure
```
backend/
├── config/
│   └── db.js
├── controllers/
│   ├── jobController.js
│   ├── notificationController.js
│   └── userController.js
├── middleware/
│   ├── auth.js
│   └── errorHandler.js
├── models/
│   ├── Interview.js
│   ├── Job.js
│   ├── Notification.js
│   └── User.js
├── routes/
│   ├── jobRoutes.js
│   ├── notificationRoutes.js
│   └── userRoutes.js
├── utils/
│   ├── cloudinaryUpload.js
│   ├── email.js
│   ├── emailTemplates.js
│   └── jwt.js
├── .gitignore
├── api.js
├── package.json
└── scheduler.js
```

## Setup and Installation

### Prerequisites
- Node.js and npm (or yarn) installed.
- MongoDB instance (e.g., MongoDB Atlas free tier).

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/saksham2882/Job-Tracker.git
   ```
2. Navigate to the `backend` directory:
   ```bash
   cd Job-Tracker/backend
   ```
3. Install dependencies:
   ```bash
   npm install
   ```

### Environment Variables
Create a `.env` file in `backend/` with:
```
# Server Configuration
PORT=5000
CLIENT_URL=https://localhost:5173

# MongoDB
MONGO_URI=your_mongodb_connection_string

# JWT
JWT_SECRET=your_jwt_secret

# Gmail
GMAIL_USER=your_email@gmail.com
GMAIL_PASS=your_gmail_app_password

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
CLOUDINARY_UPLOAD_PRESET=your_cloudinary_upload_preset
```

### Running the Development Server
```bash
npm run dev
```
Server runs on `http://localhost:5000` (or `PORT` from `.env`). 

---
# API Documentation
Base URL: `https://job-tracker-lpiv.onrender.com/api`

### Health Check
- **Method**: `GET`
- **Endpoint**: `/health`
- **Description**: Checks if the backend is running.
- **Authentication**: None
- **Response** (200):
  ```json
  {
    "status": "OK"
  }
  ```

## 1. User Routes
All routes prefixed with `/api/users`.

| Endpoint              | Method | Description                        | Auth Required |
|-----------------------|--------|------------------------------------|---------------|
| `/register`           | POST   | Register a new user                | No            |
| `/login`              | POST   | Log in an existing user            | No            |
| `/me`                 | GET    | Get current user profile           | Yes           |
| `/profile`            | PUT    | Update user profile                | Yes           |
| `/password`           | PUT    | Update user password               | Yes           |
| `/forgot-password`    | POST   | Send password reset code           | No            |
| `/reset-password`     | POST   | Reset password with code           | No            |
| `/delete`             | DELETE | Delete user account                | Yes           |
| `/notification-settings` | POST | Enable notifications for all jobs     | Yes           |

### 1.1 Register User
- **Method**: `POST`
- **Endpoint**: `/register`
- **Request Body**:
  ```json
  {
    "fullName": "ABC",
    "email": "example@gmail.com",
    "password": "password123"
  }
  ```
- **Success Response** (200):
  ```json
  {
    "user": {
      "id": "60d0fe4f5311236168a109ca",
      "fullName": "ABC",
      "email": "example@gmail.com"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
  ```
- **Error Response** (400):
  ```json
  {
    "error": "Email address is already registered"
  }
  ```

### 1.2 Login User
- **Method**: `POST`
- **Endpoint**: `/login`
- **Request Body**:
  ```json
  {
    "email": "example@gmail.com",
    "password": "password123"
  }
  ```
- **Success Response** (200):
  ```json
  {
    "user": {
      "id": "60d0fe4f5311236168a109ca",
      "fullName": "ABC",
      "email": "example@gmail.com"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
  ```
- **Error Response** (401):
  ```json
  {
    "error": "Invalid email or password"
  }
  ```

### 1.3 Get Current User
- **Method**: `GET`
- **Endpoint**: `/me`
- **Success Response** (200):
  ```json
  {
    "id": "60d0fe4f5311236168a109ca",
    "fullName": "ABC",
    "email": "example@gmail.com",
    "createdAt": "2023-01-01T00:00:00.000Z"
  }
  ```

### 1.4 Update User Profile
- **Method**: `PATCH`
- **Endpoint**: `/profile`
- **Request Body**:
  ```json
  {
    "fullName": "ABC"
  }
  ```
- **Success Response** (200):
  ```json
  {
    "user": {
      "id": "60d0fe4f5311236168a109ca",
      "fullName": "ABC",
      "email": "example@gmail.com",
      "createdAt": "2023-01-01T00:00:00.000Z"
    }
  }
  ```

### 1.5 Update Password
- **Method**: `PATCH`
- **Endpoint**: `/password`
- **Request Body**:
  ```json
  {
    "currentPassword": "password123",
    "newPassword": "newpassword456"
  }
  ```
- **Success Response** (200):
  ```json
  {
    "message": "Password updated successfully"
  }
  ```

### 1.6 Forgot Password
- **Method**: `POST`
- **Endpoint**: `/forgot-password`
- **Request Body**:
  ```json
  {
    "email": "example@gmail.com"
  }
  ```
- **Success Response** (200):
  ```json
  {
    "message": "A 6-digit reset code has been sent to your email"
  }
  ```

### 1.7 Reset Password
- **Method**: `POST`
- **Endpoint**: `/reset-password`
- **Request Body**:
  ```json
  {
    "code": "123456",
    "password": "newpassword456"
  }
  ```
- **Success Response** (200):
  ```json
  {
    "message": "Password has been reset successfully"
  }
  ```

### 1.8 Delete User
- **Method**: `DELETE`
- **Endpoint**: `/delete`
- **Success Response** (200):
  ```json
  {
    "message": "Account deleted successfully"
  }
  ```

### 1.9 Update Notification Settings
- **Method**: `PATCH`
- **Endpoint**: `/notification-settings`
- **Success Response** (200):
  ```json
  {
    "message": "Enabled notifications for all jobs (5 jobs updated)"
  }
  ```



## 2. Job Routes
All routes prefixed with `/api/jobs`. All require authentication.

| Endpoint         | Method | Description                     | Auth Required |
|------------------|--------|---------------------------------|---------------|
| `/`              | POST   | Add a new job                   | Yes           |
| `/`              | GET    | Get all jobs (with filters)     | Yes           |
| `/:id`           | GET    | Get a single job                | Yes           |
| `/:id`           | PUT    | Update a job                    | Yes           |
| `/:id`           | DELETE | Delete a job                    | Yes           |
| `/:id/reminder`  | PATCH  | Toggle job reminder             | Yes           |
| `/:id/pin`       | PATCH  | Toggle job pin status           | Yes           |
| `/upload`        | POST   | Upload resume                   | Yes           |
| `/:id/details`   | GET    | Get Job details                 | Yes           |
| `/disable-notifications`| GET   | Disable Notification for all jobs  | Yes           |

### 2.1 Add Job
- **Method**: `POST`
- **Endpoint**: `/`
- **Request Body**:
  ```json
  {
    "companyName": "Innovate Inc.",
    "role": "Frontend Developer",
    "status": "Applied",
    "applicationDate": "2025-07-16",
    "deadlineDate": "2025-07-20",
    "source": "Company Website",
    "sourceLink": "https://innovateinc.com/careers",
    "priorityLevel": "High",
    "jobDescription": "Responsible for creating user-friendly web pages.",
    "reminderOn": true,
    "notes": "Followed up with recruiter.",
    "location": "Remote",
    "stipendOrSalary": "20,000 INR",
    "resumePath": "https://res.cloudinary.com/...",
    "interviews": [
      {
        "round": "Coding",
        "interviewDate": "2025-08-01",
        "status": "Scheduled",
        "comments": "Initial screening call."
      }
    ]
  }
  ```
- **Success Response** (201):
  ```json
  {
    "_id": "60d0fe4f5311236168a109cb",
    "companyName": "Innovate Inc.",
    "role": "Frontend Developer",
    ...
  }
  ```

### 2.2 Get Jobs
- **Method**: `GET`
- **Endpoint**: `/`
- **Query Params**: `?status=Applied&priorityLevel=High&search=Engineer`
- **Success Response** (200):
  ```json
  [
    {
      "_id": "60d0fe4f5311236168a109cb",
      "companyName": "Tech Corp",
      "role": "Software Engineer",
      "status": "Applied"
      .....
    }
  ]
  ```

### 2.3 Get Job
- **Method**: `GET`
- **Endpoint**: `/:id`
- **Success Response** (200):
  ```json
  {
    "_id": "60d0fe4f5311236168a109cb",
    "companyName": "Innovate Inc.",
    "role": "Frontend Developer",
    ...
  }
  ```

### 2.4 Update Job
- **Method**: `PUT`
- **Endpoint**: `/:id`
- **Request Body**:
  ```json
  {
    "companyName": "Innovate Inc.",
    "role": "Frontend Developer",
    "status": "Interviewing",
    ...
  }
  ```
- **Success Response** (200):
  ```json
  {
    "_id": "60d0fe4f5311236168a109cb",
    "companyName": "Innovate Inc.",
    "role": "Frontend Developer",
    ...
  }
  ```

### 2.5 Delete Job
- **Method**: `DELETE`
- **Endpoint**: `/:id`
- **Success Response** (200):
  ```json
  {
    "message": "Job deleted"
  }
  ```

### 2.6 Toggle Reminder
- **Method**: `PATCH`
- **Endpoint**: `/:id/reminder`
- **Request Body**:
  ```json
  {
    "reminderOn": true
  }
  ```
- **Success Response** (200):
  ```json
  {
    "message": "Reminder enabled",
    "reminderOn": true
  }
  ```

### 2.7 Toggle Pin
- **Method**: `PATCH`
- **Endpoint**: `/:id/pin`
- **Success Response** (200):
  ```json
  {
    "message": "Job pinned: Frontend Developer at Innovate Inc.",
    "isPinned": true
  }
  ```

### 2.8 Upload Resume
- **Method**: `POST`
- **Endpoint**: `/upload`
- **Success Response** (200):
  ```json
  {
    "resumePath": "https://res.cloudinary.com/..."
  }
  ```

### 2.9 Get Job Details
- **Method**: `GET`
- **Endpoint**: `/:id/details`
- **Success Response** (200):
  ```json
  {
    "id": "60d0fe4f5311236168a109cb",
    "company": "Innovate Inc.",
    "Role": "Frontend Developer",
    "description": ".....",
    "location": "New York",
    ......
    }
  ```

### 2.10 Disable Reminder for all Jobs
- **Method**: `GET`
- **Endpoint**: `/reminder`
- **Success Response** (200):
  ``` json 
  {
    "message": "Disabled Reminder for all jobs.",
  }


## Notification Routes
All routes prefixed with `/api/notifications`. All require authentication.

| Endpoint    | Method | Description                     | Auth Required |
|-------------|--------|---------------------------------|---------------|
| `/`         | GET    | Get all notifications           | Yes           |
| `/:id/read` | PUT    | Mark notification as read       | Yes           |
| `/:id`      | DELETE | Delete a notification           | Yes           |

### 3.1 Get Notifications
- **Method**: `GET`
- **Endpoint**: `/`
- **Success Response** (200):
  ```json
  [
    {
      "_id": "60d0fe4f5311236168a109ce",
      "message": "Job added: Frontend Developer at Innovate Inc.",
      "isRead": false,
      "createdAt": "2025-07-16T00:00:00.000Z"
    }
  ]
  ```

### 3.2 Mark Notification as Read
- **Method**: `PUT`
- **Endpoint**: `/:id/read`
- **Success Response** (200):
  ```json
  {
    "message": "Notification marked as read"
  }
  ```

#### 3.3 Delete Notification
- **Method**: `DELETE`
- **Endpoint**: `/:id`
- **Success Response** (200):
  ```json
  {
    "message": "Notification deleted"
  }
  ```


---
