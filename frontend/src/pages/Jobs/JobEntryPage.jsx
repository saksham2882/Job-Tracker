import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import JobEntry from "../../components/JobEntry";
import LoadingSpinner from "../../components/ui/LoadingSpinner";
import { FaPlusCircle } from "react-icons/fa";

export default function JobEntryPage() {
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const handleJobAdded = () => {
    navigate("/jobs/list");
  };

  useEffect(() => {
    setTimeout(() => {
      setLoading(!loading);
    }, 400);
  }, []);

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
      <h1 className="text-xl md:text-2xl font-semibold text-[var(--primary)] flex items-center gap-2 mb-4 sm:mb-6">
        <FaPlusCircle /> Add Jobs & Internships
      </h1>
      <JobEntry onJobAdded={handleJobAdded} />
    </motion.div>
  );
}
