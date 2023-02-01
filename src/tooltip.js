import { createPopper } from "@popperjs/core";

export function addTooltipCSS() {
  document.head.appendChild(document.createElement("style")).innerHTML = `
    #tooltip {
        padding: 4px 20px;
        background: #222F44;
        border-radius: 2px;
        position: relative;
        z-index: 999;
        display: flex;
        flex-direction: column;
        align-items: center;
      }
      
      #tooltip-username {
        font-size: 1rem;
      }
      
      #arrow {
        position: absolute;
        width: 10px;
        height: 10px;
        background: inherit;
        transform: rotate(45deg);
        position: absolute;
        top: -5px;
        z-index: -1;
      }
      
      #tooltip-username {
        margin: 0;
        color: white;
        align-self: start;
      }
      
      #tooltip-pass {
        color: white;
        display: block;
        align-self: start;
      }
    `;
}

export function addTooltip(name, pass, usernameField, passField) {
  const tooltip = document.createElement("div");
  tooltip.role = "tooltip";
  tooltip.id = "tooltip";
  const arrow = document.createElement("div");
  arrow.id = "arrow";
  const usernameP = document.createElement("p");
  usernameP.id = "tooltip-username";
  const passwordP = document.createElement("input");
  passwordP.id = "tooltip-pass";
  passwordP.type = "password";

  usernameP.textContent = name;
  passwordP.value = pass;

  tooltip.appendChild(arrow);
  tooltip.appendChild(usernameP);
  tooltip.appendChild(passwordP);
  tooltip.addEventListener("click", () => {
    usernameField.value = name;
    passField.value = pass;
    clearTooltip();
  });
  document.body.appendChild(tooltip);

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
  if (tooltip) return tooltip.remove();
  return;
}
