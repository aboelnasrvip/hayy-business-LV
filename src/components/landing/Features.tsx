import { motion } from "framer-motion";
import {
  Zap,
  MessageSquare,
  BarChart3,
  Palette,
  Image as ImageIcon,
  Shield,
  Sparkles,
  Globe,
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const neuCard =
  "rounded-[1.5rem] bg-[#e8ecf3] shadow-[10px_10px_22px_#adb5c0,-10px_-10px_22px_#ffffff] dark:bg-[#2b2e42] dark:shadow-[8px_8px_18px_#0e1020,-8px_-8px_18px_#343750]";
const neuSmall =
  "bg-[#e0e5ec] shadow-[3px_3px_7px_#b8bec7,-3px_-3px_7px_#ffffff] dark:bg-[#252838] dark:shadow-[3px_3px_6px_#12151f,-3px_-3px_6px_#2e3248]";

const Features = () => {
  const { t, direction } = useLanguage();

  const features = [
    {
      icon: Zap,
      titleKey: "features.ai.title",
      descKey: "features.ai.description",
    },
    {
      icon: MessageSquare,
      titleKey: "features.comments.title",
      descKey: "features.comments.description",
    },
    {
      icon: BarChart3,
      titleKey: "features.analytics.title",
      descKey: "features.analytics.description",
    },
    {
      icon: Palette,
      titleKey: "features.branding.title",
      descKey: "features.branding.description",
    },
    {
      icon: ImageIcon,
      titleKey: "features.media.title",
      descKey: "features.media.description",
    },
    {
      icon: Shield,
      titleKey: "features.verified.title",
      descKey: "features.verified.description",
    },
    {
      icon: Sparkles,
      titleKey: "features.smart.title",
      descKey: "features.smart.description",
    },
    {
      icon: Globe,
      titleKey: "features.multilang.title",
      descKey: "features.multilang.description",
    },
  ];

  return (
    <section
      id="features"
      className="py-24 px-4 bg-[#e0e5ec] dark:bg-[#252838]"
      dir={direction}
    >
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-full mb-5 ${neuSmall}`}
          >
            <Sparkles size={14} className="text-primary" />
            <span className="text-xs font-semibold text-gray-600 dark:text-gray-300">
              {t("features.badge")}
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-gray-700 dark:text-white mb-4">
            {t("features.title")}
            <span className="bg-gradient-to-r from-primary to-orange-400 bg-clip-text text-transparent">
              {t("features.titleHighlight")}
            </span>
          </h2>
          <p className="text-base text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
            {t("features.subtitle")}
          </p>
        </motion.div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ delay: index * 0.07, duration: 0.5 }}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
              className={`p-6 flex flex-col gap-4 relative overflow-hidden ${neuCard}`}
            >
              {/* subtle accent line on hover via gradient overlay */}
              <div className="absolute top-0 left-4 right-4 h-[2px] rounded-full bg-gradient-to-r from-primary to-orange-400 opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-orange-500 flex items-center justify-center shadow-[3px_3px_8px_#adb5c0] dark:shadow-[3px_3px_8px_#0e1020]">
                <feature.icon size={22} className="text-white" />
              </div>
              <div>
                <h3 className="font-bold text-gray-700 dark:text-white mb-2">
                  {t(feature.titleKey)}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                  {t(feature.descKey)}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
