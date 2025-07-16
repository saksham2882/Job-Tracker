import { useState, useContext, useEffect } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import api from "../../api/api";
import { motion } from "framer-motion";
import LoadingSpinner from "../../components/ui/LoadingSpinner";
import toast from "react-hot-toast";
import InputField from "../../components/ui/InputField";
import AuthLayout from "../../components/Layouts/AuthLayout";
import { FaSignInAlt, FaEnvelope, FaLock } from "react-icons/fa";

export default function SignIn() {
  const { login } = useContext(AuthContext);
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 400);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await api.post("/users/login", form);
      toast.success("Signed in successfully!");
      login(res.data.user, res.data.token);
    } catch (err) {
      setError(err.response?.data?.error || "Sign-in failed");
      toast.error("Sign-in failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
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
        className="w-full p-6 sm:p-8 bg-[var(--card)] rounded-lg shadow-lg border border-[var(--border)]/30"
      >
        <h2 className="text-2xl sm:text-3xl font-bold text-[var(--primary)] mb-6 text-center flex items-center justify-center gap-2">
          <FaSignInAlt /> Sign In
        </h2>

        {error && (
          <p className="error">
            {error}
          </p>
        )}

        <div className="mb-4">
          <InputField
            label="Email"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Enter your email"
            icon={FaEnvelope}
            required
          />
        </div>
        <div className="mb-4">
          <InputField
            label="Password"
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Enter your password"
            icon={FaLock}
            required
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className={`btn btn-primary w-full flex items-center justify-center gap-2 text-md py-2 sm:py-3 ${
            isSubmitting ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {isSubmitting ? "Signing In..." : "Sign In"}
        </button>

        <p className="mt-8 text-center text-[13px] sm:text-[15px]">
          <a
            href="/forgot-password"
            className="text-[var(--secondary)] hover:underline"
          >
            Forgot Password?
          </a>
        </p>

        <p className="mt-2 text-center text-[13px] sm:text-[15px]">
          Don't have an account?{" "}
          <a href="/signup" className="text-[var(--primary)] underline">
            Sign Up
          </a>
        </p>
      </motion.form>
    </AuthLayout>
  );
}