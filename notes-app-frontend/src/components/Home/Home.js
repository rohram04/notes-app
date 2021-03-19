import { Typography } from "@material-ui/core";
import React from "react";
import "./Home.css";
import { DemoButton, LoginButton, SignupButton } from "./HomeButtons";

const Home = () => {
  return (
    <div className="home">
      <Typography variant="h1">Welcome To Notes</Typography>
      <Typography variant="h2">by Rohith Ramanathan</Typography>
      <div>
        <LoginButton />
        <SignupButton />
        <DemoButton />
      </div>
    </div>
  );
};

export default Home;
