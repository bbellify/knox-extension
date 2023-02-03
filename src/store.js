import { create } from "zustand";
import { setStorage, getStorage } from "./storage";
import { clearBadge, sendMessage, setBadge } from "./utils";
import { connectToShip, newApi } from "./urbit";
import { Urbit } from "@urbit/http-api";

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
    if (!url || !ship || !code) {
      // TODO: handle this error somehow
      setStorage({ connected: false });
      return set({ api: "" });
    }
    const api = new Urbit(url, code);
    api.ship = ship;
    setStorage({ connected: true });
    set({ api: api });
  },
  setUrl: (url) => set({ url: url }),
  setVault: (vault) => {
    set({ vault: vault });
    sendMessage({ type: "log" });
  },
  setSecret: (secret) => {
    set({ secret: secret });
    sendMessage({ type: "secret", secret: true });
  },
  setError: (error) => set({ error: error }),
  setTest: (test) => set({ test: test }),
  connect: async (url, ship, code) => {
    const res = await connectToShip(url, code);
    if (res.ok) {
      setStorage({ connected: true });
      set({ api: newApi(url, ship, code) });
      sendMessage({ type: "setupStatus", status: "ok" });
    } else if (res === "badURL") {
      sendMessage({
        type: "setupStatus",
        error: "url",
        status: "something went wrong - check your URL",
      });
    } else {
      sendMessage({
        type: "setupStatus",
        error: "ship",
        status: "something went wrong - check your ship and code",
      });
    }
  },
  init: async () => {
    setStorage({ connected: false });
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
