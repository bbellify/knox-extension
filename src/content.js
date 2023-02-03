import { aesDecrypt, sendMessage } from "./utils";
import { addTooltip, clearTooltip } from "./tooltip";
const logIns = ["username", "email"];
const passes = ["password"];
console.log("in content");

const location = window.location.toString();
const website = new URL(location).hostname.replace("www.", "");

document.addEventListener("click", (e) => {
  if (e.target.nodeName !== "INPUT") clearTooltip();
});

const allInputs = document.querySelectorAll("input");
const allButtons = document.querySelectorAll("button");

const submitButton = Array.from(allButtons).find(
  (button) => button.type === "submit"
);

let username;
let pword;
for (let i = 0; i < allInputs.length; i++) {
  if (logIns.includes(allInputs[i].name)) username = allInputs[i];
  if (allInputs[i].type === "password" || passes.includes(allInputs[i].name))
    pword = allInputs[i];
}

// eslint-disable-next-line
chrome.runtime.onMessage.addListener(async (message) => {
  if (message.type === "content") {
    const { vault, secret } = message;
    // TODO: handle if no secret here
    if (!secret) return console.log("no secret");

    if (vault && vault.length) {
      const entries = vault.filter((entry) =>
        // TODO: replace location with website?
        location.includes(aesDecrypt(entry.website, secret))
      );
      if (entries.length) {
        const decryptedEntries = entries.map((entry) => {
          return {
            website: aesDecrypt(entry.website, secret),
            username: aesDecrypt(entry.username, secret),
            password: aesDecrypt(entry.password, secret),
          };
        });
        if (username)
          username.addEventListener("mousedown", () =>
            addTooltip(decryptedEntries, username, pword)
          );
        if (pword)
          pword.addEventListener("mousedown", () => entryToolTip("password"));
      } else {
        handleNoEntry();
        // TODO: remove this, for testing
        username.addEventListener("mousedown", () => noEntryToolTip());
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

function handleNoEntry() {
  submitButton.addEventListener("click", () => {
    const newUsername = username.value;
    const newPassword = pword.value;
    sendMessage({
      type: "setSuggestion",
      suggestion: {
        website,
        newUsername,
        newPassword,
      },
    });
  });
}
