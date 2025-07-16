import { useState } from "react";
import { Outlet } from "react-router-dom";
import Header from "../Header";
import Sidebar from "../Sidebar";

export default function Layout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <div className="min-h-screen bg-[var(--bg)] flex flex-col">
      <Header toggleSidebar={toggleSidebar} />
      <div className="flex w-full">
        <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
        <main className="flex-1 max-w-[95%] mx-auto px-1 py-4">
          <Outlet />
        </main>
      </div>
    </div>
  );
}