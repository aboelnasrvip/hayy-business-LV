import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Upload, ArrowRight, Building2, Phone, Globe, FileText, CheckCircle, Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useTheme } from "@/components/ui/ThemeProvider";
import { useLanguage } from "@/contexts/LanguageContext";
import LanguageSwitcher from "@/components/ui/LanguageSwitcher";

const ProfileSetup = () => {
  const [step, setStep] = useState(1);
  const [uploadedDocs, setUploadedDocs] = useState<string[]>([]);
  const { theme, setTheme } = useTheme();
  const { t, direction } = useLanguage();

  const steps = [
    { number: 1, titleKey: "profile.step1" },
    { number: 2, titleKey: "profile.step2" },
    { number: 3, titleKey: "profile.step3" },
  ];

  const handleFileUpload = (docType: string) => {
    if (!uploadedDocs.includes(docType)) {
      setUploadedDocs([...uploadedDocs, docType]);
    }
  };

  const documents = [
    { id: "tax", nameKey: "profile.doc.tax", descKey: "profile.doc.taxDesc" },
    { id: "id", nameKey: "profile.doc.id", descKey: "profile.doc.idDesc" },
    { id: "license", nameKey: "profile.doc.license", descKey: "profile.doc.licenseDesc" },
  ];

  return (
    <div className="min-h-screen bg-background" dir={direction}>
      <header className="border-b border-border bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center shadow-glow">
              <span className="text-primary-foreground font-bold text-xl">H</span>
            </div>
            <span className="text-2xl font-bold text-foreground">HAYY</span>
          </Link>
          <div className="flex items-center gap-2">
            <LanguageSwitcher />
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="p-2 rounded-lg hover:bg-secondary transition-colors"
            >
              {theme === "dark" ? <Sun className="w-5 h-5 text-foreground" /> : <Moon className="w-5 h-5 text-foreground" />}
            </motion.button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12 max-w-3xl">
        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-12">
          {steps.map((s, index) => (
            <div key={s.number} className="flex items-center">
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: step >= s.number ? 1 : 0.8 }}
                className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all ${
                  step >= s.number
                    ? "bg-gradient-primary text-primary-foreground shadow-glow"
                    : "bg-secondary text-muted-foreground"
                }`}
              >
                {step > s.number ? <CheckCircle className="w-5 h-5" /> : s.number}
              </motion.div>
              <span className={`ms-2 text-sm font-medium ${step >= s.number ? "text-foreground" : "text-muted-foreground"}`}>
                {t(s.titleKey)}
              </span>
              {index < steps.length - 1 && (
                <div className={`w-16 h-1 mx-4 rounded-full transition-all ${step > s.number ? "bg-primary" : "bg-secondary"}`} />
              )}
            </div>
          ))}
        </div>

        {/* Step 1 */}
        {step === 1 && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-foreground mb-2">{t("profile.step1.title")}</h1>
              <p className="text-muted-foreground">{t("profile.step1.subtitle")}</p>
            </div>

            <div className="bg-card border border-border rounded-2xl p-6 space-y-5">
              <div className="space-y-2">
                <Label className="text-foreground">{t("profile.businessName")}</Label>
                <div className="relative">
                  <Building2 className="absolute start-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input placeholder={t("profile.businessNamePlaceholder")} className="ps-10 h-12 bg-input" />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-foreground">{t("profile.phone")}</Label>
                <div className="relative">
                  <Phone className="absolute start-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input placeholder={t("profile.phonePlaceholder")} className="ps-10 h-12 bg-input" />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-foreground">{t("profile.website")}</Label>
                <div className="relative">
                  <Globe className="absolute start-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input placeholder={t("profile.websitePlaceholder")} className="ps-10 h-12 bg-input" />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-foreground">{t("profile.description")}</Label>
                <Textarea placeholder={t("profile.descriptionPlaceholder")} className="min-h-[120px] bg-input resize-none" />
              </div>

              <div className="space-y-2">
                <Label className="text-foreground">{t("profile.logo")}</Label>
                <div className="border-2 border-dashed border-border rounded-xl p-8 text-center hover:border-primary/50 transition-colors cursor-pointer">
                  <Upload className="w-10 h-10 mx-auto text-muted-foreground mb-3" />
                  <p className="text-sm text-muted-foreground">
                    {t("profile.logoDragDrop")} <span className="text-primary">{t("profile.logoBrowse")}</span>
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">{t("profile.logoSize")}</p>
                </div>
              </div>
            </div>

            <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
              <Button onClick={() => setStep(2)} className="w-full h-12 bg-gradient-primary hover:opacity-90 transition-all shadow-glow text-base font-semibold">
                {t("profile.continueVerification")}
                <ArrowRight className="ms-2 w-5 h-5 rtl:rotate-180" />
              </Button>
            </motion.div>
          </motion.div>
        )}

        {/* Step 2 */}
        {step === 2 && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-foreground mb-2">{t("profile.step2.title")}</h1>
              <p className="text-muted-foreground">{t("profile.step2.subtitle")}</p>
            </div>

            <div className="space-y-4">
              {documents.map((doc) => (
                <motion.div
                  key={doc.id}
                  whileHover={{ scale: 1.01 }}
                  className={`bg-card border rounded-2xl p-5 cursor-pointer transition-all ${
                    uploadedDocs.includes(doc.id) ? "border-primary bg-accent/30" : "border-border hover:border-primary/50"
                  }`}
                  onClick={() => handleFileUpload(doc.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${uploadedDocs.includes(doc.id) ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground"}`}>
                        <FileText className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground">{t(doc.nameKey)}</h3>
                        <p className="text-sm text-muted-foreground">{t(doc.descKey)}</p>
                      </div>
                    </div>
                    {uploadedDocs.includes(doc.id) ? <CheckCircle className="w-6 h-6 text-primary" /> : <Upload className="w-6 h-6 text-muted-foreground" />}
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="flex gap-4">
              <Button variant="outline" onClick={() => setStep(1)} className="flex-1 h-12 text-base">
                {t("profile.back")}
              </Button>
              <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }} className="flex-1">
                <Button onClick={() => setStep(3)} className="w-full h-12 bg-gradient-primary hover:opacity-90 transition-all shadow-glow text-base font-semibold">
                  {t("profile.completeSetup")}
                  <ArrowRight className="ms-2 w-5 h-5 rtl:rotate-180" />
                </Button>
              </motion.div>
            </div>
          </motion.div>
        )}

        {/* Step 3 */}
        {step === 3 && (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-12">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
              className="w-24 h-24 mx-auto mb-8 rounded-full bg-accent flex items-center justify-center"
            >
              <CheckCircle className="w-12 h-12 text-primary" />
            </motion.div>

            <h1 className="text-3xl font-bold text-foreground mb-3">{t("profile.step3.title")}</h1>
            <p className="text-lg text-muted-foreground mb-8 max-w-md mx-auto">{t("profile.step3.subtitle")}</p>

            <Link to="/dashboard">
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button className="h-12 px-8 bg-gradient-primary hover:opacity-90 transition-all shadow-glow text-base font-semibold">
                  {t("profile.goToDashboard")}
                  <ArrowRight className="ms-2 w-5 h-5 rtl:rotate-180" />
                </Button>
              </motion.div>
            </Link>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default ProfileSetup;
