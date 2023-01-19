import { create } from "zustand";
import { getStorage } from "./storage";

export const useStore = create((set) => ({
  url: "",
  setUrl: (url) => {
    console.log("in seturl method", url);
    set((state) => ({ url: url }));
  },
  init: async () => {
    const res = await getStorage(["secret", "vault", "settings", "url"]);
    set((state) => ({
      auth: false,
      url: res.url || "",
      secret: res.secret || "",
      vault: res.vault || [],
      settings: res.settings || [],
    }));
  },
}));
