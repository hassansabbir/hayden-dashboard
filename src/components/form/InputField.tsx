import { InputHTMLAttributes, useCallback } from "react";

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
  // register() returns { ref, name, onChange, onBlur }.
  // We destructure `ref` out so it isn't shadowed by a second JSX `ref` prop.
  // RHF uses this ref to read the DOM input's current value on submit —
  // if it's missing the form values will be stale (defaultValues only).
  const { ref: rhfRef, ...formProps } = register
    ? register(name, rules)
    : ({ ref: undefined } as { ref: undefined });

  const errorMessage = error?.message || error;

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const mergedRef = useCallback((el: HTMLInputElement | null) => {
    if (typeof rhfRef === "function") {
      rhfRef(el);
    }
  }, [rhfRef]);

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
          ref={rhfRef ? mergedRef : undefined}
          // A focused <input type="number"> silently changes value when the
          // page is scrolled with the cursor over it (Chrome/Edge default
          // behavior) — blur on wheel so scrolling past it on a long form
          // never mutates whatever the user actually typed.
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