import React, { useState } from "react";
import { Paper, IconButton, Typography } from "@material-ui/core";
import "../notes.css";
import DeleteIcon from "@material-ui/icons/Delete";

const axios = require("axios");

export default function Note(props) {
  const [iconVisibility, setIconVisibility] = useState(false);
  const { note, getNotes } = props;
  const deleteNote = async (noteid) => {
    axios
      .delete("/api/notes", {
        params: { noteid },
      })
      .then((result) => {
        getNotes(true);
      });
  };

  return (
    <Paper
      elevation={3}
      className="noteslist paper"
      onMouseEnter={() => setIconVisibility(true)}
      onMouseLeave={() => setIconVisibility(false)}
      {...props}
    >
      <div className="note-preview-title-row">
        <Typography variant="h5" className="note-preview-title">
          {note.title}
        </Typography>
        {iconVisibility && (
          <IconButton
            onClick={(event) => {
              event.stopPropagation();
              deleteNote(note.noteid);
            }}
            className="note-preview-delete-icon"
          >
            <DeleteIcon />
          </IconButton>
        )}
      </div>
      <div>{note.subheader}</div>
      <div>{note.body}</div>
    </Paper>
  );
}
