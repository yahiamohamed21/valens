export const getStorageItem = <T>(key: string): T | undefined => {
  if (typeof window === "undefined") {
    return undefined;
  }

  const item = localStorage.getItem(key);
  if (!item) {
    return undefined;
  }

  return JSON.parse(item) as T;
};

export const setStorageItem = (key: string, data: unknown) => {
  if (typeof window !== "undefined") {
    localStorage.setItem(key, JSON.stringify(data));
  }
};
