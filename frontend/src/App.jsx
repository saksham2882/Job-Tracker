import { Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./contexts/ThemeContext";
import { AuthProvider } from "./contexts/AuthContext";
import { ReminderProvider } from "./contexts/ReminderContext";
import Landing from "./pages/Landing";
import SignIn from "./pages/Auth/SignIn";
import SignUp from "./pages/Auth/SignUp";
import ForgotPassword from "./pages/Auth/ForgotPassword";
import Dashboard from "./pages/Dashboard";
import JobListPage from "./pages/Jobs/JobListPage";
import JobEntryPage from "./pages/Jobs/JobEntryPage";
import EditJobPage from "./pages/Jobs/EditJobPage";
import Settings from "./pages/Settings";
import ResetPassword from "./pages/Auth/ResetPassword";
import ProtectedRoute from "./components/ProtectedRoute";
import ErrorBoundary from "./components/ErrorBoundary";
import Layout from "./components/Layouts/Layout";
import ToastMessage from "./components/ToastMessage";
import "./index.css";
import JobDetails from "./pages/Jobs/JobDetails";
import axios from "axios";
import { useEffect } from "react";

function App() {
  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_URL}/health`, { withCredentials: true })
      .then(() => console.log('Backend awake'))
      .catch(err => console.error('Wake-up failed:', err));
  }, []);

  return (
    <AuthProvider>
      <ThemeProvider>
        <ErrorBoundary>
          <ReminderProvider>
            <ToastMessage />
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/signin" element={<SignIn />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route
                element={
                  <ProtectedRoute>
                    <Layout />
                  </ProtectedRoute>
                }
              >
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/jobs/list" element={<JobListPage />} />
                <Route path="/jobs/add" element={<JobEntryPage />} />
                <Route path="/jobs/edit/:id" element={<EditJobPage />} />
                <Route path="/jobs/details/:id" element={<JobDetails />} />
                <Route path="/settings" element={<Settings />} />
              </Route>
            </Routes>
          </ReminderProvider>
        </ErrorBoundary>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;
