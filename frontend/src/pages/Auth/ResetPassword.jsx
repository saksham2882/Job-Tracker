import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/api";
import { motion } from "framer-motion";
import LoadingSpinner from "../../components/ui/LoadingSpinner";
import toast from "react-hot-toast";
import InputField from "../../components/ui/InputField";
import AuthLayout from "../../components/Layouts/AuthLayout";
import { FaKey, FaLock } from "react-icons/fa";
import { AuthContext } from "../../contexts/AuthContext";
import { validatePassword, getPasswordStrength } from "../../utils/validation";

export default function ResetPassword() {
  const { loading } = useContext(AuthContext);
  const navigate = useNavigate();
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setPasswordError("");
    if (!validatePassword(password, setPasswordError, "New password")) return;
    setIsSubmitting(true);

    try {
      await api.post("/users/reset-password", { code, password });
      toast.success("Password has been reset successfully");
      navigate("/signin");
    } catch (err) {
      setError(err.response?.data?.error || "Failed to reset password");
      toast.error("Failed to reset password");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading ?? false) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--bg)]">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <AuthLayout>
      <motion.form
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        onSubmit={handleSubmit}
        className="w-full p-6 sm:p-8 bg-[var(--card)] rounded-lg shadow-lg"
      >
        <h2 className="text-2xl sm:text-3xl font-bold text-[var(--primary)] mb-6 text-center flex items-center justify-center gap-2">
          <FaKey /> Reset Password
        </h2>

        {error && (
          <p className="error">
            {error}
          </p>
        )}
        {passwordError && (
          <p className="error">
            {passwordError}
          </p>
        )}

        <div className="mb-4">
          <InputField
            label="Reset Code"
            name="code"
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Enter 6-digit code"
            icon={FaKey}
            required
            maxLength={6}
          />
        </div>

        <div className="mb-4">
          <InputField
            label="New Password"
            name="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter new password"
            icon={FaLock}
            required
          />
          {password && (
            <p
              className={`text-[13px] mt-1 ${ getPasswordStrength(password) === "Weak" ? "text-[var(--danger)]"
                  : getPasswordStrength(password) === "Medium" ? "text-yellow-600" : "text-green-600"
              }`}
            >
              Password Strength: {getPasswordStrength(password)}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className={`btn btn-primary w-full flex items-center justify-center gap-2 text-[13px] sm:text-[15px] py-2 sm:py-3 ${
            isSubmitting ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {isSubmitting ? "Resetting Password..." : "Reset Password"}
        </button>

        <p className="mt-4 text-center text-[13px] sm:text-[15px]">
          <a
            href="/forgot-password"
            className="text-[var(--primary)] hover:underline"
          >
            Resend
          </a>
          {" | "}
          <a href="/signin" className="text-[var(--primary)] hover:underline">
            Sign In
          </a>
        </p>

      </motion.form>
    </AuthLayout>
  );
}