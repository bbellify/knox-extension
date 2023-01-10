import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Urbit from "@urbit/http-api";

export function Login() {
  const navigate = useNavigate();
  const [login, setLogin] = useState({
    ship: "~",
    url: "",
    code: "",
  });

  function handleInput(e) {
    const name = e.target.name;
    setLogin({
      ...login,
      [name]: e.target.value,
    });
  }

  async function connect(e) {
    e.preventDefault();
    console.log("login in button", login);
    window.api = await Urbit.authenticate({
      ship: prepShipName(login.ship).trim(),
      url: login.url.trim(),
      code: login.code.trim(),
      // lathus-worsem-bortem-padmel
      verbose: true,
    }).then(() => navigate("/secret"));
    console.log("api", window.api);
  }

  function prepShipName(ship) {
    return ship.split("")[0] === "~" ? ship.split("").slice(1).join("") : ship;
  }

  return (
    <>
      <p>ship</p>
      <input name="ship" value={login.ship} onChange={handleInput} />
      <p>password</p>
      <input name="code" value={login.code} onChange={handleInput} />

      <p>url where you connect to your ship</p>
      <input name="url" value={login.url} onChange={handleInput} />
      <button onClick={connect}>log in</button>
    </>
  );
}
