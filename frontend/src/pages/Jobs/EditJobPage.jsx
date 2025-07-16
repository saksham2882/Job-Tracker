import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../api/api";
import { motion } from "framer-motion";
import FileUploader from "../../components/FileUploader";
import toast from "react-hot-toast";
import InputField from "../../components/ui/InputField";
import CustomDropdown from "../../components/ui/CustomDropdown";
import { FaPlus, FaSave, FaTrash, FaUserFriends } from "react-icons/fa";
import { useReminder } from "../../contexts/ReminderContext";
import LoadingSpinner from "../../components/ui/LoadingSpinner";

export default function EditJobPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toggleReminder } = useReminder();
  const [form, setForm] = useState(null);
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false); 
  const [formError, setFormError] = useState("");


  useEffect(() => {
    const fetchJob = async () => {
      try {
        const res = await api.get(`/jobs/${id}`);
        const job = res.data;

        setForm({
          companyName: job.companyName || "",
          role: job.role || "",
          status: job.status || "Applied",
          applicationDate: job.applicationDate ? new Date(job.applicationDate).toISOString().slice(0, 10) : "",
          deadlineDate: job.deadlineDate ? new Date(job.deadlineDate).toISOString().slice(0, 10) : "",
          source: job.source || "",
          sourceLink: job.sourceLink || "",
          priorityLevel: job.priorityLevel || "Medium",
          jobDescription: job.jobDescription || "",
          resumePath: job.resumePath || "",
          reminderOn: job.reminderOn || false,
          location: job.location || "",
          stipendOrSalary: job.stipendOrSalary || "",
        });

        setInterviews(
          job.interviews?.map((int) => ({
            round: int.round || "HR",
            interviewDate: int.interviewDate ? new Date(int.interviewDate).toISOString().slice(0, 10) : "",
            status: int.status || "Scheduled",
            comments: int.comments || "",
          })) || []
        );
        setLoading(false);
      } catch (err) {
        toast.error(err.response?.data?.error || "Failed to fetch job");
        navigate("/dashboard");
      }
    };
    fetchJob();
  }, [id, navigate]);


  const validateForm = () => {
    if (!form?.companyName?.trim()) {
      setFormError("Company name is required");
      return false;
    }
    if (!form?.role?.trim()) {
      setFormError("Role is required");
      return false;
    }
    if (!form.applicationDate?.trim()) {
      setFormError("Application date is required");
      return false;
    }
    if (!form.deadlineDate?.trim()) {
      setFormError("Deadline date is required");
      return false;
    }
    if (form.stipendOrSalary < 0) {
      setFormError("Stipend/Salary must be a non-negative number");
      return false;
    }
    if (form.sourceLink && !/^(https?:\/\/)?([\w\-]+\.)+[\w\-]+(\/[\w\-./?%&=]*)?$/.test(form.sourceLink)) {
      setFormError("Invalid URL format for source link");
      return false;
    }
    for (const [index, interview] of interviews.entries()) {
      if (!interview.interviewDate) {
        setFormError(`Interview ${index + 1} date is required`);
        return false;
      }
    }
    setFormError("");
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setSubmitLoading(true);
    try {
      const formData = { ...form, interviews };
      await api.put(`/jobs/${id}`, formData);
      toast.success("Job updated successfully");
      navigate("/dashboard");
    } catch (err) {
      const errorMessage = err.response?.data?.error || err.message || "Failed to update job";
      setFormError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleUpload = (resumePath) => {
    setForm({ ...form, resumePath });
  };

  const addInterview = () => {
    setInterviews([
      ...interviews,
      {
        round: "HR",
        interviewDate: new Date().toISOString().slice(0, 10),
        status: "Scheduled",
        comments: "",
      },
    ]);
  };

  const deleteInterview = (index) => {
    setInterviews(interviews.filter((_, i) => i !== index));
  };

  const handleToggleReminder = (reminderOn) => {
    toggleReminder({ _id: id, reminderOn: form.reminderOn }, null,
      (value) => {setForm({ ...form, reminderOn: value })}, reminderOn
    );
  };

  if (loading || !form) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--bg)]">
        <LoadingSpinner /> 
      </div>
    );
  }


  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      onSubmit={handleSubmit}
      className="max-w-[95%] sm:max-w-3xl md:max-w-5xl mx-auto space-y-4 sm:space-y-6"
    >
      <h2 className="text-xl md:text-2xl font-semibold text-[var(--primary)] mb-4 sm:mb-6 mt-6 flex items-center gap-2">
        <FaSave /> Update Job
      </h2>

      <div className="bg-[var(--card)] border border-[var(--border)] rounded-lg p-4 sm:p-6 mt-8 shadow-md">
        <h3 className="text-[15px] sm:text-base font-semibold text-[var(--primary)] mb-3 sm:mb-4">
          Job Details
        </h3>
        {/* --------- ------Job Related Info ---------------- */}
        <div className="space-y-4 sm:space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 sm:gap-x-6">
            <InputField
              label="Company"
              name="companyName"
              type="text"
              value={form.companyName}
              onChange={(e) => setForm({ ...form, companyName: e.target.value })}
              placeholder="Enter company name"
              required
            />
            <InputField
              label="Role"
              name="role"
              type="text"
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value })}
              placeholder="Enter job role"
              required
            />
            <InputField
              label="Location"
              name="location"
              type="text"
              value={form.location}
              onChange={(e) => setForm({ ...form, location: e.target.value })}
              placeholder="Enter job location (e.g., Mumbai, Remote)"
            />
            <InputField
              label="Stipend/Salary (₹)"
              name="stipendOrSalary"
              type="number"
              value={form.stipendOrSalary}
              onChange={(e) => setForm({ ...form, stipendOrSalary: e.target.value })}
              placeholder="Enter amount in Rupees"
              min="0"
            />
            <div className="flex flex-col gap-1">
              <label className="text-md font-medium text-[var(--primary)]">
                Status
              </label>
              <CustomDropdown
                value={form.status}
                onChange={(value) => setForm({ ...form, status: value })}
                options={[
                  { value: "Applied", label: "Applied" },
                  { value: "Interview", label: "Interview" },
                  { value: "Offered", label: "Offered" },
                  { value: "Rejected", label: "Rejected" },
                  { value: "Accepted", label: "Accepted" },
                ]}
              />
            </div>
            <InputField
              label="Application Date"
              name="applicationDate"
              type="date"
              value={form.applicationDate}
              onChange={(e) => setForm({ ...form, applicationDate: e.target.value })}
              placeholder="Select application date"
              required
            />
            <InputField
              label="Deadline"
              name="deadlineDate"
              type="date"
              value={form.deadlineDate}
              onChange={(e) => setForm({ ...form, deadlineDate: e.target.value })}
              placeholder="Select deadline date"
              required
            />
            <InputField
              label="Source"
              name="source"
              type="text"
              value={form.source}
              onChange={(e) => setForm({ ...form, source: e.target.value })}
              placeholder="Enter source (e.g., LinkedIn)"
            />
            <InputField
              label="Source Link"
              name="sourceLink"
              type="text"
              value={form.sourceLink}
              onChange={(e) => setForm({ ...form, sourceLink: e.target.value })}
              placeholder="Enter source URL (e.g., https://linkedin.com/job/123)"
            />
            <div className="flex flex-col gap-1">
              <label className="text-md font-medium text-[var(--primary)]">
                Priority
              </label>
              <CustomDropdown
                value={form.priorityLevel}
                onChange={(value) => setForm({ ...form, priorityLevel: value })}
                options={[
                  { value: "Low", label: "Low" },
                  { value: "Medium", label: "Medium" },
                  { value: "High", label: "High" },
                ]}
              />
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-md font-medium text-[var(--primary)]">
              Job Description
            </label>
            <textarea
              value={form.jobDescription}
              onChange={(e) => setForm({ ...form, jobDescription: e.target.value })}
              rows={4}
              className="w-full p-2 sm:p-3 text-md border border-[var(--border)] rounded-md focus:outline-none focus:ring-1 focus:ring-[var(--primary)]"
              placeholder="Enter job description"
            />
          </div>
        </div>
      </div>


      {/* ------------------- Interview Section ------------------- */}
      <div className="heading-div">

        <h3 className="heading">
          <FaUserFriends /> Interviews & Rounds
        </h3>

        <button
          type="button"
          onClick={addInterview}
          className="flex items-center justify-center gap-2 border border-[var(--border)] text-[var(--primary)] text-md p-2 rounded-md hover:bg-[var(--primary)]/70 hover:text-white transition-colors w-full sm:w-40 md:w-48 mb-5 cursor-pointer"
        >
          <FaPlus /> Add
        </button>

        <div className="space-y-4 sm:space-y-6">
          {interviews.map((int, index) => (
            <div key={index}>
              {index > 0 && (
                <hr className="border-t border-[var(--border)] mb-4 sm:mb-6" />
              )}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 relative">

                <div className="flex flex-col gap-1">
                  <label className="text-md font-medium text-[var(--primary)]">
                    Round
                  </label>
                  <CustomDropdown
                    value={int.round}
                    onChange={(value) => {
                      const newInterviews = [...interviews];
                      newInterviews[index].round = value;
                      setInterviews(newInterviews);
                    }}
                    options={[
                      { value: "Coding", label: "Coding" },
                      { value: "Technical", label: "Technical" },
                      { value: "HR", label: "HR" },
                      { value: "Behavioral", label: "Behavioral" },
                      { value: "System Design", label: "System Design" },
                      { value: "Aptitude", label: "Aptitude" },
                      { value: "Group Discussion", label: "Group Discussion" },
                      { value: "Final", label: "Final" },
                      { value: "Other", label: "Other" },
                    ]}
                  />
                </div>

                <InputField
                  label="Date"
                  name={`interviewDate-${index}`}
                  type="date"
                  value={int.interviewDate}
                  onChange={(e) => {
                    const newInterviews = [...interviews];
                    newInterviews[index].interviewDate = e.target.value;
                    setInterviews(newInterviews);
                  }}
                  placeholder="Select interview date"
                  required
                />

                <div className="flex flex-col gap-1">
                  <label className="text-md font-medium text-[var(--primary)]">
                    Status
                  </label>
                  <CustomDropdown
                    value={int.status}
                    onChange={(value) => {
                      const newInterviews = [...interviews];
                      newInterviews[index].status = value;
                      setInterviews(newInterviews);
                    }}
                    options={[
                      { value: "Scheduled", label: "Scheduled" },
                      { value: "Completed", label: "Completed" },
                      { value: "Cancelled", label: "Cancelled" },
                    ]}
                  />
                </div>

                <div className="flex flex-col gap-1 sm:col-span-2">
                  <label className="text-md font-medium text-[var(--primary)]">
                    Description & Comments
                  </label>
                  <textarea
                    value={int.comments}
                    onChange={(e) => {
                      const newInterviews = [...interviews];
                      newInterviews[index].comments = e.target.value;
                      setInterviews(newInterviews);
                    }}
                    rows={3}
                    className="w-full p-2 sm:p-3 text-md border border-[var(--border)] rounded-md focus:outline-none focus:ring-1 focus:ring-[var(--primary)]"
                    placeholder="Enter interview comments"
                  />
                </div>

                <button
                  type="button"
                  onClick={() => deleteInterview(index)}
                  className="absolute -top-4 right-0 text-[var(--danger)] hover:text-red-700 text-md p-2 hover:bg-[var(--primary)]/10 rounded-2xl cursor-pointer transition-colors"
                  title="Delete Interview"
                >
                  <FaTrash />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>


      {/* ------------------- Resume ------------------- */}
      <div className="heading-div">
        <h3 className="text-[15px] sm:text-base font-semibold text-[var(--primary)] mb-3 sm:mb-4">
          Resume
        </h3>
        <FileUploader jobId={id} onUpload={handleUpload} resumePath={form.resumePath} />

        {form.resumePath && (
          <p className="mt-2 text-sm text-[var(--secondary)]">
            Review Resume:{" "}
            <a
              href={form.resumePath}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--primary)] underline"
            >
              View
            </a>
          </p>
        )}
      </div>


      {/* ------------------- Notifications ------------------- */}
      <div className="heading-div">
        <h3 className="text-[15px] sm:text-base font-semibold text-[var(--primary)] mb-3 sm:mb-4">
          Notifications
        </h3>

        <div className="flex gap-2 sm:gap-4">
          <button
            type="button"
            onClick={() => handleToggleReminder(true)}
            className={`flex-1 text-md p-2 rounded-md transition-colors cursor-pointer ${
              form.reminderOn
                ? "bg-[var(--primary)]/80 hover:bg-[var(--primary)] text-white"
                : "bg-[var(--border)]/90 text-[var(--secondary)]"
            }`}
          >
            On
          </button>
          <button
            type="button"
            onClick={() => handleToggleReminder(false)}
            className={`flex-1 text-md p-2 rounded-md transition-colors cursor-pointer ${
              !form.reminderOn
                ? "bg-[var(--primary)]/80 hover:bg-[var(--primary)] text-white"
                : "bg-[var(--border)]/90 text-[var(--secondary)]"
            }`}
          >
            Off
          </button>
        </div>
      </div>

      {/* ------------------- Form Error ------------------- */}
      <div className="min-h-[1.5rem] sm:min-h-[1.75rem] mt-2">
        {formError && (
          <p className="text-[var(--danger)] text-md">
            {formError}
          </p>
        )}
      </div>

      {/* ------------------- Submit Button ------------------- */}
      <div className="flex justify-center">
        <button
          type="submit"
          disabled={submitLoading}
          className={`flex items-center justify-center gap-2 border border-[var(--primary)]/50 bg-[var(--border)] hover:bg-[var(--primary)] hover:text-[var(--text-1)] text-md p-2 rounded-md transition-colors w-90 mt-4 sm:mt-6 mb-5 sm:mb-8 shadow-lg cursor-pointer ${
            submitLoading ? "opacity-50 cursor-not-allowed" : ""
          }`}
      >
        {submitLoading ? "Updating..." : (<> <FaSave /> Update Job </> )}
      </button>
      </div>
    </motion.form>
  );
}