/* eslint-disable no-extend-native */
/* eslint-disable no-undef */
import AES from "crypto-js/aes";
import CryptoJS from "crypto-js";

export function setBadge() {
  chrome.action.setBadgeText({ text: "!" });
  chrome.action.setBadgeBackgroundColor({ color: "#ef4444" });
}

// TODO: this works but the icon is stupid, figure out better UI/UX
export function setSuggestionIcon() {
  chrome.action.setIcon({
    path: {
      16: "save.png",
      32: "save.png",
      48: "save.png",
      128: "save.png",
    },
  });
}

export function clearIcon() {
  chrome.action.setIcon({
    path: {
      16: "knox-100.png",
      32: "knox-100.png",
      48: "knox-100.png",
      128: "knox-100.png",
    },
  });
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
  const decrypted = AES.decrypt(string, secret);

  if (decrypted.toString(CryptoJS.enc.Utf8)) {
    return decrypted.toString(CryptoJS.enc.Utf8);
  } else return undefined;
}

export function generatePassword(enty) {
  let specials = "!@#$%^&*()_+{}:\"<>?|[];',./`~";
  let lowercase = "abcdefghijklmnopqrstuvwxyz";
  let uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let numbers = "0123456789";

  let all = specials + lowercase + uppercase + numbers;

  let password = "";
  password += specials.pick(enty.toString(), 1);
  password += lowercase.pick(enty.toString(), 1);
  password += uppercase.pick(enty.toString(), 1);
  password += numbers.pick(enty.toString(), 1);
  password += all.pick(enty.toString(), 8, 10);
  password = password.shuffle();
  return password;
}

// TODO: this works alright but shuffle still relies on .random, how good is this really?
String.prototype.pick = function (enty, min, max) {
  let n,
    chars = "";

  if (typeof max === "undefined") {
    n = min;
  } else {
    n = min + Math.floor(Math.random() * (max - min + 1));
  }

  for (let i = 0; i < n; i++) {
    chars += this.charAt(
      Math.floor(parseFloat(`0.${enty.shuffle()}`) * this.length)
    );
  }

  return chars;
};

String.prototype.shuffle = function () {
  let array = this.split("");
  let tmp,
    current,
    top = array.length;

  if (top)
    while (--top) {
      current = Math.floor(Math.random() * (top + 1));
      tmp = array[current];
      array[current] = array[top];
      array[top] = tmp;
    }

  return array.join("");
};
