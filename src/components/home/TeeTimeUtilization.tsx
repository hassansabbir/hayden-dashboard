"use client";

import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { fetchUrl } from "@/lib/fetchUrl";
import { formatShortDate } from "@/lib/formatTeeTime";

interface UtilizationRow {
  name: string;
  booked: number;
  available: number;
}

const TeeTimeUtilization = () => {
  const [data, setData] = useState<UtilizationRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchUrl("/dashboard/tee-time-utilization")
      .then((res) => setData(res.data.map((row: UtilizationRow) => ({ ...row, name: formatShortDate(row.name) }))))
      .catch(() => setData([]))
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col h-full">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-900">Tee Time Utilization</h2>
        <p className="text-sm text-gray-400">Booked vs available slots, next 7 days</p>
      </div>

      <div className="h-[260px] w-full">
        {isLoading ? (
          <div className="w-full h-full bg-gray-50/50 animate-pulse rounded-lg" />
        ) : data.length === 0 ? (
          <div className="w-full h-full flex items-center justify-center text-sm text-gray-400">
            No tee times scheduled for the next 7 days.
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
            <BarChart
              data={data}
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              barGap={4}
            >
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
              <Legend
                iconType="circle"
                wrapperStyle={{ fontSize: 12, paddingTop: 16 }}
              />
              <Bar
                dataKey="booked"
                name="Booked"
                fill="#142d22"
                radius={[6, 6, 0, 0]}
              />
              <Bar
                dataKey="available"
                name="Available"
                fill="#2ea268"
                radius={[6, 6, 0, 0]}
                fillOpacity={0.35}
              />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};

export default TeeTimeUtilization;
