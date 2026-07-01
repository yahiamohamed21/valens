import { useCallback, useMemo } from "react";
import type { Dispatch, SetStateAction } from "react";
import { api } from "@/lib/api";
import { showToast } from "@/lib/toast";
import type { HomePageSettings, StoreSettings } from "@/types/store";

interface SettingsActionDeps {
  setHomePageSettings: Dispatch<SetStateAction<HomePageSettings>>;
  setStoreSettings: Dispatch<SetStateAction<StoreSettings>>;
}

export const useSettingsActions = ({ setHomePageSettings, setStoreSettings }: SettingsActionDeps) => {
  const updateHomePageSettings = useCallback(async (newSettings: HomePageSettings) => {
    try {
      await api.settings.updateHomepageConfig(newSettings);
      setHomePageSettings(newSettings);
      showToast("Homepage layout updated", "success");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to update homepage settings";
      showToast(message, "error");
    }
  }, [setHomePageSettings]);

  const updateStoreSettings = useCallback(async (newSettings: StoreSettings) => {
    try {
      const dto = {
        ...newSettings,
        shippingCost: Number(newSettings.shippingCost),
        taxRate: Number(newSettings.taxRate),
      };
      await api.settings.updateStoreConfig(dto);
      setStoreSettings(newSettings);
      showToast("Global store settings updated", "success");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to update store settings";
      showToast(message, "error");
    }
  }, [setStoreSettings]);

  return useMemo(
    () => ({ updateHomePageSettings, updateStoreSettings }),
    [updateHomePageSettings, updateStoreSettings]
  );
};
