/* eslint-disable no-undef */
import { useStore } from "./store";
import { setStorage, getStorage } from "./storage";
import { setBadge, clearBadge, sendMessage } from "./utils";
import { testScry } from "./urbit";
console.log("in background");

async function init() {
  const state = useStore.getState();
  await state.init();
  storageListener();
  messageListener();
  // clickListener();
  // extensionListener();
  // hotkeyListener();

  // getStorage(["auth"]).then((res) => {
  // if (!res.auth) {
  // setBadge()
  // sendMessage({ type: "nav", to: "/setup" });
  // }
  // }
  // );

  // chrome.runtime.sendMessage({ type: "nav", data: "/setup" });
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

    const storage = await getStorage(["auth"]);

    switch (message.type) {
      case "log": {
        console.log("log message", message.message);
        break;
      }
      case "setUrl": {
        console.log("in seturl", message.url);
        // state.setUrl(message.url);
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
      case "setTest": {
        state.setTest(message.message);
        break;
      }
      case "setAuth": {
        state.setAuth();
        break;
      }
      case "setApi": {
        state.setApi(
          message.message.url,
          message.message.ship,
          message.message.code
        );
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
      case "appMount": {
        sendResponse({ type: "response", data: storage });
        break;
      }
      case "testing": {
        sendMessage({ type: "testing2" });
        break;
      }
      case "connectShip": {
        state.connect(message.url, message.ship, message.code);
        break;
      }
      case "testScry2": {
        testScry();
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
  chrome.tabs.get(tab, async (current_tab_info) => {
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
