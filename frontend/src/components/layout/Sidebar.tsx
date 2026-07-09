import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";
import { LayoutDashboard, ListChecks, KanbanSquare, Users, Settings, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/authStore";

const navItems = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/tasks", label: "Tasks", icon: ListChecks },
  { to: "/kanban", label: "Kanban Board", icon: KanbanSquare },
  { to: "/admin", label: "Admin", icon: Users, adminOnly: true },
  { to: "/settings", label: "Settings", icon: Settings },
];

export default function Sidebar({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { user } = useAuthStore();

  return (
    <>
      {open && <div className="fixed inset-0 z-30 bg-black/30 lg:hidden" onClick={onClose} />}
      <motion.aside
        initial={false}
        animate={{ x: 0 }}
        className={cn(
          "fixed inset-y-0 left-0 z-40 w-64 transform border-r border-slate-100 bg-white p-4 transition-transform lg:static lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="mb-8 flex items-center justify-between px-2">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary font-bold text-white">T</div>
            <span className="text-lg font-bold text-slate-900">TaskFlow</span>
          </div>
          <button onClick={onClose} className="lg:hidden">
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="space-y-1">
          {navItems
            .filter((item) => !item.adminOnly || user?.role === "admin")
            .map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  cn(
                    "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50",
                    isActive && "bg-blue-50 text-primary"
                  )
                }
              >
                <item.icon className="h-4.5 w-4.5" />
                {item.label}
              </NavLink>
            ))}
        </nav>
      </motion.aside>
    </>
  );
}
