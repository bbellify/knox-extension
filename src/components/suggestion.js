import React, { useState } from "react";

export function Suggestion(props) {
  const [sugForm, setSugForm] = useState({
    website: "",
    username: "",
    password: "",
  });

  function handleInput(e) {
    const name = e.target.name;
    setSugForm({
      ...sugForm,
      [name]: e.target.value,
    });
  }

  return (
    <>
      <p>save this entry?</p>
      <div style={{ width: "95%" }}>
        {/* TODO: this should be a form in case it needs to be edited */}
        <div>
          <label>website:</label>
          <input
            name={"website"}
            value={sugForm.website}
            onChange={handleInput}
          ></input>
        </div>
        <div>
          <label>username:</label>
          <input
            name={"username"}
            value={sugForm.username}
            onChange={handleInput}
          ></input>
        </div>
        <div>
          <label>password:</label>
          <input
            name={"password"}
            type={"password"}
            onChange={handleInput}
            value={sugForm.password}
          ></input>
        </div>
        {/* TODO: wire up this button */}
      </div>
      <button onClick={() => console.log("save suggestion entry")}>save</button>
      <button>clear</button>
    </>
  );
}
