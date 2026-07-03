import { createContext, useContext, useEffect, useState, useCallback, ReactNode } from 'react';
import { businessAPI, BusinessProfile } from '@/services/businessService';

interface BusinessProfileContextValue {
  profile: BusinessProfile | null;
  isLoading: boolean;
  refreshProfile: () => Promise<void>;
}

const BusinessProfileContext = createContext<BusinessProfileContextValue>({
  profile: null,
  isLoading: true,
  refreshProfile: async () => {},
});

export const BusinessProfileProvider = ({ children }: { children: ReactNode }) => {
  const [profile, setProfile] = useState<BusinessProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshProfile = useCallback(async () => {
    try {
      const data = await businessAPI.getProfile();
      setProfile(data);
    } catch {
      /* silent */
    }
  }, []);

  useEffect(() => {
    refreshProfile().finally(() => setIsLoading(false));
  }, [refreshProfile]);

  return (
    <BusinessProfileContext.Provider value={{ profile, isLoading, refreshProfile }}>
      {children}
    </BusinessProfileContext.Provider>
  );
};

export const useBusinessProfile = () => useContext(BusinessProfileContext);
