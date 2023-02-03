/* eslint-disable no-undef */
import { useStore } from "./store";
import { setStorage, getStorage } from "./storage";
import { setBadge, clearBadge, sendMessage } from "./utils";
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

function messageListener() {
  chrome.runtime.onMessage.addListener(async function (
    message,
    sender,
    sendResponse
  ) {
    const state = useStore.getState();

    switch (message.type) {
      case "setupStatus": {
        if (message.status === "ok" && !state.vault) scryVault();
        break;
      }
      case "log": {
        console.log("log message", state);
        break;
      }
      case "setUrl": {
        console.log("in seturl", message.url);
        // state.setUrl(message.url);
        if (!message.url) return setStorage({ url: null });
        setStorage({ url: message.url });
        break;
      }
      case "setStore": {
        setStorage(message.item);
        break;
      }
      case "getStore": {
        getStorage(message.key).then((res) =>
          console.log("store in test log", res)
        );
        break;
      }
      case "logState": {
        console.log("state in test log", state);
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
        break;
      }
      case "getState": {
        console.log("in get state in bg");
        sendMessage({ type: "state", state: state });
        break;
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
      chrome.tabs.sendMessage(tab, { type: "content", vault: state.vault });
      sendMessage({ type: "state", state: state });
    }
  });
});
