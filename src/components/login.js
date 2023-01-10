import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Urbit from "@urbit/http-api";

export function Login() {
  const navigate = useNavigate();
  const [error, setError] = useState(false);
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
    console.log("connect click");
    window.api = await Urbit.authenticate({
      //   ship: prepShipName(login.ship).trim(),
      //   url: login.url.trim(),
      //   code: login.code.trim(),
      // lathus-worsem-bortem-padmel
      ship: "bud",
      url: "localhost:80",
      code: "lathus-worsem-bortem-padmel",
      verbose: true,
    })
      .then((res) => {
        // how to handle this? the res isn't what I want, I want the SSE
        console.log("res", res);
      })
      .catch(() => setError(true));
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
      {error && <p style={{ color: "red" }}>something went wrong</p>}
    </>
  );
}
