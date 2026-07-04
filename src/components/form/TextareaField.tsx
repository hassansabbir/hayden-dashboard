import { TextareaHTMLAttributes } from "react";

type TextareaFieldProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  name: string;
  title: string;
  error?: any;
  register?: any;
};

const TextareaField = ({
  title,
  name,
  error,
  rows = 4,
  className = "",
  register,
  ...props
}: TextareaFieldProps) => {
  const { ref: rhfRef, ...formProps } = register
    ? register(name)
    : ({ ref: undefined } as { ref: undefined });

  const errorMessage = error?.message || error;

  return (
    <div className="space-y-3">
      <label className="block text-[11px] font-bold tracking-widest text-[#9CA3AF] uppercase">
        {title}
      </label>
      <div className="relative group">
        <textarea
          name={name}
          rows={rows}
          {...props}
          {...formProps}
          ref={rhfRef}
          className={`w-full bg-white border rounded-lg py-3 px-6 text-[14px] text-gray-600 placeholder:text-gray-400 outline-none transition-all focus:border-[#0B3B0B]/40 focus:bg-white ${
            errorMessage ? "border-red-400 bg-red-50/30" : "border-slate-200"
          } ${className}`}
        />
        {errorMessage && typeof errorMessage === "string" && (
          <p className="text-sm font-medium text-red-500 mt-2 px-1">{errorMessage}</p>
        )}
      </div>
    </div>
  );
};

export default TextareaField;