import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaClipboardList, FaCalendarCheck, FaBell, FaUserPlus, FaTasks, FaTrophy } from "react-icons/fa";
import Footer from "../components/Footer";

export default function Landing() {
  const navigate = useNavigate();

  const features = [
    {
      title: "Track Applications",
      description: "Effortlessly log and monitor your job applications with real-time status updates and deadline tracking.",
      icon: <FaClipboardList className="home-icons" /> 
    },
    {
      title: "Manage Interviews",
      description: "Organize all your interview details, including rounds, dates, and notes, in a centralized dashboard.",
      icon: <FaCalendarCheck className="home-icons" />
    },
    {
      title: "Stay Organized",
      description: "Receive timely reminders to follow up on applications and seize every opportunity.",
      icon: <FaBell className="home-icons" />,
    },
  ];

  const howItWorks = [
    {
      title: "Sign Up",
      description: "Create your free JobTracker account in moments to kickstart your job search.",
      icon: <FaUserPlus className="home-icons" />
    },
    {
      title: "Track Jobs",
      description: "Add and manage job applications, set deadlines, and schedule interviews with ease.",
      icon: <FaTasks className="home-icons" />,
    },
    {
      title: "Succeed",
      description: "Stay organized and leverage JobTracker’s tools to land your dream job.",
      icon: <FaTrophy className="home-icons" />,
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <section className="min-h-screen flex items-center justify-center bg-[var(--home)]">
        <div className="container mx-auto px-4 flex flex-col lg:flex-row items-center gap-8">

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="lg:w-1/2 text-center lg:text-left lg:ml-8 max-md:mt-15"
          >
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[var(--primary)] mb-4 leading-tight sm:leading-snug lg:leading-[1.3] min-md:mt-20">
              Your Job Tracking Simplified with JobTracker
            </h1>

            <p className="text-base sm:text-lg text-[var(--secondary)] mb-6">
              Master your job applications with a powerful, intuitive platform
              designed to keep you organized and on track.
            </p>

            <div className="flex gap-4 justify-center lg:justify-start">
              <motion.button
                onClick={() => navigate("/signup")}
                className="btn btn-primary text-sm sm:text-base"
              >
                Get Started
              </motion.button>
              <motion.button
                onClick={() => navigate("/signin")}
                className="btn btn-primary text-sm sm:text-base"
              >
                Sign In
              </motion.button>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="lg:w-1/2"
          >
            <div className="rounded-lg p-4 mb-8">
              <img
                src="/img1.png"
                alt="JobTracker"
                className="w-full max-w-md sm:max-w-lg lg:max-w-xl rounded drop-shadow-md drop-shadow-gray-700"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* ----------- Features Section------------------- */}
      <section className="py-12 sm:py-16 bg-[var(--home-1)]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-xl sm:text-3xl lg:text-4xl font-bold text-[var(--primary)] text-center mb-12"
          >
            <FaClipboardList className="inline-block mr-2" /> Why Choose JobTracker?
          </motion.h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.03 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2, duration: 0.5 }}
                className="bg-[var(--card)]/50 p-6 rounded-lg shadow-md border border-[var(--border)] hover:shadow-lg transition-shadow"
              >
                <div className="mb-4">{feature.icon}</div>
                <h3 className="text-lg sm:text-xl font-semibold text-[var(--primary)] mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm sm:text-base text-[var(--secondary)]">
                  {feature.description}
                </p>
              </motion.div>
            ))}

          </div>
        </div>
      </section>

      {/* -----------------How It Works Section -------------------- */}
      <section className="py-12 sm:py-16 bg-[var(--home)]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-xl sm:text-3xl lg:text-4xl font-bold text-[var(--primary)] text-center mb-12 "
          >
            <FaTasks className="inline-block mr-2" /> How JobTracker Works
          </motion.h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {howItWorks.map((step, index) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.03 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2, duration: 0.5 }}
                className="bg-[var(--card)]/50 p-6 rounded-lg shadow-md border border-[var(--border)] hover:shadow-lg transition-shadow"
              >
                <div className="mb-4"> {step.icon} </div>
                <h3 className="text-lg sm:text-xl font-semibold text-[var(--primary)] mb-2">
                  {step.title}
                </h3>
                <p className="text-sm sm:text-base text-[var(--secondary)]">
                  {step.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* -------------- Footer ----------------- */}
      <footer className="bg-[var(--home-1)] py-15">
        <Footer />
      </footer>
    </motion.div>
  );
}