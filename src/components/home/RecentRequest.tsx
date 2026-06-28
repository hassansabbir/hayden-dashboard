"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Calendar,
  Clock,
  Users,
  ChevronRight,
  CheckCircle2,
  Clock3,
  XCircle,
  Ban,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { fetchUrl } from "@/lib/fetchUrl";
import { formatShortDate, formatTime12h } from "@/lib/formatTeeTime";

type Status = "Pending" | "Confirmed" | "Declined" | "Cancelled";

interface RequestItem {
  id: string;
  name: string;
  avatar: string;
  date: string;
  time: string;
  players: number;
  status: Status;
}

const statusStyle: Record<Status, string> = {
  Confirmed: "bg-green-50 text-green-600 border-green-100",
  Pending: "bg-orange-50 text-orange-600 border-orange-100",
  Declined: "bg-red-50 text-red-600 border-red-100",
  Cancelled: "bg-gray-100 text-gray-400 border-gray-200",
};

const statusIcon: Record<Status, React.ReactNode> = {
  Confirmed: <CheckCircle2 className="w-3 h-3" />,
  Pending: <Clock3 className="w-3 h-3" />,
  Declined: <XCircle className="w-3 h-3" />,
  Cancelled: <Ban className="w-3 h-3" />,
};

const toTitleCase = (status: string): Status => {
  const lower = status.toLowerCase();
  return (lower.charAt(0).toUpperCase() + lower.slice(1)) as Status;
};

const getInitials = (name: string) =>
  name.split(" ").filter(Boolean).slice(0, 2).map((p) => p[0]?.toUpperCase()).join("") || "?";

const RecentRequest = () => {
  const [requests, setRequests] = useState<RequestItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchUrl("/bookings?limit=5")
      .then((res) => {
        const items: RequestItem[] = res.data.map((b: any) => ({
          id: b.bookingId,
          name: b.contact?.fullName ?? "Unknown",
          avatar: getInitials(b.contact?.fullName ?? "?"),
          date: b.teeTime?.date ? formatShortDate(b.teeTime.date) : "—",
          time: b.teeTime?.startTime ? formatTime12h(b.teeTime.startTime) : "—",
          players: b.players,
          status: toTitleCase(b.status),
        }));
        setRequests(items);
      })
      .catch(() => setRequests([]))
      .finally(() => setIsLoading(false));
  }, []);

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
        {isLoading ? (
          <div className="flex items-center justify-center gap-2 text-gray-400 py-12">
            <Loader2 className="w-4 h-4 animate-spin" />
            Loading requests...
          </div>
        ) : requests.length === 0 ? (
          <div className="text-center text-gray-400 py-12">No requests yet.</div>
        ) : (
          requests.map((request) => (
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
                    <span>{request.date}</span>
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
          ))
        )}
      </div>
    </div>
  );
};

export default RecentRequest;
