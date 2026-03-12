import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Facebook, Twitter, Instagram, Linkedin, Mail } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const Footer = () => {
  const { t, direction } = useLanguage();

  const footerLinks = {
    product: [
      { nameKey: "footer.link.features", href: "#features" },
      { nameKey: "footer.link.pricing", href: "#pricing" },
      { nameKey: "footer.link.api", href: "#" },
      { nameKey: "footer.link.integrations", href: "#" },
    ],
    company: [
      { nameKey: "footer.link.about", href: "#about" },
      { nameKey: "footer.link.blog", href: "#" },
      { nameKey: "footer.link.careers", href: "#" },
      { nameKey: "footer.link.contact", href: "#" },
    ],
    support: [
      { nameKey: "footer.link.helpCenter", href: "#" },
      { nameKey: "footer.link.documentation", href: "#" },
      { nameKey: "footer.link.status", href: "#" },
      { nameKey: "footer.link.termsOfService", href: "#" },
    ],
  };

  const socialLinks = [
    { icon: Facebook, href: "#" },
    { icon: Twitter, href: "#" },
    { icon: Instagram, href: "#" },
    { icon: Linkedin, href: "#" },
    { icon: Mail, href: "#" },
  ];

  return (
    <footer className="relative pt-20 pb-10 bg-card border-t border-border" dir={direction}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link to="/" className="inline-flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-xl">H</span>
              </div>
              <span className="text-2xl font-bold text-foreground">HAYY</span>
            </Link>
            <p className="text-muted-foreground max-w-sm mb-6">
              {t("footer.description")}
            </p>
            <div className="flex items-center gap-3">
              {socialLinks.map((social, index) => (
                <motion.a
                  key={index}
                  href={social.href}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors"
                >
                  <social.icon className="w-5 h-5" />
                </motion.a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-foreground mb-4">{t("footer.product")}</h4>
            <ul className="space-y-3">
              {footerLinks.product.map((link) => (
                <li key={link.nameKey}>
                  <a href={link.href} className="text-muted-foreground hover:text-foreground transition-colors">
                    {t(link.nameKey)}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-foreground mb-4">{t("footer.company")}</h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.nameKey}>
                  <a href={link.href} className="text-muted-foreground hover:text-foreground transition-colors">
                    {t(link.nameKey)}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-foreground mb-4">{t("footer.support")}</h4>
            <ul className="space-y-3">
              {footerLinks.support.map((link) => (
                <li key={link.nameKey}>
                  <a href={link.href} className="text-muted-foreground hover:text-foreground transition-colors">
                    {t(link.nameKey)}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} HAYY. {t("footer.rights")}
          </p>
          <div className="flex items-center gap-6">
            <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              {t("footer.privacy")}
            </a>
            <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              {t("footer.terms")}
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
