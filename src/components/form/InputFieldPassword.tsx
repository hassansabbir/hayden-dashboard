"use client";

import { cn } from "@/lib/utils";
import { useState } from "react";
import { FieldError, UseFormRegister } from "react-hook-form";
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";

type InputFieldPasswordProps = {
  name: string;
  title: string;
  placeholder?: string;
  register: UseFormRegister<any>;
  error?: FieldError;
  inputClassName?: string;
  className?: string;
  isForgotPassword?: boolean;
};

const InputFieldPassword = ({
  title,
  name,
  placeholder,
  register,
  error,
  inputClassName,
  className,
  isForgotPassword
}: InputFieldPasswordProps) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex items-center justify-between">
        <label className="block text-[11px] font-bold tracking-widest text-[#9CA3AF] uppercase">
          {title}
        </label>
        {isForgotPassword && (
          <Link
            href="/forgot-password"
            className="text-[11px] font-bold text-[#064e3b] hover:underline"
          >
            Forgot password?
          </Link>
        )}
      </div>

      <div className="relative group">
        <input
          {...register(name)}
          type={showPassword ? "text" : "password"}
          placeholder={placeholder}
          className={cn(
            "w-full rounded-2xl bg-[#F3F4F6] px-6 py-5 text-base font-medium text-[#111827] outline-none transition-all placeholder:text-[#9CA3AF] border-2 border-transparent focus:border-[#0B3B0B]/10 focus:bg-white",
            inputClassName
          )}
        />

        <button
          type="button"
          onClick={() => setShowPassword((prev) => !prev)}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-[#0DBCBA] transition-colors"
        >
          {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
        </button>
      </div>

      {error && (
        <p className="text-sm font-medium text-red-500 mt-2 px-1">
          {error.message}
        </p>
      )}
    </div>
  );
};

export default InputFieldPassword;