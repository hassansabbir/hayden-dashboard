import type { Metadata } from "next";
import ResetPassword from "./ResetPassword";

export const metadata: Metadata = {
  title: "Reset Password | Tea-It-Up Admin",
};

export default function ResetPasswordPage() {
  return <ResetPassword />;
}
