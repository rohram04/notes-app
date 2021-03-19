import React from "react";
import { use100vh } from "react-div-100vh";
import { Route, Switch } from "react-router-dom";
import Home from "./components/Home/Home";
import Notes from "./components/notes/notes";
import "./App.css";

export default function App() {
  const height = use100vh();

  // unavoidable use of inline styling
  return (
    <div style={{ height: height, maxHeight: height }}>
      <Switch>
        <Route path="/notes">
          <Notes />
        </Route>
        <Route path="/">
          <Home />
        </Route>
      </Switch>
    </div>
  );
}
