import { createPopper } from "@popperjs/core";
import { aesDecrypt } from "./utils";
const logIns = ["username", "email"];
const passes = ["password"];
console.log("in content");

const location = window.location.toString();

document.addEventListener("click", (e) => {
  if (e.target.nodeName !== "INPUT") clearPopup();
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
    const { vault } = message.vault;

    if (vault.length) {
      const entry = vault.find((entry) =>
        location.includes(aesDecrypt(entry.website, "test"))
      );
      if (entry) {
        const decryptedEntry = {
          website: aesDecrypt(entry.website, "test"),
          username: aesDecrypt(entry.username, "test"),
          password: aesDecrypt(entry.password, "test"),
        };
        console.log("decryptedEntry", decryptedEntry);
        // username.value = decryptedEntry.username;
        // pword.value = decryptedEntry.password;
        username.addEventListener("mousedown", () =>
          addPopup(decryptedEntry.username, decryptedEntry.password)
        );
        pword.addEventListener("mousedown", () => entryToolTip("password"));
      } else {
        // handle asking to save password here - vault but no entry
        username.addEventListener("mousedown", () => noEntryToolTip());
        pword.addEventListener("mousedown", () => noEntryToolTip());
      }
    } else {
      // handle auth or scry here - no vault
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

function addPopup(name, pass) {
  const wrapper = document.createElement("div");
  const usernameP = document.createElement("p");
  const passwordP = document.createElement("p");
  usernameP.textContent = name;
  usernameP.style.color = "white";
  usernameP.margin = "0";
  wrapper.id = "popup";
  usernameP.id = "popup-username";

  // wrapper.style.display = "hidden";
  wrapper.style.borderRadius = "4px";
  wrapper.style.background = "black";
  wrapper.style.padding = "0px 10px";

  wrapper.appendChild(usernameP);
  // wrapper.appendChild(passwordP);
  wrapper.addEventListener("click", () => {
    username.value = name;
    pword.value = pass;
  });
  document.body.appendChild(wrapper);

  createPopper(username, wrapper, {
    placement: "bottom",
    modifiers: {
      name: "offset",
      options: {
        offset: [0, 10],
      },
    },
  });
}

function clearPopup() {
  const popup = document.getElementById("popup");
  if (popup) return popup.remove();
  return;
}
