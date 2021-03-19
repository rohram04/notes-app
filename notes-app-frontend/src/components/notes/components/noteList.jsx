import { Button } from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import React, { useEffect, useState } from "react";
import { Header } from "../../header/header";
import Note from "./note";
import "../notes.css";

const axios = require("axios");

export default function NoteList(props) {
  const [offset, setOffset] = useState(0);
  const [notesList, setNotesList] = useState([]);

  useEffect(() => {
    getNotes();
  }, []);

  const getNotes = (refresh = false) => {
    const currentOffset = refresh ? 0 : offset;
    const currentNotesList = refresh ? [] : notesList;
    axios
      .get("/api/notes", {
        params: { offset: currentOffset },
      })
      .then(({ data }) => {
        console.log("data", data);
        setNotesList([...currentNotesList, ...data.notes]);
        setOffset(currentOffset + data.notes.length);
      });
  };

  return (
    <React.Fragment>
      <Header demo={props.demo} user={props.user} />
      <div className="notesList">
        <div className="container">
          {notesList.map((note) => (
            <Note
              id={note.noteid}
              getNotes={getNotes}
              classNames="note"
              note={note}
              onClick={() => props.openNote(note.noteid)}
              accessToken={props.accessToken}
            />
          ))}
        </div>
        <Button
          className="button"
          variant="contained"
          color="secondary"
          startIcon={<AddIcon />}
          onClick={() => props.openNote()}
        >
          New Note
        </Button>
      </div>
    </React.Fragment>
  );
}
