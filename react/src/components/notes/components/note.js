import { IconButton, Paper, Typography } from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";
import React, { useState } from "react";
import "../notes.css";

const axios = require("axios");

export default function Note(props) {
  const { note, getnotes } = props;

  const deleteNote = async (noteid) => {
    axios
      .delete("/api/notes", {
        params: { noteid },
      })
      .then((result) => {
        getnotes(true);
      });
  };

  return (
    <Paper elevation={3} className="note" onClick={props.onClick}>
      <div className="note-preview-title-row">
        <Typography variant="h5" className="note-preview-title">
          {note.title}
        </Typography>
        <IconButton
          onClick={(event) => {
            event.stopPropagation();
            deleteNote(note.noteid);
          }}
          className="note-preview-delete-icon"
        >
          <DeleteIcon />
        </IconButton>
      </div>
      <div>
        <div>{note.subheader}</div>
      </div>
      <div>{note.body}</div>
    </Paper>
  );
}
