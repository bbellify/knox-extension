import { useStore } from "./store";
import { sendMessage } from "./utils";
import { getStorage } from "./storage";
sendMessage({ type: "log", message: "in fg" });
// const logIns = ["username", "email"];
// const passes = ["password"];

getStorage(["key", "auth"]).then((res) => console.log("key", res));
console.log("in content");
function logs() {
  // why doesn't this state work?
  const state = useStore.getState();
  sendMessage({ type: "log", message: state });
  // sendMessage({ type: "log", message: { state: state } });
  sendMessage({ type: "log", message: Math.random() });
}
logs();

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
