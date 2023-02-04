/* eslint-disable no-undef */
import { useStore } from "./store";
import { setStorage, getStorage } from "./storage";
import { sendMessage } from "./utils";
import { scryVault } from "./urbit";
import * as bcrypt from "bcryptjs";
console.log("in background");

async function init() {
  const state = useStore.getState();
  await state.init();
  storageListener();
  messageListener();
  // finish below init check
  // checkApiandVaultandWhatelse?()

  // clickListener();
  // extensionListener();
  // hotkeyListener();
}
init();

// TODO: do I need this? only thing in storage is url right now. might use for settings
function storageListener() {
  chrome.storage.onChanged.addListener(async function (changes) {
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
      case "connectShip": {
        state.connect(message.url, message.ship, message.code);
        break;
      }
      case "saveSecret": {
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(message.secret, salt);
        setStorage({ secret: hash });
        state.setSecret(message.secret);

        const { vault } = await getStorage("vault");
        if (!vault.length) scryVault();
        break;
      }
      case "setSecret": {
        state.setSecret(message.secret);
        break;
      }
      case "getSecret": {
        sendMessage({ type: "getSecretRes", secret: state.secret });
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
        } else if (state.suggestion) {
          return sendMessage({ type: "popupNav", message: "/save" });
        } else return sendMessage({ type: "popupNav", message: "/" });
      }
      case "setSuggestion": {
        state.setSuggestion(message.suggestion);
        break;
      }
      case "getSuggestion": {
        sendMessage({ type: "getSuggestionRes", suggestion: state.suggestion });
        break;
      }
      case "scryVault": {
        scryVault();
        break;
      }
      // TODO: cases below (except default) are only for testing
      case "setApi": {
        state.setApi(message.url, message.ship, message.code);
        break;
      }
      case "getState": {
        console.log("state in bg", state);
        break;
      }
      default:
        console.log("request", message);
    }
  });
}

chrome.tabs.onUpdated.addListener((tab) => {
  const state = useStore.getState();
  chrome.tabs.get(tab, async (current_tab_info) => {
    if (current_tab_info.status === "complete") {
      const { vault } = await getStorage("vault");
      await chrome.scripting.executeScript({
        files: ["content.js"],
        target: { tabId: tab },
      });
      chrome.tabs.sendMessage(tab, {
        type: "content",
        vault: vault,
        secret: state.secret,
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
