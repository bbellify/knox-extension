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
