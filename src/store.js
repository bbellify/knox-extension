import { create } from "zustand";
import { setStorage, getStorage } from "./storage";
import { sendMessage } from "./utils";
import { connectToShip, newApi } from "./urbit";
import { Urbit } from "@urbit/http-api";

export const useStore = create((set) => ({
  api: "",
  url: "",
  secret: "",
  vault: [],
  settings: {},
  error: "",
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
  setVault: (vault) => {
    set({ vault: vault });
  },
  setSecret: (secret) => {
    set({ secret: secret });
    sendMessage({ type: "secretSet" });
  },
  setSuggestion: (suggestion) => {
    set({ suggestion: suggestion });
    setTimeout(() => {
      set({ suggestion: "" });
    }, 60000);
  },
  setError: (error) => set({ error: error }),
  setTest: (test) => set({ test: test }),
  connect: async (url, ship, code) => {
    const res = await connectToShip(url, code);
    if (res.ok) {
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
    set({
      api: "",
      secret: "",
      vault: [],
      error: "",
      suggestion: "",
    });
  },
}));
