import { Urbit } from "@urbit/http-api";
import { create } from "zustand";
import { setStorage, getStorage } from "./storage";

export const useStore = create((set) => ({
  url: "",
  vault: [],
  setUrl: (url) => set((state) => ({ url: url })),
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
    set((state) => ({ api: api }));
  },
  setVault: (vault) => set((state) => ({ vault: vault })),
  setError: (error) => set((state) => ({ error: error })),
  setTest: (test) => set((state) => ({ test: test })),
  init: async () => {
    const res = await getStorage(["secret", "vault", "settings", "url"]);
    set((state) => ({
      api: "",
      auth: false,
      url: res.url || "",
      secret: res.secret || "",
      vault: res.vault || [],
      settings: res.settings || [],
      error: "",
    }));
  },
}));
