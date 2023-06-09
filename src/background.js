/* eslint-disable no-undef */
import { useStore } from "./store";
import { setStorage, getStorage } from "./storage";
import { scryVault, getEnty } from "./urbit";
import { aesDecrypt, setBadge, clearBadge } from "./utils";

async function init() {
  const state = useStore.getState();
  await state.init();
  messageListener();
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
          const { shipCreds } = await getStorage("shipCreds");
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
        if (message.suggestion) setBadge();
        if (!message.suggestion) clearBadge();
        break;
      }
      case "scryVault": {
        scryVault();
        break;
      }
      case "lock": {
        state.setSecret("");
        break;
      }
      case "generate": {
        getEnty();
        break;
      }
      default:
        console.log("default", message);
        return true;
    }
    return true;
  });
}

// reference - do I not even need this?
//
// chrome.tabs.onUpdated.addListener((tab) => {
//   chrome.tabs.get(tab, async (current_tab_info) => {
//     if (current_tab_info.status === "complete" && current_tab_info.active) {
//       console.log("in complete", current_tab_info);
//       return await chrome.scripting.executeScript({
//         files: ["content.js"],
//         target: { tabId: tab },
//       });
//     }
//   });
// });
