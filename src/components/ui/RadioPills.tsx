"use client";

interface RadioPillsProps {
  options: string[];
  value: string | undefined;
  onChange: (val: string) => void;
  variant?: "default" | "yesno" | "cnc";
}

const variantStyles = {
  default: {
    selected: "border-brand-500 bg-brand-50 text-brand-700",
    unselected: "border-gray-200 bg-white text-gray-500 hover:border-gray-300",
  },
  yesno: {
    yes: "border-green-500 bg-green-50 text-green-700",
    no: "border-red-500 bg-red-50 text-red-700",
    unselected: "border-gray-200 bg-white text-gray-500 hover:border-gray-300",
  },
  cnc: {
    C: "border-green-500 bg-green-50 text-green-700",
    NC: "border-red-500 bg-red-50 text-red-700",
    NA: "border-gray-400 bg-gray-50 text-gray-600",
    unselected: "border-gray-200 bg-white text-gray-500 hover:border-gray-300",
  },
};

export default function RadioPills({ options, value, onChange, variant = "default" }: RadioPillsProps) {
  const getStyle = (opt: string, isSelected: boolean) => {
    if (!isSelected) {
      if (variant === "yesno") return variantStyles.yesno.unselected;
      if (variant === "cnc") return variantStyles.cnc.unselected;
      return variantStyles.default.unselected;
    }
    if (variant === "yesno") {
      return opt === "SIM" ? variantStyles.yesno.yes : variantStyles.yesno.no;
    }
    if (variant === "cnc") {
      return (variantStyles.cnc as any)[opt] || variantStyles.cnc.unselected;
    }
    return variantStyles.default.selected;
  };

  return (
    <div className="flex flex-wrap gap-2">
      {options.map((opt) => {
        const isSelected = value === opt;
        return (
          <button
            key={opt}
            type="button"
            onClick={() => onChange(opt)}
            className={`
              inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full
              text-sm font-semibold border-2 transition-all select-none
              ${getStyle(opt, isSelected)}
            `}
          >
            {isSelected && <span>✓</span>}
            {opt}
          </button>
        );
      })}
    </div>
  );
}
