// src/NotesList.js
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getNotes, deleteNote } from "./service"; // Make sure deleteNote calls backend API
import { jsPDF } from "jspdf";

function NotesList({ isDarkMode }) {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch notes from backend on component mount
  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const fetchedNotes = await getNotes();
        setNotes(fetchedNotes || []);
      } catch (error) {
        console.error("Error fetching notes:", error);
      } finally {
        setLoading(false); 
      }
    };

    fetchNotes();
  }, []);

  const handleDownloadPDF = (note) => {
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text("Note Details", 14, 20);

    doc.setFontSize(12);
    doc.text(`Title: ${note.title}`, 14, 35);
    doc.text(`Priority: ${note.priority}`, 14, 45);
    doc.text(
      `Due Date: ${new Date(note.dueDate).toLocaleDateString("en-GB")}`,
      14,
      55
    );

    const splitText = doc.splitTextToSize(`Text: ${note.text}`, 180);
    doc.text(splitText, 14, 65);

    doc.save(`${note.title || "note"}.pdf`);
  };

  // Delete note handler
  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this note?"
    );
    if (!confirmed) return;

    try {
      await deleteNote(id); // Delete note from backend (MongoDB)
      // After deletion, fetch updated notes list
      const updatedNotes = await getNotes();
      setNotes(updatedNotes);
    } catch (error) {
      alert("Failed to delete the note. Try again.");
      console.error("Delete error:", error);
    }
  };

  if (loading) {
    return <h1>Loading notes...</h1>;
  }

  if (!notes || notes.length === 0) {
    return <h1>No notes available. Add a new note!</h1>;
  }

  return (
    <div className={`notes-list-container ${isDarkMode ? "dark" : ""}`}>
      <h2>Notes List</h2>
      <ul className="notes-list">
        {notes.map((note) => (
          <li key={note.id} className="note-card">
            <div className="note-header">
              <h3>{note.title}</h3>
              <span className={`priority ${note.priority.toLowerCase()}`}>
                {note.priority}
              </span>
            </div>
            <p style={{ overflow: "hidden" }}>{note.text}</p>
            <p>Due: {new Date(note.dueDate).toLocaleDateString("en-GB")}</p>
            <div className="note-actions">
              <Link to={`/edit/${note._id}`}>
                <button>Edit</button>
              </Link>
              <button onClick={() => handleDownloadPDF(note)}>
                Download PDF
              </button>

              <button
                style={{ backgroundColor: "red" }}
                onClick={() => handleDelete(note._id)}
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default NotesList;
