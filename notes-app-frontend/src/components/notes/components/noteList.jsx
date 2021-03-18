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
        // headers: { Authorization: `Bearer ${props.accessToken}` },
      })
      .then(({ data }) => {
        console.log("data", data);
        // for (let i = 0; i < 20; i++) {
        //   data.notes.push({
        //     noteid: "1",
        //     title: "hello",
        //     subheader: "hello",
        //     body: "hello",
        //   });
        // }
        setNotesList([...currentNotesList, ...data.notes]);
        setOffset(currentOffset + data.notes.length);
      });
  };

  return (
    <React.Fragment>
      <Header demo={props.demo} user={props.user} />
      {/* <div
          style={{
            "max-height": "inherit",
            display: "flex",
            padding: "1%",
          }}
        > */}
      <div
        style={{
          flexGrow: 1,
          maxHeight: "inherit",
          display: "grid",
          gridTemplateRows: "min-content",
          "min-height": "0",
          padding: "1%",
        }}
      >
        <div
          className="container"
          style={{
            "max-height": "inherit",
            display: "grid",
            "grid-auto-rows": "250px",
            "grid-template-columns": "repeat(auto-fill, minmax(250px, 1fr))",
            "grid-gap": "1rem",
            "grid-row-start": "2",
            "grid-column-start": "1",
            "overflow-y": "scroll",
            padding: "1%",
          }}
        >
          {notesList.map((note) => (
            <Note
              style={{ "grid-row": "auto", "grid-column": "auto" }}
              id={note.noteid}
              getNotes={getNotes}
              classNames={props.classes}
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
