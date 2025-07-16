import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { FaArrowRight } from "react-icons/fa";

export default function RecentJobList({ jobs }) {
  const navigate = useNavigate();
  const recentJobs = jobs;

  return (
    <div className="bg-[var(--card)] p-4 rounded-lg shadow-lg mb-4">
      <div className="flex items-center justify-between mb-3.5">
        <h2 className="text-base md:text-lg font-semibold text-[var(--primary)] flex items-center gap-2">
          Recent Jobs
        </h2>
        <button
          onClick={() => navigate("/jobs/list")}
          className="text-sm px-3 py-1.5 max-sm:py-1 pl-4 rounded-full outline-1 outline-[var(--border)] text-[var(--text)] hover:text-[var(--text-1)] bg-[var(--home-1)]/80 hover:bg-[var(--primary)]/80 transition-colors flex items-center gap-2 cursor-pointer"
          aria-label="View all jobs"
        >
          View all
          <FaArrowRight className="text-sm" />
        </button>
      </div>

      <div
        className={`${
          recentJobs.length < 6 ? "h-auto" : "h-[630px]"
        } lg:h-[550px] overflow-y-auto custom-scrollbar lg:relative`}
      >
        {recentJobs.length === 0 ? (
          <p className="text-[16px] max-sm:text-sm max-sm:mt-4 text-[var(--secondary)] text-center lg:absolute top-[50%] right-0 left-0">
            No recent jobs found
          </p>
        ) : (
          <div className="flex flex-col gap-2.5 m-2 ml-1">
            {recentJobs.map((job, index) => (
              <motion.div
                key={job._id}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.15, duration: 0.3, smooth: true}}
                className="pl-3 py-1.5 border-l-4 border-[var(--primary)]/70 hover:bg-[var(--primary)]/10 hover:shadow-lg outline-1 outline-[var(--border)] transition-all duration-200 rounded-lg"
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex sm:items-center gap-1 flex-1 min-w-0 flex-col sm:flex-row">
                    <span className="text-[var(--secondary)] text-sm font-medium w-6 shrink-0">
                      {index + 1}.
                    </span>

                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-semibold text-[var(--primary)] truncate">
                        {job.companyName}
                      </h3>
                      <p className="text-sm text-[var(--secondary)] truncate">
                        Role: {job.role}
                      </p>
                      <p className="text-sm text-[var(--secondary)] truncate">
                        Status:{" "}
                        <span className={`text-${job.status.toLowerCase()}-600`} >
                          {job.status}
                        </span>
                      </p>
                      <p className="text-sm text-[var(--secondary)] truncate">
                        Applied:{" "}
                        {new Date(job.applicationDate).toLocaleDateString()}
                      </p>
                    </div>

                  </div>

                  <button
                    onClick={() => navigate(`/jobs/details/${job._id}`)}
                    className="text-sm p-2 rounded-full text-[var(--text-1)] bg-[var(--primary)]/70 hover:bg-[var(--primary)] transition-colors shrink-0 mr-6 cursor-pointer"
                    aria-label={`View details for ${job.companyName}`}
                  >
                    <FaArrowRight className="text-sm" />
                  </button>
                </div>

              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
