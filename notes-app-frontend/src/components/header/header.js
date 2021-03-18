import { useAuth0 } from "@auth0/auth0-react";
import { AppBar, Button, Toolbar, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { useHistory } from "react-router-dom";
import axios from "axios";
import React from "react";

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
  const { logout: authenticatedLogout } = useAuth0();
  const history = useHistory();

  const logout = () => {
    if (!demo) return authenticatedLogout({ returnTo: window.location.origin });
    axios.delete("/api/demoID");
    history.push("/");
  };

  return (
    <Button onClick={() => logout()} color="inherit">
      Logout
    </Button>
  );
};
