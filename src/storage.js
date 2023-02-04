/* eslint-disable no-undef */
import { aesDecrypt } from "./utils";

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

export const setVaultToStorage = (vault, secret) => {
  const decVault = vault.map((entry) => {
    return {
      ...entry,
      website: aesDecrypt(entry.website, secret),
    };
  });
  setStorage({ vault: decVault });
};
