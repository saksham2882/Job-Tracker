import { motion } from "framer-motion";

const AuthLayout = ({ children }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2 }}
      className="flex min-h-screen bg-gradient-to-br from-[var(--home-1)] to-[var(--bg)]"
    >
      {/* ---------------- Left Section ---------------- */}
      <div className="relative flex items-center justify-center w-full flex-col p-4 sm:p-6 md:w-1/2 md:p-8 lg:p-12">
        <h2
          className="absolute left-8 top-6 text-2xl text-[var(--primary)] sm:text-3xl lg:left-12 lg:text-4xl"
          style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 700 }}
        >
          JobTracker
        </h2>
        <motion.div
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mx-auto  w-full max-w-[90%] sm:max-w-md pt-8"
        >
          {children}
        </motion.div>
      </div>

      {/* -------------------- Right Section --------------*/}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="hidden md:flex w-1/2 items-center justify-center bg-[var(--home-1)]/90 border-l-2 border-[var(--border)]/60"
      >
        <div className="relative h-full w-full overflow-hidden flex items-center justify-center">
          <img
            src="/login-img.png"
            alt="Job Tracker"
            className="h-115 w-115 object-cover opacity-90 drop-shadow-md drop-shadow-gray-700"
          />
          <a
            href="https://storyset.com/business"
            className="absolute bottom-2 right-2 text-[9px] text-gray-600 hover:text-blue-600 transition-colors"
          >
            Illustrations by Storyset
          </a>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default AuthLayout;