import type { Metadata } from "next";
import ForgotPassword from "./ForgotPassword";

export const metadata: Metadata = {
  title: "Forgot Password | Tee-It-Up Admin",
};

export default function ForgotPasswordPage() {
  return <ForgotPassword />;
}
