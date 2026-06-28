"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon } from "@/components/SvgIcons";
import { useApp } from "@/context/AppContext";
import { ADMIN_NAV_ITEMS, getActiveAdminNavItem, getAdminNavLabel } from "@/lib/admin-nav";

export interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

export function Sidebar({ sidebarOpen, setSidebarOpen }: SidebarProps) {
  const { locale } = useApp();
  const pathname = usePathname();
  const isRtl = locale === "ar";

  const activeItem = getActiveAdminNavItem(pathname);

  return (
    <aside
      className={`${sidebarOpen ? "w-64" : "w-20"} shrink-0 border-r border-border-color bg-surface-deep transition-all duration-300 ease-in-out flex flex-col justify-between`}
    >
      {/* Top section */}
      <div className="flex flex-col gap-8 pt-6">
        <header className="flex items-center justify-between px-4 border-b border-border-color pb-6">
          <Link href="/" className="flex items-center gap-2" aria-label="Valens admin home">
            <span
              className={`text-glow font-black tracking-widest text-primary-coral transition-all duration-300 ${
                sidebarOpen ? "text-xl" : "text-sm"
              }`}
            >
              {sidebarOpen ? "VALENS ADMIN" : "VL"}
            </span>
          </Link>
          <button
            type="button"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-muted-text hover:text-white transition-colors duration-200 p-1 rounded-lg hover:bg-surface-sec cursor-pointer"
            aria-label={sidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
            aria-expanded={sidebarOpen}
          >
            <Icon name={sidebarOpen ? "chevron-left" : "menu"} size={18} />
          </button>
        </header>

        <nav className="flex flex-col gap-2 px-3" aria-label="Admin sections">
          {ADMIN_NAV_ITEMS.map((item) => {
            const active = activeItem?.id === item.id;
            return (
              <Link
                key={item.id}
                href={item.href}
                aria-current={active ? "page" : undefined}
                title={!sidebarOpen ? getAdminNavLabel(item, locale) : undefined}
                className={`flex items-center gap-4 rounded-xl px-3 py-3 text-xs font-bold uppercase tracking-wider transition-all duration-200 ${
                  isRtl ? "flex-row-reverse text-right" : ""
                } ${
                  active
                    ? "bg-primary-coral/15 text-primary-coral border border-primary-coral/30 shadow-sm"
                    : "text-soft-text border border-transparent hover:bg-surface-sec/60 hover:text-white hover:border-border-color/30"
                }`}
              >
                <Icon name={item.icon} size={20} className="flex-shrink-0" />
                {sidebarOpen && <span className="truncate">{getAdminNavLabel(item, locale)}</span>}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom section */}
      <div className="p-4 border-t border-border-color">
        <Link
          href="/"
          className={`flex items-center justify-center gap-2 rounded-xl border border-border-color bg-surface-sec py-3 text-xs font-bold uppercase tracking-wider text-soft-text hover:text-white hover:border-primary-coral/50 hover:bg-surface-sec/80 transition-all duration-200 w-full ${
            isRtl ? "flex-row-reverse" : ""
          }`}
          aria-label={isRtl ? "العودة للمتجر" : "Back to store"}
        >
          <Icon name="logout" size={16} className="flex-shrink-0" />
          {sidebarOpen && <span className="truncate">{isRtl ? "العودة للمتجر" : "Back to store"}</span>}
        </Link>
      </div>
    </aside>
  );
}
