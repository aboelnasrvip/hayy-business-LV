import { useState } from "react";
import { motion } from "framer-motion";
import { Palette, RotateCcw, Download, Upload, Check, Eye, Sun, Moon } from "lucide-react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLanguage } from "@/contexts/LanguageContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface ColorConfig {
  primary: string;
  secondary: string;
  buttons: string;
  inputs: string;
  background: string;
  text: string;
}

interface BrandColorsState {
  light: ColorConfig;
  dark: ColorConfig;
}

const BrandColors = () => {
  const { t, direction } = useLanguage();
  
  const defaultColors: BrandColorsState = {
    light: {
      primary: "#FE5D17",
      secondary: "#F5F5F5",
      buttons: "#FE5D17",
      inputs: "#EFEFEF",
      background: "#F9F9F9",
      text: "#1A1A2E",
    },
    dark: {
      primary: "#FE5D17",
      secondary: "#1E1E2E",
      buttons: "#FE5D17",
      inputs: "#2A2A3E",
      background: "#0F0F1A",
      text: "#F5F5F5",
    },
  };

  const [colors, setColors] = useState<BrandColorsState>(defaultColors);
  const [savedMessage, setSavedMessage] = useState(false);
  const [activeMode, setActiveMode] = useState<"light" | "dark">("light");

  const colorOptions = [
    { key: "primary", label: t("colors.primary"), description: t("colors.primary.desc") },
    { key: "secondary", label: t("colors.secondary"), description: t("colors.secondary.desc") },
    { key: "buttons", label: t("colors.buttons"), description: t("colors.buttons.desc") },
    { key: "inputs", label: t("colors.inputs"), description: t("colors.inputs.desc") },
    { key: "background", label: t("colors.background"), description: t("colors.background.desc") },
    { key: "text", label: t("colors.text"), description: t("colors.text.desc") },
  ];

  const handleColorChange = (key: string, value: string) => {
    setColors({
      ...colors,
      [activeMode]: {
        ...colors[activeMode],
        [key]: value,
      },
    });
  };

  const handleReset = () => {
    setColors(defaultColors);
  };

  const handleSave = () => {
    // Save to localStorage for persistence
    localStorage.setItem("hayy-brand-colors", JSON.stringify(colors));
    setSavedMessage(true);
    setTimeout(() => setSavedMessage(false), 3000);
  };

  const handleExport = () => {
    const dataStr = JSON.stringify(colors, null, 2);
    const dataUri = "data:application/json;charset=utf-8," + encodeURIComponent(dataStr);
    const linkElement = document.createElement("a");
    linkElement.setAttribute("href", dataUri);
    linkElement.setAttribute("download", "brand-colors.json");
    linkElement.click();
  };

  const handleImport = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json";
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          try {
            const imported = JSON.parse(event.target?.result as string);
            if (imported.light && imported.dark) {
              setColors(imported);
            }
          } catch (error) {
            console.error("Failed to parse imported colors:", error);
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  const currentColors = colors[activeMode];

  const presets = [
    { 
      name: "HAYY Default", 
      light: ["#FE5D17", "#F5F5F5", "#FE5D17", "#EFEFEF", "#F9F9F9", "#1A1A2E"],
      dark: ["#FE5D17", "#1E1E2E", "#FE5D17", "#2A2A3E", "#0F0F1A", "#F5F5F5"],
    },
    { 
      name: "Ocean Blue", 
      light: ["#0EA5E9", "#F0F9FF", "#0EA5E9", "#E0F2FE", "#F8FAFC", "#0C4A6E"],
      dark: ["#38BDF8", "#0C4A6E", "#38BDF8", "#164E63", "#0F172A", "#E0F2FE"],
    },
    { 
      name: "Forest Green", 
      light: ["#22C55E", "#F0FDF4", "#22C55E", "#DCFCE7", "#F8FFF8", "#14532D"],
      dark: ["#4ADE80", "#14532D", "#4ADE80", "#166534", "#0A1F0F", "#DCFCE7"],
    },
    { 
      name: "Royal Purple", 
      light: ["#8B5CF6", "#FAF5FF", "#8B5CF6", "#EDE9FE", "#FAFAFA", "#4C1D95"],
      dark: ["#A78BFA", "#4C1D95", "#A78BFA", "#5B21B6", "#1A0A2E", "#EDE9FE"],
    },
  ];

  return (
    <DashboardLayout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-8"
        dir={direction}
      >
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground">{t("colors.title")}</h1>
            <p className="text-muted-foreground mt-1">{t("colors.subtitle")}</p>
          </div>
          <div className="flex gap-3 flex-wrap">
            <Button variant="outline" onClick={handleReset}>
              <RotateCcw className="w-4 h-4 me-2" />
              {t("colors.reset")}
            </Button>
            <Button variant="outline" onClick={handleExport}>
              <Download className="w-4 h-4 me-2" />
              {t("colors.export")}
            </Button>
            <Button variant="outline" onClick={handleImport}>
              <Upload className="w-4 h-4 me-2" />
              {t("colors.import")}
            </Button>
          </div>
        </div>

        {/* Mode Tabs */}
        <Tabs value={activeMode} onValueChange={(v) => setActiveMode(v as "light" | "dark")} className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="light" className="flex items-center gap-2">
              <Sun className="w-4 h-4" />
              {t("colors.lightMode")}
            </TabsTrigger>
            <TabsTrigger value="dark" className="flex items-center gap-2">
              <Moon className="w-4 h-4" />
              {t("colors.darkMode")}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="light" className="mt-6">
            <ColorEditor
              colors={colors.light}
              colorOptions={colorOptions}
              onColorChange={handleColorChange}
              onSave={handleSave}
              savedMessage={savedMessage}
              t={t}
              direction={direction}
              isDark={false}
            />
          </TabsContent>

          <TabsContent value="dark" className="mt-6">
            <ColorEditor
              colors={colors.dark}
              colorOptions={colorOptions}
              onColorChange={handleColorChange}
              onSave={handleSave}
              savedMessage={savedMessage}
              t={t}
              direction={direction}
              isDark={true}
            />
          </TabsContent>
        </Tabs>

        {/* Preset Palettes */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-card border border-border rounded-2xl p-6"
        >
          <h2 className="text-lg font-semibold text-foreground mb-4">{t("colors.presets")}</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {presets.map((preset) => (
              <motion.button
                key={preset.name}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() =>
                  setColors({
                    light: {
                      primary: preset.light[0],
                      secondary: preset.light[1],
                      buttons: preset.light[2],
                      inputs: preset.light[3],
                      background: preset.light[4],
                      text: preset.light[5],
                    },
                    dark: {
                      primary: preset.dark[0],
                      secondary: preset.dark[1],
                      buttons: preset.dark[2],
                      inputs: preset.dark[3],
                      background: preset.dark[4],
                      text: preset.dark[5],
                    },
                  })
                }
                className="p-4 rounded-xl border border-border hover:border-primary/50 transition-all text-start"
              >
                <div className="flex gap-1 mb-2">
                  {(activeMode === "light" ? preset.light : preset.dark).map((color, i) => (
                    <div
                      key={i}
                      className="w-5 h-5 rounded-md border border-border/50"
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
                <p className="text-sm font-medium text-foreground">{preset.name}</p>
              </motion.button>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </DashboardLayout>
  );
};

interface ColorEditorProps {
  colors: ColorConfig;
  colorOptions: { key: string; label: string; description: string }[];
  onColorChange: (key: string, value: string) => void;
  onSave: () => void;
  savedMessage: boolean;
  t: (key: string) => string;
  direction: string;
  isDark: boolean;
}

const ColorEditor = ({
  colors,
  colorOptions,
  onColorChange,
  onSave,
  savedMessage,
  t,
  direction,
  isDark,
}: ColorEditorProps) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Color Picker Section */}
      <motion.div
        initial={{ opacity: 0, x: direction === "rtl" ? 20 : -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-card border border-border rounded-2xl p-6"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center">
            <Palette className="w-5 h-5 text-primary-foreground" />
          </div>
          <h2 className="text-lg font-semibold text-foreground">{t("colors.settings")}</h2>
        </div>

        <div className="space-y-6">
          {colorOptions.map((option) => (
            <div key={option.key} className="space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-foreground font-medium">{option.label}</Label>
                  <p className="text-xs text-muted-foreground">{option.description}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="relative">
                  <input
                    type="color"
                    value={colors[option.key as keyof ColorConfig]}
                    onChange={(e) => onColorChange(option.key, e.target.value)}
                    className="w-14 h-14 rounded-xl cursor-pointer border-2 border-border"
                  />
                </div>
                <Input
                  value={colors[option.key as keyof ColorConfig]}
                  onChange={(e) => onColorChange(option.key, e.target.value)}
                  className="font-mono uppercase h-12 bg-input"
                />
              </div>
            </div>
          ))}
        </div>

        <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }} className="mt-8">
          <Button
            onClick={onSave}
            className="w-full h-12 bg-gradient-primary hover:opacity-90 transition-all shadow-glow text-base font-semibold"
          >
            {savedMessage ? (
              <>
                <Check className="w-5 h-5 me-2" />
                {t("colors.saved")}
              </>
            ) : (
              t("colors.save")
            )}
          </Button>
        </motion.div>
      </motion.div>

      {/* Preview Section */}
      <motion.div
        initial={{ opacity: 0, x: direction === "rtl" ? -20 : 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-card border border-border rounded-2xl p-6"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center">
            <Eye className="w-5 h-5 text-foreground" />
          </div>
          <h2 className="text-lg font-semibold text-foreground">{t("colors.preview")}</h2>
        </div>

        {/* Preview Card */}
        <div
          className="rounded-2xl p-6 transition-all"
          style={{ backgroundColor: colors.background }}
        >
          {/* Preview Header */}
          <div className="flex items-center gap-3 mb-6">
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: colors.primary }}
            >
              <span className="text-white font-bold text-lg">A</span>
            </div>
            <div>
              <h3 className="font-semibold" style={{ color: colors.primary }}>
                {t("colors.previewTitle")}
              </h3>
              <p className="text-sm" style={{ color: colors.text, opacity: 0.6 }}>
                {t("colors.previewSubtitle")}
              </p>
            </div>
          </div>

          {/* Preview Content */}
          <div className="space-y-4">
            <div
              className="p-4 rounded-xl"
              style={{ backgroundColor: colors.secondary }}
            >
              <p className="text-sm" style={{ color: colors.text }}>
                {t("colors.previewText")}
              </p>
            </div>

            <input
              type="text"
              placeholder={t("colors.previewInput")}
              className="w-full px-4 py-3 rounded-xl border-0 outline-none"
              style={{ 
                backgroundColor: colors.inputs,
                color: colors.text,
              }}
            />

            <div className="flex gap-3">
              <button
                className="flex-1 py-3 rounded-xl font-medium text-white transition-all hover:opacity-90"
                style={{ backgroundColor: colors.buttons }}
              >
                {t("colors.previewPrimary")}
              </button>
              <button
                className="flex-1 py-3 rounded-xl font-medium border-2 transition-all hover:opacity-80"
                style={{
                  borderColor: colors.primary,
                  color: colors.primary,
                  backgroundColor: "transparent",
                }}
              >
                {t("colors.previewSecondary")}
              </button>
            </div>
          </div>
        </div>

        {/* Color Swatches */}
        <div className="mt-6 flex items-center gap-2 flex-wrap">
          <span className="text-sm text-muted-foreground">{t("colors.currentPalette")}</span>
          {Object.values(colors).map((color, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.1 }}
              className="w-8 h-8 rounded-lg border border-border shadow-sm"
              style={{ backgroundColor: color }}
              title={color}
            />
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default BrandColors;
