/* eslint-disable no-undef */
import { useStore } from "./store";
import { setStorage, getStorage } from "./storage";
import { setBadge, clearBadge } from "./utils";
console.log("in background");

async function init() {
  const state = useStore.getState();
  await state.init();
  storageListener();
  messageListener();
  // clickListener();
  // extensionListener();
  // hotkeyListener();

  getStorage(["auth"]).then((res) => {
    if (!res.auth) setBadge();
  });
}
init();

function storageListener() {
  chrome.storage.onChanged.addListener(async function (changes) {
    const state = useStore.getState();
    const vault = await getStorage(["vault"]);
    if (changes.auth && changes.auth.newValue === true) {
      clearBadge();
      if (!vault.length && state.api) {
        return state.api
          .scry({
            app: "knox",
            path: "/vault",
          })
          .then((res) => console.log("res in storage", res));
      }
    }
    if (changes.auth && changes.auth.newValue === false) {
      return setBadge();
    }
    if (changes.vault) return state.setVault(changes.vault.newValue);
  });
}

function messageListener() {
  chrome.runtime.onMessage.addListener(function (request) {
    const state = useStore.getState();
    switch (request.type) {
      case "log": {
        console.log("log message", request.message);
        break;
      }
      case "setUrl": {
        console.log("in seturl", request.url);
        state.setUrl(request.url);
        break;
      }
      case "setStore": {
        setStorage(request.item);
        break;
      }
      case "getStore": {
        getStorage(request.key).then((res) =>
          console.log("store in test log", res)
        );
        break;
      }
      case "logState": {
        console.log("state in test log", state);
        break;
      }
      case "setTest": {
        state.setTest(request.message);
        break;
      }
      case "setAuth": {
        state.setAuth();
        break;
      }
      case "setApi": {
        state.setApi(request.url, request.ship, request.code);
        break;
      }
      case "testScry": {
        console.log("test scry");
        state.api
          .scry({
            app: "knox",
            path: "/vault",
          })
          .then((res) => setStorage({ vault: res.vault }));
        break;
      }
      case "setError": {
        state.setError("test error");
        break;
      }
      default:
        console.log("request", request);
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
  chrome.tabs.get(tab, async (current_tab_info) => {
    console.log("tab info", current_tab_info);
    if (current_tab_info.status === "complete") {
      const vault = await getStorage(["vault"]);
      await chrome.scripting.executeScript({
        files: ["content.js"],
        target: { tabId: tab },
      });
      chrome.tabs.sendMessage(tab, { type: "content", vault });

      // getStorage(["vault"]).then((vault) => {
      //   chrome.scripting.executeScript({
      //     files: ["content.js"],
      //     target: { tabId: tab },
      //   });
      //   chrome.tabs.sendMessage(tab, { type: "content", vault });
      // });
    }
  });
});
