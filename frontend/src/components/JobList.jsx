import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import api from "../api/api";
import Modal from "./Modal";
import toast from "react-hot-toast";
import { FaBriefcase, FaEdit, FaTrash, FaInfoCircle, FaThumbtack, FaLink, FaDownload } from "react-icons/fa";
import { useReminder } from "../contexts/ReminderContext";
import { BiSolidBellRing } from "react-icons/bi";
import LoadingSpinner from "./ui/LoadingSpinner";

export default function JobList({ jobs, setJobs, onDelete, onDetails, loading }) {
  const { toggleReminder } = useReminder();
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [jobToDelete, setJobToDelete] = useState(null);

  const handleDeleteClick = (job) => {
    setJobToDelete(job);
    setShowModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!jobToDelete) return;
    try {
      await api.delete(`/jobs/${jobToDelete._id}`);
      onDelete(jobToDelete._id);
      toast.success("Job deleted successfully");
    } catch (err) {
      toast.error("Failed to delete job");
    } finally {
      setShowModal(false);
      setJobToDelete(null);
    }
  };

  const handleSetReminder = async (job, event) => {
    event.stopPropagation();
    await toggleReminder(job, setJobs);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--bg)]">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <>
      <h2 className="text-lg sm:text-xl font-semibold text-[var(--primary)] mb-4 sm:mb-6 flex items-center gap-2">
        <FaBriefcase className="text-lg cursor-pointer" /> Job Listings ({jobs.length})
      </h2>

      {jobs.length === 0 ? (
        <p className="text-center text-[var(--secondary)] text-md py-8">
          No jobs found. Add a new job to get started!
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          {jobs.map((job, index) => (
            <motion.div
              key={job._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.3 }}
              className={`relative bg-[${
                job.isPinned ? "var(--home)" : "var(--card)"
              }] border ${
                job.isPinned
                  ? "border-[var(--primary)]/50 shadow-lg"
                  : "border-[var(--border)]/80 shadow-sm"
              } rounded-lg p-4 sm:p-5 hover:shadow-lg transition-shadow duration-200 overflow-hidden`}
            >

              <motion.button
                onClick={(e) => handleSetReminder(job, e)}
                whileHover={{ scale: 1.05 }}
                whileTap={{
                  rotate: [-5, 5, -5, 5, -5, 0],
                  transition: { duration: 0.1 },
                }}
                className={`absolute top-2 right-3 p-1.5 rounded-full bg-[var(--home)]/80 ${
                  job.reminderOn ? "text-yellow-500" : "text-[var(--secondary)]"
                } hover:bg-[var(--primary)]/20 hover:text-yellow-600 transition-all duration-200 cursor-pointer`}
                title={`Notifications ${job.reminderOn ? "on" : "off"}`}
              >
                <BiSolidBellRing className="text-lg" />
              </motion.button>

              <div className="flex items-center gap-2 mb-3 mr-7">
                {job.isPinned && <FaThumbtack className="text-yellow-500 text-md cursor-pointer" />}
                <h3 className="text-base sm:text-lg font-semibold text-[var(--primary)] truncate">
                  {job.companyName} - {job.role}
                </h3>
              </div>

              <div className="lg:grid lg:grid-cols-2 lg:gap-4 space-y-2 lg:space-y-0 text-sm sm:text-md">
                <div className="space-y-2 max-w-full overflow-hidden">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-[var(--primary)]">Status:</span>
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs sm:text-sm font-medium cursor-pointer ${
                        {
                          Applied: "bg-blue-400/20",
                          Interview: "bg-yellow-300/50",
                          Offered: "bg-orange-400/50",
                          Rejected: "bg-red-700/50 text-white",
                          Accepted: "bg-green-600/40",
                        }[job.status] || "bg-gray-100 text-[var(--secondary)]"
                      }`}
                    >
                      {job.status}
                    </span>
                  </div>

                  <p className="flex items-center gap-2">
                    <span className="font-medium text-[var(--primary)]">Applied:</span>
                    <span className="text-[var(--secondary)]">
                      {new Date(job.applicationDate).toLocaleDateString()}
                    </span>
                  </p>

                  {job.deadlineDate && (
                    <p className="flex items-center gap-2">
                      <span className="font-medium text-[var(--primary)]">Deadline:</span>
                      <span className="text-[var(--secondary)]">
                        {new Date(job.deadlineDate).toLocaleDateString()}
                      </span>
                    </p>
                  )}

                  {job.source && (
                    <p className="flex items-center gap-2">
                      <span className="font-medium text-[var(--primary)]">Source:</span>
                      <span className="text-[var(--secondary)] max-w-full truncate">{job.source}</span>
                    </p>
                  )}
                </div>

                <div className="space-y-2 max-w-full overflow-hidden">
                  {job.sourceLink && (
                    <p className="flex items-center gap-2">
                      <span className="font-medium text-[var(--primary)]">Source Link:</span>
                      <a
                        href={job.sourceLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[var(--accent)] hover:underline flex items-center gap-1 text-sm cursor-pointer max-w-full truncate"
                      >
                        <FaLink className="text-xs" /> Visit
                      </a>
                    </p>
                  )}

                  <p className="flex items-center gap-2">
                    <span className="font-medium text-[var(--primary)]">Priority:</span>
                    <span className="text-[var(--secondary)]">{job.priorityLevel}</span>
                  </p>

                  <p className="flex items-center gap-2">
                    <span className="font-medium text-[var(--primary)]">Location:</span>
                    <span className="text-[var(--secondary)] max-w-full truncate">
                      {job.location || "Not specified"}
                    </span>
                  </p>

                  <p className="flex items-center gap-2">
                    <span className="font-medium text-[var(--primary)]">Stipend/Salary:</span>
                    <span className="text-[var(--secondary)] max-w-full truncate">
                      {typeof job.stipendOrSalary === "number"
                        ? `₹ ${job.stipendOrSalary.toLocaleString("en-IN")}`
                        : "N/A"}
                    </span>
                  </p>
                </div>
              </div>

              {job.jobDescription && (
                <p className="mt-2 text-sm sm:text-md flex items-center gap-2">
                  <span className="font-medium text-[var(--primary)]">Description:</span>
                  <span className="text-[var(--secondary)] max-w-full truncate">
                    {job.jobDescription.length > 50
                      ? `${job.jobDescription.slice(0, 30)}...`
                      : job.jobDescription}
                  </span>
                </p>
              )}

              {job.resumePath && (
                <p className="mt-2 flex items-center gap-2 text-sm sm:text-md">
                  <span className="font-medium text-[var(--primary)]">Resume:</span>
                  <a
                    href={job.resumePath}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[var(--accent)] hover:underline flex items-center gap-1 text-sm cursor-pointer max-w-full truncate"
                  >
                    <FaDownload className="text-xs" /> View
                  </a>
                </p>
              )}
              
              <div className="flex flex-col md:flex-row gap-2 lg:gap-3 mt-4 justify-center">
                <button
                  onClick={() => onDetails(job)}
                  className="flex items-center justify-center gap-1.5 bg-[var(--primary)] text-[var(--text-1)] text-sm sm:text-md px-3 py-2 rounded-md hover:bg-[var(--primary-hover)] transition-colors cursor-pointer"
                >
                  <FaInfoCircle className="text-sm" /> Details
                </button>
                <button
                  onClick={() => navigate(`/jobs/edit/${job._id}`)}
                  className="flex items-center justify-center gap-1.5 bg-[var(--button)] text-[var(--text-1)] text-sm sm:text-md px-3 py-2 rounded-md hover:bg-[var(--primary-hover)] transition-colors cursor-pointer"
                >
                  <FaEdit className="text-sm" /> Edit
                </button>
                <button
                  onClick={() => handleDeleteClick(job)}
                  className="flex items-center justify-center gap-1.5 border border-[var(--border)] text-[var(--primary)] text-sm sm:text-md px-3 py-2 rounded-md hover:bg-[var(--danger)] hover:text-white transition-colors cursor-pointer"
                >
                  <FaTrash className="text-sm" /> Delete
                </button> 
              </div>
            </motion.div>
          ))}
        </div>
      )}
      
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onConfirm={handleDeleteConfirm}
        title="Confirm Deletion"
        message={`Are you sure you want to delete the job "${
          jobToDelete?.companyName || ""
        }"? This action cannot be undone.`}
        confirmText="Delete"
        confirmType="danger"
        iconType="delete"
      />
    </>
  );
}