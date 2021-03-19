import { FormControl, Hidden, Paper, TextField } from "@material-ui/core";
import React, { useLayoutEffect, useState } from "react";
import { Header } from "../../header/header";
import "../notes.css";
import ActionButtons from "./actionButtons";

const axios = require("axios");

const NotesTextField = (props) => {
  return (
    <TextField
      fullWidth
      InputProps={{
        disableUnderline: true,
        className: props.inputpropsclasses ?? "",
      }}
      {...props}
      className="TextField"
    />
  );
};

function NoteEditor(props) {
  const { closeNote, noteid = null } = props;

  const [note, setNote] = useState({
    noteid: noteid,
    title: "",
    subheader: "",
    body: "",
  });

  useLayoutEffect(() => {
    if (note.noteid === null) return;
    axios
      .get("/api/notes", {
        params: { noteid: note.noteid },
      })
      .then((result) => {
        setNote(result.data.notes[0]);
      });
  }, []);

  const notesTextFieldChange = (event) => {
    setNote((note) => ({ ...note, [event.target.name]: event.target.value }));
  };

  const saveNote = async (save = true) => {
    if (!save) return closeNote();
    console.log("note", note);
    if (note.noteid !== null) {
      axios.put("/api/notes", note).then((result) => {
        closeNote();
      });
    } else {
      axios.post("/api/notes", note).then((result) => {
        console.log("post note", note);
        closeNote();
      });
    }
  };

  return (
    <Paper id={note.noteid} elevation={6} className="NoteEditor container">
      <div className="NotesFields">
        <FormControl>
          <NotesTextField
            name="title"
            placeholder="title"
            inputpropsclasses="resizeTitle"
            autoFocus={true}
            value={note.title}
            onChange={notesTextFieldChange}
          />
        </FormControl>
        <FormControl>
          <NotesTextField
            name="subheader"
            placeholder="subheader"
            inputpropsclasses="resizeSubheader"
            value={note.subheader}
            onChange={notesTextFieldChange}
          />
        </FormControl>
        <NotesTextField
          multiline
          name="body"
          placeholder="body"
          value={note.body}
          onChange={notesTextFieldChange}
        />
      </div>
      <ActionButtons action={saveNote} />
    </Paper>
  );
}

export default function NoteEditView(props) {
  return (
    <React.Fragment>
      <Hidden smDown>
        <Header demo={props.demo} user={props.user} />
      </Hidden>
      <NoteEditor {...props} />
    </React.Fragment>
  );
}
