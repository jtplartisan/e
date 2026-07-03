import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { Outlet } from "react-router-dom";

function DashboardLayout() {
  return (
    <>
      {/* Navbar */}
      <Navbar />

      <div className="flex min-h-screen bg-gray-100">
        {/* Sidebar */}
        <div className="w-64 hidden md:block">
          <Sidebar />
        </div>                  

        {/* Main Content */}
        <div className="flex-1 p-4 md:p-6 overflow-y-auto">
          <Outlet />
        </div>
      </div>
    </>
  );
}

export default DashboardLayout;