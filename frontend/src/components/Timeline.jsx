import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaBriefcase, FaCalendarAlt, FaBell, FaInfoCircle, FaUserFriends } from "react-icons/fa";

const Timeline = ({ events = [] }) => {
  const [showMore, setShowMore] = useState({});

  const toggleShowMore = (index) => {
    setShowMore((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  return (
    <div className="space-y-2 sm:space-y-3">
      {events.length === 0 ? (
        <p className="text-md text-[var(--secondary)]">
          No events available
        </p>
      ) : (
        events.map((event, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className="flex items-start gap-3"
          >
            <div className="flex flex-col items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-white ${
                  event.type === "application" ? "bg-blue-500"
                    : event.type === "deadline" ? "bg-red-500"
                    : event.type === "interview" ? "bg-yellow-500"
                    : event.type === "status" ? "bg-purple-500"
                    : "bg-[var(--secondary)]"
                }`}
              >
                {event.type === "application" && <FaBriefcase className="cursor-pointer" />}
                {event.type === "interview" && <FaUserFriends className="cursor-pointer" />}
                {event.type === "deadline" && <FaCalendarAlt className="cursor-pointer" />}
                {event.type === "notification" && <FaBell className="cursor-pointer" />}
                {event.type === "status" && <FaInfoCircle className="cursor-pointer" />}
              </div>
              {index < events.length - 1 && (
                <div className="w-0.5 bg-[var(--border)] flex-1 h-full min-h-[2.5rem]"></div>
              )}
            </div>

            <div className="flex-1 mr-1 sm:mr-1.5">
              <p className="text-md font-semibold text-[var(--primary)]">
                {event.title}
              </p>
              <p className="text-[13px] sm:text-[14px] text-[var(--secondary)]">
                {event.date
                  ? new Date(event.date).toLocaleDateString()
                  : "No date"}
              </p>

              {event.description && (
                <AnimatePresence>
                  <motion.div
                    layout
                    initial={{ height: 0, opacity: 0 }}
                    animate={{
                      height: showMore[index] ? "auto" : "2.5rem",
                      opacity: 1,
                    }}
                    transition={{ duration: 0.4, ease: "easeInOut" }}
                    className="overflow-hidden"
                  >
                    <p className="text-[13px] sm:text-[14px] text-[var(--secondary)] whitespace-pre-wrap">
                      {event.description}
                    </p>
                  </motion.div>
                </AnimatePresence>
              )}
              
              {event.description &&
                event.type === "interview" &&
                event.description.length > 50 && (
                  <button
                    onClick={() => toggleShowMore(index)}
                    className="text-[var(--primary)] text-[13px] sm:text-[14px] underline mt-1 cursor-pointer "
                  >
                    {showMore[index] ? "Show Less" : "Show More"}
                  </button>
                )}
            </div>
          </motion.div>
        ))
      )}
    </div>
  );
};

export default Timeline;