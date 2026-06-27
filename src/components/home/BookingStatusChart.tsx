"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

const data = [
  { name: "Confirmed", value: 4, color: "#10b981" },
  { name: "Pending", value: 4, color: "#f59e0b" },
  { name: "Declined", value: 2, color: "#ef4444" },
];

const total = data.reduce((sum, item) => sum + item.value, 0);

const BookingStatusChart = () => {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col h-full">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-900">Booking Status</h2>
        <p className="text-sm text-gray-400">Breakdown of all requests</p>
      </div>

      <div className="h-[260px] flex items-center justify-center relative">
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
                <Cell key={entry.name} fill={entry.color} />
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
      </div>

      <div className="flex items-center justify-center gap-6 mt-4">
        {data.map((entry) => (
          <div key={entry.name} className="flex items-center gap-2">
            <div
              className="w-2.5 h-2.5 rounded-full"
              style={{ backgroundColor: entry.color }}
            ></div>
            <span className="text-sm font-medium text-gray-500">
              {entry.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BookingStatusChart;
