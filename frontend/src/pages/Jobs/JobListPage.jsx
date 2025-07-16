import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/api";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import JobList from "../../components/JobList";
import Filters from "../../components/Filters";
import { FaBriefcase } from "react-icons/fa";

export default function JobListPage() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchJobs = async (filters = {}) => {
    setLoading(true);
    try {
      const query = new URLSearchParams(filters).toString();
      const res = await api.get(`/jobs?${query}`);
      setJobs(res.data);
    } catch (err) {
      toast.error("Failed to load jobs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleJobDeleted = (jobId) => setJobs(jobs.filter((j) => j._id !== jobId));
  const handleDetails = (job) => navigate(`/jobs/details/${job._id}`);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-[95%] mx-auto py-6 sm:px-2"
    >
      <h1 className="text-xl md:text-2xl font-semibold text-[var(--primary)] mb-4 flex items-center gap-2">
        <FaBriefcase /> Job Applications
      </h1>

      <div className="flex flex-col lg:flex-row gap-6 sm:gap-10 mb-4 mt-8">
        <div className="min-lg:w-[25%]">
          <Filters onFilter={fetchJobs} />
        </div>

        <div className="min-lg:w-[75%]">
          <JobList
            jobs={jobs}
            setJobs={setJobs}
            onDelete={handleJobDeleted}
            onDetails={handleDetails}
            loading={loading}
          />
        </div>
      </div>
    </motion.div>
  );
}