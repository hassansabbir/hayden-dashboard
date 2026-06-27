"use client";

import React from "react";
import Link from "next/link";
import {
  Calendar,
  Clock,
  Users,
  ChevronRight,
  CheckCircle2,
  Clock3,
  XCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";

type Status = "Pending" | "Confirmed" | "Declined";

interface RequestItem {
  id: string;
  name: string;
  avatar: string;
  date: string;
  time: string;
  players: number;
  status: Status;
}

const recentRequests: RequestItem[] = [
  { id: "REQ005", name: "Sarah Miller", avatar: "SM", date: "Apr 25, 2026", time: "09:00 AM", players: 4, status: "Pending" },
  { id: "REQ004", name: "Grace Lee", avatar: "GL", date: "Apr 24, 2026", time: "08:00 AM", players: 4, status: "Confirmed" },
  { id: "REQ003", name: "Robert Kim", avatar: "RK", date: "Apr 22, 2026", time: "07:00 AM", players: 1, status: "Confirmed" },
  { id: "REQ006", name: "James Bond", avatar: "JB", date: "Apr 20, 2026", time: "06:00 AM", players: 1, status: "Declined" },
  { id: "REQ002", name: "Emma Wilson", avatar: "EW", date: "Apr 19, 2026", time: "11:00 AM", players: 3, status: "Confirmed" },
];

const statusStyle: Record<Status, string> = {
  Confirmed: "bg-green-50 text-green-600 border-green-100",
  Pending: "bg-orange-50 text-orange-600 border-orange-100",
  Declined: "bg-red-50 text-red-600 border-red-100",
};

const statusIcon: Record<Status, React.ReactNode> = {
  Confirmed: <CheckCircle2 className="w-3 h-3" />,
  Pending: <Clock3 className="w-3 h-3" />,
  Declined: <XCircle className="w-3 h-3" />,
};

const RecentRequest = () => {
  return (
    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="px-6 py-5 border-b border-gray-50 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Recent Requests</h2>
          <p className="text-sm text-gray-400">Latest booking activity</p>
        </div>
        <Link
          href="/requests"
          className="flex items-center gap-1 text-sm font-semibold text-[#2ea268] hover:gap-2 transition-all"
        >
          View all
          <ChevronRight className="w-4 h-4" />
        </Link>
      </div>

      <div className="flex flex-col">
        {recentRequests.map((request) => (
          <Link
            key={request.id}
            href="/requests"
            className="flex items-center gap-4 px-6 py-4 hover:bg-gray-50 transition-all border-b border-gray-50 last:border-0"
          >
            <div className="w-11 h-11 rounded-full bg-[#eefaf3] flex items-center justify-center text-[#2ea268] font-bold shrink-0">
              {request.avatar}
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-gray-900">{request.name}</h3>
              <div className="flex items-center gap-4 mt-1 text-sm text-gray-400">
                <div className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{request.date.split(",")[0]}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{request.time}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Users className="w-3.5 h-3.5" />
                  <span>{request.players}</span>
                </div>
              </div>
            </div>
            <span
              className={cn(
                "px-3 py-1 rounded-full text-xs font-bold border flex items-center gap-1.5 shrink-0",
                statusStyle[request.status]
              )}
            >
              {statusIcon[request.status]}
              {request.status}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default RecentRequest;
