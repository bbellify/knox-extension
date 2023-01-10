import React from "react";
import { Routes, Route } from "react-router-dom";
import "./App.css";

import { Login } from "./components/login";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path={"/"} exact={true} element={<Login />} />
        <Route path={"/secret"} exact={true} element={<p>test secret</p>} />
      </Routes>
    </div>
  );
}

export default App;
