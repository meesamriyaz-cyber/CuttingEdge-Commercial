import { Link, useLocation } from "react-router-dom";
import {
  BarChart3,
  ClipboardList,
  FileText,
  LayoutDashboard,
  Package,
  ShoppingBag,
  Wrench,
} from "lucide-react";

const navItems = [
  { label: "Dashboard", to: "/admin/dashboard", icon: LayoutDashboard },
  { label: "Products", to: "/admin/products", icon: Package },
  { label: "Orders", to: "/admin/orders", icon: ShoppingBag },
  { label: "Govt Enquiries", to: "/admin/enquiries", icon: ClipboardList },
  { label: "Quotes", to: "/admin/quotes", icon: FileText },
  { label: "Services", to: "/admin/service-enquiries", icon: Wrench },
];

export default function AdminLayout({ children }) {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-page px-3 py-4 sm:px-4 lg:px-6">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-4 lg:flex-row lg:gap-6">
        <aside className="theme-card h-fit w-full shrink-0 overflow-hidden rounded-lg p-3 lg:sticky lg:top-20 lg:w-64">
          <div className="mb-4 flex items-center gap-3 border-b border-slate-200/75 pb-4 dark:border-cyan-950/45">
            <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-[linear-gradient(135deg,#07111f_0%,#0f766e_58%,#d97706_100%)] text-white shadow-[0_16px_34px_-24px_rgba(8,16,29,0.82)]">
              <BarChart3 size={20} />
            </div>
            <div className="min-w-0">
              <h3 className="truncate text-sm font-bold text-slate-950 dark:text-white">
                Admin Workspace
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Operations control
              </p>
            </div>
          </div>

          <nav className="flex gap-2 overflow-x-auto pb-1 text-sm lg:block lg:space-y-1 lg:overflow-visible lg:pb-0">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active =
                location.pathname === item.to ||
                location.pathname.startsWith(`${item.to}/`);

              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`inline-flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 font-semibold transition-all lg:flex ${
                    active
                      ? "bg-cyan-50 text-cyan-800 shadow-[inset_0_0_0_1px_rgba(34,211,238,0.22)] dark:bg-cyan-950/25 dark:text-cyan-200"
                      : "text-slate-700 hover:bg-white/75 hover:text-cyan-800 dark:text-slate-200 dark:hover:bg-slate-900/70 dark:hover:text-cyan-200"
                  }`}
                >
                  <Icon size={17} />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </aside>

        <main className="min-w-0 flex-1">
          <div className="min-w-0">{children}</div>
        </main>
      </div>
    </div>
  );
}
