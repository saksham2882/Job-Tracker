import { motion } from "framer-motion";
import { FaTrash, FaSignOutAlt, FaRegTimesCircle, FaCheckCircle } from "react-icons/fa";

const Modal = ({ isOpen, onClose, onConfirm, title, message, confirmText, confirmType = "danger", iconType = "delete"}) => {
  if (!isOpen) return null;

  const icons = {
    confirm: <FaCheckCircle className="text-lg" />,
    delete: <FaTrash className="text-md" />,
    logout: <FaSignOutAlt className="text-lg" />,
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center"
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        className="bg-[var(--card)] border border-[var(--border)] p-6 rounded-lg shadow-lg w-full max-w-sm mx-4"
      >
        <h2 className="text-lg font-semibold text-[var(--primary)] mb-4 flex items-center gap-2">
          {icons[iconType] || icons.delete} {title}
        </h2>
        <p className="text-sm text-[var(--secondary)] mb-4">{message}</p>

        <div className="flex gap-3">
          <button
            onClick={onConfirm}
            className={`btn flex-1 text-sm  cursor-pointer ${
              confirmType === "danger" ? "btn-danger text-white" : "bg-[var(--button)] hover:bg-[var(--button)]/80 text-[var(--text)]"
            }`} 
          >
            {icons[iconType] || icons.delete} {confirmText}
          </button>
          <button onClick={onClose} className="btn btn-outline flex-1 text-sm cursor-pointer">
            <FaRegTimesCircle className="text-md" /> Cancel
          </button>
        </div>

      </motion.div>
    </motion.div>
  );
};

export default Modal;