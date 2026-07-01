import React, { useState, useRef, useEffect } from "react";
import { useTranslation } from "@/context/LanguageContext";
import { Icon } from "@/components/SvgIcons";

interface PerPageSelectProps {
  value: number;
  onChange: (value: number) => void;
}

export const PerPageSelect: React.FC<PerPageSelectProps> = ({ value, onChange }) => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={dropdownRef} className="relative inline-flex items-center gap-3 bg-surface-deep/30 px-3.5 py-2 rounded-2xl border border-border-color/40 backdrop-blur-md">
      <span className="text-[10px] font-black text-muted-text uppercase tracking-widest select-none">
        {t("common.show") || "Show"}:
      </span>
      
      <div className="relative">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center justify-between gap-3 min-w-[70px] rounded-xl border border-border-color bg-surface-deep/60 px-3 py-1.5 text-xs font-bold text-white hover:border-primary-coral hover:text-primary-coral transition-luxury cursor-pointer select-none"
        >
          <span>{value}</span>
          <Icon 
            name="chevron-down" 
            size={10} 
            className={`text-muted-text transition-transform duration-300 ${isOpen ? "rotate-180 text-primary-coral" : ""}`} 
          />
        </button>

        {isOpen && (
          <div className="absolute right-0 top-full mt-2 z-50 min-w-[90px] bg-white border border-border-color/40 dark:bg-surface-deep dark:border-border-color/60 rounded-xl p-1.5 shadow-xl shadow-black/10 dark:shadow-black/40 backdrop-blur-md animate-fade-in flex flex-col gap-1">
            {[10, 20, 50, 100].map((num) => {
              const isSelected = value === num;
              return (
                <button
                  key={num}
                  type="button"
                  onClick={() => {
                    onChange(num);
                    setIsOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 text-xs font-extrabold rounded-lg transition-colors cursor-pointer flex items-center justify-between gap-2
                    ${isSelected 
                      ? "bg-primary-coral/10 text-primary-coral dark:bg-primary-coral/25" 
                      : "text-neutral-700 hover:bg-neutral-100 hover:text-primary-coral dark:text-white dark:hover:bg-surface-sec dark:hover:text-primary-coral"
                    }
                  `}
                >
                  <span>{num}</span>
                  {isSelected && <Icon name="check" size={10} className="text-primary-coral" />}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
