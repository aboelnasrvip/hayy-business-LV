import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Building2, UploadCloud, Loader, Save,
  Lock, Eye, EyeOff, User, ShieldCheck,
} from 'lucide-react';
import { businessAPI } from '@/services/businessService';
import { useBusinessProfile } from '@/contexts/BusinessProfileContext';
import { toast } from 'sonner';

const neuCard = "rounded-[1.5rem] bg-[#e8ecf3] shadow-[12px_12px_24px_#adb5c0,-12px_-12px_24px_#ffffff] dark:bg-[#2b2e42] dark:shadow-[8px_8px_20px_#0e1020,-8px_-8px_20px_#343750]";
const neuInset = "bg-[#e0e5ec] shadow-[inset_4px_4px_8px_#b8bec7,inset_-4px_-4px_8px_#ffffff] dark:bg-[#252838] dark:shadow-[inset_3px_3px_7px_#12151f,inset_-3px_-3px_7px_#2e3248]";

interface ServerError { response?: { data?: unknown } }

/** Extract human-readable error from Axios error */
const extractError = (err: ServerError): string => {
  const data = err?.response?.data;
  if (!data) return 'An error occurred';
  if (typeof data === 'string') return data;
  if (typeof data === 'object' && data !== null) {
    const obj = data as Record<string, unknown>;
    if (typeof obj['message'] === 'string') return obj['message'];
    for (const msgs of Object.values(obj)) {
      if (Array.isArray(msgs) && msgs.length > 0 && typeof msgs[0] === 'string') {
        return msgs[0];
      }
    }
  }
  return 'An error occurred';
};

const StatusBadge = ({ status }: { status: string }) => {
  const map: Record<string, { label: string; cls: string }> = {
    Verified:  { label: 'Verified',  cls: 'text-green-600 bg-green-100 dark:bg-green-900/30' },
    Approved:  { label: 'Approved',  cls: 'text-green-600 bg-green-100 dark:bg-green-900/30' },
    Pending:   { label: 'Pending',   cls: 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30' },
    Rejected:  { label: 'Rejected',  cls: 'text-red-500 bg-red-100 dark:bg-red-900/30' },
  };
  const { label, cls } = map[status] ?? { label: status, cls: 'text-gray-500 bg-gray-100 dark:bg-gray-700/30' };
  return (
    <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full ${cls}`}>
      <ShieldCheck size={11} /> {label}
    </span>
  );
};

const DashboardProfile = () => {
  const { profile, isLoading, refreshProfile } = useBusinessProfile();

  /* ── Edit profile state ── */
  const [brandName, setBrandName]   = useState('');
  const [legalName, setLegalName]   = useState('');
  const [logoFile, setLogoFile]     = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string>('');
  const [isSavingProfile, setIsSavingProfile] = useState(false);

  /* ── Change password state ── */
  const [currentPw, setCurrentPw]   = useState('');
  const [newPw, setNewPw]           = useState('');
  const [confirmPw, setConfirmPw]   = useState('');
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew]       = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isSavingPw, setIsSavingPw] = useState(false);

  /* Sync form fields when profile loads */
  useEffect(() => {
    if (!profile) return;
    setBrandName(profile.brandName);
    setLegalName(profile.legalName);
    setLogoPreview(profile.logoImage ?? '');
    setLogoFile(null);
  }, [profile]);

  const handleLogoFile = (file: File | null) => {
    if (!file) return;
    setLogoFile(file);
    setLogoPreview(URL.createObjectURL(file));
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingProfile(true);
    try {
      await businessAPI.updateProfile(brandName, legalName, logoFile ?? undefined);
      toast.success('Profile updated successfully!');
      setLogoFile(null);
      await refreshProfile(); // ← updates navbar + sidebar instantly
    } catch (err) {
      toast.error(extractError(err as ServerError));
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPw !== confirmPw) { toast.error('New passwords do not match'); return; }
    if (newPw.length < 8)    { toast.error('Password must be at least 8 characters'); return; }
    setIsSavingPw(true);
    try {
      await businessAPI.changePassword(currentPw, newPw, confirmPw);
      toast.success('Password changed successfully!');
      setCurrentPw(''); setNewPw(''); setConfirmPw('');
    } catch (err) {
      toast.error(extractError(err as ServerError));
    } finally {
      setIsSavingPw(false);
    }
  };

  if (isLoading) return (
    <div className="flex justify-center items-center py-32">
      <Loader className="animate-spin text-primary" size={36} />
    </div>
  );

  if (!profile) return null;

  const initial = profile.brandName[0]?.toUpperCase() ?? '?';

  return (
    <div className="space-y-6 pt-16 max-w-2xl mx-auto">

      {/* ── Header ── */}
      <div>
        <h1 className="text-2xl font-bold text-gray-700 dark:text-white">Business Profile</h1>
        <p className="text-sm text-gray-400 mt-0.5">Manage your business information</p>
      </div>

      {/* ── Profile Summary Card ── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className={`${neuCard} p-6 flex items-center gap-5`}
      >
        <div className={`w-20 h-20 rounded-2xl overflow-hidden shrink-0 flex items-center justify-center ${neuInset}`}>
          {logoPreview ? (
            <img src={logoPreview} alt="Logo" className="w-full h-full object-cover" />
          ) : (
            <span className="text-3xl font-black text-primary">{initial}</span>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 flex-wrap mb-1">
            <h2 className="text-lg font-black text-gray-700 dark:text-white">{profile.brandName}</h2>
            <StatusBadge status={profile.verificationStatus} />
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400">{profile.legalName}</p>
          <div className="flex flex-wrap gap-3 mt-2 text-xs text-gray-400">
            <span>CR: {profile.commercialRegNumber}</span>
            <span>Tax: {profile.taxNumber}</span>
          </div>
        </div>
      </motion.div>

      {/* ── Edit Profile ── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.08 }}
        className={`${neuCard} p-6`}
      >
        <h3 className="font-bold text-gray-700 dark:text-white flex items-center gap-2 mb-5">
          <Building2 size={16} className="text-primary" /> Edit Profile
        </h3>

        <form onSubmit={handleSaveProfile} className="space-y-4">
          {/* Logo Upload */}
          <div className="space-y-2">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider px-1">Business Logo</p>
            <div className="flex items-center gap-4">
              <div className={`w-16 h-16 rounded-2xl overflow-hidden shrink-0 flex items-center justify-center ${neuInset}`}>
                {logoPreview ? (
                  <img src={logoPreview} alt="Logo" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-xl font-black text-primary">{initial}</span>
                )}
              </div>
              <div>
                <input
                  type="file" accept="image/*" id="logo-upload" className="hidden"
                  onChange={e => handleLogoFile(e.target.files?.[0] ?? null)}
                />
                <label
                  htmlFor="logo-upload"
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-semibold cursor-pointer
                    text-gray-600 dark:text-gray-300 hover:text-primary transition-colors
                    bg-[#e0e5ec] dark:bg-[#252838]
                    shadow-[3px_3px_7px_#b8bec7,-3px_-3px_7px_#ffffff]
                    dark:shadow-[3px_3px_6px_#12151f,-3px_-3px_6px_#2e3248]`}
                >
                  <UploadCloud size={14} />
                  {logoFile ? 'Change Image' : 'Upload New Logo'}
                </label>
                {logoFile && (
                  <p className="text-[10px] text-primary mt-1 px-1 truncate max-w-[180px]">{logoFile.name}</p>
                )}
              </div>
            </div>
          </div>

          {/* Brand Name */}
          <div className="space-y-1">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider px-1">Brand Name</p>
            <div className={`flex items-center gap-3 px-4 py-1 rounded-full ${neuInset}`}>
              <User size={14} className="text-gray-400 shrink-0" />
              <input
                required value={brandName}
                onChange={e => setBrandName(e.target.value)}
                placeholder="Brand Name"
                className="flex-1 bg-transparent outline-none text-sm text-gray-700 dark:text-white placeholder-gray-400 py-2.5"
              />
            </div>
          </div>

          {/* Legal Name */}
          <div className="space-y-1">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider px-1">Legal Name</p>
            <div className={`flex items-center gap-3 px-4 py-1 rounded-full ${neuInset}`}>
              <Building2 size={14} className="text-gray-400 shrink-0" />
              <input
                required value={legalName}
                onChange={e => setLegalName(e.target.value)}
                placeholder="Legal Name"
                className="flex-1 bg-transparent outline-none text-sm text-gray-700 dark:text-white placeholder-gray-400 py-2.5"
              />
            </div>
          </div>

          <div className="flex justify-end pt-1">
            <button
              type="submit" disabled={isSavingProfile}
              className="flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-bold text-white
                bg-gradient-to-r from-primary to-orange-500
                shadow-[3px_3px_8px_#b8bec7,-1px_-1px_4px_#ffffff] dark:shadow-[3px_3px_8px_#12151f]
                hover:opacity-90 disabled:opacity-50 transition-all"
            >
              {isSavingProfile ? <><Loader size={14} className="animate-spin" /> Saving...</> : <><Save size={14} /> Save Changes</>}
            </button>
          </div>
        </form>
      </motion.div>

      {/* ── Change Password ── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.14 }}
        className={`${neuCard} p-6`}
      >
        <h3 className="font-bold text-gray-700 dark:text-white flex items-center gap-2 mb-5">
          <Lock size={16} className="text-primary" /> Change Password
        </h3>

        <form onSubmit={handleChangePassword} className="space-y-4">
          {[
            { label: 'Current Password',     value: currentPw, set: setCurrentPw, show: showCurrent, toggle: () => setShowCurrent(p => !p) },
            { label: 'New Password',         value: newPw,     set: setNewPw,     show: showNew,     toggle: () => setShowNew(p => !p)     },
            { label: 'Confirm New Password', value: confirmPw, set: setConfirmPw, show: showConfirm, toggle: () => setShowConfirm(p => !p) },
          ].map(({ label, value, set, show, toggle }) => (
            <div key={label} className="space-y-1">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider px-1">{label}</p>
              <div className={`flex items-center gap-3 px-4 py-1 rounded-full ${neuInset}`}>
                <Lock size={14} className="text-gray-400 shrink-0" />
                <input
                  required
                  type={show ? 'text' : 'password'}
                  minLength={label === 'Current Password' ? 1 : 8}
                  value={value}
                  onChange={e => set(e.target.value)}
                  placeholder={label}
                  className="flex-1 bg-transparent outline-none text-sm text-gray-700 dark:text-white placeholder-gray-400 py-2.5"
                />
                <button type="button" onClick={toggle} className="text-gray-400 hover:text-primary transition-colors shrink-0">
                  {show ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
            </div>
          ))}

          <div className="flex justify-end pt-1">
            <button
              type="submit" disabled={isSavingPw}
              className="flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-bold text-white
                bg-gradient-to-r from-primary to-orange-500
                shadow-[3px_3px_8px_#b8bec7,-1px_-1px_4px_#ffffff] dark:shadow-[3px_3px_8px_#12151f]
                hover:opacity-90 disabled:opacity-50 transition-all"
            >
              {isSavingPw ? <><Loader size={14} className="animate-spin" /> Saving...</> : <><Lock size={14} /> Change Password</>}
            </button>
          </div>
        </form>
      </motion.div>

    </div>
  );
};

export default DashboardProfile;
