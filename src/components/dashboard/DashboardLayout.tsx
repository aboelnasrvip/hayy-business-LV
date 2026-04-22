import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useLocation, Outlet } from "react-router-dom";
import { LayoutDashboard, FileText, MessageSquare, Star, Palette, Settings, LogOut, Menu, X, Bell, Sun, Moon, ChevronDown, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/ui/ThemeProvider";
import { useLanguage } from "@/contexts/LanguageContext";
import LanguageSwitcher from "@/components/ui/LanguageSwitcher";
import { useAppDispatch } from "@/store/hooks";
import { logout } from "@/store/slices/authSlice";
import { useNavigate } from "react-router-dom";

const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { theme, setTheme } = useTheme();
  const { t, direction } = useLanguage();

  const menuItems = [
    { icon: LayoutDashboard, labelKey: "sidebar.dashboard", path: "/dashboard" },
    { icon: MapPin, labelKey: "sidebar.places", path: "/dashboard/places" },
    { icon: FileText, labelKey: "sidebar.posts", path: "/dashboard/posts" },
    { icon: MessageSquare, labelKey: "sidebar.comments", path: "/dashboard/comments" },
    { icon: Star, labelKey: "sidebar.ratings", path: "/dashboard/ratings" },
    { icon: Palette, labelKey: "sidebar.brandColors", path: "/dashboard/colors" },
    { icon: Settings, labelKey: "sidebar.settings", path: "/dashboard/settings" },
  ];

  const isActive = (path: string) => location.pathname === path;

  const handleLogout = async () => {
    await dispatch(logout());
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-background flex" dir={direction}>
      {/* Mobile Overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside
        className={`fixed lg:sticky top-0 z-50 h-screen w-72 bg-sidebar border-e border-sidebar-border transition-transform duration-300 ${
          direction === "rtl"
            ? sidebarOpen ? "translate-x-0" : "translate-x-full lg:translate-x-0"
            : sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        } ${direction === "rtl" ? "right-0" : "left-0"}`}
      >
        <div className="flex flex-col h-full">
          <div className="h-16 flex items-center justify-between px-6 border-b border-sidebar-border">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center shadow-glow">
                <span className="text-primary-foreground font-bold text-xl">H</span>
              </div>
              <span className="text-xl font-bold text-sidebar-foreground">HAYY</span>
            </Link>
            <button onClick={() => setSidebarOpen(false)} className="lg:hidden p-2 hover:bg-sidebar-accent rounded-lg transition-colors">
              <X className="w-5 h-5 text-sidebar-foreground" />
            </button>
          </div>

          <nav className="flex-1 p-4 space-y-1">
            {menuItems.map((item) => (
              <Link key={item.path} to={item.path} onClick={() => setSidebarOpen(false)}>
                <motion.div
                  whileHover={{ x: direction === "rtl" ? -4 : 4 }}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                    isActive(item.path)
                      ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-glow"
                      : "text-sidebar-foreground hover:bg-sidebar-accent"
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  <span className="font-medium">{t(item.labelKey)}</span>
                </motion.div>
              </Link>
            ))}
          </nav>

          <div className="p-4 border-t border-sidebar-border">
            <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-sidebar-accent">
              <div className="w-10 h-10 rounded-full bg-gradient-primary flex items-center justify-center">
                <span className="text-primary-foreground font-bold">A</span>
              </div>
              <div className="flex-1">
                <p className="font-medium text-sidebar-foreground text-sm">{t("dashboard.businessName")}</p>
                <p className="text-xs text-muted-foreground">{t("dashboard.proPlan")}</p>
              </div>
              <ChevronDown className="w-4 h-4 text-muted-foreground" />
            </div>

            <button
              onClick={handleLogout}
              className="flex items-center gap-3 px-4 py-3 mt-2 w-full text-destructive hover:bg-destructive/10 rounded-xl transition-colors"
            >
              <LogOut className="w-5 h-5" />
              <span className="font-medium">{t("dashboard.signOut")}</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen">
        <header className="sticky top-0 z-30 h-16 bg-background/80 backdrop-blur-lg border-b border-border flex items-center justify-between px-4 lg:px-8">
          <div className="flex items-center gap-4">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 hover:bg-secondary rounded-lg transition-colors">
              <Menu className="w-6 h-6 text-foreground" />
            </button>
            <h1 className="text-lg font-semibold text-foreground">
              {menuItems.find((item) => isActive(item.path))?.labelKey
                ? t(menuItems.find((item) => isActive(item.path))!.labelKey)
                : t("sidebar.dashboard")}
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <LanguageSwitcher />
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="p-2 hover:bg-secondary rounded-lg transition-colors"
            >
              {theme === "dark" ? <Sun className="w-5 h-5 text-foreground" /> : <Moon className="w-5 h-5 text-foreground" />}
            </motion.button>

            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="relative p-2 hover:bg-secondary rounded-lg transition-colors">
              <Bell className="w-5 h-5 text-foreground" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-primary rounded-full" />
            </motion.button>

            <div className="hidden sm:flex w-10 h-10 rounded-full bg-gradient-primary items-center justify-center">
              <span className="text-primary-foreground font-bold">A</span>
            </div>
          </div>
        </header>

        {/* Outlet */}
        <main className="flex-1 p-4 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
