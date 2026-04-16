"use client";

import { useState, ReactNode } from "react";

interface Step {
  id: string;
  title: string;
  content: ReactNode;
}

interface FormWizardProps {
  steps: Step[];
  title: string;
  subtitle?: string;
  headerColor?: string;
  onSubmit: () => void;
  isSubmitting?: boolean;
}

export default function FormWizard({
  steps,
  title,
  subtitle,
  headerColor = "from-brand-500 to-brand-700",
  onSubmit,
  isSubmitting,
}: FormWizardProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const isLast = currentStep === steps.length - 1;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className={`bg-gradient-to-br ${headerColor} text-white px-5 pt-5 pb-4`}>
        <p className="text-[11px] font-semibold uppercase tracking-widest opacity-80">
          Checklist IRAS
        </p>
        <h1 className="text-xl font-extrabold mt-0.5">{title}</h1>
        {subtitle && <p className="text-sm opacity-80 mt-0.5">{subtitle}</p>}
      </div>

      {/* Progress bar */}
      <div className="flex gap-1 px-5 py-3 bg-white border-b border-gray-200">
        {steps.map((step, i) => (
          <div key={step.id} className="flex-1 text-center">
            <div
              className={`h-1 rounded-full transition-colors ${
                i <= currentStep ? "bg-brand-500" : "bg-gray-200"
              }`}
            />
            <p
              className={`text-[10px] font-semibold mt-1 transition-colors ${
                i <= currentStep ? "text-brand-600" : "text-gray-400"
              }`}
            >
              {step.title}
            </p>
          </div>
        ))}
      </div>

      {/* Content */}
      <div className="px-5 py-5 pb-28">{steps[currentStep].content}</div>

      {/* Bottom nav */}
      <div className="fixed bottom-0 inset-x-0 flex gap-3 px-5 py-3 bg-white border-t border-gray-200 shadow-[0_-2px_10px_rgba(0,0,0,0.05)]">
        <button
          type="button"
          onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
          disabled={currentStep === 0}
          className="flex-[0.6] py-3 rounded-xl font-semibold text-sm bg-gray-100 text-gray-700 disabled:opacity-40"
        >
          ← Anterior
        </button>

        {!isLast ? (
          <button
            type="button"
            onClick={() => setCurrentStep(currentStep + 1)}
            className="flex-1 py-3 rounded-xl font-semibold text-sm bg-brand-500 text-white hover:bg-brand-600 transition-colors"
          >
            Próximo →
          </button>
        ) : (
          <button
            type="button"
            onClick={onSubmit}
            disabled={isSubmitting}
            className="flex-1 py-3 rounded-xl font-semibold text-sm bg-green-600 text-white hover:bg-green-700 transition-colors disabled:opacity-50"
          >
            {isSubmitting ? "Salvando..." : "💾 Salvar Checklist"}
          </button>
        )}
      </div>
    </div>
  );
}
