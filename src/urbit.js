import Urbit from "@urbit/http-api";
import { setVaultToStorage } from "./storage";
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
    return "badURL";
  }
}

export function newApi(url, ship, code) {
  const api = new Urbit(url, code);
  api.ship = ship;
  return api;
}

export async function scryVault() {
  console.log("in scry");
  const state = useStore.getState();
  const { api, secret } = state;
  // TODO: handle error here/remove log
  if (!Object.keys(api).length) {
    return console.log("no api");
  }

  // TODO: handle if there's no secret?
  if (!secret) {
    return console.log("no secret");
  }

  api
    .scry({
      app: "knox",
      path: "/vault",
    })
    .then((res) => setVaultToStorage(res.vault, secret));
}
