import { useContext, useState } from "react";
import { NavLink } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";
import { ThemeContext } from "../contexts/ThemeContext";
import { motion } from "framer-motion";
import { FaStream, FaSun, FaMoon, FaSignOutAlt, FaBriefcase, FaCog, FaPlusCircle, FaChartBar, FaChartPie } from "react-icons/fa";
import Modal from "./Modal";
import Notifications from "./Notifications";

export default function Header({ toggleSidebar }) {
  const { authUser, logout } = useContext(AuthContext);
  const { theme, toggleTheme } = useContext(ThemeContext);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const getNavLinkClass = ({ isActive }) =>
    `flex items-center gap-2 text-[var(--primary)] hover:text-[var(--primary-hover)] text-base ${
      isActive ? "font-semibold" : "text-[var(--primary)]/70"
    }`;

  return (
    <>
      <motion.header
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-[var(--card)] shadow-md px-4 sm:px-10 py-3 flex justify-between items-center sticky top-0 z-50"
      >
        <div className="flex items-center gap-3">
          <button
            onClick={toggleSidebar}
            className="lg:hidden text-[var(--primary)] text-sm p-2 rounded-md hover:bg-[var(--primary-hover)] hover:text-white cursor-pointer"
            aria-label="Toggle sidebar"
          >
            <FaStream className="text-base" />
          </button>

          <h1 className="text-lg sm:text-2xl font-semibold text-[var(--primary)] truncate">
            JobTracker
          </h1>

          <nav className="hidden lg:flex gap-4 pl-4">
            <NavLink to="/dashboard" className={getNavLinkClass}> <FaChartBar className="text-sm lg:text-base" /> Dashboard </NavLink>
            <NavLink to="/analytics" className={getNavLinkClass}> <FaChartPie className="text-sm lg:text-base" /> Analytics </NavLink>
            <NavLink to="/jobs/list" className={getNavLinkClass}> <FaBriefcase className="text-sm lg:text-base" /> Jobs </NavLink>
            <NavLink to="/jobs/add" className={getNavLinkClass}> <FaPlusCircle className="text-sm lg:text-base" /> Add Job </NavLink>
            <NavLink to="/settings" className={getNavLinkClass}> <FaCog className="text-sm lg:text-base" /> Settings </NavLink>
          </nav>
        </div>

        <div className="flex items-center gap-2">
          {authUser && (
            <>
              <Notifications />
              <button
                onClick={toggleTheme}
                className="p-2 text-[var(--primary)] outline-1 rounded-full hover:bg-[var(--primary-hover)] hover:text-white cursor-pointer"
                aria-label="Toggle theme"
              >
                {theme === "dark" ? ( <FaSun className="text-sm" /> ) : ( <FaMoon className="text-sm" /> )}
              </button>
              
              <div className="flex items-center gap-2">
                <img
                  src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
                    authUser.fullName
                  )}&background=6b46c1&color=fff&size=128`}
                  alt="User avatar"
                  className="w-6 h-6 sm:w-7 sm:h-7 rounded-full border border-[var(--text)] hover:opacity-80 cursor-pointer"
                  onError={(e) =>
                    (e.target.src = "https://ui-avatars.com/api/?name=User&background=6b46c1&color=fff&size=128")
                  }
                />
                <span className="text-[var(--text)] text-sm truncate max-w-[120px] hidden sm:inline">
                  {authUser.fullName}
                </span>
              </div>
            </>
          )}

          {authUser && (
            <button
              onClick={() => setShowLogoutModal(true)}
              className="flex items-center gap-1 px-3 py-1 text-sm font-medium border text-[var(--primary)] rounded-md hover:bg-[var(--primary-hover)] hover:text-white cursor-pointer"
            >
              <FaSignOutAlt className="text-sm" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          )}
        </div>
      </motion.header>

      <Modal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={logout}
        title="Confirm Logout"
        message="Are you sure you want to log out?"
        confirmText="Logout"
        confirmType="danger"
        iconType="logout"
      />
    </>
  );
}
