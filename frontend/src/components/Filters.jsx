import { useState } from "react";
import { motion } from "framer-motion";
import InputField from "./ui/InputField";
import CustomDropdown from "./ui/CustomDropdown";
import { FaFilter, FaUndo } from "react-icons/fa";

export default function Filters({ onFilter }) {
  const [status, setStatus] = useState("All");
  const [priorityLevel, setPriorityLevel] = useState("All");
  const [isPinned, setIsPinned] = useState("All");
  const [search, setSearch] = useState("");
  const [source, setSource] = useState("");
  const [location, setLocation] = useState("");
  const [sort, setSort] = useState("applicationDate-desc");

  const handleApply = () => {
    const filters = { status, priorityLevel, isPinned, search, source, location, sort };
    if (status === "All") delete filters.status;
    if (priorityLevel === "All") delete filters.priorityLevel;
    if (isPinned === "All") delete filters.isPinned;
    if (!search) delete filters.search;
    if (!source) delete filters.source;
    if (!location) delete filters.location;
    onFilter(filters);
  };

  const handleReset = () => {
    setStatus("All");
    setPriorityLevel("All");
    setIsPinned("All");
    setSearch("");
    setSource("");
    setLocation("");
    setSort("applicationDate-desc");
    onFilter({
      status: "All",
      priorityLevel: "All",
      isPinned: "All",
      search: "",
      source: "",
      location: "",
      sort: "applicationDate-desc",
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="bg-[var(--card)] border border-[var(--border)] rounded-lg p-4 sm:p-6 shadow-lg mb-4 sm:mb-6"
    >
      <h2 className="text-[15px] sm:text-lg font-semibold text-[var(--primary)] mb-3 flex items-center gap-2">
        <FaFilter /> Filters
      </h2>
      
      <div className="space-y-4 sm:space-y-5">
        <div className="flex flex-col gap-1">
          <label className="text-md font-medium text-[var(--primary)]">
            Status
          </label>
          <CustomDropdown
            value={status}
            onChange={setStatus}
            options={[
              { value: "All", label: "All" },
              { value: "Applied", label: "Applied" },
              { value: "Interview", label: "Interview" },
              { value: "Offered", label: "Offered" },
              { value: "Rejected", label: "Rejected" },
              { value: "Accepted", label: "Accepted" },
            ]}
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-md font-medium text-[var(--primary)]">
            Priority
          </label>
          <CustomDropdown
            value={priorityLevel}
            onChange={setPriorityLevel}
            options={[
              { value: "All", label: "All" },
              { value: "Low", label: "Low" },
              { value: "Medium", label: "Medium" },
              { value: "High", label: "High" },
            ]}
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-md font-medium text-[var(--primary)]">
            Pinned
          </label>
          <CustomDropdown
            value={isPinned}
            onChange={setIsPinned}
            options={[
              { value: "All", label: "All" },
              { value: "Pinned", label: "Pinned" },
              { value: "Unpinned", label: "Unpinned" },
            ]}
          />
        </div>

        <InputField
          label="Company/Role"
          name="companyName"
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by company or role"
        />
        <InputField
          label="Source"
          name="source"
          type="text"
          value={source}
          onChange={(e) => setSource(e.target.value)}
          placeholder="Search by source (e.g., LinkedIn)"
        />
        <InputField
          label="Location"
          name="location"
          type="text"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="Search by location (e.g., Mumbai, Remote)"
        />

        <div className="flex flex-col gap-1">
          <label className="text-md font-medium text-[var(--primary)]">
            Sort By
          </label>
          <CustomDropdown
            value={sort}
            onChange={setSort}
            options={[
              {
                value: "applicationDate-desc",
                label: "Application Date (Newest)",
              },
              {
                value: "applicationDate-asc",
                label: "Application Date (Oldest)",
              },
              { value: "deadlineDate-asc", label: "Deadline (Soonest)" },
              { value: "priorityLevel-desc", label: "Priority (High to Low)" },
            ]}
          />
        </div>

        <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 mt-10">
          <button
            onClick={handleApply}
            className="flex items-center justify-center gap-2 bg-[var(--primary)] text-[var(--text-1)] text-md p-2 rounded-md hover:bg-[var(--primary-hover)] transition-colors flex-1 cursor-pointer"
          >
            <FaFilter /> Apply
          </button>
          <button
            onClick={handleReset}
            className="flex items-center justify-center gap-2 border border-[var(--border)] text-[var(--text)] hover:text-[var(--text-1)] text-md p-2 rounded-md hover:bg-[var(--primary)] transition-colors flex-1 cursor-pointer"
          >
            <FaUndo /> Reset
          </button>
        </div>

      </div>
    </motion.div>
  );
}