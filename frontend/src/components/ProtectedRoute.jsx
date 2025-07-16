import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";
import LoadingSpinner from "./ui/LoadingSpinner";

export default function ProtectedRoute({ children }) {
  const { authUser, loading } = useContext(AuthContext);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--bg)]">
        <LoadingSpinner />
      </div>
    );
  }

  if (!authUser) {
    return <Navigate to="/signin" replace />;
  }

  return children;
}