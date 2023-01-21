import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Urbit from "@urbit/http-api";

import { sendMessage } from "../utils";

// const sse = new EventSource("http://localhost:80/~/login");
// console.log("sse", sse);
// sse.onmessage = (message) => {
//   console.log("message", message);
// };

export function Login() {
  const navigate = useNavigate();
  const [error, setError] = useState(false);
  const [login, setLogin] = useState({
    ship: "~",
    url: "",
    code: "",
  });

  function prepShipName(ship) {
    return ship.split("")[0] === "~" ? ship.split("").slice(1).join("") : ship;
  }

  function handleInput(e) {
    const name = e.target.name;
    setLogin({
      ...login,
      [name]: e.target.value,
    });
  }

  async function connect() {
    await Urbit.authenticate({
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
        window.api = res;
        // sendMessage({ type: "setAuth", auth: true });
        console.log("res", res);
        sendMessage({
          type: "setApi",
          url: res.url,
          ship: res.ship,
          code: res.code,
        });
      })
      .catch(() => setError(true));
  }

  return (
    <>
      <p>shippy</p>
      <input name="ship" value={login.ship} onChange={handleInput} />
      <p>password</p>
      <input name="code" value={login.code} onChange={handleInput} />

      <p>url where you connect to your ship</p>
      <input name="url" value={login.url} onChange={handleInput} />
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          marginTop: "20px",
        }}
      >
        <button style={{ width: "65%" }} onClick={connect}>
          log in
        </button>
        <button
          style={{ width: "65%" }}
          onClick={() =>
            sendMessage({
              type: "setStore",
              item: { key: Math.random() },
            })
          }
        >
          test set storage
        </button>
        <button
          style={{ width: "65%" }}
          onClick={() =>
            sendMessage({ type: "getStore", key: ["key", "auth"] })
          }
        >
          test get storage
        </button>
        <button
          style={{ width: "65%" }}
          onClick={() => sendMessage({ type: "logState" })}
        >
          test get state
        </button>
        <button
          style={{ width: "65%" }}
          onClick={() => sendMessage({ type: "testScry" })}
        >
          test scry
        </button>
        <button
          style={{ width: "65%" }}
          onClick={() => sendMessage({ type: "setUrl", url: login.url })}
        >
          test set url
        </button>
        <button
          style={{ width: "65%" }}
          onClick={() => sendMessage({ type: "setAuth" })}
        >
          test set auth
        </button>
        <button
          style={{ width: "65%" }}
          onClick={() =>
            sendMessage({ type: "setTest", message: Math.random() })
          }
        >
          test set state
        </button>
      </div>
      {error && <p style={{ color: "red" }}>something went wrong</p>}
    </>
  );
}
