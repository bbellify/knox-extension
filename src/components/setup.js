/* eslint-disable no-undef */
import React, { useEffect, useState } from "react";
import * as bcrypt from "bcryptjs";
import { useNavigate } from "react-router-dom";

import { aesEncrypt } from "../utils";
import { newApi } from "../urbit";
import { navPrev, navNext } from "../icons";

export function Setup() {
  const navigate = useNavigate();
  const [shake, setShake] = useState(false);
  const [step, setStep] = useState(1);
  const [urlError, setUrlError] = useState("");
  const [shipError, setShipError] = useState("");
  const [urlForm, setUrlForm] = useState("");
  const [shipForm, setShipForm] = useState({
    ship: "",
    code: "",
  });
  const [secretForm, setSecretForm] = useState("");
  const [api, setApi] = useState(null);

  useEffect(() => {
    // TODO: change this to checking storage for URL and ship creds
    chrome.runtime.onMessage.addListener(function (message) {
      if (message.type === "setupStatus") {
        if (message.error) {
          if (message.error === "url") {
            setUrlError(message.status);
            return;
          }
          if (message.error === "code") {
            setUrlError("");
            setShipError(message.status);
            return;
          }
        } else {
          if (message.status === "noKnox") {
            return navigate("/noKnox");
          } else if (message.status === "connected") {
            setApi(newApi(urlForm, shipForm.ship, shipForm.code));
            setUrlError("");
            setShipError("");
            setStep(2);
            return;
          }
        }
      }
    });
  });

  function prepShipName(ship) {
    return ship.split("")[0] === "~" ? ship.split("").slice(1).join("") : ship;
  }

  function handleUrlForm(e) {
    setUrlForm(e.target.value);
  }

  function handleShipForm(e) {
    const name = e.target.name;
    setShipForm({
      ...shipForm,
      [name]: e.target.value,
    });
  }

  function handleSecretForm(e) {
    setSecretForm(e.target.value);
  }

  function handleConnectShip() {
    // TODO: handle the !urlForm errror
    if (!urlForm) return;
    // eslint-disable-next-line no-undef
    chrome.runtime.sendMessage({
      type: "connectShipSetup",
      url: urlForm,
      ship: prepShipName(shipForm.ship).trim(),
      code: shipForm.code.trim(),
    });
  }

  function handleValidate() {
    api
      .scry({
        app: "knox",
        path: "/secret",
      })
      .then((res) => {
        if (res.secret) {
          if (bcrypt.compareSync(secretForm, res.secret)) {
            // eslint-disable-next-line no-undef
            chrome.runtime.sendMessage({
              type: "saveCreds",
              secret: secretForm,
              shipCreds: {
                url: aesEncrypt(urlForm, secretForm),
                ship: aesEncrypt(shipForm.ship, secretForm),
                code: aesEncrypt(shipForm.code, secretForm),
              },
            });
            return navigate("/");
          } else {
            // wrong secret
            setShake(true);
            setSecretForm("");
            setTimeout(() => {
              setShake(false);
            }, 1500);
          }
        }
      });
  }

  function handleNext() {
    switch (step) {
      case 1: {
        handleConnectShip();
        setShipError("");
        setUrlError("");
        break;
      }
      case 2: {
        handleValidate();
        break;
      }
      default:
        return;
    }
  }

  function handlePrevious() {
    if (step > 1) setStep(step - 1);
  }

  function isNextDisabled() {
    switch (step) {
      case 1: {
        if (urlForm.length && shipForm.ship.length && shipForm.code.length)
          return false;
        else return true;
      }
      case 2: {
        if (secretForm.length) return false;
        else return true;
      }
      default:
        return true;
    }
  }

  return (
    <div className="flex flex-col my-5 pb-2 h-[250px] items-center justify-items-center w-[300px]">
      <p className="font-bold my-2">
        Welcome to Knox, your web2 password vault.
      </p>

      {step === 1 && (
        <div className="flex flex-col mt-4 items-center h-[180px]">
          <p className="mb-2">Enter the url where you connect to your ship:</p>
          <input
            className="border border-black w-3/5 mb-2 px-3 py-1"
            name="url"
            value={urlForm}
            onChange={handleUrlForm}
            placeholder="url"
          />
          <p className="mb-2">Enter your ship and code:</p>
          <input
            name="ship"
            placeholder="ship"
            value={shipForm.ship}
            className="border border-black w-3/5 mb-1 px-3 py-1"
            onChange={handleShipForm}
          />
          <input
            name="code"
            className="border border-black w-3/5 mb-1 px-3 py-1"
            value={shipForm.code}
            onChange={handleShipForm}
            placeholder="code"
            type="password"
          />
          {urlError && (
            <p className="text-red-500 font-bold mt-1">{urlError}</p>
          )}
          {shipError && (
            <p className="text-red-500 font-bold mt-1">{shipError}</p>
          )}
        </div>
      )}
      {step === 2 && (
        <div className="flex flex-col mt-4 pt-12 items-center h-[180px]">
          <p className="mb-2">Enter your Knox secret:</p>
          <input
            name="secret"
            type="password"
            value={secretForm}
            onChange={handleSecretForm}
            className={`border border-black w-3/5 mb-2 px-3 py-1 ${
              shake ? "shakeX border-red-400" : null
            }`}
          />
        </div>
      )}
      <div className="flex mt-2">
        <button
          disabled={step === 1}
          onClick={handlePrevious}
          className="mr-2 w-[25px]"
        >
          {navPrev(step === 1)}
        </button>
        <button
          disabled={isNextDisabled()}
          onClick={handleNext}
          className="ml-2 w-[25px]"
        >
          {navNext(isNextDisabled())}
        </button>
      </div>
    </div>
  );
}
