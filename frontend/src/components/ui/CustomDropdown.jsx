import { useState } from "react";
import { FaChevronDown } from "react-icons/fa";

export default function CustomDropdown({ value, onChange, options }) {
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (val) => {
    onChange(val);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-2 sm:p-2.5 text-md border border-[var(--border)] rounded-md bg-[var(--card)] text-[var(--primary)] flex items-center justify-between focus:outline-none focus:ring-1 focus:ring-[var(--primary)] cursor-pointer"
      >
        {options.find((opt) => opt.value === value)?.label || "Select"}
        <FaChevronDown className="text-[var(--secondary)] text-[12px] sm:text-[14px]" />
      </button>

      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-[var(--home)] border border-[var(--border)] rounded-md shadow-lg">
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => handleSelect(option.value)}
              className="w-full text-left px-3 py-1.5 text-md text-[var(--primary)] rounded-md hover:bg-[var(--primary-hover)] hover:text-white transition-colors cursor-pointer"
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
