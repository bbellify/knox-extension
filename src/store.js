import { create } from "zustand";
import { getStorage } from "./storage";

export const useStore = create((set) => ({
  url: "",
  setUrl: (url) => set(() => ({ url: url })),
  init: async () => {
    const res = await getStorage(["secret", "vault", "settings"]);
    set((state) => ({
      secret: res.secret || "",
      vault: res.vault || [],
      settings: res.settings || [],
    }));
  },
}));
