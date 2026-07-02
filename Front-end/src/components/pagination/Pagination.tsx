"use client";

import * as React from "react";
import { Icon } from "@/components/SvgIcons";
import { useTranslation } from "@/context/LanguageContext";

interface PaginationProps {
  totalItems: number;
  currentPage: number;
  perPage: number;
  onPageChange: (page: number) => void;
}

const getPageNumbers = (totalPages: number, current: number): (number | string)[] => {
  const pages: (number | string)[] = [];
  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) pages.push(i);
    return pages;
  }
  pages.push(1);
  if (current > 4) pages.push('...');
  const start = Math.max(2, current - 1);
  const end = Math.min(totalPages - 1, current + 1);
  for (let i = start; i <= end; i++) pages.push(i);
  if (current < totalPages - 3) pages.push('...');
  pages.push(totalPages);
  return pages;
};

export const Pagination: React.FC<PaginationProps> = ({ totalItems, currentPage, perPage, onPageChange }) => {
  const { t } = useTranslation();
  const totalPages = Math.ceil(totalItems / perPage);
  if (totalPages === 0) return null;

  const pageNumbers = getPageNumbers(totalPages, currentPage);

  return (
    <nav className="flex items-center justify-center gap-3 mt-8 pb-10 select-none animate-fade-in" aria-label="Pagination">
      {/* Previous Button */}
      <button
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
        className="px-4 py-2.5 text-xs font-black transition-all duration-300 rounded-xl border shadow-xs flex items-center gap-1.5 disabled:cursor-not-allowed cursor-pointer
          bg-white border-neutral-200 text-neutral-800 hover:border-primary-coral hover:text-primary-coral
          dark:bg-[#18110f] dark:border-border-color/60 dark:text-white dark:hover:border-primary-coral dark:hover:text-primary-coral
          disabled:opacity-30 disabled:hover:border-neutral-200 disabled:hover:text-neutral-800
          dark:disabled:hover:border-border-color/60 dark:disabled:hover:text-white"
      >
        <Icon name="chevron-left" size={10} className="rtl:rotate-180" />
        <span>{t("common.previous") || "Previous"}</span>
      </button>

      {/* Page Numbers */}
      <div className="flex items-center gap-2">
        {pageNumbers.map((p, idx) =>
          typeof p === 'number' ? (
            <button
              key={p}
              onClick={() => onPageChange(p)}
              className={`w-9 h-9 rounded-xl border flex items-center justify-center text-xs font-black transition-all duration-300 cursor-pointer shadow-xs
                ${p === currentPage
                  ? "bg-primary-coral border-primary-coral text-[#180f0d] shadow-md shadow-primary-coral/25"
                  : "bg-white border-neutral-200 text-neutral-800 hover:border-primary-coral hover:text-primary-coral dark:bg-[#18110f] dark:border-border-color/60 dark:text-white dark:hover:border-primary-coral dark:hover:text-primary-coral"
                }`}
            >
              {p}
            </button>
          ) : (
            <span
              key={"ellipsis-" + idx}
              className="w-9 h-9 rounded-xl border border-dashed border-neutral-200 dark:border-border-color/30 text-xs font-bold text-muted-text flex items-center justify-center select-none bg-neutral-50/50 dark:bg-[#18110f]/30"
            >
              ...
            </span>
          )
        )}
      </div>

      {/* Next Button */}
      <button
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
        className="px-4 py-2.5 text-xs font-black transition-all duration-300 rounded-xl border shadow-xs flex items-center gap-1.5 disabled:cursor-not-allowed cursor-pointer
          bg-white border-neutral-200 text-neutral-800 hover:border-primary-coral hover:text-primary-coral
          dark:bg-[#18110f] dark:border-border-color/60 dark:text-white dark:hover:border-primary-coral dark:hover:text-primary-coral
          disabled:opacity-30 disabled:hover:border-neutral-200 disabled:hover:text-neutral-800
          dark:disabled:hover:border-border-color/60 dark:disabled:hover:text-white"
      >
        <span>{t("common.next") || "Next"}</span>
        <Icon name="chevron-right" size={10} className="rtl:rotate-180" />
      </button>
    </nav>
  );
};
