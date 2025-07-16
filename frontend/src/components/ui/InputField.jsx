import { FaBuilding, FaBriefcase, FaLink, FaCalendarAlt, FaMapMarkerAlt, FaRupeeSign } from "react-icons/fa";

const InputField = ({ label, name, type, value, onChange, placeholder, icon: IconProp, disabled = false }) => {
  const iconMap = {
    companyName: FaBuilding,
    role: FaBriefcase,
    source: FaLink,
    sourceLink: FaLink,
    applicationDate: FaCalendarAlt,
    deadlineDate: FaCalendarAlt,
    interviewDate: FaCalendarAlt,
    location: FaMapMarkerAlt,
    stipendOrSalary: FaRupeeSign,
  };

  const Icon = IconProp || iconMap[name] || FaCalendarAlt;

  return (
    <div className="flex flex-col gap-1">
      <label
        htmlFor={name}
        className="text-md font-medium text-[var(--primary)]"
      >
        {label}
      </label>
      
      <div className="relative">
        <span className="absolute left-2 top-1/2 -translate-y-1/2">
          <Icon className="text-[var(--secondary)] text-md" />
        </span>
        <input
          type={type}
          name={name}
          id={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          className={`w-full p-2 sm:p-2.5 pl-8 sm:pl-9 text-md border border-[var(--border)] rounded-md focus:outline-none focus:ring-1 focus:ring-[var(--primary)] ${
            disabled ? "opacity-75 bg-[var(--border)] cursor-not-allowed" : ""
          }`}
        />
      </div>
    </div>
  );
};

export default InputField;