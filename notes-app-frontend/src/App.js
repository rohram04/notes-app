import { useAuth0 } from "@auth0/auth0-react";
import { Button, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import React from "react";
import { use100vh } from "react-div-100vh";
import { Link, Route, Switch } from "react-router-dom";
import "./App.css";
import Notes from "./components/notes/notes";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    maxHeight: "inherit",
    height: "inherit",
    display: "flex",
    "flex-direction": "column",
    // background: "linear-gradient(45deg, #ff1aa3 15%, #fc6767 85%)",
  },
}));

const Comp = () => {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <Notes />
    </div>
  );
};

export default function App() {
  const height = use100vh();

  return (
    <div style={{ height: height, "max-height": height }}>
      <Switch>
        <Route path="/notes">
          <Comp />
        </Route>
        <Route path="/">
          <Home />
        </Route>
      </Switch>
    </div>
  );
}

const Home = () => {
  const domain = process.env.REACT_APP_AUTH0_DOMAIN;
  const clientId = process.env.REACT_APP_AUTH0_CLIENT_ID;

  console.log(domain, clientId);
  return (
    <div
      style={{
        height: "inherit",
        background: "linear-gradient(45deg, #ff1aa3 15%, #fc6767 85%)",
        display: "flex",
        "flex-direction": "column",
        "justify-content": "center",
        "align-content": "center",
        "text-align": "center",
        color: "#fff",
      }}
    >
      <Typography variant="h1">Welcome To Notes</Typography>
      <Typography variant="h2">by Rohith Ramanathan</Typography>
      <div>
        <LoginButton />
        <SignupButton />
        <Button
          style={{
            color: "white",
            border: "3px solid white",
            "font-weight": "bold",
          }}
          size="large"
          variant="outlined"
          component={Link}
          to="/notes"
        >
          demo
        </Button>
      </div>
    </div>
  );
};

const LoginButton = () => {
  const { loginWithRedirect } = useAuth0();
  return (
    <Button
      style={{
        "margin-right": "2.5%",
        color: "white",
        "border-color": "white",
        border: "3px solid white",
        "font-weight": "bold",
      }}
      size="large"
      variant="outlined"
      onClick={() => loginWithRedirect()}
    >
      login
    </Button>
  );
};

const SignupButton = () => {
  const { loginWithRedirect } = useAuth0();
  return (
    <Button
      style={{
        "margin-right": "2.5%",
        color: "white",
        "border-color": "white",
        border: "3px solid white",
        "font-weight": "bold",
      }}
      size="large"
      variant="outlined"
      onClick={() =>
        loginWithRedirect({
          screen_hint: "signup",
        })
      }
    >
      signup
    </Button>
  );
};
