"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Activity, AlertTriangle, Car, LayoutDashboard, Leaf, Sparkles } from "lucide-react";

const NAV_ITEMS = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/ai", label: "AI", icon: Sparkles },
  { href: "/transport", label: "Транспорт", icon: Car },
  { href: "/ecology", label: "Экология", icon: Leaf },
  { href: "/alerts", label: "Оповещения", icon: AlertTriangle },
];

export default function AppHeader() {
  const pathname = usePathname();

  return (
    <header className="app-header">
      <div className="app-header__inner">
        <Link href="/" className="app-header__brand" aria-label="Smart City Control Center">
          <span className="app-header__logo">
            <Activity size={20} strokeWidth={2.4} />
          </span>
          <span className="app-header__brand-text">
            <span className="app-header__brand-title">Smart City</span>
            <span className="app-header__brand-sub">Control Center</span>
          </span>
        </Link>

        <nav className="app-header__nav" aria-label="Основная навигация">
          {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
            const active = href === "/" ? pathname === "/" : pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                className={`app-nav-link${active ? " app-nav-link--active" : ""}`}
                aria-current={active ? "page" : undefined}
              >
                <Icon size={16} strokeWidth={2} />
                <span>{label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="app-header__status">
          <span className="badge badge--ok badge--dot">System Online</span>
        </div>
      </div>
    </header>
  );
}
