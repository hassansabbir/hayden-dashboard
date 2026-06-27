"use client";

import { useEffect, ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useAuth, Role } from "@/contexts/AuthContext";

const RequireRole = ({ role, children }: { role: Role; children: ReactNode }) => {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user && user.role !== role) {
      router.replace("/");
    }
  }, [user, role, router]);

  if (!user || user.role !== role) {
    return null;
  }

  return <>{children}</>;
};

export default RequireRole;
