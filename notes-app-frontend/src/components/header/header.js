import { AppBar, Button, Toolbar, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import React from "react";
import useLogout from "../logout";

const useStyles = makeStyles((theme) => ({
  root: {
    height: "min-content",
  },
  date: {
    textAlign: "right",
  },
}));

export function Header(props) {
  const classes = useStyles();
  const { user, demo } = props;
  return (
    <AppBar color="secondary" position="static" className={classes.root}>
      <Toolbar>
        <Typography variant="h6" style={{ "flex-grow": "1" }}>
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
