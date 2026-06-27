"use client";

// import { Bell } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";

const Header = () => {
  const { user } = useAuth();

  return (
    <header className="h-20 bg-white border-b border-gray-100 flex items-center justify-between px-8 sticky top-0 z-10">
      <div className="flex items-center gap-4">
        <h2 className="text-xl font-bold text-gray-800">Dashboard</h2>
      </div>

      <div className="flex items-center gap-6">
        <div className="flex items-center gap-3">
          {/* <button className="p-2 hover:bg-gray-100 rounded-full transition-colors relative">
            <Bell className="w-5 h-5 text-gray-600" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
          </button> */}
          {/* <div className="w-px h-6 bg-gray-200 mx-1"></div> */}
          <Link href="/profile" className="flex items-center gap-2 p-1 pr-3 hover:bg-gray-100 rounded-full transition-colors">
            <span className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=100&auto=format&fit=crop"
                alt="User"
                className="w-full h-full object-cover"
              />
            </span>
            <span className="text-sm font-medium text-gray-700">
              {user?.role === "admin" ? "Admin" : user?.name ?? "Club Owner"}
            </span>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;