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

  if (!state.auth) {
    setBadge();
    setStorage({ auth: false });
  }
}
init();

function storageListener() {
  chrome.storage.onChanged.addListener(function (changes) {
    console.log("in storage change", changes);
    const state = useStore.getState();
    if (changes.auth && changes.auth.newValue === true) {
      clearBadge();
      state.api
        .scry({
          app: "knox",
          path: "/vault",
        })
        .then((res) => console.log("res in storage", res));
    }
    if (changes.auth && changes.auth.newValue === false) {
      setBadge();
    }
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
          .then((res) => state.setVault(res.vault));
        break;
      }
      default:
        console.log("request", request);
    }
  });
}

chrome.tabs.onActivated.addListener((tab) => {
  chrome.tabs.get(tab.tabId, (current_tab_info) => {
    console.log("current tab info activated", current_tab_info);
    if (current_tab_info.status === "complete") {
      console.log("in complete in activated");
      chrome.scripting.executeScript({
        files: ["content.js"],
        target: { tabId: tab.tabId },
      });
    }
  });
});

chrome.tabs.onUpdated.addListener((tab) => {
  console.log("tab in updated", tab);
  // console.log("changeInfo in updated", changeInfo);
  chrome.tabs.get(tab, (current_tab_info) => {
    console.log("tab info in updated/get", current_tab_info);
    if (current_tab_info.status === "complete") {
      // if (/^https:\/\/www\.google/.test(current_tab_info.url)) {
      console.log("in scripting");
      chrome.scripting.executeScript({
        files: ["content.js"],
        target: { tabId: tab },
      });
      // }
    }
  });
});
