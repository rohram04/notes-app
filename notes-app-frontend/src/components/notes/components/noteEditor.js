import {
  Dialog,
  DialogActions,
  FormControl,
  TextField,
  useMediaQuery,
} from "@material-ui/core";
import { useTheme } from "@material-ui/core/styles";
import React, { useLayoutEffect, useState } from "react";
import { use100vh } from "react-div-100vh";
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
  const height = use100vh();
  const { closeNote, noteid = null, open } = props;

  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const [fetchStatus, setFetchStatus] = useState("pending");
  const [note, setNote] = useState({
    noteid: null,
    title: "",
    subheader: "",
    body: "",
  });

  useLayoutEffect(() => {
    if (noteid === null) {
      setFetchStatus("complete");
    } else {
      axios
        .get("/api/notes", {
          params: { noteid: noteid },
        })
        .then((result) => {
          setNote(result.data.notes[0]);
          setFetchStatus("complete");
        });
    }
    return () => {
      setNote({
        noteid: null,
        title: "",
        subheader: "",
        body: "",
      });
    };
  }, [open]);

  const notesTextFieldChange = (event) => {
    setNote((note) => ({ ...note, [event.target.name]: event.target.value }));
  };

  const saveNote = async (save = true) => {
    if (save) {
      await axios({
        url: "/api/notes",
        method: note.noteid === null ? "post" : "put",
        data: note,
      });
    }
    setFetchStatus("pending");
    closeNote();
  };

  return (
    <Dialog
      fullWidth={true}
      fullScreen={fullScreen}
      maxWidth="lg"
      open={props.open}
      id={note.noteid}
      className="NoteEditor container"
      PaperProps={{
        className: `dialog-paper ${!fullScreen && " border-radius"}`,
      }}
      style={{ height: height }}
    >
      {fetchStatus === "pending" ? (
        <div />
      ) : (
        <React.Fragment>
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
          <DialogActions className="noteAction">
            <ActionButtons action={saveNote} />
          </DialogActions>
        </React.Fragment>
      )}
    </Dialog>
  );
}

export default function NoteEditView(props) {
  return <NoteEditor {...props} />;
}
