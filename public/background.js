/* eslint-disable no-undef */

console.log("in background");

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

// chrome.tabs.onActivated.addListener((tab) => {
//   chrome.tabs.get(tab.tabId, (current_tab_info) => {
//     if (/^https:\/\/www\.google/.test(current_tab_info.url))
//       console.log("in googs");
//   });
// });
//
// chrome.tabs.onUpdated.addListener((tab, changeInfo) => {
//   if (changeInfo.status === "complete") {

//       if (/^https:\/\/www\.google/.test(current_tab_info.url)) {
//         console.log("in googs scripting");
//         chrome.scripting.executeScript({
//           files: ["contentScript.js"],
//           target: { tabId: tab.id },
//         });
//       }
//     }
//   })
