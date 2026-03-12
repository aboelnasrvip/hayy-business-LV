import { motion } from "framer-motion";
import { Check, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";

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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.15 } },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <section id="pricing" className="py-24 relative overflow-hidden" dir={direction}>
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <span className="inline-block px-4 py-2 rounded-full bg-accent text-accent-foreground text-sm font-medium mb-4">
            {t("pricing.badge")}
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-6">
            {t("pricing.title")}<span className="text-gradient">{t("pricing.titleHighlight")}</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            {t("pricing.subtitle")}
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto"
        >
          {plans.map((plan, index) => (
            <motion.div
              key={index}
              variants={cardVariants}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
              className={`relative p-8 rounded-3xl border ${
                plan.popular
                  ? "bg-gradient-to-b from-card to-accent/20 border-primary shadow-glow"
                  : "bg-card border-border"
              } transition-all duration-300`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-gradient-primary text-primary-foreground text-sm font-medium shadow-glow">
                    <Sparkles className="w-4 h-4" />
                    {t("pricing.pro.popular")}
                  </div>
                </div>
              )}

              <div className="text-center mb-8">
                <h3 className="text-xl font-semibold text-foreground mb-2">{t(plan.nameKey)}</h3>
                <div className="flex items-baseline justify-center gap-1 mb-3">
                  <span className="text-4xl font-bold text-foreground">{t(plan.priceKey)}</span>
                  {plan.periodKey && (
                    <span className="text-muted-foreground">{t(plan.periodKey)}</span>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">{t(plan.descKey)}</p>
              </div>

              <ul className="space-y-4 mb-8">
                {plan.featureKeys.map((fk) => (
                  <li key={fk} className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check className="w-3 h-3 text-primary" />
                    </div>
                    <span className="text-sm text-foreground">{t(fk)}</span>
                  </li>
                ))}
              </ul>

              <Link to="/register">
                <Button
                  className={`w-full py-6 text-base font-medium rounded-xl ${
                    plan.popular
                      ? "bg-gradient-primary hover:opacity-90 shadow-glow"
                      : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                  } transition-all`}
                >
                  {t(plan.ctaKey)}
                </Button>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Pricing;
