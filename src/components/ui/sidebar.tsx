import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard, FileText, MessageSquare, Star, Palette,
  Settings, LogOut, Bell, Sun, Moon, ChevronDown,
  TrendingUp, Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/ui/ThemeProvider";
import { useLanguage } from "@/contexts/LanguageContext";
import LanguageSwitcher from "@/components/ui/LanguageSwitcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarRail,
  SidebarSeparator,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";

// ─── Types ──────────────────────────────────────────────────────────────────

interface DashboardLayoutProps {
  children: React.ReactNode;
}

// ─── Menu config ─────────────────────────────────────────────────────────────

const menuItems = [
  { icon: LayoutDashboard, labelKey: "sidebar.dashboard",   path: "/dashboard",         group: "main" },
  { icon: FileText,        labelKey: "sidebar.posts",       path: "/dashboard/posts",   group: "main" },
  { icon: MessageSquare,   labelKey: "sidebar.comments",    path: "/dashboard/comments",group: "main" },
  { icon: Star,            labelKey: "sidebar.ratings",     path: "/dashboard/ratings", group: "main" },
  { icon: Palette,         labelKey: "sidebar.brandColors", path: "/dashboard/colors",  group: "settings" },
  { icon: Settings,        labelKey: "sidebar.settings",    path: "/dashboard/settings",group: "settings" },
];

// ─── Inner Sidebar component (needs useSidebar context) ──────────────────────

const AppSidebar = () => {
  const location   = useLocation();
  const { t, direction } = useLanguage();
  const { state }  = useSidebar();
  const isCollapsed = state === "collapsed";

  const isActive = (path: string) => location.pathname === path;

  const mainItems     = menuItems.filter((i) => i.group === "main");
  const settingsItems = menuItems.filter((i) => i.group === "settings");

  return (
    <Sidebar collapsible="icon" side={direction === "rtl" ? "right" : "left"}>
      {/* ── Logo ── */}
      <SidebarHeader className="h-16 border-b border-sidebar-border px-3 justify-center">
        <Link to="/" className="flex items-center gap-3 overflow-hidden">
          {/* Logo mark */}
          <div className="relative flex-shrink-0 w-9 h-9">
            <div className="absolute inset-0 rounded-xl bg-gradient-primary shadow-glow opacity-90" />
            <div className="absolute inset-0 rounded-xl flex items-center justify-center">
              <span className="text-primary-foreground font-black text-lg leading-none">H</span>
            </div>
          </div>
          <AnimatePresence>
            {!isCollapsed && (
              <motion.div
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: "auto" }}
                exit={{ opacity: 0, width: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div className="flex flex-col leading-none">
                  <span className="text-sidebar-foreground font-black text-lg tracking-wide">HAYY</span>
                  <span className="text-muted-foreground text-[10px] font-medium tracking-widest uppercase">Platform</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </Link>
      </SidebarHeader>

      <SidebarContent className="py-3">

        {/* ── Main Group ── */}
        <SidebarGroup>
          {!isCollapsed && (
            <SidebarGroupLabel className="text-[10px] font-bold tracking-widest uppercase text-muted-foreground/60 mb-1">
              {t("sidebar.dashboard")}
            </SidebarGroupLabel>
          )}
          <SidebarGroupContent>
            <SidebarMenu>
              {mainItems.map((item) => (
                <SidebarMenuItem key={item.path}>
                  <SidebarMenuButton
                    asChild
                    isActive={isActive(item.path)}
                    tooltip={t(item.labelKey)}
                    size="lg"
                    className={`rounded-xl transition-all duration-200 ${
                      isActive(item.path)
                        ? "bg-gradient-primary text-primary-foreground shadow-glow hover:opacity-90"
                        : "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                    }`}
                  >
                    <Link to={item.path}>
                      <item.icon className="w-5 h-5 flex-shrink-0" />
                      <span className="font-medium">{t(item.labelKey)}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator />

        {/* ── Settings Group ── */}
        <SidebarGroup>
          {!isCollapsed && (
            <SidebarGroupLabel className="text-[10px] font-bold tracking-widest uppercase text-muted-foreground/60 mb-1">
              {t("sidebar.settings")}
            </SidebarGroupLabel>
          )}
          <SidebarGroupContent>
            <SidebarMenu>
              {settingsItems.map((item) => (
                <SidebarMenuItem key={item.path}>
                  <SidebarMenuButton
                    asChild
                    isActive={isActive(item.path)}
                    tooltip={t(item.labelKey)}
                    size="lg"
                    className={`rounded-xl transition-all duration-200 ${
                      isActive(item.path)
                        ? "bg-gradient-primary text-primary-foreground shadow-glow hover:opacity-90"
                        : "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                    }`}
                  >
                    <Link to={item.path}>
                      <item.icon className="w-5 h-5 flex-shrink-0" />
                      <span className="font-medium">{t(item.labelKey)}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* ── Pro Banner (visible when expanded) ── */}
        <AnimatePresence>
          {!isCollapsed && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.2 }}
              className="mx-3 mt-4"
            >
              <div className="relative rounded-2xl bg-gradient-primary p-4 overflow-hidden">
                {/* decorative circles */}
                <div className="absolute -top-4 -right-4 w-16 h-16 rounded-full bg-white/10" />
                <div className="absolute -bottom-3 -left-3 w-12 h-12 rounded-full bg-white/10" />
                <Sparkles className="w-5 h-5 text-white/90 mb-2" />
                <p className="text-white font-semibold text-sm leading-tight">Upgrade to Pro</p>
                <p className="text-white/70 text-xs mt-0.5 mb-3">Unlock advanced analytics &amp; AI tools</p>
                <button className="w-full bg-white text-primary text-xs font-bold py-1.5 rounded-lg hover:bg-white/90 transition-colors flex items-center justify-center gap-1">
                  <TrendingUp className="w-3.5 h-3.5" /> Upgrade Now
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </SidebarContent>

      {/* ── Footer: User Profile + Logout ── */}
      <SidebarFooter className="border-t border-sidebar-border p-3">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              tooltip={t("dashboard.businessName")}
              className="rounded-xl hover:bg-sidebar-accent transition-all duration-200"
            >
              <div className="w-8 h-8 rounded-full bg-gradient-primary flex items-center justify-center flex-shrink-0 shadow-glow">
                <span className="text-primary-foreground font-bold text-sm">A</span>
              </div>
              <div className="flex-1 min-w-0 text-start">
                <p className="font-semibold text-sidebar-foreground text-sm truncate">{t("dashboard.businessName")}</p>
                <p className="text-muted-foreground text-xs truncate">{t("dashboard.proPlan")}</p>
              </div>
              <ChevronDown className="w-4 h-4 text-muted-foreground flex-shrink-0" />
            </SidebarMenuButton>
          </SidebarMenuItem>

          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              tooltip={t("dashboard.signOut")}
              className="rounded-xl text-destructive hover:bg-destructive/10 hover:text-destructive transition-all duration-200"
            >
              <LogOut className="w-5 h-5 flex-shrink-0" />
              <span className="font-medium">{t("dashboard.signOut")}</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
};

// ─── Header ──────────────────────────────────────────────────────────────────

const AppHeader = () => {
  const location   = useLocation();
  const { theme, setTheme } = useTheme();
  const { t }      = useLanguage();
  const [hasNotif, setHasNotif] = useState(true);

  const activeItem = menuItems.find((item) => location.pathname === item.path);
  const pageTitle  = activeItem ? t(activeItem.labelKey) : t("sidebar.dashboard");

  return (
    <header className="sticky top-0 z-30 h-16 bg-background/80 backdrop-blur-xl border-b border-border flex items-center justify-between px-4 lg:px-6">
      <div className="flex items-center gap-3">
        {/* shadcn trigger — handles mobile & desktop collapse */}
        <SidebarTrigger className="text-foreground hover:bg-secondary rounded-lg w-9 h-9" />

        {/* Breadcrumb-style title */}
        <div className="hidden sm:flex items-center gap-2 text-sm">
          <span className="text-muted-foreground">HAYY</span>
          <span className="text-muted-foreground/40">/</span>
          <span className="font-semibold text-foreground">{pageTitle}</span>
        </div>
      </div>

      <div className="flex items-center gap-1.5">
        <LanguageSwitcher />

        {/* Theme Toggle */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="w-9 h-9 flex items-center justify-center hover:bg-secondary rounded-lg transition-colors"
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={theme}
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              {theme === "dark"
                ? <Sun  className="w-4.5 h-4.5 text-foreground" />
                : <Moon className="w-4.5 h-4.5 text-foreground" />}
            </motion.div>
          </AnimatePresence>
        </motion.button>

        {/* Notifications */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setHasNotif(false)}
          className="relative w-9 h-9 flex items-center justify-center hover:bg-secondary rounded-lg transition-colors"
        >
          <Bell className="w-4.5 h-4.5 text-foreground" />
          <AnimatePresence>
            {hasNotif && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                className="absolute top-1.5 right-1.5 w-2 h-2 bg-primary rounded-full ring-2 ring-background"
              />
            )}
          </AnimatePresence>
        </motion.button>

        {/* Avatar */}
        <div className="hidden sm:flex w-8 h-8 rounded-full bg-gradient-primary items-center justify-center ms-1 shadow-glow cursor-pointer">
          <span className="text-primary-foreground font-bold text-sm">A</span>
        </div>
      </div>
    </header>
  );
};

// ─── Layout Root ─────────────────────────────────────────────────────────────

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const { direction } = useLanguage();

  return (
    <div dir={direction} className="min-h-screen bg-background">
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <AppHeader />
          <main className="flex-1 p-4 lg:p-6">
            {children}
          </main>
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
};

export default DashboardLayout;