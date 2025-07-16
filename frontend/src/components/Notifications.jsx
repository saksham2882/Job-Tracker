import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import { FaTimes } from "react-icons/fa";
import { BiSolidBellRing } from "react-icons/bi";
import { useReminder } from "../contexts/ReminderContext";

export default function Notifications() {
  const { notifications, markNotificationAsRead, deleteNotification } = useReminder();
  const [isOpen, setIsOpen] = useState(false);

  const unreadCount = notifications.filter((n) => !n.isRead).length;
  const toggleDropdown = () => setIsOpen(!isOpen);

  const handleDelete = async (id) => {
    try {
      await deleteNotification(id);
    } catch (err) {
      toast.error("Failed to delete notification");
    }
  };

  return (
    <div className="relative">
      <motion.button
        onClick={toggleDropdown}
        className="relative flex items-center text-[var(--primary)] p-2 cursor-pointer"
      >
        <motion.div
          animate={
            unreadCount > 0 ? { rotate: [0, -15, 15, -10, 10, -5, 5, 0] } : {}
          }
          transition={{
            duration: 0.8,
            repeat: unreadCount > 0 ? Infinity : 0,
            repeatDelay: 2,
          }}
        >
          <BiSolidBellRing
            className={`text-base sm:text-lg ${
              unreadCount > 0 ? "text-lg sm:text-xl text-[var(--primary)]" : ""
            }`}
          />
        </motion.div>
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-[var(--danger)] text-white text-[10px] rounded-full w-5 h-4 flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-1/2 -translate-x-1/2 sm:left-auto sm:right-0 sm:translate-x-0 mt-2 w-64 sm:w-80 bg-[var(--card)] border-1 border-[var(--border)] rounded-lg shadow-lg max-h-96 overflow-y-auto z-50"
          >
            <div className="p-4 border-b border-[var(--border)] flex justify-between items-center">
              <h3 className="text-sm font-semibold text-[var(--primary)]">
                Notifications
              </h3>
              <button
                onClick={toggleDropdown}
                className="text-[var(--primary)] p-1 rounded-full hover:bg-[var(--primary-hover)]/60 hover:text-[var(--text-1)] cursor-pointer"
              >
                <FaTimes className="text-sm" />
              </button>
            </div>

            {notifications.length === 0 ? (
              <p className="p-4 text-sm text-[var(--secondary)] text-center">
                No notifications
              </p>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification._id}
                  className={`p-4 border-b border-[var(--border)] text-sm text-[var(--secondary)] hover:bg-[var(--primary)]/10 flex items-start gap-2 ${
                    notification.isRead ? "opacity-60" : ""
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={notification.isRead}
                    onChange={() => !notification.isRead && markNotificationAsRead(notification._id)}
                    className="mt-1 cursor-pointer"
                  />

                  <div className="flex-1">
                    {notification.message}
                    <span className="block text-xs text-[var(--secondary)] opacity-80">
                      {new Date(notification.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  <button
                    onClick={() => handleDelete(notification._id)}
                    className="text-[var(--danger)]/70 hover:text-[var(--danger)]"
                  >
                    <FaTimes className="text-sm cursor-pointer" />
                  </button>
                </div>
              ))
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}