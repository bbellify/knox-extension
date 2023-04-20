import { addTooltip, addNoSecretTooltip, clearTooltip } from "./tooltip";
import { getStorage } from "./storage";
console.log("in content");

document.addEventListener("click", (e) => {
  if (
    e.target.nodeName !== "INPUT" &&
    e.target.id !== "submitSecret" &&
    e.target.id !== "tooltip"
  )
    clearTooltip();
});

const location = window.location.toString();
// use website for saving suggestion
// const website = new URL(location).hostname.replace("www.", "");

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
          location.includes(entry.website)
        );

        if (entries.length) {
          document.addEventListener("click", (e) => {
            if (
              e.target.tagName === "INPUT" &&
              e.target.id !== "secret-input"
            ) {
              // check if in login input
              if (
                e.target.type === "text" ||
                e.target.type === "email" ||
                e.target.type === "username"
              ) {
                if (!secret) {
                  addNoSecretTooltip(entries, shipCreds, e.target, url);
                  return e.target.addEventListener("click", () =>
                    addNoSecretTooltip(entries, shipCreds, e.target, url)
                  );
                } else {
                  addTooltip(entries, secret, e.target);
                  return e.target.addEventListener("click", () => {
                    addTooltip(entries, secret, e.target);
                  });
                }
              }
            }
          });
        } else {
          return handleNoEntry();
        }
      } else {
        return handleNoVault();
      }
    });
  });
}
init();

function handleNoEntry() {
  // TODO: remove this log
  console.log("in no entry");

  // handle saving a suggestion here

  // submitButton?.addEventListener("click", () => {
  //   const newUsername = username?.value;
  //   const newPassword = pword?.value;
  //   // eslint-disable-next-line no-undef
  //   chrome.runtime.sendMessage({
  //     type: "setSuggestion",
  //     suggestion: {
  //       website,
  //       newUsername,
  //       newPassword,
  //     },
  //   });
  // });
}

function handleNoVault() {
  // TODO: handle auth or scry here - no vault
  console.log("no vault");
}

function handleNoShipCreds() {
  // TODO: need to go back to set up if no shipCreds
  console.log("no shipCreds");
}
