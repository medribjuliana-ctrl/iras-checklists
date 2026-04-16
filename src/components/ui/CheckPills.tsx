"use client";

interface CheckPillsProps {
  options: string[];
  values: string[];
  onChange: (vals: string[]) => void;
}

export default function CheckPills({ options, values, onChange }: CheckPillsProps) {
  const toggle = (opt: string) => {
    onChange(
      values.includes(opt) ? values.filter((v) => v !== opt) : [...values, opt]
    );
  };

  return (
    <div className="flex flex-wrap gap-2">
      {options.map((opt) => {
        const checked = values.includes(opt);
        return (
          <button
            key={opt}
            type="button"
            onClick={() => toggle(opt)}
            className={`
              inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full
              text-sm font-medium border-2 transition-all select-none
              ${checked
                ? "border-brand-500 bg-brand-50 text-brand-700"
                : "border-gray-200 bg-white text-gray-500 hover:border-gray-300"
              }
            `}
          >
            <span>{checked ? "✓" : "○"}</span>
            {opt}
          </button>
        );
      })}
    </div>
  );
}
