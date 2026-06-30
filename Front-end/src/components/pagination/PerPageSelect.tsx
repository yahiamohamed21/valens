import React from "react";
import { useTranslation } from "@/context/LanguageContext";

interface PerPageSelectProps {
  value: number;
  onChange: (value: number) => void;
}

export const PerPageSelect: React.FC<PerPageSelectProps> = ({ value, onChange }) => {
  const { t } = useTranslation();
  
  return (
    <div className="flex items-center gap-2">
      <span className="text-[10px] font-bold text-muted-text uppercase tracking-wider">
        {t("common.show") || "Show"}:
      </span>
      <select
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="rounded-lg border border-border-color bg-surface-deep px-2 py-1 text-xs text-white focus:outline-none focus:ring-1 focus:ring-primary-coral/20"
      >
        {[8, 12, 24, 48].map((num) => (
          <option key={num} value={num}>
            {num}
          </option>
        ))}
      </select>
    </div>
  );
};
