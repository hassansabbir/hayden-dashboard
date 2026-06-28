"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { fetchUrl } from "@/lib/fetchUrl";
import { toast } from "sonner";

const OTP_LENGTH = 6;

const VerifyOtp = () => {
  const router = useRouter();
  const [digits, setDigits] = useState<string[]>(Array(OTP_LENGTH).fill(""));
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (index: number, value: string) => {
    const char = value.replace(/\D/g, "").slice(-1);
    const next = [...digits];
    next[index] = char;
    setDigits(next);

    if (char && index < OTP_LENGTH - 1) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Backspace" && !digits[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const code = digits.join("");

    if (code.length !== OTP_LENGTH) {
      setError("Enter the full 6-digit code.");
      return;
    }

    const email = window.sessionStorage.getItem("reset-email");
    if (!email) {
      setError("Email session expired. Please request a new code.");
      return;
    }

    setError(null);
    setIsSubmitting(true);
    try {
      const response = await fetchUrl("/auth/verify-otp", {
        method: "POST",
        body: { email, otp: code },
      });
      const resetTicket = response.data?.resetTicket;
      if (resetTicket) {
        window.sessionStorage.setItem("reset-ticket", resetTicket);
        toast.success("OTP verified! Please set your new password.");
        router.push("/reset-password");
      } else {
        const errMsg = "Invalid OTP response received.";
        setError(errMsg);
        toast.error(errMsg);
      }
    } catch (err: any) {
      const errMsg = err.message || "Invalid OTP code.";
      setError(errMsg);
      toast.error(errMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="w-full max-w-[460px] rounded-[20px] bg-white p-6 lg:p-12 shadow-[0_32px_64px_-12px_rgba(0,0,0,0.06)] border border-gray-100"
    >
      <div className="mb-10 text-center">
        <h2 className="text-[36px] font-bold tracking-tight text-[#111827]">
          Verify OTP
        </h2>
        <p className="mt-2 text-[#6B7280] text-lg">
          Enter the 6-digit code sent to your email.
        </p>
      </div>

      <form onSubmit={onSubmit} className="space-y-8">
        <div className="flex justify-center gap-2 sm:gap-3">
          {digits.map((digit, index) => (
            <input
              key={index}
              ref={(el) => {
                inputsRef.current[index] = el;
              }}
              value={digit}
              disabled={isSubmitting}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              inputMode="numeric"
              maxLength={1}
              className="size-12 sm:size-14 rounded-xl border-2 border-gray-200 text-center text-xl font-bold text-[#111827] outline-none focus:border-[#2ea268] transition-colors disabled:opacity-60"
            />
          ))}
        </div>

        {error && (
          <p className="text-sm font-medium text-red-500 text-center">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-2xl bg-[#142d22] py-4 text-[17px] font-bold text-white transition-all hover:bg-[#1a3a2e] hover:shadow-lg active:scale-[0.99] disabled:opacity-60"
        >
          {isSubmitting ? "Verifying..." : "Continue"}
        </button>
      </form>
    </motion.div>
  );
};

export default VerifyOtp;
