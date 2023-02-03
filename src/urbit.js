import Urbit from "@urbit/http-api";
import { useStore } from "./store";

export async function connectToShip(url, code) {
  const controller = new AbortController();
  setTimeout(() => {
    controller.abort();
  }, 5000);

  try {
    const res = await fetch(url.replace(/\/$/g, "") + "/~/login", {
      body: `password=${code}`,
      method: "POST",
      credentials: "include",
      redirect: "follow",
      signal: controller.signal,
    });
    return res;
  } catch {
    console.log("in catch");
    return "badURL";
  }
}

export function newApi(url, ship, code) {
  const api = new Urbit(url, code);
  api.ship = ship;
  return api;
}

export async function scryVault() {
  const state = useStore.getState();
  const { api } = state;
  // handle error here
  if (!api) {
    console.log("no api");
    return;
  }

  api
    .scry({
      app: "knox",
      path: "/vault",
    })
    .then((res) => state.setVault(res.vault));
}
