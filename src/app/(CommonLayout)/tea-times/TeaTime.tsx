"use client";

import {
  Upload,
  Filter,
  Calendar,
  Pencil,
  Trash2
} from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";

const teeTimesData = [
  { id: 1, date: "Sat, Apr 18, 2026", time: "07:00 AM", available: 4, total: 4 },
  { id: 2, date: "Sat, Apr 18, 2026", time: "07:30 AM", available: 2, total: 4 },
  { id: 3, date: "Sat, Apr 18, 2026", time: "08:00 AM", available: 0, total: 4 },
  { id: 4, date: "Sat, Apr 18, 2026", time: "08:30 AM", available: 3, total: 4 },
  { id: 5, date: "Sat, Apr 18, 2026", time: "09:00 AM", available: 4, total: 4 },
  { id: 6, date: "Sat, Apr 18, 2026", time: "09:30 AM", available: 1, total: 4 },
  { id: 7, date: "Sun, Apr 19, 2026", time: "07:00 AM", available: 2, total: 4 },
  { id: 8, date: "Sun, Apr 19, 2026", time: "07:30 AM", available: 4, total: 4 },
  { id: 9, date: "Sun, Apr 19, 2026", time: "08:00 AM", available: 3, total: 4 },
];

const allClubsTeeTimesData = [
  { id: 1, club: "The Royal Ridges Estate", date: "Sat, Apr 18, 2026", time: "07:00 AM", available: 4, total: 4 },
  { id: 2, club: "The Royal Ridges Estate", date: "Sat, Apr 18, 2026", time: "08:00 AM", available: 0, total: 4 },
  { id: 3, club: "Pinecrest Valley Links", date: "Sat, Apr 18, 2026", time: "07:30 AM", available: 2, total: 4 },
  { id: 4, club: "Pinecrest Valley Links", date: "Sun, Apr 19, 2026", time: "09:00 AM", available: 1, total: 4 },
  { id: 5, club: "Silver Oak Shores", date: "Sun, Apr 19, 2026", time: "07:00 AM", available: 3, total: 4 },
  { id: 6, club: "Silver Oak Shores", date: "Sun, Apr 19, 2026", time: "08:30 AM", available: 4, total: 4 },
  { id: 7, club: "Cedar Hollow Country Club", date: "Mon, Apr 20, 2026", time: "07:00 AM", available: 2, total: 4 },
];

const AvailabilityCell = ({ available, total }: { available: number; total: number }) => {
  const percentage = (available / total) * 100;
  const isFull = available === 0;
  const isLow = available === 1;

  return (
    <td className="px-6 py-5 min-w-[200px]">
      <div className="flex items-center gap-3">
        <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
          <div
            className={cn(
              "h-full rounded-full transition-all duration-500",
              isFull ? "bg-red-50" : isLow ? "bg-orange-500" : "bg-[#2ea268]"
            )}
            style={{ width: `${isFull ? 100 : percentage}%` }}
          ></div>
        </div>
        {isFull && <span className="text-[10px] font-bold text-red-500 uppercase tracking-wider">Full</span>}
      </div>
    </td>
  );
};

const SlotCell = ({ available, total }: { available: number; total: number }) => {
  const isFull = available === 0;
  const isLow = available === 1;

  return (
    <td className="px-6 py-5 text-center">
      <span className={cn(
        "font-bold",
        isFull ? "text-red-500" : isLow ? "text-orange-500" : "text-[#2ea268]"
      )}>
        {available}
      </span>
      <span className="text-gray-300 ml-1">/ {total}</span>
    </td>
  );
};

const TeaTime = () => {
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";

  return (
    <div className="flex flex-col gap-8 p-6 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Tee Times</h1>
          <p className="text-gray-500 mt-1">
            {isAdmin
              ? `${allClubsTeeTimesData.length} slots across all clubs`
              : "15 total slots across all dates"}
          </p>
        </div>
        {!isAdmin && (
          <Link href="/tea-times/add-tea-times" className="bg-[#142d22] hover:bg-[#1a3a2e] text-white px-6 py-2.5 rounded-xl flex items-center gap-2 transition-all shadow-lg shadow-[#142d22]/20 font-medium">
            <Upload className="w-5 h-5" />
            <span>Upload Tee Times</span>
          </Link>
        )}
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-gray-400">
            <Filter className="w-4 h-4" />
            <span className="text-sm font-medium">Filter by:</span>
          </div>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
            <input
              type="text"
              placeholder="Select date"
              className="pl-10 pr-4 py-2 bg-gray-50 border-none rounded-xl text-sm w-48 focus:ring-2 focus:ring-[#2ea268]/20 transition-all outline-none"
            />
          </div>
        </div>
        <span className="text-sm text-gray-400">
          Showing {isAdmin ? allClubsTeeTimesData.length : 15} of {isAdmin ? allClubsTeeTimesData.length : 15}
        </span>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-gray-50 bg-gray-50/50">
              {isAdmin && (
                <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Club</th>
              )}
              <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Date</th>
              <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Time</th>
              <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider text-center">Available Slots</th>
              <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Availability</th>
              {!isAdmin && (
                <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider text-right">Actions</th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {isAdmin
              ? allClubsTeeTimesData.map((slot) => (
                  <tr key={slot.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-5 text-gray-900 font-bold">{slot.club}</td>
                    <td className="px-6 py-5 text-gray-500 font-medium">{slot.date}</td>
                    <td className="px-6 py-5 text-gray-900 font-bold">{slot.time}</td>
                    <SlotCell available={slot.available} total={slot.total} />
                    <AvailabilityCell available={slot.available} total={slot.total} />
                  </tr>
                ))
              : teeTimesData.map((slot) => (
                  <tr key={slot.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-5 text-gray-500 font-medium">{slot.date}</td>
                    <td className="px-6 py-5 text-gray-900 font-bold">{slot.time}</td>
                    <SlotCell available={slot.available} total={slot.total} />
                    <AvailabilityCell available={slot.available} total={slot.total} />
                    <td className="px-6 py-5">
                      <div className="flex items-center justify-end gap-2">
                        <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-100 text-gray-500 hover:bg-gray-50 hover:text-gray-900 transition-all text-xs font-bold">
                          <Pencil className="w-3.5 h-3.5" />
                          Edit
                        </button>
                        <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-all text-xs font-bold">
                          <Trash2 className="w-3.5 h-3.5" />
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TeaTime;
