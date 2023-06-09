/* eslint-disable no-undef */
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { aesDecrypt } from "../utils";
import { getStorage } from "../storage";

export function Secret() {
  const navigate = useNavigate();
  const [secret, setSecret] = useState("");
  const [shake, setShake] = useState(false);
  const [shipCreds, setShipCreds] = useState(null);

  useEffect(() => {
    async function getShipCreds() {
      const { shipCreds } = await getStorage("shipCreds");
      // TODO: handle if no shipCreds
      setShipCreds(shipCreds);
    }
    getShipCreds();
  }, []);

  function handleInput(e) {
    setSecret(e.target.value);
  }

  function validateSecret() {
    const ship = aesDecrypt(shipCreds.ship, secret);
    const code = aesDecrypt(shipCreds.code, secret);

    if (ship && code) {
      // eslint-disable-next-line no-undef
      chrome.runtime.sendMessage({
        type: "setSecret",
        secret: secret,
      });
      return navigate("/");
    } else {
      return handleInvalidSecret();
    }
  }

  function handleInvalidSecret() {
    setSecret("");
    setShake(true);
    setTimeout(() => {
      setShake(false);
    }, 1500);
  }

  return (
    <>
      <div className="flex flex-col mt-5 h-[120px] items-center">
        <p>Log in to Knox:</p>
        <input
          name="secret"
          type="password"
          value={secret}
          onChange={handleInput}
          className={`border border-black w-3/5 mt-2 mb-1 px-3 py-1 ${
            shake ? "shakeX border-red-400" : null
          }`}
        />
        <button
          className="border border-black px-2 py-1"
          onClick={validateSecret}
        >
          log in
        </button>
      </div>
    </>
  );
}
