/* eslint-disable no-undef */
import { useStore } from "./store";
import { setStorage, getStorage } from "./storage";
import { sendMessage } from "./utils";
import { scryVault } from "./urbit";
console.log("in background");

async function init() {
  const state = useStore.getState();
  await state.init();
  storageListener();
  messageListener();
  // clickListener();
  // extensionListener();
  // hotkeyListener();
}
init();

function storageListener() {
  chrome.storage.onChanged.addListener(async function (changes) {
    // const state = useStore.getState();
    // if (changes.connected && changes.connected.newValue === true) {
    //   clearBadge();
    //   if (!state.vault.length && state.api) {
    //     return state.api
    //       .scry({
    //         app: "knox",
    //         path: "/vault",
    //       })
    //       .then((res) => state.setVault(res));
    //   }
    // }
    // if (changes.connected && changes.connected.newValue === false) {
    //   return setBadge();
    // }
    // if (changes.vault) return state.setVault(changes.vault.newValue);
    if (changes.url) sendMessage({ type: "urlStorage", message: changes.url });
  });
}

async function messageListener() {
  chrome.runtime.onMessage.addListener(async function (message) {
    const state = useStore.getState();

    switch (message.type) {
      case "setupStatus": {
        if (message.status === "ok" && !state.vault) scryVault();
        break;
      }
      case "setUrl": {
        if (!message.url) return setStorage({ url: null });
        setStorage({ url: message.url });
        sendMessage({ type: "setupStatus", status: "urlSet" });
        break;
      }
      case "setApi": {
        state.setApi(message.url, message.ship, message.code);
        break;
      }
      case "connectShip": {
        state.connect(message.url, message.ship, message.code);
        break;
      }
      case "testScry": {
        scryVault();
        break;
      }
      case "setSecret": {
        state.setSecret(message.secret);
        if (!state.vault.length) scryVault();
        break;
      }
      case "getSecret": {
        sendMessage({ type: "getSecretRes", secret: state.secret });
        break;
      }
      case "getState": {
        console.log("in get state in bg");
        sendMessage({ type: "state", state: state });
        break;
      }
      case "getNav": {
        // TODO: add nav to save case
        const { url } = await getStorage(["url"]);
        if (!url) {
          return sendMessage({ type: "popupNav", message: "/connect" });
        } else if (!state.api) {
          return sendMessage({ type: "popupNav", message: "/connect" });
        } else if (!state.secret) {
          return sendMessage({ type: "popupNav", message: "/secret" });
        } else return sendMessage({ type: "popupNav", message: "/" });
      }
      default:
        console.log("request", message);
    }
  });
}

// refrence - I might want both activated and updated?
// chrome.tabs.onActivated.addListener((tab) => {
//   chrome.tabs.get(tab.tabId, async (current_tab_info) => {
//     if (current_tab_info.status === "complete") {
//       const vault = await getStorage(["vault"]);
//       await chrome.scripting.executeScript({
//         files: ["content.js"],
//         target: { tabId: tab.tabId },
//       });
//       chrome.tabs.sendMessage(tab.tabId, { type: "content", vault });
//     }
//   });
// });

// reference
chrome.tabs.onUpdated.addListener((tab) => {
  const state = useStore.getState();
  chrome.tabs.get(tab, async (current_tab_info) => {
    if (current_tab_info.status === "complete") {
      await chrome.scripting.executeScript({
        files: ["content.js"],
        target: { tabId: tab },
      });
      chrome.tabs.sendMessage(tab, {
        type: "content",
        vault: state.vault,
        secret: state.secret,
      });
      sendMessage({ type: "state", state: state });
    }
  });
});
