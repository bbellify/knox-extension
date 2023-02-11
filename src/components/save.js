/* eslint-disable no-undef */
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { sendMessage } from "../utils";

export function Save() {
  const navigate = useNavigate();
  const [sugForm, setSugForm] = useState({
    website: "",
    username: "",
    password: "",
  });

  useEffect(() => {
    chrome.runtime.sendMessage({ type: "getState" }, (res) => {
      const { state } = res;
      if (state.suggestion) {
        console.log("suggestion", state.suggestion);
        // TODO: finish this, set form from res, below is reference
        // setSugForm({
        //   website:
        // })
      }
    });

    // sendMessage({ type: "getSuggestion" });
    // chrome.runtime.onMessage.addListener(function (message) {
    //   if (message.type === "getSuggestionRes") {
    //     setSugForm({
    //       website: message.suggestion.website,
    //       username: message.suggestion.newUsername,
    //       password: message.suggestion.newPassword,
    //     });
    //   }
    // });
  }, []);

  return (
    <>
      <button onClick={() => navigate("/")}>test home</button>
      <p>save this entry?</p>
      {/* TODO: this should be a form in case it needs to be edited */}
      <p>{`website: ${sugForm.website}`}</p>
      <p>{`username: ${sugForm.username}`}</p>
      <p>{`password: ${sugForm.password}`}</p>
      {/* TODO: wire up this button */}
      <button onClick={() => console.log("save suggestion entry")}>save</button>
    </>
  );
}
