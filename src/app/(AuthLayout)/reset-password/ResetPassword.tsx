"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import InputFieldPassword from "@/components/form/InputFieldPassword";
import { fetchUrl } from "@/lib/fetchUrl";
import { toast } from "sonner";

interface ResetFormValues {
  password: string;
  confirmPassword: string;
}

const ResetPassword = () => {
  const router = useRouter();
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetFormValues>({
    defaultValues: { password: "", confirmPassword: "" },
  });

  const onSubmit = async (data: ResetFormValues) => {
    if (data.password !== data.confirmPassword) {
      setFormError("Passwords do not match.");
      return;
    }

    const resetTicket = window.sessionStorage.getItem("reset-ticket");
    if (!resetTicket) {
      setFormError("Reset ticket expired. Please request a new code.");
      return;
    }

    setFormError(null);
    setIsSubmitting(true);
    try {
      await fetchUrl("/auth/reset-password", {
        method: "POST",
        body: { resetTicket, password: data.password },
      });
      
      window.sessionStorage.removeItem("reset-email");
      window.sessionStorage.removeItem("reset-ticket");
      toast.success("Password reset successfully! Please sign in with your new password.");
      router.push("/sign-in");
    } catch (err: any) {
      const errMsg = err.message || "Failed to reset password.";
      setFormError(errMsg);
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
      <div className="mb-10">
        <h2 className="text-[36px] font-bold tracking-tight text-[#111827]">
          Reset Password
        </h2>
        <p className="mt-2 text-[#6B7280] text-lg">
          Enter your new password below.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-7">
        <InputFieldPassword
          title="New Password"
          name="password"
          placeholder="••••••••"
          register={register}
          error={errors.password}
        />
        <InputFieldPassword
          title="Confirm Password"
          name="confirmPassword"
          placeholder="••••••••"
          register={register}
          error={errors.confirmPassword}
        />

        {formError && (
          <p className="text-sm font-medium text-red-500">{formError}</p>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="mt-2 w-full rounded-2xl bg-[#142d22] py-4 text-[17px] font-bold text-white transition-all hover:bg-[#1a3a2e] hover:shadow-lg active:scale-[0.99] disabled:opacity-60"
        >
          {isSubmitting ? "Resetting..." : "Reset Password"}
        </button>
      </form>
    </motion.div>
  );
};

export default ResetPassword;
