import React from "react";
import { use100vh } from "react-div-100vh";
import Div100vh from "react-div-100vh";
import { Route, Switch } from "react-router-dom";
import Home from "./components/Home/Home";
import Notes from "./components/notes/notes";
import "./App.css";

export default function App() {
  // unavoidable use of inline styling
  return (
    <Div100vh>
      <Switch>
        <Route path="/notes">
          <Notes />
        </Route>
        <Route path="/">
          <Home />
        </Route>
      </Switch>
    </Div100vh>
  );
}
