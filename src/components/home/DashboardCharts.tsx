"use client";

import dynamic from "next/dynamic";

const chartSkeleton = (
  <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-full min-h-[372px]">
    <div className="w-full h-full min-h-[300px] bg-gray-50/50 animate-pulse rounded-lg" />
  </div>
);

const BookingStatusChart = dynamic(() => import("./BookingStatusChart"), {
  ssr: false,
  loading: () => chartSkeleton,
});

const TeeTimeUtilization = dynamic(() => import("./TeeTimeUtilization"), {
  ssr: false,
  loading: () => chartSkeleton,
});

const DashboardCharts = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <BookingStatusChart />
      <TeeTimeUtilization />
    </div>
  );
};

export default DashboardCharts;
