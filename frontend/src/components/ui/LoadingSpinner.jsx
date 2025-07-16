import { motion } from "framer-motion";

export default function LoadingSpinner() {
  return (
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ repeat: Infinity, duration: 1 }}
      className="w-10 h-10 border-4 border-[var(--border)] border-t-[var(--primary)] rounded-full relative"
    >
      <div className="absolute m-1 inset-0 border-2 border-transparent border-t-[var(--primary)] rounded-full animate-spin-slow" />
    </motion.div>
  );
}
