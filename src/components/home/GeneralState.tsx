"use client";

import { useEffect, useState } from "react";
import {
  ClipboardList,
  Clock,
  CheckCircle2,
  XCircle
} from "lucide-react";
import { cn } from "@/lib/utils";
import { fetchUrl } from "@/lib/fetchUrl";

interface Stats {
  total: number;
  pending: number;
  confirmed: number;
  declined: number;
}

const CARD_CONFIG = [
  { key: "total" as const, title: "Total Requests", icon: ClipboardList, borderColor: "border-l-[#3b82f6]", iconBg: "bg-blue-50", iconColor: "text-blue-500" },
  { key: "pending" as const, title: "Pending", icon: Clock, borderColor: "border-l-[#f59e0b]", iconBg: "bg-orange-50", iconColor: "text-orange-500" },
  { key: "confirmed" as const, title: "Confirmed", icon: CheckCircle2, borderColor: "border-l-[#10b981]", iconBg: "bg-green-50", iconColor: "text-green-500" },
  { key: "declined" as const, title: "Declined", icon: XCircle, borderColor: "border-l-[#ef4444]", iconBg: "bg-red-50", iconColor: "text-red-500" },
];

const GeneralState = () => {
  const [stats, setStats] = useState<Stats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchUrl("/dashboard/stats")
      .then((res) => setStats(res.data))
      .catch(() => setStats({ total: 0, pending: 0, confirmed: 0, declined: 0 }))
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {CARD_CONFIG.map((card) => (
        <div
          key={card.key}
          className={cn(
            "bg-white p-6 rounded-2xl border-l-[6px] shadow-sm flex items-center justify-between transition-all hover:shadow-md",
            card.borderColor
          )}
        >
          <div className="flex flex-col gap-1">
            <span className="text-sm font-medium text-gray-500">{card.title}</span>
            <span className="text-3xl font-bold text-gray-900">
              {isLoading ? "—" : stats?.[card.key] ?? 0}
            </span>
          </div>
          <div className={cn("p-3 rounded-2xl shrink-0", card.iconBg)}>
            <card.icon className={cn("w-6 h-6", card.iconColor)} />
          </div>
        </div>
      ))}
    </div>
  );
};

export default GeneralState;
