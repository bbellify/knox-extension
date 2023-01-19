/* eslint-disable no-undef */

export const getStorage = (key) =>
  new Promise((res, rej) =>
    chrome.storage.local.get(key, (result) => {
      console.log("in get");
      if (chrome.runtime.lastError) rej(undefined);
      res(result);
    })
  );

export const setStorage = (item) => {
  new Promise((res, rej) => {
    chrome.storage.local.set(item, () => {
      console.log("in set");
      if (chrome.runtime.lastError) rej(chrome.runtime.lastError);
      res(item);
    });
  });
};
