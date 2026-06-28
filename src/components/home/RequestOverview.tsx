"use client";

import { useEffect, useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { TrendingUp } from "lucide-react";
import { fetchUrl } from "@/lib/fetchUrl";
import { formatShortDate } from "@/lib/formatTeeTime";

interface OverviewRow {
  name: string;
  requests: number;
  confirmed: number;
}

const RequestOverview = () => {
  const [mounted, setMounted] = useState(false);
  const [data, setData] = useState<OverviewRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setMounted(true);
    fetchUrl("/dashboard/requests-overview")
      .then((res) => setData(res.data.map((row: OverviewRow) => ({ ...row, name: formatShortDate(row.name) }))))
      .catch(() => setData([]))
      .finally(() => setIsLoading(false));
  }, []);

  const totalThisWeek = data.reduce((sum, row) => sum + row.requests, 0);

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col h-full">
      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Requests Overview</h2>
          <p className="text-sm text-gray-400">Last 7 days</p>
        </div>
        <div className="flex items-center gap-2 bg-[#eefaf3] text-[#2ea268] px-3 py-1.5 rounded-full text-xs font-semibold">
          <TrendingUp className="w-3.5 h-3.5" />
          <span>{isLoading ? "..." : `${totalThisWeek} this week`}</span>
        </div>
      </div>

      {/* Chart */}
      <div className="h-[300px] w-full">
        {!mounted || isLoading ? (
          <div className="w-full h-full min-h-[300px] bg-gray-50/50 animate-pulse rounded-lg flex items-center justify-center text-gray-300" />
        ) : data.length === 0 ? (
          <div className="w-full h-full min-h-[300px] flex items-center justify-center text-sm text-gray-400">
            No requests in the last 7 days.
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
            <AreaChart
              data={data}
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorRequests" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#142d22" stopOpacity={0.1} />
                  <stop offset="95%" stopColor="#142d22" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="#f1f5f9"
              />
              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#94a3b8", fontSize: 12 }}
                dy={10}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#94a3b8", fontSize: 12 }}
                allowDecimals={false}
              />
              <Tooltip
                contentStyle={{
                  borderRadius: "12px",
                  border: "none",
                  boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
                }}
              />
              <Area
                type="monotone"
                dataKey="requests"
                name="Requests"
                stroke="#142d22"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorRequests)"
              />
              <Area
                type="monotone"
                dataKey="confirmed"
                name="Confirmed"
                stroke="#142d22"
                strokeOpacity={0.4}
                strokeWidth={2}
                fill="transparent"
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-6 mt-6">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full border-2 border-[#142d22] flex items-center justify-center">
            <div className="w-1 h-1 rounded-full bg-[#142d22]"></div>
          </div>
          <span className="text-sm font-medium text-[#2ea268]">Requests</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full border-2 border-[#142d22]/40 flex items-center justify-center">
            <div className="w-1 h-1 rounded-full bg-[#142d22]/40"></div>
          </div>
          <span className="text-sm font-medium text-[#142d22]/70">Confirmed</span>
        </div>
      </div>
    </div>
  );
};

export default RequestOverview;
