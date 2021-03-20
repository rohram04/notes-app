import { Button } from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import React, { useRef, useEffect, useState } from "react";
import { Header } from "../../header/header";
import Note from "./note";
import "../notes.css";
import { Waypoint } from "react-waypoint";

const axios = require("axios");

export default function NoteList(props) {
  const [notesList, setNotesList] = useState({
    offsetIncrement: 20,
    offset: 0,
    notesList: [],
  });
  const grid = useRef(null);

  useEffect(() => {
    getCellCount(grid.current);

    const handleResize = () => {
      const cellCount = getCellCount(grid.current);
      setNotesList((prevState) => ({ ...prevState, increment: cellCount }));
    };

    window.addEventListener("resize", debounce(handleResize, 250));
    return () => {
      window.removeEventListener("resize", debounce(handleResize, 250));
    };
  }, [grid]);

  //REVIEW: Function needs to be refactored - very hard to read
  const getNotes = async (refresh = false) => {
    const { offsetIncrement, offset } = notesList;
    if (offset === -1 && !refresh) return;
    const newOffset = refresh ? 0 : offset;
    const currentNotesList = refresh ? [] : notesList.notesList;
    axios
      .get("/api/notes", {
        params: { offset, limit: offsetIncrement },
      })
      .then(({ data }) => {
        setNotesList((prevState) => ({
          notesList: [...currentNotesList, ...data.notes],
          current:
            data.notes.length < prevState.increment
              ? -1
              : newOffset + data.notes.length,
        }));
      });
  };

  const lazyLoadNotes = ({ previousPosition, currentPosition, event }) => {
    if (previousPosition === "inside") return;
    getNotes();
  };

  return (
    <React.Fragment>
      <Header demo={props.demo} user={props.user} />
      <div className="notesList">
        <div ref={grid} className="container">
          {notesList.notesList.map((note) => (
            <Note
              key={note.noteid}
              id={note.noteid}
              getnotes={getNotes}
              note={note}
              onClick={() => props.openNote(note.noteid)}
            />
          ))}
          <Waypoint onEnter={lazyLoadNotes}>
            <div className="waypoint"></div>
          </Waypoint>
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

const debounce = (func, time) => {
  let timer;
  return () => {
    clearTimeout(timer);
    timer = setTimeout(func, time);
  };
};

const getCellCount = (grid) => {
  if (grid === undefined || grid === null) return 20;
  const gridComputedStyle = window.getComputedStyle(grid);

  const gridHeight = parseInt(
    gridComputedStyle.getPropertyValue("height").replace("px", "")
  );
  // get number of grid rows

  const gridRowHeight = parseInt(
    gridComputedStyle.getPropertyValue("grid-auto-rows").replace("px", "")
  );

  const gridRowCount = Math.floor(gridHeight / gridRowHeight);

  // get number of grid columns
  const gridColumnCount = gridComputedStyle
    .getPropertyValue("grid-template-columns")
    .split(" ").length;

  return gridColumnCount * gridRowCount;
};
