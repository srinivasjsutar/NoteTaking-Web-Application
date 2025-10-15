import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getNotes, updateNote } from "./service";

function EditNote() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [note, setNote] = useState({
    title: "",
    text: "",
    priority: "Low",
    dueDate: "",
  });

  useEffect(() => {
    const fetchNote = async () => {
      const notes = await getNotes(); // await here
      const currentNote = notes.find((note) => note._id === id);
      if (currentNote) {
        setNote(currentNote);
      } else {
        navigate("/notes");
      }
    };

    fetchNote();
  }, [id, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNote((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const startVoiceToText = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Your browser doesn't support Speech Recognition.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.continuous = false;

    recognition.start();

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setNote((prev) => ({
        ...prev,
        text: prev.text ? prev.text + " " + transcript : transcript,
      }));
    };

    recognition.onerror = (event) => {
      alert("Speech recognition error: " + event.error);
    };
  };

  const handleUpdateNote = async () => {
    if (!note.title || !note.text || !note.dueDate) return;

    // Wait for notes array before updating
    const notes = await getNotes();
    const updatedNotes = notes.map((n) =>
      n._id === id ? { ...n, ...note } : n
    );

    // Assuming you want to update backend/localStorage here.
    // For now, update localStorage for backward compatibility:
    // localStorage.setItem("notes", JSON.stringify(updatedNotes));
    await updateNote(id, {
      dueDate: note.dueDate,
      priority: note.priority,
      text: note.text,
      title: note.title,
    });

    alert("Note updated!");
    navigate("/notes");
  };

  return (
    <div className="edit-note-container">
      <h2>Edit Note</h2>
      <input
        type="text"
        name="title"
        value={note.title}
        onChange={handleChange}
        placeholder="Note Title"
        required
      />
      <div style={{ position: "relative" }}>
        <textarea
          name="text"
          value={note.text}
          onChange={handleChange}
          placeholder="Speak or type your note"
          required
          rows={5}
          style={{ width: "100%", paddingRight: "40px" }}
        />
        <button
          type="button"
          onClick={startVoiceToText}
          style={{
            position: "absolute",
            top: "5px",
            right: "5px",
            padding: "5px",
            borderRadius: "50%",
            cursor: "pointer",
          }}
          title="Speak"
        >
          🎤
        </button>
      </div>
      <select
        name="priority"
        value={note.priority}
        onChange={handleChange}
        required
      >
        <option value="Low">Low Priority</option>
        <option value="Medium">Medium Priority</option>
        <option value="High">High Priority</option>
      </select>
      <input
        type="date"
        name="dueDate"
        value={note.dueDate}
        onChange={handleChange}
        required
      />
      <button onClick={handleUpdateNote}>Update Note</button>
    </div>
  );
}

export default EditNote;
