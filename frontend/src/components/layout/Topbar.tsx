import { Menu, Search, Bell, Moon, Sun, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useAuthStore } from "@/store/authStore";
import { useThemeStore } from "@/store/themeStore";
import { authService } from "@/services/authService";

export default function Topbar({ onMenuClick }: { onMenuClick: () => void }) {
  const { user, clearAuth } = useAuthStore();
  const { theme, toggleTheme } = useThemeStore();
  const navigate = useNavigate();

  const logoutMutation = useMutation({
    mutationFn: authService.logout,
    onSettled: () => {
      clearAuth();
      navigate("/login");
      toast.success("Logged out successfully");
    },
  });

  return (
    <header className="flex h-16 items-center justify-between border-b border-slate-100 bg-white px-4 lg:px-6">
      <div className="flex items-center gap-3">
        <button onClick={onMenuClick} className="lg:hidden">
          <Menu className="h-5 w-5" />
        </button>
        <div className="relative hidden sm:block">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            placeholder="Search tasks, users, categories..."
            className="w-72 rounded-xl border border-slate-200 bg-slate-50 py-2 pl-9 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button onClick={toggleTheme} className="rounded-lg p-2 hover:bg-slate-50">
          {theme === "light" ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
        </button>
        <button className="relative rounded-lg p-2 hover:bg-slate-50">
          <Bell className="h-5 w-5" />
          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-red-500" />
        </button>
        <div className="flex items-center gap-2 border-l border-slate-100 pl-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-sm font-semibold text-white">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div className="hidden text-sm sm:block">
            <p className="font-medium text-slate-900">{user?.name}</p>
            <p className="text-xs capitalize text-slate-400">{user?.role}</p>
          </div>
          <button onClick={() => logoutMutation.mutate()} className="ml-2 rounded-lg p-2 hover:bg-slate-50">
            <LogOut className="h-4 w-4 text-slate-500" />
          </button>
        </div>
      </div>
    </header>
  );
}
