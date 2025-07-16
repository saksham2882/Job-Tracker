import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/api";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import validator from "validator";
import disposableDomains from "disposable-email-domains";
import LoadingSpinner from "../../components/ui/LoadingSpinner";
import InputField from "../../components/ui/InputField";
import AuthLayout from "../../components/Layouts/AuthLayout";
import { FaUserPlus, FaUser, FaEnvelope, FaLock } from "react-icons/fa";
import { validateProfile, validatePassword, getPasswordStrength, getUsernameValidity } from "../../utils/validation";


const validEmailDomains = [ 'gmail.com', 'yahoo.com', 'outlook.com'];

export default function SignUp() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ fullName: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [formErrors, setFormErrors] = useState({ fullName: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    setFormErrors({ ...formErrors, [name]: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setFormErrors({ fullName: "", email: "", password: "" });

    // Validate fullName
    if (!validateProfile(form.fullName, (msg) =>
        setFormErrors((prev) => ({ ...prev, fullName: msg }))
      )) {
      return;
    }

    // Validate email
    if (!validator.isEmail(form.email)) {
      setFormErrors((prev) => ({ ...prev, email: "Invalid email format" }));
      toast.error("Invalid email format");
      return;
    }
    const domain = form.email.split('@')[1].toLowerCase();
    if (disposableDomains.includes(domain)) {
      setFormErrors((prev) => ({ ...prev, email: "Disposable emails are not allowed" }));
      toast.error("Disposable emails are not allowed");
      return;
    }
    if (!validEmailDomains.includes(domain)) {
      setFormErrors((prev) => ({ ...prev, email: "Please use a trusted email provider (e.g., Gmail, Yahoo, Outlook)" }));
      toast.error("Please use a trusted email provider");
      return;
    }

    // Validate password
    if (!validatePassword(form.password, (msg) =>
        setFormErrors((prev) => ({ ...prev, password: msg }))
      )) {
      return;
    }

    setLoading(true);
    try {
      await api.post("/users/register", form);
      toast.success("🎉 Account created! Please sign in.");
      navigate("/signin");
    } catch (err) {
      setError(err.response?.data?.error || "Sign-up failed");
      toast.error(err.response?.data?.error || "Sign-up failed");
    } finally {
      setLoading(false);
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
          <FaUserPlus /> Sign Up
        </h2>

        {error && (
          <p className="text-[var(--danger)] mb-4 text-center text-[13px] sm:text-[15px]">
            {error}
          </p>
        )}

        <div className="mb-4">
          <InputField
            label="Full Name"
            name="fullName"
            type="text"
            value={form.fullName}
            onChange={handleChange}
            placeholder="Enter your full name"
            icon={FaUser}
            required
          />
          {formErrors.fullName && (
            <p className="text-[var(--danger)] text-[13px] mt-1">
              {formErrors.fullName}
            </p>
          )}
          {form.fullName && !formErrors.fullName && (
            <p
              className={`text-[13px] mt-1 ${
                getUsernameValidity(form.fullName) === "Valid"
                  ? "text-green-600"
                  : "text-[var(--danger)]"
              }`}
            >
              Username: {getUsernameValidity(form.fullName)}
            </p>
          )}
        </div>

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
          {formErrors.email && (
            <p className="text-[var(--danger)] text-[13px] mt-1">
              {formErrors.email}
            </p>
          )}
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
          {formErrors.password && (
            <p className="text-[var(--danger)] text-[13px] mt-1">
              {formErrors.password}
            </p>
          )}
          {form.password && !formErrors.password && (
            <p
              className={`text-[13px] mt-1 ${
                getPasswordStrength(form.password) === "Weak"
                  ? "text-[var(--danger)]"
                  : getPasswordStrength(form.password) === "Medium"
                  ? "text-yellow-600"
                  : "text-green-600"
              }`}
            >
              Password Strength: {getPasswordStrength(form.password)}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`btn btn-primary w-full flex items-center justify-center gap-2 text-md py-2 sm:py-3 ${
            loading ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {loading ? "Signing Up..." : "Sign Up"}
        </button>

        <p className="mt-8 text-center text-[13px] sm:text-[15px]">
          Already have an account?{" "}
          <a href="/signin" className="text-[var(--primary)] underline">
            Sign In
          </a>
        </p>
      </motion.form>
    </AuthLayout>
  );
}