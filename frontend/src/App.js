// src/App.js

import React, { useState, useEffect } from "react";
import "./App.css";
import { Routes, Route } from "react-router-dom";
import Navbar from "./Navbar";
import NotesList from "./NotesList";
import EditNote from "./EditNote";
import { addNote } from "./service";

function App() {
  const [note, setNote] = useState({
    title: "",
    text: "",
    priority: "Low",
    dueDate: "",
  });

  // ✅ Load theme from localStorage or default to dark
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem("theme");
    return savedTheme === "light" ? false : true; // default to dark
  });

  // ✅ Sync theme changes to localStorage
  useEffect(() => {
    localStorage.setItem("theme", isDarkMode ? "dark" : "light");
  }, [isDarkMode]);

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

  const handleSaveNote = async () => {
    if (!note.title || !note.text || !note.dueDate) return;

    const newNote = {
      ...note,
      id: new Date().toISOString(),
      createdAt: new Date(),
    };

    await addNote(newNote);
    setNote({
      title: "",
      text: "",
      priority: "Low",
      dueDate: "",
    });

    alert("Note created");
  };

  const toggleDarkMode = () => {
    setIsDarkMode((prevMode) => !prevMode);
  };

  return (
    <div className={`App ${isDarkMode ? "dark" : ""}`}>
      <Navbar isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />
      <Routes>
        <Route
          path="/"
          element={
            <div className="main-container">
              <div className="form-container">
                <h2>Write Notes</h2>
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
                  style={{ width: "98%" }}
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
                <button onClick={handleSaveNote}>Add Note</button>
              </div>
            </div>
          }
        />
        <Route path="/notes" element={<NotesList isDarkMode={isDarkMode} />} />
        <Route path="/edit/:id" element={<EditNote />} />
      </Routes>
    </div>
  );
}

export default App;
