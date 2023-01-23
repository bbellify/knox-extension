import { aesDecrypt } from "./utils";
const logIns = ["username", "email"];
const passes = ["password"];
console.log("in content");

const location = window.location.toString();
console.log("location", location);

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
        console.log(
          "entry:",
          aesDecrypt(entry.website, "test"),
          aesDecrypt(entry.username, "test"),
          aesDecrypt(entry.password, "test")
        );
        username.value = aesDecrypt(entry.username, "test");
        pword.value = aesDecrypt(entry.password, "test");
      } else {
        // handle asking to save password here - vault but no entry
        console.log("no entry");
      }
    } else {
      // handle auth or scry here - no vault
      console.log("no vault");
    }
  }
});

// reference
// let allInputs = document.querySelectorAll("input");
// // let pword = allInputs[0];
// console.log("inputs", allInputs);
// // console.log("pword", pword);
// let username;
// let pword;
// for (let i = 0; i < allInputs.length; i++) {
//   if (logIns.includes(allInputs[i].name)) username = allInputs[i];
//   if (allInputs[i].type === "password" || passes.includes(allInputs[i].name))
//     pword = allInputs[i];
// }

// console.log("username", username);
// console.log("pword", pword);

// if (username) {
//   //   username.select();
//   //   username.setAttribute("value", "hi");
//   username.value = "username";
// }
// if (pword) pword.value = "username";

// pword.addEventListener("mousedown", console.log("pword click"));
