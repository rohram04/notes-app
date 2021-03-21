import { Typography } from "@material-ui/core";
import React from "react";
import "./Home.css";
import { DemoButton, LoginButton, SignupButton } from "./HomeButtons";

function isPwa() {
  return ["fullscreen", "standalone", "minimal-ui"].some(
    (displayMode) =>
      window.matchMedia("(display-mode: " + displayMode + ")").matches
  );
}

const Home = () => {
  return (
    <div className="home">
      <Typography variant="h1">Welcome To Notes</Typography>
      <Typography variant="h2" className="author">
        by Rohith Ramanathan
      </Typography>
      <div>
        <LoginButton />
        <SignupButton />
        <DemoButton />
      </div>
    </div>
  );
};

export default Home;
