import { createPopper } from "@popperjs/core";
import { aesDecrypt } from "./utils";

export function addTooltipCSS() {
  const style = document.createElement("style");
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
      
      #arrow {
        position: absolute;
        width: 10px;
        height: 10px;
        transform: rotate(45deg);
        position: absolute;
        top: -5px;
        background: inherit;
        z-index: -1;
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
  document.head.appendChild(style);
}

export function addTooltip(entries, secret, usernameField, passField) {
  addTooltipCSS();
  if (!secret) return handleNoSecret();

  const tooltip = prepTooltip();

  entries.forEach((entry, i) => {
    const username = aesDecrypt(entry.username, secret);
    const password = aesDecrypt(entry.password, secret);

    const entryWrapper = document.createElement("div");
    entryWrapper.id = `entry-wrapper-${i}`;
    const usernameP = document.createElement("p");
    usernameP.id = `tooltip-username-${i}`;
    const passwordP = document.createElement("input");
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
      if (passField) passField.value = password;
      clearTooltip();
    });
  });

  const divider = document.createElement("div");
  divider.id = "divider";
  const tildy = document.createElement("p");
  tildy.innerHTML = "~";
  tildy.id = "tildy";
  tooltip.appendChild(divider);
  tooltip.appendChild(tildy);

  createPopper(usernameField, tooltip, {
    placement: "bottom",
    modifiers: {
      name: "offset",
      options: {
        offset: [0, 10],
      },
    },
  });

  // TODO: see below
  const allTips = Array.from(document.getElementsByClassName("knox-tooltip"));
  allTips.forEach((tip, i) => {
    return i !== allTips.length - 1 ? tip.remove() : null;
  });
}

export function addNoSecretTooltip(
  entries,
  shipCreds,
  usernameField,
  passwordField,
  url
) {
  addTooltipCSS();

  const tooltip = prepTooltip();
  const inputWrapper = document.createElement("div");
  inputWrapper.id = "input-wrapper";
  const secretInput = document.createElement("input");
  secretInput.id = "secret-input";
  const submitSecret = document.createElement("button");
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
        addTooltip(entries, secretInput.value, usernameField, passwordField);
        return usernameField.addEventListener("click", () => {
          addTooltip(entries, secretInput.value, usernameField, passwordField);
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
    placement: "bottom",
    modifiers: {
      name: "offset",
      options: {
        offset: [0, 10],
      },
    },
  });

  // TODO: see below
  const allTips = Array.from(document.getElementsByClassName("knox-tooltip"));
  allTips.forEach((tip, i) => {
    return i !== allTips.length - 1 ? tip.remove() : null;
  });
}

export function clearTooltip() {
  const tooltip = document.getElementById("tooltip");
  const style = document.getElementById("knox-style");
  if (tooltip) tooltip.remove();
  if (style) style.remove();
  return;
}

function prepTooltip() {
  const tooltip = document.createElement("div");
  tooltip.role = "tooltip";
  tooltip.id = "tooltip";
  tooltip.className = "knox-tooltip";
  const arrow = document.createElement("div");
  arrow.id = "arrow";
  tooltip.appendChild(arrow);
  document.body.appendChild(tooltip);
  return tooltip;
}

function handleNoSecret() {
  // TODO: finish this
  console.log("no secret in tooltip but there should be");
}
