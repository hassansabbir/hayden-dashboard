/* eslint-disable @typescript-eslint/no-explicit-any */
import { FieldError, RegisterOptions, UseFormRegister } from "react-hook-form";

type InputFieldProps = {
  name: string;
  title?: string;
  placeholder?: string;
  type?: string;
  register: UseFormRegister<any>;
  error?: FieldError;
  disabled?: boolean;
  rules?: RegisterOptions;
};

const InputField = ({
  title,
  name,
  placeholder,
  type = "text",
  register,
  error,
  disabled,
  rules,
}: InputFieldProps) => {
  return (
    <div className="space-y-3">
      {title && <label className="block text-[11px] font-bold tracking-widest text-[#9CA3AF] uppercase mb-2">{title}</label>}
      <div className="relative group">
        <input
          {...register(name, rules)}
          type={type}
          placeholder={placeholder}
          disabled={disabled}
          // A focused <input type="number"> silently changes value when the
          // page is scrolled with the cursor over it (Chrome/Edge default
          // behavior) — blur on wheel so scrolling past it on a long form
          // never mutates whatever the user actually typed.
          onWheel={type === "number" ? (e) => e.currentTarget.blur() : undefined}
          className={`w-full rounded-lg bg-white border border-slate-200 px-6 py-3 text-[14px] text-gray-600 outline-none transition-all placeholder:text-[#9CA3AF] focus:border-[#0b3b0b]/40 focus:bg-white disabled:bg-slate-50 disabled:text-slate-400 disabled:cursor-not-allowed`}
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