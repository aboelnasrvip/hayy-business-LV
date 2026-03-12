import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { submitOnboarding, clearError } from "@/store/slices/businessSlice";
import { Upload, Building2, FileText, CreditCard, IdCard, ArrowRight, Check } from "lucide-react";
import { toast } from "sonner";

const BusinessOnboarding = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { isLoading, error } = useAppSelector((state) => state.business);

  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    brandName: "",
    legalName: "",
    commercialRegNumber: "",
    taxNumber: "",
  });

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

    // Validation
    if (!files.logoImage || !files.commercialRegImage || !files.taxCardImage || !files.identityCardImage) {
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
      toast.success("Documents submitted successfully! Your application is under review.");
      navigate("/onboarding/pending");
    } catch (err: any) {
      toast.error(err || "Submission failed");
    }
  };

  const steps = [
    { number: 1, title: "Business Info", icon: Building2 },
    { number: 2, title: "Documents", icon: FileText },
    { number: 3, title: "Verification", icon: Check },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-orange-600 rounded-xl flex items-center justify-center">
                <span className="text-xl font-bold text-white">H</span>
              </div>
              <span className="text-xl font-bold text-gray-900 dark:text-white">Hayy</span>
            </Link>
            <Link to="/login" className="text-gray-600 dark:text-gray-400 hover:text-primary transition-colors">
              Already verified?
            </Link>
          </div>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-12">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isActive = currentStep >= step.number;
            const isCompleted = currentStep > step.number;

            return (
              <div key={step.number} className="flex items-center flex-1">
                <div className="flex flex-col items-center">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                      isCompleted
                        ? "bg-green-500 text-white"
                        : isActive
                        ? "bg-primary text-white"
                        : "bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400"
                    }`}
                  >
                    {isCompleted ? <Check size={24} /> : <Icon size={24} />}
                  </div>
                  <span
                    className={`mt-2 text-sm font-medium ${
                      isActive ? "text-gray-900 dark:text-white" : "text-gray-500 dark:text-gray-400"
                    }`}
                  >
                    {step.title}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`flex-1 h-1 mx-4 rounded transition-all ${
                      currentStep > step.number ? "bg-primary" : "bg-gray-200 dark:bg-gray-700"
                    }`}
                  />
                )}
              </div>
            );
          })}
        </div>

        {/* Form */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Step 1: Business Info */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Business Information</h2>
                  <p className="text-gray-600 dark:text-gray-400">Tell us about your business</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Brand Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.brandName}
                      onChange={(e) => setFormData({ ...formData, brandName: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      placeholder="Your Brand Name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Legal Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.legalName}
                      onChange={(e) => setFormData({ ...formData, legalName: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      placeholder="Legal Business Name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Commercial Registration Number *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.commercialRegNumber}
                      onChange={(e) => setFormData({ ...formData, commercialRegNumber: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      placeholder="CR Number"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Tax Number *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.taxNumber}
                      onChange={(e) => setFormData({ ...formData, taxNumber: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      placeholder="Tax ID Number"
                    />
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setCurrentStep(2)}
                  className="w-full bg-gradient-to-r from-primary to-orange-600 text-white py-3 rounded-lg font-semibold hover:shadow-lg transform hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2"
                >
                  Continue
                  <ArrowRight size={20} />
                </button>
              </div>
            )}

            {/* Step 2: Documents */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Upload Documents</h2>
                  <p className="text-gray-600 dark:text-gray-400">Please provide clear images of your business documents</p>
                </div>

                {/* Logo Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Business Logo *
                  </label>
                  <div className="relative">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileChange("logoImage", e.target.files?.[0] || null)}
                      className="hidden"
                      id="logo-upload"
                      required
                    />
                    <label
                      htmlFor="logo-upload"
                      className="flex items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:border-primary transition-colors bg-gray-50 dark:bg-gray-700/50"
                    >
                      {previews.logoImage ? (
                        <img src={previews.logoImage} alt="Logo" className="max-h-28 rounded" />
                      ) : (
                        <div className="text-center">
                          <Upload className="mx-auto text-gray-400 mb-2" size={32} />
                          <span className="text-sm text-gray-600 dark:text-gray-400">Click to upload logo</span>
                        </div>
                      )}
                    </label>
                  </div>
                </div>

                {/* Document Uploads */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {[
                    { id: "commercialRegImage", label: "Commercial Registration", icon: FileText },
                    { id: "taxCardImage", label: "Tax Card", icon: CreditCard },
                    { id: "identityCardImage", label: "Identity Card", icon: IdCard },
                  ].map((doc) => {
                    const Icon = doc.icon;
                    const key = doc.id as keyof typeof files;

                    return (
                      <div key={doc.id}>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          {doc.label} *
                        </label>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleFileChange(key, e.target.files?.[0] || null)}
                          className="hidden"
                          id={doc.id}
                          required
                        />
                        <label
                          htmlFor={doc.id}
                          className="flex flex-col items-center justify-center h-40 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:border-primary transition-colors bg-gray-50 dark:bg-gray-700/50"
                        >
                          {previews[key] ? (
                            <img src={previews[key]} alt={doc.label} className="max-h-36 rounded" />
                          ) : (
                            <>
                              <Icon className="text-gray-400 mb-2" size={32} />
                              <span className="text-sm text-gray-600 dark:text-gray-400 text-center px-2">
                                Upload {doc.label}
                              </span>
                            </>
                          )}
                        </label>
                      </div>
                    );
                  })}
                </div>

                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(1)}
                    className="flex-1 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 py-3 rounded-lg font-semibold hover:bg-gray-300 dark:hover:bg-gray-600 transition-all"
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={() => setCurrentStep(3)}
                    className="flex-1 bg-gradient-to-r from-primary to-orange-600 text-white py-3 rounded-lg font-semibold hover:shadow-lg transform hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2"
                  >
                    Continue
                    <ArrowRight size={20} />
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Review & Submit */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Review & Submit</h2>
                  <p className="text-gray-600 dark:text-gray-400">Please review your information before submitting</p>
                </div>

                {/* Summary */}
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-6 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-sm text-gray-500 dark:text-gray-400">Brand Name</span>
                      <p className="font-medium text-gray-900 dark:text-white">{formData.brandName}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500 dark:text-gray-400">Legal Name</span>
                      <p className="font-medium text-gray-900 dark:text-white">{formData.legalName}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500 dark:text-gray-400">CR Number</span>
                      <p className="font-medium text-gray-900 dark:text-white">{formData.commercialRegNumber}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500 dark:text-gray-400">Tax Number</span>
                      <p className="font-medium text-gray-900 dark:text-white">{formData.taxNumber}</p>
                    </div>
                  </div>
                  <div className="pt-4 border-t border-gray-200 dark:border-gray-600">
                    <span className="text-sm text-gray-500 dark:text-gray-400">Documents Uploaded</span>
                    <div className="flex items-center gap-2 mt-2">
                      {files.logoImage && <Check className="text-green-500" size={20} />}
                      <span className="text-sm text-gray-700 dark:text-gray-300">Logo, Commercial Reg., Tax Card, ID Card</span>
                    </div>
                  </div>
                </div>

                {error && (
                  <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg text-sm">
                    {error}
                  </div>
                )}

                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(2)}
                    className="flex-1 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 py-3 rounded-lg font-semibold hover:bg-gray-300 dark:hover:bg-gray-600 transition-all"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="flex-1 bg-gradient-to-r from-primary to-orange-600 text-white py-3 rounded-lg font-semibold hover:shadow-lg transform hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isLoading ? "Submitting..." : "Submit for Review"}
                    {!isLoading && <Check size={20} />}
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