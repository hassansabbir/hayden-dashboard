"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import Link from "next/link";
import InputField from "@/components/form/InputField";

interface ForgotFormValues {
  email: string;
}

const ForgotPassword = () => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotFormValues>({
    defaultValues: { email: "" },
  });

  const onSubmit = async (data: ForgotFormValues) => {
    setIsSubmitting(true);
    // Mock OTP dispatch until the password-reset API is wired up.
    window.sessionStorage.setItem("reset-email", data.email);
    await new Promise((resolve) => setTimeout(resolve, 500));
    setIsSubmitting(false);
    router.push("/verify-otp");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="w-full max-w-[460px] rounded-[20px] bg-white p-6 lg:p-12 shadow-[0_32px_64px_-12px_rgba(0,0,0,0.06)] border border-gray-100"
    >
      <div className="mb-10">
        <h2 className="text-[36px] font-bold tracking-tight text-[#111827]">
          Forgot Password
        </h2>
        <p className="mt-2 text-[#6B7280] text-lg">
          Enter your email address to receive a verification code.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-7">
        <InputField
          title="Email Address"
          name="email"
          placeholder="name@domain.com"
          register={register}
          error={errors.email}
        />

        <button
          type="submit"
          disabled={isSubmitting}
          className="mt-2 w-full rounded-2xl bg-[#142d22] py-4 text-[17px] font-bold text-white transition-all hover:bg-[#1a3a2e] hover:shadow-lg active:scale-[0.99] disabled:opacity-60"
        >
          {isSubmitting ? "Sending..." : "Get OTP"}
        </button>
        <Link
          href="/sign-in"
          className="text-center text-[#4B6548] block font-semibold hover:text-[#142d22]"
        >
          Back to Sign In
        </Link>
      </form>
    </motion.div>
  );
};

export default ForgotPassword;
