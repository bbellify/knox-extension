/* eslint-disable no-undef */

export const getStorage = (key) =>
  new Promise((res, rej) =>
    chrome.storage.local.get(key, (result) => {
      if (chrome.runtime.lastError) rej(undefined);
      res(result);
    })
  );

export const setStorage = (item) => {
  new Promise((res, rej) => {
    chrome.storage.local.set(item, () => {
      if (chrome.runtime.lastError) rej(chrome.runtime.lastError);
      res(item);
    });
  });
};
