import { sendMessage } from "./utils";
import { addTooltip, addNoSecretTooltip, clearTooltip } from "./tooltip";
import { getStorage } from "./storage";
console.log("in content");

const logIns = ["username", "email"];
const passes = ["password"];

document.addEventListener("click", (e) => {
  if (
    e.target.nodeName !== "INPUT" &&
    e.target.id !== "submitSecret" &&
    e.target.id !== "tooltip"
  )
    clearTooltip();
});

const location = window.location.toString();
const website = new URL(location).hostname.replace("www.", "");

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

// eslint-disable-next-line no-undef
chrome.runtime.sendMessage({ type: "getState" }, (res) => {
  const { secret } = res.state;

  getStorage(["vault", "shipCreds"]).then((res) => {
    const { vault, shipCreds } = res;

    if (!shipCreds) return handleNoShipCreds();
    if (!vault) return handleNoVault();

    if (vault.length) {
      const entries = vault.filter((entry) =>
        // TODO: replace location with website?
        location.includes(entry.website)
      );
      if (entries.length) {
        if (!secret) {
          console.log("no secret");
          if (username) {
            return username.addEventListener("click", () => {
              addNoSecretTooltip(entries, shipCreds, username, pword);
            });
          } else return;
        } else {
          if (username)
            username.addEventListener("click", () => {
              addTooltip(entries, secret, username, pword);
            });
          if (pword)
            pword.addEventListener("click", () => entryToolTip("password"));
        }
      } else {
        handleNoEntry();
        // TODO: remove this, for testing
        username?.addEventListener("click", () => noEntryToolTip());
      }
    } else {
      handleNoVault();
    }
  });
});

function entryToolTip(clicked) {
  console.log(`click in ${clicked}`);
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

function handleNoVault() {
  // TODO: handle auth or scry here - no vault
  console.log("no vault");
}

function handleNoShipCreds() {
  // TODO: need to go back to set up if no shipCreds
  console.log("no shipCreds");
}
