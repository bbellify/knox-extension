import { create } from "zustand";
import { sendMessage } from "./utils";
import { connectToShip, newApi, scryVault } from "./urbit";
import { getStorage } from "./storage";

export const useStore = create((set, get) => ({
  api: {},
  secret: "",
  error: "",
  suggestion: "",
  setApi: (url, ship, code) => {
    set({ api: newApi(url, ship, code) });
    if (get().secret) {
      scryVault();
    }
  },
  setSecret: (secret) => {
    set({ secret: secret });
    sendMessage({ type: "secretSet" });
  },
  setError: (error) => set({ error: error }),
  setSuggestion: (suggestion) => {
    set({ suggestion: suggestion });
    // TODO: this timeout could be based on settings
    setTimeout(() => {
      set({ suggestion: "" });
    }, 30000);
  },
  setShipCreds: (shipCreds) => {
    set({ shipCreds: shipCreds });
  },
  setTest: (test) => set({ test: test }),
  connect: async (url, ship, code) => {
    const { shipCreds } = await getStorage("shipCreds");
    console.log("shipCreds in store", shipCreds);
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
  init: () => {
    set({
      api: {},
      secret: "",
      error: "",
      suggestion: "",
    });
  },
}));
