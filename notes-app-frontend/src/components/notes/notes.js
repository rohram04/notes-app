import { LinearProgress } from "@material-ui/core";
import React, { useState } from "react";
import useAxiosIntercepted from "./components/axios_interceptor";
import NoteEditView from "./components/noteEditor";
import NoteList from "./components/noteList";
import "./notes.css";

export default function Notes(props) {
  const [noteViewOpen, setNoteViewOpen] = useState(false);
  const [noteid, setNoteid] = useState(null);

  const { status, user, demo } = useAxiosIntercepted();

  const openNote = (id = null) => {
    setNoteid(id);
    setNoteViewOpen(true);
  };

  const closeNote = () => {
    setNoteid(null);
    setNoteViewOpen(false);
  };

  if (!status) {
    return (
      <div className="loaderContainer">
        <LinearProgress className="loader" color="secondary" />
      </div>
    );
  }

  return (
    <div className="notesRoot">
      <NoteList
        demo={demo}
        user={user}
        openNote={openNote}
        noteViewOpen={noteViewOpen}
      />
      <NoteEditView
        open={noteViewOpen}
        demo={demo}
        noteid={noteid}
        closeNote={closeNote}
        user={user}
      />
    </div>
  );
}
