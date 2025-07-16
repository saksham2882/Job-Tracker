import { useState, useContext, useEffect } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { ThemeContext } from "../contexts/ThemeContext";
import api from "../api/api";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import Modal from "../components/Modal";
import InputField from "../components/ui/InputField";
import { FaUserCog, FaUser, FaEnvelope, FaUserEdit, FaLock, FaCog, FaLightbulb, FaUserShield, FaTrash, FaBell } from "react-icons/fa";
import { validateProfile, validatePassword, getPasswordStrength, getUsernameValidity } from "../utils/validation";
import LoadingSpinner from "../components/ui/LoadingSpinner";

export default function Settings() {
  const { authUser, updateProfile, logout } = useContext(AuthContext);
  const { theme, toggleTheme } = useContext(ThemeContext);

  const [profileForm, setProfileForm] = useState({
    fullName: authUser?.fullName || "",
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
  });

  const [loading, setLoading] = useState(true);
  const [enableLoading, setEnableLoading] = useState(false);
  const [disableLoading, setDisableLoading] = useState(false);
  const [joinedDate, setJoinedDate] = useState("");
  const [profileError, setProfileError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [profileLoading, setProfileLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [modal, setModal] = useState({});

  // Fetch User Details
  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const userData = await api.get("/users/me");
        setProfileForm({
          fullName: userData.data.fullName,
          email: userData.data.email,
        });

        const createdAt = userData.data.createdAt;
        if (createdAt && !isNaN(new Date(createdAt).getTime())) {
          setJoinedDate(
            new Date(createdAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })
          );
        } else {
          setJoinedDate("Unknown");
        }
        setLoading(false);
      } catch (err) {
        toast.error("Failed to fetch user details: " + (err.response?.data?.error || err.message));
        setJoinedDate("Unknown");
      }
    };

    fetchUserDetails();
  }, []);

  const handleProfileChange = (e) => setProfileForm({ ...profileForm, fullName: e.target.value });
  const handlePasswordChange = (e) => {
    setPasswordForm({ ...passwordForm, [e.target.name]: e.target.value });
    setPasswordError("");
  };

  const handleEnableNotifications = () => {
    openModal(
      "notifications-enable",
      "Confirm Turn On All Notifications",
      "This will turn on notifications for all your jobs. You will receive updates within the app.",
      () => updateNotifications(true)
    );
  };

  const handleDisableNotifications = () => {
    openModal(
      "notifications-disable",
      "Confirm Turn Off All Notifications",
      "Are you sure you want to turn off all job notifications? You will not receive updates within the app.",
      () => updateNotifications(false)
    );
  };

  // Update Notifications Settings
  const updateNotifications = async (enabled) => {
    if (enabled) {
      setEnableLoading(true);
    } else {
      setDisableLoading(true);
    }

    try {
      if (enabled) {
        const response = await api.post("/users/notification-settings", { enabled: true});
        toast.success(response.data.message);
      } else {
        if (!authUser?.email) {
          throw new Error("User email not available");
        }
        const response = await api.get(`/jobs/disable-notifications?email=${encodeURIComponent(authUser.email)}`);
        toast.success(response.data.message);
      }
    } catch (err) {
      const errorMsg = err.response?.data?.error || err.message || "Failed to update notification settings";
      toast.error(errorMsg);
    } finally {
      closeModal();
      if (enabled) {
        setEnableLoading(false);
      } else {
        setDisableLoading(false);
      }
    }
  };

  const openModal = (type, title, message, onConfirm) => {
    setModal({ isOpen: true, type, title, message, onConfirm });
  };

  const closeModal = () => {
    setModal({ ...modal, isOpen: false });
  };

  // Handle User Profile Submit
  const handleProfileSubmit = (e) => {
    e.preventDefault();
    if (!validateProfile(profileForm.fullName, setProfileError)) return;

    openModal(
      "profile",
      "Confirm Profile Update",
      "Are you sure you want to update your profile?",

      async () => {
        setProfileLoading(true);
        try {
          const res = await api.put("/users/profile", {
            fullName: profileForm.fullName.trim(),
          });
          await updateProfile(res.data.user);
          toast.success("Profile updated");
          setProfileError("");
        } catch (err) {
          const errorMsg = err.response?.data?.error || "Failed to update profile";
          setProfileError(errorMsg);
          toast.error(errorMsg);
        } finally {
          closeModal();
          setProfileLoading(false);
        }
      }
    );
  };

  // Handle Password Submit
  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    setPasswordError("");
    if (!validatePassword(passwordForm.currentPassword, setPasswordError, "Current password")) return;
    if (!validatePassword(passwordForm.newPassword, setPasswordError, "New password")) return;

    openModal(
      "password",
      "Confirm Password Update",
      "Are you sure you want to update your password?",
      async () => {
        setPasswordLoading(true);
        try {
          await api.put("/users/password", passwordForm);
          toast.success("Password updated");
          setPasswordForm({ currentPassword: "", newPassword: "" });
          setPasswordError("");
        } catch (err) {
          const errorMsg = err.response?.data?.error || "Failed to update password";
          setPasswordError(errorMsg);
          toast.error(errorMsg);
        } finally {
          closeModal();
          setPasswordLoading(false);
        }
      }
    );
  };

  // Delete Account
  const handleDeleteAccount = () => {
    openModal(
      "delete",
      "Confirm Account Deletion",
      "Are you sure you want to delete your account? This cannot be undone.",
      async () => {
        setDeleteLoading(true);
        try {
          await api.delete("/users/delete");
          toast.success("Account deleted successfully");
          logout();
        } catch (err) {
          const errorMsg = err.response?.data?.error || "Failed to delete account";
          setProfileError(errorMsg);
          toast.error(errorMsg);
        } finally {
          closeModal();
          setDeleteLoading(false);
        }
      }
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--bg)]">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-[95%] mx-auto py-6 sm:px-2"
    >
      <h1 className="text-xl md:text-2xl font-semibold text-[var(--primary)] mb-4 flex items-center gap-2">
        <FaCog /> Settings
      </h1>

      {/* ---------- Account Info -------------- */}
      <div className="bg-[var(--card)] p-3 sm:p-4 rounded-lg shadow-md mb-5 mt-8">
        <h2 className="text-md font-semibold text-[var(--primary)] mb-3 sm:mb-4 flex items-center gap-2">
          <FaUserCog /> Account Information
        </h2>

        <div className="flex flex-col gap-1.5">
          <p className="text-md text-[var(--secondary)]">
            <span className="font-medium mr-1 text-[var(--primary)]"> Username: </span> {authUser?.fullName}
          </p>
          <p className="text-md text-[var(--secondary)]">
            <span className="font-medium mr-1 text-[var(--primary)]"> Email: </span> {authUser?.email}
          </p>
          <p className="text-md text-[var(--secondary)]">
            <span className="font-medium mr-1 text-[var(--primary)]"> Joined: </span> {joinedDate}
          </p>
        </div>
      </div>

      <div className="md:grid md:grid-cols-2 gap-6 mb-3">
        {/* ------------- Notification ---------------- */}
        <div className="bg-[var(--card)] p-3 sm:p-4 rounded-lg shadow-md mb-5 md:mb-0">
          <h2 className="text-[13px] sm:text-[15px] md:text-base font-semibold text-[var(--primary)] mb-3 sm:mb-4 flex items-center gap-2">
            <FaBell /> Notifications
          </h2>

          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
            <button
              onClick={handleEnableNotifications}
              disabled={enableLoading || disableLoading}
              className={`w-full flex items-center justify-center gap-2 bg-[var(--primary)]/80 text-white text-md shadow-md rounded-md hover:bg-[var(--primary)]/90 transition-colors p-1.5 cursor-pointer ${
                enableLoading || disableLoading ? "opacity-60 cursor-not-allowed" : ""
              }`}
            >
              {enableLoading ? "Enabling..." : ( <> <FaBell /> Turn On All </> )}
            </button>

            <button
              onClick={handleDisableNotifications}
              disabled={enableLoading || disableLoading}
              className={`w-full flex items-center justify-center gap-2 bg-[var(--danger)] text-white text-md shadow-md rounded-md hover:bg-red-700 transition-colors p-1.5 cursor-pointer ${
                enableLoading || disableLoading ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {disableLoading ? "Disabling..." : ( <> <FaBell /> Turn Off All </> )}
            </button>
          </div>
        </div>

        {/* ----------------- Theme -------------- */}
        <div className="bg-[var(--card)] p-3 sm:p-4 rounded-lg shadow-md">
          <h2 className="text-md font-semibold text-[var(--primary)] mb-3 sm:mb-4 flex items-center gap-2">
            <FaLightbulb /> Theme
          </h2>

          <label className="flex items-center gap-2 sm:gap-3 text-md text-[var(--secondary)]">
            <span>{theme === "dark" ? "Dark Mode" : "Light Mode"}</span>
            <div className="relative inline-block w-10 sm:w-12 h-5 sm:h-6">
              <input
                type="checkbox"
                className="opacity-0 w-0 h-0"
                checked={theme === "dark"}
                onChange={toggleTheme}
              />
              <span
                className={`absolute cursor-pointer top-0 left-0 right-0 bottom-0 bg-[var(--border)] rounded-full transition-all duration-300 ${
                  theme === "dark" ? "bg-[var(--primary)]" : ""
                }`}
              >
                <span
                  className={`absolute left-1 top-1 w-3 sm:w-4 h-3 sm:h-4 bg-white rounded-full transition-all duration-300 ${
                    theme === "dark" ? "translate-x-5 sm:translate-x-6" : ""
                  }`}
                ></span>
              </span>
            </div>
          </label>
        </div>
      </div>

      <div className="md:grid md:grid-cols-2 gap-6 mb-4 mt-5">
        {/* ------------ Update Profile ------------- */}
        <div className="bg-[var(--card)] p-3 sm:p-4 rounded-lg shadow-md mb-5 md:mb-0">
          <h2 className="text-md font-semibold text-[var(--primary)] mb-3 sm:mb-4 flex items-center gap-2">
            <FaUser /> Update Profile
          </h2>

          <form
            onSubmit={handleProfileSubmit}
            className="space-y-3 sm:space-y-4"
          >
            <InputField
              label="Username"
              name="fullName"
              type="text"
              value={profileForm.fullName}
              onChange={handleProfileChange}
              placeholder="Enter your username"
              icon={FaUser}
            />
            <InputField
              label="Email"
              value={profileForm.email}
              icon={FaEnvelope}
              disabled
            />

            <div className="min-h-[1.5rem] sm:min-h-[1.75rem]">
              {profileError ? (
                <p className="text-[var(--danger)] text-md">
                  {profileError}
                </p>
              ) : profileForm.fullName ? (
                <p
                  className={`text-[13px] sm:text-[15px] ${
                    getUsernameValidity(profileForm.fullName) === "Valid" ? "text-green-600" : "text-[var(--danger)]"
                  }`}
                >
                  Username: {getUsernameValidity(profileForm.fullName)}
                </p>
              ) : ""}
            </div>

            <button
              type="submit"
              disabled={profileLoading}
              className={`w-full flex items-center justify-center gap-2 bg-[var(--primary)]/80 text-white text-md rounded-md hover:bg-[var(--primary)]/90 transition-colors cursor-pointer p-1.5 ${
                profileLoading ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {profileLoading ? "Updating..." : ( <> <FaUserEdit /> Update Profile </> )}
            </button>
          </form>
        </div>

        {/* ------------ Update Password ----------- */}
        <div className="bg-[var(--card)] p-3 sm:p-4 rounded-lg shadow-md">
          <h2 className="text-md font-semibold text-[var(--primary)] mb-3 sm:mb-4 flex items-center gap-2">
            <FaUserShield /> Update Password
          </h2>

          <form
            onSubmit={handlePasswordSubmit}
            className="space-y-3 sm:space-y-4"
          >
            <InputField
              label="Current Password"
              name="currentPassword"
              type="password"
              value={passwordForm.currentPassword}
              onChange={handlePasswordChange}
              placeholder="Enter your current password"
              icon={FaUserShield}
            />
            <InputField
              label="New Password"
              name="newPassword"
              type="password"
              value={passwordForm.newPassword}
              onChange={handlePasswordChange}
              placeholder="Enter your new password"
              icon={FaLock}
            />

            <div className="min-h-[1.5rem] sm:min-h-[1.75rem]">
              {passwordError ? (
                <p className="text-[var(--danger)] text-[13px] sm:text-[15px]">
                  {passwordError}
                </p>
              ) : passwordForm.newPassword ? (
                <p
                  className={`text-[13px] sm:text-[15px] ${
                    getPasswordStrength(passwordForm.newPassword) === "Weak" ? "text-[var(--danger)]"
                      : getPasswordStrength(passwordForm.newPassword) === "Medium" ? "text-yellow-600"
                      : "text-green-600"
                  }`}
                >
                  Password Strength: {getPasswordStrength(passwordForm.newPassword)}
                </p>
              ) : ""}
            </div>

            <button
              type="submit"
              disabled={passwordLoading}
              className={`w-full flex items-center justify-center gap-2 bg-[var(--primary)]/80 text-white text-md rounded-md hover:bg-[var(--primary)]/90 transition-colors p-1.5 cursor-pointer ${
                passwordLoading ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {passwordLoading ? "Updating..." : ( <> <FaLock /> Update Password </> )}
            </button>
          </form>
        </div>
      </div>

      {/* ------------ Delete Account ------------ */}
      <div className="bg-[var(--card)] p-3 sm:p-4 rounded-lg shadow-md mt-5 mb-6">
        <h2 className="text-md font-semibold text-[var(--primary)] mb-3 sm:mb-4 flex items-center gap-2">
          <FaTrash /> Delete Account
        </h2>

        <button
          onClick={handleDeleteAccount}
          disabled={deleteLoading}
          className={`w-full flex items-center justify-center gap-2 bg-[var(--danger)] text-white text-md rounded-md hover:bg-red-700 transition-colors p-1.5 cursor-pointer ${
            deleteLoading ? "opacity-60 cursor-not-allowed" : ""
          }`}
        >
          {deleteLoading ? "Deleting..." : ( <> <FaTrash /> Delete Account </> )}
        </button>
      </div>

      {/* -------------- Modal ----------------- */}
      <Modal
        isOpen={modal.isOpen}
        onClose={closeModal}
        onConfirm={modal.onConfirm}
        title={modal.title}
        message={modal.message}
        confirmText={
          modal.type === "profile" ? "Update Profile"
            : modal.type === "password" ? "Update Password"
            : modal.type === "notifications-enable" ? "Turn On All Notifications"
            : modal.type === "notifications-disable" ? "Turn Off All Notifications"
            : "Delete Account"
        }
        confirmType={
          modal.type === "delete" || modal.type === "notifications-disable" ? "danger" : "primary"
        }
        iconType={
          modal.type === "delete" || modal.type === "notifications-disable" ? "delete" : "confirm"
        }
      />
    </motion.div>
  );
}