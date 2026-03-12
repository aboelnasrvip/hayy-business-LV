import { motion } from "framer-motion";
import { Languages } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const LanguageSwitcher = () => {
  const { language, setLanguage } = useLanguage();

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={() => setLanguage(language === "en" ? "ar" : "en")}
      className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-secondary transition-colors text-sm font-medium"
    >
      <Languages className="w-4 h-4" />
      <span>{language === "en" ? "العربية" : "English"}</span>
    </motion.button>
  );
};

export default LanguageSwitcher;
