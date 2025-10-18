import { useState, useEffect, } from "react";
import { Bar, Line, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
} from "chart.js";
import api from "../api/api";
import InputField from "../components/ui/InputField";
import CustomDropdown from "../components/ui/CustomDropdown";
import LoadingSpinner from "../components/ui/LoadingSpinner";
import { motion } from "framer-motion";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement
);

// Custom debounce hook
const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

const AnalyticsDashboard = () => {
  const [statusData, setStatusData] = useState(null);
  const [sourceData, setSourceData] = useState(null);
  const [timeData, setTimeData] = useState(null);
  const [successRateData, setSuccessRateData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filter states
  const [jobTitleFilter, setJobTitleFilter] = useState("");
  const [companyFilter, setCompanyFilter] = useState("");
  const [sourceFilter, setSourceFilter] = useState(""); 
  const [timeframe, setTimeframe] = useState("monthly");

  // Debounced filter values
  const debouncedJobTitleFilter = useDebounce(jobTitleFilter, 500);
  const debouncedCompanyFilter = useDebounce(companyFilter, 500);

  useEffect(() => {
    const fetchAnalyticsData = async () => {
      try {
        setLoading(true);
        const params = {
          jobTitle: debouncedJobTitleFilter,
          company: debouncedCompanyFilter,
          source: sourceFilter,
          timeframe: timeframe,
        };

        const [statusRes, sourceRes, timeRes, successRes] = await Promise.all([
          api.get("/analytics/status-distribution", { params }),
          api.get("/analytics/applications-by-source", { params }),
          api.get("/analytics/applications-over-time", { params }),
          api.get("/analytics/success-rates", { params }),
        ]);

        setStatusData(statusRes.data);
        setSourceData(sourceRes.data);
        setTimeData(timeRes.data);
        setSuccessRateData(successRes.data);
      } catch (err) {
        setError(err.response?.data?.message || err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalyticsData();
  }, [debouncedJobTitleFilter, debouncedCompanyFilter, sourceFilter, timeframe]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--bg)]">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500 text-center mt-4">Error: {error}</div>;
  }

  // Generate source options for dropdown
  const uniqueSources = [...new Set(sourceData?.map(item => item.source).filter(Boolean))] || [];
  const sourceOptions = [{ value: "", label: "All Sources" }, ...uniqueSources.map(source => ({ value: source, label: source }))];

  const statusChartData = {
    labels: statusData?.map((item) => item.status) || [],
    datasets: [
      {
        label: "Job Status Distribution",
        data: statusData?.map((item) => item.count) || [],
        backgroundColor: [
          "rgba(255, 99, 132, 0.6)",
          "rgba(54, 162, 235, 0.6)",
          "rgba(255, 206, 86, 0.6)",
          "rgba(75, 192, 192, 0.6)",
          "rgba(153, 102, 255, 0.6)",
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(153, 102, 255, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  const sourceChartData = {
    labels: sourceData?.map((item) => item.source || "Unknown") || [],
    datasets: [
      {
        label: "Applications by Source",
        data: sourceData?.map((item) => item.count) || [],
        backgroundColor: [
          "#4CAF50",
          "#2196F3",
          "#FFC107",
          "#FF5722",
          "#9C27B0",
          "#00BCD4",
          "#8BC34A",
          "#CDDC39",
          "#FFEB3B",
          "#FF9800",
          "#F44336",
          "#E91E63",
        ],
        borderColor: "#fff",
        borderWidth: 1,
      },
    ],
  };

  const timeChartData = {
    labels: timeData?.map((item) => item.date) || [],
    datasets: [
      {
        label: "Applications Over Time",
        data: timeData?.map((item) => item.count) || [],
        backgroundColor: "rgba(75, 192, 192, 0.6)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const successRateChartData = {
    labels: successRateData?.map((item) => item.stage) || [],
    datasets: [
      {
        label: "Success Rate",
        data: successRateData?.map((item) => item.rate) || [],
        backgroundColor: [
          "rgba(60, 179, 113, 0.6)",
          "rgba(255, 165, 0, 0.6)",
          "rgba(100, 149, 237, 0.6)",
        ],
        borderColor: [
          "rgba(60, 179, 113, 1)",
          "rgba(255, 165, 0, 1)",
          "rgba(100, 149, 237, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: "top", labels: { font: { size: 12 } } },
      title: { display: true, text: "Analytics Data", font: { size: 14 } },
    },
    scales: {
      x: { ticks: { font: { size: 10 } } },
      y: { ticks: { font: { size: 10 } } },
    },
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-[95%] mx-auto py-6 sm:px-2"
    >
      <h1 className="text-xl md:text-2xl font-extrabold text-gray-800 mb-6 pb-3">
        Analytics Dashboard
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8 items-end">
        <InputField
          label="Filter by Job Title"
          placeholder="e.g., Software Engineer"
          value={jobTitleFilter}
          onChange={(e) => setJobTitleFilter(e.target.value)}
          className="w-full"
        />
        <InputField
          label="Filter by Company"
          placeholder="e.g., Google"
          value={companyFilter}
          onChange={(e) => setCompanyFilter(e.target.value)}
          className="w-full"
        />
        <CustomDropdown
          label="Filter by Source"
          options={sourceOptions}
          value={sourceFilter}
          onChange={setSourceFilter}
          className="w-full"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        <div className="border border-rose-300/20 p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
          <h2 className="text-xl font-bold text-gray-700 mb-4">
            Job Status Distribution
          </h2>
          <div className="h-80">
            <Pie
              data={statusChartData}
              options={{
                ...chartOptions,
                plugins: {
                  ...chartOptions.plugins,
                  title: { display: false },
                },
              }}
            />
          </div>
        </div>

        <div className="border border-rose-300/20 p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
          <h2 className="text-xl font-bold text-gray-700 mb-4">
            Applications by Source
          </h2>
          <div className="h-80">
            <Bar
              data={sourceChartData}
              options={{
                ...chartOptions,
                plugins: {
                  ...chartOptions.plugins,
                  title: { display: false },
                },
              }}
            />
          </div>
        </div>

        <div className="border border-rose-300/20 p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 lg:col-span-2 xl:col-span-1">
          <h2 className="text-xl font-bold text-gray-700 mb-4">
            Application Success Rates
          </h2>
          <div className="h-80">
            <Bar
              data={successRateChartData}
              options={{
                ...chartOptions,
                plugins: {
                  ...chartOptions.plugins,
                  title: { display: false },
                },
              }}
            />
          </div>
        </div>

        <div className="border border-rose-300/20 p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 lg:col-span-2 xl:col-span-3">
          <h2 className="text-xl font-bold text-gray-700 mb-4">
            Applications Over Time (
            {timeframe.charAt(0).toUpperCase() + timeframe.slice(1)})
          </h2>
          <div className="h-96">
            <Line
              data={timeChartData}
              options={{
                ...chartOptions,
                plugins: {
                  ...chartOptions.plugins,
                  title: { display: false },
                },
              }}
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default AnalyticsDashboard;