import Urbit from "@urbit/http-api";

export async function loginToShip() {
  console.log("in login util");
  Urbit.authenticate({
    //   ship: prepShipName(login.ship).trim(),
    //   url: login.url.trim(),
    //   code: login.code.trim(),
    // lathus-worsem-bortem-padmel
    ship: "bud",
    url: "localhost:80",
    code: "lathus-worsem-bortem-padmel",
    verbose: true,
  }).then((res) => console.log("res in bg", res));
}

export async function scryVault() {
  console.log("scry in urbit util");
  Urbit.scry({
    app: "knox",
    path: "/vault",
  }).then((res) => console.log("scry res", res));
}

export async function testScry() {
  const api = new Urbit("http://localhost:80", "");
  api.ship = "bud";
  api
    .scry({
      app: "knox",
      path: "/vault",
    })
    .then((res) => console.log("scry res", res));
}
