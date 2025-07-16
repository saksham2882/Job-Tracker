import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/api";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import validator from "validator";
import disposableDomains from "disposable-email-domains";
import LoadingSpinner from "../../components/ui/LoadingSpinner";
import InputField from "../../components/ui/InputField";
import AuthLayout from "../../components/Layouts/AuthLayout";
import { FaEnvelope } from "react-icons/fa";
import { AuthContext } from "../../contexts/AuthContext";


const validEmailDomains = ['gmail.com', 'yahoo.com', 'outlook.com' ];

export default function ForgotPassword() {
  const { loading } = useContext(AuthContext);
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [formErrors, setFormErrors] = useState({ email: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setFormErrors({ email: "" });

    // Validate email
    if (!validator.isEmail(email)) {
      setFormErrors({ email: "Invalid email format" });
      toast.error("Invalid email format");
      return;
    }
    const domain = email.split('@')[1].toLowerCase();
    if (disposableDomains.includes(domain)) {
      setFormErrors({ email: "Disposable emails are not allowed" });
      toast.error("Disposable emails are not allowed");
      return;
    }
    if (!validEmailDomains.includes(domain)) {
      setFormErrors({ email: "Please use a trusted email provider (e.g., Gmail, Yahoo, Outlook)" });
      toast.error("Please use a trusted email provider");
      return;
    }

    setIsSubmitting(true);
    try {
      await api.post("/users/forgot-password", { email });
      toast.success("A 6-digit reset code has been sent to your email");
      navigate("/reset-password");
    } catch (err) {
      setError(err.response?.data?.error || "Failed to send reset code");
      toast.error(err.response?.data?.error || "Failed to send reset code");
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
          <FaEnvelope /> Forgot Password
        </h2>

        {error && (
          <p className="text-[var(--danger)] mb-4 text-center text-[13px] sm:text-[15px]">
            {error}
          </p>
        )}

        <div className="mb-4">
          <InputField
            label="Email Address"
            name="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            icon={FaEnvelope}
            required
          />
          {formErrors.email && (
            <p className="text-[var(--danger)] text-[13px] mt-1">
              {formErrors.email}
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
          {isSubmitting ? "Sending Code..." : "Send Reset Code"}
        </button>

        <p className="mt-4 text-center text-[13px] sm:text-[15px]">
          <a href="/signin" className="text-[var(--primary)] hover:underline">
            Back to Sign In
          </a>
        </p>
      </motion.form>
    </AuthLayout>
  );
}