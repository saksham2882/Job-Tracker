import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";
import { FaTimes, FaHome, FaBriefcase, FaCog, FaPlusCircle, FaChartBar, FaChartPie } from "react-icons/fa";

export default function Sidebar({ isOpen, toggleSidebar }) {

  const getNavLinkClass = ({ isActive }) =>
    `flex items-center gap-2 text-[var(--primary)] hover:text-[var(--primary-hover)] text-base ${
      isActive ? "font-semibold" : "text-[var(--primary)]/70"
    }`;

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={toggleSidebar}
        />
      )}
      
      <motion.div
        initial={{ x: -256 }}
        animate={{ x: isOpen ? 0 : -256 }}
        transition={{ duration: 0.3 }}
        className="fixed top-0 left-0 h-full bg-[var(--bg)] shadow-lg w-64 p-7 z-50 lg:hidden"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl text-[var(--primary)] flex items-center gap-2">
            <FaBriefcase className="text-base" /> JobTracker
          </h2>

          <button
            onClick={toggleSidebar}
            className="text-[var(--primary)] text-sm p-2 rounded-md hover:bg-[var(--primary-hover)] hover:text-white cursor-pointer"
            aria-label="Close sidebar"
          >
            <FaTimes className="text-sm" />
          </button>
        </div>

        <nav className="flex flex-col gap-3 ml-3">
          <NavLink to="/dashboard" className={getNavLinkClass} onClick={toggleSidebar} >
            <FaHome className="text-sm" /> Dashboard
          </NavLink>
          <NavLink to="/analytics" className={getNavLinkClass} onClick={toggleSidebar} >
            <FaChartPie className="text-sm" /> Analytics
          </NavLink>
          <NavLink to="/jobs/list" className={getNavLinkClass} onClick={toggleSidebar} >
            <FaBriefcase className="text-sm" /> Jobs
          </NavLink>
          <NavLink to="/jobs/add" className={getNavLinkClass} onClick={toggleSidebar} >
            <FaPlusCircle className="text-sm" /> Add Job
          </NavLink>
          <NavLink to="/settings" className={getNavLinkClass} onClick={toggleSidebar} >
            <FaCog className="text-sm" /> Settings
          </NavLink>
        </nav>
      </motion.div>
    </>
  );
}
