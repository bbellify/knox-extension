import { create } from "zustand";
import { clearIcon } from "./utils";
import { connectToShip, newApi, scryVault } from "./urbit";

export const useStore = create((set, get) => ({
  api: {},
  secret: "",
  error: "",
  suggestion: null,
  setApi: (url, ship, code) => {
    set({ api: newApi(url, ship, code) });
    if (get().secret) {
      scryVault();
    }
  },
  setSecret: (secret) => {
    set({ secret: secret });
    // TODO: for testing, remove
    // setTimeout(() => {
    //   set({ secret: "" });
    // }, 3000);
  },
  setError: (error) => set({ error: error }),
  setSuggestion: (suggestion) => {
    set({ suggestion: suggestion });
    // TODO: this timeout could be based on settings
    setTimeout(() => {
      set({ suggestion: null });
      clearIcon();
    }, 10000);
  },
  setShipCreds: (shipCreds) => {
    set({ shipCreds: shipCreds });
  },
  setTest: (test) => set({ test: test }),
  connect: async (url, ship, code) => {
    const res = await connectToShip(url, code);

    if (res.ok) {
      // TODO: handle if ship is wrong, connect method only uses url/code
      set({ api: newApi(url, ship, code) });
      // check ship for knox, tell them to download if not present
      get()
        .api.scry({
          app: "docket",
          path: "/charges",
        })
        .then((res) => {
          // TODO: I think this works but should revisit, add to noKnox component
          if (res.initial.knox) {
            // eslint-disable-next-line no-undef
            return chrome.runtime.sendMessage({
              type: "setupStatus",
              status: "connected",
            });
          } else {
            // eslint-disable-next-line no-undef
            return chrome.runtime.sendMessage({
              type: "setupStatus",
              status: "noKnox",
            });
          }
        });
    } else if (res === "badURL") {
      // eslint-disable-next-line no-undef
      chrome.runtime.sendMessage({
        type: "setupStatus",
        error: "url",
        status: "something went wrong - check your URL",
      });
    } else {
      // eslint-disable-next-line no-undef
      chrome.runtime.sendMessage({
        type: "setupStatus",
        error: "code",
        status: "check your ship and code",
      });
    }
  },
  init: () => {
    set({
      api: {},
      secret: "",
      error: "",
      suggestion: null,
    });
  },
}));
