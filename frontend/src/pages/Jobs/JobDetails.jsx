import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import api from "../../api/api";
import Timeline from "../../components/Timeline.jsx";
import { FaBriefcase, FaEdit, FaDownload, FaArrowLeft, FaThumbtack, FaStickyNote, FaInfoCircle, FaLink, FaCalendarAlt } from "react-icons/fa";
import LoadingSpinner from "../../components/ui/LoadingSpinner.jsx";

const JobDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [showFullComments, setShowFullComments] = useState({});
  const [showFullNotes, setShowFullNotes] = useState(false);
  const [notes, setNotes] = useState("");
  const [showNotes, setShowNotes] = useState(false);

  useEffect(() => {
    const fetchJobDetails = async () => {
      try {
        const res = await api.get(`/jobs/${id}/details`);
        setJob(res.data.job || null);
        setNotes(res.data.job?.notes || "");
      } catch (err) {
        toast.error(err.response?.data?.error || "Failed to fetch job details");
      } finally {
        setLoading(false);
      }
    };
    fetchJobDetails();
  }, [id]);


  const handlePinToggle = async () => {
    if (!job) return;
    try {
      const res = await api.patch(`/jobs/${id}/pin`);
      setJob({ ...job, isPinned: res.data.isPinned });
      toast.success(`Job ${res.data.isPinned ? "pinned" : "unpinned"}`);
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to toggle pin");
    }
  };

  const handleNotesSave = async () => {
    if (!job) return;
    try {
      const res = await api.put(`/jobs/${id}`, { ...job, notes });
      setJob(res.data);
      setShowNotes(false);
      toast.success("Notes saved");
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to save notes");
    }
  };

  const toggleShowComments = (index) => {
    setShowFullComments((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--bg)]">
        <LoadingSpinner />
      </div>
    );
  }

  if (!job) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-[15px] sm:text-base text-[var(--danger)]">
          Job not found
        </p>
      </div>
    );
  }

  const statusHistory = [
    {
      type: "status",
      title: `Status: ${job.status}`,
      date: job.updatedAt || job.createdAt,
      description: `Job status set to ${job.status}`,
    },
    ...(job.interviews || []).map((interview) => ({
      type: "status",
      title: `Interview Status: ${interview.status}`,
      date: interview.updatedAt || interview.createdAt,
      description: `${interview.round} interview marked as ${interview.status}`,
    })),
  ].sort((a, b) => new Date(a.date) - new Date(b.date));


  const events = [
    job.applicationDate && {
      type: "application",
      title: "Application Submitted",
      date: job.applicationDate,
      description: `Applied for ${job.role} at ${job.companyName}`,
    },
    job.deadlineDate && {
      type: "deadline",
      title: "Application Deadline",
      date: job.deadlineDate,
      description: `Deadline for ${job.role} at ${job.companyName}`,
    },
    ...(job.interviews || []).map((interview, index) => ({
      type: "interview",
      title: `Round ${index + 1}: ${interview.round}`,
      date: interview.interviewDate,
      description: `Status: ${interview.status}${
        interview.comments ? `\nComments: \n\n${interview.comments}` : ""
      }`,
    })),
  ]
    .filter(Boolean)
    .sort((a, b) => new Date(a.date) - new Date(b.date));


  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-[95%] mx-auto grid grid-cols-1 min-[1100px]:grid-cols-4 gap-4 sm:gap-6 mb-10"
    >
      {/*----------- Left Column (25%) - Status History, Notes-------- */}
      <div className="lg:col-span-1 space-y-4 sm:space-y-6">

        <div className="heading-div">
          <h3 className="heading">
            <FaInfoCircle className="cursor-pointer" /> Status History
          </h3>
          <Timeline events={statusHistory} />
        </div>

        <div className="heading-div">
          <div className="flex justify-between items-center mb-3 sm:mb-4">
            <h3 className="text-[15px] sm:text-base font-semibold text-[var(--primary)] flex items-center gap-2">
              <FaStickyNote className="cursor-pointer" /> Notes
            </h3>
            <button
              onClick={() => setShowNotes(!showNotes)}
              className="text-[var(--primary)] text-[13px] sm:text-[14px] hover:underline cursor-pointer"
            >
              {showNotes ? "Close" : "Edit Notes"}
            </button>
          </div>

          <AnimatePresence>
            {showNotes && (
              <motion.div
                layout
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2, ease: "easeInOut" }}
                className="mt-2 overflow-hidden"
              >
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={4}
                  className="w-full p-2 sm:p-3 text-md rounded-md border-2 border-[var(--primary)]/60 focus:outline-none"
                  placeholder="Add notes about this job..."
                />
                <div className="flex justify-center">
                  <button
                    onClick={handleNotesSave}
                    className="mt-2 flex items-center justify-center gap-2 bg-[var(--primary)]/80 text-[var(--text-1)] text-sm sm:text-md px-2 sm:px-3 py-2 rounded-md hover:bg-[var(--primary)] transition-colors min-w-fit w-40 cursor-pointer"
                  >
                  <FaEdit className="text-sm" /> Save Notes
                </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {job.notes && !showNotes && (
            <div className="mt-2">
              <AnimatePresence>
                <motion.div
                  layout
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: showFullNotes ? "auto" : "4.5rem", opacity: 1 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="overflow-hidden bg-[var(--home)]/90 shadow-xs rounded-md p-3"
                >
                  <p className="text-[13px] sm:text-[14px] text-[var(--secondary)] leading-relaxed whitespace-pre-wrap wrap-break-word">
                    {job.notes}
                  </p>
                </motion.div>
              </AnimatePresence>

              {job.notes.length > 30 && (
                <button
                  onClick={() => setShowFullNotes(!showFullNotes)}
                  className="text-[var(--primary)] text-[13px] sm:text-[14px] underline mt-4 cursor-pointer"
                >
                  {showFullNotes ? "Show Less" : "Show More"}
                </button>
              )}
            </div>
          )}
        </div>
      </div>


      {/* -------------- Middle Column (50%) - Job Details, Interviews --------- */}
      <div className="lg:col-span-2 space-y-4 sm:space-y-6">
        <div className="bg-[var(--card)] border border-[var(--border)] rounded-lg p-4 sm:p-6 shadow-sm">

          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-3 sm:mb-4 gap-3">
            <h2 className="text-[15px] sm:text-base md:text-lg font-semibold text-[var(--primary)] flex items-center gap-2">
              <FaBriefcase /> {job.companyName} - {job.role}
            </h2>

            <button
              onClick={handlePinToggle}
              className={`flex items-center justify-center gap-1.5 border border-[var(--border)] text-[var(--text)] text-sm sm:text-md px-2 sm:px-3 py-1 rounded-md hover:border-[var(--primary)] hover:text-[var(--primary)] transition-colors min-w-fit sm:w-auto w-full cursor-pointer ${
                job.isPinned ? "bg-yellow-200 text-black hover:text-black/80" : ""
              }`}
            >
              <FaThumbtack className="text-sm" /> {job.isPinned ? "Unpin" : "Pin"} Job
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
            <p className="text-md">
              <span className="font-semibold text-[var(--primary)] mr-1.5">
                Role:
              </span>
              <span className="text-[var(--secondary)]">{job.role}</span>
            </p>

            <p className="text-md">
              <span className="font-semibold text-[var(--primary)] mr-1.5">
                Status:
              </span>
              <span
                className={`inline-flex items-center px-2 py-0.5 rounded-full text-sm font-medium cursor-pointer ${
                  {
                    Applied: "bg-blue-400/20",
                    Interview: "bg-yellow-300/50",
                    Offered: "bg-orange-400/50",
                    Rejected: "bg-red-700/50 text-white",
                    Accepted: "bg-green-600/40",
                  } [job.status] || "bg-gray-100 text-[var(--secondary)]"
                }`}
              >
                {job.status}
              </span>
            </p>

            {job.applicationDate && (
              <p className="text-md">
                <span className="font-semibold text-[var(--primary)] mr-1.5">
                  Applied:
                </span>
                <span className="text-[var(--secondary)]">
                  {new Date(job.applicationDate).toLocaleDateString()}
                </span>
              </p>
            )}

            {job.deadlineDate && (
              <p className="text-md">
                <span className="font-semibold text-[var(--primary)] mr-1.5">
                  Deadline:
                </span>
                <span className="text-[var(--secondary)]">
                  {new Date(job.deadlineDate).toLocaleDateString()}
                </span>
              </p>
            )}

            {job.source && (
              <p className="text-md">
                <span className="font-semibold text-[var(--primary)] mr-1.5">
                  Source:
                </span>
                <span className="text-[var(--secondary)]">{job.source}</span>
              </p>
            )}

            {job.sourceLink && (
              <p className="text-md flex gap-2">
                <span className="font-semibold text-[var(--primary)] mr-1.5">
                  Source Link:
                </span>
                <a
                  href={job.sourceLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className=" hover:underline flex items-center gap-2 cursor-pointer max-w-full truncate"
                >
                  <FaLink className="text-sm" /> Visit
                </a>
              </p>
            )}

            <p className="text-md">
              <span className="font-semibold text-[var(--primary)] mr-1.5">
                Priority:
              </span>
              <span className="text-[var(--secondary)]">
                {job.priorityLevel}
              </span>
            </p>

            <p className="text-md">
              <span className="font-semibold text-[var(--primary)] mr-1.5">
                Location:
              </span>
              <span className="text-[var(--secondary)]">
                {job.location || "Not specified"}
              </span>
            </p>

            <p className="text-md">
              <span className="font-semibold text-[var(--primary)] mr-1.5">
                Stipend/Salary:
              </span>
              <span className="text-[var(--secondary)]">
                {typeof job.stipendOrSalary === "number"
                  ? `₹ ${job.stipendOrSalary.toLocaleString("en-IN")}`
                  : "N/A"}
              </span>
            </p>

            {job.resumePath && (
              <p className="text-md flex gap-2">
                <span className="font-semibold text-[var(--primary)] mr-1.5">
                  Resume:
                </span>
                <a
                  href={job.resumePath}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline flex items-center gap-2 cursor-pointer max-w-full truncate"
                >
                  <FaDownload className="text-sm" /> Download
                </a>
              </p>
            )}
          </div>

          {job.jobDescription && (
            <div className="mt-4">
              <p className="text-md font-semibold text-[var(--primary)] mb-2">
                Description:
              </p>

              <AnimatePresence>
                <motion.div
                  layout
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: showFullDescription ? "auto" : "4.5rem", opacity: 1 }}
                  transition={{ duration: 0.4, ease: "easeInOut" }}
                  className="overflow-hidden bg-[var(--card)] rounded-md shadow-xs"
                >
                  <p className="text-[13px] sm:text-[14px] bg-[var(--home)] p-2 text-[var(--secondary)] leading-relaxed whitespace-pre-wrap">
                    {job.jobDescription}
                  </p>
                </motion.div>
              </AnimatePresence>

              {job.jobDescription.length > 50 && (
                <button
                  onClick={() => setShowFullDescription(!showFullDescription)}
                  className="text-[var(--primary)] text-[13px] sm:text-[14px] underline mt-3 cursor-pointer"
                >
                  {showFullDescription ? "Show Less" : "Show More"}
                </button>
              )}
            </div>
          )}
        </div>

        
        {/* ---------------- Interview ----------------- */}
        {(job.interviews?.length ?? 0) > 0 && (
          <div className="heading-div">

            <h3 className="heading">
              <FaCalendarAlt className="cursor-pointer" /> Interviews
            </h3>

            <div className="space-y-4">
              {job.interviews.map((interview, index) => (
                <div key={index}>
                  {index > 0 && (
                    <hr className="border-t-2 border-[var(--border)] mb-4 sm:mb-6" />
                  )}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">

                    <p className="text-md">
                      <span className="font-semibold text-[var(--primary)] mr-1.5">
                        Round {index + 1}:
                      </span>
                      <span className="text-[var(--secondary)] font-semibold">
                        {interview.round}
                      </span>
                    </p>

                    <p className="text-md">
                      <span className="font-semibold text-[var(--primary)] mr-1.5">
                        Date:
                      </span>
                      <span className="text-[var(--secondary)]">
                        {new Date(interview.interviewDate).toLocaleDateString()}
                      </span>
                    </p>

                    <p className="text-md">
                      <span className="font-semibold text-[var(--primary)] mr-1.5">
                        Status:
                      </span>
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-sm font-medium cursor-pointer ${
                          {
                            Scheduled: "bg-blue-400/20",
                            Completed: "bg-green-600/40",
                            Cancelled: "bg-red-700/60 text-white",
                          }[interview.status] || "bg-gray-100 text-[var(--secondary)]"
                        }`}
                      >
                        {interview.status}
                      </span>
                    </p>

                    {interview.comments && (
                      <div className="sm:col-span-2">
                        <p className="text-md font-semibold text-[var(--primary)] mr-1.5 mb-2">
                          Description & Comments:
                        </p>

                        <AnimatePresence>
                          <motion.div
                            layout
                            initial={{ height: 0, opacity: 0 }}
                            animate={{
                              height: showFullComments[index] ? "auto" : "4.5rem",
                              opacity: 1,
                            }}
                            transition={{ duration: 0.4, ease: "easeInOut" }}
                            className="overflow-hidden bg-[var(--card)] rounded-md shadow-sm"
                          >
                            <p className="text-[13px] sm:text-[14px] bg-[var(--home)] p-2 text-[var(--secondary)] leading-relaxed whitespace-pre-wrap">
                              {interview.comments}
                            </p>
                          </motion.div>
                        </AnimatePresence>

                        {interview.comments.length > 50 && (
                          <button
                            onClick={() => toggleShowComments(index)}
                            className="text-[var(--primary)] text-[13px] sm:text-[14px] underline mt-3 cursor-pointer"
                          >
                            {showFullComments[index] ? "Show Less" : "Show More"}
                          </button>
                        )}

                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>


      {/* ----------- Right Column (25%) - Timeline, Quick Links --------------- */}
      <div className="lg:col-span-1 space-y-4 sm:space-y-6">

        <div className="heading-div">
          <h3 className="heading">
            <FaCalendarAlt className="cursor-pointer" /> Timeline
          </h3>
          <Timeline events={events} />
        </div>

        <div className="heading-div">
          <h3 className="heading">
            <FaLink className="cursor-pointer" /> Quick Links
          </h3>

          <div className="flex flex-col sm:flex-row min-[1200px]:flex-row gap-2 sm:gap-3">
            <button
              onClick={() => navigate(`/jobs/list`)}
              className="flex items-center justify-center gap-1.5 border bg-[var(--primary)]/70 hover:bg-transparent text-[var(--text-1)] border-[var(--border)] text-sm sm:text-md px-2 sm:px-3 py-2 rounded-md hover:text-[var(--text)] transition-colors min-w-fit w-full cursor-pointer"
            >
              <FaArrowLeft className="text-sm" /> Back
            </button>
            <button
              onClick={() => navigate(`/jobs/edit/${job._id}`)}
              className="flex items-center justify-center border border-[var(--border)] bg-[var(--primary)]/70 hover:bg-transparent gap-1.5 text-[var(--text-1)] text-sm sm:text-md px-2 sm:px-3 py-2 rounded-md hover:text-[var(--text)] transition-colors min-w-fit w-full cursor-pointer"
            >
              <FaEdit className="text-sm" /> Edit
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default JobDetails;