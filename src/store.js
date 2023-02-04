import { create } from "zustand";
import { sendMessage } from "./utils";
import { connectToShip, newApi } from "./urbit";
import { Urbit } from "@urbit/http-api";

export const useStore = create((set) => ({
  api: "",
  secret: "",
  error: "",
  suggestion: "",
  setApi: (url, ship, code) => {
    if (!url || !ship || !code) {
      // TODO: handle this error somehow
      return set({ api: "" });
    }
    const api = new Urbit(url, code);
    api.ship = ship;
    set({ api: api });
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
  init: () => {
    set({
      api: "",
      secret: "",
      error: "",
      suggestion: "",
    });
  },
}));
