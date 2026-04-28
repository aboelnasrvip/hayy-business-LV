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

// shared neumorphic tokens
const neuRaised =
  "bg-[#e0e5ec] shadow-[5px_5px_12px_#b8bec7,-5px_-5px_12px_#ffffff] dark:bg-[#252838] dark:shadow-[4px_4px_10px_#12151f,-4px_-4px_10px_#2e3248]";
const neuSmall =
  "bg-[#e0e5ec] shadow-[3px_3px_7px_#b8bec7,-3px_-3px_7px_#ffffff] dark:bg-[#252838] dark:shadow-[3px_3px_6px_#12151f,-3px_-3px_6px_#2e3248]";

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

  // JSX helper – renders sidebar body
  const sidebarBody = (showLabels: boolean, onClose?: () => void) => (
    <div
      className={`flex flex-col h-full py-5 gap-2 bg-[#e0e5ec] dark:bg-[#252838]
        ${showLabels ? "px-4 w-[230px]" : "px-3 w-[76px] items-center"}`}
    >
      {/* ── Logo / Collapse button ── */}
      <div
        className={`flex items-center mb-3 ${showLabels ? "justify-between px-1" : "justify-center"}`}
      >
        {showLabels ? (
          <>
            <Link to="/" className="flex items-center gap-2">
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center ${neuRaised}`}
              >
                <img
                  src="/logo.png"
                  className="w-7 h-7 object-contain rounded-full"
                  alt="Logo"
                />
              </div>
              <span className="font-black text-lg text-gray-700 dark:text-white tracking-wide">
                HAYY
              </span>
            </Link>
            {/* collapse arrow (desktop only) */}
            <button
              onClick={() => setCollapsed(true)}
              className={`hidden lg:flex w-8 h-8 items-center justify-center rounded-lg transition-all hover:text-primary ${neuSmall}`}
            >
              {direction === "rtl" ? (
                <ChevronRight
                  size={15}
                  className="text-gray-500 dark:text-gray-400"
                />
              ) : (
                <ChevronLeft
                  size={15}
                  className="text-gray-500 dark:text-gray-400"
                />
              )}
            </button>
          </>
        ) : (
          /* collapsed: logo acts as expand button */
          <button
            onClick={() => setCollapsed(false)}
            className={`w-12 h-12 flex items-center justify-center rounded-xl transition-all hover:text-primary ${neuRaised}`}
          >
            <img
              src="/logo.png"
              className="w-7 h-7 object-contain rounded-full"
              alt="Logo"
            />
          </button>
        )}
      </div>

      {/* ── Avatar card (expanded only) ── */}
      {showLabels && (
        <div
          className={`flex flex-col items-center gap-2 py-4 px-3 rounded-2xl mb-2 ${neuRaised}`}
        >
          <div
            className={`w-14 h-14 rounded-full flex items-center justify-center ${neuSmall}`}
          >
            <span className="text-2xl font-black text-primary">
              {user?.fullName?.[0]?.toUpperCase() ?? "A"}
            </span>
          </div>
          <p className="font-bold text-sm text-gray-700 dark:text-white leading-none">
            {user?.fullName ?? t("dashboard.businessName")}
          </p>
          {user?.email && (
            <p className="text-[11px] text-gray-400 truncate max-w-[170px]">
              {user.email}
            </p>
          )}
        </div>
      )}

      {/* ── Menu ── */}
      <nav className="flex-1 flex flex-col gap-2 w-full">
        {menuItems.map((item) => {
          const active = isActive(item.path);
          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={onClose}
              title={!showLabels ? t(item.labelKey) : undefined}
            >
              <div
                className={`flex items-center rounded-xl transition-all duration-200
                  ${showLabels ? "gap-3 px-4 py-3" : "justify-center w-12 h-12 mx-auto"}
                  ${
                    active
                      ? "bg-gradient-to-r from-primary to-orange-500 text-white shadow-[3px_3px_8px_#b8bec7,-1px_-1px_5px_#ffffff] dark:shadow-[3px_3px_8px_#12151f,-1px_-1px_4px_#2e3248]"
                      : `text-gray-500 dark:text-gray-400 hover:text-primary ${neuSmall}`
                  }`}
              >
                <item.icon size={19} className="shrink-0" />
                {showLabels && (
                  <span className="font-medium text-sm">
                    {t(item.labelKey)}
                  </span>
                )}
              </div>
            </Link>
          );
        })}
      </nav>

      {/* ── Logout ── */}
      <button
        onClick={handleLogout}
        title={!showLabels ? t("dashboard.signOut") : undefined}
        className={`flex items-center rounded-xl transition-all duration-200 text-red-400 hover:text-red-500
          ${showLabels ? "gap-3 px-4 py-3 w-full" : "justify-center w-12 h-12 mx-auto"}
          ${neuSmall}`}
      >
        <LogOut size={19} className="shrink-0" />
        {showLabels && (
          <span className="font-medium text-sm">{t("dashboard.signOut")}</span>
        )}
      </button>
    </div>
  );

  return (
    <div
      className="min-h-screen flex bg-[#e0e5ec] dark:bg-[#252838]"
      dir={direction}
    >
      {/* Mobile Overlay */}
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

      {/* Mobile Sidebar Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.aside
            initial={{ x: direction === "rtl" ? "100%" : "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: direction === "rtl" ? "100%" : "-100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className={`fixed top-0 z-50 h-full overflow-hidden
              ${direction === "rtl" ? "right-0 rounded-s-[2rem]" : "left-0 rounded-e-[2rem]"}
              shadow-[8px_0_24px_rgba(0,0,0,0.08)] dark:shadow-[8px_0_24px_rgba(0,0,0,0.3)]`}
          >
            {sidebarBody(true, () => setMobileOpen(false))}
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Desktop Sidebar */}
      <motion.aside
        animate={{ width: collapsed ? 76 : 230 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className={`hidden lg:flex flex-col sticky top-0 h-screen overflow-hidden
          ${direction === "rtl" ? "rounded-s-0 rounded-e-[2rem]" : "rounded-e-[2rem]"}
          shadow-[6px_0_20px_rgba(0,0,0,0.05)] dark:shadow-[6px_0_20px_rgba(0,0,0,0.25)]`}
      >
        {sidebarBody(!collapsed)}
      </motion.aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
        {/* Navbar */}
        <header
          className="sticky top-0 z-30 mx-4 mt-4 px-4 py-2.5 rounded-2xl flex items-center justify-between
          bg-[#e0e5ec] shadow-[6px_6px_14px_#b8bec7,-6px_-6px_14px_#ffffff]
          dark:bg-[#252838] dark:shadow-[5px_5px_12px_#12151f,-5px_-5px_12px_#2e3248]"
        >
          <div className="flex items-center gap-3">
            {/* Mobile hamburger */}
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

            {/* Theme toggle */}
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className={`w-9 h-9 flex items-center justify-center rounded-xl transition-all
                hover:shadow-[1px_1px_3px_#b8bec7,-1px_-1px_3px_#ffffff]
                dark:hover:shadow-[1px_1px_3px_#12151f,-1px_-1px_3px_#2e3248] ${neuSmall}`}
            >
              {theme === "dark" ? (
                <Sun size={17} className="text-primary" />
              ) : (
                <Moon size={17} className="text-gray-500" />
              )}
            </button>

            {/* Notifications */}
            <button
              className={`relative w-9 h-9 flex items-center justify-center rounded-xl ${neuSmall}`}
            >
              <Bell size={17} className="text-gray-600 dark:text-gray-400" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-primary rounded-full ring-2 ring-[#e0e5ec] dark:ring-[#252838]" />
            </button>

            {/* Avatar */}
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
