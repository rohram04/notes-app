import React from "react";
import { Button, Hidden, IconButton } from "@material-ui/core";
import "../notes.css";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import CancelIcon from "@material-ui/icons/Cancel";

export default function ActionButtons(props) {
  return (
    <React.Fragment>
      <Hidden smDown>
        {/* TODO: Find better solution to using spans for aligning buttons */}
        <span>
          <Button
            variant="contained"
            className="button"
            color="secondary"
            icon={<CancelIcon />}
            onClick={() => props.action(false)}
          >
            Back
          </Button>
        </span>
        <span>
          <Button
            variant="contained"
            className="button save-button"
            color="secondary"
            startIcon={<CheckCircleIcon />}
            onClick={() => props.action()}
          >
            Save and Close
          </Button>
        </span>
      </Hidden>
      <Hidden mdUp>
        <span>
          <IconButton
            className="icon button"
            color="secondary"
            onClick={() => props.action(false)}
          >
            <CancelIcon fontSize="large" />
          </IconButton>
        </span>
        <span>
          <IconButton
            className="icon button save-button"
            color="secondary"
            onClick={() => props.action()}
          >
            <CheckCircleIcon fontSize="large" />
          </IconButton>
        </span>
      </Hidden>
    </React.Fragment>
  );
}
