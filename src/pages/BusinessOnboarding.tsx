import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { submitOnboarding, clearError } from "@/store/slices/businessSlice";
import {
  Upload,
  Building2,
  FileText,
  CreditCard,
  IdCard,
  ArrowRight,
  Check,
  Sun,
  Moon,
  AlertCircle,
} from "lucide-react";
import { toast } from "sonner";
import { useTheme } from "@/components/ui/ThemeProvider";
import { setVerificationStatus } from "@/store/slices/authSlice";


const BusinessOnboarding = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { isLoading, error } = useAppSelector((state) => state.business);
  const { theme, setTheme } = useTheme();

  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    brandName: "",
    legalName: "",
    commercialRegNumber: "",
    taxNumber: "",
  });
  const [fieldErrors, setFieldErrors] = useState({ commercialRegNumber: "", taxNumber: "" });

  const validateNumbers = (): boolean => {
    const cr  = formData.commercialRegNumber.replace(/\D/g, "");
    const tax = formData.taxNumber.replace(/\D/g, "");
    const errs = { commercialRegNumber: "", taxNumber: "" };
    if (!/^\d+$/.test(formData.commercialRegNumber) || cr.length < 5 || cr.length > 20)
      errs.commercialRegNumber = "Commercial Registration Number must be between 5 and 20 digits.";
    if (!/^\d+$/.test(formData.taxNumber) || tax.length < 9 || tax.length > 15)
      errs.taxNumber = "Tax Number must be between 9 and 15 digits.";
    setFieldErrors(errs);
    return !errs.commercialRegNumber && !errs.taxNumber;
  };

  const handleNumberInput = (field: "commercialRegNumber" | "taxNumber", raw: string) => {
    const digitsOnly = raw.replace(/\D/g, "");
    setFormData(p => ({ ...p, [field]: digitsOnly }));
    setFieldErrors(p => ({ ...p, [field]: "" }));
  };

  const [files, setFiles] = useState({
    logoImage: null as File | null,
    commercialRegImage: null as File | null,
    taxCardImage: null as File | null,
    identityCardImage: null as File | null,
  });

  const [previews, setPreviews] = useState({
    logoImage: "",
    commercialRegImage: "",
    taxCardImage: "",
    identityCardImage: "",
  });

  const handleFileChange = (field: keyof typeof files, file: File | null) => {
    if (file) {
      setFiles({ ...files, [field]: file });
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviews({ ...previews, [field]: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(clearError());

    if (!validateNumbers()) {
      setCurrentStep(1);
      return;
    }

    if (
      !files.logoImage ||
      !files.commercialRegImage ||
      !files.taxCardImage ||
      !files.identityCardImage
    ) {
      toast.error("Please upload all required documents");
      return;
    }

    const data = new FormData();
    data.append("brandName", formData.brandName);
    data.append("legalName", formData.legalName);
    data.append("commercialRegNumber", formData.commercialRegNumber);
    data.append("taxNumber", formData.taxNumber);
    data.append("logoImage", files.logoImage);
    data.append("commercialRegImage", files.commercialRegImage);
    data.append("taxCardImage", files.taxCardImage);
    data.append("identityCardImage", files.identityCardImage);

    try {
      await dispatch(submitOnboarding(data)).unwrap();
      toast.success("Documents submitted successfully!");
      dispatch(setVerificationStatus("Pending"));
      navigate("/onboarding/pending"); 
    } catch (err) {
      toast.error(typeof err === 'string' ? err : "Submission failed");
    }
  };

  const steps = [
    { number: 1, title: "Business Info", icon: Building2 },
    { number: 2, title: "Documents", icon: FileText },
    { number: 3, title: "Review", icon: Check },
  ];

  // ── shared tokens ──
  const neuInput =
    "w-full px-5 py-3.5 rounded-full outline-none text-sm text-gray-700 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 bg-[#e0e5ec] shadow-[inset_5px_5px_10px_#b8bec7,inset_-5px_-5px_10px_#ffffff] dark:bg-[#252838] dark:shadow-[inset_4px_4px_10px_#12151f,inset_-2px_-2px_6px_#2e3248] transition-all";
  const neuBtnPrimary =
    "rounded-full font-bold text-white text-sm tracking-widest uppercase bg-gradient-to-r from-primary to-orange-500 shadow-[5px_5px_12px_#b8bec7,-3px_-3px_8px_#ffffff,inset_0_1px_0_rgba(255,255,255,0.15)] hover:shadow-[3px_3px_8px_#b8bec7,-1px_-1px_4px_#ffffff] active:shadow-[inset_3px_3px_6px_rgba(0,0,0,0.25)] dark:shadow-[5px_5px_15px_#12151f,-3px_-3px_8px_#2e3248,inset_0_1px_0_rgba(255,255,255,0.1)] dark:hover:shadow-[3px_3px_10px_#12151f,-1px_-1px_4px_#2e3248] dark:active:shadow-[inset_3px_3px_8px_rgba(0,0,0,0.4)] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2";
  const neuBtnGhost =
    "rounded-full font-bold text-sm text-gray-600 dark:text-gray-300 bg-[#e0e5ec] shadow-[4px_4px_8px_#b8bec7,-4px_-4px_8px_#ffffff] hover:shadow-[2px_2px_4px_#b8bec7,-2px_-2px_4px_#ffffff] dark:bg-[#252838] dark:shadow-[4px_4px_10px_#12151f,-4px_-4px_10px_#2e3248] dark:hover:shadow-[2px_2px_6px_#12151f,-2px_-2px_6px_#2e3248] transition-all duration-200";

  return (
    <div dir="ltr" className="min-h-screen bg-[#e0e5ec] dark:bg-[#252838]">
      {/* ── Header ── */}
      <div className="sticky top-0 z-10 bg-[#e0e5ec] dark:bg-[#252838] shadow-[0_4px_12px_#b8bec7] dark:shadow-[0_4px_12px_#12151f]">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center
              bg-[#e0e5ec] shadow-[4px_4px_8px_#b8bec7,-4px_-4px_8px_#ffffff]
              dark:bg-[#2e3248] dark:shadow-[3px_3px_7px_#12151f,-3px_-3px_7px_#343751]"
            >
              <img
                src="/logo.png"
                alt="Hayy"
                className="w-7 h-7 object-contain rounded-full"
              />
            </div>
            <span className="text-base font-bold text-gray-700 dark:text-white tracking-wide">
              HAYY Business
            </span>
          </Link>

          <div className="flex items-center gap-3">
            {/* Theme Toggle */}
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="w-9 h-9 flex items-center justify-center rounded-xl transition-all
                bg-[#e0e5ec] shadow-[3px_3px_6px_#b8bec7,-3px_-3px_6px_#ffffff]
                hover:shadow-[1px_1px_3px_#b8bec7,-1px_-1px_3px_#ffffff]
                dark:bg-[#252838] dark:shadow-[3px_3px_7px_#12151f,-3px_-3px_7px_#2e3248]"
            >
              {theme === "dark" ? (
                <Sun size={16} className="text-primary" />
              ) : (
                <Moon size={16} className="text-gray-500" />
              )}
            </button>
            <Link
              to="/login"
              className="text-sm text-gray-500 dark:text-gray-400 hover:text-primary transition-colors"
            >
              Already verified?
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-10">
        {/* ── Step Indicators ── */}
        <div className="flex items-center justify-center gap-4 mb-10">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isActive = currentStep >= step.number;
            const isCompleted = currentStep > step.number;

            return (
              <div key={step.number} className="flex items-center">
                <div className="flex flex-col items-center min-w-[90px]">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center transition-all
                    ${
                      isCompleted
                        ? "bg-gradient-to-br from-primary to-orange-500 shadow-[4px_4px_10px_#b8bec7,-3px_-3px_8px_#ffffff] dark:shadow-[4px_4px_10px_#12151f,-3px_-3px_8px_#2e3248]"
                        : isActive
                          ? "bg-gradient-to-br from-primary to-orange-500 shadow-[4px_4px_10px_#b8bec7,-3px_-3px_8px_#ffffff] dark:shadow-[4px_4px_10px_#12151f,-3px_-3px_8px_#2e3248]"
                          : "bg-[#e0e5ec] shadow-[inset_3px_3px_7px_#b8bec7,inset_-3px_-3px_7px_#ffffff] dark:bg-[#252838] dark:shadow-[inset_3px_3px_7px_#12151f,inset_-3px_-3px_7px_#2e3248]"
                    }`}
                  >
                    {isCompleted ? (
                      <Check size={20} className="text-white" />
                    ) : (
                      <Icon
                        size={20}
                        className={isActive ? "text-white" : "text-gray-400"}
                      />
                    )}
                  </div>
                  <span
                    className={`mt-2 text-xs font-medium ${isActive ? "text-gray-700 dark:text-white" : "text-gray-400"}`}
                  >
                    {step.title}
                  </span>
                </div>

                {index < steps.length - 1 && (
                  <div
                    className={`w-16 h-1 rounded-full mx-1 transition-all
                    ${
                      currentStep > step.number
                        ? "bg-gradient-to-r from-primary to-orange-500"
                        : "bg-[#e0e5ec] shadow-[inset_2px_2px_4px_#b8bec7,inset_-2px_-2px_4px_#ffffff] dark:bg-[#252838] dark:shadow-[inset_2px_2px_4px_#12151f,inset_-2px_-2px_4px_#2e3248]"
                    }`}
                  />
                )}
              </div>
            );
          })}
        </div>

        {/* ── Card ── */}
        <div className="rounded-[2rem] p-8 bg-[#e0e5ec] shadow-[10px_10px_20px_#b8bec7,-10px_-10px_20px_#ffffff] dark:bg-[#252838] dark:shadow-[8px_8px_20px_#12151f,-8px_-8px_20px_#2e3248]">
          <form onSubmit={handleSubmit} className="space-y-7">
            {/* ── Step 1: Business Info ── */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <div className="mb-2">
                  <h2 className="text-xl font-bold text-gray-700 dark:text-white tracking-wide">
                    Business Information
                  </h2>
                  <p className="text-gray-400 text-sm mt-1">
                    Tell us about your business
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider px-2">
                      Brand Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.brandName}
                      onChange={(e) =>
                        setFormData({ ...formData, brandName: e.target.value })
                      }
                      placeholder="Your Brand Name"
                      className={neuInput}
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider px-2">
                      Legal Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.legalName}
                      onChange={(e) =>
                        setFormData({ ...formData, legalName: e.target.value })
                      }
                      placeholder="Legal Business Name"
                      className={neuInput}
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider px-2">
                      Commercial Reg. Number * <span className="normal-case font-normal text-gray-400">(5–20 digits)</span>
                    </label>
                    <input
                      type="text"
                      inputMode="numeric"
                      required
                      maxLength={20}
                      value={formData.commercialRegNumber}
                      onChange={(e) => handleNumberInput("commercialRegNumber", e.target.value)}
                      placeholder="e.g. 1234567890"
                      className={`${neuInput} ${fieldErrors.commercialRegNumber ? "ring-2 ring-red-400" : ""}`}
                    />
                    {fieldErrors.commercialRegNumber && (
                      <p className="text-xs text-red-500 px-2 flex items-center gap-1 mt-0.5">
                        <AlertCircle size={11} className="shrink-0" /> {fieldErrors.commercialRegNumber}
                      </p>
                    )}
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider px-2">
                      Tax Number * <span className="normal-case font-normal text-gray-400">(9–15 digits)</span>
                    </label>
                    <input
                      type="text"
                      inputMode="numeric"
                      required
                      maxLength={15}
                      value={formData.taxNumber}
                      onChange={(e) => handleNumberInput("taxNumber", e.target.value)}
                      placeholder="e.g. 123456789"
                      className={`${neuInput} ${fieldErrors.taxNumber ? "ring-2 ring-red-400" : ""}`}
                    />
                    {fieldErrors.taxNumber && (
                      <p className="text-xs text-red-500 px-2 flex items-center gap-1 mt-0.5">
                        <AlertCircle size={11} className="shrink-0" /> {fieldErrors.taxNumber}
                      </p>
                    )}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => { if (validateNumbers()) setCurrentStep(2); }}
                  className={`w-full py-3.5 ${neuBtnPrimary}`}
                >
                  Continue <ArrowRight size={18} />
                </button>
              </div>
            )}

            {/* ── Step 2: Documents ── */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <div className="mb-2">
                  <h2 className="text-xl font-bold text-gray-700 dark:text-white tracking-wide">
                    Upload Documents
                  </h2>
                  <p className="text-gray-400 text-sm mt-1">
                    Please provide clear images of your business documents
                  </p>
                </div>

                {/* Logo Upload */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider px-2">
                    Business Logo *
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                      handleFileChange("logoImage", e.target.files?.[0] || null)
                    }
                    className="hidden"
                    id="logo-upload"
                  />
                  <label
                    htmlFor="logo-upload"
                    className="flex items-center justify-center w-full h-28 rounded-2xl cursor-pointer transition-all
                      bg-[#e0e5ec] shadow-[inset_5px_5px_10px_#b8bec7,inset_-5px_-5px_10px_#ffffff]
                      dark:bg-[#252838] dark:shadow-[inset_4px_4px_10px_#12151f,inset_-2px_-2px_6px_#2e3248]
                      hover:shadow-[inset_3px_3px_6px_#b8bec7,inset_-3px_-3px_6px_#ffffff]
                      border-2 border-dashed border-gray-300 dark:border-[#2e3248]"
                  >
                    {previews.logoImage ? (
                      <img
                        src={previews.logoImage}
                        alt="Logo"
                        className="max-h-24 rounded-xl object-contain"
                      />
                    ) : (
                      <div className="text-center">
                        <Upload
                          className="mx-auto text-gray-400 mb-1"
                          size={26}
                        />
                        <span className="text-xs text-gray-400">
                          Click to upload logo
                        </span>
                      </div>
                    )}
                  </label>
                </div>

                {/* Document Uploads */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[
                    {
                      id: "commercialRegImage",
                      label: "Commercial Registration",
                      icon: FileText,
                    },
                    { id: "taxCardImage", label: "Tax Card", icon: CreditCard },
                    {
                      id: "identityCardImage",
                      label: "Identity Card",
                      icon: IdCard,
                    },
                  ].map((doc) => {
                    const Icon = doc.icon;
                    const key = doc.id as keyof typeof files;
                    return (
                      <div key={doc.id} className="space-y-1">
                        <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider px-2">
                          {doc.label} *
                        </label>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) =>
                            handleFileChange(key, e.target.files?.[0] || null)
                          }
                          className="hidden"
                          id={doc.id}
                        />
                        <label
                          htmlFor={doc.id}
                          className="flex flex-col items-center justify-center h-36 rounded-2xl cursor-pointer transition-all
                            bg-[#e0e5ec] shadow-[inset_5px_5px_10px_#b8bec7,inset_-5px_-5px_10px_#ffffff]
                            dark:bg-[#252838] dark:shadow-[inset_4px_4px_10px_#12151f,inset_-2px_-2px_6px_#2e3248]
                            hover:shadow-[inset_3px_3px_6px_#b8bec7,inset_-3px_-3px_6px_#ffffff]
                            border-2 border-dashed border-gray-300 dark:border-[#2e3248]"
                        >
                          {previews[key] ? (
                            <img
                              src={previews[key]}
                              alt={doc.label}
                              className="max-h-32 rounded-xl object-contain"
                            />
                          ) : (
                            <>
                              <Icon className="text-gray-400 mb-1" size={26} />
                              <span className="text-xs text-gray-400 text-center px-2">
                                Upload {doc.label}
                              </span>
                            </>
                          )}
                        </label>
                      </div>
                    );
                  })}
                </div>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(1)}
                    className={`flex-1 py-3.5 ${neuBtnGhost}`}
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={() => setCurrentStep(3)}
                    className={`flex-1 py-3.5 ${neuBtnPrimary}`}
                  >
                    Continue <ArrowRight size={18} />
                  </button>
                </div>
              </div>
            )}

            {/* ── Step 3: Review & Submit ── */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <div className="mb-2">
                  <h2 className="text-xl font-bold text-gray-700 dark:text-white tracking-wide">
                    Review & Submit
                  </h2>
                  <p className="text-gray-400 text-sm mt-1">
                    Please review your information before submitting
                  </p>
                </div>

                {/* Summary */}
                <div
                  className="rounded-2xl p-6 space-y-4
                  bg-[#e0e5ec] shadow-[inset_5px_5px_10px_#b8bec7,inset_-5px_-5px_10px_#ffffff]
                  dark:bg-[#252838] dark:shadow-[inset_4px_4px_10px_#12151f,inset_-2px_-2px_6px_#2e3248]"
                >
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      { label: "Brand Name", value: formData.brandName },
                      { label: "Legal Name", value: formData.legalName },
                      {
                        label: "CR Number",
                        value: formData.commercialRegNumber,
                      },
                      { label: "Tax Number", value: formData.taxNumber },
                    ].map((item) => (
                      <div key={item.label}>
                        <span className="text-xs text-gray-400 uppercase tracking-wider">
                          {item.label}
                        </span>
                        <p className="font-semibold text-gray-700 dark:text-white mt-0.5">
                          {item.value}
                        </p>
                      </div>
                    ))}
                  </div>
                  <div className="pt-4 border-t border-gray-300 dark:border-[#2e3248]">
                    <span className="text-xs text-gray-400 uppercase tracking-wider">
                      Documents Uploaded
                    </span>
                    <div className="flex items-center gap-2 mt-1">
                      <Check className="text-primary" size={16} />
                      <span className="text-sm text-gray-600 dark:text-gray-300">
                        Logo, Commercial Reg., Tax Card, ID Card
                      </span>
                    </div>
                  </div>
                </div>

                {/* Error */}
                {error && (
                  <div className="flex items-center gap-2 px-4 py-3 rounded-2xl text-sm bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400">
                    <AlertCircle size={16} className="shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(2)}
                    className={`flex-1 py-3.5 ${neuBtnGhost}`}
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className={`flex-1 py-3.5 ${neuBtnPrimary}`}
                  >
                    {isLoading ? (
                      "Submitting..."
                    ) : (
                      <>
                        <Check size={18} /> Submit for Review
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default BusinessOnboarding;
