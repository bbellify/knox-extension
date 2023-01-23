import { Urbit } from "@urbit/http-api";
import { create } from "zustand";
import { setStorage, getStorage } from "./storage";

export const useStore = create((set) => ({
  url: "",
  vault: [],
  setAuth: async () => {
    const { auth } = await getStorage(["auth"]);
    set((state) => ({
      auth: !state.auth,
    }));
    setStorage({ auth: !auth });
  },
  setApi: (url, ship, code) => {
    const api = new Urbit(url, code);
    api.ship = ship;
    set({ api: api });
  },
  setUrl: (url) => set({ url: url }),
  setVault: (vault) => set({ vault: vault }),
  setError: (error) => set({ error: error }),
  setTest: (test) => set({ test: test }),
  init: async () => {
    const res = await getStorage(["secret", "vault", "settings", "url"]);
    set({
      api: "",
      auth: false,
      url: res.url || "",
      secret: res.secret || "",
      vault: res.vault || [],
      settings: res.settings || [],
      error: "",
    });
  },
}));
