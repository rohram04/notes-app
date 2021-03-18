import { FormControl, Hidden, Paper, TextField } from "@material-ui/core";
import {
  createMuiTheme,
  responsiveFontSizes,
  ThemeProvider,
} from "@material-ui/core/styles";
import React, { useLayoutEffect, useState } from "react";
import { Header } from "../../header/header";
import ActionButtons from "./actionButtons";
import "../notes.css";

const axios = require("axios");

let theme = createMuiTheme({
  overrides: {
    MuiSvgIcon: {
      fontSizeLarge: {
        fontSize: "3.125rem",
      },
    },
  },
  props: {
    MuiButton: {
      variant: "contained",
    },
  },
});

theme = responsiveFontSizes(theme);

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
    const func = async () => {
      if (note.noteid === null) return;
      // const token = await getAccessTokenSilently();
      axios
        .get("/api/notes", {
          params: { noteid: note.noteid },
        })
        .then((result) => {
          setNote(result.data.notes[0]);
        });
    };
    func();
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
    <ThemeProvider theme={theme}>
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
    </ThemeProvider>
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
