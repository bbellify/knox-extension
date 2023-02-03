import { aesDecrypt, sendMessage } from "./utils";
import { addTooltip, clearTooltip } from "./tooltip";
const logIns = ["username", "email"];
const passes = ["password"];
console.log("in content");

const location = window.location.toString();

document.addEventListener("click", (e) => {
  if (e.target.nodeName !== "INPUT") clearTooltip();
});

let allInputs = document.querySelectorAll("input");
let username;
let pword;
for (let i = 0; i < allInputs.length; i++) {
  if (logIns.includes(allInputs[i].name)) username = allInputs[i];
  if (allInputs[i].type === "password" || passes.includes(allInputs[i].name))
    pword = allInputs[i];
}

// eslint-disable-next-line
chrome.runtime.onMessage.addListener((message) => {
  if (message.type === "content") {
    console.log("message in content", message);
    const { vault } = message;

    if (vault && vault.length) {
      const entries = vault.filter((entry) =>
        location.includes(aesDecrypt(entry.website, "test"))
      );
      if (entries.length) {
        const decryptedEntries = entries.map((entry) => {
          return {
            website: aesDecrypt(entry.website, "test"),
            username: aesDecrypt(entry.username, "test"),
            password: aesDecrypt(entry.password, "test"),
          };
        });
        if (username)
          username.addEventListener("mousedown", () =>
            addTooltip(decryptedEntries, username, pword)
          );
        if (pword)
          pword.addEventListener("mousedown", () => entryToolTip("password"));
      } else {
        // TODO: handle asking to save password here - vault but no entry
        username.addEventListener("mousedown", () => noEntryToolTip());
        pword.addEventListener("mousedown", () => noEntryToolTip());
      }
    } else {
      // TODO: handle auth or scry here - no vault
      console.log("no vault");
    }
  }
});

function entryToolTip(clicked) {
  console.log(`mousedown in ${clicked}`);
}

function noEntryToolTip() {
  console.log("no entry");
}
