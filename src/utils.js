/* eslint-disable no-undef */
import AES from "crypto-js/aes";
import CryptoJS from "crypto-js";

export function sendMessage(message) {
  chrome.runtime.sendMessage(message, (response) => {
    if (chrome.runtime.lastError) {
      console.log("error");
    } else {
      console.log("testing res in util", response);
    }
  });
}

export function setBadge() {
  chrome.action.setBadgeText({ text: " " });
  chrome.action.setBadgeBackgroundColor({ color: "#ef4444" });
}

export function clearBadge() {
  chrome.action.setBadgeText({ text: "" });
}

export function aesEncrypt(string, secret) {
  if (!string || !secret) return;
  const encrypted = AES.encrypt(string, secret);
  return encrypted.toString();
}

// for decrypting a value received from knox
export function aesDecrypt(string, secret) {
  if (!string || !secret) return;
  const decrypted = AES.decrypt(string, secret).toString(CryptoJS.enc.Utf8);
  return decrypted;
}
