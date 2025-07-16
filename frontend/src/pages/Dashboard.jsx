import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";
import api from "../api/api";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import Calendar from "../components/Calendar";
import RecentJobList from "../components/RecentJobList";
import LoadingSpinner from "../components/ui/LoadingSpinner";
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Title, Tooltip, } from "chart.js";
import { Bar } from "react-chartjs-2";
import { FaChartBar } from "react-icons/fa";

ChartJS.register(BarElement, CategoryScale, LinearScale, Title, Tooltip);

export default function Dashboard() {
  const { authUser } = useContext(AuthContext);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchJobs = async () => {
    try {
      const res = await api.get("/jobs");
      setJobs(res.data);
    } catch (err) {
      toast.error("Failed to load jobs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (authUser) fetchJobs();
  }, [authUser]);

  const statusCounts = jobs.reduce((acc, job) => {
    acc[job.status] = (acc[job.status] || 0) + 1;
    return acc;
  }, {});

  const chartData = {
    labels: ["Applied", "Interview", "Offered", "Rejected", "Accepted"],
    datasets: [
      {
        label: "Applications",
        data: [
          statusCounts.Applied || 0,
          statusCounts.Interview || 0,
          statusCounts.Offered || 0,
          statusCounts.Rejected || 0,
          statusCounts.Accepted || 0,
        ],
        backgroundColor: [
          "#4299e1",
          "#ecc94b",
          "#48bb78",
          "#f56565",
          "#9f7aea",
        ],
      },
    ],
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--bg)]">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-[95%] mx-auto py-6 sm:px-2"
    >
      <h1 className=" text-xl md:text-2xl font-semibold text-[var(--primary)] mb-4 flex items-center gap-2">
        <FaChartBar className="text-base md:text-xl" /> Dashboard
      </h1>

      <div className="flex flex-col lg:flex-row gap-6 mb-4 mt-8">
        <div className="lg:w-2/3">
          <Calendar jobs={jobs} />
        </div>
        <div className="lg:w-1/3">
          <RecentJobList jobs={jobs} />
        </div>
      </div>

      <div className="bg-[var(--card)] p-4 rounded-lg shadow-lg mb-6">
        <h2 className="text-base md:text-lg font-semibold text-[var(--primary)] mb-4 flex items-center gap-2">
          <FaChartBar className="text-base" /> Application Stats
        </h2>

        <div className="h-[200px] sm:h-[250px] md:h-[300px]">
          <Bar
            data={chartData}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                title: {
                  display: true,
                  text: "Status Overview",
                  font: { size: 16 },
                },
              },
              scales: { y: { ticks: { stepSize: 1 } } },
            }}
          />
        </div>

      </div>
    </motion.div>
  );
}