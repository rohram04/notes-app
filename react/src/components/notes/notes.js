import { LinearProgress } from "@material-ui/core";
import React, { useState } from "react";
import useAxiosIntercepted from "./components/axios_interceptor";
import NoteEditor from "./components/noteEditor";
import NoteList from "./components/noteList";
import "./notes.css";

export default function Notes(props) {
  const [noteInfo, setNoteInfo] = useState({
    noteid: null,
    noteViewOpen: false,
  });

  const { status, user, demo } = useAxiosIntercepted();

  const openNote = (id = null) => {
    setNoteInfo({
      noteid: id,
      noteViewOpen: true,
    });
  };

  const closeNote = () => {
    setNoteInfo({
      noteid: null,
      noteViewOpen: false,
    });
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
        noteViewOpen={noteInfo.noteViewOpen}
      />
      <NoteEditor
        open={noteInfo.noteViewOpen}
        demo={demo}
        noteid={noteInfo.noteid}
        closeNote={closeNote}
        user={user}
      />
    </div>
  );
}
