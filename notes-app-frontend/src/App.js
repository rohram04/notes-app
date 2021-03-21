import React from "react";
import Div100vh from "react-div-100vh";
import { Route, Switch } from "react-router-dom";
import Home from "./components/Home/Home";
import Notes from "./components/notes/notes";
import "./App.css";
import {
  ThemeProvider,
  createMuiTheme,
  responsiveFontSizes,
} from "@material-ui/core/styles";

let theme = createMuiTheme();
theme = responsiveFontSizes(theme);

export default function App() {
  // unavoidable use of inline styling
  return (
    <ThemeProvider theme={theme}>
      <Div100vh className="div100vh">
        <Switch>
          <Route path="/notes">
            <Notes />
          </Route>
          <Route path="/">
            <Home />
          </Route>
        </Switch>
      </Div100vh>
    </ThemeProvider>
  );
}
