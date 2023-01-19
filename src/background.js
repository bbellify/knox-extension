/* eslint-disable no-undef */
import { loginToShip } from "./urbit";
import { useStore } from "./store";
import { setStorage, getStorage } from "./storage";
console.log("in background");

async function init() {
  const state = useStore.getState();
  await state.init();
  storageListener();
  messageListener();
  // extensionListener();
  // hotkeyListener();
}
init();

function storageListener() {
  chrome.storage.onChanged.addListener(function (changes) {
    console.log("in storage change", changes);
  });
}

function messageListener() {
  // request = object sent
  chrome.runtime.onMessage.addListener(function (request) {
    console.log("request", request);
    const state = useStore.getState();
    if (request.type === "setUrl") {
      console.log("in seturl", request.url);
      state.setUrl(request.url);
    }
    if (request.type === "store") {
      return setStorage(request.item);
    }
    if (request.type === "getStore") {
      getStorage(request.key).then((res) =>
        console.log("res in test get", res)
      );
    }
    if (request.type === "logUrl") {
      console.log("state in test log", state);
    }
  });
}

chrome.tabs.onActivated.addListener((tab) => {
  chrome.tabs.get(tab.tabId, (current_tab_info) => {
    console.log("current tab info activated", current_tab_info);
    if (current_tab_info.status === "complete")
      console.log("in complete in activated");
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
        files: ["contentScript.js"],
        target: { tabId: tab },
      });
      // }
    }
  });
});
