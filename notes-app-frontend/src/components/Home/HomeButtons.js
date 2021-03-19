import { useAuth0 } from "@auth0/auth0-react";
import { Button } from "@material-ui/core";
import { Link } from "react-router-dom";
import React from "react";
import "./Home.css";

export const LoginButton = () => {
  const { loginWithRedirect } = useAuth0();
  return (
    <Button
      className="homebutton"
      size="large"
      variant="outlined"
      onClick={() => loginWithRedirect()}
    >
      login
    </Button>
  );
};

export const SignupButton = () => {
  const { loginWithRedirect } = useAuth0();
  return (
    <Button
      className="homebutton"
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

export const DemoButton = () => {
  return (
    <Button
      className="homebutton"
      size="large"
      variant="outlined"
      component={Link}
      to="/notes"
    >
      demo
    </Button>
  );
};
