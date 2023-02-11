/* eslint-disable no-undef */
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import * as bcrypt from "bcryptjs";

import { aesEncrypt, sendMessage } from "../utils";
import { setStorage } from "../storage";
import { newApi } from "../urbit";

export function SecretSetup() {
  const navigate = useNavigate();
  const [secret, setSecret] = useState("");
  const [api, setApi] = useState(null);
  const [secretError, setSecretError] = useState(null);

  useEffect(() => {
    chrome.runtime.sendMessage({ type: "getState" }, (res) => {
      const { api } = res.state;
      // TODO: no api.. then what?
      if (!Object.keys(api).length) return navigate("/setup");
      if (res.secret?.length) return navigate("/");

      return setApi(newApi(api.url, api.ship, api.code));
    });
  }, []);

  function handleInput(e) {
    setSecret(e.target.value);
  }

  async function validateSecret() {
    if (!secret) return setSecretError("enter your secret");

    api
      .scry({
        app: "knox",
        path: "/secret",
      })
      .then((res) => {
        if (res.secret) {
          if (bcrypt.compareSync(secret, res.secret)) {
            sendMessage({
              type: "setSecret",
              secret: secret,
              url: api.url,
              shipCreds: {
                ship: api.ship,
                code: api.code,
              },
            });
            setStorage({
              shipCreds: {
                // TODO: should this be bcrypt instead? or argon?
                ship: aesEncrypt(api.ship, secret),
                code: aesEncrypt(api.code, secret),
              },
            });
            return navigate("/");
          } else {
            setSecretError("invalid secret");
          }
        } else return navigate("/setup");
        // TODO: this is for if scry fails or if there is no hash in response
      });
  }

  return (
    <>
      <h2>secret setup</h2>
      <button onClick={() => navigate("/")}>test home</button>
      <p>set your secret</p>
      <input name="secret" value={secret} onChange={handleInput} />
      {/* TODO: add a check here to validate they're the same, enter twice */}
      <button
        style={{ width: "65%" }}
        onClick={() => {
          validateSecret();
        }}
      >
        set secret
      </button>
      {secretError && <p>{secretError}</p>}
    </>
  );
}
