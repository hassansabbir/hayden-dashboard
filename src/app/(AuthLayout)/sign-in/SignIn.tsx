"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import InputField from "@/components/form/InputField";
import InputFieldPassword from "@/components/form/InputFieldPassword";
import { useAuth } from "@/contexts/AuthContext";

interface SignInFormValues {
  email: string;
  password: string;
}

const SignIn = () => {
  const router = useRouter();
  const { login } = useAuth();
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInFormValues>({
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (data: SignInFormValues) => {
    setFormError(null);
    setIsSubmitting(true);
    const result = await login(data.email, data.password);
    setIsSubmitting(false);

    if (!result.success) {
      setFormError(result.message ?? "Unable to sign in.");
      return;
    }

    router.replace("/");
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
          Welcome back
        </h2>
        <p className="mt-2 text-[#6B7280] text-lg">
          Sign in to manage your club.
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
        <InputFieldPassword
          title="Password"
          name="password"
          placeholder="••••••••"
          register={register}
          error={errors.password}
          isForgotPassword
        />

        {formError && (
          <p className="text-sm font-medium text-red-500">{formError}</p>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="mt-2 w-full rounded-2xl bg-[#142d22] py-4 text-[17px] font-bold text-white transition-all hover:bg-[#1a3a2e] hover:shadow-lg active:scale-[0.99] disabled:opacity-60"
        >
          {isSubmitting ? "Signing in..." : "Sign In"}
        </button>
      </form>

      <div className="mt-8 rounded-xl bg-[#f7fdfa] border border-[#2ea268]/10 p-4 text-xs text-[#4B6548] space-y-1">
        <p className="font-bold uppercase tracking-wider text-[10px] text-[#2ea268]">
          Demo credentials
        </p>
        <p>Admin: admin@teaitup.com / Admin@123</p>
        <p>Club Owner: owner@royalridges.com / Owner@123</p>
      </div>
    </motion.div>
  );
};

export default SignIn;
