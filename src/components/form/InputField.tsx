/* eslint-disable @typescript-eslint/no-explicit-any */
import { FieldError, UseFormRegister } from "react-hook-form";

type InputFieldProps = {
  name: string;
  title?: string;
  placeholder?: string;
  type?: string;
  register: UseFormRegister<any>;
  error?: FieldError;
};

const InputField = ({
  title,
  name,
  placeholder,
  type = "text",
  register,
  error,
}: InputFieldProps) => {
  return (
    <div className="space-y-3">
      {title && <label className="block text-[11px] font-bold tracking-widest text-[#9CA3AF] uppercase mb-2">{title}</label>}
      <div className="relative group">
        <input
          {...register(name)}
          type={type}
          placeholder={placeholder}
          className={`w-full rounded-lg bg-white border border-slate-200 px-6 py-3 text-[14px] text-gray-600 outline-none transition-all placeholder:text-[#9CA3AF] focus:border-[#0b3b0b]/40 focus:bg-white`}
        />

        {error && (
          <p className="text-sm font-medium text-red-500 mt-2 px-1">
            {error.message}
          </p>
        )}
      </div>
    </div>
  );
};

export default InputField;