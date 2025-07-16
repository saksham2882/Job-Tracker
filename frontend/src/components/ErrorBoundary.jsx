import React from "react";
import toast from "react-hot-toast";
import { FaExclamationTriangle, FaRedo } from "react-icons/fa";

export default class ErrorBoundary extends React.Component {
  state = { hasError: false, error: null };

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught:", error, errorInfo);
    toast.error("Something went wrong");
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-[var(--bg)] p-4">
          <div className="bg-[var(--card)] p-6 rounded-lg shadow-lg text-center w-full max-w-sm">
            <h2 className="text-lg font-semibold text-[var(--danger)] mb-4 flex items-center gap-2 justify-center">
              <FaExclamationTriangle className="text-base" /> Something went
              wrong
            </h2>
            <p className="text-sm text-[var(--secondary)] mb-4">
              An error occurred. Please try again or contact support.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="btn btn-primary text-sm justify-self-center"
            >
              <FaRedo />
              Reload
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
