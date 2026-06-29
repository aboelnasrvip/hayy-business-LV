import { motion } from "framer-motion";
import { ArrowRight, Sparkles, TrendingUp, Users, Star } from "lucide-react";
import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";

const neuCard =
  "rounded-[1.5rem] bg-[#e8ecf3] shadow-[10px_10px_22px_#adb5c0,-10px_-10px_22px_#ffffff] dark:bg-[#2b2e42] dark:shadow-[8px_8px_18px_#0e1020,-8px_-8px_18px_#343750]";
const neuSmall =
  "bg-[#e0e5ec] shadow-[3px_3px_7px_#b8bec7,-3px_-3px_7px_#ffffff] dark:bg-[#252838] dark:shadow-[3px_3px_6px_#12151f,-3px_-3px_6px_#2e3248]";
const neuInset =
  "bg-[#e0e5ec] shadow-[inset_3px_3px_7px_#b8bec7,inset_-3px_-3px_7px_#ffffff] dark:bg-[#252838] dark:shadow-[inset_3px_3px_6px_#12151f,inset_-3px_-3px_6px_#2e3248]";

const Hero = () => {
  const { t, direction } = useLanguage();

  const stats = [
    { icon: Users, value: "10K+", label: t("hero.stat.businesses") },
    { icon: TrendingUp, value: "500%", label: t("hero.stat.growth") },
    { icon: Sparkles, value: "50M+", label: t("hero.stat.reach") },
  ];

  return (
    <section
      className="min-h-screen flex items-center pt-28 pb-16 px-4 bg-[#e0e5ec] dark:bg-[#252838]"
      dir={direction}
      id="hero"
    >
      <div className="container mx-auto max-w-6xl">
        <div className="grid lg:grid-cols-2 gap-14 items-center">
          {/* ── Left: Content ── */}
          <motion.div
            initial={{ opacity: 0, x: direction === "rtl" ? 40 : -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="flex flex-col gap-6"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-full w-fit ${neuSmall}`}
            >
              <Sparkles size={14} className="text-primary" />
              <span className="text-xs font-semibold text-gray-600 dark:text-gray-300">
                {t("hero.badge")}
              </span>
            </motion.div>

            {/* Heading */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-black leading-tight text-gray-700 dark:text-white"
            >
              {t("hero.title")}
              <br />
              <span className="bg-gradient-to-r from-primary to-orange-400 bg-clip-text text-transparent">
                {t("hero.titleHighlight")}
              </span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-base text-gray-500 dark:text-gray-400 leading-relaxed max-w-lg"
            >
              {t("hero.subtitle")}
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-3"
            >
              <Link to="/register">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex items-center gap-2 px-7 py-3.5 rounded-2xl font-bold text-white text-base
                    bg-gradient-to-r from-primary to-orange-500
                    shadow-[6px_6px_14px_#adb5c0,-2px_-2px_6px_#ffffff,inset_0_1px_0_rgba(255,255,255,0.15)]
                    dark:shadow-[5px_5px_12px_#0e1020,-2px_-2px_6px_#2e3248]
                    hover:opacity-90 transition-all"
                >
                  {t("hero.cta")}
                  <ArrowRight
                    size={18}
                    className={direction === "rtl" ? "rotate-180" : ""}
                  />
                </motion.button>
              </Link>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`flex items-center gap-2 px-7 py-3.5 rounded-2xl font-semibold text-base text-gray-600 dark:text-gray-300 transition-all ${neuSmall}`}
              >
                {t("hero.secondaryCta")}
              </motion.button>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="grid grid-cols-3 gap-3 pt-2"
            >
              {stats.map((stat, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 + i * 0.1 }}
                  className={`flex flex-col items-center py-4 px-2 rounded-2xl ${neuCard}`}
                >
                  <stat.icon size={18} className="text-primary mb-1" />
                  <span className="text-xl font-black text-gray-700 dark:text-white">
                    {stat.value}
                  </span>
                  <span className="text-[10px] text-gray-400 text-center leading-tight mt-0.5">
                    {stat.label}
                  </span>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* ── Right: Dashboard Mockup ── */}
          <motion.div
            initial={{ opacity: 0, x: direction === "rtl" ? -40 : 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="hidden lg:flex justify-center"
          >
            <div
              className={`w-full max-w-[400px] p-6 relative overflow-hidden ${neuCard}`}
            >
              {/* accent top line */}
              <div className="absolute top-0 left-8 right-8 h-[3px] rounded-full bg-gradient-to-r from-primary to-orange-400" />

              {/* Header */}
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2">
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center ${neuInset}`}
                  >
                    <span className="text-sm font-black text-primary">A</span>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-700 dark:text-white leading-none">
                      Al-Nour Café
                    </p>
                    <p className="text-[10px] text-gray-400">
                      Business Dashboard
                    </p>
                  </div>
                </div>
                <div
                  className={`px-2.5 py-1 rounded-full text-[10px] font-bold text-primary ${neuInset}`}
                >
                  ✓ Verified
                </div>
              </div>

              {/* KPIs */}
              <div className="grid grid-cols-3 gap-2 mb-4">
                {[
                  { label: "Views", value: "2.4K", change: "+12%" },
                  { label: "Comments", value: "183", change: "+8%" },
                  { label: "Rating", value: "4.8★", change: "+0.3" },
                ].map((kpi) => (
                  <div key={kpi.label} className={`p-3 rounded-xl ${neuInset}`}>
                    <p className="text-[10px] text-gray-400">{kpi.label}</p>
                    <p className="text-sm font-black text-gray-700 dark:text-white">
                      {kpi.value}
                    </p>
                    <p className="text-[9px] font-semibold text-green-500">
                      {kpi.change}
                    </p>
                  </div>
                ))}
              </div>

              {/* Chart */}
              <div className={`p-4 rounded-xl mb-4 ${neuInset}`}>
                <p className="text-[10px] text-gray-400 mb-3">
                  Weekly Engagement
                </p>
                <div className="flex items-end gap-1.5 h-14">
                  {[35, 55, 42, 70, 60, 85, 65].map((h, i) => (
                    <motion.div
                      key={i}
                      initial={{ scaleY: 0 }}
                      animate={{ scaleY: 1 }}
                      transition={{
                        delay: 0.8 + i * 0.07,
                        duration: 0.4,
                        ease: "easeOut",
                      }}
                      style={{ height: `${h}%`, transformOrigin: "bottom" }}
                      className="flex-1 rounded-t bg-gradient-to-t from-primary to-orange-400 opacity-80"
                    />
                  ))}
                </div>
              </div>

              {/* Comments */}
              <div className="space-y-2">
                {[
                  { name: "Sara M.", text: "Amazing place! 🌟", stars: 5 },
                  {
                    name: "Ahmed K.",
                    text: "Great service, will return!",
                    stars: 4,
                  },
                ].map((c, i) => (
                  <div
                    key={i}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl ${neuSmall}`}
                  >
                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-primary to-orange-400 flex items-center justify-center shrink-0">
                      <span className="text-[10px] font-bold text-white">
                        {c.name[0]}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[10px] font-bold text-gray-700 dark:text-white truncate">
                        {c.name}
                      </p>
                      <p className="text-[10px] text-gray-400 truncate">
                        {c.text}
                      </p>
                    </div>
                    <div className="flex gap-0.5 shrink-0">
                      {Array.from({ length: c.stars }).map((_, j) => (
                        <Star
                          key={j}
                          size={8}
                          className="fill-primary text-primary"
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
