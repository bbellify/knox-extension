import { createPopper } from "@popperjs/core";

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
    `;
  document.head.appendChild(style);
}

export function addTooltip(entries, usernameField, passField) {
  addTooltipCSS();

  const tooltip = document.createElement("div");
  tooltip.role = "tooltip";
  tooltip.id = "tooltip";
  const arrow = document.createElement("div");
  arrow.id = "arrow";

  entries.forEach((entry, i) => {
    const entryWrapper = document.createElement("div");
    entryWrapper.id = `entry-wrapper-${i}`;
    const usernameP = document.createElement("p");
    usernameP.id = `tooltip-username-${i}`;
    const passwordP = document.createElement("input");
    passwordP.id = `tooltip-pass-${i}`;
    passwordP.type = "password";
    passwordP.disabled = true;

    usernameP.textContent = entry.username;
    passwordP.value = entry.password;
    entryWrapper.appendChild(usernameP);
    entryWrapper.appendChild(passwordP);
    tooltip.appendChild(entryWrapper);
    entryWrapper.addEventListener("click", () => {
      if (usernameField) usernameField.value = entry.username;
      if (passField) passField.value = entry.password;
      clearTooltip();
    });
  });

  tooltip.appendChild(arrow);
  document.body.appendChild(tooltip);
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
}

export function clearTooltip() {
  const tooltip = document.getElementById("tooltip");
  const style = document.getElementById("knox-style");
  if (tooltip) tooltip.remove();
  if (style) style.remove();
  return;
}
