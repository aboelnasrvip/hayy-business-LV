import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Sun, Moon } from "lucide-react";
import { Link } from "react-router-dom";
import { useTheme } from "@/components/ui/ThemeProvider";
import { useLanguage } from "@/contexts/LanguageContext";

const neuNav =
  "bg-[#e0e5ec] shadow-[8px_8px_18px_#b8bec7,-8px_-8px_18px_#ffffff] dark:bg-[#252838] dark:shadow-[6px_6px_16px_#12151f,-6px_-6px_16px_#2e3248]";
const neuBtn =
  "bg-[#e0e5ec] shadow-[3px_3px_7px_#b8bec7,-3px_-3px_7px_#ffffff] dark:bg-[#252838] dark:shadow-[3px_3px_6px_#12151f,-3px_-3px_6px_#2e3248]";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const { t, direction } = useLanguage();

  const navItems = [
    { name: t("nav.about"), href: "#hero" },
    { name: t("nav.features"), href: "#features" },
    { name: t("nav.pricing"), href: "#pricing" },
    
  ];

  return (
    <div
      className="fixed top-4 left-0 right-0 z-50 flex justify-center px-4"
      dir={direction}
    >
      <motion.div
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className={`w-full max-w-4xl rounded-[2rem] px-5 py-3 ${neuNav}`}
      >
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div
              className={`w-9 h-9 rounded-xl flex items-center justify-center ${neuBtn}`}
            >
              <span className="text-primary font-black text-base">H</span>
            </div>
            <span className="font-black text-lg text-gray-700 dark:text-white">
              HAYY
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="px-4 py-2 rounded-xl text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-primary transition-colors"
              >
                {item.name}
              </a>
            ))}
          </div>

          {/* Right side */}
          <div className="hidden md:flex items-center gap-2">
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className={`w-9 h-9 flex items-center justify-center rounded-xl transition-all ${neuBtn}`}
            >
              {theme === "dark" ? (
                <Sun size={16} className="text-primary" />
              ) : (
                <Moon size={16} className="text-gray-500" />
              )}
            </button>
            <Link to="/login">
              <button
                className={`px-4 py-2 rounded-xl text-sm font-semibold text-gray-600 dark:text-gray-300 transition-all ${neuBtn}`}
              >
                {t("nav.signIn")}
              </button>
            </Link>
            <Link to="/register">
              <button className="px-4 py-2 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-primary to-orange-500 shadow-[3px_3px_8px_#b8bec7,-1px_-1px_4px_#ffffff] dark:shadow-[3px_3px_8px_#12151f] hover:opacity-90 transition-all">
                {t("nav.getStarted")}
              </button>
            </Link>
          </div>

          {/* Mobile */}
          <div className="md:hidden flex items-center gap-2">
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className={`w-9 h-9 flex items-center justify-center rounded-xl ${neuBtn}`}
            >
              {theme === "dark" ? (
                <Sun size={16} className="text-primary" />
              ) : (
                <Moon size={16} className="text-gray-500" />
              )}
            </button>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className={`w-9 h-9 flex items-center justify-center rounded-xl ${neuBtn}`}
            >
              {isOpen ? (
                <X size={18} className="text-gray-600 dark:text-gray-300" />
              ) : (
                <Menu size={18} className="text-gray-600 dark:text-gray-300" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25 }}
              className="md:hidden overflow-hidden mt-3 pt-3 border-t border-gray-200/50 dark:border-white/5"
            >
              <div className="flex flex-col gap-1 pb-1">
                {navItems.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className="px-4 py-3 rounded-xl text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-primary transition-colors"
                  >
                    {item.name}
                  </a>
                ))}
                <div className="flex gap-2 pt-2">
                  <Link
                    to="/login"
                    className="flex-1"
                    onClick={() => setIsOpen(false)}
                  >
                    <button
                      className={`w-full py-2.5 rounded-xl text-sm font-semibold text-gray-600 dark:text-gray-300 ${neuBtn}`}
                    >
                      {t("nav.signIn")}
                    </button>
                  </Link>
                  <Link
                    to="/register"
                    className="flex-1"
                    onClick={() => setIsOpen(false)}
                  >
                    <button className="w-full py-2.5 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-primary to-orange-500 hover:opacity-90 transition-all">
                      {t("nav.getStarted")}
                    </button>
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default Navbar;
