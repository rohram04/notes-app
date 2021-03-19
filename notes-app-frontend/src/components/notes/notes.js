import React, { useState } from "react";
import useAxiosIntercepted from "./components/axios_interceptor";
import "./notes.css";
import NoteEditView from "./components/noteEditor";
import NoteList from "./components/noteList";

export default function Notes(props) {
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
    <div className="notesRoot">
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
    </div>
  );
}
