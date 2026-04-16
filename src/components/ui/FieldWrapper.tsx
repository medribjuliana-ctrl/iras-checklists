"use client";

interface FieldWrapperProps {
  label: string;
  required?: boolean;
  hint?: string;
  children: React.ReactNode;
}

export default function FieldWrapper({ label, required, hint, children }: FieldWrapperProps) {
  return (
    <div className="space-y-1.5">
      <div>
        <span className="text-sm font-semibold text-gray-800">{label}</span>
        {required && <span className="text-red-500 ml-1">*</span>}
        {hint && <p className="text-xs text-gray-500 mt-0.5">{hint}</p>}
      </div>
      {children}
    </div>
  );
}
