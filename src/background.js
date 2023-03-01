/* eslint-disable no-undef */
import { useStore } from "./store";
import { setStorage, getStorage } from "./storage";
import { scryVault, validateSecret } from "./urbit";
import { clearIcon, setSuggestionIcon, aesDecrypt } from "./utils";
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
      case "connectShipSetup": {
        state.connect(message.url, message.ship, message.code);
        break;
      }
      case "saveCreds": {
        state.setSecret(message.secret);
        setStorage({ shipCreds: message.shipCreds });
        scryVault();
        break;
      }
      case "setSecret": {
        state.setSecret(message.secret);
        if (!Object.keys(state?.api).length) {
          const shipCreds = await getStorage("shipCreds");
          state.setApi(
            aesDecrypt(shipCreds.url, message.secret),
            aesDecrypt(shipCreds.ship, message.secret),
            aesDecrypt(shipCreds.code, message.secret)
          );
        }
        break;
      }
      case "setSuggestion": {
        // TODO: this is for protecting against changes in popup
        if (message.suggestion.website === "phngmkdaejdfgjhdcddcmeniaddocbkc")
          return;
        state.setSuggestion(message.suggestion);
        if (message.suggestion) setSuggestionIcon();
        if (!message.suggestion) clearIcon();
        break;
      }
      case "openKnoxTab": {
        if (!state.secret) return sendResponse({ message: "noSecret" });
        const { shipCreds } = await getStorage("shipCreds");
        chrome.tabs.create({
          url: `${aesDecrypt(shipCreds.url, state.secret)}/apps/knox`,
        });
        break;
      }
      case "scryVault": {
        scryVault();
        break;
      }
      case "logout": {
        state.setSecret("");
        break;
      }
      case "stateTest": {
        console.log("state in bg", state);
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
    if (!current_tab_info.url.includes("chrome://"))
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
