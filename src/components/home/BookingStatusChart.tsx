"use client";

import { useEffect, useState } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { fetchUrl } from "@/lib/fetchUrl";

interface StatusRow {
  name: "Confirmed" | "Pending" | "Declined";
  value: number;
}

const COLOR_BY_STATUS: Record<StatusRow["name"], string> = {
  Confirmed: "#10b981",
  Pending: "#f59e0b",
  Declined: "#ef4444",
};

const BookingStatusChart = () => {
  const [data, setData] = useState<StatusRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchUrl("/dashboard/booking-status")
      .then((res) => setData(res.data))
      .catch(() => setData([]))
      .finally(() => setIsLoading(false));
  }, []);

  const total = data.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col h-full">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-900">Booking Status</h2>
        <p className="text-sm text-gray-400">Breakdown of all requests</p>
      </div>

      <div className="h-[260px] flex items-center justify-center relative">
        {isLoading ? (
          <div className="w-full h-full bg-gray-50/50 animate-pulse rounded-lg" />
        ) : total === 0 ? (
          <p className="text-sm text-gray-400">No requests yet.</p>
        ) : (
          <>
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie
                  data={data}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={70}
                  outerRadius={100}
                  paddingAngle={3}
                  strokeWidth={0}
                >
                  {data.map((entry) => (
                    <Cell key={entry.name} fill={COLOR_BY_STATUS[entry.name]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    borderRadius: "12px",
                    border: "none",
                    boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute flex flex-col items-center pointer-events-none">
              <span className="text-3xl font-bold text-gray-900">{total}</span>
              <span className="text-xs text-gray-400 uppercase tracking-wider">
                Total
              </span>
            </div>
          </>
        )}
      </div>

      {!isLoading && total > 0 && (
        <div className="flex items-center justify-center gap-6 mt-4">
          {data.map((entry) => (
            <div key={entry.name} className="flex items-center gap-2">
              <div
                className="w-2.5 h-2.5 rounded-full"
                style={{ backgroundColor: COLOR_BY_STATUS[entry.name] }}
              ></div>
              <span className="text-sm font-medium text-gray-500">
                {entry.name}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BookingStatusChart;
