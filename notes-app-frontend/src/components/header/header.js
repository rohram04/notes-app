import { AppBar, Button, Toolbar, Typography } from "@material-ui/core";
import React from "react";
import useLogout from "../logout";
import "./header.css";

export function Header(props) {
  const { user, demo } = props;
  return (
    <AppBar position="static" className="appBar">
      <Toolbar>
        <Typography variant="h6" className="typography">
          {user.name}
        </Typography>
        <LogoutButton demo={demo} />
      </Toolbar>
    </AppBar>
  );
}

const LogoutButton = (props) => {
  const { demo } = props;

  const logout = useLogout();

  return (
    <Button onClick={() => logout(demo)} color="inherit">
      Logout
    </Button>
  );
};
