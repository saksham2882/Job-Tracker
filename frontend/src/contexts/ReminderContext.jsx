import { createContext, useContext, useState, useEffect, useCallback } from "react";
import api from "../api/api";
import toast from "react-hot-toast";
import { AuthContext } from "../contexts/AuthContext";

export const ReminderContext = createContext();

export const ReminderProvider = ({ children }) => {
  const { authUser } = useContext(AuthContext);
  const [notifications, setNotifications] = useState([]);
  const [isTabActive, setIsTabActive] = useState(true);


  // Fetch notifications 
  const fetchNotifications = useCallback(async () => {
    if (!authUser) return [];
    try {
      const res = await api.get("/notifications");
      setNotifications(res.data);
      return res.data;
    } catch (err) {
        if (err.response?.status !== 401) {
          toast.error("Failed to load notifications");
        }
      return [];
    }
  }, [authUser]);


  // Handle tab visibility changes
  useEffect(() => {
    const handleVisibilityChange = () => {
      setIsTabActive(document.visibilityState === "visible");
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);


  // Polling logic
  useEffect(() => {
    if (!authUser) return;
    fetchNotifications();

    if (!isTabActive) return;

    const interval = setInterval(() => {
      if (isTabActive && authUser) {
        fetchNotifications();
      }
    }, 60000);

    return () => clearInterval(interval);
  }, [fetchNotifications, isTabActive, authUser]);


  // Mark notification as read
  const markNotificationAsRead = async (id) => {
    if (!authUser) return;
    try {
      await api.put(`/notifications/${id}/read`);
      setNotifications((prev) => prev.map((notify) => notify._id === id ? { ...notify, isRead: true } : notify ));
      toast.success("Notification marked as read");
      fetchNotifications();
    } catch (err) {
      toast.error("Failed to mark notification as read");
    }
  };


  // Delete notification
  const deleteNotification = async (id) => {
    if (!authUser) return false;
    try {
      await api.delete(`/notifications/${id}`);
      setNotifications((prev) => prev.filter((notify) => notify._id !== id));
      toast.success("Notification deleted");
      fetchNotifications();
      return true;
    } catch (err) {
      toast.error("Failed to delete notification");
      return false;
    }
  };


  // Toggle reminder for a job
  const toggleReminder = async (job, setJobs, setState, desiredReminderOn) => {
    if (!authUser || !job) return null;
    try {
      const newReminderOn = desiredReminderOn !== undefined ? desiredReminderOn : !job.reminderOn;
      if (!job._id) {
        if (setState) {
          setState(newReminderOn);
          toast.success(`Reminder ${newReminderOn ? "enabled" : "disabled"} locally`);
        }
        return newReminderOn;
      }
      
      const res = await api.patch(`/jobs/${job._id}/reminder`, {
        reminderOn: newReminderOn,
      });
      if (setJobs) {
        setJobs((prevJobs) => prevJobs.map((j) => j._id === job._id ? { ...j, reminderOn: res.data.reminderOn } : j));
      }
      if (setState) {
        setState(res.data.reminderOn);
      }

      toast.success(`Notifications turned ${res.data.reminderOn ? "on" : "off"}`);
      fetchNotifications();
      return res.data.reminderOn;
    } catch (err) {
      toast.error("Failed to toggle notifications");
      return null;
    }
  };

  return (
    <ReminderContext.Provider
      value={{ notifications, fetchNotifications, markNotificationAsRead, deleteNotification, toggleReminder }}
    >
      {children}
    </ReminderContext.Provider>
  );
};

export const useReminder = () => useContext(ReminderContext);