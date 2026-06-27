"use client";

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

const data = [
  { name: "Apr 18", booked: 10, available: 14 },
  { name: "Apr 19", booked: 3, available: 9 },
  { name: "Apr 20", booked: 8, available: 8 },
  { name: "Apr 21", booked: 12, available: 4 },
  { name: "Apr 22", booked: 6, available: 10 },
  { name: "Apr 23", booked: 9, available: 7 },
  { name: "Apr 24", booked: 11, available: 5 },
];

const TeeTimeUtilization = () => {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col h-full">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-900">Tee Time Utilization</h2>
        <p className="text-sm text-gray-400">Booked vs available slots per day</p>
      </div>

      <div className="h-[260px] w-full">
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
      </div>
    </div>
  );
};

export default TeeTimeUtilization;
