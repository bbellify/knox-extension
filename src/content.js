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

function getInputs() {
  const allInputs = document.querySelectorAll("input");
  const allButtons = document.querySelectorAll("button");

  let username;
  let pword;

  for (let i = 0; i < allInputs.length; i++) {
    if (logIns.includes(allInputs[i].name)) {
      username = allInputs[i];
    }
    if (allInputs[i].type === "password" || passes.includes(allInputs[i].name))
      pword = allInputs[i];
  }

  let submitButton = Array.from(allButtons).find(
    (button) => button.type === "submit"
  );

  return [username, pword, submitButton];
}

let observer = new MutationObserver((mutations) => {
  // this is meant to catch any time we're only adding tooltip elements to prevent infinite loops
  // is this enough?
  for (let mutation of mutations) {
    if (
      Array.from(mutation.addedNodes).some((node) => node.id === "tooltip") ||
      Array.from(mutation.addedNodes).some(
        (node) => node.id === "knox-style"
      ) ||
      Array.from(mutation.removedNodes).some((node) => node.id === "tooltip") ||
      Array.from(mutation.removedNodes).some((node) => node.id === "knox-style")
    ) {
      // TODO: remove these logs
      return console.log("do nothing");
    } else {
      console.log("mutations in else", mutations);
      init();
    }
  }
});

observer.observe(document, { childList: true, subtree: true });

function init() {
  // eslint-disable-next-line no-undef
  chrome.runtime.sendMessage({ type: "getState" }, (res) => {
    const { secret } = res.state;

    getStorage(["vault", "shipCreds", "url"]).then((res) => {
      const { vault, shipCreds, url } = res;

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
            const [username, pword] = getInputs();
            if (username) {
              return username.addEventListener("click", () =>
                addNoSecretTooltip(entries, shipCreds, username, pword, url)
              );
              // TODO: what to do here? no username input element and no secret
            } else return;
          } else {
            const [username, pword] = getInputs();
            if (username)
              username.addEventListener("click", () => {
                addTooltip(entries, secret, username, pword);
              });
            if (pword)
              pword.addEventListener("click", () => entryToolTip("password"));
          }
        } else {
          handleNoEntry();
        }
      } else {
        handleNoVault();
      }
    });
  });
}
init();

function entryToolTip(clicked) {
  console.log(`click in ${clicked}`);
}

function noEntryToolTip() {
  console.log("no entry");
}

function handleNoEntry() {
  // TODO: remove this log
  console.log("in no entry");
  const [username, pword, submitButton] = getInputs();
  submitButton?.addEventListener("click", () => {
    const newUsername = username?.value;
    const newPassword = pword?.value;
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
