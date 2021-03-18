import React from "react";
import { Button, Hidden, IconButton } from "@material-ui/core";
import "../notes.css";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import CancelIcon from "@material-ui/icons/Cancel";

export default function ActionButtons(props) {
  return (
    <div className="noteAction">
      <Hidden smDown>
        <Button
          variant="contained"
          className="button"
          color="secondary"
          icon={<CancelIcon />}
          onClick={() => props.action(false)}
        >
          Back
        </Button>
        <Button
          variant="contained"
          className="button save-button"
          color="secondary"
          startIcon={<CheckCircleIcon />}
          onClick={() => props.action()}
        >
          Save and Close
        </Button>
      </Hidden>
      <Hidden mdUp>
        <IconButton
          className="button"
          color="secondary"
          onClick={() => props.action(false)}
        >
          <CancelIcon fontSize="large" />
        </IconButton>
        <IconButton
          className="button save-button"
          color="secondary"
          onClick={() => props.action()}
        >
          <CheckCircleIcon fontSize="large" />
        </IconButton>
      </Hidden>
    </div>
  );
}
