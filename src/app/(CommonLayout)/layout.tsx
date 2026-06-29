"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";
import ForcePasswordReset from "@/components/auth/ForcePasswordReset";
import { useAuth } from "@/contexts/AuthContext";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.replace("/sign-in");
    }
  }, [isLoading, user, router]);

  // While session is being restored or user just logged in and state is
  // propagating, show a neutral loading screen — do NOT redirect yet.
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f8fafc] text-gray-400">
        Loading...
      </div>
    );
  }

  // After loading is complete, if there is still no user the useEffect above
  // will redirect. Render nothing in the meantime to avoid a flash.
  if (!user) {
    return null;
  }

  if (user.mustResetPassword) {
    return <ForcePasswordReset />;
  }

  return (
    <div className="flex min-h-screen bg-[#f8fafc]">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  );
}