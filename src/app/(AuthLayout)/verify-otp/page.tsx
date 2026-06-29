import type { Metadata } from "next";
import VerifyOtp from "./VerifyOtp";

export const metadata: Metadata = {
  title: "Verify OTP | Tee-It-Up Admin",
};

export default function VerifyOtpPage() {
  return <VerifyOtp />;
}
