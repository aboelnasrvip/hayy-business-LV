import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Facebook, Twitter, Instagram, Linkedin, Mail } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const neuSmall =
  "bg-[#e0e5ec] shadow-[3px_3px_7px_#b8bec7,-3px_-3px_7px_#ffffff] dark:bg-[#252838] dark:shadow-[3px_3px_6px_#12151f,-3px_-3px_6px_#2e3248]";
const neuInset =
  "bg-[#e0e5ec] shadow-[inset_3px_3px_7px_#b8bec7,inset_-3px_-3px_7px_#ffffff] dark:bg-[#252838] dark:shadow-[inset_3px_3px_6px_#12151f,inset_-3px_-3px_6px_#2e3248]";

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
    <footer
      className="pt-20 pb-10 px-4 bg-[#e0e5ec] dark:bg-[#252838]"
      dir={direction}
    >
      <div className="container mx-auto max-w-6xl">
        {/* Top divider */}
        <div className={`w-full h-px mb-16 ${neuInset} rounded-full`} />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link to="/" className="inline-flex items-center gap-2 mb-4">
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center ${neuSmall}`}
              >
                <span className="text-primary font-black text-xl">H</span>
              </div>
              <span className="text-2xl font-black text-gray-700 dark:text-white">
                HAYY
              </span>
            </Link>
            <p className="text-sm text-gray-500 dark:text-gray-400 max-w-sm mb-6 leading-relaxed">
              {t("footer.description")}
            </p>
            <div className="flex items-center gap-2">
              {socialLinks.map((social, index) => (
                <motion.a
                  key={index}
                  href={social.href}
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className={`w-10 h-10 rounded-xl flex items-center justify-center text-gray-500 dark:text-gray-400 hover:text-primary transition-colors ${neuSmall}`}
                >
                  <social.icon size={16} />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Links */}
          {[
            { title: t("footer.product"), links: footerLinks.product },
            { title: t("footer.company"), links: footerLinks.company },
            { title: t("footer.support"), links: footerLinks.support },
          ].map((col) => (
            <div key={col.title}>
              <h4 className="font-bold text-gray-700 dark:text-white mb-4 text-sm">
                {col.title}
              </h4>
              <ul className="space-y-3">
                {col.links.map((link) => (
                  <li key={link.nameKey}>
                    <a
                      href={link.href}
                      className="text-sm text-gray-500 dark:text-gray-400 hover:text-primary transition-colors"
                    >
                      {t(link.nameKey)}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div className={`w-full h-px mb-8 ${neuInset} rounded-full`} />
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-400">
            © {new Date().getFullYear()} HAYY. {t("footer.rights")}
          </p>
          <div className="flex items-center gap-6">
            <a
              href="#"
              className="text-sm text-gray-400 hover:text-primary transition-colors"
            >
              {t("footer.privacy")}
            </a>
            <a
              href="#"
              className="text-sm text-gray-400 hover:text-primary transition-colors"
            >
              {t("footer.terms")}
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
