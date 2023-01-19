console.log("in fg");
const logIns = ["username", "email"];
const passes = ["password"];

let allInputs = document.querySelectorAll("input");
// let pword = allInputs[0];
console.log("inputs", allInputs);
// console.log("pword", pword);
let username;
let pword;
for (let i = 0; i < allInputs.length; i++) {
  if (logIns.includes(allInputs[i].name)) username = allInputs[i];
  if (allInputs[i].type === "password" || passes.includes(allInputs[i].name))
    pword = allInputs[i];
}

console.log("username", username);
console.log("pword", pword);

if (username) {
  //   username.select();
  //   username.setAttribute("value", "hi");
  username.value = "username";
}
if (pword) pword.value = "username";
