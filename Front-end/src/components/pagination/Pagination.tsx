"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/SvgIcons";

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

export  const Pagination: React.FC<PaginationProps> = ({ totalItems, currentPage, perPage, onPageChange }) => {
  const totalPages = Math.ceil(totalItems / perPage);
  if (totalPages <= 1) return null;

  const pageNumbers = getPageNumbers(totalPages, currentPage);

  return (
    <nav className="flex items-center gap-2 mt-8 justify-center pb-10" aria-label="Pagination">
      <Button 
        variant="outline" 
        size="icon" 
        onClick={() => onPageChange(1)} 
        disabled={currentPage === 1}
        className="rounded-xl border-border-color bg-surface-deep text-white hover:bg-primary-coral transition-all"
      >
        <Icon name="chevron-double-left" size={14} />
      </Button>
      
      <Button 
        variant="outline" 
        size="icon" 
        onClick={() => onPageChange(Math.max(1, currentPage - 1))} 
        disabled={currentPage === 1}
        className="rounded-xl border-border-color bg-surface-deep text-white hover:bg-primary-coral transition-all"
      >
        <Icon name="chevron-left" size={14} />
      </Button>

      <div className="flex items-center gap-1.5 mx-2">
        {pageNumbers.map((p, idx) =>
          typeof p === 'number' ? (
            <Button
              key={p}
              variant={p === currentPage ? "default" : "outline"}
              onClick={() => onPageChange(p)}
              className={`min-w-[40px] h-10 rounded-xl font-bold text-xs transition-all ${
                p === currentPage 
                  ? "bg-primary-coral text-main-bg border-primary-coral shadow-lg shadow-primary-coral/20" 
                  : "bg-surface-deep border-border-color text-muted-text hover:text-white hover:border-primary-coral/50"
              }`}
            >
              {p}
            </Button>
          ) : (
            <span key={"ellipsis-" + idx} className="px-2 text-muted-text font-bold">...</span>
          )
        )}
      </div>

      <Button 
        variant="outline" 
        size="icon" 
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))} 
        disabled={currentPage === totalPages}
        className="rounded-xl border-border-color bg-surface-deep text-white hover:bg-primary-coral transition-all"
      >
        <Icon name="chevron-right" size={14} />
      </Button>
      
      <Button 
        variant="outline" 
        size="icon" 
        onClick={() => onPageChange(totalPages)} 
        disabled={currentPage === totalPages}
        className="rounded-xl border-border-color bg-surface-deep text-white hover:bg-primary-coral transition-all"
      >
        <Icon name="chevron-double-right" size={14} />
      </Button>
    </nav>
  );
};
