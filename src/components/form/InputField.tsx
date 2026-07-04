import { InputHTMLAttributes } from "react";

type InputFieldProps = InputHTMLAttributes<HTMLInputElement> & {
  name: string;
  title?: string;
  error?: any;
  register?: any;
  rules?: any;
};

const InputField = ({
  title,
  name,
  error,
  type = "text",
  className = "",
  register,
  rules,
  ...props
}: InputFieldProps) => {
  // Destructure `ref` out of register()'s return value so it isn't shadowed
  // by a later JSX prop. In RHF v7 `ref` is already a stable callback ref —
  // pass it directly; no wrapper needed.
  const { ref: rhfRef, ...formProps } = register
    ? register(name, rules)
    : ({ ref: undefined } as { ref: undefined });

  const errorMessage = error?.message || error;

  return (
    <div className="space-y-3">
      {title && (
        <label className="block text-[11px] font-bold tracking-widest text-[#9CA3AF] uppercase mb-2">
          {title}
        </label>
      )}
      <div className="relative group">
        <input
          type={type}
          {...props}
          {...formProps}
          name={name}
          ref={rhfRef}
          onWheel={type === "number" ? (e) => e.currentTarget.blur() : undefined}
          className={`w-full rounded-lg bg-white border border-slate-200 px-6 py-3 text-[14px] text-gray-600 outline-none transition-all placeholder:text-[#9CA3AF] focus:border-[#0b3b0b]/40 focus:bg-white disabled:bg-slate-50 disabled:text-slate-400 disabled:cursor-not-allowed ${className}`}
        />
        {errorMessage && typeof errorMessage === "string" && (
          <p className="text-sm font-medium text-red-500 mt-2 px-1">{errorMessage}</p>
        )}
      </div>
    </div>
  );
};

export default InputField;