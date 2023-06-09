import { createPopper } from "@popperjs/core";
import { aesDecrypt } from "./utils";

export function addTooltipCSS(docToUse) {
  const style = docToUse.createElement("style");
  style.id = "knox-style";

  style.innerHTML = `
    #tooltip {
        background: #222F44;
        border-radius: 5px;
        position: relative;
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 5px 0px;
        width: 250px;
        z-index: 999999;
      }
      
      [id^='entry-wrapper'] {
        background: inherit;
        margin: 0;
        padding: 6px 0px;
        width: 100%;
      }

      [id^='entry-wrapper']:hover {
        background: #337CA0;
      }

      [id^='tooltip-username'] {
        font-size: 0.9rem;
        margin: 0px 6% 0px 6%;
        color: white;
        overflow-x: scroll;
        width: 88%;
      }
      
      [id^='tooltip-pass'] {
        all: unset;
        color: white;
        background: inherit;
        margin: 0 6%;
        width: 88%;
        overflow-x: scroll;
      }

      #divider {
        border-top: 1px solid white;
        margin-top: 5px;
        width: 88%;
      }

      #tildy {
        color: white;
        margin: 5px 0;
        font-weight: bold;
      }

      #input-wrapper {
        display: flex;
        flex-direction: column;
        padding: 10px 0;
      }

      .invalid-secret {
        animation: shake 300ms;
      }

      @keyframes shake {
        25% {
          transform: translateX(4px);
        }
        50% {
          transform: translateX(-4px);
        }
        75% {
          transform: translateX(4px)
        }
      }
    `;
  docToUse.head.appendChild(style);
}

export function addTooltip(entries, secret, usernameField, docToUse) {
  addTooltipCSS(docToUse);
  if (!secret) return handleNoSecret();

  const tooltip = prepTooltip(docToUse);

  entries.forEach((entry, i) => {
    const username = aesDecrypt(entry.username, secret);
    const password = aesDecrypt(entry.password, secret);

    const entryWrapper = docToUse.createElement("div");
    entryWrapper.id = `entry-wrapper-${i}`;
    const usernameP = docToUse.createElement("p");
    usernameP.id = `tooltip-username-${i}`;
    const passwordP = docToUse.createElement("input");
    passwordP.id = `tooltip-pass-${i}`;
    passwordP.type = "password";
    passwordP.disabled = true;

    usernameP.textContent = username;
    passwordP.value = password;

    entryWrapper.appendChild(usernameP);
    entryWrapper.appendChild(passwordP);
    tooltip.appendChild(entryWrapper);
    entryWrapper.addEventListener("click", () => {
      if (usernameField) usernameField.value = username;
      if (getPasswordInput(docToUse))
        getPasswordInput(docToUse).value = password;
      clearTooltip(docToUse);
    });
  });

  const divider = docToUse.createElement("div");
  divider.id = "divider";
  const tildy = docToUse.createElement("p");
  tildy.innerHTML = "~";
  tildy.id = "tildy";
  tooltip.appendChild(divider);
  tooltip.appendChild(tildy);

  createPopper(usernameField, tooltip, {
    placement: "top",
    modifiers: {
      name: "offset",
      options: {
        offset: [0, 10],
      },
    },
  });

  const allTips = Array.from(docToUse.getElementsByClassName("knox-tooltip"));
  allTips.forEach((tip, i) => {
    return i !== allTips.length - 1 ? tip.remove() : null;
  });
}

export function addNoSecretTooltip(
  entries,
  shipCreds,
  usernameField,
  url,
  docToUse
) {
  addTooltipCSS(docToUse);

  const tooltip = prepTooltip(docToUse);
  const inputWrapper = docToUse.createElement("div");
  inputWrapper.id = "input-wrapper";
  const secretInput = docToUse.createElement("input");
  secretInput.id = "secret-input";
  secretInput.type = "password";
  const submitSecret = docToUse.createElement("button");
  submitSecret.id = "submitSecret";
  submitSecret.innerText = "set secret";
  tooltip.appendChild(inputWrapper);
  inputWrapper.appendChild(secretInput);
  inputWrapper.appendChild(submitSecret);

  submitSecret.addEventListener("click", (e) => {
    e.preventDefault();
    if (
      aesDecrypt(shipCreds.ship, secretInput.value) &&
      aesDecrypt(shipCreds.code, secretInput.value)
    ) {
      // eslint-disable-next-line no-undef
      chrome.runtime.sendMessage({
        type: "setSecret",
        secret: secretInput.value,
        url: url,
        shipCreds: {
          ship: aesDecrypt(shipCreds.ship),
          code: aesDecrypt(shipCreds.code),
        },
      });
      if (usernameField) {
        addTooltip(entries, secretInput.value, usernameField, docToUse);
        return usernameField.addEventListener("click", () => {
          addTooltip(entries, secretInput.value, usernameField, docToUse);
        });
      }
    } else {
      console.log("invalid secret");
      secretInput.classList.add("invalid-secret");
      secretInput.value = "";
      setTimeout(() => {
        secretInput.classList.remove("invalid-secret");
      }, 300);
    }
  });

  createPopper(usernameField, tooltip, {
    placement: "top",
    modifiers: {
      name: "offset",
      options: {
        offset: [0, 10],
      },
    },
  });

  const allTips = Array.from(docToUse.getElementsByClassName("knox-tooltip"));
  allTips.reverse().forEach((tip, i) => {
    return i !== allTips.length - 1 ? tip.remove() : null;
  });
}

export function clearTooltip(docToUse) {
  const tooltip = docToUse.getElementById("tooltip");
  const style = docToUse.getElementById("knox-style");
  if (tooltip) tooltip.remove();
  if (style) style.remove();
  return;
}

function prepTooltip(docToUse) {
  const tooltip = docToUse.createElement("div");
  tooltip.role = "tooltip";
  tooltip.id = "tooltip";
  tooltip.className = "knox-tooltip";
  docToUse.body.appendChild(tooltip);
  return tooltip;
}

function handleNoSecret() {
  // TODO: finish this
  console.log("no secret in tooltip but there should be");
}

function getPasswordInput(docToUse) {
  let passwordField;
  const inputElements = docToUse.getElementsByTagName("input");
  for (let i = 0; i < inputElements.length; i++) {
    if (inputElements[i].type === "password" && !inputElements[i].disabled) {
      passwordField = inputElements[i];
    }
  }
  return passwordField;
}
