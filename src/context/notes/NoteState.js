import NoteContext from "./noteContex";
import { useState } from "react";

const NoteState = (props) => {
  const host = "http://localhost:5000";
  const notesInitial = [];
  const [notes, setNotes] = useState(notesInitial);

  //get all Notes
  const getNotes = async (title, description, tag) => {
    //TODO: API Call
    //API Call
    const response = await fetch(`${host}/api/notes/fetchallnotes`, {
      method: "GET",
      headers: {
        "content-Type": "application/json",
        "auth-token": localStorage.getItem('token')
          
      },
    });
    const json = await response.json();
    console.log(json);
    setNotes(json);
  };
  //add a Note
  const addNote = async (title, description, tag) => {
    //TODO: API Call
    //API Call
    const response = await fetch(`${host}/api/notes/addnote`, {
      method: "POST",
      headers: {
        "content-Type": "application/json",
        "auth-token":
        localStorage.getItem('token')
      },
      body: JSON.stringify({title,description,tag} )
    });

    const note =await response.json();
    
    setNotes(notes.concat(note));
  };
  //delete a Note
  const deleteNote = async (id) => {
    //API Call
    const response = await fetch(`${host}/api/notes/deletenote/${id}`, {
      method: "DELETE",
      headers: {
        "content-Type": "application/json",
        "auth-token":
        localStorage.getItem('token')
      },
    });
    const json = response.json();
    console.log(json)
    const newNotes = notes.filter((note) => {
      return note._id !== id;
    });
    setNotes(newNotes);
  };
  //edit a Note
  const editNote = async (id, title, description, tag) => {
    //API Call
    const response = await fetch(`${host}/api/notes/updatenote/${id}`, {
      method: "PUT",
      headers: {
        "content-Type": "application/json",
        "auth-token":
        localStorage.getItem('token')
      },
      body: JSON.stringify({ title, description, tag }),
    });
    const json = await response.json();
    console.log(json)
    console.log(json)
    let newNotes =JSON.parse(JSON.stringify(notes))
    //Logic to edit in client
    for (let index = 0; index < newNotes.length; index++) {
      const element = newNotes[index];
      if (element._id === id) {
        newNotes[index].title = title;
        newNotes[index].description = description;
        newNotes[index].tag = tag;
        break;
      }
     
    }
    setNotes(newNotes);
  };

  return (
    <NoteContext.Provider
      value={{ notes, addNote, setNotes, deleteNote, getNotes,editNote }}
    >
      {props.children}
    </NoteContext.Provider>
  );
};

export default NoteState;
