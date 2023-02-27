/* eslint-disable no-undef */
import { useStore } from "./store";
import { setStorage, getStorage } from "./storage";
import { scryVault } from "./urbit";
import { clearIcon, setSuggestionIcon } from "./utils";
console.log("in background");

async function init() {
  const state = useStore.getState();
  await state.init();
  messageListener();
  // finish below init check
  // checkApiandVaultandWhatelse?()

  // clickListener();
  // extensionListener();
  // hotkeyListener();
}
init();

async function messageListener() {
  chrome.runtime.onMessage.addListener(async function (
    message,
    sender,
    sendResponse
  ) {
    const state = useStore.getState();

    switch (message.type) {
      case "getState": {
        // TODO: add nav to save case
        sendResponse({ state: state });
        break;
      }
      case "setUrl": {
        if (!message.url) return setStorage({ url: null });
        setStorage({ url: message.url });
        sendResponse({ status: "urlSet" });
        break;
      }
      case "connectShipSetup": {
        const { url } = await getStorage("url");
        state.connect(url, message.ship, message.code);
        break;
      }
      case "setSecret": {
        state.setSecret(message.secret);
        if (message.url && message.shipCreds) {
          state.setApi(
            message.url,
            message.shipCreds.ship,
            message.shipCreds.code
          );
        }
        break;
      }
      case "setSuggestion": {
        state.setSuggestion(message.suggestion);
        if (message.suggestion) setSuggestionIcon();
        if (!message.suggestion) clearIcon();
        break;
      }
      case "openKnoxTab": {
        const { url } = await getStorage("url");
        chrome.tabs.create({
          url: `${url}/apps/knox`,
        });
        break;
      }
      case "scryVault": {
        scryVault();
        break;
      }
      default:
        console.log("request", message);
        return true;
    }
  });
}

chrome.tabs.onUpdated.addListener((tab) => {
  chrome.tabs.get(tab, async (current_tab_info) => {
    if (current_tab_info.status === "complete") {
      await chrome.scripting.executeScript({
        files: ["content.js"],
        target: { tabId: tab },
      });
    }
  });
});

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
