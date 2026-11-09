import type { ReactNode } from "react";

// Shared input style for every admin form
export const inputClass =
  "h-11 w-full rounded-xl border border-line bg-white px-3.5 text-[15px] outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/30";

export const errorBorder = (hasError: boolean) =>
  hasError ? "border-red-500 focus:border-red-500 focus:ring-red-200" : "";

type Props = {
  label: string;
  error?: string;
  hint?: string;
  required?: boolean;
  children: ReactNode;
};

export default function FormField({ label, error, hint, required, children }: Props) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-semibold text-ink">
        {label} {required && <span className="text-red-600">*</span>}
      </span>
      {children}
      {error ? (
        <span className="mt-1 block text-xs text-red-600">{error}</span>
      ) : (
        hint && <span className="mt-1 block text-xs text-muted">{hint}</span>
      )}
    </label>
  );
}