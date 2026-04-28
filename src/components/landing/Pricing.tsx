import { motion } from "framer-motion";
import { Check, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";

const neuCard =
  "rounded-[1.5rem] bg-[#e8ecf3] shadow-[10px_10px_22px_#adb5c0,-10px_-10px_22px_#ffffff] dark:bg-[#2b2e42] dark:shadow-[8px_8px_18px_#0e1020,-8px_-8px_18px_#343750]";
const neuCardPop =
  "rounded-[1.5rem] bg-[#e8ecf3] shadow-[14px_14px_28px_#adb5c0,-14px_-14px_28px_#ffffff] dark:bg-[#2b2e42] dark:shadow-[12px_12px_24px_#0a0d18,-12px_-12px_24px_#383c55]";
const neuSmall =
  "bg-[#e0e5ec] shadow-[3px_3px_7px_#b8bec7,-3px_-3px_7px_#ffffff] dark:bg-[#252838] dark:shadow-[3px_3px_6px_#12151f,-3px_-3px_6px_#2e3248]";
const neuInset =
  "bg-[#e0e5ec] shadow-[inset_3px_3px_7px_#b8bec7,inset_-3px_-3px_7px_#ffffff] dark:bg-[#252838] dark:shadow-[inset_3px_3px_6px_#12151f,inset_-3px_-3px_6px_#2e3248]";

const Pricing = () => {
  const { t, direction } = useLanguage();

  const plans = [
    {
      nameKey: "pricing.starter.name",
      priceKey: "pricing.starter.price",
      periodKey: "",
      descKey: "pricing.starter.description",
      featureKeys: [
        "pricing.feature.posts5",
        "pricing.feature.basicAnalytics",
        "pricing.feature.commentMgmt",
        "pricing.feature.emailSupport",
        "pricing.feature.standardBadge",
      ],
      ctaKey: "pricing.starter.cta",
      popular: false,
    },
    {
      nameKey: "pricing.pro.name",
      priceKey: "pricing.pro.price",
      periodKey: "pricing.pro.period",
      descKey: "pricing.pro.description",
      featureKeys: [
        "pricing.feature.unlimitedPosts",
        "pricing.feature.advancedAnalytics",
        "pricing.feature.aiRecommendations",
        "pricing.feature.prioritySupport",
        "pricing.feature.verifiedBadge",
        "pricing.feature.customColors",
        "pricing.feature.multiLang",
      ],
      ctaKey: "pricing.pro.cta",
      popular: true,
    },
    {
      nameKey: "pricing.enterprise.name",
      priceKey: "pricing.enterprise.price",
      periodKey: "pricing.enterprise.period",
      descKey: "pricing.enterprise.description",
      featureKeys: [
        "pricing.feature.everythingPro",
        "pricing.feature.teamMembers",
        "pricing.feature.apiAccess",
        "pricing.feature.accountManager",
        "pricing.feature.customIntegrations",
        "pricing.feature.whiteLabel",
        "pricing.feature.sla",
      ],
      ctaKey: "pricing.enterprise.cta",
      popular: false,
    },
  ];

  return (
    <section
      id="pricing"
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
              {t("pricing.badge")}
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-gray-700 dark:text-white mb-4">
            {t("pricing.title")}
            <span className="bg-gradient-to-r from-primary to-orange-400 bg-clip-text text-transparent">
              {t("pricing.titleHighlight")}
            </span>
          </h2>
          <p className="text-base text-gray-500 dark:text-gray-400 max-w-xl mx-auto">
            {t("pricing.subtitle")}
          </p>
        </motion.div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto items-start">
          {plans.map((plan, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ delay: index * 0.12, duration: 0.5 }}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
              className={`relative flex flex-col p-7 ${plan.popular ? neuCardPop : neuCard} ${plan.popular ? "md:-mt-4 md:mb-4" : ""}`}
            >
              {/* Accent top line */}
              <div
                className={`absolute top-0 left-6 right-6 h-[3px] rounded-full ${plan.popular ? "bg-gradient-to-r from-primary to-orange-400" : "bg-gray-200/60 dark:bg-white/5"}`}
              />

              {/* Popular badge */}
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-gradient-to-r from-primary to-orange-500 text-white text-xs font-bold shadow-[3px_3px_8px_#adb5c0]">
                    <Sparkles size={11} />
                    {t("pricing.pro.popular")}
                  </div>
                </div>
              )}

              {/* Plan name & price */}
              <div className="text-center mb-6 mt-2">
                <h3 className="text-lg font-bold text-gray-700 dark:text-white mb-3">
                  {t(plan.nameKey)}
                </h3>
                <div
                  className={`inline-flex items-baseline justify-center gap-1 px-6 py-3 rounded-2xl mb-3 ${neuInset}`}
                >
                  <span className="text-3xl font-black text-gray-700 dark:text-white">
                    {t(plan.priceKey)}
                  </span>
                  {plan.periodKey && (
                    <span className="text-sm text-gray-400">
                      {t(plan.periodKey)}
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-400">{t(plan.descKey)}</p>
              </div>

              {/* Features */}
              <ul className="space-y-3 mb-8 flex-1">
                {plan.featureKeys.map((fk) => (
                  <li key={fk} className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-gradient-to-br from-primary to-orange-400 flex items-center justify-center shrink-0 mt-0.5">
                      <Check size={11} className="text-white" />
                    </div>
                    <span className="text-sm text-gray-600 dark:text-gray-300">
                      {t(fk)}
                    </span>
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <Link to="/register">
                <button
                  className={`w-full py-3 rounded-2xl text-sm font-bold transition-all
                    ${
                      plan.popular
                        ? "text-white bg-gradient-to-r from-primary to-orange-500 shadow-[4px_4px_10px_#adb5c0,-2px_-2px_6px_#ffffff] dark:shadow-[4px_4px_10px_#0e1020] hover:opacity-90"
                        : `text-gray-600 dark:text-gray-300 hover:text-primary ${neuSmall}`
                    }`}
                >
                  {t(plan.ctaKey)}
                </button>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Pricing;
