import { useState, useRef } from "react";
import toast from "react-hot-toast";
import { FaCross, FaDatabase, FaFileUpload, FaTimes, FaTrash } from "react-icons/fa";
import api from "../api/api";

export default function FileUploader({ jobId, onUpload, resumePath }) {
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("resume", file);
      const res = await api.post("/jobs/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("Resume uploaded!");
      onUpload(res.data.resumePath);
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to upload resume");
    } finally {
      setLoading(false);
    }
  };

  const handleClearFile = () => {
    fileInputRef.current.value = null;
    onUpload("");
  };

  const getFileName = () => {
    if (resumePath) {
      const urlParts = resumePath.split("/");
      return urlParts[urlParts.length - 1] || "Resume.pdf";
    }
    return "";
  };

  return (
    <div className="mt-4">
      <label className="text-[var(--primary)] text-sm sm:text-md mb-1 flex items-center gap-2">
        <FaFileUpload /> Upload Resume (PDF)
      </label>

      <div className="relative flex items-center gap-2 focus:ring-1">
        <input
          type="file"
          accept="application/pdf"
          onChange={handleFileChange}
          ref={fileInputRef}
          className="input w-full file:mr-4 file:py-1 sm:file:py-1.5 file:px-2 sm:file:px-6 file:rounded file:border-0 file:text-sm file:bg-[var(--primary)]/70 file:text-white hover:file:bg-[var(--primary-hover)] file:cursor-pointer cursor-pointer file:focus:ring-1 focus:outline-none focus:ring-1 focus:ring-[var(--primary)]"
          disabled={loading}
        />
        {resumePath && (
          <button
            type="button"
            onClick={handleClearFile}
            className="btn-danger text-md p-2 rounded-full"
            title="Remove Resume"
          >
            <FaTimes />
          </button>
        )}
      </div>

      {loading && (
        <p className="mt-2 text-md text-[var(--secondary)]">
          Uploading...
        </p>
      )}
      {resumePath && !loading && (
        <p className="mt-2 text-sm text-[var(--secondary)]">
          Selected: {getFileName()}
        </p>
      )}
    </div>
  );
}
