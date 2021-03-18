import {
  createMuiTheme,
  createStyles,
  responsiveFontSizes,
  withStyles,
} from "@material-ui/core/styles";
import React, { useState } from "react";
import useAxiosIntercepted from "./components/axios_interceptor";
import "./notes.css";
import NoteEditView from "./components/noteEditor";
import NoteList from "./components/noteList";

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

const styles = (theme) => {
  createStyles({});
};

function Notes(props) {
  const [noteViewOpen, setNoteViewOpen] = useState(false);
  const [noteid, setnoteid] = useState(null);

  const { status, user, demo } = useAxiosIntercepted();

  const openNote = (id = null) => {
    setnoteid(id);
    setNoteViewOpen(true);
  };

  const closeNote = () => {
    setNoteViewOpen(false);
    setnoteid(null);
  };

  if (!status) return <div>...loading</div>; //TODO: Change to real loader

  return (
    <React.Fragment>
      {noteViewOpen ? (
        <NoteEditView
          demo={demo}
          noteid={noteid}
          closeNote={closeNote}
          user={user}
        />
      ) : (
        <NoteList demo={demo} user={user} openNote={openNote} />
      )}
    </React.Fragment>
  );
}

export default withStyles(styles(theme))(Notes);
