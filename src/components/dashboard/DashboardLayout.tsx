import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useLocation, Outlet, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  FileText,
  MessageSquare,
  Star,
  Palette,
  Settings,
  LogOut,
  Menu,
  Bell,
  Sun,
  Moon,
  MapPin,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";
import { useTheme } from "@/components/ui/ThemeProvider";
import { useLanguage } from "@/contexts/LanguageContext";
import LanguageSwitcher from "@/components/ui/LanguageSwitcher";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { logout } from "@/store/slices/authSlice";
import { useIsMobile } from "@/hooks/use-mobile";
const menuItems = [
  { icon: LayoutDashboard, labelKey: "sidebar.dashboard", path: "/dashboard" },
  { icon: MapPin, labelKey: "sidebar.places", path: "/dashboard/places" },
  { icon: FileText, labelKey: "sidebar.posts", path: "/dashboard/posts" },
  {
    icon: MessageSquare,
    labelKey: "sidebar.comments",
    path: "/dashboard/comments",
  },
  { icon: Star, labelKey: "sidebar.ratings", path: "/dashboard/ratings" },
  { icon: Palette, labelKey: "sidebar.brandColors", path: "/dashboard/colors" },
  { icon: Settings, labelKey: "sidebar.settings", path: "/dashboard/settings" },
];

const neuBg = "bg-[#e0e5ec] dark:bg-[#252838]";
const neuRaised =
  "bg-[#e0e5ec] shadow-[5px_5px_12px_#b8bec7,-5px_-5px_12px_#ffffff] dark:bg-[#252838] dark:shadow-[4px_4px_10px_#12151f,-4px_-4px_10px_#2e3248]";
const neuSmall =
  "bg-[#e0e5ec] shadow-[3px_3px_7px_#b8bec7,-3px_-3px_7px_#ffffff] dark:bg-[#252838] dark:shadow-[3px_3px_6px_#12151f,-3px_-3px_6px_#2e3248]";
const neuInset =
  "shadow-[inset_3px_3px_7px_#b8bec7,inset_-3px_-3px_7px_#ffffff] dark:shadow-[inset_3px_3px_6px_#12151f,inset_-3px_-3px_6px_#2e3248]";

const DashboardLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { theme, setTheme } = useTheme();
  const { t, direction } = useLanguage();
  const user = useAppSelector((s) => s.auth.user);

  const isActive = (path: string) => location.pathname === path;
  const handleLogout = async () => {
    await dispatch(logout());
    navigate("/login");
  };
  const pageTitle = menuItems.find((item) => isActive(item.path));
  const isMobile = useIsMobile();
  const sidebarWidth = collapsed ? 68 : 210;
  /* ─────────────────── COLLAPSED ─────────────────── */
  const CollapsedSidebar = () => (
    <div
      className="flex flex-col h-full py-6 px-3 items-center gap-3 w-[68px]
  bg-[#e0e5ec] shadow-[inset_-10px_0_20px_#b8bec7]
  dark:bg-[#252838] dark:shadow-[inset_-10px_0_20px_#0e1020]"
    >
      {/* Logo → expand */}
      <button
        onClick={() => setCollapsed(false)}
        className={`w-11 h-11 flex items-center justify-center rounded-xl mb-1 transition-all ${neuRaised}`}
      >
        <img
          src="/logo.png"
          className="w-6 h-6 object-contain rounded-full"
          alt="Logo"
        />
      </button>

      {/* Icon list */}
      <nav className="flex-1 flex flex-col gap-3 items-center w-full">
        {menuItems.map((item) => {
          const active = isActive(item.path);
          return (
            <Link key={item.path} to={item.path} title={t(item.labelKey)}>
              <div
                className={`w-11 h-11 flex items-center justify-center rounded-xl transition-all duration-200
                ${
                  active
                    ? "bg-gradient-to-br from-primary to-orange-500 text-white shadow-[3px_3px_8px_#b8bec7,-1px_-1px_4px_#ffffff] dark:shadow-[3px_3px_8px_#12151f,-1px_-1px_4px_#2e3248]"
                    : `text-gray-400 dark:text-gray-500 hover:text-primary ${neuSmall}`
                }`}
              >
                <item.icon size={18} />
              </div>
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <button
        onClick={handleLogout}
        title={t("dashboard.signOut")}
        className={`w-11 h-11 flex items-center justify-center rounded-xl text-red-400 hover:text-red-500 transition-colors ${neuSmall}`}
      >
        <LogOut size={18} />
      </button>
    </div>
  );

  /* ─────────────────── EXPANDED ─────────────────── */
  const ExpandedSidebar = ({ onClose }: { onClose?: () => void }) => (
    <div
      className="flex flex-col h-full py-6 px-4 w-[210px]
  bg-[#e0e5ec] shadow-[inset_-10px_0_20px_#b8bec7]
  dark:bg-[#252838] dark:shadow-[inset_-10px_0_20px_#0e1020]"
    >
      {/* Top: logo + collapse btn */}
      <div className="flex items-center justify-between mb-5 px-1">
        <Link to="/" className="flex items-center gap-2" onClick={onClose}>
          <div
            className={`w-9 h-9 rounded-xl flex items-center justify-center ${neuSmall}`}
          >
            <img
              src="/logo.png"
              className="w-6 h-6 object-contain rounded-full"
              alt="Logo"
            />
          </div>
          <span className="font-black text-base text-gray-700 dark:text-white">
            HAYY
          </span>
        </Link>
        <button
          onClick={() => {
            setCollapsed(true);
            onClose?.();
          }}
          className={`hidden lg:flex w-7 h-7 items-center justify-center rounded-lg transition-all ${neuSmall}`}
        >
          {direction === "rtl" ? (
            <ChevronRight size={13} className="text-gray-400" />
          ) : (
            <ChevronLeft size={13} className="text-gray-400" />
          )}
        </button>
      </div>

      {/* Avatar card */}
      <div
        className={`flex flex-col items-center gap-2 py-5 rounded-2xl mb-4 ${neuRaised}`}
      >
        <div
          className={`w-16 h-16 rounded-full flex items-center justify-center ${neuInset} bg-[#e0e5ec] dark:bg-[#252838]`}
        >
          <span className="text-2xl font-black text-primary">
            {user?.fullName?.[0]?.toUpperCase() ?? "A"}
          </span>
        </div>
        <p className="font-bold text-sm text-gray-700 dark:text-white leading-none">
          {user?.fullName ?? t("dashboard.businessName")}
        </p>
        {user?.email && (
          <p className="text-[10px] text-gray-400 truncate max-w-[170px] text-center">
            {user.email}
          </p>
        )}
      </div>

      {/* Nav items */}
      <nav className="flex-1 flex flex-col gap-1 w-full">
        {menuItems.map((item) => {
          const active = isActive(item.path);
          return (
            <Link key={item.path} to={item.path} onClick={onClose}>
              <div
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200
                ${
                  active
                    ? `text-primary font-semibold ${neuInset} bg-[#e0e5ec] dark:bg-[#252838]`
                    : "text-gray-500 dark:text-gray-400 hover:text-primary"
                }`}
              >
                <item.icon size={18} className="shrink-0" />
                <span className="text-sm font-medium">{t(item.labelKey)}</span>
              </div>
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <button
        onClick={handleLogout}
        className="flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:text-red-500 transition-colors"
      >
        <LogOut size={18} />
        <span className="text-sm font-medium">{t("dashboard.signOut")}</span>
      </button>
    </div>
  );

  /* ─────────────────── ROOT ─────────────────── */
  return (
    <div
      className="min-h-screen flex bg-[#e0e5ec] dark:bg-[#252838]"
      dir={direction}
    >
      {/* Mobile overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setMobileOpen(false)}
            className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.aside
            initial={{ x: direction === "rtl" ? "100%" : "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: direction === "rtl" ? "100%" : "-100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className={`fixed top-0 z-50 h-full overflow-hidden
              ${direction === "rtl" ? "right-0 rounded-s-[2rem]" : "left-0 rounded-e-[2rem]"}
              shadow-[6px_0_20px_rgba(0,0,0,0.1)] dark:shadow-[6px_0_20px_rgba(0,0,0,0.3)]`}
          >
            <ExpandedSidebar onClose={() => setMobileOpen(false)} />
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Desktop sidebar — animates width */}
      <motion.aside
        animate={{ width: collapsed ? 68 : 210 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="hidden lg:block sticky top-0 h-screen overflow-hidden flex-shrink-0 rounded-e-[2rem]"
      >
        {collapsed ? <CollapsedSidebar /> : <ExpandedSidebar />}
      </motion.aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
        {/* Navbar */}
        <header
          className="fixed top-4 right-4 z-30 px-4 py-2.5 rounded-2xl flex items-center justify-between
  bg-[#e0e5ec] shadow-[6px_6px_14px_#b8bec7,-6px_-6px_14px_#ffffff]
  dark:bg-[#252838] dark:shadow-[5px_5px_12px_#12151f,-5px_-5px_12px_#2e3248]"
          style={{ left: isMobile ? "16px" : `${sidebarWidth + 16}px` }}
        >
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileOpen(true)}
              className={`lg:hidden w-9 h-9 flex items-center justify-center rounded-xl ${neuSmall}`}
            >
              <Menu size={18} className="text-gray-600 dark:text-gray-400" />
            </button>
            <h1 className="font-bold text-gray-700 dark:text-white">
              {pageTitle ? t(pageTitle.labelKey) : t("sidebar.dashboard")}
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <LanguageSwitcher />
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className={`w-9 h-9 flex items-center justify-center rounded-xl ${neuSmall}`}
            >
              {theme === "dark" ? (
                <Sun size={17} className="text-primary" />
              ) : (
                <Moon size={17} className="text-gray-500" />
              )}
            </button>
            <button
              className={`relative w-9 h-9 flex items-center justify-center rounded-xl ${neuSmall}`}
            >
              <Bell size={17} className="text-gray-600 dark:text-gray-400" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-primary rounded-full ring-2 ring-[#e0e5ec] dark:ring-[#252838]" />
            </button>
            <div
              className={`w-9 h-9 rounded-full flex items-center justify-center ${neuSmall}`}
            >
              <span className="font-bold text-sm text-primary">
                {user?.fullName?.[0]?.toUpperCase() ?? "A"}
              </span>
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 lg:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
