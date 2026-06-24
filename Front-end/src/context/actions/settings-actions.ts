import { useCallback, useMemo } from "react";
import type { Dispatch, SetStateAction } from "react";
import { STORAGE_KEYS } from "@/lib/constants";
import { setStorageItem } from "@/lib/storage";
import { showToast } from "@/lib/toast";
import type { HomePageSettings, StoreSettings } from "@/types/store";

interface SettingsActionDeps {
  setHomePageSettings: Dispatch<SetStateAction<HomePageSettings>>;
  setStoreSettings: Dispatch<SetStateAction<StoreSettings>>;
}

export const useSettingsActions = ({ setHomePageSettings, setStoreSettings }: SettingsActionDeps) => {
  const updateHomePageSettings = useCallback((newSettings: HomePageSettings) => {
    setHomePageSettings(newSettings);
    setStorageItem(STORAGE_KEYS.HOMEPAGE, newSettings);
    showToast("Homepage layout updated", "success");
  }, [setHomePageSettings]);

  const updateStoreSettings = useCallback((newSettings: StoreSettings) => {
    setStoreSettings(newSettings);
    setStorageItem(STORAGE_KEYS.SETTINGS, newSettings);
    showToast("Global store settings updated", "success");
  }, [setStoreSettings]);

  return useMemo(
    () => ({ updateHomePageSettings, updateStoreSettings }),
    [updateHomePageSettings, updateStoreSettings]
  );
};
